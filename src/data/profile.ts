export type LinkItem = {
  label: string;
  href: string;
};

export type ResearchItem = {
  area: string;
  summary: string;
};

export type EducationItem = {
  degree: string;
  school: string;
  period: string;
  details: string[];
};

export type AppointmentItem = {
  role: string;
  institution: string;
  location: string;
  period: string;
  highlights: string[];
  stack: string[];
};

export type PublicationMediaItem = {
  src: string;
  alt: string;
};

export type PublicationItem = {
  title: string;
  venue: string;
  year: string;
  summary: string;
  href: string;
  codeHref?: string;
  tags: string[];
  media: PublicationMediaItem[];
};

export type HighlightStat = {
  label: string;
  value: string;
};

export type ProceedingItem = {
  citation: string;
  href: string;
};

export type ManuscriptItem = {
  title: string;
  venue: string;
  status: string;
};

export type PresentationItem = {
  event: string;
  title: string;
  location: string;
  year: string;
};

export type OutreachItem = {
  date: string;
  title: string;
  organization: string;
  location: string;
  summary: string;
};

export type LeadershipItem = {
  role: string;
  institution: string;
  location: string;
  period: string;
  highlights: string[];
};

export type CertificationItem = {
  kind: "Certification" | "Teaching";
  title: string;
  institution: string;
  location: string;
  period: string;
  details: string[];
};

export type MediaCoverageItem = {
  title: string;
  source: string;
  year: string;
  summary: string;
  href?: string;
};

export type ServiceGroup = {
  category: string;
  entries: string[];
};

export type FundingItem = {
  source: string;
  details: string;
};

export type AwardItem = {
  name: string;
  organization: string;
  year: string;
};

