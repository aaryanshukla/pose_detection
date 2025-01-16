import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PoseDetection from './components/Pose';
import Login from './components/Login'
import Signup from './components/Signup'
import Dashboard from './components/Dashboard';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/posedetection" element={<PoseDetection />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/dashboard" element={<Dashboard />} />

            </Routes>
        </Router>
    );
}

export default App;
                                                                                                                                                            