import { Component, mount } from "svelte";
import Index from "@/components/sponsershipBadge/index.svelte";
import { fetchIndList } from "@/lib/fetchIndList";
import CompanyInfoDialog from "@/components/companyInfo/CompanyInfoDialog.svelte";
import { ContentScriptContext } from "wxt/utils/content-script-context";
import "../app.css";
import getCompanyProfilesList from "@/lib/getCompanyProfilesList";
import { addHighlightStyles, startHighlights } from "@/lib/highlightWords";
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
  matches: [
    "https://*.linkedin.com/*",
    "https://*.indeed.com/*",
    "https://nl.indeed.com/*",
    "https://uk.indeed.com/*",
  ],
  cssInjectionMode: "ui",
  main(ctx) {
    mainCtx = ctx;
    console.log("sssssssssss");
    // Wait for DOM to be ready
    if (document.readyState === "loading") {
      // document.addEventListener("DOMContentLoaded", initExtension);
      document.addEventListener("load", initExtension);
    } else {
      initExtension();
    }
  },
});

async function initExtension() {
  const isEnabled = await storage.getItem("local:extensionEnabled");
  if (isEnabled === "false") return;
  await new Promise((r) => setTimeout(r, 2000));
  // default to true
  await storage.setItem("local:extensionEnabled", "true");
  console.log("a");
  const currentUrl = window.location.href;
  if (currentUrl.includes("/jobs") || currentUrl.includes("/company/")) {
    mountSvelte(CompanyInfoDialog, document.body, {});
    addHighlightStyles();
    injectBadges();
    startHighlights();
    setupMutationObserver();
    console.log("b");
  }
}

const transformCompanyName = (name: string): string =>
  name
    .trim()
    .toLowerCase()
    .replaceAll(" ", "")
    .replaceAll(/\d/g, "")
    .replaceAll(/LTD/gi, "")
    .replaceAll('"', "")
    .replaceAll(/\.\?£@`/gi, "")
    .replaceAll(/[\[\(].*[\]\)](?=\s+\w)/gi, "")
    .replaceAll(/LTD/gi, "")
    .replaceAll(/B\.V\..*/gi, "")
    .replaceAll(/N\.V\..*/gi, "")
    .trim();

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

    if (item.textContent?.includes("SnelS")) {
      debugger;
    }
    if (companyName && indMap.has(companyName)) {
      // Prevent duplicate badge
      const selector = item.parentElement?.parentElement || item.parentElement;
      if (selector) {
        const currentBadge = selector.querySelector(
          ".sponsorship-badge",
        ) as HTMLDivElement | null;
        if (
          currentBadge &&
          currentBadge.dataset.kvnid !== indMap.get(companyName)!.id
        ) {
          selector.querySelector(".sponsorship-badge")?.remove();
        }
        const { id, name } = indMap.get(companyName)!;
        const target = document.createElement("div");
        target.className = "sponsorship-badge";
        target.dataset.kvnid = id;
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
            "span[data-testid=company-name]",
            "div[data-testid=inlineHeader-companyName] a",
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
