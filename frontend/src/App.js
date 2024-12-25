import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PoseDetection from './components/Pose';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/posedetection" element={<PoseDetection />} />
            </Routes>
        </Router>
        //testing
    );
}

export default App;
