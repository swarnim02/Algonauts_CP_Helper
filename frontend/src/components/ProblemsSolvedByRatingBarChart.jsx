import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { palette, cfRankColors, baseCartesianOptions } from '../styles/chartTheme';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

// Two buckets per rank band, ascending with difficulty
const RANK_RAMP = [
    cfRankColors.pupil, cfRankColors.pupil,
    cfRankColors.specialist, cfRankColors.specialist,
    cfRankColors.expert, cfRankColors.expert,
    cfRankColors.candidateMaster, cfRankColors.candidateMaster,
    cfRankColors.grandmaster, cfRankColors.grandmaster
];

const ProblemsSolvedByRatingBarChart = ({ submissions }) => {
    if (!submissions || submissions.length === 0) {
        return (
            <section className="panel">
                <div className="panel-header">
                    <h3 className="card-title">Problems Solved by Rating</h3>
                </div>
                <div className="panel-body">
                    <p className="muted">No submissions available.</p>
                </div>
            </section>
        );
    }

    // Filter only accepted submissions and get unique problems with ratings
    const acceptedSubmissions = submissions.filter(sub => sub.verdict === 'OK');
    const uniqueProblems = new Map();
    
    acceptedSubmissions.forEach(sub => {
        const problemKey = `${sub.problem.contestId}-${sub.problem.index}`;
        if (!uniqueProblems.has(problemKey) && sub.problem.rating) {
            uniqueProblems.set(problemKey, sub.problem);
        }
    });

    // Count problems by rating buckets
    const buckets = {
        '800-999': 0,
        '1000-1199': 0,
        '1200-1399': 0,
        '1400-1599': 0,
        '1600-1799': 0,
        '1800-1999': 0,
        '2000-2199': 0,
        '2200-2399': 0,
        '2400-2599': 0,
        '2600+': 0
    };

    uniqueProblems.forEach(problem => {
        const rating = problem.rating;
        if (rating >= 800 && rating < 1000) buckets['800-999']++;
        else if (rating < 1200) buckets['1000-1199']++;
        else if (rating < 1400) buckets['1200-1399']++;
        else if (rating < 1600) buckets['1400-1599']++;
        else if (rating < 1800) buckets['1600-1799']++;
        else if (rating < 2000) buckets['1800-1999']++;
        else if (rating < 2200) buckets['2000-2199']++;
        else if (rating < 2400) buckets['2200-2399']++;
        else if (rating < 2600) buckets['2400-2599']++;
        else if (rating >= 2600) buckets['2600+']++;
    });

    const data = {
        labels: Object.keys(buckets),
        datasets: [
            {
                label: 'Problems Solved',
                data: Object.values(buckets),
                // Buckets ascend by difficulty, two per Codeforces rank band
                backgroundColor: RANK_RAMP.map((c) => `${c}cc`),
                borderColor: RANK_RAMP,
                borderWidth: 1,
                hoverBackgroundColor: RANK_RAMP
            }
        ]
    };

    const options = {
        ...baseCartesianOptions,
        plugins: {
            ...baseCartesianOptions.plugins,
            tooltip: {
                ...baseCartesianOptions.plugins.tooltip,
                callbacks: {
                    label: (context) => `${context.label}: ${context.parsed.y} problems`
                }
            }
        },
        scales: {
            x: {
                ...baseCartesianOptions.scales.x,
                title: { display: true, text: 'Rating Range', color: palette.muted }
            },
            y: {
                ...baseCartesianOptions.scales.y,
                title: { display: true, text: 'Number of Problems', color: palette.muted }
            }
        }
    };

    return (
        <section className="panel">
            <div className="panel-header">
                <h3 className="card-title">Problems Solved by Rating</h3>
                <span className="faint mono">{uniqueProblems.size} rated</span>
            </div>
            <div className="panel-body">
                <div style={{ height: '360px' }}>
                    <Bar data={data} options={options} />
                </div>
            </div>
        </section>
    );
};

export default ProblemsSolvedByRatingBarChart;