// Everything a visitor reads lives here. Edit this file to change the site's content.

export const profile = {
  name: "Evan Lei",
  email: "el3443@columbia.edu",
  github: "https://github.com/Evanlei",
  linkedin: "https://www.linkedin.com/in/evanlei06/",
  description:
    "Evan Lei, CS student at Columbia. Projects in computer vision, real-time collaboration, and music, plus internships at General Dynamics and URI.",
};

const favicon = (domain: string) => `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;

export const logos = {
  columbia: favicon("columbia.edu"),
};

export type Experience = {
  org: string;
  role: string;
  when: string;
  summary: string;
  logo: string;
  logoAlt: string;
  padLogo?: boolean;
};

// Listed most recent first.
export const experience: Experience[] = [
  {
    org: "URI Wearable Biosensing Lab",
    role: "SWE Intern",
    when: "Summer 2026",
    summary: "Streamed live heart rate from custom controller grips and built the filtering pipeline that cut data prep by 60%.",
    logo: favicon("uri.edu"),
    logoAlt: "University of Rhode Island",
  },
  {
    org: "General Dynamics",
    role: "SWE Intern",
    when: "Summer 2025",
    summary: "Python tools that automated pressure and tolerance checks on marine hardware models.",
    logo: favicon("gd.com"),
    logoAlt: "General Dynamics",
    padLogo: true,
  },
  {
    org: "URI GE Quantum Research Lab",
    role: "SWE Intern",
    when: "Spring 2025",
    summary: "Moved 500+ weekly hardware measurements into one place and built the workflow physicists used to read cryogenic sensor logs.",
    logo: favicon("uri.edu"),
    logoAlt: "University of Rhode Island",
  },
];

// Order in the cluster: General Dynamics first, then the two URI labs.
export const logoCluster = [experience[1], experience[0], experience[2]];

export type Project = {
  id: string;
  /** Short name shown on the trail sign. */
  camp: string;
  name: string;
  kicker: string;
  date: string;
  award?: string;
  description: string;
  stack: string[];
  links: { label: string; href: string }[];
  image?: { src: string; alt: string; kind?: "icon" };
  icon?: string;
};

export const projects: Project[] = [
  {
    id: "inko",
    camp: "Inko",
    name: "Inko",
    kicker: "Project",
    date: "Oct 2026",
    description:
      "A multiplayer whiteboard where hand-drawn graphs are executable. Sketch nodes and edges, edit the weights, and watch BFS, DFS, or Dijkstra run on your drawing.",
    stack: ["React", "TypeScript", "FastAPI", "WebSockets"],
    links: [{ label: "Code", href: "https://github.com/Evanlei/Inko" }],
  },
  {
    id: "veyo",
    camp: "Veyo",
    name: "Veyo",
    kicker: "Project",
    date: "Oct 2026",
    description:
      "Predicts where people will look in an ad. Mark the product, headline, and logo, then compare versions to see what an edit changes.",
    stack: ["Python", "PyTorch", "DeepGaze"],
    links: [
      { label: "Live demo", href: "https://veyo-attention-studio.web.app" },
      { label: "Code", href: "https://github.com/Evanlei/Veyo" },
    ],
    image: { src: "/images/veyo.gif", alt: "An ad beside its predicted attention heatmap" },
  },
  {
    id: "mochi",
    camp: "Mochi",
    name: "Mochi",
    kicker: "Project",
    date: "Nov 2026",
    description:
      "A macOS music companion. Ask for music in plain language and get a queue tuned to what you've liked before, with Spotify controls in the menu bar.",
    stack: ["Swift", "SwiftUI", "FastAPI", "ONNX Runtime"],
    links: [{ label: "Code", href: "https://github.com/Evanlei/Mochi" }],
    image: { src: "/images/mochi.png", alt: "Mochi app icon", kind: "icon" },
    icon: "/images/mochi.png",
  },
  {
    id: "evolution",
    camp: "Evolution",
    name: "Evolution Simulator",
    kicker: "Project",
    date: "Sep 2026",
    description:
      "Creatures with small neural-network brains compete for food and pass mutated versions to their offspring. You can open any creature and watch its brain fire.",
    stack: ["Python", "Pygame", "Neuroevolution"],
    links: [{ label: "Code", href: "https://github.com/Evanlei/evolution-simulator" }],
    image: {
      src: "/images/evo.png",
      alt: "Simulator dashboard with creatures, population chart, and a live neural network",
    },
  },
  {
    id: "cues",
    camp: "Cues",
    name: "Cues",
    kicker: "Hackathon",
    date: "Nov 2026",
    award: "HackPrinceton",
    description:
      "Helps special-ed teachers see who needs them next. On-device vision spots raised hands and thumbs up, and camera footage never leaves the classroom.",
    stack: ["Next.js", "Supabase", "MediaPipe"],
    links: [
      { label: "cues.nyc", href: "https://cues.nyc" },
      { label: "Code", href: "https://github.com/michelliez/cues" },
    ],
    image: { src: "/images/cues.jpg", alt: "The Cues homepage: know who needs you next" },
  },
];
