const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
    name: { type: String, required: true },
    gender: { type: String, required: true },
    DOB: { type: Date, required: true },
    contact: { type: String, required: true },
    salary: { type: Number, required: true },
    assignedClass: { type: String, required: true }
});

const Teacher = mongoose.model('Teacher', teacherSchema);

module.exports = Teacher;
