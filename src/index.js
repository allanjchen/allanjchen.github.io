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
  // Check if navbar element exists before proceeding
  const navbar = document.getElementById("navbar");
  if (!navbar) {
    return;
  }
  let prevScrollPos = window.scrollY;
  function handleScroll(event) {
      let currentScrollPos = window.scrollY;
      let deltaY = event.deltaY;
      if (deltaY < 0) {
          // Scrolling up
          navbar.style.top = "0";
      } else {
          // Scrolling down
          navbar.style.top = "-1000px";
      }
      prevScrollPos = currentScrollPos;
  }
  window.addEventListener('wheel', function(event) {
      handleScroll(event);
  });
});

// Fetch JSON data and generate content cards
fetch("/src/projects.json")
  .then(response => response.json())
  .then(data => {
    if (data.projects && data.projects.length > 0) {
      projectPreChecks(data.projects);
      generateProjectCards(data.projects);
      generateProjectPages(data.projects);
      generateFeaturedProjects(data.projects);
    } else {
      console.error("Error: 'projects' is not an array or is empty.");
    }
  })
  .catch(error => console.error("Error fetching JSON:", error));

function projectPreChecks(projects) {
  var IDNUMS = [];
  for (let i = 0; i < projects.length; i++) {
    if (IDNUMS.includes(projects[i].IDNUM)) {
      projects[i].IDNUM++;
      IDNUMS.push(projects[i].IDNUM);
    } else if (projects[i].IDNUM < 1) {
      projects[i].IDNUM = Math.max(IDNUMS) + 1;
      IDNUMS.push(projects[i].IDNUM);
    } else {
      IDNUMS.push(projects[i].IDNUM);
    }
  }
}

// Function to generate content cards with a specific order
function generateProjectCards(projects) {
  const container_card = document.getElementById("project-cards");
  // Check if 'container' is found in the document
  if (container_card) {
    // Check if 'projects' is defined and is an array
    if (Array.isArray(projects) && projects.length > 0) {
      // Sort the projects based on the 'order' property
      projects.sort((a, b) => (a.order || Infinity) - (b.order || Infinity));
      projects.forEach(project => {
        // Exclude projects
        if (project.exclude) {
          return;
        }
        // Create cards
        const cardLinkElement = document.createElement("a");
        cardLinkElement.classList.add("card-link");
        cardLinkElement.href = project.card.link;
        const cardElement = document.createElement("div");
        cardElement.classList.add("card");
        // Populate card content
        cardElement.innerHTML = `
          <img src="${project.card.image}" alt="Image Not Found">
          <div class="flexbox-2">
            <h1>${project.title}</h1>
            <p>${project.IDNUM}</p>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
            Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. 
            Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. 
            Praesent mauris.
            </p>
          </div>
        `;
        // Append the card content to the link
        cardLinkElement.innerHTML = cardElement.outerHTML;
        // Append the link to container_card
        container_card.appendChild(cardLinkElement);
      });
    } else {
      console.error("Error: 'projects' is not an array or is empty.");
    }
  }
}

function generateProjectPages(projects) {
  for (let i = 0; i < projects.length; i++) {
    var pageTemp = "project-page-" + JSON.stringify(i+1);
    const container_page = document.getElementById(pageTemp);
    if (container_page) {
      if (Array.isArray(projects) && projects.length > 0) {
          // Exclude projects
          if (projects[i].exclude) {
            continue;
          }
          const pageElement = document.createElement("div");
          pageElement.classList.add("page");
          // Populate page content
          pageElement.innerHTML = `
          <div style="display:flex;flex-direction:row;width:60vw;">
            <a href = "/pages/project_archive.html" class="button-1 b1-slide-right" style="margin:15px 0;">Return To Project Archive</a>
          </div>
          <div style="display:flex;flex-direction:row;width:60vw;">
              <img src="${projects[i].page.image_main}" alt="Image Not Found" style="width:600px;height:600px;border-radius:10px;">
              <div class="flexbox-1">
                <h1>${projects[i].title}</h1>
                <p>${projects[i].page.description}</p>
              </div>
            </div>
            `;
          // Append the container to container_page
          container_page.appendChild(pageElement);
      } else {
        console.error("Error: 'projects' is not an array or is empty.");
      }
    }
  }
}

function generateFeaturedProjects(projects) {
  const container_card = document.getElementById("featured-project-collapsibles");
  // Check if 'container' is found in the document
  if (container_card) {
    // Check if 'projects' is defined and is an array
    if (Array.isArray(projects) && projects.length > 0) {
      // Sort the projects based on the 'order' property
      projects.sort((a, b) => (a.order || Infinity) - (b.order || Infinity));


      for (let i = 0; i < projects.length; i++) {
        // Exclude projects
        if (projects[i].exclude || (projects[i].order>3)) {
          continue;
        }
        // Create cards
        const cardElement = document.createElement("div");
        cardElement.classList.add("collapsible");
        // Populate card content
        cardElement.innerHTML = `
          <div class="collapsible-item">
            <a href="#" class="collapsible-title" onclick="collapsibleClick('tab${i}')">
              <img src="${projects[i].card.image}" alt="Image Not Found" style="width:250px;height:250px;border-radius:10px;">
              <h1>${projects[i].title}</h1>
            </a>
            <div id="tab${i}"  class="collapsible-content" style="max-height:0px">
              <p>Lorem ipsum dolor...</p>
              <a href=${projects[i].card.link} style="margin:10px;">View Project Page</a>
            </div>
        `;
        container_card.appendChild(cardElement);
      };
      const archiveLink = document.createElement("div");
      archiveLink.classList.add("collapsible")
      archiveLink.innerHTML = `
        <a href="/pages/project_archive.html" class="collapsible-title">
          <h3>View Project Archive</h3>
        </a>
      `;
      container_card.appendChild(archiveLink);
    } else {
      console.error("Error: 'projects' is not an array or is empty.");
    }
  }
}

function collapsibleClick(content) {
  var element = document.getElementById(content);
  if (element.style.maxHeight == '0px') {
    element.style.maxHeight = '250px';
  } else {
    element.style.maxHeight = '0px'
  }
}