console.log("hello world");
let songs = [];
let curfolder;
let currentSong = new Audio();
let play = document.querySelector("#play");

// Hardcoded song lists for deployment compatibility
let songFolders = {
    "songs/non-copyright": [
        "aaj ki raat.mp3",
        "bijuriya.mp3",
        "die with a smile.mp3",
        "ishq hai.mp3",
        ],
    "songs/copyright": [
        "cherry cherry.mp3",
        "aame jo tomar.mp3",
        "maand.mp3",
        "ve haaniyaan.mp3"
    ]
};

async function getSongs(folder) {
    curfolder = folder;
    songs = songFolders[folder] || [];

    let songUL = document.querySelector(".songlist ul");
    songUL.innerHTML = "";

    for (const song of songs) {
        songUL.innerHTML += `
            <li>
                <img class="invert" src="images/music-svgrepo-com.svg" alt="">
                <div class="info">
                    <div class="box">${song.replaceAll("%20", " ").replace(".mp3", "")}</div>
                    <div class="box">Unknown</div>
                </div>
                <span class="playnow">Play Now
                    <img src="images/play-circle-svgrepo-com.svg" alt="">
                </span>
            </li>`;
    }

    Array.from(songUL.getElementsByTagName("li")).forEach((li, index) => {
        li.addEventListener("click", () => {
            playMusic(songs[index]);
        });
    });

    return songs;
}

function formatTime(seconds) {
    let minutes = Math.floor(seconds / 60);
    let secs = Math.floor(seconds % 60);
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

const playMusic = (track, pause = false) => {
    currentSong.src = `/${curfolder}/` + track;

    if (!pause) {
        currentSong.play();
        play.src = "images/video-pause-svgrepo-com.svg";
    } else {
        play.src = "images/play.svg";
    }

    document.querySelector(".songinfo").innerHTML =
        track.replaceAll("%20", " ").replace(".mp3", "");

    currentSong.addEventListener("loadedmetadata", () => {
        document.querySelector(".songtime").innerHTML =
            `${formatTime(0)} / ${formatTime(currentSong.duration)}`;
    });

    // Add timeupdate event to update songtime and seekbar
    currentSong.ontimeupdate = () => {
        let currentTime = currentSong.currentTime;
        let duration = currentSong.duration;
        if (!isNaN(duration)) {
            document.querySelector(".songtime").innerHTML =
                `${formatTime(currentTime)} / ${formatTime(duration)}`;
            let percent = (currentTime / duration) * 100;
            document.querySelector(".circle").style.left = percent + "%";
            document.querySelector(".overed").style.width = percent +1+ "%";
            if(currentTime==duration){
                play.src="images/play.svg";
            }
            else{
                play.src="images/video-pause-svgrepo-com.svg";
            }
        }
    };
};

async function displayAlbums() {
    let cardcontainer = document.querySelector(".cardcontainer");
    let folders = ["non-copyright", "copyright"];

    for (let folder of folders) {
        let response = { title: folder === "non-copyright" ? "Non Copy-Right Songs" : "Copy Right Songs", description: "Songs for you" };
        cardcontainer.innerHTML += `<div data-folder="${folder}" class="card ">
                    <img src="songs/${folder}/cover.png" alt="">
                    <div class="playbtn">
                        <img src="images/play-circle-svgrepo-com.svg" alt="">
                    </div>
                    <h2>${response.title}</h2>
                    <p>${response.description}</p>
                </div>`;
    }

    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);
            if (songs.length > 0) {
                playMusic(songs[0], true);
            }
        });
    });
}

async function main() {
    songs = await getSongs("songs/non-copyright"); 
    if (songs.length > 0) {
        playMusic(songs[0], true);
    }

    await displayAlbums();

    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);
            if (songs.length > 0) {
                playMusic(songs[0], true);
            }
        });
    });

    document.querySelector(".hamburger").addEventListener("click", e => {
        document.querySelector(".left").style.left = "0";

    })

    document.querySelector(".close").addEventListener("click", e => {
        document.querySelector(".left").style.left = "-120%";

    })

    document.querySelector(".seekbar").addEventListener("click", e => {
    let seekbar = e.currentTarget;
    let rect = seekbar.getBoundingClientRect();
    let percent = ((e.clientX - rect.left) / rect.width) * 100;

    document.querySelector(".circle").style.left = percent + "%";
    document.querySelector(".overed").style.width =( percent+2 )+ "%";
    currentSong.currentTime = (percent / 100) * currentSong.duration;
});


    play.addEventListener("click", () => { 
        if (currentSong.paused) { 
            currentSong.play();
            play.src = "images/video-pause-svgrepo-com.svg"; } 
        else { 
            currentSong.pause();
            play.src = "images/play.svg"; } 
        });

    previous.addEventListener("click", e => {
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1]);

        }
        else {
            alert("first song");

        }
    })

    next.addEventListener("click", () => {
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1]);

        }
        else { alert("last song"); }
    })
}

main();


