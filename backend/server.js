const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const Class = require('./models/Class');
const Teacher = require('./models/Teacher');
const Student = require('./models/Student');
const Finance = require('./models/Finance');  


const app = express();

app.use(bodyParser.json());
app.use(cors({
    origin: 'http://localhost:3000' // Allow requests from the React frontend
}));
mongoose.connect('mongodb://127.0.0.1:27017/School', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// CRUD operations for Class
// Get all classes
app.get('/class', async (req, res) => {
    try {
        const classes = await Class.find(); // Fetch all classes from the database
        res.json(classes); // Send the list of classes back to the client
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


app.post('/class', async (req, res) => {
    try {
        const { className, year, teacher, fees, students } = req.body;

        // Create the class
        const newClass = new Class({
            className,
            year,
            teacher,
            fees,
            students
        });

        // Save the class
        await newClass.save();

        // Add students to Student collection
        for (const student of students) {
            const newStudent = new Student({
                name: student.name,
                gender: student.gender,
                dob: student.dob,
                contact: student.contact,
                feesPaid: student.feesPaid,
                class: newClass.className // reference to the class
            });
            await newStudent.save();
        }

        res.status(201).json(newClass);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// PUT /class/:id
app.put('/class/:id', async (req, res) => {
    try {
        const { className, year, teacher, fees, students } = req.body;

        const updatedClass = await Class.findByIdAndUpdate(req.params.id, {
            className,
            year,
            teacher,
            fees,
            students
        }, { new: true });

        // Update students in Student collection
        await Student.deleteMany({ class: req.params.id });

        for (const student of students) {
            const newStudent = new Student({
                name: student.name,
                gender: student.gender,
                dob: student.dob,
                contact: student.contact,
                feesPaid: student.feesPaid,
                class: updatedClass._id
            });
            await newStudent.save();
        }

        res.json(updatedClass);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.get('/class/:id', async (req, res) => {
    try {
        const classId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(classId)) {
            return res.status(400).json({ message: 'Invalid class ID format' });
        }
        const classData = await Class.findById(classId).populate('teacher').populate('students');
        if (!classData) {
            return res.status(404).json({ message: 'Class not found' });
        }
        res.json(classData);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});



app.delete('/class/:id', async (req, res) => {
    try {
        const deletedClass = await Class.findByIdAndDelete(req.params.id);
        res.json({ message: 'Class deleted' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// CRUD operations for Teacher
app.get('/teachers', async (req, res) => {
    try {
        const classes = await Teacher.find(); // Fetch all classes from the database
        res.json(classes); // Send the list of classes back to the client
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/teachers', async (req, res) => {
    const newTeacher = new Teacher(req.body);
    try {
        const savedTeacher = await newTeacher.save();
        res.status(201).json(savedTeacher);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

app.get('/teachers/:id', async (req, res) => {
    try {
        const foundTeacher = await Teacher.findById(req.params.id);
        if (!foundTeacher) return res.status(404).json({ message: 'Teacher not found' });
        res.json(foundTeacher);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

app.put('/teachers/:id', async (req, res) => {
    try {
        const updatedTeacher = await Teacher.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedTeacher);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

app.delete('/teachers/:id', async (req, res) => {
    try {
        const deletedTeacher = await Teacher.findByIdAndDelete(req.params.id);
        res.json({ message: 'Teacher deleted' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// CRUD operations for Student
app.get('/students', async (req, res) => {
    try {
        const classes = await Student.find(); // Fetch all classes from the database
        res.json(classes); // Send the list of classes back to the client
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

app.post('/students', async (req, res) => {
    try {
        const student = new Student(req.body);
        await student.save();

        // Find the class and update it with the student's details
        await Class.findOneAndUpdate(
            { className: req.body.class }, // Assuming class names are unique
            { $push: { students: student } }
        );

        res.status(201).json(student);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.get('/students/:id', async (req, res) => {
    try {
        const foundStudent = await Student.findById(req.params.id);
        if (!foundStudent) return res.status(404).json({ message: 'Student not found' });
        res.json(foundStudent);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

app.put('/students/:id', async (req, res) => {
    try {
        const updatedStudent = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedStudent);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

app.delete('/students/:id', async (req, res) => {
    try {
        const deletedStudent = await Student.findByIdAndDelete(req.params.id);
        res.json({ message: 'Student deleted' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Create a new finance record
app.post('/finance', async (req, res) => {
    try {
        const financeRecord = new Finance(req.body);
        await financeRecord.save();
        res.status(201).send(financeRecord);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Get finance records based on month and year or just year
app.get('/finance', async (req, res) => {
    try {
        const { month, year } = req.query;

        let query = {};

        if (month && year) {
            query = { month: parseInt(month), year: parseInt(year) };
        }
        else if (year) {
            query = { year: parseInt(year) };
        }

        const financeRecords = await Finance.find(query);

        res.status(200).json(financeRecords);
    } catch (error) {
        console.error('Error fetching finance records:', error);
        res.status(500).json({ message: 'Error fetching finance records', error });
    }
});
// Update a finance record by ID
app.put('/finance/:id', async (req, res) => {
    try {
        const financeRecord = await Finance.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(financeRecord);
    } catch (error) {
        res.status(400).json(error);
    }
});

// Delete a finance record by ID
app.delete('/finance/:id', async (req, res) => {
    try {
        await Finance.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Record deleted' });
    } catch (error) {
        res.status(400).json(error);
    }
});




const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
