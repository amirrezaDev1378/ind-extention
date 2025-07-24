function highlightKeywords(container: Element, keywords: string[]) {
  const regex = new RegExp(`\\b(${keywords.join("|")})\\b`, "gi");

  const walk = (node: Node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent || "";
      if (regex.test(text)) {
        const span = document.createElement("span");
        span.innerHTML = text.replace(regex, "<mark>$1</mark>");
        (node as ChildNode).replaceWith(...span.childNodes);
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as HTMLElement;
      if (!["SCRIPT", "STYLE", "MARK"].includes(el.tagName)) {
        Array.from(el.childNodes).forEach(walk);
      }
    }
  };

  walk(container);
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
  for (const child of document.body.children) {
    highlightKeywords(child, highlightWords);
  }
  observeJobDescription(() => {
    for (const child of document.body.children) {
      highlightKeywords(child, highlightWords);
    }
  });
};
