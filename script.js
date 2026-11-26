/* =========================================
   Diligent Tours - Scripts
   ========================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* ---------- Navbar: shrink on scroll + back-to-top ---------- */
  const navbar = document.getElementById("navbar");
  const backToTop = document.getElementById("backToTop");

  const onScroll = () => {
    const y = window.scrollY;
    navbar.classList.toggle("scrolled", y > 60);
    backToTop.classList.toggle("show", y > 500);
    highlightNav();
  };
  window.addEventListener("scroll", onScroll);

  backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  /* ---------- Mobile menu ---------- */
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");

  menuToggle.addEventListener("click", () => {
    menuToggle.classList.toggle("open");
    navLinks.classList.toggle("open");
  });

  navLinks.querySelectorAll("a").forEach(link =>
    link.addEventListener("click", () => {
      menuToggle.classList.remove("open");
      navLinks.classList.remove("open");
    })
  );

  /* ---------- Active nav link on scroll ---------- */
  const sections = document.querySelectorAll("section[id]");
  function highlightNav() {
    const pos = window.scrollY + 120;
    sections.forEach(sec => {
      const link = navLinks.querySelector(`a[href="#${sec.id}"]`);
      if (!link) return;
      const inView = pos >= sec.offsetTop && pos < sec.offsetTop + sec.offsetHeight;
      link.classList.toggle("active", inView);
    });
  }

  /* ---------- Typing effect in hero ---------- */
  const words = ["Adventure", "Escape", "Getaway", "Journey"];
  const typedEl = document.getElementById("typed");
  let wordIndex = 0, charIndex = words[0].length, deleting = true;

  function type() {
    const word = words[wordIndex];
    typedEl.textContent = word.substring(0, charIndex);

    if (deleting) {
      charIndex--;
      if (charIndex < 0) {
        deleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        charIndex = 0;
      }
    } else {
      charIndex++;
      if (charIndex > words[wordIndex].length) {
        deleting = true;
        setTimeout(type, 1800);   // pause on full word
        return;
      }
    }
    setTimeout(type, deleting ? 60 : 110);
  }
  setTimeout(type, 2200);

  /* ---------- Scroll reveal ---------- */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll(".reveal").forEach((el, i) => {
    // small stagger for elements in the same group
    el.style.transitionDelay = `${(i % 3) * 0.12}s`;
    revealObserver.observe(el);
  });

  /* ---------- Animated counters ---------- */
  const counters = document.querySelectorAll(".counter");
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = +el.dataset.target;
      const duration = 1800;
      const start = performance.now();

      const update = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // ease-out
        el.textContent = Math.floor(eased * target).toLocaleString();
        if (progress < 1) requestAnimationFrame(update);
      };
      requestAnimationFrame(update);
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => counterObserver.observe(c));

  /* ---------- Destination filter ---------- */
  const filterBtns = document.querySelectorAll(".filter-btn");
  const cards = document.querySelectorAll(".dest-card");

  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const filter = btn.dataset.filter;

      cards.forEach(card => {
        const match = filter === "all" || card.dataset.category === filter;
        if (match) {
          card.classList.remove("hide");
          card.animate(
            [{ opacity: 0, transform: "scale(0.9)" }, { opacity: 1, transform: "scale(1)" }],
            { duration: 400, easing: "ease-out" }
          );
        } else {
          card.classList.add("hide");
        }
      });
    });
  });

  /* ---------- Testimonial slider ---------- */
  const slides = document.getElementById("slides");
  const slideCount = slides.children.length;
  const dotsWrap = document.getElementById("dots");
  let current = 0;
  let autoPlay;

  for (let i = 0; i < slideCount; i++) {
    const dot = document.createElement("span");
    dot.className = "dot" + (i === 0 ? " active" : "");
    dot.addEventListener("click", () => { goTo(i); restart(); });
    dotsWrap.appendChild(dot);
  }
  const dots = dotsWrap.querySelectorAll(".dot");

  function goTo(i) {
    current = (i + slideCount) % slideCount;
    slides.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, idx) => d.classList.toggle("active", idx === current));
  }
  function restart() {
    clearInterval(autoPlay);
    autoPlay = setInterval(() => goTo(current + 1), 5000);
  }

  document.getElementById("prevBtn").addEventListener("click", () => { goTo(current - 1); restart(); });
  document.getElementById("nextBtn").addEventListener("click", () => { goTo(current + 1); restart(); });
  restart();

  /* ---------- Toast + form handling ---------- */
  const toast = document.getElementById("toast");
  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 3000);
  }

  document.getElementById("searchForm").addEventListener("submit", e => {
    e.preventDefault();
    showToast("🔍 Searching the best tours for you...");
    setTimeout(() => document.getElementById("packages").scrollIntoView({ behavior: "smooth" }), 600);
  });

  document.getElementById("newsletterForm").addEventListener("submit", e => {
    e.preventDefault();
    showToast("🎉 Thanks for subscribing!");
    e.target.reset();
  });

  document.getElementById("contactForm").addEventListener("submit", e => {
    e.preventDefault();
    showToast("✅ Message sent! We'll contact you soon.");
    e.target.reset();
  });

  /* ---------- Footer year ---------- */
  document.getElementById("year").textContent = new Date().getFullYear();

  onScroll();
});
