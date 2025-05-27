import { mount } from 'svelte';
import SponsorshipBadge from 'src/lib/SponsorshipBadge.svelte';
import { fetchIdnList } from '@/lib/fetchIdnList';

// Add this at the top-level scope
let lastCheckedIndex = 0;

export default defineContentScript({
    matches: ["https://*.linkedin.com/*"],
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
            item.name.trim().toLowerCase().replaceAll(' ', '').replaceAll(/\d/g, ''),
            { id: item.id, name: item.name }
        ])
    );
    if (!(root instanceof Element || root instanceof Document)) return;
    const companyTitleList = root.querySelectorAll('#main-content > section.two-pane-serp-page__results-list > ul > li > div > div.base-search-card__info > h4');
    // Only process new items
    for (let i = lastCheckedIndex; i < companyTitleList.length; i++) {
        const item = companyTitleList[i];
        const companyName = item.textContent?.trim().toLowerCase().replaceAll(' ', '').replaceAll(/\d/g, '');
        if (companyName && idnMap.has(companyName)) {
            // Prevent duplicate badge
            if (item.parentElement && !item.parentElement.querySelector('.linkding-badge')) {
                const badgeContainer = document.createElement('span');
                item.parentElement.appendChild(badgeContainer);
                const { id, name } = idnMap.get(companyName)!;
                mount(SponsorshipBadge, {
                    target: badgeContainer,
                    props: { label: `has sponsorship (ID: ${id})` }
                });
            }
        }
    }
    // Update the last checked index
    lastCheckedIndex = companyTitleList.length;
}

function setupMutationObserver() {
    const list = document.querySelector('.jobs-search__results-list');
    if (!list) return;
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1) {
                    injectBadges(node as Element);
                }
            });
        });
    });
    observer.observe(list, { childList: true, subtree: true });
}
