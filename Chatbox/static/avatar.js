function animateAvatar(state) {
    switch(state) {
      // add new questioning state in which some question marks appear over avatar's head
      case "questioning":
        $("#eye1, #eye2").removeClass('eye-down eye-sleep').addClass('eye');
        $(".ball").css("animation", "bounce 2s ease-out 3");
        $(".shadow").css("animation", "shadow-bounce 2s ease-out 3");
        $("#questionMark").css("visibility", "visible").css("animation", "wobble 1s 3 both");
        break;
      case "speaking":
        $("#eye1, #eye2").removeClass('eye-down eye-sleep').addClass('eye');
        $(".ball").css("animation", "bounce 2s ease-out 2");
        $(".shadow").css("animation", "shadow-bounce 2s ease-out 2");
        $("#questionMark").css("visibility", "hidden");
        break;
      case "thinking":
        $("#eye1, #eye2").removeClass('eye eye-sleep').addClass('eye-down');
        $(".ball").css("animation", "lil-bounce 2s linear infinite");
        $(".shadow").css("animation", "shadow-lil-bounce 2s linear infinite");
        $("#questionMark").css("visibility", "hidden");
        break;
      case "listening":
        $("#eye1, #eye2").removeClass('eye-down eye-sleep').addClass('eye');
        $(".ball").css("animation", "breathe 3s linear infinite");
        $(".shadow").css("animation", "none");
        $("#questionMark").css("visibility", "hidden");
        break;
      case "sleeping":
        $("#eye1, #eye2").removeClass('eye eye-down').addClass('eye-sleep');
        $(".ball").css("animation", "to-roll 1s, roll 5s linear infinite");
        $(".shadow").css("animation", "shadow-roll 5s linear infinite");
        $("#questionMark").css("visibility", "hidden");
        break;
      default:
        // TODO output to debug log
        console.log("unknown state: " + state);
    }
  }