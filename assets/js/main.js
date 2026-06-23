(function ($) {
  "use strict";

  var nav = $("nav");
  var navHeight = nav.outerHeight() || 70;

  $(".navbar-toggler-modern").on("click", function () {
    $("#mainNav").toggleClass("nav-open");
    $(this).toggleClass("active");
  });

  $(".nav-link-modern, .navbar-brand-modern").on("click", function () {
    $("#mainNav").removeClass("nav-open");
    $(".navbar-toggler-modern").removeClass("active");
  });

  // ===== Preloader =====
  $(window).on("load", function () {
    if ($("#preloader").length) {
      $("#preloader").delay(200).fadeOut("slow", function () {
        $(this).remove();
      });
    }
  });

  // ===== Navbar scroll effect =====
  $(window).on("scroll", function () {
    if ($(this).scrollTop() > 50) {
      $("#mainNav").addClass("nav-scrolled");
    } else {
      $("#mainNav").removeClass("nav-scrolled");
    }

    // Back to top button
    if ($(this).scrollTop() > 300) {
      $(".back-to-top").addClass("show");
    } else {
      $(".back-to-top").removeClass("show");
    }

    // Update active nav link
    updateActiveNav();
  });

  // ===== Back to top =====
  $(".back-to-top").on("click", function (e) {
    e.preventDefault();
    $("html, body").animate({ scrollTop: 0 }, 800);
    return false;
  });

  // ===== Smooth scrolling for anchor links =====
  $('a.js-scroll[href*="#"]:not([href="#"])').on("click", function (e) {
    if (
      location.pathname.replace(/^\//, "") ===
        this.pathname.replace(/^\//, "") &&
      location.hostname === this.hostname
    ) {
      var target = $(this.hash);
      target = target.length ? target : $("[name=" + this.hash.slice(1) + "]");
      if (target.length) {
        e.preventDefault();
        var scrollto = target.offset().top - navHeight + 2;
        $("html, body").animate({ scrollTop: scrollto }, 800);
        return false;
      }
    }
  });

  // Scroll to section on load with hash links
  if (window.location.hash) {
    var initial_nav = $(window.location.hash);
    if (initial_nav.length) {
      var scrollto_initial = initial_nav.offset().top - navHeight + 2;
      $("html, body").animate({ scrollTop: scrollto_initial }, 800);
    }
  }

  // ===== Active nav link on scroll =====
  function updateActiveNav() {
    var scrollPos = $(window).scrollTop() + navHeight + 20;
    $('section[id], div[id="home"]').each(function () {
      var top = $(this).offset().top - 20;
      var bottom = top + $(this).outerHeight();
      var id = $(this).attr("id");
      if (scrollPos >= top && scrollPos < bottom) {
        $(".nav-link-modern").removeClass("active");
        $('.nav-link-modern[href="#' + id + '"]').addClass("active");
      }
    });
  }

  // ===== Scroll Reveal Animations =====
  // Uses IntersectionObserver to add 'revealed' class when element enters viewport
  var revealElements = document.querySelectorAll(
    ".reveal-up, .reveal-left, .reveal-right"
  );

  if ("IntersectionObserver" in window && revealElements.length > 0) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var delay = entry.target.getAttribute("data-delay") || 0;
            setTimeout(function () {
              entry.target.classList.add("revealed");
            }, parseInt(delay));
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -50px 0px" }
    );

    revealElements.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    // Fallback: just reveal everything
    revealElements.forEach(function (el) {
      el.classList.add("revealed");
    });
  }

  // ===== Skill chips staggered animation =====
  var skillChips = document.querySelectorAll(".skill-chip");
  if ("IntersectionObserver" in window && skillChips.length > 0) {
    var skillObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            skillChips.forEach(function (chip, index) {
              setTimeout(function () {
                chip.classList.add("chip-animate");
              }, index * 80);
            });
            skillObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );
    var skillsSection = document.querySelector(".skills-section-modern");
    if (skillsSection) skillObserver.observe(skillsSection);
  }

  // ===== Typed.js initialization =====
  if (typeof Typed !== "undefined" && $(".text-slider").length) {
    var typed_strings = $(".text-slider-items").text();
    if (typed_strings) {
      new Typed(".text-slider", {
        strings: typed_strings.split(","),
        typeSpeed: 80,
        loop: true,
        backDelay: 1100,
        backSpeed: 30,
        smartBackspace: true,
      });
    }
  }

  // ===== Counter animation =====
  if (typeof $.fn.counterUp !== "undefined" && $(".counter").length) {
    $(".counter").counterUp({
      delay: 15,
      time: 2000,
    });
  }

  // ===== Contact form submission (demo - no backend) =====
  $(".contact-form-modern").on("submit", function (e) {
    e.preventDefault();
    var $btn = $(this).find(".btn-send-message");
    var originalText = $btn.html();
    $btn.html("Sending...").prop("disabled", true);

    setTimeout(function () {
      $btn.html("Message Sent! &#10003;");
      $(".contact-form-modern")[0].reset();
      setTimeout(function () {
        $btn.html(originalText).prop("disabled", false);
      }, 2500);
    }, 1200);
  });

  // ===== Initialize venobox (lightbox) if available =====
  $(document).ready(function () {
    if ($.fn.venobox) {
      $(".venobox").venobox({ share: false });
    }
  });

  // ===== Particles.js config =====
  if (typeof particlesJS !== "undefined" && $("#particles-js").length) {
    particlesJS("particles-js", {
      particles: {
        number: { value: 60, density: { enable: true, value_area: 900 } },
        color: { value: "#4ecdc4" },
        shape: { type: "circle" },
        opacity: {
          value: 0.4,
          random: true,
          anim: { enable: true, speed: 0.5, opacity_min: 0.1, sync: false },
        },
        size: {
          value: 2.5,
          random: true,
          anim: { enable: true, speed: 2, size_min: 0.3, sync: false },
        },
        line_linked: {
          enable: true,
          distance: 150,
          color: "#4ecdc4",
          opacity: 0.2,
          width: 1,
        },
        move: {
          enable: true,
          speed: 1.5,
          direction: "none",
          random: true,
          straight: false,
          out_mode: "out",
          bounce: false,
        },
      },
      interactivity: {
        detect_on: "canvas",
        events: {
          onhover: { enable: true, mode: "grab" },
          onclick: { enable: true, mode: "push" },
          resize: true,
        },
        modes: {
          grab: { distance: 180, line_linked: { opacity: 0.5 } },
          push: { particles_nb: 3 },
        },
      },
      retina_detect: true,
    });
  }
})(jQuery);
