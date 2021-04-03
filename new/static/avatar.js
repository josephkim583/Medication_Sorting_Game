function animateAvatar(state) {
    switch(state) {
      case "speaking":
        $("#eye1, #eye2").removeClass('eye-down eye-sleep').addClass('eye');
        $(".ball").css("animation", "bounce 2s ease-out 2");
        $(".shadow").css("animation", "shadow-bounce 2s ease-out 2");
        break;
      case "thinking":
        $("#eye1, #eye2").removeClass('eye eye-sleep').addClass('eye-down');
        $(".ball").css("animation", "lil-bounce 2s linear infinite");
        $(".shadow").css("animation", "shadow-lil-bounce 2s linear infinite");
        break;
      case "listening":
        $("#eye1, #eye2").removeClass('eye-down eye-sleep').addClass('eye');
        $(".ball").css("animation", "breathe 3s linear infinite");
        $(".shadow").css("animation", "none");
        break;
      case "sleeping":
        $("#eye1, #eye2").removeClass('eye eye-down').addClass('eye-sleep');
        $(".ball").css("animation", "to-roll 1s, roll 5s linear infinite");
        $(".shadow").css("animation", "shadow-roll 5s linear infinite");
        break;
      default:
        // TODO output to debug log
        console.log("unknown state: " + state);
    }
  }