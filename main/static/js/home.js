let home_data = document.querySelector("#content").innerHTML;
$(document).ready(function() {
  load_home();
});

$("#home").on("click", function() {
  $("#content").empty();
  $("#content").append(home_data);
  load_home();
});

function load_home() {
  $.ajax({
    method: "GET",
    url: "/api/recently_added",
    success: function(res) {
      res.forEach(function(item) {
        $("#recently_added").append(`
                <div class="myxo_card album_card">
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

$('#signout').on('click', function() {
  window.location = '/signout'
})
