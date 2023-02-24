"use strict";

const header = document.querySelector(".header");
const section1 = document.querySelector(".section-1");
const nav = document.querySelector(".header__nav");
const toggleMenue = document.querySelector(".header__menu ");
const navList = document.querySelector(".header__list");
const container = document.querySelector(".container");
const slider = document.querySelector(".slider__container");
const slides = document.querySelectorAll(".slider__slides");
const rightArrow = document.querySelector(".slider__arrow--right");
const leftArrow = document.querySelector(".slider__arrow--left");
const dotsContainer = document.querySelector(".slider__dots");
const sliderBox = document.querySelectorAll(".slider__text");
const links = document.querySelectorAll(".header__link");
const allSections = document.querySelectorAll(".section");
const activeSection = document.querySelectorAll(".section--active");
const scrollToTop = document.querySelector(".scroll");
const portCard = document.querySelectorAll(".portfolio__card");
const portFilter = document.querySelector(".portfolio__filter");
const portCategories = document.querySelectorAll(".portfolio__category");
const overlay = document.querySelector(".overlay");
const overlayCard = document.querySelector(".overlay__card");
const overlayImg = document.querySelector(".overlay__img");

const getScroll = function (left = 0, top = 0) {
  window.scrollTo({
    left,
    top,
    behavior: "smooth",
  });
};
const showHideArrow = (arrow, prop) => arrow.classList[prop]("hidden");

/// show menu ///
toggleMenue.addEventListener("click", function () {
  navList.classList.toggle("header__list--active");
});

/// Hide menu ///
nav.addEventListener("click", function (e) {
  if (e.target.closest(".header__nav")) {
    const target = e.target;
    if (!target) return;
    if (target !== toggleMenue)
      navList.classList.remove("header__list--active");
  }
});

/// Implement navigation ///
nav.addEventListener("click", function (e) {
  if (e.target.classList.contains("header__link")) {
    e.preventDefault();

    const id = e.target.getAttribute("href");

    if (id === "index.html") {
      getScroll();
    } else {
      const section = document.querySelector(id);

      getScroll(
        section.getBoundingClientRect().x + window.scrollX,
        section.getBoundingClientRect().y + window.scrollY
      );
    }
  }
});

/// implement sticky header ///
const stickyCallback = function (entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) {
    // Add sticky nav & show scroll btn
    header.classList.add("header__sticky");
    scrollToTop.style.transform = "none";
  } else {
    // Remove sticky nav & hide scroll btn
    header.classList.remove("header__sticky");
    scrollToTop.style.transform = "translateY(50px)";
  }
};

const stickyObserver = new IntersectionObserver(stickyCallback, {
  root: null,
  threshold: 0,
  rootMargin: `-${header.getBoundingClientRect().height}px`,
});

stickyObserver.observe(section1);

/// Activate links ///
const linksCallback = function (entries, _) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  if (entry.isIntersecting) {
    const id = entry.target.id;
    localStorage.setItem("id", `${entry.target.id}`);
    links.forEach((link) => {
      const section = link.dataset.section;
      link.classList.remove("header__link--active");
      if (id === section) {
        link.classList.add("header__link--active");
      }
    });
  }
};

const linksObserver = new IntersectionObserver(linksCallback, {
  root: null,
  threshold: [0.4],
});

activeSection.forEach((section) => linksObserver.observe(section));

window.addEventListener("load", function () {
  // Hide slider left arrow
  leftArrow.classList.add("hidden");
  // Check local storage
  if (this.localStorage.getItem("id")) {
    // Add active class to link
    links.forEach((link) => {
      const section = link.dataset.section;
      link.classList.remove("header__link--active");
      if (this.localStorage.getItem("id") === section) {
        link.classList.add("header__link--active");
      }
    });
  }
});

/// implement a slider ///
// 1) create dots
const createDots = function () {
  // create dots from number of slides
  slides.forEach((_, i) => {
    const dot = `
    <li class="slider__dot" data-slide = '${i}'></li>
    `;
    // Render dot
    dotsContainer.insertAdjacentHTML("beforeend", dot);
  });
};

createDots();

const dots = document.querySelectorAll(".slider__dot");

const activateDots = function (active) {
  dots.forEach((dot) => dot.classList.remove("slider__dot--active"));
  active.classList.add("slider__dot--active");
};

activateDots(dots[0]);

let current = 0;

slides.forEach((slide, i) => {
  slide.style.transform = `translateX(${100 * i}%)`;
});

