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
          navbar.style.top = "-100vh";
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
          continue;
        }
        // Create cards
        const cardLinkElement = document.createElement("a");
        cardLinkElement.classList.add("card-link");
        cardLinkElement.href = projects[i].card.link;
        const cardElement = document.createElement("div");
        cardElement.classList.add("card");
        // Populate card content
        cardElement.innerHTML = `
          <div style="width:15vw;height:15vw;display:flex;align-items:center;justify-content:center;flex:0 0 auto;">
            <img src="${projects[i].card.image}" alt="Image Not Found" style="max-width:15vw;max-height:15vw;border-radius:0.25vw;border:0.1vw solid black;pointer-events:none;">
          </div>
          <div class="flexbox-2" style="pointer-events:none;">
            <h1>${projects[i].title}</h1>
            <p class="subtitle">${projects[i].subtitle}</p>
            <p class="subtitle" style="font-size:1.5em;color:black;">${projects[i].date}</p>
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
          if (projects[i].page.sections.length != 0) {
            let a="", b="";
            for (let j=0; j<projects[i].page.sections.length; j++) {
              a = `<p style="text-align:center;font-size:1.75em;padding:2vw;margin:0;width:40vw;">${projects[i].page.sections[j][0]}</p>`;
              b = `<img src="${projects[i].page.sections[j][1]}" alt="Image Not Found" style="max-width:17.5vw;max-height:17.5vw;margin:2vw;border-radius:0.25vw;border:0.1vw solid black;">`;
              if (j%2 == 1) {[a, b] = [b, a];}
              sections.push(`<div style="display:flex;flex-direction:row;align-items:center;justify-content:center;padding:2vh 0 0 0;">
              ${a} <div style="min-width:20vw;">${b}</div> </div>`);
            }
          }
          sections = sections.map(item => item).join('');
          var additional_images = [];
          var addition1 = "";
          if (projects[i].page.additional_images.length != 0) {
            for (let k=0; k<projects[i].page.additional_images.length; k++) {
              additional_images.push(`<img src="${projects[i].page.additional_images[k]}" alt="Image Not Found" style="max-width:17.5vw;max-height:17.5vw;margin:2vw;border-radius:0.25vw;border:0.1vw solid black;"></img>`);
            }
          }
          additional_images = additional_images.map(item => item).join('');
          addition1 = 
           `<div style="display:flex;flex-direction:row;flex-wrap:wrap;align-items:center;justify-content:center;padding:1.5vh 0 0 0;">
              ${additional_images}</div>`;
          pageElement.innerHTML = `
          <div style="display:flex;flex-direction:row;width:60vw;">
            <a href = "/pages/project_archive.html" class="button-1 b1-slide-right" style="margin:0.5vw 0;">Return To Project Archive</a>
          </div>
          <div style="display:flex;flex-direction:row;width:60vw;">
              <img src="${projects[i].page.image_main}" alt="Image Not Found" style="width:20vw;height:20vw;border-radius:0.25vw;border:0.1vw solid black;">
              <div class="flexbox-1">
                <h1>${projects[i].title}</h1>
                <p class="subtitle" style="color:black;">${projects[i].subtitle}</p>
                <p class="subtitle" style="color:black;">${projects[i].date}</p>
                <ul class="skill-list" id="skill-list-${projects[i].IDNUM}"></ul>
              </div>
          </div>
          <p style="text-align:center;font-size:1.75em;padding:1.5vw;margin:0;width:60vw;">${projects[i].page.description}</p>
          ${sections}
          <div style="display:flex;flex-direction:row;flex-wrap:wrap;align-items:center;justify-content:center;padding:1.5vh 0 0 0;">
            <p style="font-size:1.75em;">${projects[i].page.additional_text}</p>
          </div>
          ${addition1}
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
              <div style="width:10vw;height:10vw;display:flex;align-items:center;justify-content:center;">
                <img src="${projects[i].card.image}" alt="Image Not Found" style="max-width:10vw;max-height:10vw;border-radius:0.25vw;border:0.1vw solid black;">
              </div>
                <div style="display:flex;flex-direction:column;align-items:start;justify-content:center;padding:0.5vw;">
                <h1>${projects[i].title}</h1>
                <p class="subtitle">${projects[i].subtitle}</p>
                <p class="subtitle">${projects[i].date}</p>
                <ul class="skill-list" id="skill-list-${projects[i].IDNUM}"></ul>
              </div>
            </a>
            <div id="tab${i}"  class="collapsible-content" style="max-height:0px;">
              <p>${projects[i].card.description}</p>
              <a href=${projects[i].card.link} style="margin:0.5vw;">Learn More</a>
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
    element.style.maxHeight = '100vw';
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