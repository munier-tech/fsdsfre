import Teachers from "../models/teachersModel.js";
import cloudinary from "../lib/cloudinary.js";

// 1. Abuur Macallin Cusub
export const createTeacher = async (req, res) => {
  try {
    const { name, number, email, profilePicture, subject, certificate } = req.body;

    if (!name || !number || !email || !subject) {
      return res.status(400).json({ message: "Fadlan buuxi dhammaan meelaha loo baahan yahay" });
    }

    const existingTeacher = await Teachers.findOne({ email });
    if (existingTeacher) {
      return res.status(400).json({ message: "Macallin email-kan hore ayaa loo diiwaangaliyay" });
    }

    let cloudinaryResponse = null;
    if (profilePicture) {
      const uploadResponse = await cloudinary.uploader.upload(profilePicture);
      cloudinaryResponse = uploadResponse.secure_url;
    }

    const teacher = new Teachers({
      name,
      number,
      email,
      profilePicture: cloudinaryResponse?.secure_url ? cloudinaryResponse?.secure_url : "no profile picture",
      certificate: certificate || "no certificate",
      subject
    });

    await teacher.save();
    res.status(201).json({ message: "Macallinka si guul leh ayaa loo abuuray", teacher });

  } catch (error) {
    console.error("Error in createTeacher function: ", error);
    res.status(500).json({ message: error.message });
  }
};


// 2. Hel Dhammaan Macallimiinta
export const getAllTeachers = async (req, res) => {
  try {
    const teacher = await Teachers.find({}).sort({ createdAt: -1 });
    res.status(200).json({ message: "Macallimiinta si guul leh ayaa loo helay", teachers: teacher });
  } catch (error) {
    console.error("Error in getAllTeachers function: ", error);
    res.status(500).json({ message: error.message });
  }
};


// 3. Hel Macallin Hal Qof ah (ID)
export const getTeacherById = async (req, res) => {
  try {
    const { teacherId } = req.params;
    const teacher = await Teachers.findById(teacherId);

    if (!teacher) {
      return res.status(404).json({ message: "Macallin lama helin" });
    }

    res.status(200).json({ message: "Macallinka si guul leh ayaa loo helay", teacher });
  } catch (error) {
    console.error("Error in getTeacherById function: ", error);
    res.status(500).json({ message: error.message });
  }
};


// 4. Cusboonaysii Macallin
export const updateTeacher = async (req, res) => {
  try {
    const { teacherId } = req.params;
    const { name, number, email, profilePicture, subject } = req.body;

    let cloudinaryResponse = null;
    if (profilePicture) {
      const uploadResponse = await cloudinary.uploader.upload(profilePicture);
      cloudinaryResponse = uploadResponse.secure_url;
    }

    const teacher = await Teachers.findByIdAndUpdate(
      teacherId,
      {
        name,
        number,
        email,
        profilePicture: cloudinaryResponse?.secure_url ? cloudinaryResponse?.secure_url : "no profile picture",
        subject
      },
      { new: true }
    );

    if (!teacher) {
      return res.status(404).json({ message: "Macallin lama helin" });
    }

    res.status(200).json({ message: "Macallinka si guul leh ayaa loo cusboonaysiiyay", teacher });
  } catch (error) {
    console.error("Error in updateTeacher function: ", error);
    res.status(500).json({ message: error.message });
  }
};


// 5. Tirtir Macallin
export const deleteTeacher = async (req, res) => {
  try {
    const { teacherId } = req.params;
    const teacher = await Teachers.findByIdAndDelete(teacherId);

    if (!teacher) {
      return res.status(404).json({ message: "Macallin lama helin" });
    }

    // Tirtir sawirka haddii uu jiro
    if (teacher.profilePicture && teacher.profilePicture !== "no profile picture") {
      const publicId = teacher.profilePicture.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(publicId);
    }

    res.status(200).json({ message: "Macallinka si guul leh ayaa loo tirtiray" });
  } catch (error) {
    console.error("Error in deleteTeacher function: ", error);
    res.status(500).json({ message: error.message });
  }
};
