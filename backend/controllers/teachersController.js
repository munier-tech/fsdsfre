import { Teacher } from "../models/index.js";
import { Op } from 'sequelize';
import cloudinary from "../lib/cloudinary.js";

// 1. Abuur Macallin Cusub
export const createTeacher = async (req, res) => {
  try {
    const { name, number, email, profilePicture, subject, certificate } = req.body;

    if (!name || !number || !email || !subject) {
      return res.status(400).json({ message: "Fadlan buuxi dhammaan meelaha loo baahan yahay" });
    }

    const existingTeacher = await Teacher.findOne({ where: { email } });
    if (existingTeacher) {
      return res.status(400).json({ message: "Macallin email-kan hore ayaa loo diiwaangaliyay" });
    }

    let cloudinaryResponse = null;
    if (profilePicture) {
      const uploadResponse = await cloudinary.uploader.upload(profilePicture);
      cloudinaryResponse = uploadResponse.secure_url;
    }

    const teacher = await Teacher.create({
      name,
      number,
      email,
      profilePicture: cloudinaryResponse || "no profile picture",
      certificate: certificate || "no certificate",
      subject
    });

    res.status(201).json({ message: "Macallinka si guul leh ayaa loo abuuray", teacher });

  } catch (error) {
    console.error("Error in createTeacher function: ", error);
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ message: error.errors[0].message });
    }
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: "Macallin email-kan hore ayaa loo diiwaangaliyay" });
    }
    res.status(500).json({ message: error.message });
  }
};

// 2. Hel Dhammaan Macallimiinta
export const getAllTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.status(200).json({ message: "Macallimiinta si guul leh ayaa loo helay", teachers });
  } catch (error) {
    console.error("Error in getAllTeachers function: ", error);
    res.status(500).json({ message: error.message });
  }
};

// 3. Hel Macallin ID
export const getTeacherById = async (req, res) => {
  try {
    const { teacherId } = req.params;
    const teacher = await Teacher.findByPk(teacherId);

    if (!teacher) {
      return res.status(404).json({ message: "Macallinka lama helin" });
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
    const { name, number, email, profilePicture, subject, certificate } = req.body;

    let cloudinaryResponse = null;
    if (profilePicture && profilePicture !== "no profile picture") {
      const uploadResponse = await cloudinary.uploader.upload(profilePicture);
      cloudinaryResponse = uploadResponse.secure_url;
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (number) updateData.number = number;
    if (email) updateData.email = email;
    if (subject) updateData.subject = subject;
    if (certificate) updateData.certificate = certificate;
    if (cloudinaryResponse) updateData.profilePicture = cloudinaryResponse;

    const [updatedCount, [updatedTeacher]] = await Teacher.update(
      updateData,
      { 
        where: { id: teacherId },
        returning: true
      }
    );

    if (updatedCount === 0) {
      return res.status(404).json({ message: "Macallinka lama helin" });
    }

    res.status(200).json({ 
      message: "Macallinka si guul leh ayaa loo cusbooneysiiyay", 
      teacher: updatedTeacher 
    });
  } catch (error) {
    console.error("Error in updateTeacher function: ", error);
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ message: error.errors[0].message });
    }
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: "Email-kan horey ayaa loo isticmaalay" });
    }
    res.status(500).json({ message: error.message });
  }
};

// 5. Tirtir Macallin
export const deleteTeacher = async (req, res) => {
  try {
    const { teacherId } = req.params;

    const deletedCount = await Teacher.destroy({ where: { id: teacherId } });

    if (deletedCount === 0) {
      return res.status(404).json({ message: "Macallinka lama helin" });
    }

    res.status(200).json({ message: "Macallinka si guul leh ayaa loo tirtiray" });
  } catch (error) {
    console.error("Error in deleteTeacher function: ", error);
    res.status(500).json({ message: error.message });
  }
};

// 6. Raadi Macallimiinta Magaca
export const searchTeachersByName = async (req, res) => {
  try {
    const { name } = req.query;
    
    if (!name) {
      return res.status(400).json({ message: "Magaca macallinka geli" });
    }

    const teachers = await Teacher.findAll({
      where: {
        name: {
          [Op.iLike]: `%${name}%`
        }
      },
      order: [['name', 'ASC']]
    });

    res.status(200).json({ teachers });
  } catch (error) {
    console.error("Error in searchTeachersByName function: ", error);
    res.status(500).json({ message: error.message });
  }
};

// 7. Hel Macallimiinta Maadada
export const getTeachersBySubject = async (req, res) => {
  try {
    const { subject } = req.params;

    const teachers = await Teacher.findAll({
      where: { subject },
      order: [['name', 'ASC']]
    });

    res.status(200).json({ teachers });
  } catch (error) {
    console.error("Error in getTeachersBySubject function: ", error);
    res.status(500).json({ message: error.message });
  }
};

// 8. Cusboonaysii Xaadiriska Macallinka
export const updateTeacherAttendance = async (req, res) => {
  try {
    const { teacherId } = req.params;
    const { attendance } = req.body;

    if (attendance < 0) {
      return res.status(400).json({ message: "Xaadiriska ma noqon karto tiro xun" });
    }

    const [updatedCount, [updatedTeacher]] = await Teacher.update(
      { attendance },
      { 
        where: { id: teacherId },
        returning: true
      }
    );

    if (updatedCount === 0) {
      return res.status(404).json({ message: "Macallinka lama helin" });
    }

    res.status(200).json({ 
      message: "Xaadiriska macallinka waa la cusboonaysiiyay", 
      teacher: updatedTeacher 
    });
  } catch (error) {
    console.error("Error in updateTeacherAttendance function: ", error);
    res.status(500).json({ message: error.message });
  }
};
