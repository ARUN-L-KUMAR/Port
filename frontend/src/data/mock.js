import { href } from "react-router-dom";

// Real data for Arun Kumar L's futuristic robotic portfolio
export const portfolioData = {
  hero: {
    name: "ARUN KUMAR L",
    role: "Computer Science & Engineering Student",
    subtitle: "AI-Augmented Full Stack Developer",
    tagline: "Turning ideas into delightful digital experiences"
  },

  about: {
    title: "About Me",
    description: "I’m Arunkumar — an AI-Augmented Full Stack Developer passionate about building intelligent, user-centric web applications. I specialize in HTML, CSS, JavaScript, React.js, Tailwind CSS, and Node.js, with hands-on experience integrating AI through OpenAI APIs and developing decentralized applications on Ethereum using Solidity. I’ve built real-time solutions like an AI-powered travel CRM (TripXplo) and blockchain-based DApps on the Sepolia testnet. Alongside development, I enjoy crafting intuitive interfaces in Figma for apps like Farmzi and e-commerce dashboards. I also have experience with Python (NumPy, Pandas) and SQL for data-driven backend logic. Driven by curiosity and innovation, I’m always exploring the intersection of AI, full-stack systems, and emerging web technologies to create impactful digital experiences.",
    stats: [
      { label: "Years Experience", value: "2+" },
      { label: "Projects Completed", value: "20+" },
      { label: "Technologies Mastered", value: "15+" },
      { label: "Certificates Earned", value: "3" }
    ],
    certificates: [
      {
        id: 1,
        title: "Full Stack Web Development Internship",
        issuer: "Novitech Pvt Ltd",
        duration: "30 Days",
        icon: "🏆",
        description: "Worked on basic web apps and mini-projects using HTML, CSS, JavaScript, and React.js. Gained hands-on experience in responsive UI design, component-based development, and Git-based version control.",
        projects: ["ToDo App", "Weather App", "Text to Speech App", "Netflix & E-Commerce Interface Clone"],
        skills: ["HTML", "CSS", "JavaScript", "React.js", "Git", "Responsive Design"]
      },
      {
        id: 2,
        title: "Flutter Development Webinar Certificate",
        issuer: "Flutter Community",
        duration: "3 Days",
        icon: "🏆",
        description: "Attended an introductory webinar focused on cross-platform mobile app development using Flutter. Learned about Dart syntax, widget-based UI structure, and building simple interfaces for both Android and iOS platforms.",
        projects: ["ToDo App", "Calculator", "Swiggy Interface Clone"],
        skills: ["Flutter", "Dart", "Mobile Development", "Cross-platform", "UI Design"]
      },
      {
        id: 3,
        title: "Introduction to Machine Learning",
        issuer: "IIT Madras (NPTEL)",
        duration: "12 Weeks",
        icon: "🏆",
        description: "Successfully completed the Introduction to Machine Learning course offered by NPTEL, IIT Madras. Gained strong foundational knowledge in ML concepts like supervised/unsupervised learning, SVM, k-NN, Naïve Bayes, and evaluation metrics through weekly assignments and lectures by IIT faculty.",
        projects: ["Classification Models", "Regression Analysis", "Clustering Algorithms"],
        skills: ["Machine Learning", "Python", "Data Analysis", "Algorithms", "Statistical Methods"]
      }
    ]
  },

  projects: [

    {
      id: 20,
      title: "Market",
      description: "Realistic e-commerce platform with admin panel, real-time updates, and production-level UI.",
      technologies: ["React", "Node", "MongoDB", "Socket.io", "Fullstack", "#fullstack"],
      image: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=800&q=80",
      demoUrl: "https://akmarket.vercel.app/",
      githubUrl: "https://github.com/ARUN-L-KUMAR/Market",
      status: "Live"
    },
    // Frontend Projects


    {
      id: 2,
      title: "Weather Forecasting App",
      description: "Real-time weather application using OpenWeatherMap API with location-based forecasting and responsive design.",
      technologies: ["React", "API", "JavaScript"],
      image: "https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?auto=format&fit=crop&w=800&q=80",
      demoUrl: "https://frontend-basic-projects-xi.vercel.app/Day%209%20(Develop%20a%20Weather%20Application)/html/index.html",
      githubUrl: "https://github.com/ARUN-L-KUMAR/frontend-basic-projects/tree/main/Day%209%20(Develop%20a%20Weather%20Application)",
      status: "Live"
    },
    {
      id: 3,
      title: "Text to Speech App",
      description: "A simple web app that converts typed text into speech using the Web Speech API with customizable voice options.",
      technologies: ["HTML", "CSS", "JavaScript", "Web API"],
      image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80",
      demoUrl: "https://frontend-basic-projects-xi.vercel.app/Day%2010%20(Develop%20a%20Text%20To%20Speech%20Application)/HTML%20&%20JS/index.html",
      githubUrl: "https://github.com/ARUN-L-KUMAR/frontend-basic-projects/tree/main/Day%2010%20(Develop%20a%20Text%20To%20Speech%20Application)",
      status: "Live"
    },

    {
      id: 1,
      title: "Netflix Clone",
      description: "A responsive Netflix clone built with HTML, CSS, and JavaScript featuring modern UI design and interactive elements.",
      technologies: ["HTML", "CSS", "JavaScript"],
      image: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?auto=format&fit=crop&w=800&q=80",
      demoUrl: "https://frontend-basic-projects-xi.vercel.app/Day%205%20(Develop%20a%20Realtime%20NETFLIX%20Website)/html/index.html",
      githubUrl: "https://github.com/ARUN-L-KUMAR/frontend-basic-projects/tree/main/Day%205%20(Develop%20a%20Realtime%20NETFLIX%20Website)",
      status: "Live"
    },

    {
      id: 4,
      title: "Frontend Mini Projects Collection",
      description: "A comprehensive collection of 10+ mini frontend projects including E-Commerce interfaces, Blog layouts, Weather Apps, To-Do applications, and more.",
      technologies: ["HTML", "CSS", "JavaScript", "React"],
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80",
      demoUrl: "https://frontend-basic-projects-xi.vercel.app/",
      githubUrl: "https://github.com/ARUN-L-KUMAR/frontend-basic-projects",
      status: "Live"
    },
    // AI / Machine Learning Projects

    // AI / Machine Learning Projects
    {
      id: 22,
      title: "Crops Disease Detection",
      description: "AI model that identifies crop diseases from leaf images to help farmers.",
      technologies: ["AI", "Agriculture", "ML", "#AI", "#internship"],
      image: "https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?auto=format&fit=crop&w=800&q=80",
      demoUrl: "",
      githubUrl: "https://github.com/ARUN-L-KUMAR/AICTE-Sustainable-Agriculture",
      status: "Live"
    }, {
      id: 21,
      title: "Emotion Detection",
      description: "AI system that detects and classifies human emotions using image input.",
      technologies: ["AI", "Deep Learning", "#AI"],
      image: "https://images.unsplash.com/photo-1555255707-c07966088b7b?auto=format&fit=crop&w=800&q=80",
      demoUrl: "",
      githubUrl: "https://github.com/ARUN-L-KUMAR/Emotion_Detect",
      status: "Live"
    },

    {
      id: 17,
      title: "Codealpha_Communication_app",
      description: "Real-time chat and communication platform.",
      technologies: ["MERN", "Socket.io", "Fullstack", "#fullstack", "#internship"],
      image: "https://images.unsplash.com/photo-1577563908411-5077b6dc7624?auto=format&fit=crop&w=800&q=80",
      demoUrl: "https://codealpha-communication.vercel.app ",
      githubUrl: "https://github.com/ARUN-L-KUMAR/Codealpha_Communication_app",
      status: "Live"
    },
    {
      id: 18,
      title: "Codealpha_Project_Management",
      description: "Project and task management tool with user dashboard.",
      technologies: ["MERN", "Fullstack", "#fullstack", "#internship"],
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80",
      demoUrl: "https://codealpha-project-management.vercel.app",
      githubUrl: "https://github.com/ARUN-L-KUMAR/Codealpha_Project_Management",
      status: "Live"
    },
    {
      id: 19,
      title: "Codealpha_Ecommerce_store",
      description: "E-commerce store with product listing, cart, and checkout functionality.",
      technologies: ["MERN", "Fullstack", "#fullstack", "#internship"],
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80",
      demoUrl: "https://codealpha-ecommerce-store.onrender.com",
      githubUrl: "https://github.com/ARUN-L-KUMAR/Codealpha_Ecommerce_store",
      status: "Live"
    },
    {
      id: 16,
      title: "Codealpha_Social_Media",
      description: "Social media app with post creation, likes, comments, and follow system.",
      technologies: ["MERN", "Fullstack", "#fullstack", "#internship"],
      image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?auto=format&fit=crop&w=800&q=80",
      demoUrl: "",
      githubUrl: "https://github.com/ARUN-L-KUMAR/Codealpha_Social_Media",
      status: "Live"
    },
    {
      id: 12,
      title: "Online-Quiz-Application",
      description: "Interactive online quiz app with real-time score tracking and dynamic questions.",
      technologies: ["React", "Frontend", "#frontend"],
      image: "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?auto=format&fit=crop&w=800&q=80",
      demoUrl: "",
      githubUrl: "https://github.com/ARUN-L-KUMAR/Online-Quiz-Application",
      status: "Live"
    },
    {
      id: 13,
      title: "Smart-Study-Planner",
      description: "Smart planner that helps students manage tasks, deadlines, and study schedules.",
      technologies: ["React", "Frontend", "#frontend"],
      image: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&w=800&q=80",
      demoUrl: "",
      githubUrl: "https://github.com/ARUN-L-KUMAR/Smart-Study-Planner",
      status: "Live"
    },
    {
      id: 14,
      title: "Personal_CRM",
      description: "Personal CRM system to manage daily contacts, reminders, and productivity tasks.",
      technologies: ["Dashboard App", "Frontend", "#frontend"],
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80",
      demoUrl: "",
      githubUrl: "https://github.com/ARUN-L-KUMAR/Personal_CRM",
      status: "Live"
    },

    // Fullstack Projects

    {
      id: 5,
      title: "Java With Spring Boot",
      description: "For building scalable and efficient backend services and REST APIs.",
      technologies: ["Java", "Spring Boot", "Rest API"],
      image: "/javaspringimg.png",
      demoUrl: "https://github.com/ARUN-L-KUMAR/NM.git",
      githubUrl: "https://github.com/ARUN-L-KUMAR/NM.git",
      status: "Live"
    },


    // Internship Projects
    {
      id: 23,
      title: "AICTE – Sustainable Agriculture",
      description: "Internship project focused on sustainable agriculture with AI for crop disease detection.",
      technologies: ["Internship", "AI", "Agriculture", "#internship", "#AI"],
      image: "https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?auto=format&fit=crop&w=800&q=80",
      demoUrl: "",
      githubUrl: "",
      status: "Live"
    },
    // {
    //   id: 24,
    //   title: "AICTE – Web Development",
    //   description: "Web development internship project for movie review platform.",
    //   technologies: ["Internship", "Frontend", "#internship", "#frontend"],
    //   image: "https://images.unsplash.com/photo-1489599735734-79b4ba6a1403?auto=format&fit=crop&w=800&q=80",
    //   demoUrl: "",
    //   githubUrl: "",
    //   status: "Live"
    // },
    // {
    //   id: 25,
    //   title: "CodeAlpha Internship",
    //   description: "Comprehensive internship including social media, communication app, project management, and ecommerce store projects.",
    //   technologies: ["Internship", "Fullstack", "MERN", "#internship", "#fullstack"],
    //   image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80",
    //   demoUrl: "",
    //   githubUrl: "",
    //   status: "Live"
    //},
    // Existing Projects


    {
      id: 6,
      title: "Data Science & Analysis Basics",
      description: "Exploratory data analysis using Python, Pandas, and Matplotlib.",
      technologies: ["Python", "Pandas", "Matplotlib"],
      image: "/Data-Science-Basics.png",
      demoUrl: "https://github.com/ARUN-L-KUMAR/DATA-SCIENCE-.git",
      githubUrl: "https://github.com/ARUN-L-KUMAR/DATA-SCIENCE-.git",
      status: "Live"
    },
    {
      id: 7,
      title: "UI & UX Design",
      description: "Designed interfaces including Instagram feed, WhatsApp tabs, e-commerce style guides, color palettes, moodboards, and wireframes for food delivery apps.",
      technologies: ["Figma", "UI Design", "Wireframing", "Color", "Moodboard"],
      image: "/UIUX.avif",
      demoUrl: "https://www.figma.com/team_invite/redeem/c0SyKmzUp8Wn8BDzefcSYD",
      githubUrl: "",
      status: "Live"
    },
    {
      id: 8,
      title: "Agritech App UI",
      description: "Modern UI design for an agriculture technology platform",
      technologies: ["Figma", "UI Design", "Wireframing"],
      image: "/farmzi.jpeg",
      demoUrl: "https://www.figma.com/design/ia5hbZcONSSHvNDloimV6y/Farmzi-UI?node-id=0-1&t=VryHfCWMPQKQqgQO-1",
      githubUrl: "",
      status: "Live"
    },
    {
      id: 9,
      title: "CommunityCoin DApp",
      description: "A decentralized application for community token management on Ethereum Sepolia testnet.",
      technologies: ["Solidity", "Ethers.js", "Hardhat"],
      image: "/Communitycoin.png",
      demoUrl: "https://communitycoin.vercel.app",
      githubUrl: "https://github.com/ARUN-L-KUMAR/CBT-TASK-3.git",
      status: "Live"
    },
    {
      id: 10,
      title: "Artisanchain",
      description: "A DApp for certifying and tracking provenance of artisanal goods on Ethereum. Features NFT minting, IPFS storage, and a marketplace for local artisans.",
      technologies: ["Solidity", "Ethers.js", "Hardhat", "IPFS"],
      image: "/Artisanalchian.png",
      demoUrl: "https://artisanalchain.vercel.app/",
      githubUrl: "https://github.com/ARUN-L-KUMAR/CBT-TASK-1.git",
      status: "Live"
    },
    {
      id: 11,
      title: "EventDapp",
      description: "A blockchain-based event ticketing DApp with NFT tickets, decentralized verification, and a modern React frontend.",
      technologies: ["Solidity", "Ethers.js", "Hardhat", "NFT"],
      image: "/Eventdapp.png",
      demoUrl: "https://evt-tix.vercel.app",
      githubUrl: "https://github.com/ARUN-L-KUMAR/EvtTicket.git",
      status: "Live"
    }
  ],

  skills: {
    categories: [
      {
        title: "Frontend Development",
        skills: [
          { name: "HTML & CSS", level: 70 },
          { name: "JavaScript", level: 50 },
          { name: "React.js", level: 45 },
          { name: "Tailwind CSS", level: 50 },
          { name: "Responsive Design", level: 60 },
          { name: "Flutter", level: 30 }
        ]
      },
      {
        title: "Backend & Full Stack",
        skills: [
          { name: "Node.js", level: 30 },
          { name: "Spring Boot(Java)", level: 30 },
          { name: "Supabase", level: 35 },
          { name: "PostMan", level: 35 },
          { name: "SQL", level: 50 },
          { name: "API & RESTAPI", level: 30 },
          { name: "Prompt Engineering", level: 45 }
        ]
      },
      {
        title: "Tools & Platforms",
        skills: [
          { name: "VS Code", level: 80 },
          { name: "Cursor", level: 70 },
          { name: "IntelliJ", level: 60 },
          { name: "Windsurf", level: 50 },
          { name: "Git & GitHub", level: 75 },
          { name: "Vercel", level: 70 },
          { name: "Postman", level: 60 },
          { name: "Supabase", level: 50 },
          { name: "Figma", level: 60 },
          { name: "Remix-Solidity", level: 40 },
          { name: "Colab", level: 50 }
        ]
      },
      {
        title: "Others",
        skills: [
          { name: "UI & UX Design", level: 45 },
          { name: "Solidity", level: 45 },
          { name: "Ethereum-Sepolia Testnet", level: 40 },
          { name: "Python", level: 65 },
          { name: "Pandas", level: 45 },
          { name: "NumPy", level: 45 },
          { name: "OpenAI API", level: 40 }
        ]
      },
      {
        title: "Soft Skills",
        skills: [
          { name: "Team collaboration", level: 80 },
          { name: "Self-learning", level: 85 },
          { name: "UI intuition", level: 75 },
          { name: "Creative problem-solving", level: 80 }
        ]
      }
    ]
  },

  internships: [
    {
      id: 1,
      company: "CodeAlpha",
      duration: "20th July 2025 – 20th August 2025",
      projects: [

        {
          title: "Codealpha Communication App",
          description: "Real-time chat application with group messaging, file sharing, and video calling capabilities.",
          technologies: ["React", "Node.js", "Socket.io", "WebRTC", "MongoDB"],
          githubUrl: "https://github.com/ARUN-L-KUMAR/Codealpha_Communication_app",
          demoUrl: "https://codealpha-communication.vercel.app",
          status: "Live"
        },
        {
          title: "Codealpha Project Management",
          description: "Comprehensive project management tool with task tracking, team collaboration, and progress analytics.",
          technologies: ["MERN Stack", "Chart.js", "Material-UI", "Express.js"],
          githubUrl: "https://github.com/ARUN-L-KUMAR/Codealpha_Project_Management",
          demoUrl: "https://codealpha-project-management.vercel.app",
          status: "Live"
        },
        {
          title: "Codealpha Ecommerce Store",
          description: "Full-featured e-commerce platform with payment integration, inventory management, and admin dashboard.",
          technologies: ["MERN Stack", "Stripe API", "Redux", "Tailwind CSS"],
          githubUrl: "https://github.com/ARUN-L-KUMAR/Codealpha_Ecommerce_store",
          demoUrl: "https://codealpha-ecommerce-store.onrender.com",
          status: "Live"
        }, {
          title: "Codealpha Social Media",
          description: "Full-stack social media platform with user authentication, posts, likes, comments, and real-time messaging features.",
          technologies: ["MERN Stack", "Socket.io", "JWT", "Cloudinary"],
          githubUrl: "https://github.com/ARUN-L-KUMAR/Codealpha_Social_Media",
          demoUrl: "",
          status: "Live"
        }
      ],
      badge: "CodeAlpha",
      image: "/codealpha.jpeg"
    },
    {
      id: 2,
      company: "Edunet Foundation (AICTE Internship)",
      duration: "April 2025 – May 2025",
      projects: [
        {
          title: "Crops Disease Detection (AICTE – Sustainable Agriculture)",
          description: "AI-powered crop disease detection system using computer vision and machine learning to help farmers identify plant diseases early.",
          technologies: ["Python", "TensorFlow", "OpenCV", "Flask", "React"],
          githubUrl: "https://github.com/ARUN-L-KUMAR/AICTE-Sustainable-Agriculture",
          demoUrl: "",
          status: "Live"
        },
        {
          title: "Movie Review Platform (AICTE – Web Development)",
          description: "Dynamic web platform for movie reviews with user ratings, comments, and personalized recommendations.",
          technologies: ["MERN Stack", "Express.js", "MongoDB", "JWT", "Tailwind CSS"],
          githubUrl: "https://github.com/ARUN-L-KUMAR/movie-review-platform",
          demoUrl: "https://cinehub-in.vercel.app",
          status: "Live"
        }
      ],
      badge: "AICTE",
      image: "./edunet.jpeg"
    }
    ,
    {
      id: 3,
      company: "TripXplo",
      duration: "2024 – 2025",
      projects: [
        {
          title: "TripXplo Travel Tech Solutions",
          description: "Worked as a Frontend Developer and later as an AI Agent Developer for TripXplo, a travel technology startup. Designed the hotel-side management dashboard for the TripXplo platform (similar to Agoda's YCS). Created intuitive interfaces for modules like Inventory, Accounts, Rooms, and Booking Management. Developed the Quotation Calculator UI and expanded it into a B2B CRM travel solution with features like lead management, quotation generation, and booking workflows. Integrated AI Agents using OpenAI SDK, CrewAI, and Next.js to automate travel-related operations and planning.",
          technologies: ["Figma", "React.js", "Next.js", "Supabase", "OpenAI API", "CrewAI", "LangGraph"],
          githubUrl: "https://github.com/ARUN-L-KUMAR?tab=repositories",
          demoUrl: "",
          status: "Live"
        }
      ],
      badge: "#TripXplo",
      image: "./tripxplo_logo.jpeg"
    }
  ],

  contact: {
    title: "Initialize Contact Protocol",
    subtitle: "Feel free to reach out for collaborations or just a friendly hello!",
    email: "arunkumar582004@gmail.com",
    phone: "+91 8778929845",
    location: "Kanchipuram, Tamil Nadu, India",
    social: [
      { platform: "GitHub", url: "https://github.com/ARUN-L-KUMAR", icon: "github" },
      { platform: "LinkedIn", url: "https://linkedin.com/in/arun-kumar-l", icon: "linkedin" },
      { platform: "Portfolio", url: "https://arun-l-kumar.vercel.app/", icon: "link" }
    ]
  }
};

// Animation sequences for robotic effects
export const roboticAnimations = {
  scanningLines: {
    duration: 3000,
    interval: 5000
  },
  holographicGrid: {
    opacity: 0.1,
    speed: 0.5
  },
  mechanicalTransitions: {
    stagger: 100,
    duration: 600
  }
};

// Color scheme for cyberpunk theme
export const cyberTheme = {
  primary: '#00FFD1',
  secondary: '#6FD2C0',
  accent: '#00D4FF',
  background: '#000000',
  surface: '#121212',
  text: '#FFFFFF',
  textSecondary: 'rgba(255, 255, 255, 0.85)',
  textMuted: '#4D4D4D',
  border: 'rgba(255, 255, 255, 0.25)'
};