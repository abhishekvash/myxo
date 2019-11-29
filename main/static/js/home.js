let home_data = document.querySelector("#content").innerHTML;
let favorite_songs_page = false;
let song_card_trigger = {};
$(document).ready(function() {
  load_home();
});

$("#home").on("click", function() {
  $("#content").empty();
  $("#search_input").val("");
  $("#content").append(home_data);
  load_home();
});

function load_home() {
  $("#search_input").val("");
  $.ajax({
    method: "GET",
    url: "/api/recently_added",
    success: function(res) {
      res.forEach(function(item) {
        $("#recently_added").append(`
                <div class="myxo_card album_card">
                    <p class="path" hidden>${item.pk}</p>
                    <div class="art">
                        <img src="/static/${item.fields.art}">
                    </div>
                    <p class="album_name">${item.fields.name}</p>
                </div>
                `);
      });
      let owl_recent = $("#recently_added");
      owl_recent.owlCarousel({
        items: 6,
        responsiveClass: true,
        responsive: {
          0: {
            items: 1
          },
          800: {
            items: 4
          },
          900: {
            items: 5
          },
          1200: {
            items: 6
          }
        }
      });
      owl_recent.on("mousewheel", ".owl-stage", function(e) {
        if (e.deltaY > 0) {
          owl_recent.trigger("next.owl");
        } else {
          owl_recent.trigger("prev.owl");
        }
        e.preventDefault();
      });
      let owl_charts = $("#charts");
      owl_charts.owlCarousel({
        items: 6,
        responsiveClass: true,
        responsive: {
          0: {
            items: 1
          },
          800: {
            items: 4
          },
          900: {
            items: 5
          },
          1200: {
            items: 6
          }
        }
      });
      owl_charts.on("mousewheel", ".owl-stage", function(e) {
        if (e.deltaY > 0) {
          owl_charts.trigger("next.owl");
        } else {
          owl_charts.trigger("prev.owl");
        }
        e.preventDefault();
      });
    }
  });
}

$("#signout").on("click", function() {
  window.location = "/signout";
});

$("#toFavSongs").on("click", function() {
  favorite_songs_page = true;
  $.ajax({
    method: "GET",
    url: "/api/get_favorite_songs",
    success: function(res) {
      $("#content").empty();
      $("#content").append(`
              <h2 class='mb-4'>Favorite Songs</h2>
              <div id="songs_container"></div>
              `);
      res.forEach((element, index) => {
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
                      <p class="artist_name_sub">${element.fields.album[3]}</p>
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
});

$("#toFavArtists").on("click", function() {
  $.ajax({
    method: "GET",
    url: "/api/get_favorite_artists",
    success: function(res) {
      console.log(res);
    }
  });
});

$("#toFavAlbums").on("click", function() {
  $.ajax({
    method: "GET",
    url: "/api/get_favorite_albums",
    success: function(res) {
      console.log(res);
    }
  });
});
