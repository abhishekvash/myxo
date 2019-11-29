let album_id = 0;
let artist_id = 0;
let paths_array = [];
let album_added_to_queue = false;
let menu_clicked = false;
let song_pk = 0;

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
  song_pk = $(this).children("p3")[0].innerHTML;
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

$(document).on("click", ".song_menu ", function(event) {
  menu_clicked = true;
  $.ajax({
    method: "GET",
    url: "/api/confirm_favorite/",
    data: { song_pk: song_pk },
    success: function(res) {
      if (res.is_favorite == true) {
        $("#to_fav").prop("checked", true);
      } else {
        $("#to_fav").prop("checked", false);
      }
      $("#song_menu").modal("show");
    }
  });
  song_card_trigger = $(this);
});

$(document).on("click", ".artist_card", function() {
  $("#search_input").innerText = "";
  $("#content").empty();
  paths_array = [];
  favorite_songs_page = false;
  artist_id = $(this).children("p")[0].innerHTML;
  $.ajax({
    url: "/api/get_artist",
    method: "GET",
    data: { artist_id: artist_id },
    success: function(response) {
      let result_songs = JSON.parse(response.songs);
      let result_artist = JSON.parse(response.artist);
      let result_albums = JSON.parse(response.albums);
      $("#content").append(`
              <div class="row justify-content-center" id="artist_meta">
                <div class="col-3">
                  <img
                    src='/static/${result_artist[0].fields.photo}'
                    alt=""
                    id="album_art"
                    class= "album_art"
                  />
                </div>
                <div class="col-3 meta_text mt-auto">
                  <h3 id="artist-name">${result_artist[0].fields.name}</h3>
                  <div class="row" id='artist_followers'>${result_artist[0].fields.followers} Followers</div>
                  <div class="row">
                   <div class="col" id='follow'>
                   </div>
                  </div>
                </div>
              </div>
              <h3 class='artist_page_headings'>Top Tracks</h3>
              <div id="songs_container"></div>
              <br>
              <h3 class='artist_page_headings'>Albums</h3>
              <div id="albums_container" class='row'></div>
  `);
      display_follow(artist_id);
      $("#follow").on("click", function() {
        console.log("click");
        $.ajax({
          url: "/api/update_favorite_artist/",
          method: "GET",
          data: {
            artist_id: artist_id
          },
          success: function(res) {
            $("#artist_followers").empty();
            $("#artist_followers").append(`${res.followers} Followers`);
            display_follow(artist_id);
          }
        });
      });
      result_songs.forEach((element, index) => {
        paths_array.push(element.fields.path);
        let time = element.fields.duration.split(":");
        if (index <= 4) {
          $("#songs_container").append(`
                <div class="song">
                <p hidden>${index}</p>
                <p2 hidden>${element.fields.path}</p2>
                <p3 hidden>${element.pk}</p3>
                  <div class="row">
                    <div class="col-1">
                      <img src="/static/assets/player-icons/play_playlist.png" alt="" srcset="" class="play_button">
                    </div>
                    <div class="col-9">
                    <div class="row">
                      <p class="song_name">${element.fields.name}</p>
                    </div>
                    <div row="row">
                      <p class="artist_name_sub">
                        ${result_artist[0].fields.name}
                      </p>
                    </div>
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
        }
      });
      result_albums.forEach(element => {
        $("#albums_container").append(`
                <div class="myxo_card mr-5 album_card">
                    <p class="path" hidden>${element.pk}</p>
                    <div class="art">
                        <img src="/static/${element.fields.art}">
                    </div>
                    <p class="album_name">${element.fields.name}</p>
                </div>
                `);
      });
    }
  });
});

function album_clicked() {
  $("#content").empty();
  favorite_songs_page = false;
  paths_array = [];
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
                <p2 hidden>${element.fields.path}</p2>
                <p3 hidden>${element.pk}</p3>
                  <div class="row">
                    <div class="col-1">
                      <img src="/static/assets/player-icons/play_playlist.png" alt="" srcset="" class="play_button">
                    </div>
                    <div class="col-9">
                    <div class="row">
                      <p class="song_name">${element.fields.name}</p>
                    </div>
                    <div row="row">
                      <p class="artist_name_sub">${
                        album["0"].fields.artist[0]
                      }</p>
                    </div>
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

$("#song_menu_done").on("click", function(event) {
  if (favorite_songs_page == true) {
    if ($("#to_queue").prop("checked") == false) {
      $(
        song_card_trigger["0"].parentElement.parentElement.parentElement
      ).animate(
        { opacity: 0.01, left: "+=50", height: "toggle" },
        300,
        function() {
          setTimeout(function() {
            $(this).remove();
          }, 1000);
        }
      );
    }
  }
  if ($("#to_queue").prop("checked") == true) {
    songs.push($(".song").children("p2")[0].innerHTML);
  }
  data = $("#song_menu_form").serialize();
  data = `${data}&song_pk=${song_pk}`;
  $.ajax({
    method: "POST",
    url: "/api/update_favorites/",
    data: data
  });
  $("#to_queue").prop("checked", false);
  $("#to_fav").prop("checked", false);
  $("#song_menu").modal("hide");
});

function display_follow(id) {
  artist_id = id;
  $.ajax({
    url: "/api/confirm_favorite_artist/",
    method: "GET",
    data: {
      artist_id: artist_id
    },
    success: function(res) {
      if (res.is_favorite == true) {
        $("#follow").empty();
        $("#follow").append('<i class="fas fa-heart"></i> Following');
      } else {
        $("#follow").empty();
        $("#follow").append('<i class="fas fa-heart"></i> Follow');
      }
    }
  });
}
