import { Fragment, useEffect, useId, useMemo, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { githubUsername, profile, selectedSoftware } from "./data/profile";

type GitHubRepo = {
  id: number;
  name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  updated_at: string;
};

type MediaPreview = {
  src: string;
  alt: string;
};

type ProceedingWithYear = {
  citation: string;
  href?: string;
  status?: "Accepted" | "Presented";
  sourceIndex: number;
  inferredYear: {
    value: number;
    label: string;
  };
};

type JournalArticleWithYear = {
  citation: string;
  href?: string;
  inferredYear: {
    value: number;
    label: string;
  };
};

type ProceedingYearGroup = {
  yearLabel: string;
  items: ProceedingWithYear[];
};

type JournalArticleYearGroup = {
  yearLabel: string;
  items: JournalArticleWithYear[];
};

type Appointment = (typeof profile.appointments)[number];

type ConferencePresentation = (typeof profile.conferencePresentations)[number];

type PresentationYearGroup = {
  yearLabel: string;
  items: ConferencePresentation[];
};

type OutreachEntry = (typeof profile.outreach)[number];

type OutreachYearGroup = {
  yearLabel: string;
  items: OutreachEntry[];
};

type MediaCoverageEntry = (typeof profile.mediaCoverage)[number];

type MediaCoverageYearGroup = {
  yearLabel: string;
  items: MediaCoverageEntry[];
};

const isExternalHref = (href: string | undefined) =>
  typeof href === "string" && href.startsWith("http");

const formatPublicationCitation = (citation: string) =>
  citation.split(/(Zhou, J\.)/g).map((part, index) =>
    part === "Zhou, J." ? (
      <strong className="publication-self-author" key={`author-${index}`}>
        {part}
      </strong>
    ) : (
      <Fragment key={`citation-${index}`}>{part}</Fragment>
    )
  );

const navItems = [
  { label: "About", href: "#about" },
  { label: "Research", href: "#research" },
  { label: "Education", href: "#education" },
  { label: "Appointments", href: "#appointments" },
  { label: "Publications", href: "#publications" },
  { label: "Talks", href: "#talks" },
  { label: "Service", href: "#service" },
  { label: "Leadership", href: "#leadership" },
  { label: "GitHub", href: "#github" },
  { label: "Contact", href: "#contact" }
];

const featuredRepoNames = ["CADialogue", "Drawing-Checker", "MAS-DFM"];
const mapMyVisitorsScriptSrc =
  "https://mapmyvisitors.com/map.js?cl=ffffff&w=a&t=tt&d=vpkCxKQ2ByhD-7oXnjNhlxPOH0Rxuf_I3M93SurEQbA";
const mapMyVisitorsHref = "https://mapmyvisitors.com/web/1c2uq";
const mapMyVisitorsImageSrc =
  "https://mapmyvisitors.com/map.png?d=vpkCxKQ2ByhD-7oXnjNhlxPOH0Rxuf_I3M93SurEQbA&cl=ffffff";

const parsePeriodPart = (value: string, fallbackMonth: number) => {
  const [yearPart, monthPart] = value.trim().split(".");
  const year = Number.parseInt(yearPart, 10);

  if (!Number.isFinite(year)) {
    return Number.NEGATIVE_INFINITY;
  }

  const parsedMonth = Number.parseInt(monthPart ?? "", 10);
  const month =
    Number.isFinite(parsedMonth) && parsedMonth >= 1 && parsedMonth <= 12
      ? parsedMonth
      : fallbackMonth;

  return year * 12 + month;
};

const parsePeriodEnd = (period: string) => {
  const parts = period
    .split("-")
    .map((part) => part.trim())
    .filter((part) => part.length > 0);

  if (parts.length === 0) {
    return Number.NEGATIVE_INFINITY;
  }

  if (parts.length === 1) {
    if (/present/i.test(parts[0])) {
      return Number.POSITIVE_INFINITY;
    }

    return parsePeriodPart(parts[0], 12);
  }

  const endPart = parts[parts.length - 1] ?? "";
  if (/present/i.test(endPart)) {
    return Number.POSITIVE_INFINITY;
  }

  return parsePeriodPart(endPart, 12);
};

const parsePeriodStart = (period: string) => {
  const [startPart = ""] = period
    .split("-")
    .map((part) => part.trim())
    .filter((part) => part.length > 0);

  if (/present/i.test(startPart)) {
    return Number.POSITIVE_INFINITY;
  }

  return parsePeriodPart(startPart, 1);
};

const resolveExperienceRange = (period: string, now = new Date()) => {
  const parts = period
    .split("-")
    .map((part) => part.trim())
    .filter((part) => part.length > 0);

  if (parts.length === 0) {
    return null;
  }

  const start = parsePeriodStart(period);
  if (!Number.isFinite(start)) {
    return null;
  }

  if (parts.length === 1) {
    return { start, end: start + 1 };
  }

  const endPart = parts[parts.length - 1] ?? "";
  const currentMonthIndex = now.getFullYear() * 12 + (now.getMonth() + 1);
  const parsedEnd = /present/i.test(endPart)
    ? currentMonthIndex
    : parsePeriodPart(endPart, 12);

  if (!Number.isFinite(parsedEnd)) {
    return null;
  }

  return {
    start,
    end: Math.max(start + 1, parsedEnd)
  };
};

const calculateIndustryExperienceYears = (
  appointments: Appointment[],
  now = new Date()
) => {
  const ranges = appointments
    .filter((appointment) => appointment.countsTowardIndustryExperience)
    .map((appointment) => resolveExperienceRange(appointment.period, now))
    .filter((range): range is NonNullable<typeof range> => Boolean(range))
    .sort((a, b) => a.start - b.start);

  if (ranges.length === 0) {
    return 0;
  }

  let totalMonths = 0;
  let activeRange = { ...ranges[0] };

  for (const range of ranges.slice(1)) {
    if (range.start <= activeRange.end) {
      activeRange.end = Math.max(activeRange.end, range.end);
      continue;
    }

    totalMonths += activeRange.end - activeRange.start;
    activeRange = { ...range };
  }

  totalMonths += activeRange.end - activeRange.start;
  return Math.max(0, Math.floor(totalMonths / 12));
};

const inferYearFromCitation = (citation: string) => {
  const explicitYears = Array.from(citation.matchAll(/\b(19|20)\d{2}\b/g))
    .map((match) => Number.parseInt(match[0], 10))
    .filter(Number.isFinite);

  if (explicitYears.length > 0) {
    const value = Math.max(...explicitYears);
    return { value, label: String(value) };
  }

  const shortYearMatch = citation.match(/'(\d{2})\b/);
  if (shortYearMatch) {
    const shortYear = Number.parseInt(shortYearMatch[1], 10);
    if (Number.isFinite(shortYear)) {
      const value = shortYear >= 70 ? 1900 + shortYear : 2000 + shortYear;
      return { value, label: String(value) };
    }
  }

  return { value: Number.NEGATIVE_INFINITY, label: "N/A" };
};

const resolveAssetPath = (path: string) => {
  if (
    path.startsWith("http://") ||
    path.startsWith("https://") ||
    path.startsWith("data:") ||
    path.startsWith("#")
  ) {
    return path;
  }

  const normalized = path.startsWith("/") ? path.slice(1) : path;
  return `${import.meta.env.BASE_URL}${normalized}`;
};

const profileLinkIconByLabel: Record<string, string> = {
  "google scholar": "/media/icons/google-scholar.svg",
  github: "/media/icons/github.svg",
  linkedin: "/media/icons/linkedin.svg",
  cv: "/media/icons/cv.svg"
};

// Match the existing phone layout breakpoint and update when the viewport changes.
const phoneViewportQuery = "(max-width: 640px)";
const getPhoneViewportSnapshot = () => window.matchMedia(phoneViewportQuery).matches;
const subscribeToPhoneViewport = (onChange: () => void) => {
  const query = window.matchMedia(phoneViewportQuery);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
};

function CollapsibleList({ title, count, visibleCount = 1, hasMore, sectionHeading = false, children }: {
  title: string;
  count?: number;
  visibleCount?: number;
  hasMore?: boolean;
  sectionHeading?: boolean;
  children: (expanded: boolean) => ReactNode;
}) {
  const [expanded, setExpanded] = useState(false);
  const isPhone = useSyncExternalStore(subscribeToPhoneViewport, getPhoneViewportSnapshot, () => false);
  const contentId = useId();
  const listRef = useRef<HTMLDivElement>(null);

  return (
    <div className={`list-collapse${sectionHeading ? " list-collapse-section" : ""}`} ref={listRef}>
      <div className="list-collapse-heading">
        {sectionHeading ? <h2>{title}</h2> : <h3 className="subsection-title">{title}</h3>}
        {count !== undefined ? <span className="list-collapse-count">({count})</span> : null}
      </div>
      <div id={contentId}>{children(!isPhone || expanded)}</div>
      {isPhone && (hasMore ?? (count === undefined || count > visibleCount)) ? (
        <button type="button" className="list-collapse-toggle"
          aria-expanded={expanded} aria-controls={contentId}
          aria-label={`${expanded ? "Show fewer" : "Show all"} ${title.toLowerCase()}`}
          onClick={() => {
            if (expanded && listRef.current && listRef.current.getBoundingClientRect().top < 0) {
              listRef.current.scrollIntoView({ block: "start", behavior: "instant" });
            }
            setExpanded(!expanded);
          }}>
          {expanded ? "Show less" : `Show all${count !== undefined ? ` (${count})` : ""}`}
          <span className="list-collapse-chevron" aria-hidden="true" />
        </button>
      ) : null}
    </div>
  );
}

// Limit entries across year boundaries while retaining the original year headings.
function previewYearGroups<T>(groups: { yearLabel: string; items: T[] }[], limit: number) {
  let remaining = limit;
  return groups.flatMap((group) => {
    const items = group.items.slice(0, remaining);
    remaining -= items.length;
    return items.length ? [{ ...group, items }] : [];
  });
}

function App() {
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [repoError, setRepoError] = useState("");
  const [loadingRepos, setLoadingRepos] = useState(true);
  const [activePreview, setActivePreview] = useState<MediaPreview | null>(null);
  const [mapWidgetLoaded, setMapWidgetLoaded] = useState(false);


  useEffect(() => {
    const fetchRepos = async () => {
      if (!githubUsername || githubUsername === "your-username") {
        setLoadingRepos(false);
        return;
      }

      try {
        const response = await fetch(
          `https://api.github.com/users/${githubUsername}/repos?sort=updated&per_page=100`
        );

        if (!response.ok) {
          throw new Error("Unable to fetch repositories from GitHub API.");
        }

        const data = (await response.json()) as GitHubRepo[];
        const ranked = data
          .slice()
          .sort(
            (a, b) =>
              b.stargazers_count - a.stargazers_count ||
              Date.parse(b.updated_at) - Date.parse(a.updated_at)
          );
        const featured = featuredRepoNames
          .map((repoName) =>
            ranked.find(
              (repo) => repo.name.toLowerCase() === repoName.toLowerCase()
            )
          )
          .filter((repo): repo is GitHubRepo => Boolean(repo));
        setRepos(featured);
      } catch (error) {
        setRepoError(error instanceof Error ? error.message : "Unknown error");
      } finally {
        setLoadingRepos(false);
      }
    };

    void fetchRepos();
  }, []);

  useEffect(() => {
    const revealElements = Array.from(document.querySelectorAll(".reveal"));
    if (revealElements.length === 0) {
      return undefined;
    }

    if (!("IntersectionObserver" in window)) {
      revealElements.forEach((element) => element.classList.add("is-visible"));
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries, activeObserver) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            activeObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.01 }
    );

    revealElements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!activePreview) {
      return undefined;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActivePreview(null);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activePreview]);

  useEffect(() => {
    const host = document.getElementById("mapmyvisitors-host");
    if (!host) {
      return undefined;
    }

    setMapWidgetLoaded(false);
    host.innerHTML = "";

    const renderChecks: Array<ReturnType<typeof window.setTimeout>> = [];
    const checkRendered = () => {
      const renderedMap = host.querySelector(
        "#mapmyvisitors-widget .jvectormap-container"
      );
      if (renderedMap) {
        setMapWidgetLoaded(true);
      }
    };

    const observer = new MutationObserver(() => {
      checkRendered();
    });
    observer.observe(host, { childList: true, subtree: true });

    const script = document.createElement("script");
    script.type = "text/javascript";
    script.id = "mapmyvisitors";
    script.src = mapMyVisitorsScriptSrc;
    script.async = true;
    script.onload = () => {
      renderChecks.push(window.setTimeout(checkRendered, 300));
      renderChecks.push(window.setTimeout(checkRendered, 1200));
    };
    script.onerror = () => setMapWidgetLoaded(false);
    host.appendChild(script);

    return () => {
      observer.disconnect();
      renderChecks.forEach((timeoutId) => window.clearTimeout(timeoutId));
      script.onload = null;
      script.onerror = null;
      host.innerHTML = "";
    };
  }, []);

  const currentYear = useMemo(() => new Date().getFullYear(), []);
  const heroStats = useMemo(
    () => {
      const journalArticleCount = profile.journalArticles.length;
      const conferenceProceedingCount = profile.conferenceProceedings.length;
      const conferencePresentationCount = profile.conferencePresentations.length;
      const publicOutreachTalkCount = profile.outreach.length;
      const fundingCount = profile.funding.length;
      const industryExperienceYears = calculateIndustryExperienceYears(
        profile.appointments
      );

      return profile.stats.map((stat) => {
        if (stat.label === "Peer-Reviewed Publications") {
          return {
            ...stat,
            value: String(journalArticleCount + conferenceProceedingCount)
          };
        }

        if (stat.label === "Journal Articles") {
          return {
            ...stat,
            value: String(journalArticleCount)
          };
        }

        if (stat.label === "Active Manuscripts") {
          return {
            ...stat,
            value: String(
              profile.manuscriptsUnderReview.length +
                profile.manuscriptsInPreparation.length
            )
          };
        }

        if (stat.label === "Conference Proceedings") {
          return {
            ...stat,
            value: String(conferenceProceedingCount)
          };
        }

        if (stat.label === "Conference Presentations") {
          return {
            ...stat,
            value: String(conferencePresentationCount)
          };
        }

        if (stat.label === "Public Outreach Talks") {
          return {
            ...stat,
            value: String(publicOutreachTalkCount)
          };
        }

        if (stat.label === "Funding and Grants") {
          return {
            ...stat,
            value: String(fundingCount)
          };
        }

        if (stat.label === "Industry Experience") {
          return {
            ...stat,
            value: Number.isFinite(industryExperienceYears)
              ? `${industryExperienceYears}+ years`
              : stat.value ?? ""
          };
        }

        return {
          ...stat,
          value: stat.value ?? ""
        };
      });
    },
    []
  );
  const educationByMostRecent = useMemo(
    () =>
      profile.education.slice().sort((a, b) => {
        const endDelta = parsePeriodEnd(b.period) - parsePeriodEnd(a.period);
        if (endDelta !== 0) {
          return endDelta;
        }

        return parsePeriodStart(b.period) - parsePeriodStart(a.period);
      }),
    []
  );
  const appointmentsByMostRecent = useMemo(
    () =>
      profile.appointments.slice().sort((a, b) => {
        const endDelta = parsePeriodEnd(b.period) - parsePeriodEnd(a.period);
        if (endDelta !== 0) {
          return endDelta;
        }

        return parsePeriodStart(b.period) - parsePeriodStart(a.period);
      }),
    []
  );
  const leadershipByMostRecent = useMemo(
    () =>
      profile.leadership.slice().sort((a, b) => {
        const endDelta = parsePeriodEnd(b.period) - parsePeriodEnd(a.period);
        if (endDelta !== 0) {
          return endDelta;
        }

        return parsePeriodStart(b.period) - parsePeriodStart(a.period);
      }),
    []
  );
  const certificationsByMostRecent = useMemo(
    () =>
      profile.certifications.slice().sort((a, b) => {
        const endDelta = parsePeriodEnd(b.period) - parsePeriodEnd(a.period);
        if (endDelta !== 0) {
          return endDelta;
        }

        return parsePeriodStart(b.period) - parsePeriodStart(a.period);
      }),
    []
  );
  const mediaByMostRecent = useMemo(
    () =>
      profile.mediaCoverage.slice().sort((a, b) => {
        const yearDelta =
          Number.parseInt(b.year, 10) - Number.parseInt(a.year, 10);
        if (yearDelta !== 0) {
          return yearDelta;
        }

        return a.title.localeCompare(b.title);
      }),
    []
  );
  const mediaByYear = useMemo<MediaCoverageYearGroup[]>(
    () =>
      mediaByMostRecent.reduce<MediaCoverageYearGroup[]>((groups, item) => {
        const currentGroup = groups[groups.length - 1];
        if (currentGroup && currentGroup.yearLabel === item.year) {
          currentGroup.items.push(item);
          return groups;
        }

        groups.push({ yearLabel: item.year, items: [item] });
        return groups;
      }, []),
    [mediaByMostRecent]
  );
  const journalArticlesByMostRecent = useMemo<JournalArticleWithYear[]>(
    () =>
      profile.journalArticles
        .map((item) => ({
          ...item,
          inferredYear: inferYearFromCitation(item.citation)
        }))
        .sort((a, b) => {
          const yearDelta = b.inferredYear.value - a.inferredYear.value;
          if (yearDelta !== 0) {
            return yearDelta;
          }

          return a.citation.localeCompare(b.citation);
        }),
    []
  );
  const journalArticlesByYear = useMemo<JournalArticleYearGroup[]>(
    () =>
      journalArticlesByMostRecent.reduce<JournalArticleYearGroup[]>(
        (groups, item) => {
          const currentGroup = groups[groups.length - 1];
          if (currentGroup && currentGroup.yearLabel === item.inferredYear.label) {
            currentGroup.items.push(item);
            return groups;
          }

          groups.push({ yearLabel: item.inferredYear.label, items: [item] });
          return groups;
        },
        []
      ),
    [journalArticlesByMostRecent]
  );
  const conferenceProceedingsByMostRecent = useMemo<ProceedingWithYear[]>(
    () =>
      profile.conferenceProceedings
        .map((item, sourceIndex) => ({
          ...item,
          sourceIndex,
          inferredYear: inferYearFromCitation(item.citation)
        }))
        .sort((a, b) => {
          const yearDelta = b.inferredYear.value - a.inferredYear.value;
          if (yearDelta !== 0) {
            return yearDelta;
          }

          return a.sourceIndex - b.sourceIndex;
        }),
    []
  );
  const conferenceProceedingsByYear = useMemo<ProceedingYearGroup[]>(
    () =>
      conferenceProceedingsByMostRecent.reduce<ProceedingYearGroup[]>(
        (groups, item) => {
          const currentGroup = groups[groups.length - 1];
          if (currentGroup && currentGroup.yearLabel === item.inferredYear.label) {
            currentGroup.items.push(item);
            return groups;
          }

          groups.push({ yearLabel: item.inferredYear.label, items: [item] });
          return groups;
        },
        []
      ),
    [conferenceProceedingsByMostRecent]
  );
  const conferencePresentationsByYear = useMemo<PresentationYearGroup[]>(
    () =>
      profile.conferencePresentations
        .slice()
        .sort((a, b) => {
          const yearDelta =
            Number.parseInt(b.year, 10) - Number.parseInt(a.year, 10);
          if (yearDelta !== 0) {
            return yearDelta;
          }

          return a.event.localeCompare(b.event);
        })
        .reduce<PresentationYearGroup[]>((groups, item) => {
          const currentGroup = groups[groups.length - 1];
          if (currentGroup && currentGroup.yearLabel === item.year) {
            currentGroup.items.push(item);
            return groups;
          }

          groups.push({ yearLabel: item.year, items: [item] });
          return groups;
        }, []),
    []
  );
  const outreachByYear = useMemo<OutreachYearGroup[]>(
    () =>
      profile.outreach
        .slice()
        .sort((a, b) => {
          const dateDelta = parsePeriodPart(b.date, 1) - parsePeriodPart(a.date, 1);
          if (dateDelta !== 0) {
            return dateDelta;
          }

          return a.title.localeCompare(b.title);
        })
        .reduce<OutreachYearGroup[]>((groups, item) => {
          const yearLabel = item.date.split(".")[0] ?? "N/A";
          const currentGroup = groups[groups.length - 1];
          if (currentGroup && currentGroup.yearLabel === yearLabel) {
            currentGroup.items.push(item);
            return groups;
          }

          groups.push({ yearLabel, items: [item] });
          return groups;
        }, []),
    []
  );

  return (
    <div className="page">
      <div className="ambient-bg" aria-hidden="true">
        <span className="blob blob-a"></span>
        <span className="blob blob-b"></span>
        <span className="blob blob-c"></span>
      </div>

      <header className="site-header">
        <a href="#" className="logo">
          {profile.name}
        </a>
        <nav>
          <ul>
            {navItems.map((item) => (
              <li key={item.href}>
                <a href={item.href}>{item.label}</a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main>
        <section className="hero reveal" id="about">
          <div className="hero-top">
            <div className="hero-copy">
              <h1>{profile.headline}</h1>
              {profile.subheadline ? (
                <p className="subheadline">{profile.subheadline}</p>
              ) : null}
              <div className="hero-focus-tags">
                {profile.focusAreas.map((area) => (
                  <span key={area}>{area}</span>
                ))}
              </div>
              <p className="intro">{profile.intro}</p>
              <div className="hero-meta">
                <span>{profile.affiliation}</span>
                <span>{profile.location}</span>
              </div>
              <div className="hero-actions">
                {profile.links.map((link) => {
                  const iconSrc = profileLinkIconByLabel[link.label.toLowerCase()];
                  const resolvedHref = resolveAssetPath(link.href);

                  return (
                    <a
                      key={link.label}
                      href={resolvedHref}
                      target={link.href.startsWith("http") ? "_blank" : undefined}
                      rel={link.href.startsWith("http") ? "noreferrer" : undefined}
                    >
                      {iconSrc ? (
                        <span className="hero-link-icon" aria-hidden="true">
                          <img src={resolveAssetPath(iconSrc)} alt="" loading="lazy" />
                        </span>
                      ) : null}
                      <span>{link.label}</span>
                    </a>
                  );
                })}
              </div>
            </div>
            <figure className="hero-portrait-card">
              <img
                src={resolveAssetPath("/media/headshots/portrait.png")}
                alt="Portrait of Jiwei Zhou"
                loading="eager"
              />
            </figure>
          </div>
          <div className="stats-grid">
            {heroStats.map((stat) => (
              <article key={stat.label} className="stat-card">
                <h2>{stat.value}</h2>
                <p>{stat.label}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section reveal" id="research">
          <div className="section-title-wrap">
            <h2>Research Interests</h2>
          </div>
          <div className="card-grid">
            {profile.research.map((item) => (
              <article key={item.area} className="paper-card">
                <h3>{item.area}</h3>
                <p>{item.summary}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section reveal" id="education">
          <CollapsibleList title="Education" count={profile.education.length} sectionHeading>
          {(expanded) => (
          <div className="cv-timeline education-timeline">
            {educationByMostRecent.slice(0, expanded ? undefined : 1).map((item) => (
              <article key={`${item.degree}-${item.period}`} className="cv-entry">
                <p className="cv-date">{item.period}</p>
                <span className="cv-track-node" aria-hidden="true"></span>
                <div className="timeline-card cv-card">
                  <header className="cv-card-head">
                    <h3>{item.degree}</h3>
                    <p className="cv-subtitle">{item.school}</p>
                  </header>
                  <ul>
                    {item.details.map((detail) => (
                      <li key={detail}>{detail}</li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
          )}
          </CollapsibleList>
        </section>

        <section className="section reveal" id="appointments">
          <CollapsibleList title="Appointments" count={profile.appointments.length} sectionHeading>
          {(expanded) => (
          <div
            className={`cv-timeline appointments-timeline${
              (expanded ? appointmentsByMostRecent.length : 1) <= 1 ? " cv-timeline-single" : ""
            }`}
          >
            {appointmentsByMostRecent.slice(0, expanded ? undefined : 1).map((item) => (
              <article key={`${item.role}-${item.period}`} className="cv-entry">
                <p className="cv-date">{item.period}</p>
                <span className="cv-track-node" aria-hidden="true"></span>
                <div className="timeline-card cv-card">
                  <header className="cv-card-head">
                    <h3>{item.role}</h3>
                    <p className="cv-subtitle">
                      {item.institution} | {item.location}
                    </p>
                  </header>
                  <ul>
                    {item.highlights.map((highlight) => (
                      <li key={highlight}>{highlight}</li>
                    ))}
                  </ul>
                  <div className="tag-row">
                    {item.stack.map((tech) => (
                      <span key={tech}>{tech}</span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
          )}
          </CollapsibleList>
        </section>

        <section className="section reveal" id="publications">
          <div className="section-title-wrap">
            <h2>Publications</h2>
          </div>

          <CollapsibleList title="Featured Publications" count={profile.publications.length} visibleCount={2}>
          {(expanded) => (
          <div className="publication-list">
            {profile.publications.slice(0, expanded ? undefined : 2).map((paper) => (
              <article key={paper.title} className="paper-card publication-card">
                <div className="paper-head">
                  <p>
                    {paper.venue} | {paper.year}
                  </p>
                  <div className="paper-actions">
                    <a
                      href={paper.href}
                      target={paper.href.startsWith("http") ? "_blank" : undefined}
                      rel={paper.href.startsWith("http") ? "noreferrer" : undefined}
                    >
                      Paper
                    </a>
                    {paper.codeHref ? (
                      <a
                        href={paper.codeHref}
                        target={paper.codeHref.startsWith("http") ? "_blank" : undefined}
                        rel={paper.codeHref.startsWith("http") ? "noreferrer" : undefined}
                      >
                        Code
                      </a>
                    ) : null}
                  </div>
                </div>
                <h3>{paper.title}</h3>
                <div className="publication-layout">
                  <div className="publication-copy">
                    <p>{paper.summary}</p>
                    <div className="tag-row">
                      {paper.tags.map((tag) => (
                        <span key={tag}>{tag}</span>
                      ))}
                    </div>
                  </div>
                  {paper.media.length > 0 ? (
                    <div className={`media-grid publication-media media-count-${paper.media.length}`}>
                      {paper.media.map((media) => {
                        const mediaSrc = resolveAssetPath(media.src);

                        return (
                          <figure
                            key={`${paper.title}-${media.src}`}
                            className={`media-card${
                              media.src === "/media/publications/ship-flowchart.png"
                                ? " media-card-uniform"
                                : ""
                            }${
                              media.src === "/media/publications/ship-image-2.png"
                                ? " media-card-under-second"
                                : ""
                            }`}
                          >
                            <button
                              type="button"
                              className="media-card-trigger"
                              onClick={() =>
                                setActivePreview({ src: mediaSrc, alt: media.alt })
                              }
                              aria-label={`Enlarge image: ${media.alt}`}
                            >
                              <img
                                className="media-thumb"
                                src={mediaSrc}
                                alt={media.alt}
                                loading="lazy"
                              />
                              <span className="media-zoom-hint" aria-hidden="true">
                                Click to enlarge
                              </span>
                            </button>
                          </figure>
                        );
                      })}
                    </div>
                  ) : null}
                </div>
              </article>
            ))}
          </div>

          )}
          </CollapsibleList>

          <CollapsibleList title="Journal Articles" count={profile.journalArticles.length} visibleCount={2}>
          {(expanded) => (
          <div className="proceedings-list">
            {previewYearGroups(journalArticlesByYear, expanded ? Infinity : 2).map((group) => (
              <section key={`journals-${group.yearLabel}`} className="proceeding-group">
                <p className="proceeding-year">{group.yearLabel}</p>
                <div className="proceeding-group-items">
                  {group.items.map((item) => (
                    <article key={item.citation} className="proceeding-item">
                      {isExternalHref(item.href) ? (
                        <a
                          href={item.href}
                          target="_blank"
                          rel="noreferrer"
                          className="proceeding-content timeline-card interactive-card-link"
                        >
                          <p className="card-note">
                            {formatPublicationCitation(item.citation)}
                          </p>
                          <span className="card-link-icon repo-link-arrow" aria-hidden="true">
                            View
                          </span>
                        </a>
                      ) : (
                        <div className="proceeding-content timeline-card">
                          <p className="card-note">
                            {formatPublicationCitation(item.citation)}
                          </p>
                        </div>
                      )}
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>

          )}
          </CollapsibleList>

          <CollapsibleList title="Peer-Reviewed Conference Proceedings" count={profile.conferenceProceedings.length} visibleCount={2}>
          {(expanded) => (
          <div className="proceedings-list">
            {previewYearGroups(conferenceProceedingsByYear, expanded ? Infinity : 2).map((group) => (
              <section key={`proceedings-${group.yearLabel}`} className="proceeding-group">
                <p className="proceeding-year">{group.yearLabel}</p>
                <div className="proceeding-group-items">
                  {group.items.map((item) => (
                    <article key={item.citation} className="proceeding-item">
                      {isExternalHref(item.href) ? (
                        <a
                          href={item.href}
                          target="_blank"
                          rel="noreferrer"
                          className="proceeding-content timeline-card interactive-card-link"
                        >
                          <p className="card-note">
                            {formatPublicationCitation(item.citation)}
                          </p>
                          <span className="card-link-icon repo-link-arrow" aria-hidden="true">
                            View
                          </span>
                        </a>
                      ) : (
                        <div className="proceeding-content timeline-card">
                          <p className="card-note">
                            {formatPublicationCitation(item.citation)}
                          </p>
                          {item.status ? (
                            <span className="card-status-pill">{item.status}</span>
                          ) : null}
                        </div>
                      )}
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>

          )}
          </CollapsibleList>

          <CollapsibleList title="Active Manuscripts" count={profile.manuscriptsUnderReview.length + profile.manuscriptsSubmitted.length + profile.manuscriptsInPreparation.length}
            hasMore={[profile.manuscriptsUnderReview, profile.manuscriptsSubmitted, profile.manuscriptsInPreparation].some((items) => items.length > 1)}>
          {(expanded) => (
          <div className="split-grid">
            <article className="timeline-card manuscript-card manuscript-card-review">
              <header className="manuscript-card-head">
                <h3>Under Review</h3>
                <span className="card-status-pill manuscript-card-count">
                  {profile.manuscriptsUnderReview.length}
                </span>
              </header>
              <ul className="manuscript-list">
                {profile.manuscriptsUnderReview.slice(0, expanded ? undefined : 1).map((item) => (
                  <li key={item.title} className="manuscript-item">
                    <div className="manuscript-copy">
                      <p className="manuscript-line manuscript-title">{item.title}</p>
                      <p className="manuscript-line manuscript-venue manuscript-venue-line">
                        {item.venue}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </article>
            <article className="timeline-card manuscript-card manuscript-card-submitted">
              <header className="manuscript-card-head">
                <h3>Submitted</h3>
                <span className="card-status-pill manuscript-card-count">
                  {profile.manuscriptsSubmitted.length}
                </span>
              </header>
              <ul className="manuscript-list">
                {profile.manuscriptsSubmitted.slice(0, expanded ? undefined : 1).map((item) => (
                  <li key={item.title} className="manuscript-item">
                    <p className="manuscript-line manuscript-title">{item.title}</p>
                  </li>
                ))}
              </ul>
            </article>
            <article className="timeline-card manuscript-card manuscript-card-prep">
              <header className="manuscript-card-head">
                <h3>In Preparation</h3>
                <span className="card-status-pill manuscript-card-count">
                  {profile.manuscriptsInPreparation.length}
                </span>
              </header>
              <ul className="manuscript-list">
                {profile.manuscriptsInPreparation.slice(0, expanded ? undefined : 1).map((item) => (
                  <li key={item.title} className="manuscript-item">
                    <p className="manuscript-line">
                      <span className="manuscript-title">{item.title}</span>
                      <span aria-hidden="true"> | </span>
                      <span className="manuscript-venue">{item.venue}</span>
                    </p>
                  </li>
                ))}
              </ul>
            </article>
          </div>
          )}
          </CollapsibleList>
        </section>

        <section className="section reveal" id="talks">
          <div className="section-title-wrap">
            <h2>Talks</h2>
          </div>

          <CollapsibleList title="Conference Presentations" count={profile.conferencePresentations.length} visibleCount={2}>
          {(expanded) => (
          <div className="proceedings-list">
            {previewYearGroups(conferencePresentationsByYear, expanded ? Infinity : 2).map((group) => (
              <section
                key={`presentations-${group.yearLabel}`}
                className="proceeding-group"
              >
                <p className="proceeding-year">{group.yearLabel}</p>
                <div className="proceeding-group-items">
                  {group.items.map((item) => (
                    <article
                      key={`${item.event}-${item.year}-${item.location}`}
                      className="proceeding-item"
                    >
                      <div className="proceeding-content timeline-card presentation-content">
                        <h3>{item.event}</h3>
                        <p className="card-note">{item.title}</p>
                        <div className="tag-row">
                          <span>{item.location}</span>
                          {item.note ? <span>{item.note}</span> : null}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>

          )}
          </CollapsibleList>

          <CollapsibleList title="Public Speaking and Outreach" count={profile.outreach.length}>
          {(expanded) => (
          <div className="proceedings-list">
            {previewYearGroups(outreachByYear, expanded ? Infinity : 1).map((group) => (
              <section key={`outreach-${group.yearLabel}`} className="proceeding-group">
                <p className="proceeding-year">{group.yearLabel}</p>
                <div className="proceeding-group-items">
                  {group.items.map((item) => (
                    <article
                      key={`${item.date}-${item.title}`}
                      className="proceeding-item"
                    >
                      <div className="proceeding-content timeline-card outreach-content">
                        <header>
                          <h3>{item.title}</h3>
                          <p>
                            {item.organization} | {item.location}
                          </p>
                          <span>{item.date}</span>
                        </header>
                        <p className="card-note">{item.summary}</p>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>
          )}
          </CollapsibleList>
        </section>

        <section className="section reveal" id="service">
          <CollapsibleList title="Service, Funding, and Awards" sectionHeading>
          {(expanded) => (
          <div className="split-grid">
            <article className="timeline-card">
              <header>
                <h3>Professional Service</h3>
              </header>
              {profile.service.map((group) => (
                <div key={group.category} className="service-group">
                  <p className="group-title">{group.category}</p>
                  <ul>
                    {group.entries.slice(0, expanded ? undefined : 3).map((entry) => (
                      <li key={entry}>{entry}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </article>
            <article className="timeline-card">
              <header>
                <h3>Funding and Grants</h3>
              </header>
              <ul>
                {profile.funding.slice(0, expanded ? undefined : 1).map((grant) => (
                  <li key={grant.source}>
                    {grant.source} | {grant.details}
                  </li>
                ))}
              </ul>
              <h4 className="card-subheading">Proposals in Preparation</h4>
              <ul>
                {profile.proposalsInPreparation.map((proposal) => (
                  <li key={proposal.source}>
                    {proposal.source} | {proposal.details}
                  </li>
                ))}
              </ul>
              <h3 className="card-subheading">Awards and Honors</h3>
              <ul>
                {profile.awards.slice(0, expanded ? undefined : 1).map((award) => (
                  <li key={`${award.name}-${award.year}`}>
                    {award.name} | {award.organization} ({award.year})
                  </li>
                ))}
              </ul>
            </article>
          </div>
          )}
          </CollapsibleList>
        </section>

        <section className="section reveal" id="leadership">
          <div className="section-title-wrap">
            <h2>Leadership, Certification, Teaching, and Media</h2>
          </div>

          <CollapsibleList title="Leadership Experience" count={profile.leadership.length}>
          {(expanded) => (
          <div className="cv-timeline">
            {leadershipByMostRecent.slice(0, expanded ? undefined : 1).map((item) => (
              <article key={`${item.role}-${item.period}`} className="cv-entry">
                <p className="cv-date">{item.period}</p>
                <span className="cv-track-node" aria-hidden="true"></span>
                <div className="timeline-card cv-card">
                  <header className="cv-card-head">
                    <h3>{item.role}</h3>
                    <p className="cv-subtitle">
                      {item.institution} | {item.location}
                    </p>
                  </header>
                  <ul>
                    {item.highlights.map((highlight) => (
                      <li key={highlight}>{highlight}</li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>

          )}
          </CollapsibleList>

          <CollapsibleList title="Certification and Teaching Experience" count={profile.certifications.length}>
          {(expanded) => (
          <div className="cv-timeline">
            {certificationsByMostRecent.slice(0, expanded ? undefined : 1).map((item) => (
              <article key={`${item.title}-${item.period}`} className="cv-entry">
                <p className="cv-date">
                  {item.kind === "Certification" ? `Awarded ${item.period}` : item.period}
                </p>
                <span className="cv-track-node" aria-hidden="true"></span>
                <div className="timeline-card cv-card">
                  <header className="cv-card-head">
                    <span
                      className={`cv-kind ${
                        item.kind === "Certification"
                          ? "cv-kind-certification"
                          : "cv-kind-teaching"
                      }`}
                    >
                      {item.kind}
                    </span>
                    <h3>{item.title}</h3>
                    <p className="cv-subtitle">
                      {item.institution} | {item.location}
                    </p>
                  </header>
                  {item.details.length > 0 ? (
                    <ul>
                      {item.details.map((detail) => (
                        <li key={detail}>{detail}</li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </article>
            ))}
          </div>

          )}
          </CollapsibleList>

          <CollapsibleList title="Media Coverage" count={profile.mediaCoverage.length}>
          {(expanded) => (
          <div className="proceedings-list">
            {previewYearGroups(mediaByYear, expanded ? Infinity : 1).map((group) => (
              <section key={`media-${group.yearLabel}`} className="proceeding-group">
                <p className="proceeding-year">{group.yearLabel}</p>
                <div className="proceeding-group-items">
                  {group.items.map((item) => (
                    <article key={`${item.title}-${item.year}`} className="proceeding-item">
                      {isExternalHref(item.href) ? (
                        <a
                          href={item.href}
                          target="_blank"
                          rel="noreferrer"
                          className="proceeding-content timeline-card media-coverage-content interactive-card-link"
                        >
                          <header>
                            <h3>{item.title}</h3>
                            <p>{item.source}</p>
                          </header>
                          <p className="card-note">{item.summary}</p>
                          <span className="card-link-icon repo-link-arrow" aria-hidden="true">
                            View
                          </span>
                        </a>
                      ) : (
                        <div className="proceeding-content timeline-card media-coverage-content">
                          <header>
                            <h3>{item.title}</h3>
                            <p>{item.source}</p>
                          </header>
                          <p className="card-note">{item.summary}</p>
                          <span className="card-status-pill">Coverage</span>
                        </div>
                      )}
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>
          )}
          </CollapsibleList>
        </section>

        <section className="section reveal" id="github">
          <div className="section-title-wrap">
            <h2>Featured GitHub Repositories</h2>
          </div>
          {githubUsername === "your-username" ? (
            <p className="notice">
              Set `githubUsername` in <code>src/data/profile.ts</code> to display live repositories.
            </p>
          ) : null}
          {loadingRepos ? <p className="notice">Loading repositories...</p> : null}
          {repoError ? <p className="notice">{repoError}</p> : null}
          {!loadingRepos && !repoError && repos.length > 0 ? (
            <div className="card-grid compact">
              {repos.map((repo) => (
                <a
                  key={repo.id}
                  className="repo-card repo-card-link"
                  href={repo.html_url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Open ${repo.name} repository`}
                >
                  <div className="paper-head">
                    <p>{repo.language ?? "Code"}</p>
                    <span className="repo-link-arrow" aria-hidden="true">
                      View
                    </span>
                  </div>
                  <h3>{repo.name}</h3>
                  <p>{repo.description ?? "No description provided."}</p>
                  <div className="repo-meta">
                    <span>Stars {repo.stargazers_count}</span>
                    <span>Forks {repo.forks_count}</span>
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <div className="card-grid compact">
              {selectedSoftware.map((project) => (
                <a
                  key={project.name}
                  className="repo-card repo-card-link"
                  href={project.href}
                  target={project.href.startsWith("http") ? "_blank" : undefined}
                  rel={project.href.startsWith("http") ? "noreferrer" : undefined}
                  aria-label={`Open ${project.name} repository`}
                >
                  <div className="paper-head">
                    <p>Repository</p>
                    <span className="repo-link-arrow" aria-hidden="true">
                      View
                    </span>
                  </div>
                  <h3>{project.name}</h3>
                  <p>{project.description}</p>
                </a>
              ))}
            </div>
          )}
          {!loadingRepos &&
          !repoError &&
          githubUsername !== "your-username" &&
          repos.length === 0 &&
          selectedSoftware.length === 0 ? (
            <p className="notice">No featured repositories were found for this account.</p>
          ) : null}
        </section>

        <section className="section reveal" id="contact">
          <div className="section-title-wrap">
            <h2>Contact</h2>
          </div>
          <div className="contact-card">
            <p>For academic inquiries, collaborations, and other communications:</p>
            {profile.email === "your.email@example.com" ? (
              <p className="card-note">
                Add your preferred contact email in <code>src/data/profile.ts</code>.
              </p>
            ) : (
              <a href={`mailto:${profile.email}`}>{profile.email}</a>
            )}
          </div>
        </section>

        <section className="section reveal" id="visitors">
          <div className="timeline-card visitor-widget-card">
            <div
              id="mapmyvisitors-host"
              className="mapmyvisitors-host"
              aria-label="Website visitor map widget"
            ></div>
            {!mapWidgetLoaded ? (
              <a
                href={mapMyVisitorsHref}
                target="_blank"
                rel="noreferrer"
                className="visitor-map-fallback"
                title="Visit tracker"
                aria-label="Open map visitor tracker"
              >
                <img
                  src={mapMyVisitorsImageSrc}
                  alt="World map visitor tracker"
                  loading="lazy"
                />
              </a>
            ) : null}
            <noscript>
              <a href={mapMyVisitorsHref} title="Visit tracker">
                <img src={mapMyVisitorsImageSrc} alt="World map visitor tracker" />
              </a>
            </noscript>
          </div>
        </section>
      </main>

      {activePreview ? (
        <div
          className="hover-preview-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label="Publication image preview"
          onClick={() => setActivePreview(null)}
        >
          <div
            className="hover-preview-panel"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="hover-preview-close"
              onClick={() => setActivePreview(null)}
            >
              Close
            </button>
            <img src={activePreview.src} alt={activePreview.alt} />
          </div>
        </div>
      ) : null}

      <footer>
        <p>
          © {currentYear} {profile.name}. Built with React + Vite. Hosted on GitHub
          Pages.
        </p>
      </footer>
    </div>
  );
}

export default App;
