// Check for browser compatibility
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (!SpeechRecognition) {
    alert("Your browser does not support Speech Recognition. Please try using Google Chrome.");
} else {
    const recognition = new SpeechRecognition();
    recognition.interimResults = true; // Allow interim results
    recognition.lang = 'en-US'; // Set the language

    const speechInput = document.getElementById('speech-input');
    const startButton = document.getElementById('start-button');
    const editButton = document.getElementById('edit-button');
    const downloadButton = document.getElementById('download-button');

    // Start the speech recognition
    startButton.addEventListener('click', () => {
        speechInput.value = ""; // Clear previous text when starting
        recognition.start();
        startButton.disabled = true; // Disable button during listening
        downloadButton.style.display = 'none'; // Hide download button initially
    });

    // Handle the results
    recognition.addEventListener('result', (event) => {
        const transcript = Array.from(event.results)
            .map(result => result[0])
            .map(result => result.transcript)
            .join('');

        speechInput.value = transcript; // Update the textarea with the spoken text
        downloadButton.style.display = 'block'; // Show download button when there is text
    });

    // Handle recognition end
    recognition.addEventListener('end', () => {
        startButton.disabled = false; // Re-enable the button when done
        console.log('Speech recognition service has stopped.');
    });

    // Edit button functionality
    editButton.addEventListener('click', () => {
        if (speechInput.readOnly) {
            speechInput.readOnly = false; // Allow editing
            editButton.textContent = "Save"; // Change button text to Save
        } else {
            speechInput.readOnly = true; // Disable editing
            editButton.textContent = "Edit"; // Change button text back to Edit
        }
    });

    // Download button functionality
    downloadButton.addEventListener('click', () => {
        const { jsPDF } = window.jspdf; // Get jsPDF from the window
        const doc = new jsPDF(); // Create a new jsPDF instance
        const text = speechInput.value; // Get the text from textarea

        // Split the text into lines and add them to the PDF
        const lines = doc.splitTextToSize(text, 190); // Split text to fit the page width
        doc.text(lines, 10, 10); // Add the lines to the PDF
        doc.save('Transcription.pdf'); // Save the PDF with a filename
    });
}
