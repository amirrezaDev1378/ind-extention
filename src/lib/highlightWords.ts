function highlightKeywordsIntoGlobal(
  container: Element,
  keywords: string[],
  globalHighlight: Highlight,
) {
  // Check browser support
  if (!CSS.highlights) {
    console.error("CSS Custom Highlight API is not supported in this browser");
    return;
  }

  const regex = new RegExp(`\\b(${keywords.join("|")})\\b`, "gi");

  const walk = (node: Node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent || "";
      let match;

      // Reset regex lastIndex to ensure we find all matches
      regex.lastIndex = 0;

      while ((match = regex.exec(text)) !== null) {
        const range = new Range();
        range.setStart(node, match.index);
        range.setEnd(node, match.index + match[0].length);

        globalHighlight.add(range);
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as HTMLElement;
      if (!["SCRIPT", "STYLE", "MARK", "CODE", "LINK"].includes(el.tagName)) {
        Array.from(el.childNodes).forEach(walk);
      }
    }
  };

  walk(container);
}

// Add this CSS to your stylesheet or call this function once during app initialization
export function addHighlightStyles() {
  // Check if styles already exist to avoid duplicates
  if (document.getElementById("keyword-highlight-styles")) {
    return;
  }

  const style = document.createElement("style");
  style.id = "keyword-highlight-styles";
  style.textContent = `
    ::highlight(keyword-highlight) {
      background-color: yellow;
      color: black;
    }
  `;
  document.head.appendChild(style);
}

// Optional: Function to clear all keyword highlights
function clearKeywordHighlights() {
  CSS.highlights.delete("keyword-highlight");
}

function observeJobDescription(callback: () => void) {
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === "childList") {
        callback();
        break;
      }
    }
  });

  const targetNode = document.body; // or a more specific container if you know it

  observer.observe(targetNode, {
    childList: true,
    subtree: true,
  });
}

export const startHighlights = async () => {
  const storedWords = (await storage.getItem("local:highlightWords")) as string;
  const highlightWords = storedWords ? JSON.parse(storedWords || "") : [];
  if (!highlightWords.length) return;

  if (!CSS.highlights) {
    return alert("Your browser does not support css highlights.");
  }

  const highlightAllElements = () => {
    // Clear highlights once at the start
    CSS.highlights.delete("keyword-highlight");
    const globalHighlight = new Highlight();

    for (const child of document.querySelectorAll(
      "p,span,strong,title,div,h1,h2,h3,h4,h5,h6,b",
    )) {
      highlightKeywordsIntoGlobal(child, highlightWords, globalHighlight);
    }

    // Set the combined highlight once
    if (globalHighlight.size > 0) {
      CSS.highlights.set("keyword-highlight", globalHighlight);
    }
  };

  highlightAllElements();

  observeJobDescription(() => {
    highlightAllElements();
  });
};
