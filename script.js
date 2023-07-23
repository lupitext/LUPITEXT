const buttons = document.querySelectorAll('#button-frame button');
const textArea = document.getElementById('text');

const labelSequences = ["A", "AB", "ABC", "ABCD"];
let currentLabelIndex = 0;
let currentSequence = labelSequences[0];

buttons.forEach((button, index) => {
    button.addEventListener('click', () => {
        currentLabelIndex = 0;
        currentSequence = labelSequences[index];
        updateButtonsStyle();
    });
});

textArea.addEventListener('keydown', (event) => {
    if (event.key === "Enter") {
        event.preventDefault();
        const cursorIndex = textArea.selectionStart;
        const currentLabel = currentSequence[currentLabelIndex];
        const newText = `\n${currentLabel}:`;
        textArea.value = textArea.value.slice(0, cursorIndex) + newText + textArea.value.slice(cursorIndex);
        currentLabelIndex = (currentLabelIndex + 1) % currentSequence.length;
    }
});

function updateButtonsStyle() {
    buttons.forEach((button, index) => {
        if (index === labelSequences.indexOf(currentSequence)) {
            button.style.backgroundColor = 'lightblue';
        } else {
            button.style.backgroundColor = '';
        }
    });
}

const audioPlayer = document.getElementById('audio-player');

function playAudio(audioUrl) {
    audioPlayer.src = audioUrl;
    audioPlayer.play();
}

function rewindAudio() {
    audioPlayer.currentTime -= 10;
}

function rewind5Audio() {
    audioPlayer.currentTime -= 5;
}

function togglePlayPause() {
    if (audioPlayer.paused) {
        audioPlayer.play();
    } else {
        audioPlayer.pause();
    }
}

audioPlayer.addEventListener('timeupdate', () => {
    updateProgressBar();
    updateTimeInfo();
});

function updateProgressBar() {
    const currentTime = audioPlayer.currentTime;
    const duration = audioPlayer.duration;
    const progressPercent = (currentTime / duration) * 100;
    const progressFill = document.getElementById('progress-fill');
    progressFill.style.width = `${progressPercent}%`;
}

function updateTimeInfo() {
    const currentTime = formatTime(audioPlayer.currentTime);
    const duration = formatTime(audioPlayer.duration);

    const currentTimeSpan = document.getElementById('current-time');
    const durationSpan = document.getElementById('duration');
    currentTimeSpan.textContent = currentTime;
    durationSpan.textContent = duration;
}

function formatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

function loadAudioFile() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.wav';
    fileInput.addEventListener('change', handleFileSelect, false);
    fileInput.click();
}

function handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (event) {
        const audioFileUrl = event.target.result;
        playAudio(audioFileUrl);
    };
    reader.readAsDataURL(file);
}

const selectButton = document.getElementById('select-button');
selectButton.addEventListener('click', loadAudioFile);

const rewindButton = document.getElementById('rewind-button');
rewindButton.addEventListener('click', rewindAudio);

const rewind5Button = document.getElementById('rewind-5-button');
rewind5Button.addEventListener('click', rewind5Audio);

const playPauseButton = document.getElementById('play-pause-button');
playPauseButton.addEventListener('click', togglePlayPause);

// Agregar un manejador de clic para el botón de exportar a Word
const exportWordButton = document.getElementById('export-word');
exportWordButton.addEventListener('click', () => {
    exportToWord();
});

// Función para exportar el contenido del área de texto a Word
function exportToWord() {
    const content = textArea.value;
    const blob = new Blob([content], { type: 'text/plain' });
    saveAs(blob, 'documento_word.txt');
}

