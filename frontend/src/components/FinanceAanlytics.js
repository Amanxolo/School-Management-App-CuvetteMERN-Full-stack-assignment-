import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FinanceAnalytics = () => {
    const [finances, setFinances] = useState([]);
    const [formData, setFormData] = useState({
        month: '',
        year: '',
        teacherSalaries: '',
        studentFees: ''
    });
    const [view, setView] = useState('monthly'); // State to toggle between monthly and yearly views
    const [selectedMonth, setSelectedMonth] = useState(''); // State for selected month
    const [selectedYear, setSelectedYear] = useState('');   // State for selected year

    // Function to fetch finance data based on selected month and year
    const fetchFinances = async () => {
        try {
            let url = 'http://localhost:3001/finance';

            // Pass month and year in the query string to the backend
            if (selectedMonth && selectedYear) {
                url += `?month=${selectedMonth}&year=${selectedYear}`;
            } else if (selectedYear) {
                url += `?year=${selectedYear}`;
            }

            const response = await axios.get(url);
            if (Array.isArray(response.data)) {
                setFinances(response.data);
            } else {
                console.error('Unexpected response format:', response.data);
            }
        } catch (error) {
            console.error('Error fetching finances:', error);
        }
    };

    // Handle month selection change
    const handleMonthChange = (e) => {
        setSelectedMonth(e.target.value);
    };

    // Handle year selection change
    const handleYearChange = (e) => {
        setSelectedYear(e.target.value);
    };

    // Handle the addition of new finance records
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:3001/finance', formData);
            fetchFinances(); // Refresh the finance records
            setFormData({ month: '', year: '', teacherSalaries: '', studentFees: '' });
        } catch (error) {
            console.error('Error adding finance record:', error);
        }
    };

    // Handle finance record deletion
    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:3001/finance/${id}`);
            fetchFinances(); // Refresh the finance records
        } catch (error) {
            console.error('Error deleting finance record:', error);
        }
    };

    // Handle finance record update
    const handleUpdate = async (id) => {
        try {
            await axios.put(`http://localhost:3001/finance/${id}`, formData);
            fetchFinances(); // Refresh the finance records
            setFormData({ month: '', year: '', teacherSalaries: '', studentFees: '' });
        } catch (error) {
            console.error('Error updating finance record:', error);
        }
    };

    // Calculate total teacher salaries and student fees
    const calculateAnalytics = () => {
        let totalSalaries = 0;
        let totalFees = 0;
        finances.forEach(record => {
            totalSalaries += record.teacherSalaries || 0;
            totalFees += record.studentFees || 0;
        });
        return {
            totalSalaries,
            totalFees
        };
    };

    const { totalSalaries, totalFees } = calculateAnalytics();

    return (
        <div>
            <h1>Finance Management</h1>
            
            {/* Dropdown for Month and Year Selection */}
            <div>
                <label>Select Month:</label>
                <select value={selectedMonth} onChange={handleMonthChange}>
                    <option value="">-- Select Month --</option>
                    <option value="1">January</option>
                    <option value="2">February</option>
                    <option value="3">March</option>
                    <option value="4">April</option>
                    <option value="5">May</option>
                    <option value="6">June</option>
                    <option value="7">July</option>
                    <option value="8">August</option>
                    <option value="9">September</option>
                    <option value="10">October</option>
                    <option value="11">November</option>
                    <option value="12">December</option>
                </select>

                <label>Select Year:</label>
                <select value={selectedYear} onChange={handleYearChange}>
                    <option value="">-- Select Year --</option>
                    <option value="2021">2021</option>
                    <option value="2022">2022</option>
                    <option value="2023">2023</option>
                    <option value="2024">2024</option>
                </select>

                <button onClick={fetchFinances}>Fetch Finances</button>
            </div>

            {/* Finance Records Table */}
            <h2>Finance Records</h2>
            <table>
                <thead>
                    <tr>
                        <th>Month</th>
                        <th>Year</th>
                        <th>Teacher Salaries</th>
                        <th>Student Fees</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {finances.map((finance) => (
                        <tr key={finance._id}>
                            <td>{finance.month || 'N/A'}</td>
                            <td>{finance.year}</td>
                            <td>${finance.teacherSalaries}</td>
                            <td>${finance.studentFees}</td>
                            <td>
                                <button onClick={() => handleDelete(finance._id)}>Delete</button>
                                <button onClick={() => handleUpdate(finance._id)}>Update</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Analytics Section */}
            <div>
                <h2>Analytics</h2>
                <h3>{view === 'monthly' ? 'Monthly' : 'Yearly'} Analytics</h3>
                <p>Total Teacher Salaries: ${totalSalaries}</p>
                <p>Total Student Fees: ${totalFees}</p>
            </div>
        </div>
    );
};

export default FinanceAnalytics;
