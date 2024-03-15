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
      for (let i = 0; i < projects.length; i++) {
        // Exclude projects
        if (projects[i].exclude) {
          return;
        }
        // Create cards
        const cardLinkElement = document.createElement("a");
        cardLinkElement.classList.add("card-link");
        cardLinkElement.href = projects[i].card.link;
        const cardElement = document.createElement("div");
        cardElement.classList.add("card");
        // Populate card content
        cardElement.innerHTML = `
          <div style="width:250px;height:250px;display:flex;align-items:center;justify-content:center;flex:0 0 auto;">
            <img src="${projects[i].card.image}" alt="Image Not Found" style="max-width:250px;max-height:250px;border-radius:4px;border:2.5px solid black;pointer-events:none;">
          </div>
          <div class="flexbox-2" style="pointer-events:none;">
            <h1>${projects[i].title}</h1>
            <p class="subtitle">${projects[i].subtitle}</p>
            <p class="subtitle" style="font-size:2em;color:black;">${projects[i].date}</p>
            <ul class="skill-list" id="skill-list-${projects[i].IDNUM}"></ul>
          </div>
        `;
        // Append the card content to the link
        cardLinkElement.innerHTML = cardElement.outerHTML;
        // Append the link to container_card
        container_card.appendChild(cardLinkElement);
        skillList(`skill-list-${projects[i].IDNUM}`, projects[i].skills);
      };
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
          var sections = [];
          let a="", b="";
          for (let j=0; j<projects[i].page.sections.length; j++) {
            a = `<p style="text-align:center;font-size:2em;padding:5px;margin:0;width:40vw;">${projects[i].page.sections[j][0]}</p>`;
            b = `<img src="${projects[i].page.sections[j][1]}" alt="Image Not Found" style="width:250px;height:250px;margin:10px;">`;
            if (j%2 == 1) {[a, b] = [b, a];}
            sections.push(`<div style="display:flex;flex-direction:row;align-items:center;justify-content:center;padding:2.5vh 0 0 0;">
            ${a} ${b}</div>`);
          }
          sections = sections.map(item => item).join('');
          pageElement.innerHTML = `
          <div style="display:flex;flex-direction:row;width:60vw;">
            <a href = "/pages/project_archive.html" class="button-1 b1-slide-right" style="margin:15px 0;">Return To Project Archive</a>
          </div>
          <div style="display:flex;flex-direction:row;width:60vw;">
              <img src="${projects[i].page.image_main}" alt="Image Not Found" style="width:600px;height:600px;border-radius:10px;border:2.5px solid black;">
              <div class="flexbox-1">
                <h1>${projects[i].title}</h1>
                <p class="subtitle" style="color:black;">${projects[i].subtitle}</p>
                <ul class="skill-list" id="skill-list-${projects[i].IDNUM}"></ul>
                <p>${projects[i].page.description}</p>
              </div>
          </div>
          ${sections}
          `;
          // Append the container to container_page
          container_page.appendChild(pageElement);
          skillList(`skill-list-${projects[i].IDNUM}`, projects[i].skills);
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
        if (projects[i].exclude || !(projects[i].feature)) {
          continue;
        }
        // Create cards
        const cardElement = document.createElement("div");
        cardElement.classList.add("collapsible");
        // Populate card content
        cardElement.innerHTML = `
          <div class="collapsible-item">
            <a href="#" class="collapsible-title" onclick="collapsibleClick('tab${i}')">
              <div style="width:250px;height:250px;display:flex;align-items:center;justify-content:center;">
                <img src="${projects[i].card.image}" alt="Image Not Found" style="max-width:250px;max-height:250px;border-radius:10px;">
              </div>
                <div style="display:flex;flex-direction:column;align-items:start;justify-content:center;padding:15px;">
                <h1>${projects[i].title}</h1>
                <p class="subtitle">${projects[i].subtitle}</p>
                <p class="subtitle">${projects[i].date}</p>
                <ul class="skill-list" id="skill-list-${projects[i].IDNUM}"></ul>
              </div>
            </a>
            <div id="tab${i}"  class="collapsible-content" style="max-height:0px">
              <p>${projects[i].card.description}</p>
              <a href=${projects[i].card.link} style="margin:10px;">Learn More</a>
            </div>
        `;
        container_card.appendChild(cardElement);
        skillList(`skill-list-${projects[i].IDNUM}`, projects[i].skills);
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

function skillList(content, skills) {
  const element = document.getElementById(content);
  const sub_element = document.createElement('div');
  sub_element.classList.add("skill-list")
  var list = [];
  for (let i=0; i<skills.length; i++) {
    list.push(`<li class="keep">${skills[i]}</li>`);
  }
  sub_element.innerHTML = `
    ${list}
  `;
  var listItemsToKeep = Array.from(sub_element.children).filter(item => item.classList.contains("keep"));
  listItemsToKeep.forEach(item => {
    element.appendChild(item);
  });
}