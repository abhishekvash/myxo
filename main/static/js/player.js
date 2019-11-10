let songs = [];
let current_time = document.querySelector("#current-time");
let total_time = document.querySelector("#total-time");
let seekbar = document.querySelector("#seekbar");
let volume = document.querySelector("#volume");
let prev = document.querySelector("#prev");
let next = document.querySelector("#next");
let shuffle_button = document.querySelector("#shuffle");
let play_pause = document.querySelector("#play-pause");
let loop_button = document.querySelector("#loop");
let currentSong = 0;
let song = new Audio();
let songShuffle = false;

function previous_song() {
  if (songShuffle) {
    currentSong = Math.floor(Math.random() * (+songs.length - +0)) + +0;
  } else {
    if (currentSong == 0) {
      currentSong = songs.length - 1;
    } else {
      currentSong -= 1;
    }
  }
  loadSong();
  song.play();
}

function playPause() {
  if (song.paused) {
    song.play();
    play_pause.setAttribute("src", "/static/assets/player-icons/pause.png");
  } else {
    song.pause();
    play_pause.setAttribute("src", "/static/assets/player-icons/play.png");
  }
  updateSeekBar();
}

function next_song() {
  if (songShuffle) {
    currentSong = Math.floor(Math.random() * (+songs.length - +0)) + +0;
  } else {
    if (currentSong == songs.length - 1) {
      currentSong = 0;
    } else {
      currentSong += 1;
    }
  }
  if (songs.length > 1) {
    loadSong();
    song.play();
  }
}

function loadSong() {
  total_time.textContent = "--:--";
  current_time.textContent = "--:--";
  if (songs.length >= 1) {
    song.src = `${songs[currentSong]}`;
    song.addEventListener("loadedmetadata", function() {
      setTimeout(showDuration, 100);
      setInterval(updateSeekBar, 1000);
    });
  }
}

function updateSeekBar() {
  let c = Math.round(song.currentTime);
  current_time.textContent = convertTime(c);
  seekbar.value = c;
  if (song.ended) {
    next_song();
  }
}

function convertTime(secs) {
  let min = Math.floor(secs / 60);
  let sec = secs % 60;
  sec = sec < 10 ? "0" + sec : sec;
  return `${min}:${sec}`;
}

function showDuration() {
  let duration = Math.floor(song.duration);
  seekbar.setAttribute("max", duration);
  total_time.textContent = convertTime(duration);
}

function updateVolume() {
  song.volume = volume.value;
}

function seekSong() {
  song.currentTime = seekbar.value;
  updateSeekBar();
}

document.addEventListener("keydown", function(e) {
  let key = e.key;
  if (typing == false ) {
    if (key == "ArrowRight") {
      song.currentTime += 10;
    }
    if (key == "ArrowLeft") {
      song.currentTime -= 10;
    }
    if (key == "ArrowUp" && volume.value <= 0.9) {
      song.volume += 0.1;
      volume.value = song.volume;
    }
    if (key == "ArrowDown" && volume.value >= 0) {
      volume.value -= 0.1;
    }
    if (key == " ") {
      e.preventDefault();
      playPause();
    }
    updateSeekBar();
    updateVolume();
  }
  if (key == "Enter") {
    e.preventDefault();
  }
});

function loop() {
  if (song.loop == false) {
    song.loop = true;
    loop_button.setAttribute(
      "src",
      "/static/assets/player-icons/loop_active.png"
    );
  } else {
    song.loop = false;
    loop_button.setAttribute("src", "/static/assets/player-icons/loop.png");
  }
}

function shuffle() {
  if (songShuffle == false) {
    songShuffle = true;
    shuffle_button.setAttribute(
      "src",
      "/static/assets/player-icons/shuffle_active.png"
    );
  } else {
    songShuffle = false;
    shuffle_button.setAttribute(
      "src",
      "/static/assets/player-icons/shuffle.png"
    );
  }
}

let isPlaying = function() {
  return (
    song &&
    song.currentTime > 0 &&
    !song.paused &&
    !song.ended &&
    song.readyState > 2
  );
};
