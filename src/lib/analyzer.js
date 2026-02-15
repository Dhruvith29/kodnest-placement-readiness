const SKILL_CATEGORIES = {
    "Core CS": ["DSA", "OOP", "DBMS", "OS", "Networks", "Data Structures", "Algorithms", "Object Oriented", "Operating Systems", "Computer Networks"],
    "Languages": ["Java", "Python", "JavaScript", "TypeScript", "C", "C++", "C#", "Go", "Golang", "Rust"],
    "Web": ["React", "Next.js", "Node.js", "Express", "REST", "GraphQL", "HTML", "CSS", "Tailwind", "Django", "Spring"],
    "Data": ["SQL", "MongoDB", "PostgreSQL", "MySQL", "Redis", "NoSQL", "Database"],
    "Cloud/DevOps": ["AWS", "Azure", "GCP", "Docker", "Kubernetes", "CI/CD", "Linux", "DevOps", "Cloud"],
    "Testing": ["Selenium", "Cypress", "Playwright", "JUnit", "PyTest", "Jest", "Testing"]
};

export function analyzeJD(text, company, role) {
    const normalizedText = text.toLowerCase();
    const foundSkills = {};
    let totalSkillsFound = 0;

    // 1. Skill Extraction
    for (const [category, skills] of Object.entries(SKILL_CATEGORIES)) {
        const matched = skills.filter(skill => normalizedText.includes(skill.toLowerCase()));
        if (matched.length > 0) {
            foundSkills[category] = matched;
            totalSkillsFound += matched.length;
        }
    }

    // Backup if empty
    if (totalSkillsFound === 0) {
        foundSkills["General"] = ["Communication", "Aptitude", "Problem Solving"];
    }

    // 2. Readiness Score Calculation
    let score = 35; // Base
    score += Object.keys(foundSkills).length * 5; // +5 per category
    if (company && company.trim().length > 0) score += 10;
    if (role && role.trim().length > 0) score += 10;
    if (text.length > 800) score += 10;

    // Logical cap
    score = Math.min(100, score);

    // 3. Plan Generation
    const plan = generatePlan(foundSkills);

    // 4. Checklist Generation
    const checklist = generateChecklist(foundSkills);

    // 5. Questions Generation
    const questions = generateQuestions(foundSkills);

    // 6. Company Intel Generation
    const companyIntel = generateCompanyIntel(company);

    // 7. Round Mapping Generation
    const roundMapping = generateRoundMapping(companyIntel.size, foundSkills);

    return {
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        company: company || "Unknown Company",
        role: role || "Software Engineer",
        jdText: text,
        extractedSkills: foundSkills,
        plan,
        checklist,
        questions,
        companyIntel,
        roundMapping,
        readinessScore: score // Will be overridden by baseScore logic in ResultsPage if exists, but good to have initial
    };
}

function generateCompanyIntel(companyName) {
    const name = companyName ? companyName.toLowerCase() : "";

    // Heuristic Lists
    const enterprises = ["google", "amazon", "microsoft", "meta", "facebook", "netflix", "apple", "adobe", "salesforce", "oracle", "ibm", "tcs", "infosys", "wipro", "accenture", "capgemini", "cognizant", "deloitte", "goldman sachs", "jpmorgan", "morgan stanley", "flipkart", "paytm", "uber", "ola", "zomato", "swiggy"];
    const midSize = ["zoho", "freshworks", "browserstack", "razorpay", "cred", "zerodha", "groww", "postman", "hackerarth", "hackerrank"];

    let size = "Startup";
    let type = "Product based";
    let focus = "Practical problem solving & Full-stack depth";

    if (enterprises.some(e => name.includes(e))) {
        size = "Enterprise";
        focus = "Data Structures, Algorithms & System Design scalability";
        if (["tcs", "infosys", "wipro", "accenture", "cognizant", "capgemini"].some(e => name.includes(e))) {
            type = "Service based";
            focus = "Aptitude, Core CS Fundamentals & Communication";
        }
    } else if (midSize.some(e => name.includes(e))) {
        size = "Mid-Size";
        focus = "Product specific skills, System Design & Clean Code";
    }

    // Default heuristics if unknown
    if (size === "Startup") {
        if (name.includes("tech") || name.includes("labs") || name.includes("solutions")) {
            type = "Service/Agency";
            focus = "Rapid development, adaptability & specific stack expertise";
        }
    }

    return {
        name: companyName || "Target Company",
        industry: "Technology", // simplified default
        size,
        type,
        focus
    };
}

