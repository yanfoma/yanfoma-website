(function(){

  "use strict";

  // Variables
  // =========================================================================================
  var $html = $('html'),
      $document = $(document),
      $window = $(window),
      i = 0;


  // Scripts initialize
  // ===================
  document.write('<script async src="https://www.youtube.com/iframe_api"></script>');
  document.write('<script async defer src="//maps.googleapis.com/maps/api/js?key=AIzaSyAYjhWq7DvCwCiRKotPu9_IXQxupSQbhuo" type="text/javascript"></script>');

  $(window).on('load', function () {

    // =================================================================================
    // Preloader
    // =================================================================================
    var $preloader = $('#page-preloader');
    $preloader.fadeOut('slow');

    setTimeout(function(){
      $(".countdown").addClass("scaled");
    }, 500);

    var yt_player = $(".player");
    if(yt_player.length){
      yt_player.mb_YTPlayer({
        mute: true,
        containment: '.video-wrapper',
        showControls:false, 
        autoPlay:true, 
        loop:true, 
        startAt:0, 
        quality:'default'
      });
      $(".btn-stop-video").on("click", function(){
        yt_player.YTPTogglePlay();
        $(this).toggleClass("paused");
      });
      $(".btn-mute-video").on("click", function(){
        yt_player.YTPToggleVolume();
        $(this).toggleClass("paused");
      });
    }

    // =================================================================================
    // Google Map
    // =================================================================================
    var map = $(".map");
    if(map.length){
      var mapWrapper = $('#google-map'),
          latlng = new google.maps.LatLng(mapWrapper.data("x-coord"), mapWrapper.data("y-coord")),
          myOptions = {
            scrollwheel: false,
            zoom: 10,
            center: latlng,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            disableDefaultUI: false,
          },
          map = new google.maps.Map(mapWrapper[0], myOptions),
          marker = new google.maps.Marker({
            position: {lat: mapWrapper.data("x-coord"), lng: mapWrapper.data("y-coord")},
            draggable: false,
            animation: false,
            map: map,
            icon: 'img/marker.png'
          }),
          infowindow = new google.maps.InfoWindow({
            content: mapWrapper.data("text")
          });

      marker.addListener('click', function() {
        infowindow.open(map, marker);
      });
    }

    
  });

  $document.ready(function () {

    // =================================================================================
    // Image Slider
    // =================================================================================
    var imgSlider = $('#slides');
    if(imgSlider.length){
      imgSlider.superslides({
        animation: 'fade',
        play: 10000
      });
    }

    // =================================================================================
    // Contact Form
    // =================================================================================
    var contactForm = $(".contact-form, .question-form");
    if(contactForm.length){
      var contactResault = $("body").append("<span class='form-resault'></span>").find(".form-resault");
      contactForm.each(function(){
        var this_form = $(this);
        var contactFormInput = this_form.find(".form-control.required");

        contactFormInput.on("blur", function(){
          if(!$.trim($(this).val())){
            $(this).parent().addClass("input-error");
          }
        });

        contactFormInput.on("focus", function(){
          $(this).parent().removeClass("input-error");
        });

        this_form.on("submit", function() { 
          var form_data1 = $(this).serialize();
          if(!contactFormInput.parent().hasClass("input-error") && contactFormInput.val()){
            $.ajax({
              type: "POST", 
              url: "php/contact.php", 
              data: form_data1,
              success: function() {
                contactResault.addClass("correct");
                contactResault.html("Your data has been sent!");
                setTimeout(function(){
                  contactResault.removeClass("incorrect").removeClass("correct");
                }, 4500);
              }
            });
          } else{ 
            if(contactFormInput.val() === ""){
              var contactFormInputEmpty = contactFormInput.filter(function(){ 
                return $(this).val() === ""; 
              });
              contactFormInputEmpty.parent().addClass("input-error");
            }
            contactResault.addClass("incorrect");
            contactResault.html("You must fill in all required fields");
            setTimeout(function(){
              contactResault.removeClass("incorrect").removeClass("correct");
            }, 4500);
          }
          return false;
        }); 
      });
    }

    // =================================================================================
    // jQuery ajaxChimp
    // =================================================================================
    var chimpForm = $('.subscription-form form');
    chimpForm.ajaxChimp({
      callback: function(){
        var panel = $('.js-result');
        setTimeout(function () {
          panel.removeClass("error").removeClass("success");
        }, 4500);
      },
      language: 'cm',
      url: '//adr.us14.list-manage.com/subscribe/post?u=474217a166648c3e7e0c53b55&amp;id=57bd6ccefc'
      //XXX.us13.list-manage.com/subscribe/post?u=YYY&amp;id=ZZZ
    });
    $.ajaxChimp.translations.cm = {
      'submit': 'Submitting...',
      0: 'We have sent you a confirmation email',
      1: 'Please enter a value',
      2: 'An email address must contain a single @',
      3: 'The domain portion of the email address is invalid (the portion after the @: )',
      4: 'The username portion of the email address is invalid (the portion before the @: )',
      5: 'This email address looks fake or invalid. Please enter a real email address'
    };

    // =================================================================================
    // MFP
    // =================================================================================
    var lightbox = $('[data-lightbox]').not('[data-lightbox="gallery"] [data-lightbox]');
    var lightboxGallery = $('[data-lightbox^="gallery"]');
    if (lightbox.length) {
      lightbox.each(function(){
        var item = $(this);
        item.magnificPopup({
          type: item.data("lightbox")
        });
      });
    }
    if (lightboxGallery.length) {
      lightboxGallery.each(function(){
        $(this).magnificPopup({
          delegate: '[data-lightbox]',
          type: "image",
          mainClass: 'mfp-with-zoom mfp-img-mobile',
          gallery: {
            enabled: true
          },
          zoom: {
            enabled: true,
            duration: 300, // don't foget to change the duration also in CSS
            opener: function(element) {
              return element.find('img');
            }
          }
        });
      });
    }
    var popup_zoom = $('.popup-with-zoom-anim');
    if(popup_zoom.length){
      popup_zoom.magnificPopup({
        type: 'inline',
        fixedContentPos: true,
        fixedBgPos: true,
        overflowY: 'hidden',
        closeBtnInside: true,
        preloader: false,
        midClick: true,
        removalDelay: 300,
        mainClass: 'my-mfp-zoom-in'
      });
    }

    // =================================================================================
    // Countdown
    // =================================================================================
    var countDown = $('.countdown');
    if (countDown.length) {
      countDown.each(function(){
        var item = $(this),
            date = new Date(),
            settings = [],
            time = item[0].getAttribute('data-time'),
            type = item[0].getAttribute('data-type'),
            format = item[0].getAttribute('data-format');
        date.setTime(Date.parse(time)).toLocaleString();
        settings[type] = date;
        settings['format'] = format;
        item.countdown(settings);
      });
    }

    // =================================================================================
    // Style Switcher
    // =================================================================================
    var switcher = $("#style-switcher");
    var switcher_toggle = switcher.find(".toggle-switcher");
    if (switcher.length){
      var body = $("body");

      //switcher toggle
      switcher_toggle.on("click", function(e){
        e.preventDefault();
        switcher.toggleClass("active");
      });

      //color toggle
      var color_stylesheet = $("#colors");
      var color_link = $("#style-switcher .colors > li > a");
      color_link.each(function(){
        var it = $(this);
        it.on("click", function(){
          var color_src = it.attr("data-color-src");
          color_stylesheet.attr("href", color_src);
          return false;
        });
      });

      //layout toggle
      var toggle_link = $(".toggle-list li");
      toggle_link.on("click", function(){
        toggle_link.removeClass("active");
        $(this).addClass("active");
        $window.trigger("resize");
        if($(this).hasClass("on")){
          $(".countdown").addClass("active");          
        }
        if($(this).hasClass("off")){
          $(".countdown").removeClass("active");
        }
      });

      //layout toggle
      var color_themes = $(".color-theme li");
      color_themes.on("click", function(){
        color_themes.removeClass("active");
        $(this).addClass("active");
        $window.trigger("resize");
        if($(this).hasClass("light")){
          body.addClass("light-theme");          
        }
        if($(this).hasClass("dark")){
          body.removeClass("light-theme");
        }
      });

    };

    // =================================================================================
    // FSS
    // =================================================================================
    function initialise() {
      scene.add(mesh);
      scene.add(light);
      container.appendChild(renderer.element);
      window.addEventListener('resize', resize);
    }
    function resize() {
      var width = container.offsetWidth, // No need to query these twice, when in an onresize they can be expensive
          height = container.offsetHeight;
      renderer.setSize(width, height);
      scene.remove(mesh); // Remove the mesh and clear the canvas
      renderer.clear();
      geometry = new FSS.Plane(width, height, 10, 12); // Recreate the plane and then mesh
      mesh = new FSS.Mesh(geometry, material);
      scene.add(mesh); // Readd the mesh
    }
    function animate() {
      now = Date.now() - start;
      light.setPosition(300 * Math.sin(now * 0.001), 200 * Math.cos(now * 0.0005), 60);
      renderer.render(scene);
      requestAnimationFrame(animate);
    }
    var canvasAnim = $('.fss');
    if (canvasAnim.length) {
      var container = document.getElementById('fss'),
          renderer = new FSS.CanvasRenderer(),
          scene = new FSS.Scene(),
          light = new FSS.Light('#111122', '#00C5FF'),
          geometry = new FSS.Plane(container.offsetWidth, container.offsetHeight, 10, 12),
          material = new FSS.Material('#FFFFFF', '#FFFFFF'),
          mesh = new FSS.Mesh(geometry, material),
          now, start = Date.now();

      initialise();
      resize();
      animate();
    }

    // =================================================================================
    // Backgound gradient
    // =================================================================================
    var bg_grad = $('.bg-gradient');
    var colors = new Array(
      [62,35,255],
      [60,255,60],
      [255,35,98],
      [45,175,230],
      [255,0,255],
      [255,128,0]);
    var step = 0;
    var colorIndices = [0,1,2,3];
    //transition speed
    var gradientSpeed = 0.002;

    function updateGradient(){
      var c0_0 = colors[colorIndices[0]];
      var c0_1 = colors[colorIndices[1]];
      var c1_0 = colors[colorIndices[2]];
      var c1_1 = colors[colorIndices[3]];

      var istep = 1 - step;
      var r1 = Math.round(istep * c0_0[0] + step * c0_1[0]);
      var g1 = Math.round(istep * c0_0[1] + step * c0_1[1]);
      var b1 = Math.round(istep * c0_0[2] + step * c0_1[2]);
      var color1 = "rgb("+r1+","+g1+","+b1+")";

      var r2 = Math.round(istep * c1_0[0] + step * c1_1[0]);
      var g2 = Math.round(istep * c1_0[1] + step * c1_1[1]);
      var b2 = Math.round(istep * c1_0[2] + step * c1_1[2]);
      var color2 = "rgb("+r2+","+g2+","+b2+")";

      bg_grad.css({ background: "-webkit-gradient(linear, left top, right top, from("+color1+"), to("+color2+"))"});
      bg_grad.css({ background: "-moz-linear-gradient(left, "+color1+" 0%, "+color2+" 100%)"});
      bg_grad.css({ background: "-ms-linear-gradient(left, "+color1+" 0%, "+color2+" 100%)"});
      
      step += gradientSpeed;
      if (step >= 1){
        step %= 1;
        colorIndices[0] = colorIndices[1];
        colorIndices[2] = colorIndices[3];

        colorIndices[1] = ( colorIndices[1] + Math.floor( 1 + Math.random() * (colors.length - 1))) % colors.length;
        colorIndices[3] = ( colorIndices[3] + Math.floor( 1 + Math.random() * (colors.length - 1))) % colors.length;
      }
    }
    if(bg_grad.length){
      setInterval(updateGradient,10);
    }

    // =======
    // Rain Js
    // =======
    var pageRain = $('#page-rain');
    if (pageRain.length) {
      var image = pageRain[0];
      image.onload = function () {
        var engine = new RainyDay({
          image: this,
          parentElement: $('.rain-wrap')[0]
        });
        engine.rain([[1, 2, 4000]]); // add 4000 drops of size from 1 - 2
        engine.rain(
          [
            [3, 3, 1], [5, 5, 1], [6, 2, 1]
          ],
          100); // every 100ms
      };
      image.crossOrigin = 'anonymous';
      image.src = pageRain.attr('src');
    }

    // =======
    // Particles
    // =======
    var particles = $('#particles-js');
    if (particles.length) {
      particlesJS('particles-js',
        {
          "particles": {
            "number": {
              "value": 100,
              "density": {
                "enable": true,
                "value_area": 800
              }
            },
            "color": {
              "value": "#ffffff"
            },
            "shape": {
              "type": "circle",
              "stroke": {
                "width": 0,
                "color": "#000000"
              },
              "polygon": {
                "nb_sides": 5
              },
              "image": {
                "src": "img/github.svg",
                "width": 100,
                "height": 100
              }
            },
            "opacity": {
              "value": 0.5,
              "random": false,
              "anim": {
                "enable": false,
                "speed": 1.5,
                "opacity_min": 0.1,
                "sync": false
              }
            },
            "size": {
              "value": 3,
              "random": true,
              "anim": {
                "enable": false,
                "speed": 40,
                "size_min": 0.1,
                "sync": false
              }
            },
            "line_linked": {
              "enable": true,
              "distance": 150,
              "color": "#ffffff",
              "opacity": 0.4,
              "width": 1
            },
            "move": {
              "enable": true,
              "speed": 6,
              "direction": "none",
              "random": false,
              "straight": false,
              "out_mode": "out",
              "attract": {
                "enable": false,
                "rotateX": 600,
                "rotateY": 1200
              }
            }
          },
          "interactivity": {
            "detect_on": "canvas",
            "events": {
              "onhover": {
                "enable": false,
                "mode": "repulse"
              },
              "onclick": {
                "enable": false,
                "mode": "push"
              },
              "resize": true
            },
            "modes": {
              "grab": {
                "distance": 400,
                "line_linked": {
                  "opacity": 1
                }
              },
              "bubble": {
                "distance": 400,
                "size": 40,
                "duration": 2,
                "opacity": 8,
                "speed": 3
              },
              "repulse": {
                "distance": 200
              },
              "push": {
                "particles_nb": 4
              },
              "remove": {
                "particles_nb": 2
              }
            }
          },
          "retina_detect": true,
          
        }
      )
    };

    // Stars
    if($("#fullScreen").length){
      var starField = new StarField('fullScreen').render(333, 3);
    }

  });/*document ready end*/

})();/*main function end*/