import React from 'react';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { categorical, palette, basePieOptions } from '../styles/chartTheme';

ChartJS.register(ArcElement, Tooltip, Legend);

const SolvedProblemsByTopicPieChart = ({ submissions }) => {
    if (!submissions || submissions.length === 0) {
        return (
            <section className="panel">
                <div className="panel-header">
                    <h3 className="card-title">Problems Solved by Topics</h3>
                </div>
                <div className="panel-body">
                    <p className="muted">No submissions available.</p>
                </div>
            </section>
        );
    }

    // Filter only accepted submissions and get unique problems
    const acceptedSubmissions = submissions.filter(sub => sub.verdict === 'OK');
    const uniqueProblems = new Map();
    
    acceptedSubmissions.forEach(sub => {
        const problemKey = `${sub.problem.contestId}-${sub.problem.index}`;
        if (!uniqueProblems.has(problemKey)) {
            uniqueProblems.set(problemKey, sub.problem);
        }
    });

    // Count problems by topics/tags
    const topicCounts = {};
    
    uniqueProblems.forEach(problem => {
        if (problem.tags && problem.tags.length > 0) {
            problem.tags.forEach(tag => {
                topicCounts[tag] = (topicCounts[tag] || 0) + 1;
            });
        }
    });

    // Sort topics by count and take top topics for better visualization
    const sortedTopics = Object.entries(topicCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 12); // Show top 12 topics

    if (sortedTopics.length === 0) {
        return (
            <section className="panel">
                <div className="panel-header">
                    <h3 className="card-title">Problems Solved by Topics</h3>
                </div>
                <div className="panel-body">
                    <p className="muted">No tagged problems found.</p>
                </div>
            </section>
        );
    }

    // Shared categorical palette: 12 distinct hues, so no two topics collide
    const colors = categorical;

    const data = {
        labels: sortedTopics.map(([topic, count]) => `${topic} (${count})`),
        datasets: [
            {
                data: sortedTopics.map(([, count]) => count),
                backgroundColor: colors.slice(0, sortedTopics.length),
                borderColor: palette.border,
                borderWidth: 1,
                hoverBackgroundColor: colors.slice(0, sortedTopics.length).map(color => color + 'CC'),
                hoverBorderColor: palette.accent,
                hoverBorderWidth: 3
            }
        ]
    };

    const options = {
        ...basePieOptions,
        plugins: {
            ...basePieOptions.plugins,
            legend: { ...basePieOptions.plugins.legend, position: 'bottom' },
            tooltip: {
                ...basePieOptions.plugins.tooltip,
                callbacks: {
                    label: (context) => {
                        const [topic, count] = sortedTopics[context.dataIndex];
                        const total = sortedTopics.reduce((sum, [, c]) => sum + c, 0);
                        const percentage = ((count / total) * 100).toFixed(1);
                        return [
                            `Topic: ${topic}`,
                            `Problems: ${count}`,
                            `Percentage: ${percentage}%`
                        ];
                    }
                }
            }
        }
    };

    return (
        <section className="panel">
            <div className="panel-header">
                <h3 className="card-title">Problems Solved by Topics</h3>
                <span className="faint mono">{uniqueProblems.size} unique</span>
            </div>
            <div className="panel-body">
                <div style={{ height: '360px' }}>
                    <Pie data={data} options={options} />
                </div>
            </div>
        </section>
    );
};

export default SolvedProblemsByTopicPieChart;