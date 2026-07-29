/**
 * Seed the database with demo data for local development and demos.
 *
 *   npm run seed          # wipe seeded collections, then insert
 *   npm run seed -- --keep  # insert without wiping (may hit unique-index errors)
 *
 * Accounts (password = the part of the email before the @):
 *   teacher1@algonauts.com / teacher1   ... teacher3
 *   student1@algonauts.com / student1   ... student9
 *
 * student1 is wired to the real Codeforces handle swarnimbalpande1003 so the
 * analytics screens have genuine data to render; the rest are test handles.
 */

require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');

const User = require('../models/User');
const Group = require('../models/Group');
const Contest = require('../models/Contest');
const ProblemSet = require('../models/ProblemSet');
const ProblemStatus = require('../models/ProblemStatus');
const GroupProblem = require('../models/GroupProblem');
const GroupProblemStatus = require('../models/GroupProblemStatus');

// ---------------------------------------------------------------------------
// Real Codeforces problems, sampled from problemset.problems by rating band.
// ---------------------------------------------------------------------------
const PROBLEMS = {
    '800-1000': [
        { contestId: 1760, index: 'B', name: 'Atilla\'s Favorite Problem', rating: 800, tags: ['greedy', 'implementation', 'strings'] },
        { contestId: 2014, index: 'B', name: 'Robin Hood and the Major Oak', rating: 800, tags: ['math'] },
        { contestId: 1666, index: 'D', name: 'Deletive Editing', rating: 900, tags: ['greedy'] },
        { contestId: 1043, index: 'A', name: 'Elections', rating: 800, tags: ['implementation', 'math'] },
        { contestId: 2183, index: 'A', name: 'Binary Array Game', rating: 800, tags: ['games'] },
        { contestId: 2147, index: 'B', name: 'Multiple Construction', rating: 1000, tags: ['constructive algorithms'] },
        { contestId: 339, index: 'B', name: 'Xenia and Ringroad', rating: 1000, tags: ['implementation'] },
        { contestId: 1372, index: 'A', name: 'Omkar and Completion', rating: 800, tags: ['constructive algorithms', 'implementation'] },
    ],
    '1100-1300': [
        { contestId: 2021, index: 'B', name: 'Maximize Mex', rating: 1200, tags: ['brute force', 'greedy', 'math'] },
        { contestId: 1115, index: 'G1', name: 'AND oracle', rating: 1100, tags: ['*special'] },
        { contestId: 298, index: 'B', name: 'Sail', rating: 1200, tags: ['brute force', 'greedy', 'implementation'] },
        { contestId: 2113, index: 'B', name: 'Good Start', rating: 1200, tags: ['constructive algorithms', 'math'] },
        { contestId: 612, index: 'A', name: 'The Text Splitting', rating: 1300, tags: ['brute force', 'implementation', 'strings'] },
        { contestId: 1675, index: 'C', name: 'Detective Task', rating: 1100, tags: ['implementation'] },
        { contestId: 2161, index: 'C', name: 'Loyalty', rating: 1200, tags: ['constructive algorithms', 'greedy', 'sortings'] },
        { contestId: 2037, index: 'D', name: 'Sharky Surfing', rating: 1300, tags: ['data structures', 'greedy', 'two pointers'] },
    ],
    '1400-1600': [
        { contestId: 858, index: 'C', name: 'Did you mean...', rating: 1500, tags: ['dp', 'greedy', 'implementation'] },
        { contestId: 920, index: 'C', name: 'Swap Adjacent Elements', rating: 1400, tags: ['dfs and similar', 'greedy', 'math'] },
        { contestId: 2036, index: 'E', name: 'Reverse the Rivers', rating: 1600, tags: ['binary search', 'constructive algorithms', 'data structures'] },
        { contestId: 1458, index: 'A', name: 'Row GCD', rating: 1600, tags: ['math', 'number theory'] },
        { contestId: 1974, index: 'D', name: 'Ingenuity-2', rating: 1400, tags: ['constructive algorithms', 'greedy', 'implementation'] },
        { contestId: 490, index: 'B', name: 'Queue', rating: 1500, tags: ['dsu', 'implementation'] },
        { contestId: 888, index: 'D', name: 'Almost Identity Permutations', rating: 1600, tags: ['combinatorics', 'dp', 'math'] },
        { contestId: 2065, index: 'E', name: 'Skibidus and Rizz', rating: 1600, tags: ['constructive algorithms', 'greedy', 'strings'] },
    ],
    '1700-1900': [
        { contestId: 538, index: 'D', name: 'Weird Chess', rating: 1800, tags: ['brute force', 'constructive algorithms', 'implementation'] },
        { contestId: 1926, index: 'G', name: 'Vlad and Trouble at MIT', rating: 1900, tags: ['dfs and similar', 'dp', 'flows'] },
        { contestId: 1624, index: 'G', name: 'MinOr Tree', rating: 1900, tags: ['bitmasks', 'dfs and similar', 'dsu'] },
        { contestId: 295, index: 'B', name: 'Greg and Graph', rating: 1700, tags: ['dp', 'graphs', 'shortest paths'] },
        { contestId: 316, index: 'G1', name: 'Good Substrings', rating: 1700, tags: ['hashing', 'strings'] },
        { contestId: 476, index: 'D', name: 'Dreamoon and Sets', rating: 1900, tags: ['constructive algorithms', 'greedy', 'math'] },
        { contestId: 2072, index: 'F', name: 'Goodbye, Banker Life', rating: 1700, tags: ['2-sat', 'bitmasks', 'combinatorics'] },
        { contestId: 490, index: 'D', name: 'Chocolate', rating: 1900, tags: ['brute force', 'dfs and similar', 'math'] },
    ],};

