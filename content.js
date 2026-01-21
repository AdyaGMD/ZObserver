const RED_STAR_SVG_HTML = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12" style="height: 1.2em; width: auto; margin-left: 4px; vertical-align: text-bottom; cursor: pointer;">
  <g>
    <path d="M 5.9999989,0.99999967 C 10.333164,8.4966495 10.333164,8.4966495 10.333164,8.4966495 l -8.6663347,-1.2e-5 z" 
          style="fill:none;stroke:#FF0000;stroke-width:0.99975;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1;stroke-miterlimit:4;stroke-dasharray:none" />
    <path d="M 1.666833,3.5033476 5.9999989,11 10.333164,3.5033495 Z" 
          style="fill:none;stroke:#FF0000;stroke-width:0.99975;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1;stroke-miterlimit:4;stroke-dasharray:none" />
  </g>
</svg>
`;

let userConfig = [];

// Fetch the list from GitHub
async function fetchUserList() {
    try {
        const response = await fetch("https://raw.githubusercontent.com/AdyaGMD/ZObserver/refs/heads/main/list.json");
        const data = await response.json();
        userConfig = data.users;
        addFlag(); // Run once after data is loaded
    } catch (error) {
        console.error("Failed to load user list:", error);
    }
}

function addFlag() {
    if (userConfig.length === 0) return;

    const nameComponents = document.querySelectorAll('[data-testid="User-Name"], [data-testid="UserName"]');

    nameComponents.forEach(component => {
        if (component.getAttribute("data-flag-added")) return;

        let handle = "";
        const anchor = component.querySelector('a[href]');
        
        if (anchor) {
            const rawHref = anchor.getAttribute("href");
            handle = rawHref ? rawHref.split('/')[1].toLowerCase() : '';
        } else {
            const handleText = component.innerText || "";
            const match = handleText.match(/@(\w+)/);
            handle = match ? match[1].toLowerCase() : '';
        }

        // Find if the current handle exists in our fetched list
        const matchedUser = userConfig.find(u => u.handle.toLowerCase() === handle);

        if (!matchedUser) {
            return;
        }

        const nameContainer = component.querySelector('.r-1awozwy.r-18u37iz.r-dnmrzs') || 
                            component.querySelector('.r-18u37iz');

        if (nameContainer) {
            const tempWrapper = document.createElement("div");
            tempWrapper.innerHTML = RED_STAR_SVG_HTML.trim();
            const svgElement = tempWrapper.firstElementChild;

            if (svgElement) {
                svgElement.addEventListener("click", (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    // Redirect to the specific link defined in the JSON
                    window.location.href = matchedUser.link;
                });

                nameContainer.appendChild(svgElement);
                component.setAttribute("data-flag-added", "true");
            }
        }
    });
}

// Start the process
fetchUserList();

const observer = new MutationObserver(() => {
    addFlag();
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});