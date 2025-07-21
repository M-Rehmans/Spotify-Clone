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
const homeBtn = document.querySelector('.home-btn')
const itemContainerItems = document.querySelectorAll('.item-box');
const playlistList = document.querySelectorAll('.playlist-item');
// const songList = document.querySelector(".singer-song-list");
let songList;
let thumbnail;
// const songCards = document.querySelectorAll('.song-card');

playlistList.forEach((playlistName, index) => {
    playlistName.addEventListener('click', () => {
        itemCardsHide();
        let matchFound = false;
        // let matchedSinger = singers.find(singer => singer.name.toLowerCase() === playlistName.id.toLowerCase());
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
        if (!matchFound) {
            emptyBox.style.display = 'flex';
        } else {
            emptyBox.style.display = 'none';
        }

    })
})

function itemCardsHide() {
    itemContainerItems.forEach(item => {
        item.classList.remove('active');
        // item.style.display = 'none';
    })
}


// function createSongList(){

// }

// const musicList = [
//     "Media/NASHA.mp3",
//     "Media/DO GALLAN.mp3"
// ];

let currentSong;
// let currentSong = 'Media/NASHA.mp3';
const singers = [
    {
        name: 'Nusrat',
        songs: [
            "Media/Jab Karam Hota Hai Halat Badal Jate Hain.mp3",
            "Media/Othe Amlan De Hony Ne Navede.mp3",
            "Media/Unke Andaz e karam.mp3",
            "Media/Aaj Sik Mitran Di.mp3",
        ]
    },

    {
        name: 'Atif-aslam',
        songs: [
            "Media/Woh Lamhe Woh Baatein.mp3",
            "Media/Rafta Rafta.mp3",
            "Media/Sang-e-Mah.mp3",
            "Media/Tum Nazar Mein Raho.mp3",
        ]
    },

    {
        name: 'Talwinder',
        songs: [
            "Media/Nasha karda.mp3",
        ]
    }
]



function renderSongs(songs, singerIdentity) {
    songList.innerHTML = ''; // Clear previous songs

    songs.forEach((song, index) => {

        const songNameL = song.split('/').pop().replace('.mp3', '');
     
        songList.innerHTML += `
        <div class="song-card flex active" data-info="${songNameL}">
            <div class="song-detail flex">
                <span class="song-index">${index + 1}</span>
                <i class="fa-solid fa-play"></i>
                <div class="song-thumbnail flex">
                    <img src="Media/${songNameL}.jpg" alt="">
                </div>
                <p class="song-name">${songNameL}</p>
            </div>
            <p class="play-count">97,901,449</p>
            <div class="song-duration">5:30</div>
        </div>
        `;



        const songCards = document.querySelectorAll('.song-card');
        songCards.forEach(songCard => {
            const durationBox = songCard.querySelector('.song-duration');
            let songSrc = `Media/${songCard.getAttribute('data-info')}.mp3`;
            const tempAudio = new Audio(songSrc);
            tempAudio.addEventListener('loadedmetadata', () => {
                const duration = formatTime(tempAudio.duration);
                durationBox.textContent = duration;
            });

            songCard.addEventListener('click', () => {
                const songName = songCard.getAttribute('data-info');
                const currentPlayingCard = document.querySelector('#current-playing-view');
                const currentSongDetail = document.querySelector('#Played-Song');
                let currentSongName = currentSongDetail.querySelector('.song-name');
                let currentSingerName = currentSongDetail.querySelector('.singer-name');
                let currentSongImg = currentSongDetail.querySelector('img');
                let currentSongNameCPC = currentPlayingCard.querySelectorAll('.song-name');
                let currentSongImgCPC = currentPlayingCard.querySelector('img');
                let currentSingerNameCPC = currentPlayingCard.querySelector('.artist-name');
                currentSongNameCPC.forEach(eachTag => {
                    eachTag.textContent = songName;
                })
                currentSongImgCPC.src = `Media/${songName}.jpg`;
                currentSingerNameCPC.textContent = singerIdentity;
                thumbnail.src = `Media/${songName}.jpg`;


                currentSongImg.src = `Media/${songName}.jpg`;
                currentSongName.textContent = songName;
                currentSingerName.textContent = singerIdentity;
               
                audioPlayer.src = `Media/${songName}.mp3`;
                playAudio()
                
            });
        });

    });
}

// songCards.forEach(songCard =>{
//     songCard.addEventListener('click', ()=>{
//         // if(songCard.id)
//         
//     })
// })


function createSongList(singerid) {
    const matchedSinger = singers.find(singer => singer.name === singerid);

    if (matchedSinger) {
        renderSongs(matchedSinger.songs, matchedSinger.name);
    }
    // else {
    //     songList.innerHTML = '<p class="color-white">97,901,449</p>';
    // }
}









// card.textContent = song.split('/').pop().replace('.mp3', '');


// let currentIndex = 0;

function playAudio() {
    if (!playBtnIcon.classList.contains('fa-play')) {
        audioPlayer.pause();
        playBtnIcon.classList.remove('fa-pause');
        playBtnIcon.classList.add('fa-play');
    }
    if (playBtnIcon.classList.contains('fa-play')) {
        audioPlayer.play();
        playBtnIcon.classList.remove('fa-play');
        playBtnIcon.classList.add('fa-pause');
    }
}


function playBtnPaue() {
   
    if (playBtnIcon.classList.contains('fa-play')) {
        audioPlayer.play();
        playBtnIcon.classList.remove('fa-play');
        playBtnIcon.classList.add('fa-pause');
    }
    else {
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


playBtn.addEventListener('click', playBtnPaue);

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

