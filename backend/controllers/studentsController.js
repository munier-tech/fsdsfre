import { Student, Class, Health } from "../models/index.js";
import { Op } from 'sequelize';

// 1. Abuur Arday
export const createStudent = async (req, res) => {
  try {
    const { fullname, age, gender, classId, motherNumber, fatherNumber } = req.body;

    if (!fullname || !motherNumber || !fatherNumber) {
      return res.status(400).json({ message: "Fadlan buuxi dhammaan meelaha looga baahan yahay" });
    }

    if (age && age < 0) {
      return res.status(400).json({ message: "Da'da waa khaldan tahay" });
    }

    const existedFullname = await Student.findOne({ where: { fullname } });
    if (existedFullname) {
      return res.status(400).json({ message: "Arday magacan leh hore ayuu u diiwaangashanaa" });
    }

    const student = await Student.create({
      fullname,
      age,
      gender,
      classId: classId || null,
      motherNumber,
      fatherNumber
    });

    res.status(201).json({ message: "Arday si guul leh ayaa loo abuuray", student });
  } catch (error) {
    console.error("Error in createStudent:", error);
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ message: error.errors[0].message });
    }
    res.status(500).json({ message: error.message });
  }
};

// 2. Hel Dhammaan Ardayda
export const getAllStudents = async (req, res) => {
  try {
    const students = await Student.findAll({
      include: [
        {
          model: Class,
          as: 'class'
        },
        {
          model: Health,
          as: 'healthRecords'
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.status(200).json({ students });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3. Hel Arday ID
export const getStudentById = async (req, res) => {
  try {
    const { studentId } = req.params;
    const student = await Student.findByPk(studentId, {
      include: [
        {
          model: Class,
          as: 'class'
        },
        {
          model: Health,
          as: 'healthRecords'
        }
      ]
    });

    if (!student) return res.status(404).json({ message: "Arday lama helin" });

    res.status(200).json({ students: student });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 4. Cusboonaysii Arday
export const updateStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { fullname, age, gender, classId, motherNumber, fatherNumber } = req.body;

    const [updatedCount, [updatedStudent]] = await Student.update(
      { fullname, age, gender, classId, motherNumber, fatherNumber },
      { 
        where: { id: studentId },
        returning: true
      }
    );

    if (updatedCount === 0) return res.status(404).json({ message: "Arday lama helin" });

    res.status(200).json({ message: "Macluumaadka ardayga waa la cusboonaysiiyay", student: updatedStudent });
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ message: error.errors[0].message });
    }
    res.status(500).json({ message: error.message });
  }
};

// 5. Tirtir Arday
export const deleteStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    const deletedCount = await Student.destroy({ where: { id: studentId } });

    if (deletedCount === 0) return res.status(404).json({ message: "Arday lama helin" });

    res.status(200).json({ message: "Ardayga si guul leh ayaa loo tirtiray" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 6. U Qoondee Fasal Ardayga
export const assignStudentToClass = async (req, res) => {
  try {
    const { studentId, classId } = req.params;

    // Check if class exists
    const classExists = await Class.findByPk(classId);
    if (!classExists) {
      return res.status(404).json({ message: "Fasalka lama helin" });
    }

    const [updatedCount] = await Student.update(
      { classId },
      { where: { id: studentId } }
    );

    if (updatedCount === 0) return res.status(404).json({ message: "Arday lama helin" });

    res.status(200).json({ message: "Ardayga fasalka ayaa loo qoondayay" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 7. Ka saar Fasal Ardayga
export const removeStudentFromClass = async (req, res) => {
  try {
    const { studentId } = req.params;

    const [updatedCount] = await Student.update(
      { classId: null },
      { where: { id: studentId } }
    );

    if (updatedCount === 0) return res.status(404).json({ message: "Arday lama helin" });

    res.status(200).json({ message: "Ardayga fasalka ayaa laga saaray" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 8. Raadi Arday magaca
export const searchStudentsByName = async (req, res) => {
  try {
    const { name } = req.query;
    if (!name) {
      return res.status(400).json({ message: "Magaca ardayga geli" });
    }

    const students = await Student.findAll({
      where: {
        fullname: {
          [Op.iLike]: `%${name}%`
        }
      },
      include: [
        {
          model: Class,
          as: 'class'
        }
      ],
      order: [['fullname', 'ASC']]
    });

    res.status(200).json({ students });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 9. Hel Ardayda Fasalka
export const getStudentsByClass = async (req, res) => {
  try {
    const { classId } = req.params;

    const students = await Student.findAll({
      where: { classId },
      include: [
        {
          model: Class,
          as: 'class'
        }
      ],
      order: [['fullname', 'ASC']]
    });

    res.status(200).json({ students });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 10. Cusboonaysii Lacagta Ardayga
export const updateStudentFees = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { feeTotal, feePaid } = req.body;

    if (feeTotal < 0 || feePaid < 0) {
      return res.status(400).json({ message: "Lacagtu ma noqon karto tiro xun" });
    }

    const [updatedCount, [updatedStudent]] = await Student.update(
      { feeTotal, feePaid },
      { 
        where: { id: studentId },
        returning: true
      }
    );

    if (updatedCount === 0) return res.status(404).json({ message: "Arday lama helin" });

    res.status(200).json({ 
      message: "Lacagta ardayga waa la cusboonaysiiyay", 
      student: updatedStudent 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
