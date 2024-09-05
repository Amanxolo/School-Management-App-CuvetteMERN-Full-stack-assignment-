// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Classform from './components/Classform';
import ClassList from './components/ClassList';
import TeacherForm from './components/TeacherForm';
import StudentForm from './components/StudentForm';
import ClassAnalytics from './components/ClassAnalytics';
import StudentAnalytics from './components/StudentAnalytics';  // Import the new component
import FinanceAnalytics from './components/FinanceAanlytics';
import './App.css';

function App() {
    return (
        <Router>
            <div className="App">
                <nav className="navbar">
                    <div className="navbar-brand">School Management</div>
                    <div className="navbar-links">
                        <Link to="/create-class">Create Class</Link>
                        <Link to="/classes">View Classes</Link>
                        <Link to="/create-teacher">Create Teacher</Link>
                        <Link to="/teachers">View Teachers</Link>
                        <Link to="/create-student">Create Student</Link>
                        <Link to="/students">View Students</Link>
                        <Link to="/student-analytics">Student Analytics</Link>  {/* Add this link */}
                    </div>
                </nav>

                <div className="content">
                    <Routes>
                        <Route path="/create-class" element={<Classform />} />
                        <Route path="/classes" element={<ClassList />} />
                        <Route path="/create-teacher" element={<TeacherForm />} />
                        <Route path="/teachers" element={<TeacherForm />} />
                        <Route path="/create-student" element={<StudentForm />} />
                        <Route path="/students" element={<StudentForm />} />
                        <Route path="/class-analytics/:id" element={<ClassAnalytics />} /> {/* New route for class analytics */}
                        <Route path="/student-analytics" element={<StudentAnalytics />} />  {/* Add this route */}
                        <Route path="/finance-analytics" element={<FinanceAnalytics />} />

                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;
