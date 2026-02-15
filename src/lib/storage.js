const STORAGE_KEY = "placement_readiness_history";

export function saveAnalysis(analysisData) {
    try {
        const history = getHistory();
        // Add to beginning
        const newHistory = [analysisData, ...history];
        // Limit to 50 items to keep localStorage sane
        if (newHistory.length > 50) {
            newHistory.length = 50;
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
        return true;
    } catch (error) {
        console.error("Failed to save analysis", error);
        return false;
    }
}

export function getHistory() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (error) {
        console.error("Failed to load history", error);
        return [];
    }
}

export function getLatestAnalysis() {
    const history = getHistory();
    return history.length > 0 ? history[0] : null;
}

export function getAnalysisById(id) {
    const history = getHistory();
    return history.find(item => item.id === id) || null;
}

export function updateAnalysis(id, updates) {
    try {
        const history = getHistory();
        const index = history.findIndex(item => item.id === id);

        if (index !== -1) {
            // Merge updates into the existing item
            history[index] = { ...history[index], ...updates };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
            return true;
        }
        return false;
    } catch (error) {
        console.error("Failed to update analysis", error);
        return false;
    }
}

export function clearHistory() {
    localStorage.removeItem(STORAGE_KEY);
}
