const SKILL_CATEGORIES = {
    "coreCS": ["DSA", "OOP", "DBMS", "OS", "Networks", "Data Structures", "Algorithms", "Object Oriented", "Operating Systems", "Computer Networks"],
    "languages": ["Java", "Python", "JavaScript", "TypeScript", "C", "C++", "C#", "Go", "Golang", "Rust"],
    "web": ["React", "Next.js", "Node.js", "Express", "REST", "GraphQL", "HTML", "CSS", "Tailwind", "Django", "Spring"],
    "data": ["SQL", "MongoDB", "PostgreSQL", "MySQL", "Redis", "NoSQL", "Database"],
    "cloud": ["AWS", "Azure", "GCP", "Docker", "Kubernetes", "CI/CD", "Linux", "DevOps", "Cloud"],
    "testing": ["Selenium", "Cypress", "Playwright", "JUnit", "PyTest", "Jest", "Testing"]
};

export function analyzeJD(text, company, role) {
    const normalizedText = text.toLowerCase();

    // Initialize with empty arrays to ensure schema consistency
    const extractedSkills = {
        coreCS: [],
        languages: [],
        web: [],
        data: [],
        cloud: [],
        testing: [],
        other: []
    };

    let totalSkillsFound = 0;

    // 1. Skill Extraction
    for (const [category, keywords] of Object.entries(SKILL_CATEGORIES)) {
        const matched = keywords.filter(skill => normalizedText.includes(skill.toLowerCase()));
        if (matched.length > 0) {
            extractedSkills[category] = matched;
            totalSkillsFound += matched.length;
        }
    }

    // Backup if empty
    if (totalSkillsFound === 0) {
        extractedSkills.other = ["Communication", "Problem Solving", "Basic Coding", "Projects"];
    }

    // 2. Readiness Score Calculation (Base Score)
    let baseScore = 35; // Base
    baseScore += totalSkillsFound * 2; // +2 per skill (capped later)
    if (company && company.trim().length > 0) baseScore += 10;
    if (role && role.trim().length > 0) baseScore += 10;
    if (text.length > 800) baseScore += 10;

    // Logical cap
    baseScore = Math.min(100, baseScore);

    // 3. Plan Generation
    const plan7Days = generatePlan(extractedSkills);

    // 4. Checklist Generation (Array format)
    const checklist = generateChecklist(extractedSkills);

    // 5. Questions Generation
    const questions = generateQuestions(extractedSkills);

    // 6. Company Intel Generation
    const companyIntel = generateCompanyIntel(company);

    // 7. Round Mapping Generation
    const roundMapping = generateRoundMapping(companyIntel.size, extractedSkills);

    return {
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        company: company || "",
        role: role || "",
        jdText: text,
        extractedSkills,
        roundMapping,
        checklist,
        plan7Days,
        questions,
        companyIntel, // Keeping this as it's useful for UI, even if not strictly in minimal schema request
        baseScore: baseScore,
        skillConfidenceMap: {},
        finalScore: baseScore, // Initially same as base
        updatedAt: new Date().toISOString()
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
        industry: "Technology",
        size,
        type,
        focus
    };
}

function generateRoundMapping(companySize, skills) {
    // Default flow
    let rounds = [
        { roundTitle: "Round 1: Online Assessment", focusAreas: ["Aptitude", "Basic Coding"], whyItMatters: "To filter candidates based on basic problem solving speed." },
        { roundTitle: "Round 2: Technical Interview 1", focusAreas: ["Data Structures", "Logic"], whyItMatters: "To test your ability to write efficient code." },
        { roundTitle: "Round 3: Technical Interview 2", focusAreas: ["System Design", "Specialized Stack"], whyItMatters: "To assess architectural understanding and depth." },
        { roundTitle: "Round 4: HR / Managerial", focusAreas: ["Culture Fit"], whyItMatters: "To see if you align with company values." }
    ];

    if (companySize === "Enterprise") {
        rounds = [
            { roundTitle: "Round 1: Online Coding Test", focusAreas: ["2-3 Medium/Hard DSA Problems"], whyItMatters: "High-volume filtering. Speed and correctness are key." },
            { roundTitle: "Round 2: Technical Algo", focusAreas: ["DSA Optimization", "Edge Cases"], whyItMatters: "Verifying problem solving depth." },
            { roundTitle: "Round 3: System Design / CS Core", focusAreas: ["LLD/HLD", "OS/DBMS"], whyItMatters: "Checking foundational engineering knowledge." },
            { roundTitle: "Round 4: Managerial / HR", focusAreas: ["Leadership Principles", "Values"], whyItMatters: "Assessing long-term fit and soft skills." }
        ];
    } else if (companySize === "Startup") {
        rounds = [
            { roundTitle: "Round 1: Assignment / Screening", focusAreas: ["Take-home task", "Basic Call"], whyItMatters: "Proving you can build something real." },
            { roundTitle: "Round 2: Pairing / Technical", focusAreas: ["Live coding", "Feature implementation"], whyItMatters: "Checking coding style, debugging, and collaboration." },
            { roundTitle: "Round 3: Founder / Culture Fit", focusAreas: ["Passion", "Ownership"], whyItMatters: "Startups need self-starters who care about the mission." }
        ];
    }

    return rounds;
}