function generateRoundMapping(companySize, skills) {
    const hasDSA = skills["Core CS"]?.some(s => ["dsa", "algorithms", "data structures"].some(k => s.toLowerCase().includes(k)));

    // Default flow
    let rounds = [
        { name: "Round 1: Online Assessment", type: "Screening", focus: "Aptitude + Basic Coding", why: "To filter candidates based on basic problem solving speed." },
        { name: "Round 2: Technical Interview 1", type: "Technical", focus: "Data Structures & Logic", why: "To test your ability to write efficient code." },
        { name: "Round 3: Technical Interview 2", type: "Technical", focus: "System Design / Specialized Stack", why: "To assess architectural understanding and depth." },
        { name: "Round 4: HR / Managerial", type: "Behavioral", focus: "Culture Fit", why: "To see if you align with company values." }
    ];

    if (companySize === "Enterprise") {
        rounds = [
            { name: "Round 1: Online Coding Test", type: "Screening", focus: "2-3 Medium/Hard DSA Problems", why: "High-volume filtering. Speed and correctness are key." },
            { name: "Round 2: Technical Algo", type: "Technical", focus: "DSA Optimization & Edge Cases", why: "Verifying problem solving depth." },
            { name: "Round 3: System Design / CS Core", type: "Technical", focus: "LLD/HLD or OS/DBMS", why: "Checking foundational engineering knowledge." },
            { name: "Round 4: Managerial / HR", type: "Behavioral", focus: "Leadership Principles & Values", why: "Assessing long-term fit and soft skills." }
        ];
    } else if (companySize === "Startup") {
        rounds = [
            { name: "Round 1: Assignment / Screening", type: "Screening", focus: "Take-home task or Basic Call", why: "Proving you can build something real." },
            { name: "Round 2: Pairing / Technical", type: "Technical", focus: "Live coding feature implementation", why: "Checking coding style, debugging, and collaboration." },
            { name: "Round 3: Founder / Culture Fit", type: "Behavioral", focus: "Passion & Ownership", why: "Startups need self-starters who care about the mission." }
        ];
    }

    return rounds;
}

function generatePlan(skills) {
    const hasReact = skills["Web"]?.some(s => s.toLowerCase().includes("react"));
    const hasBackend = skills["Web"]?.some(s => ["node", "express", "django", "spring"].some(k => s.toLowerCase().includes(k)));
    const hasDSA = skills["Core CS"]?.some(s => ["dsa", "algorithms", "data structures"].some(k => s.toLowerCase().includes(k)));
    const hasCloud = skills["Cloud/DevOps"]?.length > 0;

    return [
        { day: "Day 1-2", focus: "Basics & Core CS", tasks: ["Revise OOP concepts (Polymorphism, Inheritance)", "Brush up on DBMS normalization & indexing", "OS Basics (Process vs Thread, Deadlocks)", "Network Protocols (HTTP, TCP/IP)"] },
        { day: "Day 3-4", focus: "DSA & Coding", tasks: [hasDSA ? "Focus on Graphs/DP/Trees" : "Practice Arrays, Strings, and Maps", "Solve 5 medium LeetCode problems", "Time & Space Complexity analysis", "Implement standard algorithms (Merge Sort, Binary Search)"] },
        { day: "Day 5", focus: "Project & Stack", tasks: [hasReact ? "Review React Lifecycle & Hooks" : "Review project architecture", hasBackend ? "API Design & REST principles" : "Database schema optimization", "Align resume projects with JD", hasCloud ? "Review Docker/CI-CD pipelines" : "Check deployment basics"] },
        { day: "Day 6", focus: "Mock Interviews", tasks: ["Behavioral questions (STAR method)", "System Design basic blocks (LB, Caching, DB)", "Peer mock interview"] },
        { day: "Day 7", focus: "Revision", tasks: ["Review weak areas from mocks", "Quick formula revision (Aptitude)", "Final resume polish"] }
    ];
}

