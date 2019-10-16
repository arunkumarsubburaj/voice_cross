var socket = new WebSocket('ws://localhost:3000');
var audio;
socket.onopen = function () {
    alert('new connection established...');
};


window.AudioContext = window.AudioContext || window.webkitAudioContext;
let audioContext, scriptProcessor, myStream, mediaRecorder;
let stream = null;
getMedia();
async function getMedia() {
    let constraints = {
        audio: {
            mandatory: {
                googEchoCancellation: 'false',
                googAutoGainControl: 'false',
                googNoiseSuppression: 'false',
                googHighpassFilter: 'false',
            },
        },
    };
    try {
        await navigator.mediaDevices.getUserMedia(constraints).then((curStream) => {
            mediaRecorder = new MediaRecorder(curStream);
            let audioChunks = [];

            mediaRecorder.addEventListener("dataavailable", event => {
                audioChunks.push(event.data);
            });

            mediaRecorder.addEventListener("stop", async function () {
                const audioBlob = new Blob(audioChunks);
                let arrayBuffer = await new Response(audioBlob).arrayBuffer();
                var int16Array = new Int16Array(arrayBuffer, 0, Math.floor(arrayBuffer.byteLength / 2));
                if (socket && socket.readyState === socket.OPEN) {
                    console.log('inside socket');
                    socket.send(int16Array);
                }
                var audioUrl = URL.createObjectURL(audioBlob);
                audio = new Audio(audioUrl);
                // audio.play();
                audioChunks = [];
            });
        });
        /* use the stream */
    } catch (err) {
        /* handle the error */
        console.log(err);
    }
}
function playRecording() {
    if (audio) {
        audio.play();
    } else {
        alert('There is nothing to play. Please record something first.');
    }
}
function startRecording() {
    if (mediaRecorder)
        mediaRecorder.start();
}

function stopRecording() {
    if (mediaRecorder)
        mediaRecorder.stop();
}

