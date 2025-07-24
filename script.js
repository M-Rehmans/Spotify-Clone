// DOM Elements
const audioPlayer = document.getElementById("audio-player");
const playBtn = document.querySelector('.play-btn');
const playBtnIcon = playBtn.querySelector('.fa-solid');
const currentAudioBox = document.querySelector('.now-playing-view');
const audioDetailBox = document.querySelector('.now-play-Btn');
const progressBar = document.getElementById("progress-bar");
const currentTimeSpan = document.getElementById("current-time");
const totalDurationSpan = document.getElementById("total-duration");
const volumeBar = document.querySelector('#volume-bar');
const volumeIcon = document.querySelector('.volume-icon');
const playlistList = document.querySelectorAll('.playlist-item');
const itemContainerItems = document.querySelectorAll('.item-box');
const playPreviousSongBtn = document.querySelector('#previous-song');
const playNextSongBtn = document.querySelector('#next-song');
const shuffleBtn = document.querySelector('#shuffle-Songs');

let songList;
let thumbnail;
let currentSong;
let currentSongCardBox;
let activeCard;
let isShuffle = false;
let playedSongs = [];
let currentSongListElement = null; // 🟡 NEW variable to track original playlist list

// Singer Data
const singers = [
    {
        name: 'Nusrat',
        songs: [
            "Media/Jab Karam Hota Hai Halat Badal Jate Hain.mp3",
            "Media/Othe Amlan De Hony Ne Navede.mp3",
            "Media/Unke Andaz e karam.mp3",
            "Media/Aaj Sik Mitran Di.mp3"
        ]
    },
    {
        name: 'Atif-aslam',
        songs: [
            "Media/Woh Lamhe Woh Baatein.mp3",
            "Media/Rafta Rafta.mp3",
            "Media/Sang-e-Mah.mp3",
            "Media/Tum Nazar Mein Raho.mp3"
        ]
    },
    {
        name: 'Talwinder',
        songs: [
            "Media/Nasha karda.mp3"
        ]
    }
];

// Format seconds into mm:ss
function formatTime(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' + sec : sec}`;
}

// Hide all playlist items
function itemCardsHide() {
    itemContainerItems.forEach(item => item.classList.remove('active'));
}

// Playlist click logic
playlistList.forEach(playlistName => {
    playlistName.addEventListener('click', () => {
        itemCardsHide();
        let matchFound = false;
        activePlaylistCard(activeCard);
        activeCurrentCard();

        itemContainerItems.forEach(item => {
            if (playlistName.id === item.id) {
                songList = item.querySelector(".singer-song-list");
                thumbnail = item.querySelector('#current-song-img');
                item.classList.add('active');
                createSongList(item.id);
                matchFound = true;
            }
        });

        const emptyBox = document.getElementById('Emptyplaylist');
        emptyBox.style.display = matchFound ? 'none' : 'flex';
    });
});

// Create song list from singer data
function createSongList(singerid) {
    const matchedSinger = singers.find(singer => singer.name === singerid);
    if (matchedSinger) {
        renderSongs(matchedSinger.songs, matchedSinger.name);
    }
}

// Render all songs
function renderSongs(songs, singerIdentity) {
    songList.innerHTML = '';

    songs.forEach((song, index) => {
        const songName = song.split('/').pop().replace('.mp3', '');
        songList.innerHTML += `
        <div class="song-card flex" data-info="${songName}" id="${index + 1}">
            <div class="song-detail flex">
                <span class="song-index">${index + 1}</span>
                <i class="fa-solid fa-play"></i>
                <div class="song-thumbnail flex">
                    <img src="Media/${songName}.jpg" alt="">
                </div>
                <p class="song-name">${songName}</p>
            </div>
            <p class="play-count">97,901,449</p>
            <div class="song-duration">5:30</div>
        </div>
        `;
    });

    // Update durations and bind clicks
    const songCards = songList.querySelectorAll('.song-card');
    songCards.forEach(songCard => {
        const songName = songCard.getAttribute('data-info');
        const durationBox = songCard.querySelector('.song-duration');
        const tempAudio = new Audio(`Media/${songName}.mp3`);

        tempAudio.addEventListener('loadedmetadata', () => {
            durationBox.textContent = formatTime(tempAudio.duration);
        });

        songCard.addEventListener('click', () => {
            activeCard = songName;
            currentSongCardBox = songCard;
            currentSongListElement = songCard.closest('.singer-song-list'); // 🟡 Set to currently playing playlist

            updateNowPlayingUI(songName, singerIdentity);
            audioPlayer.src = `Media/${songName}.mp3`;
            currentSong = audioPlayer.src;

            activePlaylistCard(activeCard);
            activeCurrentCard();
            playAudio();
        });
    });
}

// Toggle play/pause
function playAudio() {
    audioPlayer.play();
    playBtnIcon.classList.remove('fa-play');
    playBtnIcon.classList.add('fa-pause');
}

function playBtnToggle() {
    if (audioPlayer.paused) {
        playAudio();
    } else {
        audioPlayer.pause();
        playBtnIcon.classList.remove('fa-pause');
        playBtnIcon.classList.add('fa-play');
    }
}

// Update current card styles
function activeCurrentCard() {
    document.querySelectorAll('.song-card').forEach(card => {
        card.classList.toggle('active', card.getAttribute('data-info') === activeCard);
    });
}

