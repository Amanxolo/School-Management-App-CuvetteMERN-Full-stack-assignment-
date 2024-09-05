import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Classform = ({ currentClass, onUpdate }) => {
    const [formData, setFormData] = useState({
        className: '',
        year: '',
        teacher: '',
        fees: '',
        students: [{ name: '', gender: '', dob: '', contact: '', feesPaid: '' }]
    });

    const [classList, setClassList] = useState([]);

    useEffect(() => {
        if (currentClass) {
            setFormData(currentClass);
        }
        fetchClasses();
    }, [currentClass]);

    const fetchClasses = async () => {
        try {
            const response = await axios.get('http://localhost:3001/class');
            setClassList(response.data);
        } catch (error) {
            console.error('Error fetching class list:', error);
        }
    };

    const handleChange = (e, index) => {
        const { name, value } = e.target;
        if (['name', 'gender', 'dob', 'contact', 'feesPaid'].includes(name)) {
            const newStudents = formData.students.map((student, i) => {
                if (i === index) {
                    return { ...student, [name]: value };
                }
                return student;
            });
            setFormData({ ...formData, students: newStudents });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const addStudent = () => {
        setFormData({
            ...formData,
            students: [...formData.students, { name: '', gender: '', dob: '', contact: '', feesPaid: '' }]
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (currentClass) {
                await axios.put(`http://localhost:3001/class/${currentClass._id}`, formData);
                alert('Class updated successfully');
            } else {
                await axios.post('http://localhost:3001/class', formData);
                alert('Class added successfully');
            }
            fetchClasses(); // Refresh class list after adding/updating
            onUpdate(); // Callback to refresh any other data if needed
        } catch (error) {
            console.error('There was an error!', error);
        }
    };

    const handleEdit = (classData) => {
        setFormData(classData);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:3001/class/${id}`);
            alert('Class deleted successfully');
            fetchClasses(); // Refresh class list after deletion
        } catch (error) {
            console.error('Error deleting class:', error);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Class Name</label>
                    <input
                        type="text"
                        name="className"
                        value={formData.className}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Year</label>
                    <input
                        type="number"
                        name="year"
                        value={formData.year}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Teacher</label>
                    <input
                        type="text"
                        name="teacher"
                        value={formData.teacher}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Fees</label>
                    <input
                        type="number"
                        name="fees"
                        value={formData.fees}
                        onChange={handleChange}
                        required
                    />
                </div>
                {formData.students.map((student, index) => (
                    <div key={index}>
                        <label>Student Name</label>
                        <input
                            type="text"
                            name="name"
                            value={student.name}
                            onChange={(e) => handleChange(e, index)}
                            required
                        />
                        <label>Gender</label>
                        <input
                            type="text"
                            name="gender"
                            value={student.gender}
                            onChange={(e) => handleChange(e, index)}
                            required
                        />
                        <label>Date of Birth</label>
                        <input
                            type="date"
                            name="dob"
                            value={student.dob}
                            onChange={(e) => handleChange(e, index)}
                            required
                        />
                        <label>Contact</label>
                        <input
                            type="text"
                            name="contact"
                            value={student.contact}
                            onChange={(e) => handleChange(e, index)}
                            required
                        />
                        <label>Fees Paid</label>
                        <input
                            type="number"
                            name="feesPaid"
                            value={student.feesPaid}
                            onChange={(e) => handleChange(e, index)}
                            required
                        />
                    </div>
                ))}
                <button type="button" onClick={addStudent}>Add Student</button>
                <button type="submit">{currentClass ? 'Update Class' : 'Add Class'}</button>
            </form>

            <h3>Class List</h3>
            <table>
                <thead>
                    <tr>
                        <th>Class Name</th>
                        <th>Year</th>
                        <th>Teacher</th>
                        <th>Fees</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {classList.map((classItem) => (
                        <tr key={classItem._id}>
                            <td>{classItem.className}</td>
                            <td>{classItem.year}</td>
                            <td>{classItem.teacher}</td>
                            <td>${classItem.fees}</td>
                            <td>
                                <button onClick={() => handleEdit(classItem)}>Edit</button>
                                <button onClick={() => handleDelete(classItem._id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Classform;
