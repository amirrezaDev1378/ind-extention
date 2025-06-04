import { Component, mount } from "svelte";
import Index from "@/components/sponsershipBadge/index.svelte";
import { fetchIndList } from "@/lib/fetchIndList";
import CompanyInfoDialog from "@/components/companyInfo/CompanyInfoDialog.svelte";
import { ContentScriptContext } from "wxt/utils/content-script-context";
import "../app.css";
import getCompanyProfilesList from "@/lib/getCompanyProfilesList";
// Add this at the top-level scope
let mainCtx: ContentScriptContext | null = null;
const injectedElements = new WeakSet<Element>(); // Track injected elements
let debounceTimeout: number | null = null;

// Debounce helper
function debounce(fn: () => void, delay: number) {
  if (debounceTimeout) clearTimeout(debounceTimeout);
  debounceTimeout = window.setTimeout(fn, delay);
}

export const mountSvelte = async (
  component: Component<any>,
  target: Element,
  props?: any,
) => {
  if (!mainCtx) throw new Error("Shadow root is not initialized");
  const ui = await createShadowRootUi(mainCtx, {
    name: "tailwind-shadow-root-example-" + Math.random(),
    position: "inline",
    anchor: target,
    append: "first",
    onMount: (uiContainer) => {
      mount(component, {
        target: uiContainer,
        props,
      });
    },
  });
  ui.mount();
};

export default defineContentScript({
  matches: ["https://*.linkedin.com/*"],
  cssInjectionMode: "ui",
  main(ctx) {
    mainCtx = ctx;
    // Wait for DOM to be ready
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", initExtension);
    } else {
      initExtension();
    }
  },
});

function initExtension() {
  const isEnabled = localStorage.getItem("local:extensionEnabled");
  if (isEnabled === "false") return;

  // default to true
  localStorage.setItem("local:extensionEnabled", "true");

  const currentUrl = window.location.href;
  if (currentUrl.includes("/jobs/") || currentUrl.includes("/company/")) {
    mountSvelte(CompanyInfoDialog, document.body, {});
    injectBadges();
    setupMutationObserver();
  }
}

const transformCompanyName = (name: string): string =>
  name.trim().toLowerCase().replaceAll(" ", "").replaceAll(/\d/g, "");

async function injectBadges(root: Document | Element = document) {
  const indList = await fetchIndList();
  const indMap = new Map(
    (indList as { name: string; id: string }[]).map((item) => [
      transformCompanyName(item.name),
      { id: item.id, name: item.name },
    ]),
  );
  if (!(root instanceof Element || root instanceof Document)) return;

  // Use the improved getCompanyProfilesList
  const companyElements = getCompanyProfilesList();
  for (const item of companyElements) {
    if (injectedElements.has(item)) continue; // Skip if already injected
    const companyName = transformCompanyName(item.textContent || "");
    if (companyName && indMap.has(companyName)) {
      // Prevent duplicate badge
      if (
        item.parentElement &&
        !item.parentElement.querySelector(".sponsorship-badge")
      ) {
        const { id, name } = indMap.get(companyName)!;
        const target = document.createElement("div");
        item.parentElement?.appendChild(target);
        mountSvelte(Index, target, {
          label: `has sponsorship (ID: ${id})`,
          kvnID: id,
          companyName: name,
        });
        injectedElements.add(item);
      }
    }
  }
}

function setupMutationObserver() {
  // Observe the whole document for added nodes
  const observer = new MutationObserver((mutations) => {
    let shouldInject = false;
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === 1) {
          // If any new element matches a company selector, trigger badge injection
          const el = node as Element;
          // Check if it or any of its descendants match
          const selectors = [
            ".base-search-card__info > h4 > a",
            "ul div > div.job-card-container div.ember-view.artdeco-entity-lockup__subtitle span",
            "div.job-details-jobs-unified-top-card__company-name > a",
            ".top-card-layout__entity-info-container  span.topcard__flavor > a",
            ".top-card-layout__card   h1.top-card-layout__title",
            ".org-top-card__primary-content    h1.org-top-card-summary__title",
          ];
          if (
            selectors.some((sel) => el.matches(sel)) ||
            selectors.some((sel) => el.querySelector(sel))
          ) {
            shouldInject = true;
          }
        }
      });
    });
    if (shouldInject) {
      debounce(() => injectBadges(), 200);
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
}
