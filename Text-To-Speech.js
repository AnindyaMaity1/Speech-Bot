let audioContext;
let recorder;
let speech = new SpeechSynthesisUtterance();
let isRecording = false;

const listenButton = document.getElementById("listen-button");
const stopButton = document.getElementById("stop-button");
const downloadButton = document.getElementById("download-button");

// Listen button functionality
listenButton.addEventListener("click", () => {
    const text = document.getElementById("text-input").value;

    // Ensure there's text to speak
    if (!text.trim()) {
        alert("Please enter some text to convert to speech.");
        return;
    }

    // Disable buttons during speech
    listenButton.disabled = true;
    stopButton.disabled = false;

    // Initialize the audio context if it doesn't exist
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    // Request access to the microphone and start recording
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            const input = audioContext.createMediaStreamSource(stream);
            recorder = new Recorder(input, { numChannels: 1 });
            
            // Start recording
            recorder.record();
            isRecording = true;

            // Set up and speak the text
            speech.text = text;
            window.speechSynthesis.speak(speech);

            // Stop recording when the speech ends
            speech.onend = () => {
                if (isRecording) {
                    recorder.stop();  // Stop the recorder
                    isRecording = false;

                    // Export the recording as a WAV file
                    recorder.exportWAV(blob => {
                        const url = URL.createObjectURL(blob);
                        downloadButton.href = url;
                        downloadButton.download = 'speech.mp3'; // Set the download filename
                        downloadButton.style.display = 'block'; // Show the download button
                        downloadButton.innerText = 'Download MP3'; // Update button text

                        // Stop the media stream after recording
                        stream.getTracks().forEach(track => track.stop());
                    });

                    // Re-enable the listen button after speech
                    listenButton.disabled = false;
                    stopButton.disabled = true;
                }
            };
        })
        .catch(err => {
            console.error('Error accessing the microphone:', err);
            alert("Microphone access is required to record the audio.");
            listenButton.disabled = false; // Re-enable the listen button if error occurs
        });
});

// Stop button functionality
stopButton.addEventListener("click", () => {
    // Cancel ongoing speech
    window.speechSynthesis.cancel();

    // Stop the recording if it's active
    if (isRecording && recorder) {
        recorder.stop();
        isRecording = false;
        alert("Speech stopped. No MP3 will be saved.");
    }

    // Re-enable the listen button and disable stop button
    listenButton.disabled = false;
    stopButton.disabled = true;
});
