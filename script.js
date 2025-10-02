console.log("hello world");
let songs = [];  
let curfolder;
let currentSong = new Audio();
currentSong.addEventListener("timeupdate", () => {
    let percent = (currentSong.currentTime / currentSong.duration) * 100;
    document.querySelector(".overed").style.width = percent +1+ "%";
    document.querySelector(".circle").style.left = percent + "%";
    document.querySelector(".songtime").innerHTML =
        `${formatTime(currentSong.currentTime)} / ${formatTime(currentSong.duration)}`;
});
let play = document.querySelector("#play");

async function getSongs(folder) {
    curfolder = folder;

    let a = await fetch(`${folder}/`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    songs = []; 

    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1]);
        }
    }

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

    Array.from(songUL.getElementsByTagName("li")).forEach((li, index) => {
        li.addEventListener("click", () => {
            playMusic(songs [index]);
        });
    });

    }

    return songs;
}

function formatTime(seconds) {
    let minutes = Math.floor(seconds / 60);
    let secs = Math.floor(seconds % 60);
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

const playMusic = (track, pause = false) => {
    currentSong.src = `/${curfolder}/` + track;
    document.querySelector(".overed").style.width = "0%";
    document.querySelector(".circle").style.left = "0%";
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
};


async function displayAlbums() {
    let a = await fetch(`http://127.0.0.1:5500/songs/`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let anchors=div.getElementsByTagName("a");
    let cardcontainer=document.querySelector(".cardcontainer")
    let array=Array.from(anchors);
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        
        
        if(e.href.includes("/songs/")){
            
            let folder= e.href.split("/").slice(-2)[1];
            let a = await fetch(`http://127.0.0.1:5500/songs/${folder}/info.json`);
            let response = await a.json();  
            
            cardcontainer.innerHTML=cardcontainer.innerHTML+`<div data-folder="${folder}" class="card ">
                        <img src="songs/${folder}/cover.png" alt="">
                        <div class="playbtn">
                            <img src="images/play-circle-svgrepo-com.svg" alt="">
                        </div>
                        <h2>${response.title}</h2>
                        <p>${response.description}</p>
                    </div>`
        }
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
    document.querySelector(".overed").style.width = percent+1 + "%";
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
