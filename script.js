/* ========================================
   LUXURY PORTFOLIO - MAIN JAVASCRIPT
   ======================================== */

document.addEventListener("DOMContentLoaded", () => {
  // ==========================================
  // 1. PRELOADER
  // ==========================================
  const preloader = document.getElementById("preloader");
  window.addEventListener("load", () => {
    setTimeout(() => {
      preloader.classList.add("hidden");
    }, 3000);
  });

  // Fallback: hide preloader after 3s max
  setTimeout(() => {
    preloader.classList.add("hidden");
  }, 3000);

  // ==========================================
  // 2. NAVBAR
  // ==========================================
  const navbar = document.querySelector(".navbar");
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");

  // Scroll effect
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });

  // Mobile toggle
  if (navToggle) {
    navToggle.addEventListener("click", () => {
      navToggle.classList.toggle("active");
      navLinks.classList.toggle("open");
    });
  }

  // Close mobile nav on link click
  document.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("click", () => {
      navToggle.classList.remove("active");
      navLinks.classList.remove("open");
    });
  });

  // Active link based on scroll
  const sections = document.querySelectorAll("section[id]");
  const navItems = document.querySelectorAll('.nav-links a[href^="#"]');

  function highlightNav() {
    const scrollPos = window.scrollY + 150;
    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute("id");
      if (scrollPos >= top && scrollPos < top + height) {
        navItems.forEach((a) => a.classList.remove("active"));
        const active = document.querySelector(`.nav-links a[href="#${id}"]`);
        if (active) active.classList.add("active");
      }
    });
  }
  window.addEventListener("scroll", highlightNav);
  highlightNav();

  // ==========================================
  // 3. HERO PARTICLES
  // ==========================================
  const canvas = document.getElementById("heroParticles");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    let particles = [];
    let mouseX = 0,
      mouseY = 0;
    let animId;

    function resizeCanvas() {
      canvas.width = canvas.parentElement.offsetWidth;
      canvas.height = canvas.parentElement.offsetHeight;
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.6;
        this.speedY = (Math.random() - 0.5) * 0.6;
        this.opacity = Math.random() * 0.5 + 0.1;
        this.isRed = Math.random() < 0.15;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Mouse interaction
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          this.x -= dx * 0.01;
          this.y -= dy * 0.01;
        }

        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        if (this.isRed) {
          ctx.fillStyle = `rgba(164, 22, 26, ${this.opacity})`;
        } else {
          ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity * 0.5})`;
        }
        ctx.fill();
      }
    }

    function initParticles() {
      const count = Math.min(
        Math.floor((canvas.width * canvas.height) / 8000),
        120,
      );
      particles = [];
      for (let i = 0; i < count; i++) {
        particles.push(new Particle());
      }
    }

    function drawConnections() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130) {
            const opacity = (1 - dist / 130) * 0.15;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            if (particles[i].isRed || particles[j].isRed) {
              ctx.strokeStyle = `rgba(164, 22, 26, ${opacity})`;
            } else {
              ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
            }
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
    }

    function animateParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.update();
        p.draw();
      });
      drawConnections();
      animId = requestAnimationFrame(animateParticles);
    }

    canvas.addEventListener("mousemove", (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    });

    initParticles();
    animateParticles();

    window.addEventListener("resize", () => {
      cancelAnimationFrame(animId);
      resizeCanvas();
      initParticles();
      animateParticles();
    });
  }

  // ==========================================
  // 4. TYPED / ROTATING TEXT EFFECT
  // ==========================================
  const rotatingEl = document.getElementById("rotatingText");
  if (rotatingEl) {
    const phrases = [
      "Full-Stack Developer",
      "UI/UX Enthusiast",
      "System Architect",
      "Problem Solver",
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 80;

    function typeEffect() {
      const current = phrases[phraseIndex];

      if (isDeleting) {
        rotatingEl.textContent = current.substring(0, charIndex - 1);
        charIndex--;
        typeSpeed = 40;
      } else {
        rotatingEl.textContent = current.substring(0, charIndex + 1);
        charIndex++;
        typeSpeed = 80;
      }

      if (!isDeleting && charIndex === current.length) {
        typeSpeed = 2000;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typeSpeed = 400;
      }

      setTimeout(typeEffect, typeSpeed);
    }

    typeEffect();
  }

  // ==========================================
  // 5. SCROLL REVEAL ANIMATIONS
  // ==========================================
  const revealElements = document.querySelectorAll(
    ".reveal, .reveal-left, .reveal-right",
  );

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -50px 0px",
    },
  );

  revealElements.forEach((el) => revealObserver.observe(el));

  // ==========================================
  // 6. SKILL BARS ANIMATION
  // ==========================================
  const skillBars = document.querySelectorAll(".skill-bar-fill");

  const skillObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const fill = entry.target;
          const value = fill.getAttribute("data-value");
          fill.style.width = value + "%";
          skillObserver.unobserve(fill);
        }
      });
    },
    { threshold: 0.3 },
  );

  skillBars.forEach((bar) => skillObserver.observe(bar));

  // ==========================================
  // 7. SKILL CATEGORY FILTER
  // ==========================================
  const categoryBtns = document.querySelectorAll(".skills-category-btn");
  const skillCards = document.querySelectorAll(".skill-card");

  categoryBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      categoryBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.getAttribute("data-category");

      skillCards.forEach((card) => {
        const cat = card.getAttribute("data-category");
        if (filter === "all" || cat === filter) {
          card.style.display = "";
          card.style.animation = "fadeInUp 0.5s ease forwards";
        } else {
          card.style.display = "none";
        }
      });

      // Re-trigger skill bars for visible cards
      document
        .querySelectorAll(
          '.skill-card[style*="display: "] .skill-bar-fill, .skill-card:not([style*="display: none"]) .skill-bar-fill',
        )
        .forEach((bar) => {
          const val = bar.getAttribute("data-value");
          bar.style.width = "0%";
          setTimeout(() => {
            bar.style.width = val + "%";
          }, 100);
        });
    });
  });

  // ==========================================
  // 8. 3D TILT EFFECT ON PROJECT CARDS
  // ==========================================
  const tiltCards = document.querySelectorAll(".project-card, .service-card");

  tiltCards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform =
        "perspective(1000px) rotateX(0) rotateY(0) translateY(0)";
    });
  });

  // ==========================================
  // 8b. 3D TILT EFFECT ON HERO PORTRAIT
  // ==========================================
  const heroPortrait = document.getElementById("heroPortrait3D");
  if (heroPortrait) {
    const photoFrame = heroPortrait.querySelector(".hero-photo-frame");

    heroPortrait.addEventListener("mousemove", (e) => {
      const rect = heroPortrait.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -12;
      const rotateY = ((x - centerX) / centerX) * 12;

      // Override the float animation with tilt
      heroPortrait.style.animation = "none";
      heroPortrait.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;

      // Dynamic glow based on mouse position
      const glowIntensity = 0.3 + (Math.abs(rotateX) + Math.abs(rotateY)) / 40;
      if (photoFrame) {
        photoFrame.style.boxShadow = `
          ${rotateY * 2}px ${-rotateX * 2}px 40px rgba(196, 30, 36, ${glowIntensity}),
          0 0 80px rgba(164, 22, 26, ${glowIntensity * 0.5}),
          0 20px 60px rgba(0, 0, 0, 0.5),
          inset 0 0 30px rgba(0, 0, 0, 0.3)
        `;
        photoFrame.style.borderColor = `rgba(196, 30, 36, ${0.4 + glowIntensity})`;
      }
    });

    heroPortrait.addEventListener("mouseleave", () => {
      heroPortrait.style.animation = "";
      heroPortrait.style.transform = "";
      if (photoFrame) {
        photoFrame.style.boxShadow = "";
        photoFrame.style.borderColor = "";
      }
    });
  }

  // ==========================================
  // 9. PARALLAX EFFECT
  // ==========================================
  const parallaxSections = document.querySelectorAll("[data-parallax]");

  window.addEventListener("scroll", () => {
    const scrollY = window.scrollY;
    parallaxSections.forEach((section) => {
      const speed = parseFloat(section.getAttribute("data-parallax")) || 0.3;
      const rect = section.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        const yPos = -((scrollY * speed) % 100);
        section.style.backgroundPositionY = yPos + "px";
      }
    });
  });

  // ==========================================
  // 9b. SCROLL PHOTO TRANSITION (Hero → About)
  // ==========================================
  const heroPhotoFrame = document.querySelector(".hero-photo-frame");
  const aboutImageFrame = document.querySelector(".about-image-frame");
  const aboutDecoration = document.querySelector(".about-image-decoration");
  const heroSection = document.getElementById("hero");
  const aboutSection = document.getElementById("about");

  if (heroPhotoFrame && aboutImageFrame && heroSection && aboutSection) {
    // Create the floating clone
    const scrollPhoto = document.createElement("div");
    scrollPhoto.className = "hero-scroll-photo hidden";
    const cloneImg = document.createElement("img");
    cloneImg.src = heroPhotoFrame.querySelector("img").src;
    cloneImg.alt = "Scroll transition";
    scrollPhoto.appendChild(cloneImg);
    document.body.appendChild(scrollPhoto);

    let isTransitioning = false;
    let rafId = null;

    function getRect(el) {
      const r = el.getBoundingClientRect();
      return {
        top: r.top + window.scrollY,
        left: r.left,
        width: r.width,
        height: r.height,
      };
    }

    function updateScrollPhoto() {
      const scrollY = window.scrollY;
      const viewH = window.innerHeight;

      const heroRect = getRect(heroPhotoFrame);
      const aboutRect = getRect(aboutImageFrame);

      const transStart = heroRect.top + heroRect.height * 0.3;
      const transEnd = aboutRect.top - viewH * 0.15;
      const transRange = transEnd - transStart;

      if (transRange <= 0) {
        scrollPhoto.classList.add("hidden");
        heroPhotoFrame.style.opacity = "";
        aboutImageFrame.style.opacity = "0";
        return;
      }

      if (
        scrollY < transStart - viewH * 0.5 ||
        scrollY > transEnd + viewH * 0.5
      ) {
        scrollPhoto.classList.add("hidden");
        if (scrollY < transStart) {
          heroPhotoFrame.style.opacity = "";
          aboutImageFrame.style.opacity = "0";
          if (aboutDecoration) aboutDecoration.style.opacity = "0";
        } else {
          heroPhotoFrame.style.opacity = "0";
          aboutImageFrame.style.opacity = "1";
          if (aboutDecoration) aboutDecoration.style.opacity = "1";
        }
        isTransitioning = false;
        return;
      }

      let progress = (scrollY - transStart) / transRange;
      progress = Math.max(0, Math.min(1, progress));

      const eased =
        progress < 0.5
          ? 2 * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      if (progress > 0.02 && progress < 0.98) {
        scrollPhoto.classList.remove("hidden");
        scrollPhoto.classList.add("transitioning");
        isTransitioning = true;

        heroPhotoFrame.style.opacity = "0";
        aboutImageFrame.style.opacity = "0";

        const heroViewTop = heroRect.top - scrollY;
        const aboutViewTop = aboutRect.top - scrollY;

        const currentTop = heroViewTop + (aboutViewTop - heroViewTop) * eased;
        const currentLeft =
          heroRect.left + (aboutRect.left - heroRect.left) * eased;
        const currentWidth =
          heroRect.width + (aboutRect.width - heroRect.width) * eased;
        const currentHeight =
          heroRect.height + (aboutRect.height - heroRect.height) * eased;
        const currentRadius = 20 + (16 - 20) * eased;

        const glowPeak = 1 - Math.abs(progress - 0.5) * 2;
        const glowOpacity = 0.2 + glowPeak * 0.4;

        scrollPhoto.style.top = currentTop + "px";
        scrollPhoto.style.left = currentLeft + "px";
        scrollPhoto.style.width = currentWidth + "px";
        scrollPhoto.style.height = currentHeight + "px";
        scrollPhoto.style.borderRadius = currentRadius + "px";
        scrollPhoto.style.boxShadow = `
          0 0 ${30 + glowPeak * 40}px rgba(196, 30, 36, ${glowOpacity}),
          0 0 ${60 + glowPeak * 60}px rgba(164, 22, 26, ${glowOpacity * 0.5}),
          0 20px 60px rgba(0, 0, 0, 0.5)
        `;
        scrollPhoto.style.borderColor = `rgba(196, 30, 36, ${0.3 + glowPeak * 0.4})`;
      } else {
        scrollPhoto.classList.add("hidden");
        scrollPhoto.classList.remove("transitioning");
        isTransitioning = false;

        if (progress <= 0.02) {
          heroPhotoFrame.style.opacity = "";
          aboutImageFrame.style.opacity = "0";
          if (aboutDecoration) aboutDecoration.style.opacity = "0";
        }
        if (progress >= 0.98) {
          heroPhotoFrame.style.opacity = "0";
          aboutImageFrame.style.opacity = "1";
          if (aboutDecoration) aboutDecoration.style.opacity = "1";
        }
      }
    }

    function onScroll() {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateScrollPhoto);
    }

    // Enable on all screen sizes
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  // ==========================================
  // 10. COUNTER ANIMATION
  // ==========================================
  const counters = document.querySelectorAll(".stat-number");

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.getAttribute("data-count"));
          const suffix = el.getAttribute("data-suffix") || "";
          const duration = 2000;
          const start = Date.now();

          function updateCounter() {
            const elapsed = Date.now() - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
            const current = Math.floor(eased * target);
            el.textContent = current + suffix;

            if (progress < 1) {
              requestAnimationFrame(updateCounter);
            } else {
              el.textContent = target + suffix;
            }
          }

          updateCounter();
          counterObserver.unobserve(el);
        }
      });
    },
    { threshold: 0.5 },
  );

  counters.forEach((c) => counterObserver.observe(c));

  // ==========================================
  // 11. CHATBOT
  // ==========================================
  const chatToggle = document.getElementById("chatbotToggle");
  const chatPopup = document.getElementById("chatbotPopup");
  const chatMessages = document.getElementById("chatMessages");
  const chatInput = document.getElementById("chatInput");
  const chatSend = document.getElementById("chatSend");

  const botResponses = {
    "what services do you offer?":
      "I offer Web Development, UI/UX Design, and System Development services. I build modern, scalable, and high-performance digital solutions tailored to your needs.",
    "how can i hire you?":
      "You can hire me by reaching out through the contact form on this website, or send me a direct message on WhatsApp for a faster response!",
    "what is your experience?":
      "I have 6+ years of professional experience in full-stack development, working with clients worldwide on web apps, enterprise systems, and modern UI/UX solutions.",
    "what technologies do you use?":
      "I specialize in React, Next.js, Node.js, PHP/Laravel, and modern CSS. I also work with databases like MySQL and PostgreSQL, and deploy on cloud platforms.",
    "tell me about your projects":
      "I've built e-commerce platforms, SaaS applications, enterprise management systems, and interactive portfolio websites. Check out my portfolio section for details!",
    "what is your rate?":
      "My rates depend on the project scope and complexity. Let's discuss your project requirements on WhatsApp for a personalized quote!",
  };

  const defaultResponse =
    "Thanks for your message! For a more detailed conversation, feel free to reach out via WhatsApp. I'd love to discuss how we can work together.";

  if (chatToggle && chatPopup) {
    chatToggle.addEventListener("click", () => {
      chatToggle.classList.toggle("active");
      chatPopup.classList.toggle("open");
    });
  }

  // Close button in chatbot header
  const chatClose = document.getElementById("chatbotClose");
  if (chatClose) {
    chatClose.addEventListener("click", () => {
      chatToggle.classList.remove("active");
      chatPopup.classList.remove("open");
    });
  }

  function addMessage(text, sender) {
    const msg = document.createElement("div");
    msg.className = `chat-message ${sender}`;
    msg.textContent = text;
    chatMessages.appendChild(msg);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function getBotResponse(input) {
    const lower = input.toLowerCase().trim();

    for (const [key, value] of Object.entries(botResponses)) {
      if (lower.includes(key) || key.includes(lower)) return value;
    }

    // Partial matching
    if (lower.includes("service") || lower.includes("offer"))
      return botResponses["what services do you offer?"];
    if (lower.includes("hire") || lower.includes("work with"))
      return botResponses["how can i hire you?"];
    if (lower.includes("experience") || lower.includes("years"))
      return botResponses["what is your experience?"];
    if (
      lower.includes("tech") ||
      lower.includes("stack") ||
      lower.includes("language")
    )
      return botResponses["what technologies do you use?"];
    if (lower.includes("project") || lower.includes("portfolio"))
      return botResponses["tell me about your projects"];
    if (
      lower.includes("rate") ||
      lower.includes("price") ||
      lower.includes("cost")
    )
      return botResponses["what is your rate?"];
    if (
      lower.includes("hello") ||
      lower.includes("hi") ||
      lower.includes("hey")
    )
      return "Hello! 👋 Welcome! How can I assist you today? Feel free to ask about my services, experience, or projects.";

    return defaultResponse;
  }

  function handleChatSend() {
    const text = chatInput.value.trim();
    if (!text) return;

    addMessage(text, "user");
    chatInput.value = "";

    // Simulate typing delay
    setTimeout(
      () => {
        const response = getBotResponse(text);
        addMessage(response, "bot");
      },
      600 + Math.random() * 500,
    );
  }

  if (chatSend) {
    chatSend.addEventListener("click", handleChatSend);
  }

  if (chatInput) {
    chatInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") handleChatSend();
    });
  }

  // Quick replies
  document.querySelectorAll(".quick-reply").forEach((btn) => {
    btn.addEventListener("click", () => {
      const text = btn.textContent;
      addMessage(text, "user");

      setTimeout(
        () => {
          const response = getBotResponse(text);
          addMessage(response, "bot");
        },
        600 + Math.random() * 500,
      );
    });
  });

  // ==========================================
  // 12. BACK TO TOP
  // ==========================================
  const backToTop = document.getElementById("backToTop");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 500) {
      backToTop.classList.add("visible");
    } else {
      backToTop.classList.remove("visible");
    }
  });

  if (backToTop) {
    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // ==========================================
  // 13. CONTACT FORM
  // ==========================================
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const formData = new FormData(contactForm);
      const name = formData.get("name") || "";
      const email = formData.get("email") || "";
      const subject = formData.get("subject") || "";
      const message = formData.get("message") || "";

      // Build WhatsApp message
      const waMessage = `Halo Hisyam! 👋\n\n*Nama:* ${name}\n*Email:* ${email}\n*Subject:* ${subject}\n\n*Pesan:*\n${message}`;
      const waUrl = `https://wa.me/6285973729267?text=${encodeURIComponent(waMessage)}`;

      // Button animation then redirect
      const btn = contactForm.querySelector(".form-submit");
      const originalText = btn.textContent;
      btn.textContent = "Redirecting to WhatsApp...";
      btn.style.background = "linear-gradient(135deg, #1a7a3a, #25D366)";
      btn.disabled = true;

      setTimeout(() => {
        window.open(waUrl, "_blank");
        btn.textContent = originalText;
        btn.style.background = "";
        btn.disabled = false;
        contactForm.reset();
      }, 800);
    });
  }

  // ==========================================
  // 14. SMOOTH SCROLL FOR ANCHOR LINKS
  // ==========================================
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        const offset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    });
  });

  // ==========================================
  // 15. MAGNETIC BUTTON EFFECT
  // ==========================================
  document.querySelectorAll(".btn").forEach((btn) => {
    btn.addEventListener("mousemove", (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
    });

    btn.addEventListener("mouseleave", () => {
      btn.style.transform = "";
    });
  });

  // ==========================================
  // 16. PROJECT DETAIL MODAL
  // ==========================================
  const projectModal = document.getElementById("projectModal");
  const modalClose = document.getElementById("modalClose");
  const modalImage = document.getElementById("modalImage");
  const modalTitle = document.getElementById("modalTitle");
  const modalDescription = document.getElementById("modalDescription");
  const modalRole = document.getElementById("modalRole");
  const modalYear = document.getElementById("modalYear");
  const modalFeatures = document.getElementById("modalFeatures");
  const modalTech = document.getElementById("modalTech");

  function openProjectModal(card) {
    // Get data from card
    const img = card.querySelector(".project-image-wrapper img");
    const title = card.querySelector(".project-title").textContent;
    const detail = card.getAttribute("data-detail") || card.querySelector(".project-description").textContent;
    const features = card.getAttribute("data-features") || "";
    const role = card.getAttribute("data-role") || "Developer";
    const year = card.getAttribute("data-year") || "2024";
    const techTags = card.querySelectorAll(".tech-tag");

    // Fill modal
    modalImage.src = img.src;
    modalImage.alt = img.alt;
    modalTitle.textContent = title;
    modalDescription.textContent = detail;
    modalRole.textContent = role;
    modalYear.textContent = year;

    // Features
    modalFeatures.innerHTML = "";
    if (features) {
      features.split(",").forEach((f) => {
        const li = document.createElement("li");
        li.textContent = f.trim();
        modalFeatures.appendChild(li);
      });
    }

    // Tech stack
    modalTech.innerHTML = "";
    techTags.forEach((tag) => {
      const span = document.createElement("span");
      span.className = "tech-tag";
      span.textContent = tag.textContent;
      modalTech.appendChild(span);
    });

    // Show modal
    projectModal.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeProjectModal() {
    projectModal.classList.remove("active");
    document.body.style.overflow = "";
  }

  // Click "View Project" button or entire card
  document.querySelectorAll(".project-card").forEach((card) => {
    const viewBtn = card.querySelector(".project-view-btn");
    if (viewBtn) {
      viewBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        openProjectModal(card);
      });
    }
    card.addEventListener("click", () => {
      openProjectModal(card);
    });
    card.style.cursor = "pointer";
  });

  // Close modal
  if (modalClose) {
    modalClose.addEventListener("click", closeProjectModal);
  }

  if (projectModal) {
    projectModal.addEventListener("click", (e) => {
      if (e.target === projectModal) closeProjectModal();
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && projectModal.classList.contains("active")) {
      closeProjectModal();
    }
  });
});
