// import React, { useEffect, useState } from "react";
// import { useLocation } from "react-router-dom";
// import ReactMarkdown from "react-markdown";
// import remarkGfm from "remark-gfm";
// import "github-markdown-css";
// import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
// import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
// import slugify from "slugify";
// import "./MarkdownViewer.css";

// const extractText = (children) => {
//   if (typeof children === "string") return children;
//   if (Array.isArray(children)) return children.map(extractText).join("");
//   if (typeof children === "object" && children?.props?.children)
//     return extractText(children.props.children);
//   return "";
// };

// const getSlug = (children) => {
//   const text = extractText(children);
//   return slugify(text, { lower: true, strict: true });
// };

// function MarkdownViewer() {
//   const location = useLocation();
//   const [content, setContent] = useState("");

//   useEffect(() => {
//     const fetchMarkdown = async () => {
//       const fullPath = decodeURIComponent(location.pathname);
//       const match = fullPath.match(/^\/docs\/([^\/]+)\/(.+)$/);
//       const bookSlug = match ? match[1] : null;
//       const slugPath = match ? match[2] : null;

//       const url = `/docs/${bookSlug}.md`;
//       console.log(url)

//       try {
//         const res = await fetch(url);
//         if (!res.ok) throw new Error("File not found");

//         const text = await res.text();
//         setContent(text);

// setTimeout(() => {
//   const hashSlug = location.hash?.substring(1);
//   const parts = slugPath?.split("/") || [];
//   const subsectionSlug = hashSlug || parts[parts.length - 2];

//   const targetHeading = document.getElementById(subsectionSlug);
//   if (!targetHeading) {
//     console.warn("❌ No heading found with id:", subsectionSlug);
//     return;
//   }

//   targetHeading.scrollIntoView({ behavior: "smooth", block: "start" });

//   const headingTag = targetHeading.tagName;
//   const parent = targetHeading.parentNode;

//   const sectionElements = [targetHeading];
//   let sibling = targetHeading.nextElementSibling;

//   while (sibling) {
//     const tag = sibling.tagName;
//     if (tag && /^H[1-6]$/.test(tag) && tag <= headingTag) break;

//     sectionElements.push(sibling);
//     sibling = sibling.nextElementSibling;
//   }

//   sectionElements.forEach((el) => el.classList.add("highlight-block"));

// sectionElements.forEach((el) => el.classList.add("highlight-block"));

// }, 800);


//       } catch (err) {
//         console.error("Markdown fetch failed:", err);
//         setContent("# Document not found");
//       }
//     };

//     fetchMarkdown();
//   }, [location]);

//   return (
//     <div className="markdown-body" style={styles.wrapper}>
//       <ReactMarkdown
//         children={content}
//         remarkPlugins={[remarkGfm]}
//         components={{
//           h1: ({ node, ...props }) => {
//             const slug = getSlug(props.children);
//             return <h1 id={slug} {...props} />;
//           },
//           h2: ({ node, ...props }) => {
//             const slug = getSlug(props.children);
//             return <h2 id={slug} {...props} />;
//           },
//           h3: ({ node, ...props }) => {
//             const slug = getSlug(props.children);
//             return <h3 id={slug} {...props} />;
//           },
//           h4: ({ node, ...props }) => {
//             const slug = getSlug(props.children);
//             return <h4 id={slug} {...props} />;
//           },
//           code({ node, inline, className, children, ...props }) {
//             const match = /language-(\w+)/.exec(className || "");
//             return !inline && match ? (
//               <SyntaxHighlighter
//                 style={oneDark}
//                 language={match[1]}
//                 PreTag="div"
//                 {...props}
//               >
//                 {String(children).replace(/\n$/, "")}
//               </SyntaxHighlighter>
//             ) : (
//               <code className={className} {...props}>
//                 {children}
//               </code>
//             );
//           },
//         }}
//       />
//     </div>
//   );
// }

// const styles = {
//   wrapper: {
//     maxWidth: "1820px",
//     margin: "2px",
//     padding: "2rem",
//     backgroundColor: "#ffffff",
//     color: "#000000",
//     borderRadius: "8px",
//     boxShadow: "0 0 10px rgba(0,0,0,0.1)",
//     fontSize: "16px",
//     lineHeight: "1.7",
//   },
// };