const cfLink = (p) => `https://codeforces.com/problemset/problem/${p.contestId}/${p.index}`;
const label = (p) => `${p.contestId}${p.index} — ${p.name}`;

const daysAgo = (n) => new Date(Date.now() - n * 24 * 60 * 60 * 1000);
const daysAhead = (n) => new Date(Date.now() + n * 24 * 60 * 60 * 1000);

// Deterministic pseudo-random so reseeding produces the same demo state.
let _seed = 20260825;
const rand = () => {
    _seed = (_seed * 1103515245 + 12345) & 0x7fffffff;
    return _seed / 0x7fffffff;
};
const pick = (arr) => arr[Math.floor(rand() * arr.length)];

const MENTORS = [
    { name: 'Ananya Rao', email: 'teacher1@algonauts.com', password: 'teacher1' },
    { name: 'Vikram Nair', email: 'teacher2@algonauts.com', password: 'teacher2' },
    { name: 'Priya Menon', email: 'teacher3@algonauts.com', password: 'teacher3' }
];

const STUDENTS = [
    { name: 'Swarnim Balpande', email: 'student1@algonauts.com', password: 'student1', codeforcesHandle: 'swarnimbalpande1003' },
    { name: 'Aarav Sharma',   email: 'student2@algonauts.com', password: 'student2', codeforcesHandle: 'test_student2' },
    { name: 'Diya Patel',     email: 'student3@algonauts.com', password: 'student3', codeforcesHandle: 'test_student3' },
    { name: 'Kabir Singh',    email: 'student4@algonauts.com', password: 'student4', codeforcesHandle: 'test_student4' },
    { name: 'Ishita Verma',   email: 'student5@algonauts.com', password: 'student5', codeforcesHandle: 'test_student5' },
    { name: 'Rohan Gupta',    email: 'student6@algonauts.com', password: 'student6', codeforcesHandle: 'test_student6' },
    { name: 'Ananya Iyer',    email: 'student7@algonauts.com', password: 'student7', codeforcesHandle: 'test_student7' },
    { name: 'Arjun Reddy',    email: 'student8@algonauts.com', password: 'student8', codeforcesHandle: 'test_student8' },
    { name: 'Meera Joshi',    email: 'student9@algonauts.com', password: 'student9', codeforcesHandle: 'test_student9' }
];

