$("#signin-form").submit(function(e) {
  e.preventDefault();
  $.ajax({
    method: "POST",
    url: "/api/user_auth/",
    data: $(this).serialize(),
    success: function(res) {
      if (res.validated == true) {
        document.location.replace('/')
      }
      if (res.user_present == false) {
        $("#username").addClass("error-field");
      }
      if (res.password_correct == false) {
        $("#password").addClass("error-field");
      }
      $("#username").focus(function() {
        if (res.user_present == false) {
          $("#username").removeClass("error-field");
        }
        if (res.password_correct == false) {
          $("#password").removeClass("error-field");
        }
      });
    }
  });
});