function generateChecklist(skills) {
    const techStack = [...(skills["Web"] || []), ...(skills["Languages"] || []), ...(skills["Data"] || [])].slice(0, 3);

    return {
        "Round 1: Aptitude / Basics": [
            "Quantitative Ability (Time/Work, P&C, Probability)",
            "Logical Reasoning (Puzzles, Patterns, Series)",
            "Verbal Ability (Reading Comprehension, Grammar)",
            "Data Interpretation basics",
            "Basic Computer Fundamentals",
            "Debugging / Pseudo-code logic"
        ],
        "Round 2: DSA + Core CS": [
            "Arrays, Strings, Linked Lists",
            "Trees, Graphs, BST",
            "Sorting & Searching Algorithms",
            "SQL Queries (Joins, Aggregates, Normalization)",
            "OOP Concepts (Encapsulation, Polymorphism)",
            "OS Concepts (Threading, Memory Management)"
        ],
        "Round 3: Tech Interview": [
            `Deep dive into ${techStack[0] || "primary project language"}`,
            "Project Architecture & Challenges",
            "API Design & Integration patterns",
            "Database Schema & Optimization",
            "Version Control (Git) workflows",
            `Framework specifics (${techStack[1] || "your main framework"})`
        ],
        "Round 4: Managerial / HR": [
            "Why this specific company/role?",
            "Strengths & Weaknesses (with examples)",
            "Project conflict resolution scenarios",
            "Where do you see yourself in 5 years?",
            "Salary expectations & negotiation",
            "Questions for the interviewer"
        ]
    };
}

function generateQuestions(skills) {
    const questions = [];

    // Category specific banks
    const banks = {
        "Core CS": [
            "Explain the four pillars of OOP with real-world examples.",
            "What is the difference between specific Process and Thread?",
            "Explain ACID properties in databases.",
            "What is a deadlock and how do you prevent it?",
            "Difference between TCP and UDP?",
            "How does DNS resolution work?"
        ],
        "Web": [
            "Explain the difference between Local Storage, Session Storage, and Cookies.",
            "What is CORS and how do you handle it?",
            "Explain RESTful API constraints.",
            "What is the Critical Rendering Path?"
        ],
        "Data": [
            "Explain Indexing. When does it help/hurt?",
            "Write a SQL query to find the 2nd highest salary.",
            "Difference between SQL and NoSQL databases.",
            "What is Normalization? Explain 1NF, 2NF, 3NF."
        ],
        "Cloud/DevOps": [
            "What is Docker and how is it different from a VM?",
            "Explain CI/CD pipeline stages.",
            "What is Kubernetes used for?",
            "Explain vertical vs horizontal scaling."
        ],
        "Languages": [
            "Explain memory management in your primary language.",
            "What are closures? (if JS)",
            "Explain pass by value vs pass by reference.",
            "How does Garbage Collection work?"
        ]
    };

    // Specific tech triggers
    if (skills["Web"]?.some(s => s.toLowerCase().includes("react"))) {
        questions.push("Explain the Virtual DOM and diffing algorithm.");
        questions.push("What are React Hooks? Compare useEffect vs useLayoutEffect.");
        questions.push("How do you manage state in a complex React app?");
    }
    if (skills["Web"]?.some(s => s.toLowerCase().includes("node"))) {
        questions.push("Explain the Event Loop in Node.js.");
        questions.push("Difference between process.nextTick() and setImmediate().");
    }
    if (skills["Languages"]?.some(s => s.toLowerCase().includes("java"))) {
        questions.push("Explain the difference between JDK, JRE, and JVM.");
        questions.push("What is the contract between hashCode() and equals()?");
    }
    if (skills["Languages"]?.some(s => s.toLowerCase().includes("python"))) {
        questions.push("Explain Python's GIL (Global Interpreter Lock).");
        questions.push("Difference between list and tuple in Python.");
    }

    // Add generic category questions if categories exist
    Object.keys(skills).forEach(cat => {
        if (banks[cat]) {
            questions.push(...banks[cat].slice(0, 2));
        }
    });

    // Fillers if specific questions are too few
    const filler = [
        "Tell me about yourself and your background.",
        "Describe a challenging bug you fixed recently.",
        "How do you ensure code quality in your projects?",
        "Design a URL shortening service (System Design basic).",
        "What is your preferred development environment setup?"
    ];

    // Combine and Deduplicate
    const finalQuestions = Array.from(new Set([...questions, ...filler]));

    return finalQuestions.slice(0, 10);
}

