import { Attendance, AttendanceRecord, Class, Student } from "../models/index.js";
import { Op } from 'sequelize';

// ✅ Abuur fasal cusub
export const createClass = async (req, res) => {
  try {
    const { name, level } = req.body;

    if (!name || !level) {
      return res.status(400).json({ message: "Fadlan geli magaca fasalka iyo heerka" });
    }

    const existing = await Class.findOne({ where: { name } });
    if (existing) {
      return res.status(409).json({ message: "Fasalka hore ayuu u diiwaangashanaa" });
    }

    const newClass = await Class.create({ name, level });

    res.status(201).json({ message: "Fasal si guul leh ayaa loo abuuray", classData: newClass });
  } catch (error) {
    console.error("createClass error:", error);
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ message: error.errors[0].message });
    }
    res.status(500).json({ message: error.message });
  }
};

// ✅ Soo hel dhammaan fasalada
export const getAllClasses = async (req, res) => {
  try {
    const classes = await Class.findAll({
      include: [
        {
          model: Student,
          as: 'students'
        },
        {
          model: Attendance,
          as: 'attendances'
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.status(200).json({ classes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Soo hel fasal ID-ga
export const getClassById = async (req, res) => {
  try {
    const { classId } = req.params;
    const classData = await Class.findByPk(classId, {
      include: [
        {
          model: Student,
          as: 'students'
        }
      ]
    });

    if (!classData) {
      return res.status(404).json({ message: "Fasalka lama helin" });
    }

    res.status(200).json({ classData });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Cusbooneysii fasal
export const updateClass = async (req, res) => {
  try {
    const { classId } = req.params;
    const { name, level } = req.body;

    const [updatedCount, [updated]] = await Class.update(
      { name, level },
      { 
        where: { id: classId },
        returning: true
      }
    );

    if (updatedCount === 0) {
      return res.status(404).json({ message: "Fasalka lama helin" });
    }

    res.status(200).json({ message: "Fasalka si guul leh ayaa loo cusbooneysiiyay", classData: updated });
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ message: error.errors[0].message });
    }
    res.status(500).json({ message: error.message });
  }
};

// ✅ Tirtir fasal
export const deleteClass = async (req, res) => {
  try {
    const { classId } = req.params;

    const deletedCount = await Class.destroy({ where: { id: classId } });
    if (deletedCount === 0) {
      return res.status(404).json({ message: "Fasalka lama helin" });
    }

    res.status(200).json({ message: "Fasalka si guul leh ayaa loo tirtiray" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ U qoondee arday fasal
export const assignStudentToClass = async (req, res) => {
  const { classId, studentId } = req.params;

  try {
    const foundClass = await Class.findByPk(classId);
    const student = await Student.findByPk(studentId);

    if (!foundClass || !student) {
      return res.status(404).json({ message: "Fasalka ama ardayga lama helin" });
    }

    // Check if student is already in this class
    if (student.classId === parseInt(classId)) {
      return res.status(400).json({ message: "Ardayga horey ayaa fasalka loogu daray" });
    }

    // Update student's class
    await student.update({ classId });

    res.status(200).json({ message: "Ardayga si guul leh ayaa fasalka loogu daray" });
  } catch (error) {
    console.error("Error assigning student:", error);
    res.status(500).json({ message: error.message });
  }
};

// ✅ Ka saar arday fasal
export const removeStudentFromClass = async (req, res) => {
  const { classId, studentId } = req.params;

  try {
    const student = await Student.findByPk(studentId);

    if (!student) {
      return res.status(404).json({ message: "Ardayga lama helin" });
    }

    if (student.classId !== parseInt(classId)) {
      return res.status(400).json({ message: "Ardayga fasalka ma joogo" });
    }

    await student.update({ classId: null });

    res.status(200).json({ message: "Ardayga si guul leh ayaa fasalka looga saaray" });
  } catch (error) {
    console.error("Error removing student:", error);
    res.status(500).json({ message: error.message });
  }
};

// ✅ Hel ardayda fasalka
export const getClassStudents = async (req, res) => {
  try {
    const { classId } = req.params;

    const students = await Student.findAll({
      where: { classId },
      order: [['fullname', 'ASC']]
    });

    res.status(200).json({ students });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Raadi fasalo magaca
export const searchClassesByName = async (req, res) => {
  try {
    const { name } = req.query;
    
    if (!name) {
      return res.status(400).json({ message: "Magaca fasalka geli" });
    }

    const classes = await Class.findAll({
      where: {
        name: {
          [Op.iLike]: `%${name}%`
        }
      },
      include: [
        {
          model: Student,
          as: 'students'
        }
      ],
      order: [['name', 'ASC']]
    });

    res.status(200).json({ classes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Hel tirada ardayda fasalka
export const getClassStatistics = async (req, res) => {
  try {
    const { classId } = req.params;

    const classData = await Class.findByPk(classId, {
      include: [
        {
          model: Student,
          as: 'students'
        }
      ]
    });

    if (!classData) {
      return res.status(404).json({ message: "Fasalka lama helin" });
    }

    const totalStudents = classData.students.length;
    const maleStudents = classData.students.filter(s => s.gender === 'male').length;
    const femaleStudents = classData.students.filter(s => s.gender === 'female').length;

    res.status(200).json({
      statistics: {
        className: classData.name,
        level: classData.level,
        totalStudents,
        maleStudents,
        femaleStudents
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
