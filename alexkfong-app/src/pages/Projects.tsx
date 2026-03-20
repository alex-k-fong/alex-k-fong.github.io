import "./Projects.css";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import purePursuitImage from "../assets/PurePursuitSimScreenshot.png";
import asteroidsImage from "../assets/AsteroidsScreenshot.png"
import rehypeRaw from "rehype-raw";
import NotFoundContent from "../components/NotFoundContent";

type ProjectPage = {
  slug: string;
  title: string;
  preview: string;
  content: string;
  image?: string;
};

type VideoEmbedProps = {
  src?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  playsInline?: boolean;
  controls?: boolean;
  className?: string;
  width?: string | number;
}

const projectImages: Record<string, string> = {
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

  const preview = lines[0] || "";

  return preview.length > 140
    ? preview.slice(0, 140).trim() + "..."
    : preview;
}

function VideoEmbed({ src, autoPlay, loop, muted, playsInline, controls = true, className, width, }: VideoEmbedProps) {
  if (!src) return null;

  return (
    <video
      src={src}
      autoPlay={autoPlay}
      loop={loop}
      muted={muted}
      playsInline={playsInline}
      controls={controls}
      className={className}
      style={{
        display: "block",
        margin: "0 auto",
        ...(width ? { width } : { width: "100%" }),
      }}
    >
    </video>
  );
}

function ImageEmbed({
  src,
  alt,
  width,
  className,
  caption,
}: {
  src?: string;
  alt?: string;
  width?: string;
  className?: string;
  caption?: string;
}) {
  if (!src) return null;

  return (
    <figure className="markdown-image-wrapper">
      <img
        src={src}
        alt={alt || ""}
        className={className}
        style={{
          display: "block",
          margin: "0 auto",
          ...(width ? { width } : { width: "100%" }),
        }}
        loading="lazy"
      />
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
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
          ) : !page || !page.content.trim() ? (
            <div className="project-page">
              <Link to="/projects" className="back-link">
                ← Back to Projects
              </Link>
              <NotFoundContent></NotFoundContent>
            </div>
          ) : (
            <div className="project-page">
              <Link to="/projects" className="back-link">
                ← Back to Projects
              </Link>
              <div className="project-content">

                <ReactMarkdown
                  rehypePlugins={[rehypeRaw]}
                  components={{
                    a: ({ href, children }: any) => {
                      if (!href) return <>{children}</>;

                      return <Link to={href}>{children}</Link>;
                    },

                    ["video-embed"]: (props: any) => {

                      return (
                        <VideoEmbed
                          src={typeof props.src === "string" ? props.src : undefined}
                          autoPlay={props.autoplay !== undefined}
                          loop={props.loop !== undefined}
                          muted={props.muted !== undefined}
                          playsInline={props.playsinline !== undefined}
                          controls={props.controls !== undefined}
                          className={typeof props.className === "string" ? props.className : undefined}
                          width={
                            typeof props.width === "string" || typeof props.width === "number"
                              ? props.width
                              : undefined
                          }
                        />
                      );
                    },

                    ["image-embed"]: (props: any) => {
                      return (
                        <ImageEmbed
                          src={typeof props.src === "string" ? props.src : undefined}
                          alt={typeof props.alt === "string" ? props.alt : undefined}
                          width={typeof props.width === "string" ? props.width : undefined}
                          className={typeof props.class === "string" ? props.class : undefined}
                          caption={typeof props.caption === "string" ? props.caption : undefined}
                        />
                      );
                    },


                    // ["image-embed"]: ({ ...props }: any) => {
                    //   const src = typeof props.src === "string" ? props.src : undefined;
                    //   return <src = { src } />;
                    // },
                  } as any
                  }
                >
                  {page.content}
                </ReactMarkdown>
              </div>
            </div>
          )}
        </div>

        <Footer />
      </div>
    </div>
  );
}

export default Projects;