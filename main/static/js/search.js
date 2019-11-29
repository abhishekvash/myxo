let typing = false;
let phrase = "";
$("#search_input").on("focus", function() {
  typing = true;
  if (phrase.length == 0) {
    typing = false;
  }
});
$("#search_input").on("blur", function() {
  typing = false;
});

$("#search_input").on("keyup", function() {
  phrase = $(this).val();
  if (phrase.length > 0) {
    if (phrase.length > 2) {
      $.ajax({
        method: "POST",
        url: "/api/search",
        data: $("#search").serialize(),
        success: function(response) {
          if (
            response.songs.length == 2 &&
            response.artists.length == 2 &&
            response.albums.length == 2
          ) {
            $("#content").html(`
            <h4>No Results Found</h4>
          `);
          } else {
            $("#content").empty();
            let result_songs = JSON.parse(response.songs);
            let result_artists = JSON.parse(response.artists);
            let result_albums = JSON.parse(response.albums);
            $("#content").html(`
            <h2 class="pb-3">Results</h2>
            <div class='row ml-2' id='results_container'></div>
          `);
            result_artists.forEach(element => {
              $("#results_container").append(`
                <div class="myxo_card mr-5 artist_card">
                    <p class="path" hidden>${element.pk}</p>
                    <div class="art">
                        <img src="/static/${element.fields.photo}">
                    </div>
                    <p class="album_name">${element.fields.name}</p>
                </div>
                `);
            });
            result_albums.forEach(element => {
              $("#results_container").append(`
                <div class="myxo_card mr-5 album_card">
                    <p class="path" hidden>${element.pk}</p>
                    <div class="art">
                        <img src="/static/${element.fields.art}">
                    </div>
                    <p class="album_name">${element.fields.name}</p>
                    <p class="subtext_name">Album by ${
                      element.fields.artist[0]
                    }</p>
                </div>
                `);
            });
            result_songs.forEach(element => {
              $("#results_container").append(`
                <div class="myxo_card mr-5 song_card">
                    <p class="path" hidden>${element.fields.path}</p>
                    <div class="art">
                        <img src="/static/${element.fields.album[2]}">
                    </div>
                    <p class="album_name">${element.fields.name}</p>
                    <p class="subtext_name">Song by ${
                      element.fields.album[3]
                    }</p>
                </div>
                `);
            });
          }
        },
        error: function(status) {
          console.error(status);
        }
      });
    }
  } else {
    $("#content").empty();
    $("#content").append(home_data);
    load_home();
  }
});
