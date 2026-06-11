/* ===== Nicky's High Pressure Cleaning — interactions ===== */
(function () {
  "use strict";

  /* Sticky nav background on scroll */
  const nav = document.getElementById("nav");
  const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 20);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* Mobile menu */
  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");
  const closeMenu = () => {
    links.classList.remove("open");
    toggle.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  };
  toggle.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    toggle.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
  });
  links.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeMenu));

  /* Scroll reveal */
  const reveals = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("in"));
  }

  /* Animated stat counters */
  const counters = document.querySelectorAll("[data-count]");
  const runCount = (el) => {
    const target = +el.dataset.count;
    const dur = 1600;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased).toLocaleString();
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if ("IntersectionObserver" in window) {
    const co = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            runCount(e.target);
            co.unobserve(e.target);
          }
        });
      },
      { threshold: 0.6 }
    );
    counters.forEach((el) => co.observe(el));
  } else {
    counters.forEach((el) => (el.textContent = el.dataset.count));
  }

  /* Subtle tilt on hero splash card */
  const tilt = document.querySelector(".tilt");
  if (tilt && window.matchMedia("(pointer: fine)").matches) {
    tilt.addEventListener("mousemove", (e) => {
      const r = tilt.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      tilt.style.transform = `perspective(900px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`;
    });
    tilt.addEventListener("mouseleave", () => (tilt.style.transform = ""));
  }

  /* Footer year */
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  /* Booking form — async submit to Formspree */
  const form = document.getElementById("bookingForm");
  const status = document.getElementById("formStatus");
  const submitBtn = document.getElementById("submitBtn");
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      status.textContent = "Sending your booking…";
      status.className = "form-status";
      submitBtn.disabled = true;
      submitBtn.style.opacity = "0.7";
      try {
        const res = await fetch(form.action, {
          method: "POST",
          body: new FormData(form),
          headers: { Accept: "application/json" },
        });
        if (res.ok) {
          form.reset();
          status.textContent = "🎉 Booking request sent! Nicky will be in touch to confirm.";
          status.className = "form-status ok";
        } else {
          const data = await res.json().catch(() => ({}));
          const msg =
            data.errors && data.errors.length
              ? data.errors.map((x) => x.message).join(", ")
              : "Something went wrong. Please try again.";
          status.textContent = "⚠️ " + msg;
          status.className = "form-status err";
        }
      } catch (err) {
        status.textContent = "⚠️ Network error — please check your connection and try again.";
        status.className = "form-status err";
      } finally {
        submitBtn.disabled = false;
        submitBtn.style.opacity = "";
      }
    });
  }
})();
