export const SKILL_CATEGORIES = {
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
        foundSkills["General"] = ["General fresher stack", "Communication", "Aptitude"];
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
        readinessScore: score
    };
}

function generatePlan(skills) {
    const hasReact = skills["Web"]?.some(s => s.toLowerCase().includes("react"));
    const hasBackend = skills["Web"]?.some(s => ["node", "express", "django", "spring"].some(k => s.toLowerCase().includes(k)));
    const hasDSA = skills["Core CS"]?.some(s => ["dsa", "algorithms", "data structures"].some(k => s.toLowerCase().includes(k)));

    return [
        { day: "Day 1-2", focus: "Basics & Core CS", tasks: ["Revise OOP concepts", "Brush up on DBMS normalization & indexing", "OS Basics (Process vs Thread, Deadlocks)"] },
        { day: "Day 3-4", focus: "DSA & Coding", tasks: [hasDSA ? "Focus on Graphs/DP/Trees" : "Practice Arrays, Strings, and Maps", "Solve 5 medium LeetCode problems", "Time & Space Complexity analysis"] },
        { day: "Day 5", focus: "Project & Stack", tasks: [hasReact ? "Review React Lifecycle & Hooks" : "Review project architecture", hasBackend ? "API Design & REST principles" : "Database schema optimization", "Align resume projects with JD"] },
        { day: "Day 6", focus: "Mock Interviews", tasks: ["Behavioral questions (STAR method)", "System Design basic blocks (LB, Caching, DB)", "Peer mock interview"] },
        { day: "Day 7", focus: "Revision", tasks: ["Review weak areas from mocks", "Quick formula revision (Aptitude)", "Final resume polish"] }
    ];
}

function generateChecklist(skills) {
    return {
        "Round 1: Aptitude": ["Quantitative Ability (Time/Work, P&C)", "Logical Reasoning (Puzzles, Patterns)", "Verbal Ability (Reading Comprehension)"],
        "Round 2: Technical/DSA": ["Arrays & Linked Lists", "Trees & Graphs", "Sorting & Searching", "SQL Queries (Joins, Aggregates)", "OOP Implementation"],
        "Round 3: System Design / Stack": ["Scalability basics", "API Integration", "Database Design", ...((skills["Web"] || []).slice(0, 2))],
        "Round 4: HR / Managerial": ["Why this company?", "Strengths & Weaknesses", "Project challenges & conflict resolution", "Salary expectations"]
    };
}

function generateQuestions(skills) {
    const questions = [];

    // General
    questions.push("Tell me about yourself.");

    if (skills["Data"]?.some(s => s.toLowerCase().includes("sql"))) {
        questions.push("Explain indexing in databases. When does it help and when does it hurt?");
        questions.push("Write a SQL query to find the 2nd highest salary.");
    }

    if (skills["Web"]?.some(s => s.toLowerCase().includes("react"))) {
        questions.push("Explain the Virtual DOM and how React handles state updates.");
        questions.push("What are React Hooks? Explain useEffect and useMemo.");
    }

    if (skills["Web"]?.some(s => s.toLowerCase().includes("node"))) {
        questions.push("Explain the Event Loop in Node.js.");
    }

    if (skills["Core CS"]?.some(s => s.toLowerCase().includes("oop"))) {
        questions.push("Explain the four pillars of OOP with real-world examples.");
        questions.push("What is the difference between an Abstract Class and an Interface?");
    }

    // Fillers if few skills found
    if (questions.length < 10) {
        questions.push("Describe a challenging bug you fixed recently.");
        questions.push("How do you ensure code quality in your projects?");
        questions.push("Where do you see yourself in 5 years?");
        questions.push("Explain the difference between TCP and UDP.");
        questions.push("What is a deadlock and how do you prevent it?");
    }

    return questions.slice(0, 10);
}
