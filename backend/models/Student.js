const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    gender: { type: String, required: true },
    dob: { type: Date, required: true },
    contact: { type: String, required: true },
    feesPaid: { type: Number, required: true },
    class: { type: String, required: true }
});

const Student = mongoose.model('Student', studentSchema);
module.exports = Student;
