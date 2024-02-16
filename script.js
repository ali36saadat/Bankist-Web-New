'use strict';

//Document Query Selectors
const header = document.querySelector('.header');
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const nav = document.querySelector('.nav');
const navLinks = document.querySelector('.nav__links');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContent = document.querySelectorAll('.operations__content');
const allSections = document.querySelectorAll('.section');
const imgTargets = document.querySelectorAll('img[data-src]');

//Open Modal Window
const openModal = function () {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

//Close Modal Window
const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

//Modal Window Button Functions
for (let i = 0; i < btnsOpenModal.length; i++)
  btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

//Into View Section 1 ( Learn More Button )
btnScrollTo.addEventListener('click', function () {
  section1.scrollIntoView({
    behavior: 'smooth',
  });
});

//Button Into View Sections
navLinks.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    e.target.classList.contains('nav__link') &&
    !e.target.classList.contains('btn--show-modal')
  ) {
    const linkHref = e.target.getAttribute('href');
    document.querySelector(linkHref).scrollIntoView({ behavior: 'smooth' });
  }
});

//Tabbed Components
tabsContainer.addEventListener('click', function (e) {
  const btnClick = e.target.closest('.operations__tab');

  if (!btnClick) return;

  tabs.forEach(t =>
    t == e.target
      ? t.classList.add('operations__tab--active')
      : t.classList.remove('operations__tab--active')
  );

  tabsContent.forEach((t, i) =>
    i + 1 == btnClick.dataset.tab
      ? t.classList.add('operations__content--active')
      : t.classList.remove('operations__content--active')
  );
});

//Menu Fade Animation
const navHandleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(s => (s != link ? (s.style.opacity = this) : ''));
    logo.style.opacity = this;
  }
};

nav.addEventListener('mouseover', navHandleHover.bind(0.5));
nav.addEventListener('mouseout', navHandleHover.bind(1));

// INTERSECTION OBSERVER API

//Sticky Navigation
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries;

  entry.isIntersecting
    ? nav.classList.remove('sticky')
    : nav.classList.add('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});

headerObserver.observe(header);

//Reveal Sections
const revealSection = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.2,
});

allSections.forEach(s => {
  s.classList.add('section--hidden');
  sectionObserver.observe(s);
});

// Lazy Loading Images
const loadImage = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};

const imageObserver = new IntersectionObserver(loadImage, {
  root: null,
  threshold: 0,
  rootMargin: '-50px',
});

imgTargets.forEach(i => {
  imageObserver.observe(i);
});

// SLIDER

//Slider Function
const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  let curSlide = 0;
  const maxSlide = slides.length;

  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  const nextSlide = function () {
    curSlide === maxSlide - 1 ? (curSlide = 0) : curSlide++;
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const prevSlide = function () {
    curSlide === 0 ? (curSlide = maxSlide - 1) : curSlide--;
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') prevSlide();
    e.key === 'ArrowRight' && nextSlide();
  });

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });

  goToSlide(0);
  createDots();
  activateDot(0);
};

slider();
