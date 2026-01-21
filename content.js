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

function addFlag() {
    // Select both timeline tweet name blocks and the main profile header name block
    const nameComponents = document.querySelectorAll('[data-testid="User-Name"], [data-testid="UserName"]');

    nameComponents.forEach(component => {
        if (component.getAttribute("data-flag-added")) return;

        // 1. Precise Handle Extraction
        // We look for the link inside the component to find the handle of THIS specific tweet author
        const anchor = component.querySelector('a[href]');
        let handle = "";

        if (anchor) {
            const rawHref = anchor.getAttribute("href");
            // Removes leading slash and everything after a second slash (to handle /POTUS/status/...)
            handle = rawHref ? rawHref.split('/')[1].toLowerCase() : '';
        } else {
            // Fallback for profile headers where there might not be an anchor
            const handleText = component.innerText || "";
            const match = handleText.match(/@(\w+)/);
            handle = match ? match[1].toLowerCase() : '';
        }

        // 2. Strict Filter
        // If this specific tweet/header doesn't belong to potus, skip it.
        if (handle !== "potus") {
            // We don't mark as "flag-added" here because a retweet might load 
            // later in this same slot, so we just return.
            return;
        }

        // 3. Find the exact container for name text and badges
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
                    window.location.href = "https://example.com";
                });

                nameContainer.appendChild(svgElement);
                component.setAttribute("data-flag-added", "true");
            }
        }
    });
}

// Initial run
addFlag();

// Observer for scrolling and dynamic content
const observer = new MutationObserver(() => {
    addFlag();
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});