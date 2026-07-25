import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { studentAPI } from '../utils/api';
import CodeforcesDashboard from '../components/CodeforcesDashboard';

const StudentDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [upsolveQueue, setUpsolveQueue] = useState([]);
    const [statusMessage, setStatusMessage] = useState(null);
    const [upsolveStats, setUpsolveStats] = useState({
        contestGiven: 0,
        upsolveDone: 0,
        upsolvePending: 0
    });
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('queue');
    const [studentGroups, setStudentGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [selectedSet, setSelectedSet] = useState(null);
    const [solveModal, setSolveModal] = useState({ show: false, problem: null, timeTaken: '<20min', learnings: '' });
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [globalContests, setGlobalContests] = useState([]);
    const [selectedContest, setSelectedContest] = useState(null);
    const [contestTab, setContestTab] = useState('');
    const [leaderboard, setLeaderboard] = useState([]);
    const [cfLoading, setCfLoading] = useState(false);
    const [cfError, setCfError] = useState(null);
    const [userData, setUserData] = useState(null);
    const [ratingHistory, setRatingHistory] = useState([]);
    const [submissions, setSubmissions] = useState([]);


    useEffect(() => {
        fetchData();
        fetchGroupProblems();
        fetchGlobalContests();
    }, []);

    const fetchData = async () => {
        try {
            // getMyStats/getParticipatedContests were fetched into state that
            // nothing rendered, so only the queue is requested now.
            const queueRes = await studentAPI.getUpsolveQueue();
            setUpsolveQueue(queueRes.data.queue || []);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchGroupProblems = async () => {
        try {
            const res = await studentAPI.getGroupProblems();
            setStudentGroups(res.data.groups || []);
        } catch (error) {
            console.error('Error fetching group problems:', error);
        }
    };

    const fetchGlobalContests = async () => {
        try {
            const res = await studentAPI.getGlobalContests();
            setGlobalContests(res.data.contests || []);
            // console.log(res.data)
        } catch (error) {
            console.error('Error fetching contests:', error);
        }
    };

    const fetchCfStats = async (handle) => {
        setCfLoading(true);
        setCfError(null);
        setUserData(null);
        setRatingHistory([]);
        setSubmissions([]);
        
        try {
            const trimmedHandle = handle.trim();
            if (!trimmedHandle) {
                setCfError('Username cannot be empty');
                return;
            }
            
            const [userRes, ratingRes, statusRes] = await Promise.all([
                fetch(`https://codeforces.com/api/user.info?handles=${trimmedHandle}`),
                fetch(`https://codeforces.com/api/user.rating?handle=${trimmedHandle}`),
                fetch(`https://codeforces.com/api/user.status?handle=${trimmedHandle}`)
            ]);
            
            const userData = await userRes.json();
            const ratingData = await ratingRes.json();
            const statusData = await statusRes.json();
            
            if (userData.status === 'OK' && ratingData.status === 'OK' && statusData.status === 'OK') {
                setUserData(userData.result[0]);
                setRatingHistory(ratingData.result);
                setSubmissions(statusData.result);
            } else {
                setCfError('User not found or invalid username');
            }
        } catch {
            setCfError('Failed to fetch data. Please try again.');
        } finally {
            setCfLoading(false);
        }
    };



    const fetchLeaderboard = async (contestId) => {
        try {
            const res = await studentAPI.getContestLeaderboard(contestId);
            setLeaderboard(res.data.leaderboard || []);
        } catch (error) {
            console.error('Error fetching leaderboard:', error);
        }
    };

    const handleRegisterContest = async (contestId) => {
        try {
            await studentAPI.registerForContest(contestId);
            alert('Successfully registered for contest!');
            fetchGlobalContests();
        } catch (error) {
            alert(error.response?.data?.message || 'Error registering for contest');
        }
    };

    const handleSolveSubmit = async (e) => {
        e.preventDefault();
        try {
            await studentAPI.submitGroupSolve(solveModal.problem._id, {
                timeTaken: solveModal.timeTaken,
                learnings: solveModal.learnings
            });
            setSolveModal({ show: false, problem: null, timeTaken: '<20min', learnings: '' });
            fetchGroupProblems();
            alert('Solve submitted successfully!');
        } catch (error) {
            alert(error.response?.data?.message || 'Error submitting solve');
        }
    };

    const handleFetchStatus = async () => {
        setStatusMessage({ type: 'info', text: 'Syncing with Codeforces... Usually takes 5-10 seconds.' });

        const btn = document.getElementById('fetch-status-btn');
        if (btn) { btn.disabled = true; btn.innerText = 'Syncing...'; }

        try {
            const res = await studentAPI.bulkUpsolve();

            if (res.data.stats) {
                setUpsolveStats(res.data.stats);
            }

            setStatusMessage({ type: 'success', text: 'Status synchronized successfully!' });
            fetchData();
        } catch (error) {
            console.error(error);
            const errMsg = error.response?.data?.message || 'Error fetching status.';
            setStatusMessage({ type: 'error', text: errMsg });
        } finally {
            if (btn) { btn.disabled = false; btn.innerText = 'Fetch Current Status'; }
        }
    };

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    if (loading) return <div className="dashboard-container"><p>Loading...</p></div>;

    return (
        <div style={{ 
            background: 'var(--grad-page)', 
            minHeight: '100vh',
            position: 'relative'
        }}>
            {/* Static Background Elements */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.1 }}>
                <div style={{ position: 'absolute', width: '400px', height: '400px', background: 'radial-gradient(circle, var(--primary) 0%, transparent 70%)', borderRadius: '50%', top: '5%', left: '5%' }}></div>
                <div style={{ position: 'absolute', width: '250px', height: '250px', background: 'radial-gradient(circle, var(--accent) 0%, transparent 70%)', borderRadius: '50%', top: '50%', right: '10%' }}></div>
                <div style={{ position: 'absolute', width: '180px', height: '180px', background: 'radial-gradient(circle, var(--primary) 0%, transparent 70%)', borderRadius: '50%', bottom: '15%', left: '15%' }}></div>
            </div>
            
            <nav style={{
                background: 'var(--bg-panel)',
                backdropFilter: 'blur(20px)',
                border: 'none',
                borderBottom: '1px solid var(--border-strong)',
                padding: '1rem 2rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                position: 'relative',
                zIndex: 10
            }}>
                <h2 style={{ 
                    margin: 0, 
                    color: 'var(--text)',
                    fontSize: '1.8rem',
                    fontWeight: 'bold',
                    background: 'var(--grad-text)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                }}>Algonauts</h2>
                <div className="nav-user" style={{ position: 'relative' }}>
                    <button 
                        onClick={() => setShowProfileMenu(!showProfileMenu)}
                        style={{
                            background: 'var(--glass)',
                            border: '1px solid var(--glass-strong)',
                            color: 'white',
                            padding: '0.5rem 1rem',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        {user?.name}
                        <span style={{ fontSize: '0.8rem' }}>▼</span>
                    </button>
                    {showProfileMenu && (
                        <div style={{
                            position: 'absolute',
                            top: '100%',
                            right: 0,
                            marginTop: '0.5rem',
                            background: 'var(--shadow-color)',
                            border: '1px solid var(--glass-strong)',
                            borderRadius: '6px',
                            minWidth: '200px',
                            zIndex: 1000,
                            boxShadow: '0 4px 12px var(--shadow-color)'
                        }}>
                            <div style={{ padding: '0.5rem 0' }}>
                                <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--glass)', color: 'var(--muted)', fontSize: '0.9rem' }}>
                                    {user?.email}
                                </div>
                                <button
                                    onClick={handleLogout}
                                    style={{
                                        width: '100%',
                                        background: 'transparent',
                                        border: 'none',
                                        color: 'white',
                                        padding: '0.75rem 1rem',
                                        textAlign: 'left',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease'
                                    }}
                                    onMouseEnter={(e) => e.target.style.background = 'var(--glass)'}
                                    onMouseLeave={(e) => e.target.style.background = 'transparent'}
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </nav>

            <div style={{ display: 'flex', minHeight: 'calc(100vh - 80px)', position: 'relative', zIndex: 1 }}>
                <aside style={{ 
                    width: '280px',
                    background: 'var(--bg-panel)', 
                    backdropFilter: 'blur(20px)',
                    borderRight: '1px solid var(--border-strong)',
                    padding: '2rem 0'
                }}>
                    <button
                        onClick={() => { setActiveTab('queue'); setSelectedContest(null); }}
                        style={{
                            border: 'none',
                            background: activeTab === 'queue' ? 'var(--primary-soft)' : 'transparent',
                            borderLeft: activeTab === 'queue' ? '3px solid var(--primary)' : '3px solid transparent',
                            color: activeTab === 'queue' ? 'var(--text)' : 'var(--muted)',
                            padding: '1rem 1.5rem',
                            textAlign: 'left',
                            cursor: 'pointer',
                            width: '100%',
                            transition: 'all 0.3s ease',
                            fontSize: '1rem',
                            fontWeight: activeTab === 'queue' ? '600' : 'normal',
                            borderRadius: activeTab === 'queue' ? '0 8px 8px 0' : '0'
                        }}
                        onMouseEnter={(e) => {
                            if (activeTab !== 'queue') {
                                e.target.style.background = 'var(--primary-soft)';
                                e.target.style.color = 'var(--text)';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (activeTab !== 'queue') {
                                e.target.style.background = 'transparent';
                                e.target.style.color = 'var(--muted)';
                            }
                        }}
                    >
                        Upsolve Queue
                    </button>
                    <button
                        onClick={() => { setActiveTab('groups'); setSelectedContest(null); }}
                        style={{
                            border: 'none',
                            background: activeTab === 'groups' ? 'var(--primary-soft)' : 'transparent',
                            borderLeft: activeTab === 'groups' ? '3px solid var(--primary)' : '3px solid transparent',
                            color: activeTab === 'groups' ? 'var(--text)' : 'var(--muted)',
                            padding: '1rem 1.5rem',
                            textAlign: 'left',
                            cursor: 'pointer',
                            width: '100%',
                            transition: 'all 0.3s ease',
                            fontSize: '1rem',
                            fontWeight: activeTab === 'groups' ? '600' : 'normal',
                            borderRadius: activeTab === 'groups' ? '0 8px 8px 0' : '0'
                        }}
                        onMouseEnter={(e) => {
                            if (activeTab !== 'groups') {
                                e.target.style.background = 'var(--primary-soft)';
                                e.target.style.color = 'var(--text)';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (activeTab !== 'groups') {
                                e.target.style.background = 'transparent';
                                e.target.style.color = 'var(--muted)';
                            }
                        }}
                    >
                        Groups
                    </button>
                    <button
                        onClick={() => setActiveTab('contests')}
                        style={{
                            border: 'none',
                            background: activeTab === 'contests' ? 'var(--primary-soft)' : 'transparent',
                            borderLeft: activeTab === 'contests' ? '3px solid var(--primary)' : '3px solid transparent',
                            color: activeTab === 'contests' ? 'var(--text)' : 'var(--muted)',
                            padding: '1rem 1.5rem',
                            textAlign: 'left',
                            cursor: 'pointer',
                            width: '100%',
                            transition: 'all 0.3s ease',
                            fontSize: '1rem',
                            fontWeight: activeTab === 'contests' ? '600' : 'normal',
                            borderRadius: activeTab === 'contests' ? '0 8px 8px 0' : '0'
                        }}
                        onMouseEnter={(e) => {
                            if (activeTab !== 'contests') {
                                e.target.style.background = 'var(--primary-soft)';
                                e.target.style.color = 'var(--text)';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (activeTab !== 'contests') {
                                e.target.style.background = 'transparent';
                                e.target.style.color = 'var(--muted)';
                            }
                        }}
                    >
                        Contests
                    </button>

                    <button
                        onClick={() => setActiveTab('analytics')}
                        style={{
                            border: 'none',
                            background: activeTab === 'analytics' ? 'var(--primary-soft)' : 'transparent',
                            borderLeft: activeTab === 'analytics' ? '3px solid var(--primary)' : '3px solid transparent',
                            color: activeTab === 'analytics' ? 'var(--text)' : 'var(--muted)',
                            padding: '1rem 1.5rem',
                            textAlign: 'left',
                            cursor: 'pointer',
                            width: '100%',
                            transition: 'all 0.3s ease',
                            fontSize: '1rem',
                            fontWeight: activeTab === 'analytics' ? '600' : 'normal',
                            borderRadius: activeTab === 'analytics' ? '0 8px 8px 0' : '0'
                        }}
                        onMouseEnter={(e) => {
                            if (activeTab !== 'analytics') {
                                e.target.style.background = 'var(--primary-soft)';
                                e.target.style.color = 'var(--text)';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (activeTab !== 'analytics') {
                                e.target.style.background = 'transparent';
                                e.target.style.color = 'var(--muted)';
                            }
                        }}
                    >
                        Codeforces Analytics
                    </button>

                </aside>

                <main style={{ 
                    flex: 1, 
                    padding: '2rem',
                    background: 'var(--bg-input)',
                    backdropFilter: 'blur(10px)'
                }}>
                    {activeTab === 'queue' && (
                        <div style={{
                            background: 'var(--grad-page)',
                            borderRadius: '20px',
                            padding: '2rem',
                            position: 'relative',
                            overflow: 'hidden',
                            border: '1px solid var(--primary-soft)',
                            boxShadow: '0 20px 40px var(--shadow-color)'
                        }}>
                            {/* Background Elements - Exactly like MainHome */}
                            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.15 }}>
                                <div style={{ position: 'absolute', width: '400px', height: '400px', background: 'radial-gradient(circle, var(--primary) 0%, transparent 70%)', borderRadius: '50%', top: '5%', left: '5%' }}></div>
                                <div style={{ position: 'absolute', width: '250px', height: '250px', background: 'radial-gradient(circle, var(--accent) 0%, transparent 70%)', borderRadius: '50%', top: '50%', right: '10%' }}></div>
                                <div style={{ position: 'absolute', width: '180px', height: '180px', background: 'radial-gradient(circle, var(--primary) 0%, transparent 70%)', borderRadius: '50%', bottom: '15%', left: '15%' }}></div>
                                <div style={{ position: 'absolute', width: '320px', height: '320px', background: 'radial-gradient(circle, var(--accent) 0%, transparent 70%)', borderRadius: '50%', top: '30%', left: '60%' }}></div>
                            </div>
                            
                            {/* Pulsing Dots - Exactly like MainHome */}
                            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.3 }}>
                                <div style={{ position: 'absolute', width: '12px', height: '12px', background: 'var(--primary)', borderRadius: '50%', top: '15%', left: '40%' }}></div>
                                <div style={{ position: 'absolute', width: '8px', height: '8px', background: 'var(--accent)', borderRadius: '50%', top: '55%', left: '85%' }}></div>
                                <div style={{ position: 'absolute', width: '10px', height: '10px', background: 'var(--primary)', borderRadius: '50%', top: '75%', left: '65%' }}></div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', position: 'relative', zIndex: 1 }}>
                                <h2 style={{ 
                                    color: 'var(--text)',
                                    fontSize: '2.5rem',
                                    fontWeight: '900',
                                    margin: 0
                                }}>Your Upsolve Queue</h2>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button
                                        id="fetch-status-btn"
                                        onClick={handleFetchStatus}
                                        style={{ 
                                            background: 'var(--glass)', 
                                            color: 'var(--text)', 
                                            fontWeight: '700',
                                            border: '1px solid var(--glass-strong)',
                                            padding: '1rem 2rem',
                                            borderRadius: '15px',
                                            cursor: 'pointer',
                                            backdropFilter: 'blur(10px)',
                                            transition: 'all 0.3s ease',
                                            fontSize: '1rem'
                                        }}
                                    >
                                        Fetch Current Status
                                    </button>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', marginBottom: '20px', position: 'relative', zIndex: 1 }}>
                                <div style={{ 
                                    padding: '1.5rem', 
                                    textAlign: 'center',
                                    background: 'var(--bg-panel)',
                                    border: '1px solid var(--border-strong)',
                                    borderRadius: '12px',
                                    backdropFilter: 'blur(20px)',
                                    boxShadow: '0 8px 25px var(--shadow-color)'
                                }}>
                                    <h4 style={{ fontSize: '0.9rem', color: 'var(--muted)', margin: '0 0 0.5rem 0', fontWeight: '500' }}>Contests Given</h4>
                                    <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0', color: 'var(--text)' }}>{upsolveStats.contestGiven}</p>
                                </div>
                                <div style={{ 
                                    padding: '1.5rem', 
                                    textAlign: 'center', 
                                    background: 'var(--bg-panel)',
                                    border: '1px solid var(--success-soft)',
                                    borderRadius: '12px',
                                    backdropFilter: 'blur(20px)',
                                    boxShadow: '0 8px 25px var(--success-soft)'
                                }}>
                                    <h4 style={{ fontSize: '0.9rem', color: 'var(--muted)', margin: '0 0 0.5rem 0', fontWeight: '500' }}>Upsolve Done</h4>
                                    <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0', color: 'var(--success)' }}>{upsolveStats.upsolveDone}</p>
                                </div>
                                <div style={{ 
                                    padding: '1.5rem', 
                                    textAlign: 'center', 
                                    background: 'var(--bg-panel)',
                                    border: '1px solid var(--warning-soft)',
                                    borderRadius: '12px',
                                    backdropFilter: 'blur(20px)',
                                    boxShadow: '0 8px 25px var(--warning-soft)'
                                }}>
                                    <h4 style={{ fontSize: '0.9rem', color: 'var(--muted)', margin: '0 0 0.5rem 0', fontWeight: '500' }}>Upsolve Pending</h4>
                                    <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0', color: 'var(--warning)' }}>{upsolveStats.upsolvePending}</p>
                                </div>
                            </div>

                            {statusMessage && (
                                <div style={{
                                    padding: '1rem',
                                    margin: '1rem 0',
                                    borderRadius: '8px',
                                    background: statusMessage.type === 'error' ? 'var(--danger-soft)' : (statusMessage.type === 'info' ? 'var(--primary-soft)' : 'var(--success-soft)'),
                                    border: statusMessage.type === 'error' ? '1px solid var(--danger-soft)' : (statusMessage.type === 'info' ? '1px solid var(--border-strong)' : '1px solid var(--success-soft)'),
                                    color: statusMessage.type === 'error' ? 'var(--danger)' : (statusMessage.type === 'info' ? 'var(--info)' : 'var(--success)'),
                                    fontSize: '0.9rem',
                                    backdropFilter: 'blur(10px)'
                                }}>
                                    {statusMessage.text}
                                </div>
                            )}

                            {upsolveQueue.length === 0 ? (
                                <div style={{ 
                                    textAlign: 'center', 
                                    padding: '3rem', 
                                    background: 'var(--bg-panel)', 
                                    borderRadius: '16px',
                                    border: '1px solid var(--primary-soft)',
                                    backdropFilter: 'blur(20px)'
                                }}>
                                    <h3 style={{ color: 'var(--text)', fontSize: '1.5rem', margin: '0 0 1rem 0' }}>All caught up!</h3>
                                    <p style={{ color: 'var(--muted)', margin: 0 }}>No pending problems in your queue. Click "Fetch Current Status" to sync with Codeforces.</p>
                                </div>
                            ) : (
                                <div>
                                    {upsolveQueue.map((item, index) => (
                                        <div key={item._id} style={{ 
                                            background: 'var(--bg-panel)',
                                            border: '1px solid var(--border-strong)',
                                            borderLeft: '4px solid var(--primary)',
                                            borderRadius: '12px',
                                            padding: '1.5rem',
                                            marginBottom: '1rem',
                                            backdropFilter: 'blur(20px)',
                                            boxShadow: '0 4px 15px var(--shadow-color)',
                                            transition: 'all 0.3s ease'
                                        }}>
                                            <div>
                                                <h3 style={{ margin: '0 0 1rem 0', color: 'var(--text)', fontSize: '1.2rem' }}>
                                                    <a
                                                        href={item.link}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        style={{ color: 'var(--text)', textDecoration: 'none', transition: 'color 0.3s ease' }}
                                                        onMouseEnter={(e) => e.target.style.color = 'var(--primary)'}
                                                        onMouseLeave={(e) => e.target.style.color = 'var(--text)'}
                                                    >
                                                        #{index + 1} - {item.contestName} - {item.problemIndex}
                                                    </a>
                                                </h3>
                                            </div>

                                            {item.problemDetails && (
                                                <div style={{ marginTop: '1rem' }}>
                                                    <p style={{ margin: '0.5rem 0', color: 'var(--text)' }}><strong>Name:</strong> <span style={{ color: 'var(--muted)' }}>{item.problemDetails.name}</span></p>
                                                    <p style={{ margin: '0.5rem 0', color: 'var(--text)' }}><strong>Rating:</strong> <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{item.problemDetails.rating}</span></p>
                                                    <p style={{ margin: '0.5rem 0', color: 'var(--text)' }}><strong>Tags:</strong> <span style={{ color: 'var(--muted)' }}>{item.problemDetails.tags.join(', ') || 'None'}</span></p>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'groups' && (
                        <div style={{
                            background: 'var(--grad-page)',
                            borderRadius: '20px',
                            padding: '2rem',
                            position: 'relative',
                            overflow: 'hidden',
                            border: '1px solid var(--primary-soft)',
                            boxShadow: '0 20px 40px var(--shadow-color)'
                        }}>
                            {/* Background Elements - Gray theme only */}
                            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.15 }}>
                                <div style={{ position: 'absolute', width: '400px', height: '400px', background: 'radial-gradient(circle, var(--muted) 0%, transparent 70%)', borderRadius: '50%', top: '5%', left: '5%' }}></div>
                                <div style={{ position: 'absolute', width: '250px', height: '250px', background: 'radial-gradient(circle, var(--muted) 0%, transparent 70%)', borderRadius: '50%', top: '50%', right: '10%' }}></div>
                                <div style={{ position: 'absolute', width: '180px', height: '180px', background: 'radial-gradient(circle, var(--muted) 0%, transparent 70%)', borderRadius: '50%', bottom: '15%', left: '15%' }}></div>
                                <div style={{ position: 'absolute', width: '320px', height: '320px', background: 'radial-gradient(circle, var(--muted) 0%, transparent 70%)', borderRadius: '50%', top: '30%', left: '60%' }}></div>
                            </div>
                            
                            {/* Pulsing Dots - Gray only */}
                            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.3 }}>
                                <div style={{ position: 'absolute', width: '12px', height: '12px', background: 'var(--muted)', borderRadius: '50%', top: '15%', left: '40%' }}></div>
                                <div style={{ position: 'absolute', width: '8px', height: '8px', background: 'var(--muted)', borderRadius: '50%', top: '55%', left: '85%' }}></div>
                                <div style={{ position: 'absolute', width: '10px', height: '10px', background: 'var(--muted)', borderRadius: '50%', top: '75%', left: '65%' }}></div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', position: 'relative', zIndex: 1 }}>
                                <h2 style={{ 
                                    color: 'var(--text)',
                                    fontSize: '2.5rem',
                                    fontWeight: '900',
                                    margin: 0
                                }}>Collaborative Groups</h2>
                                <span style={{ 
                                    background: studentGroups.length > 0 ? 'var(--border-strong)' : 'var(--danger-soft)', 
                                    color: studentGroups.length > 0 ? 'var(--muted)' : 'var(--danger)', 
                                    padding: '0.5rem 1rem', 
                                    fontWeight: '700',
                                    borderRadius: '8px',
                                    border: studentGroups.length > 0 ? '1px solid var(--border-strong)' : '1px solid var(--danger-soft)',
                                    backdropFilter: 'blur(10px)'
                                }}>
                                    {studentGroups.length} {studentGroups.length === 1 ? 'Group' : 'Groups'} assigned
                                </span>
                            </div>
                            <p style={{ color: 'var(--muted)', marginBottom: '20px', position: 'relative', zIndex: 1 }}>Problems assigned to you across all your collaborative groups.</p>

                            {studentGroups.length === 0 ? (
                                <div style={{ 
                                    textAlign: 'center', 
                                    padding: '3rem', 
                                    background: 'var(--bg-panel)', 
                                    borderRadius: '16px',
                                    border: '1px solid var(--primary-soft)',
                                    backdropFilter: 'blur(20px)',
                                    position: 'relative',
                                    zIndex: 1
                                }}>
                                    <h3 style={{ color: 'var(--text)', fontSize: '1.5rem', margin: '0 0 1rem 0' }}>You haven't been added to any group yet.</h3>
                                    <p style={{ color: 'var(--muted)', margin: 0 }}>Ask your mentor to add your email ({user?.email}) to a group.</p>
                                </div>
                            ) : (
                                <div style={{ position: 'relative', zIndex: 1 }}>
                                    {!selectedGroup ? (
                                        <div>
                                            {studentGroups.map(group => (
                                                <div 
                                                    key={group.groupId} 
                                                    style={{ 
                                                        cursor: 'pointer', 
                                                        marginBottom: '1rem', 
                                                        background: 'var(--bg-elevated)',
                                                        border: '1px solid var(--border-strong)',
                                                        borderLeft: '4px solid var(--muted)',
                                                        borderRadius: '12px',
                                                        padding: '1.5rem',
                                                        backdropFilter: 'blur(20px)',
                                                        boxShadow: '0 4px 15px var(--shadow-color)',
                                                        transition: 'all 0.3s ease'
                                                    }}
                                                    onClick={() => setSelectedGroup(group)}
                                                    onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                                                    onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                                                >
                                                    <h3 style={{ margin: 0, color: 'var(--text)', fontSize: '1.2rem' }}>{group.groupName}</h3>
                                                    <p style={{ margin: '0.5rem 0 0 0', color: 'var(--muted)' }}>
                                                        {group.sets.length} problem sets
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    ) : !selectedSet ? (
                                        <div>
                                            <div style={{ marginBottom: '2rem' }}>
                                                <button 
                                                    className="btn btn-secondary btn-sm" 
                                                    onClick={() => setSelectedGroup(null)}
                                                    style={{ marginBottom: '1rem' }}
                                                >
                                                    Back to Groups
                                                </button>
                                                <h3 style={{ color: 'white' }}>Group: {selectedGroup.groupName}</h3>
                                            </div>

                                            {selectedGroup.sets.length === 0 ? (
                                                <p style={{ color: 'var(--muted)', fontStyle: 'italic' }}>No problem sets assigned yet in this group.</p>
                                            ) : (
                                                <div className="sets-list">
                                                    {selectedGroup.sets.map(set => (
                                                        <div 
                                                            key={set.setId} 
                                                            className="queue-item" 
                                                            style={{ cursor: 'pointer', marginBottom: '1rem', borderLeft: '4px solid white' }}
                                                            onClick={() => setSelectedSet(set)}
                                                        >
                                                            <h4 style={{ margin: 0, color: 'white' }}>{set.setName}</h4>
                                                            <p style={{ margin: '0.5rem 0 0 0', color: 'var(--muted)' }}>
                                                                {set.problems.length} problems
                                                            </p>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div>
                                            <div style={{ marginBottom: '2rem' }}>
                                                <button 
                                                    className="btn btn-secondary btn-sm" 
                                                    onClick={() => setSelectedSet(null)}
                                                    style={{ marginBottom: '1rem' }}
                                                >
                                                    Back to Sets
                                                </button>
                                                <h4 style={{ color: 'white' }}>{selectedSet.setName}</h4>
                                            </div>

                                            <div style={{ 
                                                background: 'var(--glass)',
                                                border: '1px solid var(--glass-strong)',
                                                borderRadius: '8px',
                                                backdropFilter: 'blur(10px)',
                                                overflow: 'hidden'
                                            }}>
                                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                                    <thead>
                                                        <tr style={{ background: 'var(--bg-elevated)' }}>
                                                            <th style={{ padding: '1rem', textAlign: 'left', color: 'white', borderBottom: '1px solid var(--glass-strong)' }}>Problem</th>
                                                            <th style={{ padding: '1rem', textAlign: 'center', color: 'white', borderBottom: '1px solid var(--glass-strong)' }}>Platform</th>
                                                            <th style={{ padding: '1rem', textAlign: 'center', color: 'white', borderBottom: '1px solid var(--glass-strong)' }}>Status</th>
                                                            <th style={{ padding: '1rem', textAlign: 'center', color: 'white', borderBottom: '1px solid var(--glass-strong)' }}>Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {selectedSet.problems.map(problem => (
                                                            <tr key={problem._id} style={{ borderBottom: '1px solid var(--glass)' }}>
                                                                <td style={{ padding: '1rem', color: 'white' }}>
                                                                    <div>
                                                                        <div style={{ fontWeight: 'bold' }}>{problem.title}</div>
                                                                        {problem.status === 'Solved' && (
                                                                            <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: '5px' }}>
                                                                                Time: {problem.timeTaken} | {new Date(problem.solvedAt).toLocaleDateString()}
                                                                                {problem.learnings && <div style={{ color: 'var(--text-2)' }}>Learnings: {problem.learnings}</div>}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </td>
                                                                <td style={{ padding: '1rem', textAlign: 'center', color: 'var(--warning)', fontWeight: 'bold' }}>{problem.platform}</td>
                                                                <td style={{ padding: '1rem', textAlign: 'center' }}>
                                                                    {problem.status === 'Solved' ? (
                                                                        <span className="status-badge solved" style={{ color: 'var(--success)', fontWeight: 'bold' }}>Solved</span>
                                                                    ) : (
                                                                        <span style={{ color: 'var(--warning)', fontWeight: 'bold' }}>Pending</span>
                                                                    )}
                                                                </td>
                                                                <td style={{ padding: '1rem', textAlign: 'center' }}>
                                                                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                                                                        <a href={problem.link} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm">View</a>
                                                                        {problem.status !== 'Solved' && (
                                                                            <button className="btn btn-primary btn-sm" onClick={() => setSolveModal({ show: true, problem, timeTaken: '<20min', learnings: '' })}>
                                                                                Mark Solved
                                                                            </button>
                                                                        )}
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'contests' && (
                        <div style={{
                            background: 'var(--grad-page)',
                            borderRadius: '20px',
                            padding: '2rem',
                            position: 'relative',
                            overflow: 'hidden',
                            border: '1px solid var(--primary-soft)',
                            boxShadow: '0 20px 40px var(--shadow-color)'
                        }}>
                            {/* Background Elements - Blue theme */}
                            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.15 }}>
                                <div style={{ position: 'absolute', width: '400px', height: '400px', background: 'radial-gradient(circle, var(--info) 0%, transparent 70%)', borderRadius: '50%', top: '5%', left: '5%' }}></div>
                                <div style={{ position: 'absolute', width: '250px', height: '250px', background: 'radial-gradient(circle, var(--info) 0%, transparent 70%)', borderRadius: '50%', top: '50%', right: '10%' }}></div>
                                <div style={{ position: 'absolute', width: '180px', height: '180px', background: 'radial-gradient(circle, var(--info) 0%, transparent 70%)', borderRadius: '50%', bottom: '15%', left: '15%' }}></div>
                                <div style={{ position: 'absolute', width: '320px', height: '320px', background: 'radial-gradient(circle, var(--info) 0%, transparent 70%)', borderRadius: '50%', top: '30%', left: '60%' }}></div>
                            </div>
                            
                            {/* Pulsing Dots - Blue */}
                            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.3 }}>
                                <div style={{ position: 'absolute', width: '12px', height: '12px', background: 'var(--info)', borderRadius: '50%', top: '15%', left: '40%' }}></div>
                                <div style={{ position: 'absolute', width: '8px', height: '8px', background: 'var(--info)', borderRadius: '50%', top: '55%', left: '85%' }}></div>
                                <div style={{ position: 'absolute', width: '10px', height: '10px', background: 'var(--info)', borderRadius: '50%', top: '75%', left: '65%' }}></div>
                            </div>
                            {!selectedContest ? (
                                <div style={{ position: 'relative', zIndex: 1 }}>
                                    <h2 style={{ 
                                        color: 'var(--text)',
                                        fontSize: '2.5rem',
                                        fontWeight: '900',
                                        margin: '0 0 20px 0'
                                    }}>Contests</h2>
                                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '20px' }}>
                                        {['Upcomming', 'current', 'past'].map(tab => (
                                            <button
                                                key={tab}
                                                onClick={() => setContestTab(tab)}
                                                style={{
                                                    background: contestTab === tab ? 'var(--info-soft)' : 'var(--glass)',
                                                    color: contestTab === tab ? 'var(--info)' : 'var(--text)',
                                                    border: contestTab === tab ? '1px solid var(--info-soft)' : '1px solid var(--glass-strong)',
                                                    padding: '0.75rem 1.5rem',
                                                    borderRadius: '8px',
                                                    cursor: 'pointer',
                                                    textTransform: 'capitalize',
                                                    fontWeight: contestTab === tab ? '700' : '500',
                                                    backdropFilter: 'blur(10px)',
                                                    transition: 'all 0.3s ease'
                                                }}
                                            >
                                                {tab}
                                            </button>
                                        ))}
                                    </div>
                                    {globalContests.filter(contest => {
                                        const now = new Date();
                                        const start = new Date(contest.startTime);
                                        const end = new Date(contest.endTime);
                                        if (contestTab === '') return start > now;
                                        if (contestTab === 'current') return start <= now && end >= now;
                                        if (contestTab === 'past') return end < now;
                                        return false;
                                    }).length === 0 ? (
                                        <div style={{ 
                                            textAlign: 'center', 
                                            padding: '3rem', 
                                            background: 'var(--bg-panel)', 
                                            borderRadius: '16px',
                                            border: '1px solid var(--info-soft)',
                                            backdropFilter: 'blur(20px)'
                                        }}>
                                            <h3 style={{ color: 'var(--text)', fontSize: '1.5rem', margin: '0 0 1rem 0' }}>No {contestTab} contests</h3>
                                            <p style={{ color: 'var(--muted)', margin: 0 }}>Check back later for new contests.</p>
                                        </div>
                                    ) : (
                                        <div>
                                            {globalContests.filter(contest => {
                                                const now = new Date();
                                                const start = new Date(contest.startTime);
                                                const end = new Date(contest.endTime);
                                                if (contestTab === '') return start > now;
                                                if (contestTab === 'current') return start <= now && end >= now;
                                                if (contestTab === 'past') return end < now;
                                                return false;
                                            }).map(contest => (
                                                <div key={contest._id} style={{ 
                                                    background: 'var(--bg-elevated)',
                                                    border: '1px solid var(--info-soft)',
                                                    borderLeft: '4px solid var(--info)',
                                                    borderRadius: '12px',
                                                    padding: '1.5rem',
                                                    marginBottom: '1rem',
                                                    backdropFilter: 'blur(20px)',
                                                    boxShadow: '0 4px 15px var(--shadow-color)',
                                                    transition: 'all 0.3s ease'
                                                }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                        <div style={{ flex: 1 }}>
                                                            <h3 style={{ margin: 0, color: 'var(--text)', fontSize: '1.2rem' }}>{contest.title}</h3>
                                                            <p style={{ margin: '0.5rem 0', color: 'var(--muted)' }}>{contest.description}</p>
                                                            <div style={{ display: 'flex', gap: '2rem', marginTop: '1rem', fontSize: '0.9rem', color: 'var(--muted)' }}>
                                                                <span>Start: {new Date(contest.startTime).toLocaleString()}</span>
                                                                <span>End: {new Date(contest.endTime).toLocaleString()}</span>
                                                                <span>{contest.problems.length} problems</span>
                                                            </div>
                                                        </div>
                                                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                                            <button 
                                                                className="btn btn-primary btn-sm"
                                                                onClick={() => {
                                                                    setSelectedContest(contest);
                                                                    const now = new Date();
                                                                    const start = new Date(contest.startTime);
                                                                    const end = new Date(contest.endTime);
                                                                    if (start <= now && end >= now) {
                                                                        fetchLeaderboard(contest._id);
                                                                    }
                                                                }}
                                                            >
                                                                View
                                                            </button>
                                                            {contestTab === '' && (
                                                                <button 
                                                                    className="btn btn-secondary btn-sm"
                                                                    onClick={() => handleRegisterContest(contest._id)}
                                                                    disabled={contest.registeredStudents?.some(student => student._id === user._id)}
                                                                >
                                                                    {contest.registeredStudents?.some(student => student._id === user._id) ? 'Registered' : 'Register'}
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div>
                                    <button 
                                        className="btn btn-secondary btn-sm" 
                                        onClick={() => setSelectedContest(null)}
                                        style={{ marginBottom: '1rem' }}
                                    >
                                        Back to Contests
                                    </button>
                                    <h2 style={{ color: 'white', marginBottom: '1rem' }}>{selectedContest.title}</h2>
                                    <p style={{ color: 'var(--muted)', marginBottom: '1rem' }}>{selectedContest.description}</p>
                                    <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem', fontSize: '0.9rem', color: 'var(--muted)' }}>
                                        <span>Start: {new Date(selectedContest.startTime).toLocaleString()}</span>
                                        <span>End: {new Date(selectedContest.endTime).toLocaleString()}</span>
                                    </div>
                                    
                                    {new Date(selectedContest.startTime) > new Date() ? (
                                        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--muted)' }}>
                                            Contest will be available at start time
                                        </div>
                                    ) : (
                                        <div>
                                            <h3 style={{ color: 'white', marginBottom: '1rem' }}>Problems</h3>
                                            <div style={{ 
                                                background: 'var(--glass)',
                                                border: '1px solid var(--glass-strong)',
                                                borderRadius: '8px',
                                                backdropFilter: 'blur(10px)',
                                                overflow: 'hidden'
                                            }}>
                                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                                    <thead>
                                                        <tr style={{ background: 'var(--bg-elevated)' }}>
                                                            <th style={{ padding: '1rem', textAlign: 'left', color: 'white', borderBottom: '1px solid var(--glass-strong)' }}>Order</th>
                                                            <th style={{ padding: '1rem', textAlign: 'left', color: 'white', borderBottom: '1px solid var(--glass-strong)' }}>Title</th>
                                                            <th style={{ padding: '1rem', textAlign: 'center', color: 'white', borderBottom: '1px solid var(--glass-strong)' }}>Platform</th>
                                                            <th style={{ padding: '1rem', textAlign: 'center', color: 'white', borderBottom: '1px solid var(--glass-strong)' }}>Action</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {selectedContest.problems.map((problem, index) => (
                                                            <tr key={problem._id} style={{ borderBottom: '1px solid var(--glass)' }}>
                                                                <td style={{ padding: '1rem', color: 'white', fontWeight: 'bold' }}>{index + 1}</td>
                                                                <td style={{ padding: '1rem', color: 'white' }}>{problem.title}</td>
                                                                <td style={{ padding: '1rem', textAlign: 'center', color: 'var(--warning)', fontWeight: 'bold' }}>{problem.platform}</td>
                                                                <td style={{ padding: '1rem', textAlign: 'center' }}>
                                                                    <a href={problem.link} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm">
                                                                        Open Problem
                                                                    </a>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                            
                                            {new Date(selectedContest.startTime) <= new Date() && new Date(selectedContest.endTime) >= new Date() && (
                                                <div style={{ marginTop: '2rem' }}>
                                                    <h3 style={{ color: 'white', marginBottom: '1rem' }}>Live Leaderboard</h3>
                                                    <div style={{ 
                                                        background: 'var(--glass)',
                                                        border: '1px solid var(--glass-strong)',
                                                        borderRadius: '8px',
                                                        backdropFilter: 'blur(10px)',
                                                        overflow: 'hidden'
                                                    }}>
                                                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                                            <thead>
                                                                <tr style={{ background: 'var(--bg-elevated)' }}>
                                                                    <th style={{ padding: '1rem', textAlign: 'center', color: 'white', borderBottom: '1px solid var(--glass-strong)' }}>Rank</th>
                                                                    <th style={{ padding: '1rem', textAlign: 'left', color: 'white', borderBottom: '1px solid var(--glass-strong)' }}>Name</th>
                                                                    <th style={{ padding: '1rem', textAlign: 'center', color: 'white', borderBottom: '1px solid var(--glass-strong)' }}>Solved</th>
                                                                    <th style={{ padding: '1rem', textAlign: 'center', color: 'white', borderBottom: '1px solid var(--glass-strong)' }}>Score</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {leaderboard.map((participant, index) => (
                                                                    <tr key={participant.email} style={{ borderBottom: '1px solid var(--glass)' }}>
                                                                        <td style={{ padding: '1rem', textAlign: 'center', color: 'white', fontWeight: 'bold' }}>{index + 1}</td>
                                                                        <td style={{ padding: '1rem', color: 'white' }}>{participant.name}</td>
                                                                        <td style={{ padding: '1rem', textAlign: 'center', color: 'var(--success)', fontWeight: 'bold' }}>{participant.solved}</td>
                                                                        <td style={{ padding: '1rem', textAlign: 'center', color: 'var(--info)', fontWeight: 'bold' }}>{participant.score}</td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'analytics' && (
                        <CodeforcesDashboard
                            cfLoading={cfLoading}
                            cfError={cfError}
                            userData={userData}
                            ratingHistory={ratingHistory}
                            submissions={submissions}
                            onFetchStats={fetchCfStats}
                        />
                    )}
                </main>
            </div>

            {/* Solve Modal */}
            {solveModal.show && (
                <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'var(--shadow-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div className="modal-content animate-pop-in" style={{ background: 'var(--bg-elevated)', padding: '30px', borderRadius: '15px', width: '90%', maxWidth: '500px', border: '1px solid var(--border-strong)' }}>
                        <h3 style={{ color: 'white' }}>Mark as Solved: {solveModal.problem?.title}</h3>
                        <form onSubmit={handleSolveSubmit} className="form" style={{ marginTop: '20px' }}>
                            <div className="form-group">
                                <label style={{ color: 'var(--text-2)' }}>How long did it take?</label>
                                <select
                                    className="form-control"
                                    value={solveModal.timeTaken}
                                    onChange={e => setSolveModal({ ...solveModal, timeTaken: e.target.value })}
                                    style={{ width: '100%', padding: '10px', background: 'var(--bg-elevated)', color: 'var(--text)', border: '1px solid var(--border-strong)', borderRadius: '5px' }}
                                >
                                    <option value="<20min">Less than 20 minutes</option>
                                    <option value="<30min">Less than 30 minutes</option>
                                    <option value="<1hour">Less than 1 hour</option>
                                    <option value="<3hour">Less than 3 hours</option>
                                </select>
                            </div>
                            <div className="form-group" style={{ marginTop: '20px' }}>
                                <label style={{ color: 'var(--text-2)' }}>Short Learning/Note (Optional)</label>
                                <textarea
                                    className="form-control"
                                    value={solveModal.learnings}
                                    onChange={e => setSolveModal({ ...solveModal, learnings: e.target.value })}
                                    placeholder="What did you learn from this problem?"
                                    rows={4}
                                    style={{ width: '100%', padding: '10px', background: 'var(--bg-elevated)', color: 'var(--text)', border: '1px solid var(--border-strong)', borderRadius: '5px' }}
                                />
                                <small style={{ color: 'var(--muted)' }}>Max 200 characters recommended.</small>
                            </div>
                            <div style={{ display: 'flex', gap: '10px', marginTop: '30px' }}>
                                <button type="submit" className="btn btn-primary" style={{ flex: 1, background: 'white', color: 'var(--bg-deep)', fontWeight: 'bold' }}>Submit Solve</button>
                                <button type="button" className="btn btn-secondary" onClick={() => setSolveModal({ ...solveModal, show: false })} style={{ flex: 1 }}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentDashboard;
