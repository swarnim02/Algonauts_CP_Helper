import React from 'react';
import UserInput from './UserInput';
import StatsCards from './StatsCards';
import RatingLineChart from './RatingLineChart';
import SolvedProblemsByTopicPieChart from './SolvedProblemsByTopicPieChart';
import ProblemsSolvedByRatingBarChart from './ProblemsSolvedByRatingBarChart';
import ProblemsSolvedCalendar from './ProblemsSolvedCalendar';

const CodeforcesDashboard = ({
    cfLoading,
    cfError,
    userData,
    ratingHistory,
    submissions,
    onFetchStats
}) => {
    return (
        <div className="stack" style={{ gap: 'var(--sp-6)' }}>
            <div>
                <h2 className="section-title">Codeforces statistics</h2>
                <p className="muted">
                    Pull rating history, topic coverage and solve activity for any handle.
                </p>
            </div>

            <UserInput onSubmit={onFetchStats} loading={cfLoading} />

            {cfError && (
                <div className="alert alert-error" role="alert">
                    {cfError}
                </div>
            )}

            {userData && (
                <div className="stack" style={{ gap: 'var(--sp-6)' }}>
                    <StatsCards userData={userData} ratingHistory={ratingHistory} />

                    <div className="grid grid-2">
                        <RatingLineChart ratingHistory={ratingHistory} />
                        <SolvedProblemsByTopicPieChart submissions={submissions} />
                    </div>

                    <ProblemsSolvedByRatingBarChart submissions={submissions} />

                    <ProblemsSolvedCalendar submissions={submissions} userData={userData} />
                </div>
            )}
        </div>
    );
};

export default CodeforcesDashboard;
