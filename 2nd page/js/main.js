$(document).ready(function () {
  (function ($) {
    let defaults = {
      duration: 120,
      on: "mouseover",
    };

    $.zoom = function (target, source, img, magnify) {
      ($target = $(target)),
        (position = $target.css("position")),
        ($source = $(source));

      target.style.position = /(absolute|fixed)/.test(position)
        ? position
        : "relative";
      target.style.overflow = "hidden";
      img.style.width = img.style.height = "";

      $(img)
        .addClass("zoomPhoto")
        .css({
          position: "absolute",
          opacity: 0,
        })
        .appendTo(target);

      return {
        init: function () {
          targetWidth = $target.outerWidth();
          targetHeight = $target.outerHeight();

          if (source === target) {
            sourceWidth = targetWidth;
            sourceHeight = targetHeight;
          } else {
            sourceWidth = $source.outerWidth();
            sourceHeight = $source.outerHeight();
          }

          xRatio = (img.width - targetWidth) / sourceWidth;
          yRatio = (img.height - targetHeight) / sourceHeight;

          offset = $source.offset();
        },
        move: function (e) {
          let left = e.pageX - offset.left,
            top = e.pageY - offset.top;

          img.style.left = left * -xRatio + "px";
          img.style.top = top * -yRatio + "px";
        },
      };
    };

    $.fn.zoom = function (options) {
      return this.each(function () {
        let settings = $.extend({}, defaults, options || {}),
          target = (settings.target && $(settings.target)[0]) || this,
          source = this,
          $source = $(source),
          img = document.createElement("img"),
          $img = $(img),
          mousemove = "mousemove.zoom",
          touched = false;

        if (!settings.url) {
          let srcElement = source.querySelector("img");
          if (srcElement) {
            settings.url = srcElement.src;
          }
        }

        img.onload = function () {
          let zoom = $.zoom(target, source, img, settings.magnify);

          function start(e) {
            zoom.init();
            zoom.move(e);

            $img
              .stop()
              .fadeTo(
                $.support.opacity ? settings.duration : 0,
                1,
                $.isFunction(settings.onZoomIn)
                  ? settings.onZoomIn.call(img)
                  : false
              );
          }

          function stop() {
            $img
              .stop()
              .fadeTo(
                settings.duration,
                0,
                $.isFunction(settings.onZoomOut)
                  ? settings.onZoomOut.call(img)
                  : false
              );
          }

          if (settings.on === "hover") {
            $source.on("mousedown.zoom", function (e) {});
          } else if (settings.on === "mouseover") {
            zoom.init();

            $source
              .on("mouseenter.zoom", start)
              .on("mouseleave.zoom", stop)
              .on(mousemove, zoom.move);
          }

          if ($.isFunction(settings.callback)) {
            settings.callback.call(img);
          }
        };

        img.setAttribute("role", "presentation");
        img.alt = "";
        img.src = settings.url;
      });
    };

    $.fn.zoom.defaults = defaults;
  })(window.jQuery);


  $("#bigProduct1").zoom();
  $("#bigProduct2").zoom();

  $("#bigProduct2").hide();

  $(".secondSmall").click(function (event) {
    event.preventDefault();
    $("#bigProduct1").hide();
    $("#bigProduct2").show();
    $(".secondSmall").css({ border: "1px solid black" });
    $(".firstSmall").css("border", "");
  });

  $(".firstSmall").click(function (event) {
    event.preventDefault();
    $("#bigProduct2").hide();
    $("#bigProduct1").show();
    $(".firstSmall").css({
      border: "1px solid black",
    });
    $(".secondSmall").css("border", "");
  });
});
