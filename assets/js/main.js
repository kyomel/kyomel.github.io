/**
 * Portfolio — Michael Stevan Lapandio
 * Pure vanilla JS — No jQuery, no frameworks
 */
(function () {
  "use strict";

  // ============================================
  // THEME SYSTEM
  // ============================================
  const ThemeManager = {
    init() {
      const saved = localStorage.getItem("theme");
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      const theme = saved || (prefersDark ? "dark" : "light");
      this.apply(theme);

      const toggle = document.getElementById("theme-toggle");
      if (toggle) {
        toggle.addEventListener("click", () => this.toggle());
      }

      // Listen for system preference changes
      window
        .matchMedia("(prefers-color-scheme: dark)")
        .addEventListener("change", (e) => {
          if (!localStorage.getItem("theme")) {
            this.apply(e.matches ? "dark" : "light");
          }
        });
    },

    apply(theme) {
      document.documentElement.setAttribute("data-theme", theme);
      localStorage.setItem("theme", theme);
    },

    toggle() {
      const current =
        document.documentElement.getAttribute("data-theme") || "light";
      this.apply(current === "light" ? "dark" : "light");
    },
  };

  // ============================================
  // PRELOADER
  // ============================================
  const Preloader = {
    init() {
      window.addEventListener("load", () => {
        const preloader = document.getElementById("preloader");
        if (preloader) {
          preloader.classList.add("fade-out");
          setTimeout(() => preloader.remove(), 500);
        }
      });
    },
  };

  // ============================================
  // NAVBAR
  // ============================================
  const Navbar = {
    nav: null,
    toggler: null,
    menu: null,
    links: null,
    navHeight: 70,

    init() {
      this.nav = document.getElementById("mainNav");
      this.toggler = document.getElementById("navbar-toggler");
      this.menu = document.getElementById("navbarMenu");
      this.links = document.querySelectorAll(".nav-link, .navbar-brand");

      if (this.toggler) {
        this.toggler.addEventListener("click", () => this.toggleMenu());
      }

      // Close menu on link click
      this.links.forEach((link) => {
        link.addEventListener("click", () => this.closeMenu());
      });

      // Close menu on outside click
      document.addEventListener("click", (e) => {
        if (
          this.menu &&
          this.menu.classList.contains("nav-open") &&
          !this.menu.contains(e.target) &&
          !this.toggler.contains(e.target)
        ) {
          this.closeMenu();
        }
      });

      // Scroll effects
      window.addEventListener("scroll", () => this.onScroll(), { passive: true });
      this.onScroll();
    },

    toggleMenu() {
      this.toggler.classList.toggle("active");
      this.menu.classList.toggle("nav-open");
      document.body.style.overflow = this.menu.classList.contains("nav-open")
        ? "hidden"
        : "";
    },

    closeMenu() {
      if (this.toggler) this.toggler.classList.remove("active");
      if (this.menu) this.menu.classList.remove("nav-open");
      document.body.style.overflow = "";
    },

    onScroll() {
      const scrollY = window.scrollY;

      // Nav background
      if (this.nav) {
        this.nav.classList.toggle("nav-scrolled", scrollY > 50);
      }

      // Back to top
      const backToTop = document.getElementById("backToTop");
      if (backToTop) {
        backToTop.classList.toggle("show", scrollY > 300);
      }

      // Active nav link
      this.updateActiveLink();
    },

    updateActiveLink() {
      const scrollPos = window.scrollY + this.navHeight + 20;
      const sections = document.querySelectorAll('section[id], div[id="home"]');

      sections.forEach((section) => {
        const top = section.offsetTop - 20;
        const bottom = top + section.offsetHeight;
        const id = section.getAttribute("id");

        if (scrollPos >= top && scrollPos < bottom) {
          document.querySelectorAll(".nav-link").forEach((link) => {
            link.classList.remove("active");
          });
          const activeLink = document.querySelector(
            '.nav-link[href="#' + id + '"]'
          );
          if (activeLink) activeLink.classList.add("active");
        }
      });
    },
  };

  // ============================================
  // SMOOTH SCROLLING
  // ============================================
  const SmoothScroll = {
    init() {
      document.querySelectorAll('a.js-scroll[href*="#"]').forEach((anchor) => {
        anchor.addEventListener("click", (e) => {
          const href = anchor.getAttribute("href");
          if (href === "#") return;

          const target = document.querySelector(href);
          if (target) {
            e.preventDefault();
            const navHeight = 70;
            const top = target.offsetTop - navHeight + 2;
            window.scrollTo({ top, behavior: "smooth" });
          }
        });
      });

      // Back to top
      const backToTop = document.getElementById("backToTop");
      if (backToTop) {
        backToTop.addEventListener("click", (e) => {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: "smooth" });
        });
      }
    },
  };

  // ============================================
  // REVEAL ANIMATIONS
  // ============================================
  const RevealAnimator = {
    init() {
      const elements = document.querySelectorAll(
        ".reveal-up, .reveal-left, .reveal-right"
      );

      if (!("IntersectionObserver" in window)) {
        elements.forEach((el) => el.classList.add("revealed"));
        return;
      }

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const delay = parseInt(entry.target.dataset.delay) || 0;
              setTimeout(() => {
                entry.target.classList.add("revealed");
              }, delay);
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15, rootMargin: "0px 0px -50px 0px" }
      );

      elements.forEach((el) => observer.observe(el));
    },
  };

  // ============================================
  // TYPED EFFECT (no library)
  // ============================================
  const TypedEffect = {
    init() {
      const sliderEl = document.querySelector(".text-slider");
      const itemsEl = document.querySelector(".text-slider-items");
      if (!sliderEl || !itemsEl) return;

      const strings = itemsEl.textContent.split(",").map((s) => s.trim());
      let stringIndex = 0;
      let charIndex = 0;
      let isDeleting = false;
      let isPaused = false;

      const type = () => {
        const current = strings[stringIndex];

        if (isPaused) {
          isPaused = false;
          isDeleting = true;
          setTimeout(type, 1100);
          return;
        }

        if (isDeleting) {
          charIndex--;
          sliderEl.textContent = current.substring(0, charIndex);

          if (charIndex === 0) {
            isDeleting = false;
            stringIndex = (stringIndex + 1) % strings.length;
          }
        } else {
          charIndex++;
          sliderEl.textContent = current.substring(0, charIndex);

          if (charIndex === current.length) {
            isPaused = true;
          }
        }

        const speed = isDeleting ? 30 : 80;
        setTimeout(type, speed);
      };

      // Start after a short delay
      setTimeout(type, 500);
    },
  };

  // ============================================
  // PARTICLES (canvas-based, no library)
  // ============================================
  const Particles = {
    canvas: null,
    ctx: null,
    particles: [],
    connections: [],
    width: 0,
    height: 0,
    mouse: { x: null, y: null, radius: 180 },

    init() {
      this.canvas = document.getElementById("particles-canvas");
      if (!this.canvas) return;

      this.ctx = this.canvas.getContext("2d");
      this.resize();
      this.createParticles();
      this.animate();

      window.addEventListener("resize", () => this.resize());

      const hero = document.querySelector(".hero");
      if (hero) {
        hero.addEventListener("mousemove", (e) => {
          const rect = this.canvas.getBoundingClientRect();
          this.mouse.x = e.clientX - rect.left;
          this.mouse.y = e.clientY - rect.top;
        });

        hero.addEventListener("mouseleave", () => {
          this.mouse.x = null;
          this.mouse.y = null;
        });

        hero.addEventListener("click", (e) => {
          const rect = this.canvas.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          for (let i = 0; i < 3; i++) {
            this.particles.push({
              x: x + (Math.random() - 0.5) * 20,
              y: y + (Math.random() - 0.5) * 20,
              vx: (Math.random() - 0.5) * 2,
              vy: (Math.random() - 0.5) * 2,
              size: Math.random() * 2 + 1,
              opacity: Math.random() * 0.5 + 0.3,
            });
          }
        });
      }
    },

    resize() {
      if (!this.canvas) return;
      const parent = this.canvas.parentElement;
      this.width = parent.offsetWidth;
      this.height = parent.offsetHeight;
      this.canvas.width = this.width;
      this.canvas.height = this.height;
    },

    createParticles() {
      const count = Math.min(60, Math.floor((this.width * this.height) / 15000));
      this.particles = [];
      for (let i = 0; i < count; i++) {
        this.particles.push({
          x: Math.random() * this.width,
          y: Math.random() * this.height,
          vx: (Math.random() - 0.5) * 1.5,
          vy: (Math.random() - 0.5) * 1.5,
          size: Math.random() * 2.5 + 0.5,
          opacity: Math.random() * 0.4 + 0.1,
        });
      }
    },

    animate() {
      if (!this.ctx) return;
      this.ctx.clearRect(0, 0, this.width, this.height);

      // Update & draw particles
      this.particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        // Bounce off edges
        if (p.x < 0 || p.x > this.width) p.vx *= -1;
        if (p.y < 0 || p.y > this.height) p.vy *= -1;

        // Mouse interaction
        if (this.mouse.x !== null) {
          const dx = p.x - this.mouse.x;
          const dy = p.y - this.mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < this.mouse.radius) {
            const force = (this.mouse.radius - dist) / this.mouse.radius;
            p.x += dx * force * 0.02;
            p.y += dy * force * 0.02;
          }
        }

        // Draw particle
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(78, 205, 196, ${p.opacity})`;
        this.ctx.fill();
      });

      // Draw connections
      for (let i = 0; i < this.particles.length; i++) {
        for (let j = i + 1; j < this.particles.length; j++) {
          const dx = this.particles[i].x - this.particles[j].x;
          const dy = this.particles[i].y - this.particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 150) {
            const opacity = (1 - dist / 150) * 0.2;
            this.ctx.beginPath();
            this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
            this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
            this.ctx.strokeStyle = `rgba(78, 205, 196, ${opacity})`;
            this.ctx.lineWidth = 1;
            this.ctx.stroke();
          }
        }
      }

      requestAnimationFrame(() => this.animate());
    },
  };

  // ============================================
  // PORTFOLIO FILTER
  // ============================================
  const PortfolioFilter = {
    init() {
      const buttons = document.querySelectorAll(".filter-btn");
      const cards = document.querySelectorAll(".portfolio-card");

      if (!buttons.length || !cards.length) return;

      buttons.forEach((btn) => {
        btn.addEventListener("click", () => {
          buttons.forEach((b) => b.classList.remove("active"));
          btn.classList.add("active");

          const filter = btn.dataset.filter;

          cards.forEach((card) => {
            const category = card.dataset.category;
            if (filter === "all" || filter === category) {
              card.style.display = "";
              requestAnimationFrame(() => {
                card.style.opacity = "1";
                card.style.transform = "scale(1) translateY(0)";
              });
            } else {
              card.style.opacity = "0";
              card.style.transform = "scale(0.85) translateY(20px)";
              setTimeout(() => {
                card.style.display = "none";
              }, 350);
            }
          });
        });
      });
    },
  };

  // ============================================
  // CONTACT FORM
  // ============================================
  const ContactForm = {
    init() {
      const form = document.getElementById("contactForm");
      if (!form) return;

      form.addEventListener("submit", (e) => {
        e.preventDefault();

        const btn = form.querySelector(".btn-submit");
        const feedback = document.getElementById("formFeedback");
        const originalHTML = btn.innerHTML;

        btn.innerHTML = '<span>Sending...</span> <i class="bi bi-hourglass-split"></i>';
        btn.disabled = true;

        // Simulate submission (no backend)
        setTimeout(() => {
          btn.innerHTML = '<span>Sent!</span> <i class="bi bi-check-lg"></i>';
          form.reset();

          if (feedback) {
            feedback.textContent = "Message sent successfully!";
            feedback.className = "form-feedback success";
          }

          setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.disabled = false;
            if (feedback) {
              feedback.textContent = "";
              feedback.className = "form-feedback";
            }
          }, 2500);
        }, 1200);
      });
    },
  };

  // ============================================
  // SKILL CHIPS ANIMATION
  // ============================================
  const SkillChips = {
    init() {
      const chips = document.querySelectorAll(".skill-chip");
      if (!chips.length || !("IntersectionObserver" in window)) return;

      const section = document.querySelector(".skills-section");
      if (!section) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              chips.forEach((chip, i) => {
                setTimeout(() => {
                  chip.style.opacity = "1";
                  chip.style.transform = "translateY(0)";
                }, i * 80);
              });
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.3 }
      );

      // Initial state
      chips.forEach((chip) => {
        chip.style.opacity = "0";
        chip.style.transform = "translateY(10px)";
        chip.style.transition =
          "opacity 0.4s ease, transform 0.4s ease, background-color 0.35s ease, color 0.35s ease, border-color 0.35s ease, box-shadow 0.35s ease";
      });

      observer.observe(section);
    },
  };

  // ============================================
  // INIT ALL
  // ============================================
  document.addEventListener("DOMContentLoaded", () => {
    ThemeManager.init();
    Preloader.init();
    Navbar.init();
    SmoothScroll.init();
    RevealAnimator.init();
    TypedEffect.init();
    Particles.init();
    PortfolioFilter.init();
    ContactForm.init();
    SkillChips.init();
  });
})();
