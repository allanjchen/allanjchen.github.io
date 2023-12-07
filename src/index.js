const containers = document.querySelectorAll('.page-section-sub');

const options = {
  root: null,
  rootMargin: '0px',
  threshold: 0.5, // Adjust this value as needed
};

const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = 1;
      observer.unobserve(entry.target);
    }
  });
}, options);

containers.forEach(container => {
  observer.observe(container);
});


document.addEventListener("DOMContentLoaded", function() {
  let prevScrollPos = window.scrollY;
  function handleScroll(event) {
      let currentScrollPos = window.scrollY;
      let deltaY = event.deltaY;
      if (deltaY < 0) {
          // Scrolling up
          document.getElementById("navbar").style.top = "0";
      } else {
          // Scrolling down
          document.getElementById("navbar").style.top = "-100px";
      }
      prevScrollPos = currentScrollPos;
  }
  window.addEventListener('wheel', function(event) {
      handleScroll(event);
  });
});