// export default MarkdownViewer;
// THE ABOVE CODE WORKS FOR HIGHLIGHT OF THE DEEPEST SECTION/SUB SECTION/ SUB SUB SECTION THAT EXISTS - THIS DOESNT WORKS FOR HANDLING THE HIGHLIGHT OF THE SPECIFIC







import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import DOMPurify from "dompurify";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import slugify from "slugify";
// import "github-markdown-css";
import "./MarkdownViewer.css";


const SOURCE_MAP = {
  "classroom-assessment-for-student-learning-jan-chappuis-et-al-second-edition":"Classroom Assessment for Student Learning Jan Chappuis et al. Second Edition",
  "measurement-and-assessment-in-teaching": "Measurement and Assessment in Teaching",
  "a-review-of-multiple-choice-item-writing-guidelines-for-classroom-assessment":"A Review of Multiple-Choice Item-Writing Guidelines for Classroom Assessment",
  "a-review-of-the-literature-on-marking-reliability":"**A REVIEW OF THE LITERATURE ON MARKING RELIABILITY**",
  "a-teacher-s-guide-to-alternative-assessment": "A Teacher's Guide to Alternative Assessment:",
  "can-a-picture-ruin-a-thousand-words-the-effects-of-visual-resources-in-exam-questions":"Can a picture ruin a thousand words?The effects of visual resources in exam questions",
  "clarifying-the-purposes-of-educational-assessment":"Clarifying the purposes of educational assessment",
  "clay-and-root-2001-is-this-a-trick-question-a-short-guide-to-writing-effective-test-questions":"Clay and Root (2001) Is This a Trick Question? A Short Guide to Writing Effective Test Questions**",
  "criteria-comparison-and-past-experiences-how-do-teachers-make-judgements-when-marking-coursework":"Criteria, comparison and past experiences: how do teachers make judgements when marking coursework?",
  "deficiency-contamination-and-the-signal-processing-metaphor":"Deficiency, Contamination, and the Signal Processing Metaphor",
  "does-washback-exist": "Does Washback Exist?",
  "language-effects-in-international-testing-the-case-of-pisa-2006-science-items":"Language effects in international testing: the case of PISA 2006 science items",
  "measurement-and-assessment-in-education-second-edition":"Measurement and Assessment in Education SECOND EDITION",
  "macro-and-micro-validation-beyond-the-five-sources-framework-for-classifying-validation-evidence-and-analysis":"Macro- and Micro-Validation: Beyond the ‘Five Sources’ Framework for Classifying Validation Evidence and Analysis",
  "ongoing-issues-in-test-fairness": "Ongoing issues in test fairness",
  "portfolio-purposes-teachers-exploring-the-relationshi-between-evaluation-an-learning":"Portfolio Purposes: Teachers Exploring the Relationshi Between Evaluation an Learning",
  "scoring-rubrics-in-the-classroom-using-performance-criteria-for-assessing-and-improving-student-performance":"SCORING RUBRICS IN THE CLASSROOM: USING PERFORMANCE CRITERIA FOR AssESSING AND IMPROVING STUDENT PERFORMANCE",
  "southeast-massouri-state-university-rubric-examples":"Southeast Massouri State University Rubric Examples",
  "standards-for-educational-and-psychological-testing":"**STANDARDS for Educational and Psychological Testing",
  "threats-to-the-valid-use-of-assessments": "Threats to the Valid Use of Assessments",
};

