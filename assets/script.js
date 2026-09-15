document.getElementById("year").textContent = new Date().getFullYear();

const siteHeader = document.getElementById("site-header");
const onScrollHeader = () => {
  siteHeader.classList.toggle("scrolled", window.scrollY > 20);
};
onScrollHeader();
window.addEventListener("scroll", onScrollHeader, { passive: true });

const navToggle = document.getElementById("nav-toggle");
const siteNav = document.getElementById("site-nav");

navToggle.addEventListener("click", () => {
  const isOpen = siteNav.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

siteNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    siteNav.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

const scrollCue = document.getElementById("scroll-cue");
if (scrollCue) {
  const hideCue = () => scrollCue.classList.add("is-hidden");
  const autoHideTimer = setTimeout(hideCue, 3000);
  window.addEventListener(
    "scroll",
    () => {
      clearTimeout(autoHideTimer);
      hideCue();
    },
    { once: true, passive: true }
  );
}

const navLinks = Array.from(siteNav.querySelectorAll('a[href^="#"]'));
const navTargets = navLinks
  .map((link) => ({ link, el: document.querySelector(link.getAttribute("href")) }))
  .filter((t) => t.el);

function updateActiveNav() {
  const referenceY = 140;
  let current = null;
  let bestTop = -Infinity;
  navTargets.forEach((t) => {
    const top = t.el.getBoundingClientRect().top;
    if (top <= referenceY && top > bestTop) {
      bestTop = top;
      current = t;
    }
  });
  navLinks.forEach((t) => t.classList.remove("active"));
  if (current) current.link.classList.add("active");
}

let navSpyTicking = false;
window.addEventListener(
  "scroll",
  () => {
    if (!navSpyTicking) {
      window.requestAnimationFrame(() => {
        updateActiveNav();
        navSpyTicking = false;
      });
      navSpyTicking = true;
    }
  },
  { passive: true }
);
updateActiveNav();

const revealEls = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );
  revealEls.forEach((el) => observer.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add("is-visible"));
}
