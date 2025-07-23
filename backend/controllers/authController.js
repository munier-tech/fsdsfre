import cloudinary from "../lib/cloudinary.js";
import bcrypt from "bcryptjs";
import { generateTokens, setCookies } from "../helpers/authentication.js";
import { User } from "../models/index.js";

export const SignUp = async (req, res) => {
  try {
    const { username, password, email, profilePicture, role } = req.body;

    if (!username || !password || !email || !role) {
      return res.status(400).json({ message: "Fadlan buuxi dhammaan meelaha looga baahan yahay" });
    }

    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return res.status(400).json({ message: "Isticmaale horey ayuu u diiwaangashanaa" });
    }

    let cloudinaryResponse = null;

    if (profilePicture) {
      const uploadResponse = await cloudinary.uploader.upload(profilePicture);
      cloudinaryResponse = uploadResponse.secure_url;
    }

    const newUser = await User.create({
      username,
      password,
      email,
      role,
      profilePicture: cloudinaryResponse || "lama keenin sawir",
    });

    const { accessToken } = generateTokens(newUser.id);
    setCookies(res, accessToken);

    // Remove password from response
    const userResponse = {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
      profilePicture: newUser.profilePicture,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt
    };

    res.status(201).json({ message: "Isticmaalaha si guul leh ayaa loo abuuray", newUser: userResponse });
  } catch (error) {
    console.error("Error in SignUp function: ", error);
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ message: error.errors[0].message });
    }
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: "Isticmaale magacan leh hore ayuu u diiwaangashanaa" });
    }
    res.status(500).json({ message: error.message });
  }
};

export const SignIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Fadlan geli iimaylka iyo furaha sirta ah" });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(400).json({ message: "Xogta lama helin - Iimaylka ama furaha sirta ah waa qalad" });
    }

    const comparePassword = await user.comparePassword(password);

    if (!comparePassword) {
      return res.status(400).json({ message: "Xogta lama helin - Iimaylka ama furaha sirta ah waa qalad" });
    }

    const { accessToken } = generateTokens(user.id);
    setCookies(res, accessToken);

    const userData = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      profilePicture: user.profilePicture,
    };

    res.status(200).json({ message: "Si guul leh ayaad u gashay", user: userData });
  } catch (error) {
    console.error("Error in SignIn function: ", error);
    res.status(500).json({ message: error.message });
  }
};

export const SignOut = async (req, res) => {
  try {
    res.clearCookie("accessToken");
    res.status(200).json({ message: "Si guul leh ayaad uga baxday" });
  } catch (error) {
    console.error("Error in SignOut function: ", error);
    res.status(500).json({ message: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(404).json({ message: "Isticmaalaha lama helin" });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error("Error in getProfile function: ", error);
    res.status(500).json({ message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { username, email, profilePicture } = req.body;
    const userId = req.user.id;

    let cloudinaryResponse = null;

    if (profilePicture && profilePicture !== "lama keenin sawir") {
      const uploadResponse = await cloudinary.uploader.upload(profilePicture);
      cloudinaryResponse = uploadResponse.secure_url;
    }

    const updateData = {};
    if (username) updateData.username = username;
    if (email) updateData.email = email;
    if (cloudinaryResponse) updateData.profilePicture = cloudinaryResponse;

    const [updatedCount, [updatedUser]] = await User.update(
      updateData,
      { 
        where: { id: userId },
        returning: true,
        attributes: { exclude: ['password'] }
      }
    );

    if (updatedCount === 0) {
      return res.status(404).json({ message: "Isticmaalaha lama helin" });
    }

    res.status(200).json({ 
      message: "Macluumaadka isticmaalaha waa la cusboonaysiiyay", 
      user: updatedUser 
    });
  } catch (error) {
    console.error("Error in updateProfile function: ", error);
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ message: error.errors[0].message });
    }
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: "Iimaylka horey ayaa loo isticmaalay" });
    }
    res.status(500).json({ message: error.message });
  }
};

