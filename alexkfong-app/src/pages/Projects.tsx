import "./Projects.css";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import purePursuitImage from "../assets/PurePursuitSimScreenshot.png";
import asteroidsImage from "../assets/AsteroidsScreenshot.png"

type ProjectPage = {
  slug: string;
  title: string;
  preview: string;
  content: string;
  image?: string;
};

const projectImages: Record<string, string> = {
  "/Interactive-Kinect-Rain-Simulation": "/project-images/kinect-rain.png",
  "/Pure-Pursuit-Visualizer": purePursuitImage,
  "/Asteroids-Game": asteroidsImage,
};

const modules = import.meta.glob("../projects/**/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

function extractTitle(raw: string, slug: string) {
  const match = raw.match(/^#\s+(.+)$/m);
  if (match) return match[1].trim();

  const last = slug.split("/").filter(Boolean).pop() || "Project";
  return last
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function extractPreview(raw: string) {
  const lines = raw
    .split("\n")
    .map((line) => line.trim())
    .filter(
      (line) =>
        line &&
        !line.startsWith("#") &&
        !line.startsWith("![") &&
        !line.startsWith("[")
    );

  const preview = lines[0] || "Click to read more.";

  return preview.length > 140
    ? preview.slice(0, 140).trim() + "..."
    : preview;
}

function getAllProjectPages(): ProjectPage[] {

  return Object.entries(modules)
    .map(([path, raw]) => {
      let slug = path.replace("../projects", "").replace(/\.md$/, "");

      if (slug.endsWith("/index")) {
        slug = slug.replace(/\/index$/, "");
      }

      if (slug === "") {
        slug = "/";
      }

      return {
        slug,
        title: extractTitle(raw, slug),
        preview: extractPreview(raw),
        content: raw,
        image: projectImages[slug],
      };
    })
    .sort((a, b) => a.title.localeCompare(b.title));
}

function Projects() {
  const { "*": wildcard } = useParams();
  const pages = useMemo(() => getAllProjectPages(), []);

  const isProjectsHome = !wildcard;

  const currentSlug = "/" + (wildcard || "");
  const page = pages.find((p) => p.slug === currentSlug);

  return (
    <div>
      <div className="p5-background-canvas"></div>
      <div className="overlay-content">
        <NavBar />

        <div className="Projects">
          {isProjectsHome ? (
            <>
              <h1 className="projects-title">Projects</h1>
              <div className="projects-grid">
                {pages
                  .filter((p) => p.slug !== "/")
                  .map((project) => (
                    <Link
                      key={project.slug}
                      to={`/projects${project.slug}`}
                      className="project-card"
                    >
                      {project.image && (
                        <img
                          src={project.image}
                          alt={`${project.title} preview`}
                          className="project-card-image"
                        />
                      )}

                      <h2>{project.title}</h2>
                      <p>{project.preview}</p>
                    </Link>
                  ))}
              </div>
            </>
          ) : !page ? (
            <h2>Project Not Found</h2>
          ) : (
            <div className="project-page">
              <Link to="/projects" className="back-link">
                ← Back to Projects
              </Link>

              {page.image && (
                <img
                  src={page.image}
                  alt={`${page.title} banner`}
                  className="project-hero-image"
                />
              )}

              <ReactMarkdown
                components={{
                  a: ({ href, children }) => {
                    if (!href) return <>{children}</>;

                    const isExternal =
                      href.startsWith("http") ||
                      href.startsWith("mailto:") ||
                      href.startsWith("tel:");

                    if (isExternal) {
                      return (
                        <a href={href} target="_blank" rel="noopener noreferrer">
                          {children}
                        </a>
                      );
                    }

                    return <Link to={href}>{children}</Link>;
                  },
                }}
              >
                {page.content}
              </ReactMarkdown>
            </div>
          )}
        </div>

        <Footer />
      </div>
    </div>
  );
}

export default Projects;