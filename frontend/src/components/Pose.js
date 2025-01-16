import React, { useEffect, useRef, useState } from 'react';
import { jwtDecode } from "jwt-decode";
import '@tensorflow/tfjs-backend-webgl';
import {
  PoseLandmarker,
  FilesetResolver,
  DrawingUtils
} from 'https://cdn.skypack.dev/@mediapipe/tasks-vision@0.10.0';

function PoseDetection() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const poseLandmarkerRef = useRef(null);
  const [poseLandmarkerReady, setPoseLandmarkerReady] = useState(false); // Track readiness
  const webcamRunning = useRef(false);

  const POSE_LANDMARKS = [
    "nose",
    "left_eye_inner",
    "left_eye",
    "left_eye_outer",
    "right_eye_inner",
    "right_eye",
    "right_eye_outer",
    "left_ear",
    "right_ear",
    "left_shoulder",
    "right_shoulder",
    "left_elbow",
    "right_elbow",
    "left_wrist",
    "right_wrist",
    "left_pinky",
    "right_pinky",
    "left_index",
    "right_index",
    "left_thumb",
    "right_thumb",
    "left_hip",
    "right_hip",
    "left_knee",
    "right_knee",
    "left_ankle",
    "right_ankle",
    "left_heel",
    "right_heel",
    "left_foot_index",
    "right_foot_index"
  ];

  useEffect(() => {
    async function initializePoseLandmarker() {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm'
        );
        poseLandmarkerRef.current = await PoseLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: `https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task`,
            delegate: 'GPU',
          },
          runningMode: 'VIDEO',
          numPoses: 1,
        });
        setPoseLandmarkerReady(true);
        console.log('PoseLandmarker initialized');
      } catch (error) {
        console.error('Error initializing PoseLandmarker:', error);
      }
    }

    async function enableWebcam() {
      const constraints = {
        video: { width: 640, height: 480 },
      };

      try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        const videoElement = videoRef.current;
        videoElement.srcObject = stream;

        videoElement.onloadeddata = () => {
          webcamRunning.current = true;
          startPoseDetection();
        };
      } catch (error) {
        console.error('Error accessing webcam:', error);
      }
    }

    initializePoseLandmarker();
    enableWebcam();

    async function startPoseDetection() {
      if (!poseLandmarkerReady) {
        console.warn('PoseLandmarker not ready.');
        return;
      }

      const canvas = canvasRef.current;
      const canvasCtx = canvas.getContext('2d');
      const videoElement = videoRef.current;

      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;

      async function detectPose() {
        if (!webcamRunning.current) return;

        const now = performance.now();
        try {
          const results = await poseLandmarkerRef.current.detectForVideo(videoElement, now);

          const poseResults = logLandmarks(results);

          const poseNotes = analyzePosture(results);

          saveResults(poseResults, poseNotes);

          canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

          if (results.landmarks && results.landmarks.length > 0) {
            const drawingUtils = new DrawingUtils(canvasCtx);

            for (const landmarks of results.landmarks) {
              drawingUtils.drawLandmarks(landmarks, {
                radius: (data) => DrawingUtils.lerp(data.from.z, -0.15, 0.5, 5, 1),
              });
              drawingUtils.drawConnectors(
                landmarks,
                PoseLandmarker.POSE_CONNECTIONS,
                { color: 'white', lineWidth: 3 }
              );
            }
          }
        } catch (error) {
          console.error('Error during pose detection:', error);
        }

        requestAnimationFrame(detectPose);
      }

      detectPose();
    }

    return () => {
      if (poseLandmarkerRef.current) poseLandmarkerRef.current.close();
      webcamRunning.current = false;
    };
  }, [poseLandmarkerReady]);

  function logLandmarks(results) {
    if (results.landmarks && results.landmarks.length > 0) {
      const landmarks = results.landmarks[0];
      console.log("Detected Landmarks:");
      landmarks.forEach((landmark, index) => {
        const landmarkName = POSE_LANDMARKS[index];
        const { x, y, z } = landmark;
        console.log(`${landmarkName}: (${x.toFixed(2)}, ${y.toFixed(2)}, ${z.toFixed(2)})`);
      });
      return landmarks; 
    }
    return null;
  }

  function analyzePosture(results) {
    if (!results.landmarks || results.landmarks.length === 0) {
      return { alerts: ["No landmarks detected"], isGoodPosture: false };
    }

    const landmarks = results.landmarks[0];
    const feedback = [];
    const leftShoulder = landmarks[11];
    const rightShoulder = landmarks[12];
    const leftHip = landmarks[23];
    const rightHip = landmarks[24];
    const verticalThreshold = 0.1;

    const shoulderVerticalDiff = Math.abs(leftShoulder.y - rightShoulder.y);
    if (shoulderVerticalDiff > verticalThreshold) {
      feedback.push("Shoulders are not aligned.");
    }

    const isGoodPosture = feedback.length === 0;
    if (isGoodPosture) feedback.push("Good posture!");
    return { alerts: feedback, isGoodPosture };
  }

  async function saveResults(poseResults, poseNotes) {
    
    try {

      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found. Please log in.");
        return;
    }

    const decodedToken = jwtDecode(token); 
    const userId = decodedToken.userId; 
    console.log("Extracted userId:", userId);
      const response = await fetch("http://localhost:5000/posedetection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ poseResults, poseNotes, userId }),
      });

      
      if (!response.ok) {
        console.error("Error saving pose data:", await response.json());
      } else {
        console.log("Pose data saved successfully.");
      }
    } catch (error) {
      console.error("Error saving pose data:", error);
    }
  }

  return (
    <div style={{ position: 'relative', width: '640px', height: '480px' }}>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }}
      />
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}

export default PoseDetection;
