import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { useParams } from 'react-router-dom';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const ClassAnalytics = () => {
    const { id: classId } = useParams(); // Get class ID from URL parameters
    const [classData, setClassData] = useState(null);
    const [studentGenderData, setStudentGenderData] = useState(null);
    const [feesData, setFeesData] = useState(null);

    useEffect(() => {
        fetchClassData();
    }, [classId]); // Dependency on classId to refetch if it changes

    const fetchClassData = async () => {
        console.log('Fetching data for class ID:', classId);

        try {
            // Fetch class details along with the associated students
            const response = await axios.get(`http://localhost:3001/class/${classId}`);
            console.log('Class data received:', response.data);
            setClassData(response.data);

            // Ensure classData contains students before processing
            if (response.data && response.data.students) {
                calculateStudentGender(response.data.students);
                calculateFeesData(response.data.students);
            }

        } catch (error) {
            console.error('Error fetching class data:', error);
            console.log('Error details:', error.response ? error.response.data : 'No response data');
        }
    };

    const calculateStudentGender = (students) => {
        let maleCount = 0;
        let femaleCount = 0;

        students.forEach(student => {
            if (student.gender === 'Male') {
                maleCount++;
            } else if (student.gender === 'Female') {
                femaleCount++;
            }
        });

        setStudentGenderData({
            labels: ['Male', 'Female'],
            datasets: [
                {
                    label: 'Number of Students',
                    data: [maleCount, femaleCount],
                    backgroundColor: ['#36A2EB', '#FF6384']
                }
            ]
        });
    };

    const calculateFeesData = (students) => {
        const studentNames = students.map(student => student.name);
        const feesPaid = students.map(student => student.feesPaid);

        setFeesData({
            labels: studentNames,
            datasets: [
                {
                    label: 'Fees Paid by Students',
                    data: feesPaid,
                    backgroundColor: 'rgba(75,192,192,0.6)'
                }
            ]
        });
    };

    return (
        <div>
            {classData ? (
                <>
                    <h2>Class Analytics: {classData.className}</h2>
                    <p><strong>Year:</strong> {classData.year}</p>
                    <p><strong>Teacher:</strong> {classData.teacher ? classData.teacher.name : 'N/A'}</p>
                    <p><strong>Class Fees:</strong> ${classData.fees}</p>
                    <h3>Students List</h3>
                    <ul>
                        {classData.students && classData.students.length > 0 ? (
                            classData.students.map((student, index) => (
                                <li key={index}>
                                    {student.name} (ID: {student._id})
                                </li>
                            ))
                        ) : (
                            <li>No students found</li>
                        )}
                    </ul>

                    <h3>Gender Distribution</h3>
                    {studentGenderData ? (
                        <div style={{ width: '500px', height: '300px' }}>
                            <Bar data={studentGenderData} />
                        </div>
                    ) : (
                        <p>Loading gender distribution data...</p>
                    )}

                    <h3>Fees Paid by Students</h3>
                    {feesData ? (
                        <div style={{ width: '500px', height: '300px' }}>
                            <Bar data={feesData} />
                        </div>
                    ) : (
                        <p>Loading fees data...</p>
                    )}
                </>
            ) : (
                <p>Loading class details...</p>
            )}
        </div>
    );
};

export default ClassAnalytics;
