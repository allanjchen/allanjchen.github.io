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


document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM Conetnt Loaded!");
  fetch("src/project_cards.json") 
      .then(response => response.json())
      .then(data => { 
          generateContentCards(data.project-cards);
      })
      .catch(error => console.error("Error fetching JSON:", error));
});

function generateContentCards(cards) {
  const container = document.getElementById("project-cards");
  cards.forEach(card => {
      const cardElement = document.createElement("div");
      cardElement.classList.add("card");
      cardElement.innerHTML = `
          <h1>${card.title}</h1>
          <p>${card.description}</p>
          <img src="${card.imageUrl}" alt="${card.title}">
          <a href="${card.link}" target="_blank">Read more</a>
      `;
      container.appendChild(cardElement);
  });
}
