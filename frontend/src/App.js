import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PoseDetection from './components/Pose';
import DashboardView from './components/Dashboard';
import Login from './components/Login'

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/posedetection" element={<PoseDetection />} />
                <Route path="/home" element={<DashboardView />} />
                <Route path="/login" element={<Login />} />

            </Routes>
        </Router>
    );
}

export default App;
