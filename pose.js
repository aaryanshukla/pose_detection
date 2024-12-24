const webcamVideo = document.getElementById("webcamVideo");

navigator.mediaDevices.getUserMedia({
    video: { width: 640, height: 480 } 
}).then((stream) => {
    webcamVideo.srcObject = stream;
}).catch((error) => {
    console.error(error);
});

async function init() {
    const model = poseDetection.SupportedModels.MoveNet;
    const detectorConfig = { modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING };
    const detector = await poseDetection.createDetector(model, detectorConfig);

    let lastTime = 0;
    const interval = 100; 

    async function detectPose() {
        const now = performance.now();
        if (now - lastTime > interval) {
            const poses = await detector.estimatePoses(webcamVideo);
            
            if (poses && poses.length > 0) {
                const keypoints = poses[0].keypoints;

                // const nose = keypoints[0]


                // const left_shoulder = keypoints[5];

                // const right_shoulder = keypoints[6];

                // const left_hip = keypoints[11];

                // const right_hip = keypoints[12];

                // vertical_difference_left = left_shoulder.y - left_hip.y;
                // vertical_difference_right = right_shoulder.y - right_hip.y;


                // horizontal_difference_left = left_shoulder.x - left_hip.x;
                // horizontal_difference_right = right_shoulder.x - right_hip.x;




                // if (vertical_difference_left < 8 || vertical_difference_right < 8) {
                //     console.log("Raise your shoulders");
                //     throw new Error("Error message");
                // }
                
                // if (horizontal_difference_left < 8 || horizontal_difference_right < 8) {
                //     console.log("Sit straight");
                //     throw new Error("Error message");
                // }
                


                console.log("Keypoints summary:", keypoints.map(k => `${k.name}: (${k.x}, ${k.y}, ${k.score}`));
            }

            lastTime = now;
        }

        requestAnimationFrame(detectPose);
    }


    webcamVideo.onloadeddata = () => {
        detectPose(); 

    }
}

init();

