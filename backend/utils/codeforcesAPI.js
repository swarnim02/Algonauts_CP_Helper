const axios = require('axios');

/**
 * Codeforces API Utility
 * Official API: https://codeforces.com/apiHelp
 */

const CF_API_BASE = 'https://codeforces.com/api';

// Cache to prevent hitting CF too hard and speed up responses
let cachedGlobalProblems = null;
let lastCacheTime = 0;
const CACHE_TTL = 10 * 60 * 1000; // 10 Minutes

let cachedContestList = null;
let lastContestCacheTime = 0;
const CONTEST_CACHE_TTL = 4 * 60 * 60 * 1000; // 4 Hours

/**
 * Fetch problem information from Codeforces
 * @param {string} contestId - Contest ID (e.g., "1234")
 * @param {string} problemIndex - Problem index (e.g., "A", "B")
 * @returns {Promise<Object>} Problem details
 */
async function getProblemInfo(contestId, problemIndex) {
    try {
        const response = await axios.get(`${CF_API_BASE}/problemset.problems`);
        
        if (response.data.status === 'OK') {
            const problems = response.data.result.problems;
            const problem = problems.find(
                p => p.contestId === parseInt(contestId) && p.index === problemIndex
            );
            
            if (problem) {
                return {
                    success: true,
                    data: {
                        contestId: problem.contestId,
                        index: problem.index,
                        name: problem.name,
                        type: problem.type,
                        rating: problem.rating || 'Unrated',
                        tags: problem.tags || []
                    }
                };
            } else {
                return {
                    success: false,
                    error: 'Problem not found'
                };
            }
        }
    } catch (error) {
        console.error('Codeforces API Error:', error.message);
        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * Parse Codeforces problem link
 * @param {string} link - Full Codeforces problem URL
 * @returns {Object} Parsed contest ID and problem index
 * 
 * Example: https://codeforces.com/problemset/problem/1234/A
 * Returns: { contestId: "1234", problemIndex: "A" }
 */
function parseProblemLink(link) {
    // Supports:
    // https://codeforces.com/problemset/problem/1234/A
    // https://codeforces.com/contest/1234/problem/A
    
    // Check for problemset link
    const problemsetRegex = /codeforces\.com\/problemset\/problem\/(\d+)\/([A-Za-z0-9]+)/i;
    let match = link.match(problemsetRegex);
    
    if (match) {
        return {
            contestId: match[1],
            problemIndex: match[2].toUpperCase()
        };
    }

    // Check for contest link
    const contestRegex = /codeforces\.com\/contest\/(\d+)\/problem\/([A-Za-z0-9]+)/i;
    match = link.match(contestRegex);
    
    if (match) {
        return {
            contestId: match[1],
            problemIndex: match[2].toUpperCase()
        };
    }
    
    return null;
}

/**
 * Validate if a Codeforces problem link is valid
 * @param {string} link - Codeforces problem URL
 * @returns {Promise<boolean>} True if valid
 */
async function validateProblemLink(link) {
    const parsed = parseProblemLink(link);
    if (!parsed) return false;
    
    const info = await getProblemInfo(parsed.contestId, parsed.problemIndex);
    return info.success;
}

module.exports = {
    getProblemInfo,
    parseProblemLink,
    validateProblemLink,
    
    /**
     * Look up a user, distinguishing "not found" from "no activity".
     * @param {string} handle
     * @returns {Promise<{found: boolean, user?: Object, error?: string}>}
     */
    async getUserInfo(handle) {
        try {
            const response = await axios.get(`${CF_API_BASE}/user.info?handles=${encodeURIComponent(handle)}`);
            if (response.data.status === 'OK' && response.data.result?.length) {
                return { found: true, user: response.data.result[0] };
            }
            return { found: false, error: response.data.comment || 'User not found' };
        } catch (error) {
            // A 400 from Codeforces means the handle does not exist; anything
            // else is a transport problem the caller should surface differently.
            const comment = error.response?.data?.comment;
            if (error.response?.status === 400 && comment) {
                return { found: false, error: comment };
            }
            console.error('CF User Info Error:', error.message);
            return { found: false, error: 'Could not reach Codeforces', transport: true };
        }
    },

    /**
     * Get User Submissions
     * @param {string} handle - Codeforces user handle
     * @returns {Promise<Array>} List of submissions
     */
    async getUserSubmissions(handle) {
        try {
            const response = await axios.get(`${CF_API_BASE}/user.status?handle=${handle}`);
            if (response.data.status === 'OK') {
                return response.data.result;
            }
            return [];
        } catch (error) {
            console.error('CF Submissions Error:', error.message);
            return [];
        }
    },

    /**
     * Get Contest Problems and Name
     * @param {string} contestId - Contest ID
     * @returns {Promise<Object>} { problems: [], name: "" }
     */
    async getContestProblems(contestId) {
        const id = Number(contestId);

        try {
            // Codeforces rejects contest.standings when any extra parameter is
            // sent ("available only via anonymous GET requests with no extra
            // parameters"), and the unfiltered call returns every standings row
            // just to read a problem list. Both cached datasets below already
            // carry what we need, so the common path costs no extra request.
            const [allProblems, contests] = await Promise.all([
                module.exports.getAllProblems(),
                module.exports.getContestList()
            ]);

            const problems = allProblems
                .filter((p) => p.contestId === id)
                .sort((a, b) => a.index.localeCompare(b.index, undefined, { numeric: true }));
            const meta = contests.find((c) => c.id === id);

            if (problems.length && meta) {
                return { problems, name: meta.name };
            }

            // Contests absent from the public problemset (very new, or gym)
            // still resolve through standings, called without extra params.
            const response = await axios.get(`${CF_API_BASE}/contest.standings?contestId=${id}`);
            if (response.data.status === 'OK') {
                return {
                    problems: response.data.result.problems,
                    name: response.data.result.contest.name
                };
            }
            return { problems: [], name: 'Unknown Contest' };
        } catch (error) {
            console.error('CF Contest Error:', error.message);
            return { problems: [], name: 'Unknown Contest' };
        }
    },

    /**
     * Get User's Contest History (Rated Contests)
     * @param {string} handle 
     * @returns {Promise<Array>} List of participated contests
     */
    async getUserRatingHistory(handle) {
        try {
            const response = await axios.get(`${CF_API_BASE}/user.rating?handle=${handle}`);
            if (response.data.status === 'OK') {
                // Returns list of { contestId, contestName, rank, oldRating, newRating ... }
                // We show recent first
                return response.data.result.reverse(); 
            }
            return [];
        } catch (error) {
            console.error('CF Rating History Error:', error.message);
            return [];
        }
    },

    async getAllProblems() {
        const now = Date.now();
        if (cachedGlobalProblems && (now - lastCacheTime < CACHE_TTL)) {
            console.log('Using cached global problems set...');
            return cachedGlobalProblems;
        }

        try {
            console.log('Fetching global problems from Codeforces (Cache Expired/Empty)...');
            const response = await axios.get(`${CF_API_BASE}/problemset.problems`);
            if (response.data.status === 'OK') {
                cachedGlobalProblems = response.data.result.problems;
                lastCacheTime = now;
                console.log(`Fetched and cached ${cachedGlobalProblems.length} global problems.`);
                return cachedGlobalProblems;
            }
            console.error('Failed to fetch global problems:', response.data.comment);
            return [];
        } catch (error) {
            console.error('CF Global Problems Error:', error.message);
            return [];
        }
    },

    /**
     * Get All Contests (Timing Info)
     * @returns {Promise<Array>} List of all contests
     */
    async getContestList() {
        const now = Date.now();
        if (cachedContestList && (now - lastContestCacheTime < CONTEST_CACHE_TTL)) {
            console.log('Using cached contest list...');
            return cachedContestList;
        }

        try {
            console.log('Fetching contest list from Codeforces...');
            const response = await axios.get(`${CF_API_BASE}/contest.list`);
            if (response.data.status === 'OK') {
                cachedContestList = response.data.result;
                lastContestCacheTime = now;
                console.log(`Fetched and cached ${cachedContestList.length} contests.`);
                return cachedContestList;
            }
            return [];
        } catch (error) {
            console.error('CF Contest List Error:', error.message);
            return [];
        }
    }
};



