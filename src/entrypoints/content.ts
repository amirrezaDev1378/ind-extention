import { mount } from "svelte";
import SponsorshipBadge from "@/lib/SponsorshipBadge.svelte";
import { fetchIdnList } from "@/lib/fetchIdnList";
import CompanyInfoDialog from "@/lib/companyInfo/CompanyInfoDialog.svelte";
import "../app.css";
// Add this at the top-level scope
let lastCheckedIndex = 0;

export default defineContentScript({
  matches: ["https://*.linkedin.com/*"],
  cssInjectionMode: "ui",
  main() {
    // Wait for DOM to be ready
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", initExtension);
    } else {
      initExtension();
    }
  },
});

function initExtension() {
  // Check if we're on a jobs page or company page
  const currentUrl = window.location.href;

  if (currentUrl.includes("/jobs/") || currentUrl.includes("/company/")) {
    const wrapper = document.createElement("div");
    document.body.appendChild(wrapper);
    wrapper.attachShadow({ mode: "open" });

    mount(CompanyInfoDialog, { target: wrapper });
    // Initialize badge injection
    injectBadges();
    // Set up observer for dynamically loaded content
    setupMutationObserver();
  }
}

async function injectBadges(root: Document | Element = document) {
  const idnList = await fetchIdnList();
  // Convert idnList to a Map with normalized name as key and id as value
  const idnMap = new Map(
    (idnList as { name: string; id: string }[]).map((item) => [
      item.name.trim().toLowerCase().replaceAll(" ", "").replaceAll(/\d/g, ""),
      { id: item.id, name: item.name },
    ]),
  );
  if (!(root instanceof Element || root instanceof Document)) return;
  const companyTitleList = root.querySelectorAll(
    "#main-content > section.two-pane-serp-page__results-list > ul > li > div > div.base-search-card__info > h4",
  );
  console.log({ idnMap });
  // Only process new items
  for (let i = lastCheckedIndex; i < companyTitleList.length; i++) {
    const item = companyTitleList[i];
    const companyName = item.textContent
      ?.trim()
      .toLowerCase()
      .replaceAll(" ", "")
      .replaceAll(/\d/g, "");
    if (companyName && idnMap.has(companyName)) {
      console.log(idnMap.has(companyName), { companyName });
      // Prevent duplicate badge
      if (
        item.parentElement &&
        !item.parentElement.querySelector(".linkding-badge")
      ) {
        const badgeContainer = document.createElement("div");

        item.parentElement.prepend(badgeContainer);
        const { id, name } = idnMap.get(companyName)!;

        const shadow = badgeContainer.attachShadow({ mode: "open" });
        const target = document.createElement("div");
        shadow.appendChild(target);
        mount(SponsorshipBadge, {
          target: target,
          props: {
            label: `has sponsorship (ID: ${id})`,
            Percentage: 1234,
            companyName: name,
          },
        });
      }
    }
  }
  // Update the last checked index
  lastCheckedIndex = companyTitleList.length;
}

function setupMutationObserver() {
  const list = document.querySelector(".jobs-search__results-list");
  if (!list) return;
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === 1) {
          injectBadges(node as Element);
        }
      });
    });
  });
  observer.observe(list, { childList: true, subtree: true });
}