// mentor index -> group definitions; student indices are 0-based into STUDENTS
const GROUPS = [
    { groupName: 'Beginners Bootcamp',  mentor: 0, students: [0, 1, 2, 3],    band: '800-1000'   },
    { groupName: 'Div 2 Grinders',      mentor: 0, students: [0, 4, 5],       band: '1100-1300'  },
    { groupName: 'Graph Theory Focus',  mentor: 1, students: [1, 4, 6, 7],    band: '1400-1600'  },
    { groupName: 'DP Intensive',        mentor: 1, students: [2, 5, 8],       band: '1400-1600'  },
    { groupName: 'ICPC Prep Squad',     mentor: 2, students: [3, 6, 7, 8],    band: '1700-1900'  }
];

const SET_NAMES = {
    'Beginners Bootcamp': 'Week 1 — Warmups',
    'Div 2 Grinders': 'Week 3 — Greedy & Math',
    'Graph Theory Focus': 'Traversals & Shortest Paths',
    'DP Intensive': 'Classic DP Patterns',
    'ICPC Prep Squad': 'Mock Round Set A'
};

const TIMES = ['<20min', '<30min', '<1hour', '<3hour'];
const LEARNINGS = [
    'Realised the greedy choice works because swapping any adjacent pair never improves the answer.',
    'Got TLE with O(n^2) first; prefix sums brought it down to O(n).',
    'Missed the edge case where n = 1 — always check the smallest input.',
    'Sorting by the second key first made the DP transition obvious.',
    'Used a visited set to avoid revisiting nodes; cut the runtime in half.',
    'Binary searching on the answer was the trick — monotonic predicate.',
    'Overflow on int; switching to long long fixed the wrong answer.',
    'Drew the recursion tree and the memo state became clear.'
];

