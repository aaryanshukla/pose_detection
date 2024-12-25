import React, { useEffect, useRef } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as poseDetection from '@tensorflow-models/pose-detection';
import '@tensorflow/tfjs-backend-webgl';

function PoseDetection() {
    const videoRef = useRef(null);

    useEffect(() => {
        let detector;
        let lastTime = 0;
        const interval = 100;

        async function init() {
            try {
                await tf.setBackend('webgl');
                await tf.ready();

                console.log('Using backend:', tf.getBackend()); 

                const videoElement = videoRef.current;
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { width: 640, height: 480 },
                });
                videoElement.srcObject = stream;

                const model = poseDetection.SupportedModels.MoveNet;
                const detectorConfig = { modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING };
                detector = await poseDetection.createDetector(model, detectorConfig);
            } catch (error) {
                console.error('Error initializing webcam or detector:', error);
            }
        }

        async function detectPose() {
            const now = performance.now();
            if (now - lastTime > interval && detector) {
                const videoElement = videoRef.current;
                try {
                    const poses = await detector.estimatePoses(videoElement);
                    if (poses && poses.length > 0) {
                        const keypoints = poses[0].keypoints;

                        const nose = keypoints[0];
                        const leftShoulder = keypoints[5];
                        const rightShoulder = keypoints[6];
                        const leftHip = keypoints[11];
                        const rightHip = keypoints[12];

                        const verticalDiffLeft = leftShoulder.y - leftHip.y;
                        const verticalDiffRight = rightShoulder.y - rightHip.y;
                        const horizontalDiffLeft = leftShoulder.x - leftHip.x;
                        const horizontalDiffRight = rightShoulder.x - rightHip.x;

                        if (verticalDiffLeft < 8 || verticalDiffRight < 8) {
                            console.log('Raise your shoulders');
                        }

                        if (horizontalDiffLeft < 8 || horizontalDiffRight < 8) {
                            console.log('Sit straight');
                        }

                        console.log(
                            'Keypoints summary:',
                            keypoints.map((k) => `${k.name}: (${k.x}, ${k.y}, ${k.score})`)
                        );
                    }
                } catch (error) {
                    console.error('Error detecting pose:', error);
                }

                lastTime = now;
            }

            requestAnimationFrame(detectPose);
        }

        videoRef.current.onloadeddata = () => detectPose();

        init();

        return () => {
            if (detector) detector.dispose();
        };
    }, []);

    return (
        <div>
            <video ref={videoRef} autoPlay playsInline width="640" height="480" />
        </div>
    );
}

export default PoseDetection;
