let no_errors = false;
let response = null;
$("#reg-complete").modal({ show: false });
$("#username").on("blur", function() {
  $.ajax({
    method: "POST",
    url: "/api/user_reg/",
    data: $("#signup-form").serialize(),
    success: function(res) {
      response = res;
      if (res.user_present == true) {
        $("#username").addClass("error-field");
      }
      $("#username").on("focus", function() {
        $(this).removeClass("error-field");
      });
    }
  });
});
$("#re_password").on("blur", function() {
  password = $("#password").val();
  if (password != $(this).val()) {
    $(this).addClass("error-field");
    $("#password").addClass("error-field");
  }
  $(this).on("focus", function() {
    $(this).removeClass("error-field");
    $("#password").removeClass("error-field");
  });
});
$("#password").on("blur", function() {
  re_password = $("#re_password").val();
  if (re_password != $(this).val() && re_password != "") {
    $(this).addClass("error-field");
    $("#re_password").addClass("error-field");
  }
  $(this).on("focus", function() {
    $(this).removeClass("error-field");
    $("#re_password").removeClass("error-field");
  });
});
$("#check").on("click", function() {
  if ($(this).prop("checked") == true) {
    $("#signup-btn").removeAttr("disabled");
  } else {
    $("#signup-btn").attr("disabled", "true");
  }
});
$("#signup-form").submit(function(e) {
  e.preventDefault();
  if (
    response.user_present == false &&
    $("password").val() == $("re_password").val()
  ) {
    $.ajax({
      method: "POST",
      url: "/api/user_reg/",
      data: $(this).serialize(),
      success: function(res) {
        if (res.registered == true) {
          $("#reg-complete").modal("show");
        } else {
          $("#reg-incomplete").modal("show");
        }
      }
    });
  }
});
$(".to-signin").on("click", function(e) {
    e.preventDefault();
    document.location.replace('/signin/')
});
$("#retry").on("click", function(e) {
    e.preventDefault();
    document.location.replace('/signup/')
});