const goToSlide = function (slide) {
  slides.forEach((s, i) => {
    s.style.transform = `translateX(${100 * (i - slide)}%)`;
  });
  // activate dot related to the current slide
  activateDots(dots[slide]);
};

const slidesLimit = slides.length - 1;

const nextSlide = function () {
  // current >= slidesLimit ? (current = 0) : current++;
  // case in a last slide
  current === slidesLimit ? (current = slidesLimit) : current++;

  // current === slidesLimit
  //   ? rightArrow.classList.add("hidden")
  //   : leftArrow.classList.remove("hidden");
  current === slidesLimit
    ? showHideArrow(rightArrow, "add")
    : showHideArrow(leftArrow, "remove");

  goToSlide(current);
};

const previousSlide = function () {
  // current <= 0 ? (current = slidesLimit) : current--;
  // case in a first slide
  current === 0 ? (current = 0) : current--;

  // current === 0
  //   ? leftArrow.classList.add("hidden")
  //   : rightArrow.classList.remove("hidden");
  current === 0
    ? showHideArrow(leftArrow, "add")
    : showHideArrow(rightArrow, "remove");

  goToSlide(current);
};

rightArrow.addEventListener("click", nextSlide);

leftArrow.addEventListener("click", previousSlide);

// 2) control slides from dots
dotsContainer.addEventListener("click", function (e) {
  if (e.target.classList.contains("slider__dot")) {
    const slide = e.target.dataset.slide;
    goToSlide(slide);
    activateDots(e.target);
  }
});

document.addEventListener("keydown", function (e) {
  switch (e.key) {
    case "ArrowRight":
      nextSlide();
      break;
    case "ArrowLeft":
      previousSlide();
      break;
  }
});

// 3) Box observer
const boxCallback = function (entries, _) {
  const [entry] = entries;
  if (entry.isIntersecting) {
    const ele = entry.target.children[1].dataset.animation;
    entry.target.children[1].classList.add(`slider__animation--${ele}`);
  }
};

const boxObserver = new IntersectionObserver(boxCallback, {
  root: null,
  threshold: [1],
});

slides.forEach((slide) => boxObserver.observe(slide));

/// Scroll to top ///
scrollToTop.addEventListener("click", getScroll);

/// Implement filter ///
portFilter.addEventListener("click", function (e) {
  if (e.target.classList.contains("portfolio__category")) {
    // Activate clicked category
    portCategories.forEach((cat) => {
      cat.classList.remove("portfolio__category--active");
      e.target.classList.add("portfolio__category--active");
    });

    const selected = e.target.dataset.filter;
    portCard.forEach((card) => {
      const selectedCard = card.dataset.filter;
      selectedCard === selected
        ? (card.style.display = "block")
        : (card.style.display = "none");
    });

    if (selected === "all") {
      portCard.forEach((card) => {
        card.style.display = "block";
      });
    }
  }
});

/// show card ///
const showHide = function (e) {
  const targetCard = e.target.closest(".portfolio__card");

  targetCard
    .querySelector(".portfolio__text")
    .classList[`${this.prop}`]("portfolio__text--visible");

  targetCard
    .querySelector(".portfolio__selection")
    .classList[`${this.prop}`]("portfolio__selection--visible");
};

const hide = function (e) {
  const targetCard = e.target.closest(".portfolio__card");

  targetCard
    .querySelector(".portfolio__text")
    .classList[`${this.prop}`]("portfolio__text--visible");

  targetCard
    .querySelector(".portfolio__selection")
    .classList[`${this.prop}`]("portfolio__selection--visible");
};

portCard.forEach((card) => {
  card.addEventListener("mouseover", showHide.bind({ prop: "add" }));
  card.addEventListener("mouseout", showHide.bind({ prop: "remove" }));
});

// Show overlay
portCard.forEach((port) => {
  port.addEventListener("click", function (e) {
    if (e.target.classList.contains("portfolio__selection")) {
      overlay.classList.remove("hidden");
      const imgSrc = e.target
        .closest(".portfolio__card")
        .querySelector("img").src;
      overlayImg.src = imgSrc;
    }
  });
});

overlayCard.addEventListener("click", function (e) {
  if (e.target.classList.contains("overlay__close")) {
    const closeOverlay = e.target;
    if (!closeOverlay) return;
    console.log(closeOverlay.closest(".overlay"));
    closeOverlay.closest(".overlay").classList.add("hidden");
  }
});
