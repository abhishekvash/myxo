$(document).on("click", ".song_card ", function() {
  let path =$(this).children("p")[0].innerHTML;
  songs = []
  songs.push(path);
  loadSong();
  playPause();
});

$(document).on("click", ".album_card ", function() {
  console.log("album clicked");
});

$(document).on("click", ".artist_card ", function() {
  console.log("artist clicked");
});
