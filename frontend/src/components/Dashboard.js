import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import PoseDetection from './Pose';
import '@tensorflow/tfjs-backend-webgl';
import {
  PoseLandmarker,
  FilesetResolver,
  DrawingUtils
} from 'https://cdn.skypack.dev/@mediapipe/tasks-vision@0.10.0';



function Dashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true); 
  const [livePoseNotes, setLivePoseNotes] = useState(null);
  const navigate = useNavigate();

  async function handleDashboard() {
    const token = localStorage.getItem('token'); 

    try {
      if (!token) {
        throw new Error("No token found. Please log in again.");
      }

      const response = await fetch("http://localhost:5000/dashboard", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch dashboard data.");
      }

      const data = await response.json();
      setData(data); 
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setError(error.message); 
      navigate("/login"); 
    } finally {
      setIsLoading(false); 
    }
  }

  const handlePoseNotesUpdate = (poseNotes) => {
    console.log("Live Pose Notes in Dashboard:", poseNotes);
    setLivePoseNotes(poseNotes);
  }

  useEffect(() => {
      handleDashboard();
  }, []);

  return (
      <div>
          <h1>Dashboard</h1>
          <PoseDetection onPoseNotesUpdate={handlePoseNotesUpdate} />
          {livePoseNotes && (
              <div>
                  <h2>Live Pose Notes:</h2>
                  <ul>
                      {livePoseNotes.alerts.map((alert, index) => (
                          <li key={index}>{alert}</li>
                      ))}
                  </ul>
                  <p>{livePoseNotes.isGoodPosture}</p>
              </div>
          )}
      </div>
  );
}

export default Dashboard;
