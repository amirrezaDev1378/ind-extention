import { mount } from 'svelte';
import Badge from '../lib/Badge.svelte';
import { fetchIdnList } from '@/lib/fetchIdnList';

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
        // setupMutationObserver();
    }
}

async function injectBadges() {


    const idnList = await fetchIdnList();
    // Avoid duplicate badges
    if (document.getElementById('linkding-badge-demo')) return;

    // Create a container for the Svelte badge
    const container = document.createElement('div');
    container.id = 'linkding-badge-demo';
    document.body.appendChild(container);

    // Mount the Svelte Badge component
    mount(Badge, {
        target: container,
        props: { label: 'Linkding Badge' }
    });
}
