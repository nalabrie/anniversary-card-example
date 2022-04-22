// JS based on https://codepen.io/Sunil_chatterji/pen/LEKova

(function ($) {
  var ww = 0;
  var wh = 0;
  var maxw = 0;
  var minw = 0;
  var maxh = 0;
  var textShadowSupport = true;
  var xv = 0;
  var desktopSnowflakes = ["HAPPY ANNIVERSARY", "✯", "❤", "I LOVE YOU", "EMILY"];
  var mobileSnowflakes = ["✯", "❤"];
  var desktopAbsMax = 100;
  var mobileAbsMax = 50;
  var flakeCount = 0;

  // set starting variables differently if this is a phone
  if (isMobile()) {
    var absMax = mobileAbsMax;
  } else {
    var absMax = desktopAbsMax;
  }
  var snowflakes = mobileSnowflakes; // ! this is NOT a mistake, see below
  // "snowflakes" always starts in mobile mode and changes later if on a
  // desktop once the max amount of flakes has been hit

  $(init);

  function init() {
    var detectSize = function () {
      ww = $(window).width();
      wh = $(window).height();

      maxw = ww + 300;
      minw = -300;
      maxh = wh + 300;
    };

    detectSize();

    $(window).resize(detectSize);

    if (!$("body").css("textShadow")) {
      textShadowSupport = false;
    }

    // animate (call "move()") every 50 milliseconds (20fps)
    setInterval(move, 50);
  }

  function addFlake(initial) {
    flakeCount++;

    var sizes = [
      {
        r: 1.0,
        css: {
          fontSize: 15 + Math.floor(Math.random() * 20) + "px",
          textShadow: "9999px 0 0 rgba(238, 238, 238, 0.5)",
        },
        v: 2,
      },
      {
        r: 0.6,
        css: {
          fontSize: 50 + Math.floor(Math.random() * 20) + "px",
          textShadow: "9999px 0 2px #eee",
        },
        v: 6,
      },
      {
        r: 0.2,
        css: {
          fontSize: 90 + Math.floor(Math.random() * 30) + "px",
          textShadow: "9999px 0 6px #eee",
        },
        v: 12,
      },
      {
        r: 0.1,
        css: {
          fontSize: 150 + Math.floor(Math.random() * 50) + "px",
          textShadow: "9999px 0 24px #eee",
        },
        v: 20,
      },
    ];

    var $nowflake = $(
      '<span class="winternetz">' + snowflakes[Math.floor(Math.random() * snowflakes.length)] + "</span>"
    ).css({
      fontFamily: "Lobster Two, cursive", // this font needs imported in CSS before using here
      color: "#eee",
      display: "block",
      position: "fixed",
      background: "transparent",
      width: "auto",
      height: "auto",
      margin: "0",
      padding: "0",
      textAlign: "left",
      zIndex: -1, // all snowflakes are in the background
    });

    if (textShadowSupport) {
      $nowflake.css("textIndent", "-9999px");
    }

    var r = Math.random();

    var i = sizes.length;

    var v = 0;

    while (i--) {
      if (r < sizes[i].r) {
        v = sizes[i].v;
        $nowflake.css(sizes[i].css);
        break;
      }
    }

    var x = -300 + Math.floor(Math.random() * (ww + 300));

    var y = 0;
    if (typeof initial == "undefined" || !initial) {
      y = -300;
    } else {
      y = -300 + Math.floor(Math.random() * (wh + 300));
    }

    $nowflake.css({
      left: x + "px",
      top: y + "px",
    });

    $nowflake.data("x", x);
    $nowflake.data("y", y);
    $nowflake.data("v", v);
    $nowflake.data("half_v", Math.round(v * 0.5));

    $("body").append($nowflake);
  }

  function isMobile() {
    // determine if this is a mobile device by checking the h1 font size (this is changed in "main.css" when using a phone)
    if ($("h1").css("font-size") != "150px") {
      return true;
    } else {
      return false;
    }
  }

  function move() {
    if (Math.random() > 0.8) {
      xv += -1 + Math.random() * 2;

      if (Math.abs(xv) > 3) {
        xv = 3 * (xv / Math.abs(xv));
      }
    }

    /* throttle code if on a mobile device (or very narrow screen)
     * NOTE: this only runs when the window is resized because the page will initially load in desktop/mobile mode */
    if (isMobile() && absMax == desktopAbsMax) {
      snowflakes = mobileSnowflakes;
      absMax = mobileAbsMax;
    } else if (!isMobile() && absMax == mobileAbsMax) {
      absMax = desktopAbsMax;
    }

    if (!isMobile() && flakeCount == absMax && snowflakes.length != desktopSnowflakes.length) {
      // is in desktop mode and hit max snowflakes
      // switch from mobile snowflakes to desktop snowflakes
      snowflakes = desktopSnowflakes;
    }

    // if "absMax" changed then add/subtract snowflakes
    if (flakeCount < absMax) {
      addFlake();
    } else if (flakeCount > absMax) {
      $("span.winternetz:first").remove();
      flakeCount--;
    }

    $("span.winternetz").each(function () {
      var x = $(this).data("x");
      var y = $(this).data("y");
      var v = $(this).data("v");
      var half_v = $(this).data("half_v");

      y += v;

      x += Math.round(xv * v);
      x += -half_v + Math.round(Math.random() * v);

      // because flakes are rotating, the origin could be +/- the size of the flake offset
      if (x > maxw) {
        x = -300;
      } else if (x < minw) {
        x = ww;
      }

      if (y > maxh) {
        $(this).remove();
        flakeCount--;

        addFlake();
      } else {
        $(this).data("x", x);
        $(this).data("y", y);

        $(this).css({
          left: x + "px",
          top: y + "px",
        });

        // only spin biggest three flake sizes
        if (v >= 6) {
          $(this).animate({ rotate: "+=" + half_v + "deg" }, 0);
        }
      }
    });
  }
})(jQuery);
