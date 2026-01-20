import { useEffect, useState } from "react";
import DOMPurify from "dompurify";
import HTMLFlipBook from "react-pageflip";
import "../../styles/notebook.css";

export default function NoteBook({ note, width = 400, height = 600 }) {
    const [pages, setPages] = useState([]);

   useEffect(() => {
  if (!note?.body) return;

  const container = document.createElement("div");
  container.style.width = width + "px";
  container.style.position = "absolute";
  container.style.visibility = "hidden";
  container.style.fontFamily = "Georgia, serif";
  container.style.fontSize = "16px";
  container.style.lineHeight = "1.6";
  container.style.padding = "20px";
  container.style.boxSizing = "border-box";
  container.style.display = "flex";
  container.style.flexDirection = "column";

  document.body.appendChild(container);

  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = note.body;

  const pageHeight = height;
  const newPages = [];
  let currentPage = document.createElement("div");
  currentPage.style.display = "flex";
  currentPage.style.flexDirection = "column";
  let currentHeight = 0;

  const splitNode = (node) => {
    // For text nodes: split by words if too tall
    if (node.nodeType === Node.TEXT_NODE) {
      const words = node.textContent.split(" ");
      let textFragment = document.createElement("span");
      for (let word of words) {
        const wordNode = document.createTextNode(word + " ");
        textFragment.appendChild(wordNode);
        container.appendChild(textFragment);
        if (textFragment.offsetHeight + currentHeight > pageHeight) {
          // current page full, push and start new page
          newPages.push(currentPage.innerHTML);
          currentPage = document.createElement("div");
          currentPage.style.display = "flex";
          currentPage.style.flexDirection = "column";
          currentPage.appendChild(wordNode.cloneNode(true));
          currentHeight = wordNode.offsetHeight;
          textFragment = document.createElement("span");
        }
      }
      currentPage.appendChild(textFragment);
      currentHeight += textFragment.offsetHeight;
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const wrapper = document.createElement("div");
      wrapper.style.display = "block";
      wrapper.appendChild(node.cloneNode(true));
      container.appendChild(wrapper);
      const nodeHeight = wrapper.offsetHeight;

      if (currentHeight + nodeHeight > pageHeight) {
        newPages.push(currentPage.innerHTML);
        currentPage = document.createElement("div");
        currentPage.style.display = "flex";
        currentPage.style.flexDirection = "column";
        currentPage.appendChild(node.cloneNode(true));
        currentHeight = nodeHeight;
      } else {
        currentPage.appendChild(node.cloneNode(true));
        currentHeight += nodeHeight;
      }
    }
  };

  Array.from(tempDiv.childNodes).forEach((node) => {
    splitNode(node);
  });

  if (currentPage.childNodes.length) newPages.push(currentPage.innerHTML);

  document.body.removeChild(container);
  setPages(newPages);
}, [note, width, height]);


    if (!note?.body) return <p>No content available.</p>;

    return (
        <div className="note-book">
            <HTMLFlipBook
                width={width}
                height={height}
                size="stretch"
                minWidth={width}
                maxWidth={width}
                minHeight={height}
                maxHeight={height}
                maxShadowOpacity={0.5}
                showCover={true}
                mobileScrollSupport={true}
                className="notebook"
            >
                {pages.map((pageContent, index) => (
                    <div key={index} className="page">
                        <div
                            className="page-content"
                            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(pageContent) }}
                            style={{ display: "flex", flexDirection: "column", height: "100%" }}
                        />
                    </div>
                ))}
            </HTMLFlipBook>
        </div>
    );
}
