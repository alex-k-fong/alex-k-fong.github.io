import "./Projects.css";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { useMemo } from "react";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { Link } from "react-router-dom";

type ProjectPage = {
  slug: string;
  title?: string;
  content: string;
};

const modules = import.meta.glob("../projects/**/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

function getAllProjectPages(): ProjectPage[] {
  return Object.entries(modules).map(([path, raw]) => {
    let slug = path
      .replace("../projects", "")
      .replace(/\.md$/, "");

    if (slug.endsWith("/index")) {
      slug = slug.replace(/\/index$/, "");
    }

    if (slug === "") {
      slug = "/";
    }

    return {
      slug,
      title: undefined,
      content: raw,
    };
  });
}

function Projects() {
  const { "*": wildcard } = useParams();
  const pages = useMemo(() => getAllProjectPages(), []);
  const currentSlug = "/" + (wildcard || "");
  const page = pages.find((p) => p.slug === currentSlug);

  return (
    <div>
      <div className="p5-background-canvas"></div>
      <div className="overlay-content">
        <NavBar />
        <div className="Projects">
          {!page ? (
            <h2>Project Not Found</h2>
          ) : (
            <>
              <ReactMarkdown
                components={{
                  a: ({ href, children }) => {
                    if (!href) return <>{children}</>;

                    // internal links → use React Router
                    if (href.startsWith("/")) {
                      return <Link to={href}>{children}</Link>;
                    }

                    // external links → normal <a>
                    return (
                      <a href={href} target="_blank" rel="noopener noreferrer">
                        {children}
                      </a>
                    );
                  },
                }}
              >
                {page.content}
              </ReactMarkdown>
            </>
          )}
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default Projects;