import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ClassList = () => {
    const [classes, setClasses] = useState([]);

    useEffect(() => {
        fetchClasses();
    }, []);

    const fetchClasses = async () => {
        try {
            const response = await axios.get('http://localhost:3001/class');
            setClasses(response.data);
        } catch (error) {
            console.error('Error fetching classes:', error);
        }
    };

    return (
        <div>
            <h2>Class Management</h2>
            <table className="class-table">
                <thead>
                    <tr>
                        <th>Class Name</th>
                        <th>Year</th>
                        <th>Teacher</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {classes.map((classItem) => (
                        <tr key={classItem._id}>
                            <td>{classItem.className}</td>
                            <td>{classItem.year}</td>
                            <td>{classItem.teacher}</td>
                            <td>
                                <Link to={`/class-analytics/${classItem._id}`} className="view-link">
                                    View Details
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ClassList;