async function run() {
    const keep = process.argv.includes('--keep');

    if (!process.env.MONGODB_URI) {
        console.error('MONGODB_URI is not set. Copy backend/.env.example to backend/.env first.');
        process.exit(1);
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log(`Connected: ${mongoose.connection.host}`);
    console.log(`Database : ${mongoose.connection.name}\n`);

    if (!keep) {
        for (const M of [GroupProblemStatus, GroupProblem, ProblemStatus, ProblemSet, Contest, Group, User]) {
            const { deletedCount } = await M.deleteMany({});
            console.log(`  cleared ${M.modelName.padEnd(20)} ${deletedCount}`);
        }
        console.log('');
    }

    // ---- Users (created one by one so the password-hashing hook runs) ------
    const mentors = [];
    for (const m of MENTORS) {
        mentors.push(await User.create({ ...m, role: 'mentor' }));
    }
    const students = [];
    for (const s of STUDENTS) {
        students.push(await User.create({ ...s, role: 'student' }));
    }
    console.log(`  ${mentors.length} mentors, ${students.length} students`);

    // ---- Groups ------------------------------------------------------------
    const groups = [];
    for (const g of GROUPS) {
        const group = await Group.create({
            groupName: g.groupName,
            mentorId: mentors[g.mentor]._id,
            students: g.students.map((i) => students[i]._id)
        });
        groups.push({ doc: group, def: g });
        await User.updateMany(
            { _id: { $in: g.students.map((i) => students[i]._id) } },
            { $addToSet: { groupIds: group._id } }
        );
    }
    console.log(`  ${groups.length} groups`);

    // ---- Group problems + problem sets ------------------------------------
    let problemCount = 0;
    let statusCount = 0;
    for (const { doc: group, def } of groups) {
        const pool = PROBLEMS[def.band];
        const chosen = pool.slice(0, 5);
        const created = [];

        for (const p of chosen) {
            const gp = await GroupProblem.create({
                groupId: group._id,
                mentorId: group.mentorId,
                title: label(p),
                link: cfLink(p),
                platform: 'Codeforces'
            });
            created.push(gp);
            problemCount++;

            // Per-student progress: roughly two thirds solved.
            for (const sid of group.students) {
                const solved = rand() < 0.65;
                await GroupProblemStatus.create({
                    problemId: gp._id,
                    userId: sid,
                    groupId: group._id,
                    status: solved ? 'Solved' : 'Pending',
                    ...(solved
                        ? { timeTaken: pick(TIMES), learnings: pick(LEARNINGS), solvedAt: daysAgo(Math.floor(rand() * 30) + 1) }
                        : {})
                });
                statusCount++;
            }
        }

        const set = await ProblemSet.create({
            setName: SET_NAMES[def.groupName],
            groupId: group._id,
            mentorId: group.mentorId,
            problems: created.map((c) => c._id)
        });
        group.problemSets = [set._id];
        await group.save();
    }
    console.log(`  ${problemCount} group problems, ${statusCount} progress records, ${groups.length} problem sets`);

    // ---- Contests ----------------------------------------------------------
    const CONTESTS = [
        { contestName: 'Algonauts Weekly #12',   band: '800-1000',  mentor: 0, isGlobal: true,  startsIn: -7, hours: 2, description: 'Beginner-friendly round covering greedy and implementation.' },
        { contestName: 'Div 2 Sprint — March',   band: '1100-1300', mentor: 0, isGlobal: true,  startsIn: -2, hours: 2, description: 'Timed sprint on Div 2 A–C difficulty.' },
        { contestName: 'Graph Warmup Round',     band: '1400-1600', mentor: 1, isGlobal: false, startsIn: 3,  hours: 3, description: 'BFS, DFS and shortest-path practice.' },
        { contestName: 'DP Marathon',            band: '1400-1600', mentor: 1, isGlobal: false, startsIn: 6,  hours: 4, description: 'Long-form contest focused on dynamic programming.' },
        { contestName: 'ICPC Mock Round A',      band: '1700-1900', mentor: 2, isGlobal: true,  startsIn: 10, hours: 5, description: 'Five-hour team-style mock in ICPC format.' }
    ];

    const contests = [];
    for (const c of CONTESTS) {
        const start = c.startsIn < 0 ? daysAgo(-c.startsIn) : daysAhead(c.startsIn);
        const end = new Date(start.getTime() + c.hours * 60 * 60 * 1000);
        const problems = PROBLEMS[c.band].slice(0, 5).map((p, i) => ({
            order: String.fromCharCode(65 + i),
            title: label(p),
            link: cfLink(p),
            platform: 'Codeforces'
        }));

        // Past contests get a realistic registration list; upcoming ones fewer.
        const registered = students
            .filter(() => rand() < (c.startsIn < 0 ? 0.75 : 0.45))
            .map((s) => s._id);

        const contest = await Contest.create({
            contestName: c.contestName,
            description: c.description,
            startTime: start,
            endTime: end,
            mentorId: mentors[c.mentor]._id,
            problems,
            isGlobal: c.isGlobal,
            registeredStudents: registered
        });
        contests.push({ doc: contest, def: c, past: c.startsIn < 0 });
    }
    console.log(`  ${contests.length} contests`);

    // ---- Per-student problem status for contests that already ran ---------
    let psCount = 0;
    for (const { doc: contest, past } of contests) {
        if (!past) continue;
        for (const sid of contest.registeredStudents) {
            for (const p of contest.problems) {
                const solved = rand() < 0.55;
                await ProblemStatus.create({
                    userId: sid,
                    contestId: contest._id,
                    problemIndex: p.order,
                    status: solved ? 'Solved' : 'Pending',
                    ...(solved ? { solvedAt: new Date(contest.endTime.getTime() - Math.floor(rand() * 3600) * 1000) } : {})
                });
                psCount++;
            }
        }
    }
    console.log(`  ${psCount} contest problem statuses`);

    // Link group contests back onto their groups
    for (const { doc: contest, def } of contests) {
        if (def.isGlobal) continue;
        const target = groups.find((g) => String(g.doc.mentorId) === String(contest.mentorId));
        if (target) {
            target.doc.contests = [...(target.doc.contests || []), contest._id];
            await target.doc.save();
        }
    }

    console.log('\nSeed complete.\n');
    console.log('  Mentors : teacher1@algonauts.com … teacher3@algonauts.com  (password = email prefix)');
    console.log('  Students: student1@algonauts.com … student9@algonauts.com  (password = email prefix)');
    console.log('  student1 uses the real Codeforces handle swarnimbalpande1003\n');

    await mongoose.disconnect();
}

run().catch(async (err) => {
    console.error('\nSeed failed:', err.message);
    await mongoose.disconnect().catch(() => {});
    process.exit(1);
});
