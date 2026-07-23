import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { palette, baseCartesianOptions } from '../styles/chartTheme';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const RatingLineChart = ({ ratingHistory }) => {
    if (!ratingHistory || ratingHistory.length === 0) {
        return (
            <section className="panel">
                <div className="panel-header">
                    <h3 className="card-title">Rating History</h3>
                </div>
                <div className="panel-body">
                    <p className="muted">No rating history available.</p>
                </div>
            </section>
        );
    }

    const data = {
        labels: ratingHistory.map((_, index) => `Contest ${index + 1}`),
        datasets: [
            {
                label: 'Rating',
                data: ratingHistory.map((contest) => contest.newRating),
                borderColor: palette.primary,
                backgroundColor: 'rgba(16, 185, 129, 0.14)',
                borderWidth: 2,
                pointBackgroundColor: palette.primary,
                pointBorderColor: palette.text,
                pointBorderWidth: 2,
                pointRadius: 3,
                pointHoverRadius: 5,
                tension: 0.1
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
                    title: (context) => {
                        const index = context[0].dataIndex;
                        return ratingHistory[index].contestName || `Contest ${index + 1}`;
                    },
                    label: (context) => {
                        const contest = ratingHistory[context.dataIndex];
                        const change = contest.newRating - contest.oldRating;
                        return [
                            `Rating: ${contest.newRating}`,
                            `Change: ${change > 0 ? '+' : ''}${change}`,
                            `Rank: ${contest.rank}`
                        ];
                    }
                }
            }
        },
        scales: {
            ...baseCartesianOptions.scales,
            // Rating charts read better without a forced zero baseline
            y: { ...baseCartesianOptions.scales.y, beginAtZero: false }
        }
    };

    return (
        <section className="panel">
            <div className="panel-header">
                <h3 className="card-title">Rating History</h3>
                <span className="faint mono">{ratingHistory.length} contests</span>
            </div>
            <div className="panel-body">
                <div style={{ height: '360px' }}>
                    <Line data={data} options={options} />
                </div>
            </div>
        </section>
    );
};

export default RatingLineChart;
