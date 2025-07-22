import cloudinary from "../lib/cloudinary.js";
import bcrypt from "bcryptjs";
import { generateTokens, setCookies } from "../helpers/authentication.js";
import User from "../models/userModel.js";

export const SignUp = async (req, res) => {
  try {
    const { username, password, email, profilePicture, role } = req.body;

    if (!username || !password || !email || !role) {
      return res.status(400).json({ message: "Fadlan buuxi dhammaan meelaha looga baahan yahay" });
    }

    const existingUser = await User.findOne({ email }).select("-password");

    if (existingUser) {
      return res.status(400).json({ message: "Isticmaale horey ayuu u diiwaangashanaa" });
    }

    let cloudinaryResponse = null;

    if (profilePicture) {
      const uploadResponse = await cloudinary.uploader.upload(profilePicture);
      cloudinaryResponse = uploadResponse.secure_url;
    }

    const newUser = new User({
      username,
      password,
      email,
      role,
      profilePicture: cloudinaryResponse?.secure_url ? cloudinaryResponse?.secure_url : "lama keenin sawir",
    });

    const { accessToken } = generateTokens(newUser._id);
    setCookies(res, accessToken);
    newUser.accessToken = accessToken;

    await newUser.save();

    res.status(201).json({ message: "Isticmaalaha si guul leh ayaa loo abuuray", newUser });
  } catch (error) {
    console.error("Error in SignUp function: ", error);
    res.status(500).json({ message: error.message });
  }
};

export const SignIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Fadlan geli iimaylka iyo furaha sirta ah" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Xogta lama helin - Iimaylka ama furaha sirta ah waa qalad" });
    }

    const comparePassword = await bcrypt.compare(password, user.password);

    if (!comparePassword) {
      return res.status(400).json({ message: "Xogta lama helin - Iimaylka ama furaha sirta ah waa qalad" });
    }

    const { accessToken } = generateTokens(user._id);
    setCookies(res, accessToken);

    const userData = {
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      profilePicture: user.profilePicture,
    };

    res.status(200).json({ message: "Si guul leh ayaad u gashay", user: userData });
  } catch (error) {
    console.error("message happening in sign in function ", error);
    res.status(500).json({ message: error.message });
  }
};

export const WhoAmI = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "Oggolaansho la'aan - Isticmaale lama helin" });
    }

    const userData = {
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture,
      _id: user._id,
    };

    res.status(200).json({ message: "Isticmaale si guul leh ayaa loo helay", user: userData });
  } catch (error) {
    console.error("Error in WhoAmI function: ", error);
    res.status(500).json({ message: error.message });
  }
};

export const LogOut = async (req, res) => {
  try {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });

    res.status(200).json({ message: "Waad ka baxday si guul leh" });
  } catch (error) {
    console.error("Error in LogOut function: ", error);
    res.status(500).json({ message: error.message });
  }
};
export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: "Fadlan geli passwordki hore iyo kan cusub" });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "Isticmaalaha lama helin" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Passwordkii hore waa khalad" });
    }

    // Directly assign newPassword (plain text)
    user.password = newPassword;

    // This triggers your mongoose pre('save') hook which hashes and validates password
    await user.save();

    res.status(200).json({ message: "Erayga sirta ah si guul leh ayaa loo beddelay" });

  } catch (error) {
    console.error("Error in ChangePassword function:", error);
    res.status(500).json({ message: error.message });
  }
};

