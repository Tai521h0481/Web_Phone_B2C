let music = [
  {
    name: "Đi về nhà",
    artist: "Đen, JustaTee",
    path: "https://res.cloudinary.com/dg0fxy0ur/video/upload/v1703605475/PhoneWeb_B2B_B2C/musics/ishfn3brpdhkupgomjm5.mp3",
    image: "https://lastfm.freetls.fastly.net/i/u/300x300/4ceb292c387195259d2c356754fff531.png",
  },
  {
    name: "Thu Cuối",
    artist: "Mr.T ft. Yanbi & Hang BingBong",
    path: "https://res.cloudinary.com/dg0fxy0ur/video/upload/v1703608486/PhoneWeb_B2B_B2C/musics/cke9fhrzfo2rr5y0za70.mp3",
    image: "https://lastfm.freetls.fastly.net/i/u/300x300/5ed866d110094c3b8402c279c5b88223.png",
  },
  {
    name: "Chúng ta của hiện tại",
    artist: "Sơn Tùng M-TP",
    path: "https://res.cloudinary.com/dg0fxy0ur/video/upload/v1703609080/PhoneWeb_B2B_B2C/musics/nfou3icrrvphxok3widk.mp3",
    image: "https://lastfm.freetls.fastly.net/i/u/300x300/ef1c823642315f2eb31e8cb16efb3b7d.png",
  }
];

const token = localStorage.getItem("token");
const socket = io("http://localhost:8080", {
  query: { token },
});

let user_gobal;

socket.on("profile", ({ user }) => {
  user_gobal = user;
  console.log(user_gobal);
  document.getElementById("avatar").src = user.avatar;
});

const audio = document.getElementById("musicPlayer");
const playButton = document.getElementById("playIcon");

function togglePlay() {
  if (audio.paused) {
    audio.play();
    playButton.className = "fas fa-pause p-2"; // Đổi biểu tượng sang nút "Pause"
  } else {
    audio.pause();
    playButton.className = "fas fa-play p-2"; // Đổi biểu tượng sang nút "Play"
  }
}

let currentSongIndex = 0;

function playSong(index) {
  audio.src = music[index].path;
  document.getElementById("bg-image").style.backgroundImage = `url('${music[index].image}')`;
  document.getElementById("name").textContent = music[index].name;
  document.getElementById("artist").textContent = music[index].artist;
  audio.play();
  playButton.className = "fas fa-pause p-2";
  currentSongIndex = index;
}

function toggleNext() {
  let nextSongIndex = currentSongIndex + 1;
  if (nextSongIndex >= music.length) {
    nextSongIndex = 0;
  }
  playSong(nextSongIndex);
}

function togglePre() {
  let prevSongIndex = currentSongIndex - 1;
  if (prevSongIndex < 0) {
    prevSongIndex = music.length - 1;
  }
  playSong(prevSongIndex);
}