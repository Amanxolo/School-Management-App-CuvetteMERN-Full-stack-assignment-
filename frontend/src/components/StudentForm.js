import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StudentForm = () => {
    const [students, setStudents] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        gender: '',
        dob: '',
        contact: '',
        feesPaid: '',
        class: ''
    });
    const [isEditing, setIsEditing] = useState(false);
    const [currentStudentId, setCurrentStudentId] = useState(null);

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const response = await axios.get('http://localhost:3001/students');
            setStudents(response.data);
        } catch (error) {
            console.error('Error fetching students:', error);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await axios.put(`http://localhost:3001/students/${currentStudentId}`, formData);
                setIsEditing(false);
                setCurrentStudentId(null);
            } else {
                await axios.post('http://localhost:3001/students', formData);
            }
            fetchStudents();
            setFormData({
                name: '',
                gender: '',
                dob: '',
                contact: '',
                feesPaid: '',
                class: ''
            });
        } catch (error) {
            console.error(`Error ${isEditing ? 'updating' : 'creating'} student:`, error);
        }
    };

    const handleEdit = (student) => {
        setFormData({
            name: student.name,
            gender: student.gender,
            dob: student.dob,
            contact: student.contact,
            feesPaid: student.feesPaid,
            class: student.class
        });
        setCurrentStudentId(student._id);
        setIsEditing(true);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:3001/students/${id}`);
            fetchStudents();
        } catch (error) {
            console.error('Error deleting student:', error);
        }
    };

    return (
        <div>
            <h2>Manage Students</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="gender"
                    placeholder="Gender"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                />
                <input
                    type="date"
                    name="dob"
                    placeholder="Date of Birth"
                    value={formData.dob}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="contact"
                    placeholder="Contact"
                    value={formData.contact}
                    onChange={handleChange}
                    required
                />
                <input
                    type="number"
                    name="feesPaid"
                    placeholder="Fees Paid"
                    value={formData.feesPaid}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="class"
                    placeholder="Class"
                    value={formData.class}
                    onChange={handleChange}
                    required
                />
                <button type="submit">{isEditing ? 'Update' : 'Add'} Student</button>
            </form>

            <h3>Student List</h3>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Gender</th>
                        <th>Date of Birth</th>
                        <th>Contact</th>
                        <th>Fees Paid</th>
                        <th>Class</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {students.map((student) => (
                        <tr key={student._id}>
                            <td>{student.name}</td>
                            <td>{student.gender}</td>
                            <td>{new Date(student.dob).toLocaleDateString()}</td>
                            <td>{student.contact}</td>
                            <td>${student.feesPaid}</td>
                            <td>{student.class}</td>
                            <td>
                                <button onClick={() => handleEdit(student)}>Edit</button>
                                <button onClick={() => handleDelete(student._id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default StudentForm;