export const profile = {
  name: "Jiwei Zhou, Ph.D.",
  headline: "Computer Vision Scientist and Applied AI Researcher",
  subheadline: "Ph.D., Purdue University",
  focusAreas: [
    "Applied AI",
    "Computer Vision",
    "Smart Manufacturing",
    "Engineering Design"
  ],
  location: "Evansville, IN, USA",
  email: "hiramzhou31@gmail.com",
  affiliation: "Computer Vision Scientist, Heliponix LLC",
  intro:
    "I develop advanced AI systems at the intersection of computer vision, multimodal large language models, and CAD for engineering design and smart manufacturing. Across industry and academic work, I focus on model-based visual inspection, design automation, and AI-assisted engineering workflows that move from research prototypes to real-world deployment.",
  links: [
    { label: "Google Scholar", href: "https://scholar.google.com/citations?hl=en&user=ophvuUEAAAAJ&view_op=list_works&gmla=AETOMgGIexRBH3CgYxkSHxTbf8OQAA0OkBXGfN86tMLoO8ffZhp_abXFUw_NFJs1fWRlspjUMewdhPL7-qCYYmnS" },
    { label: "GitHub", href: "https://github.com/Hiram31" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/zhoujiwei/" },
    { label: "CV", href: "/CV_latest.pdf" }
  ] as LinkItem[],
  stats: [
    { label: "Peer-Reviewed Publications", value: "13" },
    { label: "Journal Articles", value: "6" },
    { label: "Conference Proceedings", value: "7" },
    { label: "Manuscripts Pipeline", value: "7" },
    { label: "Conference Presentations", value: "6" },
    { label: "Public Outreach Talks", value: "7" },
    { label: "Funding and Grants", value: "3" },
    { label: "Industry Experience", value: "13+ years" }
  ] as HighlightStat[],
  research: [
    {
      area: "Applied AI and Machine Vision",
      summary:
        "Computer vision and deep learning systems for robust real-world deployment."
    },
    {
      area: "Generative AI for Design",
      summary:
        "Multimodal LLMs and AI agents for intuitive parametric CAD modeling and design automation."
    },
    {
      area: "Smart Manufacturing",
      summary:
        "Model-Based Definition (MBD), Digital Thread, CAPP, and Digital Manufacturing workflows."
    },
    {
      area: "Product Lifecycle and Engineering Systems",
      summary:
        "CAD and PLM-based automation pipelines that connect engineering knowledge to production."
    }
  ] as ResearchItem[],
  education: [
    {
      degree: "Ph.D. in Technology",
      school: "Purdue University, West Lafayette, IN, USA",
      period: "2019.8 - 2023.5",
      details: [
        "Graduated with GPA 3.98/4.0.",
        "Research assistant at Purdue Digital Enterprise Center (DEC).",
        "Research focus on machine vision, model-based solutions, and smart manufacturing."
      ]
    },
    {
      degree: "M.Eng. in Software Engineering",
      school: "Shanghai Jiao Tong University, Shanghai, China",
      period: "2013.4 - 2016.6",
      details: [
        "Graduate training in software engineering and systems development."
      ]
    },
    {
      degree: "B.E. in Mechanical Design and Manufacture and Automation",
      school:
        "Zhuhai College of Jilin University (now Zhuhai College of Science and Technology), Guangdong, China",
      period: "2008.9 - 2012.7",
      details: [
        "Undergraduate foundation spanning mechanical engineering and engineering design."
      ]
    }
  ] as EducationItem[],
  appointments: [
    {
      role: "Computer Vision Scientist",
      institution: "Heliponix LLC",
      location: "Evansville, IN, USA",
      period: "2023.6 - Present",
      highlights: [
        "Conduct interdisciplinary research in applied AI to drive innovation in engineering design, smart manufacturing, and technology education.",
        "Lead deployment of AI-powered vision systems in IoT-enabled smart appliances for real-time crop monitoring and autonomous decision-making.",
        "Collaborate across hardware and software teams to design cyber-physical prototypes integrating imaging sensors, edge AI, and cloud analytics.",
        "Develop and optimize machine learning and deep learning algorithms for computer vision hardware and software."
      ],
      stack: ["Computer Vision", "Deep Learning", "IoT", "Edge-to-Cloud AI", "Precision Agriculture"]
    },
    {
      role: "Graduate Research Assistant",
      institution: "Digital Enterprise Center, Purdue University",
      location: "West Lafayette, IN, USA",
      period: "2019.8 - 2023.5",
      highlights: [
        "Developed a model-based visual inspection system (MBVIS) using GD&T from model-based definition (MBD) datasets and validated agreement against commercial inspection systems.",
        "Used OpenCV-Python and convolutional neural networks to improve efficiency in critical bottle parameter measurements.",
        "Implemented RESTful APIs in Java to support interactive work instructions and bill-of-material workflows on a product data management (PDM) system.",
        "Customized tooling management, process planning, workflow, and organizational structures on the PDM system for industry-facing demonstrations."
      ],
      stack: ["MBVIS", "Machine Vision", "GD&T", "MBD", "OpenCV", "CNN", "Java", "REST APIs", "PDM"]
    },
    {
      role: "Application Engineer",
      institution: "Siemens Industry Software",
      location: "Shanghai, China",
      period: "2012.7 - 2019.7",
      highlights: [
        "Led Siemens NX CAD testing and development quality activities, improving product reliability and reducing reported issues by 15%.",
        "Designed automated test workflows and achieved over 95% code coverage.",
        "Supported Siemens GO PLM partner universities through CAD training and academic-industry collaboration.",
        "Mentored junior engineers and coordinated quality assurance processes across international projects."
      ],
      stack: ["Siemens NX", "CAD", "PLM", "Quality Engineering", "Automation"]
    },
    {
      role: "NX Ship QA Intern",
      institution: "Siemens Industry Software",
      location: "Shanghai, China",
      period: "2011.7 - 2012.7",
      highlights: [
        "Tested NX Ship Manufacture modules to improve ship product quality.",
        "Created more than 300 reusable CAD parts to support drawing automation in shipbuilding workflows."
      ],
      stack: ["NX Ship", "QA Testing", "Drawing Automation", "CAD Reuse Parts"]
    }
  ] as AppointmentItem[],
  publications: [
    {
      title:
        "CADialogue: A Multimodal LLM-Powered Conversational Assistant for Intuitive Parametric CAD Modeling",
      venue: "Computer-Aided Design",
      year: "2026",
      summary:
        "Introduces a multimodal conversational framework for intuitive parametric CAD modeling.",
      href: "https://doi.org/10.1016/j.cad.2025.104006",
      codeHref: "https://github.com/Hiram31/CADialogue",
      tags: ["Multimodal LLM", "CAD", "Conversational Interface"],
      media: [
        {
          src: "/media/notion/demo.gif",
          alt: "CADialogue demo animation."
        },
        {
          src: "/media/notion/cadialogue-figure-1.png",
          alt: "CADialogue paper figure."
        }
      ]
    },
    {
      title:
        "The status, evolution, and future challenges of multimodal large language models (LLMs) in parametric CAD",
      venue: "Expert Systems with Applications",
      year: "2025",
      summary:
        "Systematic analysis of multimodal LLM applications, limitations, and opportunities in parametric CAD.",
      href: "https://doi.org/10.1016/j.eswa.2025.127520",
      tags: ["LLM", "Parametric CAD", "Survey"],
      media: [
        {
          src: "/media/notion/multimodal-llm-figure-1.jpg",
          alt: "Multimodal LLMs in CAD figure 1."
        },
        {
          src: "/media/notion/multimodal-llm-figure-11.jpg",
          alt: "Multimodal LLMs in CAD figure 11."
        }
      ]
    },
    {
      title:
        "An Approach to Drawing Automation of Ship Stiffeners in the Shipbuilding Industry",
      venue: "Computer-Aided Design and Applications",
      year: "2025",
      summary:
        "Presents an automation pipeline for engineering drawing generation in industrial shipbuilding workflows.",
      href: "https://doi.org/10.14733/cadaps.2025.25-41",
      tags: ["Drawing Automation", "CAD", "Shipbuilding"],
      media: [
        {
          src: "/media/notion/ship-flowchart.png",
          alt: "Ship stiffener drawing automation flowchart."
        },
        {
          src: "/media/notion/ship-image-1.png",
          alt: "Ship drawing automation result image 1."
        },
        {
          src: "/media/notion/ship-image-2.png",
          alt: "Ship drawing automation result image 2."
        }
      ]
    },
    {
      title:
        "A Model-Based Visual Inspection System (MBVIS) for Critical Plastic Bottle Dimensional Measurements",
      venue: "Computer-Aided Design and Applications",
      year: "2024",
      summary:
        "Introduces a model-based visual inspection framework for critical dimensional quality control.",
      href: "https://doi.org/10.14733/cadaps.2024.270-280",
      tags: ["Machine Vision", "Visual Inspection", "Manufacturing"],
      media: [
        {
          src: "/media/notion/mbvis-setup-safe.png",
          alt: "MBVIS experimental setup."
        },
        {
          src: "/media/notion/mbvis-page-4.png",
          alt: "MBVIS paper figure."
        }
      ]
    },
    {
      title:
        "Computer-aided process planning in immersive environments: A critical review",
      venue: "Computers in Industry",
      year: "2021",
      summary:
        "Critical review of immersive environment approaches for computer-aided process planning.",
      href: "https://doi.org/10.1016/j.compind.2021.103547",
      tags: ["CAPP", "Immersive Environments", "Review"],
      media: [
        {
          src: "/media/notion/capp-review-page-3.png",
          alt: "CAPP immersive environments review figure."
        }
      ]
    }
  ] as PublicationItem[],
  conferenceProceedings: [
    {
      citation:
        "Company, P., Camba, J. D., Contero, M., Zhou, J. (Accepted). From conceptual to embodiment design using Sketch-Based Modeling and Feature Recognition Techniques. 23rd annual International CAD Conference (CAD'26).",
      href: "#"
    },
    {
      citation:
        "Zhou, J., Camba, J. D., Company, P., Contero, M. (Accepted). Drawing-Checker: A Vision RAG Framework for Automated Comparison of Engineering Drawings. 36th CIRP Design Conference (CIRP Design 2026).",
      href: "#"
    },
    {
      citation:
        "Zhou, J., Gupta, D., and Camba, J. D. (Accepted). Prompt2CAD: A Lightweight LLM Framework for Conversational CAD Generation and Iterative Refinement. 2025 International Conference on Industry of the Future and Smart Manufacturing (ISM).",
      href: "#"
    },
    {
      citation:
        "EngDraw-VQA: An Agent-Based Framework for Automated Visual Question Answering Generation From Engineering Drawings (Accepted). Manufacturing Science and Engineering Conference (MSEC) 2026.",
      href: "#"
    },
    {
      citation:
        "Gupta, D., Camba, J. D., Fuerst, T., and Zhou, J. (2025). WIP: An AI-Based Virtual Assistant for Supporting a Large Engineering Course. 2025 IEEE Frontiers in Education Conference (FIE).",
      href: "https://doi.org/10.1109/FIE63693.2025.11328408"
    },
    {
      citation:
        "Zhou, J., and Hartman, N. W. (2023). A Framework for Model-Based Visual Inspection: A Case Study of Bottle Dimensional Measurements in the Plastics Industry. 2023 CAD Conference and Exposition.",
      href: "https://doi.org/10.14733/cadconfP.2023.74-79"
    },
    {
      citation:
        "Zhou, J., Camba, J. D., Hartman, N. W., and Li, Z. (2022). An Approach to Extend the Digital Thread From Requirements to Model Geometry. Manufacturing Science and Engineering Conference (MSEC) 2022.",
      href: "https://doi.org/10.1115/MSEC2022-80857"
    },
    {
      citation:
        "Zhou, J., Camba, J. D., and Fuerst, T. (2022). A Comparative Study on the Use and Interpretation of Annotated 3D Models. IFIP PLM 2021. Best Paper Award Nominee.",
      href: "https://doi.org/10.1007/978-3-030-94399-8_23"
    }
  ] as ProceedingItem[],
  manuscriptsUnderReview: [
    {
      title:
        "GenAI-Aided Design in Engineering Education: Competencies, Challenges, and Opportunities",
      venue: "Computer-Aided Design",
      status: "Under Review"
    },
    {
      title:
        "From Queries to Conversations: Exploring AI-Based Virtual Assistant Adoption, Usability, and Impact in Engineering Education",
      venue: "ASEE Computers in Education",
      status: "Under Review"
    },
    {
      title:
        "EngDraw-Extractor: A Multi-Agent System for Information Extraction from 2D Engineering Drawings",
      venue: "IDETC-CIE 2026",
      status: "Under Review"
    },
    {
      title:
        "Large Language Models in Digital Manufacturing: An Empirical Study of Verification-Centered Design Cognition",
      venue: "DCC'26",
      status: "Under Review"
    }
  ] as ManuscriptItem[],
  manuscriptsInPreparation: [
    {
      title:
        "ParamDrawCAD: A Multimodal Dataset Linking Parametric CAD Models, Geometry, and Engineering Drawings",
      venue: "Planned Submission",
      status: "In Preparation"
    },
    {
      title:
        "EngDraw-Annotator: Schema-Aware, LLM-Assisted Annotation for Engineering Drawings",
      venue: "Planned Submission",
      status: "In Preparation"
    }
  ] as ManuscriptItem[],
  conferencePresentations: [
    {
      event:
        "7th International Conference on Industry of the Future and Smart Manufacturing (ISM 2025)",
      title:
        "Prompt2CAD: A Lightweight LLM Framework for Conversational CAD Generation and Iterative Refinement",
      location: "University of Malta, Malta",
      year: "2025"
    },
    {
      event: "NAPPN Annual Conference",
      title:
        "Integrating Artificial Intelligence in Plant Growth Monitoring for Innovative Rotary Aeroponic Systems",
      location: "Olivette, MO, USA",
      year: "2025"
    },
    {
      event: "10th International Conference on Mechanics, Materials and Manufacturing (ICMMM)",
      title:
        "Development and Evaluation of a Vision Inspection System for Plastic Bottle Measurement",
      location: "Washington, D.C., USA",
      year: "2023"
    },
    {
      event: "20th Annual International CAD Conference (CAD'23)",
      title:
        "A Framework for Model-Based Visual Inspection: A Case Study of Bottle Dimensional Measurements in the Plastics Industry",
      location: "Mexico City, Mexico",
      year: "2023"
    },
    {
      event: "17th International Manufacturing Science and Engineering Conference (MSEC)",
      title: "An Approach to Extend the Digital Thread from Requirements to Model Geometry",
      location: "West Lafayette, IN, USA",
      year: "2022"
    },
    {
      event: "18th International Conference on Product Lifecycle Management (PLM 2021)",
      title: "A Comparative Study on the Use and Interpretation of Annotated 3D Models",
      location: "Virtual Conference",
      year: "2021"
    }
  ] as PresentationItem[],
  outreach: [
    {
      date: "2025.6",
      title: "Southwest Ecosystem Exchange",
      organization: "Southwest Ecosystem Exchange",
      location: "Evansville, IN",
      summary:
        "Shared startup journey and support resources including SBIR/STTR, match funding, and local partnerships."
    },
    {
      date: "2025.4",
      title: "Generative AI and Programming-Based CAD",
      organization: "Purdue University",
      location: "West Lafayette, IN",
      summary:
        "Delivered a 120-minute guest lecture on programming-based CAD and generative AI-enhanced design automation."
    },
    {
      date: "2025.3",
      title:
        "Internationally Friendly Employer Panel, CCO International Student Workshop",
      organization: "Purdue University",
      location: "West Lafayette, IN",
      summary:
        "Panelist discussing transitions from international graduate studies to U.S. technology careers."
    },
    {
      date: "2025.1",
      title: "Leveraging Artificial Intelligence for a Competitive Edge in Business",
      organization: "Indiana University",
      location: "Bloomington, IN",
      summary:
        "Keynote on AI opportunities, adoption challenges, and practical competitive strategies."
    },
    {
      date: "2025.1",
      title: "Growing Smarter: How AI Helps Plants Thrive",
      organization: "University of Evansville",
      location: "Evansville, IN",
      summary:
        "Presented AI applications for agriculture and plant growth to youth innovation audiences."
    },
    {
      date: "2024.11",
      title: "Journey from Academia to Industry",
      organization: "Purdue University in Indianapolis",
      location: "Indianapolis, IN",
      summary:
        "Presented practical guidance on career growth and skills for transitioning from academia to industry."
    },
    {
      date: "2024.11",
      title: "Seeing with Smarts: How AI Helps Plants Grow",
      organization: "Heliponix LLC",
      location: "Evansville, IN",
      summary:
        "Interactive outreach session introducing AI and computer vision concepts to middle and high school students."
    }
  ] as OutreachItem[],
  leadership: [
    {
      role: "Research Associate Supervisor",
      institution: "Heliponix LLC",
      location: "Evansville, IN, USA",
      period: "2023.6 - Present",
      highlights: [
        "Supervised a research associate, providing technical guidance and overseeing weekly progress on tasks related to plant science and computer vision."
      ]
    },
    {
      role: "Vice President",
      institution: "Christian Students at Purdue (CSaP), Purdue University",
      location: "West Lafayette, IN, USA",
      period: "2020.1 - 2023.5",
      highlights: [
        "Supervised organization operations and organized a weekly Bible study for club members."
      ]
    },
    {
      role: "Mentor",
      institution: "Siemens Industry Software",
      location: "Shanghai, China",
      period: "2012.7 - 2019.7",
      highlights: [
        "Guided junior engineers and interns on professional CAD modeling and PLM application knowledge."
      ]
    }
  ] as LeadershipItem[],
  certifications: [
    {
      kind: "Teaching",
      title: "Siemens Teamcenter Instructor",
      institution: "PLM Product Development Center (PPDC)",
      location: "Shanghai, China",
      period: "2013.7 - 2019.7",
      details: [
        "Offered formal training in CAD skills and Teamcenter applications to new employees."
      ]
    },
    {
      kind: "Certification",
      title: "Siemens Certified NX CAD Instructor",
      institution: "Siemens",
      location: "Shanghai, China",
      period: "2011.9",
      details: []
    }
  ] as CertificationItem[],
  mediaCoverage: [
    {
      title: "Southwest Ecosystem Exchange",
      source: "Southwest Ecosystem Exchange",
      year: "2025",
      summary: "Presentation on Anu's startup journey and ESO partnerships.",
      href: "https://www.linkedin.com/posts/andiehines_bedfordcollab-ugcPost-7341266010043228161-cBDH/?utm_source=share&utm_medium=member_desktop&rcm=ACoAABXmn5UBV_M6VVv0ULmmEz_qUklGvMVe-6Y"
    },
    {
      title: "International Student Career Planning Panelist",
      source:
        "Purdue University Center for Career Opportunities & Office of Professional Practice",
      year: "2024",
      summary:
        "Invited panelist discussing international student career planning and transitions into U.S. industry roles.",
      href: "https://www.linkedin.com/posts/schui-dwyer_purduecco-purdueopp-internationalstudents-ugcPost-7303057304617111553-bL3b?utm_source=share&utm_medium=member_desktop&rcm=ACoAABXmn5UBV_M6VVv0ULmmEz_qUklGvMVe-6Y"
    },
    {
      title: "MBA Consulting Project Keynote",
      source: "Indiana University Kelley School of Business",
      year: "2024",
      summary:
        "Invited keynote speaker on Food as Medicine, presenting Anu's AI-driven indoor farming approach to health and sustainability.",
      href: "https://www.linkedin.com/posts/ugcPost-7290814747510198274-hof-?utm_source=share&utm_medium=member_desktop&rcm=ACoAABXmn5UBV_M6VVv0ULmmEz_qUklGvMVe-6Y"
    },
    {
      title: "Realizing the Digital Enterprise Poster Coverage",
      source: "Purdue University",
      year: "2022",
      summary:
        "Poster presentation on Realizing the Digital Enterprise projects highlighted in university media coverage.",
      href: "https://polytechnic.purdue.edu/newsroom/student-researchers-present-realizing-digital-enterprise-projects-spring-poster-session-2"
    }
  ] as MediaCoverageItem[],
  funding: [
    {
      source:
        "National Science Foundation (NSF) SBIR Phase II (Award No. 2151495)",
      details: "Partial support for research activities at Heliponix LLC."
    },
    {
      source: "Project PID2022-137254OB-I00 (MCIN/AEI/FEDER, EU)",
      details: "Research support for peer-reviewed publications at Heliponix LLC."
    },
    {
      source:
        "Wabash Heartland Innovation Network (Grant No. 4019008000 / 8000084103)",
      details: "Research support during work at Purdue University."
    }
  ] as FundingItem[],
  service: [
    {
      category: "Technical Program Committee",
      entries: [
        "13th International Conference on Mechanics, Materials and Manufacturing (ICMMM), 2026"
      ]
    },
    {
      category: "Session Chair",
      entries: [
        "10th International Conference on Mechanics, Materials and Manufacturing (ICMMM), 2023"
      ]
    },
    {
      category: "Conference Reviewer",
      entries: [
        "Institute of Industrial and Systems Engineers (IISE) Annual Conference & Expo, 2026",
        "International Manufacturing Science and Engineering Conference (MSEC), 2026",
        "American Society for Engineering Education (ASEE) Annual Conference & Exposition, 2023, 2024, 2026",
        "IEEE Frontiers in Education Conference (FIE), 2025, 2026"
      ]
    },
    {
      category: "Journal Reviewer",
      entries: [
        "Applied Soft Computing",
        "Artificial Intelligence and Applications",
        "ASEE Computers in Education",
        "Computer-Aided Design",
        "Computers & Graphics",
        "Computers & Industrial Engineering",
        "Design Studies",
        "Engineering Applications of Artificial Intelligence",
        "Engineering with Computers",
        "Expert Systems with Applications",
        "IEEE Transactions on Computational Social Systems",
        "Image and Vision Computing",
        "SoftwareX"
      ]
    }
  ] as ServiceGroup[],
  awards: [
    {
      name: "Conference Attendance Award",
      organization: "NAPPN Conference 2025 (USDA NIFA DSFAS Program)",
      year: "2025"
    },
    {
      name: "Purdue Graduate Research Assistantship",
      organization: "Purdue University",
      year: "2019 - 2023"
    },
    {
      name: "Best Paper Award Nominee",
      organization: "IFIP PLM 2021",
      year: "2021"
    },
    {
      name: "High-Performance Employee Award",
      organization: "Siemens PLM Software",
      year: "2014, 2016"
    }
  ] as AwardItem[]
};

export const selectedSoftware = [
  {
    name: "CADialogue",
    description:
      "Multimodal LLM-powered conversational assistant for intuitive parametric CAD modeling.",
    href: "https://github.com/Hiram31/CADialogue"
  }
];

export const githubUsername: string = "Hiram31";

export const scholarLink =
  "https://scholar.google.com/citations?hl=en&user=ophvuUEAAAAJ&view_op=list_works&gmla=AETOMgGIexRBH3CgYxkSHxTbf8OQAA0OkBXGfN86tMLoO8ffZhp_abXFUw_NFJs1fWRlspjUMewdhPL7-qCYYmnS";
