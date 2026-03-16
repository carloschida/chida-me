import type { CvEncodedType } from "@/schemas/cv.ts";

export const cv: CvEncodedType = {
  name: "Carlos Chida",
  headline: "Lead Software Developer",
  summary: [
    "Seasoned software architect and developer native to the cloud. Highly vested in SQL schemas that allow non-breaking expansions. Technical backgrounds in mathematical, financial, statistical, and computer sciences. Over a decade of translating stakeholder’s requirements in plain language to tasks and code.",
    "My experience spans multiple business lines. As a self-taught programmer, I enjoy discovering new technologies and for quick prototyping. I like mentoring teams from different cultures and backgrounds. Remote-first since 2019 but always willing to relocate should the opportunity arise.",
  ],

  location: {
    city: "Acapulco",
    country: "MX",
  },

  citizenship: ["MX", "ES"],

  skills: [
    "Software Architecture",
    "Leadership",
    "Software Development",
    "Mentorship",
  ],
  technologies: [
    "React",
    "React Native",
    "Next.js",
    "TypeScript",
    "JavaScript",
    "Node",
    "Effect.ts",
    "NestJs",
    "Expo",
    "Python",
    "Postgres",
    "MongoDB",
    "Firebase",
    "AWS",
    "Go (Golang)",
    "Google Cloud Platform",
    "Mathematica",
  ],

  languages: [
    { code: "es", level: 5 },
    { code: "en", level: 5 },
    { code: "it", level: 5 },
    { code: "fr", level: 4 },
    { code: "de", level: 4 },
    { code: "de-CH", level: 4 },
    { code: "pt-BR", level: 3 },
    { code: "ca", level: 2 },
  ],

  jobs: [
    {
      company: {
        name: "Yopaki",
        description: "Bitcoin exchange with further neo-bank capabilities",
        location: {
          city: "Austin",
          region: "TX",
          country: "US",
        },
      },

      name: "CTO",
      description:
        "Responsible for the development of the company's core products.",

      startDate: "2023-11-15",
      endDate: "2025-12-15",

      technologies: [
        "React Native",
        "TypeScript",
        "Next.js",
        "PostgreSQL",
        "Effect.ts",
        "Bitcoin",
        "tRPC",
        "GraphQL",
      ],
      skills: [
        "Leadership",
        "Software Architecture",
        "Compliance",
        "Software Development",
      ],
      achievements: [
        "Published and maintained iOS and Android apps created with React Native",
        "Implemented a bespoke double-entry booking system from scratch",
        "Created bespoke hot-cold wallet transfer and monitoring system",
        "Co-created streamlined KYC pipeline for multiple jurisdictions",
        "Created the monitoring and reporting system for the compliance officer to approve and submit to financial authorities",
        "Educated the team on functional programming with Effect.ts and refactored mission-critical code with it",
      ],

      projects: [
        {
          name: "Lotería Bitcoin",
          description:
            "A mobile app that allows users to play the Lottery of Bitcoin.",

          technologies: [
            "React Native",
            "TypeScript",
            "Expo",
            "PostgreSQL",
            "Bitcoin",
            "tRPC",
          ],
          skills: [
            "Software Development",
            "Software Architecture",
            "Software Procuring",
          ],
          responsibilities: [
            "Designed and implemented the entire app from scratch",
            "Implemented a bespoke double-entry booking system from scratch",
            "Created bespoke hot-cold wallet transfer and monitoring system",
            "Co-created streamlined KYC pipeline for multiple jurisdictions",
            "Created the monitoring and reporting system for the compliance officer to approve and submit to financial authorities",
          ],
        },

        {
          name: "Onboarding (KYC)",
          description: "Multi-jurisdictional KYC pipeline for the company.",

          technologies: [
            "React Native",
            "TypeScript",
            "Google Cloud Platform",
            "Expo",
            "PostgreSQL",
            "Next.js",
            "XState",
            "tRPC",
            "Regula",
          ],
          skills: [
            "Software Procurement",
            "Compliance",
            "Software Architecture",
            "Software Development",
          ],
          responsibilities: [
            "Procured physical identification verification software from various partners",
            "Instantiated DBs in two different jurisdictions due to regulatory requirements",
            "Led the implementation of the KYC pipelines into the mobile application",
            "Created crawlers to scrape data from Mexican authorities' public sites without an API",
          ],
        },

        {
          name: "Terminal Yopaki",
          description:
            "A POS system that would take customers' payments and in return the merchant would get Mexican pesos instantly",

          technologies: ["React", "Next.js", "PostgreSQL", "tRPC"],
          skills: ["Bank transfers", "Software Development"],
          achievements: [
            "Prototyped in under 2 weeks",
            "Onboarded the first customer with only 15 minutes of setup",
            "Transaction volume over 40,000 MXN in the first week",
          ],
        },

        {
          name: "Custodial Bitcoin buy-and-sell system",
          description: "The backbone of the company's exchange",

          technologies: [
            "PostgreSQL",
            "tRPC",
            "Bitcoin",
            "Compliance",
            "Retool",
          ],
          skills: [
            "Financial Procurement",
            "Compliance",
            "Software Development",
          ],
          achievements: [
            "Achieved double-entry booking rules in Postgres with schemas and triggers",
            "90% of transactions actions and decisions were made in under 300 ms",
            "Compliance officer would only see 10% of false positives",
            "Management of hot-cold wallets for keeping the least amount of Bitcoin at risk",
          ],
        },
      ],
    },

    {
      name: "Senior Cloud Architect and Developer",

      company: {
        name: "Starchitecture",
        description: "Umbrella company for my freelancing projects",
        location: {
          city: "Barcelona",
          country: "ES",
        },
      },

      startDate: "2017-10-15",
      endDate: "2023-11-15",

      skills: ["Software Architecture", "Software Development", "Sales"],
      technologies: ["Vercel", "Next.js", "Astro"],

      achievements: [
        "Onboarded over 20+ restaurants into my bespoke menu by QR-code system with translations",
        "Negotiated long-term commitment discounts with a cloud provider on behalf of a client",
      ],

      projects: [
        {
          company: {
            name: "Zaprite",
            description: "Umbrella company for my freelancing projects",
            location: {
              city: "Austin",
              region: "TX",
              country: "US",
            },
          },

          name: "Rewrite into TypeScript",
          description:
            "Rewrite the whole codebase into TypeScript while modernising its use of Firebase",

          technologies: ["TypeScript", "Next.js", "Vercel", "tRPC", "Firebase"],
        },
      ],
    },

    {
      name: "Store Owner",

      company: {
        name: "Pintex Acapulco",
        description: "Paint and related products for home and business",
        location: {
          city: "Acapulco",
          region: "GRO",
          country: "MX",
        },
      },

      startDate: "2022-09-15",
      endDate: "2023-10-15",

      skills: ["Sales", "Logistics", "Marketing"],
      technologies: ["Alegra (PoS)", "Google Sheet", "Google Docs"],

      achievements: [
        "Handled inventory rotation with an average of USD 10,000 per month",
        "Installed Alegra PoS with initial inventory and of over 500 items",
        "Closed sales with an average of USD 7,500 per month with 30% profit",
        "Retained 60% customers with orders over USD 1,500",
      ],
    },

    {
      name: "Senior Software Developer",

      company: {
        name: "Bull Bitcoin",
        description:
          "Leading non-custodial Bitcoin exchange originated in Canada",
        location: {
          city: "Montréal",
          region: "QC",
          country: "CA",
        },
      },

      startDate: "2021-09-15",
      endDate: "2022-03-15",

      achievements: [
        "Modernised the company's tech stack to TypeScript",
        "Centralised most projects in a monorepo that spun up the whole development environment all at once with single command",
      ],

      projects: [
        {
          name: "Development Environment Setup",
          description: "Monorepo setup for all projects",
          technologies: [
            "Docker",
            "Next.js",
            "Turborepo",
            "Vercel",
            "Bash",
            "Docker",
          ],
          skills: ["Networking"],
          achievements: [
            "Created a monorepo that spun up the whole development environment all at once with single command",
            "Managed localhost networking via manipulation of the hosts file by a shell script",
            "Containerised all services with Docker",
          ],
        },
        {
          name: "Unified API",
          description:
            "Created the unified GraphQL API for all the company's products",
          technologies: ["TypeScript", "Next.js", "PostgreSQL", "GraphQL"],
          achievements: [
            "Normalised the database schemas to allow for non-breaking expansions",
            "Set up the unified endpoint to reach the multiple services of the company by means of GraphQL stitching and merging",
            "Created a pipeline that automated the generation of GraphQL clients along with its queries and mutations",
          ],
        },
        {
          name: "New Authentication",
          description: "Multi-Project authentication system",
          technologies: ["Golang", "Docker", "Kubernetes", "OAuth2"],
          skills: ["Software Architecture", "Cyber Security"],
          achievements: [
            "Mastered Go in a single weekend to expand the base open source projects",
            "Augmented the open source project ory/kratos to support migration of OTPs",
            "Contributed the open source project ory/hydra for a better integration with ory/kratos",
          ],
        },
      ],
    },

    {
      name: "Senior Software Developer",

      company: {
        name: "Veriphi",
        description: "White-Glove Bitcoin services",
        location: {
          city: "Montréal",
          region: "QC",
          country: "CA",
        },
      },

      startDate: "2021-01-15",
      endDate: "2021-09-15",

      technologies: ["TypeScript", "Next.js", "React", "Firebase", "Vercel"],
      skills: ["Software Development", "Software Architecture"],
      achievements: [
        "Modernised the company's tech stack to TypeScript",
        "Implemented a thorough test suite for Firebase rules and mission-critical functions",
        "Oversaw the tech transition after the acquisition of the company by Bull Bitcoin",
      ],

      projects: [
        {
          name: "Migration to TypeScript",
          description:
            "Rewrote the entire codebase from JavaScript into TypeScript",
          technologies: [
            "TypeScript",
            "Next.js",
            "React",
            "Firebase",
            "Vercel",
          ],
        },
        {
          name: "Firebase emulators",
          description: "Set up the Firebase emulators for local development",
          technologies: ["Firebase", "Shell"],
          achievements: [
            "Created a script to automate the instantiation of Firebase emulators for local development",
            "Implemented a watch script to automatically restart the emulator when pertinent code changes required it",
          ],
        },
      ],
    },

    {
      name: "Senior Back-End Developer",

      company: {
        name: "Xara",
        description: "High-End document editor with web and desktop versions",
        location: {
          city: "London",
          country: "GB",
        },
        url: "https://xara.com",
      },

      startDate: "2019-01-15",
      endDate: "2021-01-15",

      technologies: [
        "JavaScript",
        "AWS",
        "Jenkins",
        "Jira",
        "Docker",
        "Kubernetes",
        "Helm",
        "MongoDB",
      ],
      skills: ["Software Development"],

      projects: [
        {
          name: "New Authentication for Desktop Products",

          technologies: ["JavaScript", "AWS Lambda", "JWT"],
          skills: ["Software Architecture", "Cyber Security"],
          achievements: [
            "Introduced the first AWS Lambda project for the company",
            "Negotiated different functionalities after spotting inconsistencies in the existing authentication system",
          ],
        },
        {
          name: "Templating Service",
          description:
            "Handling of the new templating system for featured templates created by the staff plus clients' own templates",
          technologies: ["JavaScript", "Docker"],
          skills: ["Software Development"],
        },
        {
          name: "New Kubernetes Cluster",
          description: "Moved the Kubernetes cluster from on-premise to AWS",
          technologies: ["Kubernetes", "Helm", "Jenkins", "Skaffold"],
          achievements: [
            "Automated the update of helm charts out of Jira tickets",
            "Updated the Jenkins pipeline to embrace the new deployment target",
            "Streamlined the development process by implementing Skaffold and a Kubernetes cluster for each developer",
          ],
        },
        {
          name: "Mongo DB migration to AWS Document DB",
          description: "Migrated the company's Mongo DB to AWS Document DB",
          technologies: ["MongoDB", "AWS Document DB"],
          achievements: [
            "Migrated the company's Mongo DB to AWS Document DB",
            "Implemented custom aggregation functions since AWS Document DB's API did not support them at the time",
          ],
        },
      ],
    },

    {
      name: "Director of Technology",

      company: {
        name: "Crowdhouse",
        description: "Crowdinvestment platform for real estate",
        location: {
          city: "Zurich",
          country: "CH",
        },
        url: "https://crowdhouse.com",
      },

      startDate: "2018-09-15",
      endDate: "2019-09-15",

      technologies: [
        "JavaScript",
        "Angular",
        "React",
        "Node",
        "Express",
        "MongoDB",
        "PostgreSQL",
        "Docker",
        "Kubernetes",
        "Jenkins",
      ],
      skills: ["Leadership", "Software Architecture", "Mentoring"],

      responsibilities: [
        "Migration of the MVP from bare-metal servers to Google Cloud Platform",
        "Mentoring for existing employees to adapt to the new tech stack",
        "Hiring manager for all tech-related positions",
      ],

      projects: [
        {
          name: "Utility Token on Ethereum",
          description:
            "The first project to be presented to the Swiss financial authorities to ",
          technologies: ["Ethereum", "Compliance"],
          achievements: [
            "Implemented a token-holder while list as per Swiss regulations (Lex Koller)",
            "Created a comprehensive test suite with a GUI for non-technical stakeholders to try out",
          ],
        },
      ],

      previousPositions: [
        {
          name: "Enterprise Architect",
          startDate: "2016-09-15",
          endDate: "2018-09-15",

          responsibilities: [
            "Aligning the company's vision with the business capabilities while improving the inherited codebase",
          ],
          achievements: [
            "Negotiated a severe discount for our Salesforce licences",
            "Migrated the physical infrastructure from a 3-bedroom apartment to a 6-story building in a single weekend",
          ],

          projects: [
            {
              name: "Partner portal",
              description:
                "MVP of the second product of the company to acquire real-estate deals",
              technologies: ["Angular", "Node", "Express", "MongoDB"],
            },
          ],
        },
      ],
    },

    {
      name: "Assistant for Quantitative Business Administration",
      description:
        "Creation of the first learning and assessment platform based on Wolfram Mathematica",

      company: {
        name: "University of Zurich",
        location: {
          city: "Zurich",
          country: "CH",
        },
      },

      startDate: "2014-03-15",
      endDate: "2016-08-15",

      technologies: [
        "Wolfram Mathematica",
        "Angular.js",
        "Express",
        "Node",
        "MongoDB",
      ],
    },

    {
      name: "Teaching Assistant",

      company: {
        name: "National Autonomous University of Mexico | Faculty of Science",
        description:
          "Top-Ranked university in Spanish America and my alma mater",
        location: {
          city: "Mexico City",
          country: "MX",
        },
      },

      startDate: "2012-09-15",
      endDate: "2013-08-15",

      technologies: ["Java", "LaTeX"],

      responsibilities: [
        "Superior Algebra II (2nd semester)",
        "Linear Algebra I (3rd semester)",
        "Programming I (3rd semester, in Java)",
      ],
    },

    {
      name: "Financial Advisor",
      description: "Promotion of financial products and services to clients",

      company: {
        name: "Grupo Financiero Inbursa",
        description:
          "Financial group of Carlos Slim, the richest man in Mexico",
        location: {
          city: "Mexico City",
          country: "MX",
        },
      },

      startDate: "2009-10-15",
      endDate: "2010-03-15",

      achievements: [
        "Opened accounts for USD 20,000",
        "Insured motor vehicles for USD 100,000",
        "Achieve credit granting for USD 50,000",
      ],
    },

    {
      name: "Tech expert",
      description:
        "Advisory for new computers and peripherals, and assembly of cutomised equipment",

      company: {
        name: "Sumicom",
        description: "Computer repair and assembly shop",
        location: {
          city: "Acapulco",
          region: "GRO",
          country: "MX",
        },
      },

      startDate: "2005-08-15",
      endDate: "2008-07-15",
    },
  ],
};
