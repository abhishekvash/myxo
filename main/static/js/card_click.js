let album_id = 0;
let artist_id = 0;
let paths_array = [];
let album_added_to_queue = false;
let menu_clicked = false;

$(document).on("click", ".song_card ", function() {
  $("#search_input").val("");
  let path = $(this).children("p")[0].innerHTML;
  songs = [];
  songs.push(path);
  loadSong();
  playPause();
});

$(document).on("click", ".album_card ", function() {
  $("#search_input").val("");
  album_id = $(this).children("p")[0].innerHTML;
  album_clicked();
  album_added_to_queue = false;
});

$(document).on("click", ".song ", function() {
  if (menu_clicked == false) {
    $("#search_input").val("");
    if (album_added_to_queue == true) {
      let index = parseInt($(this).children("p")[0].innerHTML, 10);
      currentSong = index;
      loadSong();
      playPause();
    } else {
      album_added_to_queue = true;
      songs = paths_array;
      let index = parseInt($(this).children("p")[0].innerHTML, 10);
      currentSong = index;
      loadSong();
      playPause();
    }
  }
  menu_clicked = false;
});

$(document).on("click", ".song_menu ", function() {
  menu_clicked = true
});

$(document).on("click", ".artist_card ", function() {
  $("#search_input").innerText = "";
  console.log("artist clicked");
});

function album_clicked() {
  $("#content").empty();
  $.ajax({
    method: "GET",
    url: `/api/get_album/`,
    data: { album_id: album_id },
    success: function(res) {
      let album = JSON.parse(res.album);
      let songs_fetched = JSON.parse(res.songs);
      let dur = album["0"].fields.duration.split(":");
      if (dur[0] == "00") {
        duration = `${dur[1]} minutes`;
      } else {
        duration = `${dur[0]} hour ${dur[1]}`;
      }
      $("#content").append(`
                  <div class="row" id="album_meta">
                <div class="col-3">
                  <img
                    src="/static/${album["0"].fields.art}"
                    alt=""
                    id="album_art"
                  />
                </div>
                <div class="col-6">
                  <h2 id="album_title">${album["0"].fields.name}</h2>
                  <h3 id="artist_name">${album["0"].fields.artist[0]}</h3>
                  <h4 id="misc_data">${
                    songs_fetched.length
                  } Songs - ${duration}</h4>
                  <h4 id="genre">${album["0"].fields.genre}</h4>
                  <h4 id="year">${album["0"].fields.year}</h4>
                </div>
              </div>
              <div id="songs_container"></div>
              `);
      songs_fetched.forEach((element, index) => {
        paths_array.push(element.fields.path);
        let time = element.fields.duration.split(":");
        $("#songs_container").append(`
                <div class="song">
                <p hidden>${index}</p>
                  <div class="row">
                    <div class="col-1">
                      <img src="/static/assets/player-icons/play_playlist.png" alt="" srcset="" class="play_button">
                    </div>
                    <div class="col-9">
                      <p class="song_name">${element.fields.name}</p>
                    </div>
                    <div class="col-1">
                      <p class="song_duration">${time[1]}:${time[2]}</p>
                    </div>
                    <div class="col-1">
                      <img src="/static/assets/player-icons/song_menu.png" alt="" srcset="" class="song_menu">
                    </div>
                  </div>
                </div>
        `);
      });
    }
  });
}
