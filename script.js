/* ============================================================
   Diligent Tours Sri Lanka — interactions
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  /* ---------- Sticky navbar ---------- */
  const navbar = document.getElementById("navbar");
  const backToTop = document.getElementById("backToTop");
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");

  const onScroll = () => {
    const y = window.scrollY;
    navbar.classList.toggle("scrolled", y > 40);
    backToTop.classList.toggle("visible", y > 500);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  const closeMenu = () => {
    navLinks.classList.remove("open");
    navbar.classList.remove("menu-open");
    menuToggle.setAttribute("aria-expanded", "false");
  };
  menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    navbar.classList.toggle("menu-open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });
  navLinks.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
  window.addEventListener("resize", () => { if (window.innerWidth > 992) closeMenu(); });

  /* ---------- Active nav link ---------- */
  const navAnchors = [...navLinks.querySelectorAll("a")];
  const sections = navAnchors
    .map((a) => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);
  if ("IntersectionObserver" in window) {
    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navAnchors.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === `#${entry.target.id}`));
      });
    }, { rootMargin: "-35% 0px -55% 0px" });
    sections.forEach((s) => navObserver.observe(s));
  }

  /* ---------- Reveal on scroll ---------- */
  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("show");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12 });
    revealItems.forEach((el) => revealObserver.observe(el));
  } else {
    revealItems.forEach((el) => el.classList.add("show"));
  }

  /* ---------- Counters ---------- */
  const counters = document.querySelectorAll(".counter");
  const runCounter = (el) => {
    const target = Number(el.dataset.target || 0);
    const duration = 1600;
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      el.textContent = Math.floor(progress * target).toLocaleString();
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if ("IntersectionObserver" in window) {
    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        runCounter(entry.target);
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.6 });
    counters.forEach((el) => counterObserver.observe(el));
  } else {
    counters.forEach((el) => { el.textContent = Number(el.dataset.target || 0).toLocaleString(); });
  }

  /* ---------- Destination filters ---------- */
  const filterBtns = document.querySelectorAll(".filter-btn");
  const destCards = document.querySelectorAll(".dest-card");
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const filter = btn.dataset.filter;
      destCards.forEach((card) => {
        card.classList.toggle("hidden", filter !== "all" && card.dataset.category !== filter);
      });
    });
  });

  /* ---------- Testimonial slider ---------- */
  const slides = [...document.querySelectorAll("#slides .slide")];
  const dotsWrap = document.getElementById("dots");
  let current = 0;
  let sliderTimer;

  slides.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "dot";
    dot.setAttribute("aria-label", `Show review ${i + 1}`);
    dot.addEventListener("click", () => showSlide(i));
    dotsWrap.appendChild(dot);
  });

  function showSlide(index) {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => slide.classList.toggle("active", i === current));
    [...dotsWrap.children].forEach((dot, i) => dot.classList.toggle("active", i === current));
  }
  function nextSlide() { showSlide(current + 1); }
  function startSlider() { sliderTimer = setInterval(nextSlide, 6500); }
  function stopSlider() { clearInterval(sliderTimer); }

  document.getElementById("nextBtn").addEventListener("click", () => { stopSlider(); nextSlide(); startSlider(); });
  document.getElementById("prevBtn").addEventListener("click", () => { stopSlider(); showSlide(current - 1); startSlider(); });
  showSlide(0);
  startSlider();
  document.querySelector(".slider")?.addEventListener("mouseenter", stopSlider);
  document.querySelector(".slider")?.addEventListener("mouseleave", startSlider);

  /* ---------- Itinerary modal ---------- */
  const itineraryData = {
    3: {
      title: "3 Days — Colombo & Sigiriya Escape",
      route: "Colombo → Sigiriya → Colombo",
      days: [
        "Day 1: Airport pickup, Colombo city tour and overnight stay.",
        "Day 2: Drive to Sigiriya, climb Lion Rock and visit the village.",
        "Day 3: Dambulla cave temple en route, return to Colombo for departure."
      ]
    },
    5: {
      title: "5 Days — Cultural Triangle",
      route: "Sigiriya → Dambulla → Kandy → Colombo",
      days: [
        "Day 1: Arrival and transfer to Sigiriya.",
        "Day 2: Sigiriya Rock Fortress and ancient villages.",
        "Day 3: Dambulla cave temples, then onward to Kandy.",
        "Day 4: Temple of the Tooth, Kandy lake and a cultural show.",
        "Day 5: Departure transfer to the airport."
      ]
    },
    7: {
      title: "7 Days — Hills & Shores",
      route: "Kandy → Nuwara Eliya → Ella → Mirissa → Galle",
      days: [
        "Day 1: Arrival and journey to Kandy.",
        "Day 2: Kandy sights, then into the hill country.",
        "Day 3: Nuwara Eliya tea plantations and waterfalls.",
        "Day 4: Scenic train to Ella and Nine Arch Bridge.",
        "Day 5: Down to Mirissa for beach time.",
        "Day 6: Whale watching and Galle Fort sunset.",
        "Day 7: Return to Colombo for departure."
      ]
    },
    10: {
      title: "10 Days — Wildlife & Wonders",
      route: "Sigiriya → Kandy → Yala → Ella → Colombo",
      days: [
        "Day 1: Arrival and transfer to Sigiriya.",
        "Day 2: Sigiriya and Dambulla.",
        "Day 3: Travel to Kandy via the ancient capitals.",
        "Day 4: Kandy and Peradeniya Gardens.",
        "Day 5: Train journey into Nuwara Eliya.",
        "Day 6: Tea country and waterfalls.",
        "Day 7: Ella and the Nine Arch Bridge.",
        "Day 8: Yala National Park safari.",
        "Day 9: Return toward Colombo with coastal stops.",
        "Day 10: Departure."
      ]
    },
    14: {
      title: "14 Days — Grand Sri Lanka",
      route: "Colombo → Sigiriya → Kandy → Ella → Yala → Mirissa → Galle",
      days: [
        "Days 1-2: Arrival and Colombo orientation.",
        "Days 3-4: Sigiriya, Dambulla and village life.",
        "Days 5-6: Kandy and the Temple of the Tooth.",
        "Days 7-8: Nuwara Eliya tea hills and the scenic train.",
        "Days 9-10: Ella, waterfalls and Nine Arch Bridge.",
        "Day 11: Yala wildlife safari.",
        "Days 12-13: Mirissa beach and Galle Fort.",
        "Day 14: Final transfer to the airport."
      ]
    }
  };

  const modal = document.getElementById("itineraryModal");
  const modalTitle = document.getElementById("modalTitle");
  const modalRoute = document.getElementById("modalRoute");
  const modalDays = document.getElementById("modalDays");

  const openModal = (key) => {
    const data = itineraryData[key];
    if (!data) return;
    modalTitle.textContent = data.title;
    modalRoute.textContent = data.route;
    modalDays.replaceChildren(...data.days.map((d) => {
      const li = document.createElement("li");
      li.textContent = d;
      return li;
    }));
    modal.hidden = false;
    document.body.style.overflow = "hidden";
  };
  const closeModal = () => {
    modal.hidden = true;
    document.body.style.overflow = "";
  };

  document.querySelectorAll(".itinerary-card").forEach((card) => {
    card.querySelector("button")?.addEventListener("click", () => openModal(card.dataset.itinerary));
  });
  modal.querySelectorAll("[data-close-modal]").forEach((el) => el.addEventListener("click", closeModal));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !modal.hidden) closeModal(); });

  /* ---------- Toast + inquiry form ---------- */
  const toast = document.getElementById("toast");
  let toastTimer;
  const showToast = (message) => {
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 4000);
  };

  const inquiryForm = document.getElementById("inquiryForm");
  inquiryForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    showToast("Ayubowan! Thank you — your enquiry has been noted. We'll contact you shortly.");
    inquiryForm.reset();
  });

  backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  /* ---------- Footer year ---------- */
  document.getElementById("year").textContent = new Date().getFullYear();
});
