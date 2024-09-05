// models/Class.js
const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
    className: { type: String, required: true },
    year: { type: Number, required: true },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' },
    fees: { type: Number, required: true },
    students: [
        {
            name: { type: String, required: true },
            gender: { type: String, required: true },
            dob: { type: Date, required: true },
            contact: { type: String, required: true },
            feesPaid: { type: Number, required: true }
        }
    ]
});

const Class = mongoose.model('Class', classSchema);
module.exports = Class;
