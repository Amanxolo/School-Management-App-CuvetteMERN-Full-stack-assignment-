import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';

const StudentAnalytics = () => {
    const [students, setStudents] = useState([]);
    const [genderData, setGenderData] = useState(null);
    const [classData, setClassData] = useState(null);

    useEffect(() => {
        fetchStudentData();
    }, []);

    const fetchStudentData = async () => {
        try {
            const response = await axios.get('http://localhost:3001/students');
            setStudents(response.data);
            calculateAnalytics(response.data);
        } catch (error) {
            console.error('Error fetching student data:', error);
        }
    };

    const calculateAnalytics = (students) => {
        let maleCount = 0;
        let femaleCount = 0;
        const classCounts = {};

        students.forEach(student => {
            // Count gender distribution
            if (student.gender === 'Male') {
                maleCount++;
            } else if (student.gender === 'Female') {
                femaleCount++;
            }

            // Count students per class
            if (classCounts[student.class]) {
                classCounts[student.class]++;
            } else {
                classCounts[student.class] = 1;
            }
        });

        // Set gender data for the bar chart
        setGenderData({
            labels: ['Male', 'Female'],
            datasets: [
                {
                    label: 'Number of Students',
                    data: [maleCount, femaleCount],
                    backgroundColor: ['#36A2EB', '#FF6384']
                }
            ]
        });

        // Set class data for the bar chart
        setClassData({
            labels: Object.keys(classCounts),
            datasets: [
                {
                    label: 'Number of Students per Class',
                    data: Object.values(classCounts),
                    backgroundColor: '#FFCE56'
                }
            ]
        });
    };

    return (
        <div>
            <h2>Student Analytics</h2>
            {students.length > 0 ? (
                <>
                    <h3>Student List</h3>
                    <ul>
                        {students.map((student) => (
                            <li key={student._id}>
                                {student.name} (ID: {student._id}, Class: {student.class})
                            </li>
                        ))}
                    </ul>

                    <h3>Gender Distribution</h3>
                    {genderData && (
                        <div style={{ width: '500px', height: '300px' }}>
                            <Bar data={genderData} />
                        </div>
                    )}

                    <h3>Class Distribution</h3>
                    {classData && (
                        <div style={{ width: '500px', height: '300px' }}>
                            <Bar data={classData} />
                        </div>
                    )}
                </>
            ) : (
                <p>Loading student details...</p>
            )}
        </div>
    );
};

export default StudentAnalytics;
