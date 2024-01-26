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
          document.getElementById("navbar").style.top = "-200px";
      }
      prevScrollPos = currentScrollPos;
  }
  window.addEventListener('wheel', function(event) {
      handleScroll(event);
  });
});

// Fetch JSON data and generate content cards
fetch("../src/projects.json")
  .then(response => response.json())
  .then(data => {
    if (data.projects && data.projects.length > 0) {
      generateProjects(data.projects);
    } else {
      console.error("Error: 'projects' is not an array or is empty.");
    }
  })
  .catch(error => console.error("Error fetching JSON:", error));

// Function to generate content cards with a specific order
function generateProjects(projects) {
  const container_card = document.getElementById("project-cards");
  const container_page = document.getElementById("project-page");
  // Check if 'container' is found in the document
  if (container_card || container_page) {
    // Check if 'projects' is defined and is an array
    if (Array.isArray(projects) && projects.length > 0) {
      // Sort the projects based on the 'order' property
      projects.sort((a, b) => (a.order || Infinity) - (b.order || Infinity));
      projects.forEach(project => {
        // Exclude projects
        if (project.exclude) {
          return;
        }
        if (container_card) {
        // Create cards
        const cardLinkElement = document.createElement("a");
        cardLinkElement.classList.add("card-link");
        cardLinkElement.href = project.card.link;
        const cardElement = document.createElement("div");
        cardElement.classList.add("card");
        // Populate card content
        cardElement.innerHTML = `
          <h2>${project.title}</h2>
          <p>${project.card.description}</p>
          <img src="${project.card.image}" alt="Image Not Found">
        `;
        // Append the card content to the link
        cardLinkElement.innerHTML = cardElement.outerHTML;
        // Append the link to container_card
        container_card.appendChild(cardLinkElement);
        }
        if (container_page) {
        // Create pages
        const pageElement = document.createElement("div");
        pageElement.classList.add("page");
        // Populate page content
        pageElement.innerHTML = `
        <img src="${project.page.image_main}" alt="Image Not Found" style="width:600px;height:600px;border-radius:10px;">
          `;
        // Append the container to container_page
        container_page.appendChild(pageElement);
        }
      });
    } else {
      console.error("Error: 'projects' is not an array or is empty.");
    }
  } else {
    console.error("Error: 'project-cards' or 'project-page' not found in the document.");
  }
}