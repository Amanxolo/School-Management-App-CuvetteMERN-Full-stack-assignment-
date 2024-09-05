const mongoose = require('mongoose');

const financeSchema = new mongoose.Schema({
    month: { type: Number, required: true },  // 1-12 representing the month
    year: { type: Number, required: true },
    teacherSalaries: { type: Number, required: true },  // Total salaries paid
    studentFees: { type: Number, required: true },  // Total fees collected
});

const Finance = mongoose.model('Finance', financeSchema);
module.exports = Finance;
