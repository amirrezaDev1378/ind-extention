function highlightKeywordsIntoGlobal(
  container: Element,
  keywords: string[],
  globalHighlight: Highlight,
) {
  if (!CSS.highlights) {
    console.error("CSS Custom Highlight API is not supported in this browser");
    return;
  }

  const keywordSet = new Set(keywords.map((k) => k.toLowerCase()));

  const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      if (
        node.parentElement &&
        !["SCRIPT", "STYLE", "MARK", "CODE", "LINK"].includes(
          node.parentElement.tagName,
        )
      ) {
        return NodeFilter.FILTER_ACCEPT;
      }
      return NodeFilter.FILTER_REJECT;
    },
  });

  while (walker.nextNode()) {
    const node = walker.currentNode;
    const text = node.textContent || "";

    let startIndex = 0;
    for (const word of text.split(/\b/)) {
      if (keywordSet.has(word.toLowerCase())) {
        const range = new Range();
        range.setStart(node, startIndex);
        range.setEnd(node, startIndex + word.length);
        globalHighlight.add(range);
      }
      startIndex += word.length;
    }
  }
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

    for (const child of document.body.children) {
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