// Highlight correct playlist in sidebar
function activePlaylistCard(currentCard) {
    const activeSongCard = document.querySelector(`.song-card[data-info="${currentCard}"]`);
    const grandparentId = activeSongCard?.closest('.item-box')?.id;

    playlistList.forEach(playlistCard => {
        playlistCard.classList.toggle('active', playlistCard.id === grandparentId);
    });
}

// Next/Previous playback logic
function previousNextPlay(nextCard) {
    if (!nextCard) return;

    const songName = nextCard.getAttribute('data-info');
    const singerName = nextCard.closest('.item-box')?.id;

    activeCard = songName;
    currentSongCardBox = nextCard;
    currentSongListElement = nextCard.closest('.singer-song-list'); // 🟡 Track playlist

    updateNowPlayingUI(songName, singerName);
    audioPlayer.src = `Media/${songName}.mp3`;
    currentSong = audioPlayer.src;

    activePlaylistCard(activeCard);
    activeCurrentCard();
    playAudio();
}

// Update Now Playing UI
function updateNowPlayingUI(songName, singerIdentity) {
    const currentPlayingCard = document.querySelector('#current-playing-view');
    const currentSongDetail = document.querySelector('#Played-Song');

    const currentSongName = currentSongDetail.querySelector('.song-name');
    const currentSingerName = currentSongDetail.querySelector('.singer-name');
    const currentSongImg = currentSongDetail.querySelector('img');

    const currentSongNameCPC = currentPlayingCard.querySelectorAll('.song-name');
    const currentSongImgCPC = currentPlayingCard.querySelector('img');
    const currentSingerNameCPC = currentPlayingCard.querySelector('.artist-name');

    currentSongNameCPC.forEach(tag => tag.textContent = songName);
    currentSongImgCPC.src = `Media/${songName}.jpg`;
    currentSingerNameCPC.textContent = singerIdentity;

    if (thumbnail) thumbnail.src = `Media/${songName}.jpg`;

    currentSongName.textContent = songName;
    currentSingerName.textContent = singerIdentity;
    currentSongImg.src = `Media/${songName}.jpg`;
}

// Audio Controls
playBtn.addEventListener('click', playBtnToggle);
audioDetailBox.addEventListener('click', () => {
    currentAudioBox.classList.toggle('show-box');
});

volumeBar.addEventListener('input', () => {
    audioPlayer.volume = volumeBar.value / 100;
    volumeIcon.classList.remove('fa-volume-high', 'fa-volume-low', 'fa-volume-off');

    if (audioPlayer.volume === 0) {
        volumeIcon.classList.add('fa-volume-off');
    } else if (audioPlayer.volume > 0.7) {
        volumeIcon.classList.add('fa-volume-high');
    } else {
        volumeIcon.classList.add('fa-volume-low');
    }
});

volumeIcon.addEventListener('click', () => {
    if (volumeBar.value == 0) {
        volumeBar.value = 100;
        audioPlayer.volume = 1;
        volumeIcon.className = 'volume-icon fa-solid fa-volume-high';
    } else {
        volumeBar.value = 0;
        audioPlayer.volume = 0;
        volumeIcon.className = 'volume-icon fa-solid fa-volume-off';
    }
});

// Next & Previous
playPreviousSongBtn.addEventListener('click', () => {
    const songIndex = parseInt(currentSongCardBox.id);
    const newIndex = songIndex - 1 || 1;
    const prevCard = currentSongListElement.querySelector(`.song-card[id="${newIndex}"]`);
    previousNextPlay(prevCard);
});

playNextSongBtn.addEventListener('click', () => {
    const songIndex = parseInt(currentSongCardBox.id);
    const total = currentSongListElement.querySelectorAll('.song-card').length;
    const newIndex = songIndex + 1 > total ? 1 : songIndex + 1;
    const nextCard = currentSongListElement.querySelector(`.song-card[id="${newIndex}"]`);
    previousNextPlay(nextCard);
});

// Shuffle Button
shuffleBtn.addEventListener('click', () => {
    isShuffle = !isShuffle;
    shuffleBtn.classList.toggle('active');
    playedSongs = [];
});

// Handle song end
audioPlayer.addEventListener('ended', () => {
    const allSongs = Array.from(currentSongListElement.querySelectorAll('.song-card'));
    const totalSongs = allSongs.length;

    if (isShuffle) {
        const unplayed = allSongs.filter(card => !playedSongs.includes(card.id));
        if (unplayed.length === 0) {
            playedSongs = [];
            return;
        }
        const randomIndex = Math.floor(Math.random() * unplayed.length);
        const nextSongCard = unplayed[randomIndex];
        playedSongs.push(nextSongCard.id);
        previousNextPlay(nextSongCard);
    } else {
        let currentIndex = parseInt(currentSongCardBox.id);
        let nextIndex = currentIndex + 1 > totalSongs ? 1 : currentIndex + 1;
        const nextCard = currentSongListElement.querySelector(`.song-card[id="${nextIndex}"]`);
        previousNextPlay(nextCard);
    }
});

// Update progress UI
audioPlayer.addEventListener('loadedmetadata', () => {
    progressBar.max = audioPlayer.duration;
    totalDurationSpan.textContent = formatTime(audioPlayer.duration);
});

audioPlayer.addEventListener('timeupdate', () => {
    if (!isNaN(audioPlayer.duration)) {
        progressBar.value = audioPlayer.currentTime;
        currentTimeSpan.textContent = formatTime(audioPlayer.currentTime);
    }
});

progressBar.addEventListener('input', () => {
    audioPlayer.currentTime = progressBar.value;
});
