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


function generateContentCards(cards) {
  const container = document.getElementById("project-cards");
  // Check if 'container' is found in the document
  if (container) {
    // Check if 'cards' is defined and is an array
    if (Array.isArray(cards) && cards.length > 0) {
      cards.forEach(card => {
        // Create a card element
        const cardElement = document.createElement("div");
        cardElement.classList.add("card");
        // Populate card content
        cardElement.innerHTML = `
          <h2>${card.title}</h2>
          <p>${card.description}</p>
          <img src="${card.imageUrl}" alt="${card.title}" style="width:50px;height:50px">
          <a href="${card.link}" target="_blank">Read more</a>
        `;
        // Append the card to the container
        container.appendChild(cardElement);
      });
    } else {
      console.error("Error: 'cards' is not an array or is empty.");
    }
  } else {
    console.error("Error: 'project-cards' not found in the document.");
  }
}
// Fetch JSON data and generate content cards
fetch("src/project_cards.json")
  .then(response => response.json())
  .then(data => {
    if (data.cards && data.cards.length > 0) {
      generateContentCards(data.cards);
    } else {
      console.error("Error: 'cards' is not an array or is empty.");
    }
  })
  .catch(error => console.error("Error fetching JSON:", error));
