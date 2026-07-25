import React, { useMemo } from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';

const DAY_MS = 24 * 60 * 60 * 1000;

const toKey = (date) => date.toISOString().slice(0, 10);

/**
 * GitHub-style activity heatmap of accepted Codeforces submissions
 * over the trailing year.
 */
const ProblemsSolvedCalendar = ({ submissions }) => {
    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - 364 * DAY_MS);

    const { values, total, activeDays, best } = useMemo(() => {
        const empty = { values: [], total: 0, activeDays: 0, best: 0 };
        if (!submissions?.length) return empty;

        // Credit each problem to the day it was FIRST accepted, so re-submissions
        // and later re-solves don't inflate or shift the activity graph.
        const firstSolve = new Map();
        for (const sub of submissions) {
            if (sub.verdict !== 'OK') continue;
            const key = `${sub.problem?.contestId ?? 'x'}-${sub.problem?.index ?? '?'}`;
            const at = sub.creationTimeSeconds;
            if (!firstSolve.has(key) || at < firstSolve.get(key)) firstSolve.set(key, at);
        }

        // The grid only renders the trailing year, so the summary must use the
        // same window or the numbers won't match what's on screen.
        const from = startDate.getTime();
        const to = endDate.getTime();
        const perDay = new Map();
        for (const at of firstSolve.values()) {
            const ms = at * 1000;
            if (ms < from || ms > to) continue;
            const day = toKey(new Date(ms));
            perDay.set(day, (perDay.get(day) || 0) + 1);
        }

        const list = [...perDay.entries()].map(([date, count]) => ({ date, count }));
        return {
            values: list,
            total: list.reduce((sum, v) => sum + v.count, 0),
            activeDays: list.length,
            best: list.reduce((max, v) => Math.max(max, v.count), 0)
        };
        // startDate/endDate are derived from render time; submissions is the real input.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [submissions]);

    return (
        <section className="panel">
            <div className="panel-header">
                <h3 className="card-title">Solve activity</h3>
                <div className="row heatmap-legend-stats">
                    <span className="faint mono">{total} solved</span>
                    <span className="faint mono">{activeDays} active days</span>
                    <span className="faint mono">best {best}/day</span>
                    <span className="faint">past year</span>
                </div>
            </div>

            <div className="panel-body">
                {values.length === 0 ? (
                    <p className="muted">No accepted submissions in the last year.</p>
                ) : (
                    <>
                        <div className="heatmap-scroll">
                            <CalendarHeatmap
                                startDate={startDate}
                                endDate={endDate}
                                values={values}
                                gutterSize={2}
                                showWeekdayLabels
                                classForValue={(value) => {
                                    if (!value || !value.count) return 'cf-heat-empty';
                                    if (value.count >= 8) return 'cf-heat-4';
                                    if (value.count >= 5) return 'cf-heat-3';
                                    if (value.count >= 3) return 'cf-heat-2';
                                    return 'cf-heat-1';
                                }}
                                titleForValue={(value) =>
                                    value?.date
                                        ? `${value.date}: ${value.count} solved`
                                        : 'No submissions'
                                }
                            />
                        </div>

                        <div className="heatmap-legend">
                            <span className="faint">Less</span>
                            <span className="heat-swatch cf-heat-empty" />
                            <span className="heat-swatch cf-heat-1" />
                            <span className="heat-swatch cf-heat-2" />
                            <span className="heat-swatch cf-heat-3" />
                            <span className="heat-swatch cf-heat-4" />
                            <span className="faint">More</span>
                        </div>
                    </>
                )}
            </div>
        </section>
    );
};

export default ProblemsSolvedCalendar;