function generatePlan(skills) {
    const hasReact = skills.web?.some(s => s.toLowerCase().includes("react"));
    const hasBackend = skills.web?.some(s => ["node", "express", "django", "spring"].some(k => s.toLowerCase().includes(k)));
    const hasDSA = skills.coreCS?.some(s => ["dsa", "algorithms", "data structures"].some(k => s.toLowerCase().includes(k)));
    const hasCloud = skills.cloud?.length > 0;

    return [
        { day: "Day 1-2", focus: "Basics & Core CS", tasks: ["Revise OOP concepts (Polymorphism, Inheritance)", "Brush up on DBMS normalization & indexing", "OS Basics (Process vs Thread, Deadlocks)", "Network Protocols (HTTP, TCP/IP)"] },
        { day: "Day 3-4", focus: "DSA & Coding", tasks: [hasDSA ? "Focus on Graphs/DP/Trees" : "Practice Arrays, Strings, and Maps", "Solve 5 medium LeetCode problems", "Time & Space Complexity analysis", "Implement standard algorithms (Merge Sort, Binary Search)"] },
        { day: "Day 5", focus: "Project & Stack", tasks: [hasReact ? "Review React Lifecycle & Hooks" : "Review project architecture", hasBackend ? "API Design & REST principles" : "Database schema optimization", "Align resume projects with JD", hasCloud ? "Review Docker/CI-CD pipelines" : "Check deployment basics"] },
        { day: "Day 6", focus: "Mock Interviews", tasks: ["Behavioral questions (STAR method)", "System Design basic blocks (LB, Caching, DB)", "Peer mock interview"] },
        { day: "Day 7", focus: "Revision", tasks: ["Review weak areas from mocks", "Quick formula revision (Aptitude)", "Final resume polish"] }
    ];
}

function generateChecklist(skills) {
    // Convert logic to return array of objects: [{ roundTitle, items[] }]
    const techStack = [...(skills.web || []), ...(skills.languages || []), ...(skills.data || [])].slice(0, 3);

    return [
        {
            roundTitle: "Round 1: Aptitude / Basics",
            items: [
                "Quantitative Ability (Time/Work, P&C, Probability)",
                "Logical Reasoning (Puzzles, Patterns, Series)",
                "Verbal Ability (Reading Comprehension, Grammar)",
                "Data Interpretation basics",
                "Basic Computer Fundamentals",
                "Debugging / Pseudo-code logic"
            ]
        },
        {
            roundTitle: "Round 2: DSA + Core CS",
            items: [
                "Arrays, Strings, Linked Lists",
                "Trees, Graphs, BST",
                "Sorting & Searching Algorithms",
                "SQL Queries (Joins, Aggregates, Normalization)",
                "OOP Concepts (Encapsulation, Polymorphism)",
                "OS Concepts (Threading, Memory Management)"
            ]
        },
        {
            roundTitle: "Round 3: Tech Interview",
            items: [
                `Deep dive into ${techStack[0] || "primary project language"}`,
                "Project Architecture & Challenges",
                "API Design & Integration patterns",
                "Database Schema & Optimization",
                "Version Control (Git) workflows",
                `Framework specifics (${techStack[1] || "your main framework"})`
            ]
        },
        {
            roundTitle: "Round 4: Managerial / HR",
            items: [
                "Why this specific company/role?",
                "Strengths & Weaknesses (with examples)",
                "Project conflict resolution scenarios",
                "Where do you see yourself in 5 years?",
                "Salary expectations & negotiation",
                "Questions for the interviewer"
            ]
        }
    ];
}

function generateQuestions(skills) {
    const questions = [];

    // Category specific banks
    const banks = {
        "coreCS": [
            "Explain the four pillars of OOP with real-world examples.",
            "What is the difference between specific Process and Thread?",
            "Explain ACID properties in databases.",
            "What is a deadlock and how do you prevent it?",
            "Difference between TCP and UDP?",
            "How does DNS resolution work?"
        ],
        "web": [
            "Explain the difference between Local Storage, Session Storage, and Cookies.",
            "What is CORS and how do you handle it?",
            "Explain RESTful API constraints.",
            "What is the Critical Rendering Path?"
        ],
        "data": [
            "Explain Indexing. When does it help/hurt?",
            "Write a SQL query to find the 2nd highest salary.",
            "Difference between SQL and NoSQL databases.",
            "What is Normalization? Explain 1NF, 2NF, 3NF."
        ],
        "cloud": [
            "What is Docker and how is it different from a VM?",
            "Explain CI/CD pipeline stages.",
            "What is Kubernetes used for?",
            "Explain vertical vs horizontal scaling."
        ],
        "languages": [
            "Explain memory management in your primary language.",
            "What are closures? (if JS)",
            "Explain pass by value vs pass by reference.",
            "How does Garbage Collection work?"
        ]
    };

    // Specific tech triggers
    if (skills.web?.some(s => s.toLowerCase().includes("react"))) {
        questions.push("Explain the Virtual DOM and diffing algorithm.");
        questions.push("What are React Hooks? Compare useEffect vs useLayoutEffect.");
        questions.push("How do you manage state in a complex React app?");
    }
    if (skills.web?.some(s => s.toLowerCase().includes("node"))) {
        questions.push("Explain the Event Loop in Node.js.");
        questions.push("Difference between process.nextTick() and setImmediate().");
    }
    if (skills.languages?.some(s => s.toLowerCase().includes("java"))) {
        questions.push("Explain the difference between JDK, JRE, and JVM.");
        questions.push("What is the contract between hashCode() and equals()?");
    }
    if (skills.languages?.some(s => s.toLowerCase().includes("python"))) {
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



