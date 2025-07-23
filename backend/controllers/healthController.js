import { Health, Student } from "../models/index.js";
import { Op } from 'sequelize';

export const addHealthRecord = async (req, res) => {
  try {
    const { studentId, date, condition, treated, note } = req.body;

    if (!studentId || !condition || treated === undefined) {
      return res.status(400).json({ message: "Fadlan buuxi dhammaan meelaha banan" });
    }

    // Check if the student exists
    const existingStudent = await Student.findByPk(studentId);
    if (!existingStudent) {
      return res.status(404).json({ message: "Ardayga lama helin" });
    }

    const healthRecord = await Health.create({
      studentId,
      date: date ? new Date(date) : new Date(),
      condition,
      treated,
      note: note || ""
    });

    // Include student data in response
    const healthRecordWithStudent = await Health.findByPk(healthRecord.id, {
      include: [{
        model: Student,
        as: 'student'
      }]
    });

    return res.status(201).json({ 
      message: "Diiwaanka caafimaadka si guul leh ayaa loo abuuray", 
      healthRecord: healthRecordWithStudent 
    });
    
  } catch (error) {
    console.error("Error creating Health record:", error);
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ message: error.errors[0].message });
    }
    return res.status(500).json({ message: "Error creating Health record" });
  }
};

export const getStudentHealthRecords = async (req, res) => {
  const { studentId } = req.params;

  try {
    const student = await Student.findByPk(studentId, {
      include: [{
        model: Health,
        as: 'healthRecords',
        order: [['date', 'DESC']]
      }]
    });

    if (!student) {
      return res.status(404).json({ message: "Ardayga lama helin" });
    }

    res.status(200).json({ studentHealthRecords: student.healthRecords });
  } catch (error) {
    console.error("Error fetching health records:", error);
    res.status(500).json({ message: "Error fetching health records" });
  }
};

export const getAllHealthRecords = async (req, res) => {
  try {
    const healthRecords = await Health.findAll({
      include: [{
        model: Student,
        as: 'student',
        attributes: ['id', 'fullname', 'age', 'gender']
      }],
      order: [['date', 'DESC']]
    });

    res.status(200).json({ healthRecords });
  } catch (error) {
    console.error("Error fetching all health records:", error);
    res.status(500).json({ message: "Error fetching health records" });
  }
};

export const updateHealthRecord = async (req, res) => {
  try {
    const { healthId } = req.params;
    const { condition, treated, note, date } = req.body;

    const updateData = {};
    if (condition) updateData.condition = condition;
    if (treated !== undefined) updateData.treated = treated;
    if (note !== undefined) updateData.note = note;
    if (date) updateData.date = new Date(date);

    const [updatedCount, [updatedRecord]] = await Health.update(
      updateData,
      { 
        where: { id: healthId },
        returning: true,
        include: [{
          model: Student,
          as: 'student'
        }]
      }
    );

    if (updatedCount === 0) {
      return res.status(404).json({ message: "Diiwaanka caafimaadka lama helin" });
    }

    res.status(200).json({ 
      message: "Diiwaanka caafimaadka waa la cusboonaysiiyay", 
      healthRecord: updatedRecord 
    });
  } catch (error) {
    console.error("Error updating health record:", error);
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ message: error.errors[0].message });
    }
    res.status(500).json({ message: "Error updating health record" });
  }
};

export const deleteHealthRecord = async (req, res) => {
  try {
    const { healthId } = req.params;

    const deletedCount = await Health.destroy({ where: { id: healthId } });

    if (deletedCount === 0) {
      return res.status(404).json({ message: "Diiwaanka caafimaadka lama helin" });
    }

    res.status(200).json({ message: "Diiwaanka caafimaadka si guul leh ayaa loo tirtiray" });
  } catch (error) {
    console.error("Error deleting health record:", error);
    res.status(500).json({ message: "Error deleting health record" });
  }
};

export const getHealthRecordsByCondition = async (req, res) => {
  try {
    const { condition } = req.params;

    const healthRecords = await Health.findAll({
      where: {
        condition: {
          [Op.iLike]: `%${condition}%`
        }
      },
      include: [{
        model: Student,
        as: 'student',
        attributes: ['id', 'fullname', 'age', 'gender']
      }],
      order: [['date', 'DESC']]
    });

    res.status(200).json({ healthRecords });
  } catch (error) {
    console.error("Error fetching health records by condition:", error);
    res.status(500).json({ message: "Error fetching health records" });
  }
};

export const getUntreatedHealthRecords = async (req, res) => {
  try {
    const healthRecords = await Health.findAll({
      where: { treated: false },
      include: [{
        model: Student,
        as: 'student',
        attributes: ['id', 'fullname', 'age', 'gender']
      }],
      order: [['date', 'ASC']]
    });

    res.status(200).json({ healthRecords });
  } catch (error) {
    console.error("Error fetching untreated health records:", error);
    res.status(500).json({ message: "Error fetching health records" });
  }
};
