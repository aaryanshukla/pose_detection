import React, { useEffect, useRef } from 'react';
import '@tensorflow/tfjs-backend-webgl';
import {
  PoseLandmarker,
  FilesetResolver,
  DrawingUtils
} from 'https://cdn.skypack.dev/@mediapipe/tasks-vision@0.10.0';

function PoseDetection() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  let poseLandmarker;

  useEffect(() => {
    let webcamRunning = false;

    async function initializePoseLandmarker() {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm'
        );
        poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: `https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task`,
            delegate: 'GPU',
          },
          runningMode: 'VIDEO',
          numPoses: 1,
        });
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
          webcamRunning = true;
          startPoseDetection();
        };
      } catch (error) {
        console.error('Error accessing webcam:', error);
      }
    }

    async function startPoseDetection() {
      const canvas = canvasRef.current;
      const canvasCtx = canvas.getContext('2d');
      const videoElement = videoRef.current;

      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;

      async function detectPose() {
        if (webcamRunning) {
          const now = performance.now();
          const results = await poseLandmarker.detectForVideo(videoElement, now);

          canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

          if (results.landmarks && results.landmarks.length > 0) {
            const drawingUtils = new DrawingUtils(canvasCtx);
            for (const landmarks of results.landmarks) {
              drawingUtils.drawLandmarks(landmarks, {
                radius: (data) => DrawingUtils.lerp(data.from.z, -0.15, 0.1, 5, 1),
              });
              drawingUtils.drawConnectors(
                landmarks,
                PoseLandmarker.POSE_CONNECTIONS
              );
            }
          }

          requestAnimationFrame(detectPose);
        }
      }

      detectPose();
    }

    initializePoseLandmarker();
    enableWebcam();

    return () => {
      if (poseLandmarker) poseLandmarker.close();
      webcamRunning = false;
    };
  }, []);

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
