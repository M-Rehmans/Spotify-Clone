const audioPlayer = document.getElementById("audio-player");
const playBtn = document.querySelector('.play-btn');
const playBtnIcon = playBtn.querySelector('.fa-solid');
const currentAudioBox = document.querySelector('.now-playing-view');
const audioDetailBox = document.querySelector('.now-play-Btn');
const progressBar = document.getElementById("progress-bar");
const currentTimeSpan = document.getElementById("current-time");
const totalDurationSpan = document.getElementById("total-duration");
const volumeBar = document.querySelector('#volume-bar');
const volumIcon = document.querySelector('.volume-icon');


const musicList = [
    "Media/NASHA.mp3",
    "Media/DO GALLAN.mp3"
];

let currentIndex = 0;
audioPlayer.src = musicList[currentIndex];

function playAudio() {
    if (playBtnIcon.classList.contains('fa-play')) {
        audioPlayer.play();
        playBtnIcon.classList.remove('fa-play');
        playBtnIcon.classList.add('fa-pause');
    } else {
        audioPlayer.pause();
        playBtnIcon.classList.remove('fa-pause');
        playBtnIcon.classList.add('fa-play');
    }
}

audioPlayer.addEventListener('ended', () => {
    currentIndex++;
    if (currentIndex >= musicList.length) {
        currentIndex = 0; // Loop back to first song if needed
    }
    audioPlayer.src = musicList[currentIndex];
    audioPlayer.play();
});


playBtn.addEventListener('click', playAudio);

audioDetailBox.addEventListener('click', () => {
    currentAudioBox.classList.toggle('show-box');
});

// Format seconds into mm:ss
function formatTime(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' + sec : sec}`;
}

// Set max value once metadata is loaded
audioPlayer.addEventListener('loadedmetadata', () => {
    progressBar.max = audioPlayer.duration;
    totalDurationSpan.textContent = formatTime(audioPlayer.duration);
});

// Update progress bar and time display
audioPlayer.addEventListener('timeupdate', () => {
    if (audioPlayer.duration) {
        progressBar.value = audioPlayer.currentTime;
        currentTimeSpan.textContent = formatTime(audioPlayer.currentTime);
    }
});

// Allow user to seek audio
progressBar.addEventListener('input', () => {
    audioPlayer.currentTime = progressBar.value;
});

volumeBar.addEventListener('input', () => {
    audioPlayer.volume = volumeBar.value / 100;

    volumIcon.classList.remove('fa-volume-high', 'fa-volume-low', 'fa-volume-off');

    if (audioPlayer.volume === 0) {
        volumIcon.classList.add('fa-volume-off');
    } else if (audioPlayer.volume > 0.7) {
        volumIcon.classList.add('fa-volume-high');
    } else {
        volumIcon.classList.add('fa-volume-low');
    }
});

volumIcon.addEventListener('click', () => {
    if (volumeBar.value == 0) {
        audioPlayer.volume = 1;
        volumeBar.value = 100;
        volumIcon.classList.remove('fa-volume-high', 'fa-volume-low', 'fa-volume-off');
        volumIcon.classList.add('fa-volume-high');
    }
    else {
        audioPlayer.volume = 0;
        volumeBar.value = 0;
        volumIcon.classList.remove('fa-volume-high', 'fa-volume-low', 'fa-volume-off');
        volumIcon.classList.add('fa-volume-off');
    }
})

