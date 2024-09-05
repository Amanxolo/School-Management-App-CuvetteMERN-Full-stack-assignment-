// TeacherForm.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TeacherForm = () => {
    const [teachers, setTeachers] = useState([]);
    const [teacherData, setTeacherData] = useState({
        name: '',
        gender: '',
        DOB: '',
        contact: '',
        salary: '',
        assignedClass: ''
    });
    const [editing, setEditing] = useState(false);
    const [currentTeacherId, setCurrentTeacherId] = useState(null);

    const fetchTeachers = async () => {
        try {
            const response = await axios.get('http://localhost:3001/teachers');
            setTeachers(response.data);
        } catch (error) {
            console.error('Error fetching teachers:', error);
        }
    };

    useEffect(() => {
        fetchTeachers();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTeacherData({ ...teacherData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editing) {
                await axios.put(`http://localhost:3001/teachers/${currentTeacherId}`, teacherData);
                setEditing(false);
            } else {
                await axios.post('http://localhost:3001/teachers', teacherData);
            }
            fetchTeachers();
            setTeacherData({
                name: '',
                gender: '',
                DOB: '',
                contact: '',
                salary: '',
                assignedClass: ''
            });
        } catch (error) {
            console.error('Error saving teacher:', error);
        }
    };

    const handleEdit = (teacher) => {
        setEditing(true);
        setCurrentTeacherId(teacher._id);
        setTeacherData({
            name: teacher.name,
            gender: teacher.gender,
            DOB: teacher.DOB,
            contact: teacher.contact,
            salary: teacher.salary,
            assignedClass: teacher.assignedClass
        });
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:3001/teachers/${id}`);
            fetchTeachers();
        } catch (error) {
            console.error('Error deleting teacher:', error);
        }
    };

    return (
        <div>
            <h2>{editing ? 'Edit Teacher' : 'Add Teacher'}</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="name" placeholder="Name" value={teacherData.name} onChange={handleInputChange} required />
                <input type="text" name="gender" placeholder="Gender" value={teacherData.gender} onChange={handleInputChange} required />
                <input type="date" name="DOB" placeholder="Date of Birth" value={teacherData.DOB} onChange={handleInputChange} required />
                <input type="text" name="contact" placeholder="Contact" value={teacherData.contact} onChange={handleInputChange} required />
                <input type="number" name="salary" placeholder="Salary" value={teacherData.salary} onChange={handleInputChange} required />
                <input type="text" name="assignedClass" placeholder="Assigned Class" value={teacherData.assignedClass} onChange={handleInputChange} required />
                <button type="submit">{editing ? 'Update Teacher' : 'Add Teacher'}</button>
            </form>

            <h2>Teacher List</h2>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Gender</th>
                        <th>DOB</th>
                        <th>Contact</th>
                        <th>Salary</th>
                        <th>Assigned Class</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {teachers.map(teacher => (
                        <tr key={teacher._id}>
                            <td>{teacher.name}</td>
                            <td>{teacher.gender}</td>
                            <td>{new Date(teacher.DOB).toLocaleDateString()}</td>
                            <td>{teacher.contact}</td>
                            <td>{teacher.salary}</td>
                            <td>{teacher.assignedClass}</td>
                            <td>
                                <button onClick={() => handleEdit(teacher)}>Edit</button>
                                <button onClick={() => handleDelete(teacher._id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TeacherForm;