// Utility to strip markdown syntax
const stripMarkdown = (markdown) => {
  return markdown
    .replace(/!\[.*?\]\(.*?\)/g, "") 
    .replace(/\*\*(.*?)\*\*/g, "$1") 
    .replace(/\*(.*?)\*/g, "$1") 
    .replace(/`{1,3}(.*?)`{1,3}/g, "$1") 
    .replace(/[_~>#-]/g, "") 
    .replace(/\n+/g, " ") 
    .replace(/\s+/g, " ") 
    .trim();
};

// Normalize text for matching
const normalizeText = (text) =>
  text.replace(/[*_~`>#+=\[\]()!\\-]+/g, "").replace(/\s+/g, " ").toLowerCase().trim();

// Finds and highlights the chunk in the markdown
const findAndHighlightChunk = (markdownText, chunkText) => {
  const normalizedMarkdown = normalizeText(markdownText);
  const normalizedChunk = normalizeText(chunkText);

  const index = normalizedMarkdown.indexOf(normalizedChunk);
  if (index !== -1) {
    // Simple match: break chunk into lines and wrap each line
    const lines = chunkText.split(/\r?\n/).filter(line => line.trim().length > 0);
    let highlightedText = markdownText;

    lines.forEach((line) => {
      const cleanLine = line.trim();
      if (!cleanLine) return;

      // Escape special characters in line
      const escaped = cleanLine.replace(/[-[\]/{}()*+?.\\^$|]/g, "\\$&");
      const regex = new RegExp(escaped, "g");

      highlightedText = highlightedText.replace(regex, (match) => {
        return `<span class="highlight-chunk">${match}</span>`;
      });
    });

    return highlightedText;
  }

  // Fallback
  return markdownText;
};


function MarkdownViewer() {
  const location = useLocation();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const endpoint = import.meta.env.VITE_API_URL;


  useEffect(() => {
    const el = document.querySelector(".highlight-chunk");
    if (el) {
      const offset = 100;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  }, [content]);

  useEffect(() => {
    const fetchContent = async () => {
  const fullPath = decodeURIComponent(location.pathname);
  const match = fullPath.match(/^\/docs\/([^\/]+)/);
  const bookSlug = match ? match[1] : null;

  if (!bookSlug) {
    setContent("# Document not found");
    return;
  }

  const markdownUrl = `/docs/${bookSlug}.md`;
  console.log("fetching:",markdownUrl)

  try {
    setLoading(true); // start loading

    const res = await fetch(markdownUrl);
    if (!res.ok) throw new Error("Markdown file not found");

    let markdownText = await res.text();

    const queryParams = new URLSearchParams(location.search);
    const chunkId = queryParams.get("chunkid");

    if (chunkId) {
      const actualSourceName = SOURCE_MAP[bookSlug] || bookSlug;

      const apiRes = await fetch(`${endpoint}/getchunk`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source: actualSourceName, chunkid: chunkId }),
      });

      const json = await apiRes.json();

      if (json.text) {
        const highlighted = findAndHighlightChunk(markdownText, json.text);
        setContent(highlighted);
      } else {
        setContent(markdownText);
      }
    } else {
      setContent(markdownText);
    }
  } catch (err) {
    console.error("Error loading content:", err);
    setContent("# Document not found");
  } finally {
    setLoading(false); // end loading
  }
};


    fetchContent();
  }, [location]);

  const extractText = (children) => {
  if (typeof children === "string") return children;
  if (Array.isArray(children)) return children.map(extractText).join("");
  if (typeof children === "object" && children?.props?.children)
    return extractText(children.props.children);
  return "";
};

const getSlug = (children) => {
  const text = extractText(children);
  return slugify(text, { lower: true, strict: true });
};


  const components = {
    h1: ({ node, ...props }) => <h1 id={getSlug(props.children)} {...props} />,
    h2: ({ node, ...props }) => <h2 id={getSlug(props.children)} {...props} />,
    h3: ({ node, ...props }) => <h3 id={getSlug(props.children)} {...props} />,
    h4: ({ node, ...props }) => <h4 id={getSlug(props.children)} {...props} />,
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || "");
      return !inline && match ? (
        <SyntaxHighlighter style={oneDark} language={match[1]} PreTag="div" {...props}>
          {String(children).replace(/\n$/, "")}
        </SyntaxHighlighter>
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },
  };

  return (
  <div className="markdown-body" style={styles.wrapper}>
    {loading ? (
      <div style={styles.loaderContainer}>
        <div className="spinner" />
        <p>Loading document...</p>
      </div>
    ) : (
      <ReactMarkdown
        children={DOMPurify.sanitize(content, {
          ADD_TAGS: ["span"],
          ADD_ATTR: ["class"],
        })}
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={components}
      />
    )}
  </div>
);

}

const styles = {
  wrapper: {
    maxWidth: "1820px",
    margin: "2px",
    padding: "2rem",
    backgroundColor: "#ffffff",
    color: "#000000",
    borderRadius: "8px",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
    fontSize: "16px",
    lineHeight: "1.7",
    overflowX: 'hidden',
  },
  loaderContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "60vh",
    fontSize: "18px",
    color: "#555",
  },
};

export default MarkdownViewer;




























