import React, { useState } from 'react';
import '../App.css';

const MainHome = () => {
    const [activeTab, setActiveTab] = useState('home');

    const renderContent = () => {
        switch (activeTab) {
            case 'home':
                return (
                    <div style={{ background: 'linear-gradient(135deg, #111111 0%, #0D1A33 100%)', minHeight: '90vh', position: 'relative', overflow: 'hidden' }}>
                        {/* Animated Background Elements */}
                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.15 }}>
                            <div style={{ position: 'absolute', width: '400px', height: '400px', background: 'radial-gradient(circle, #1A73E8 0%, transparent 70%)', borderRadius: '50%', top: '5%', left: '5%', animation: 'float 6s ease-in-out infinite' }}></div>
                            <div style={{ position: 'absolute', width: '250px', height: '250px', background: 'radial-gradient(circle, #28A8E0 0%, transparent 70%)', borderRadius: '50%', top: '50%', right: '10%', animation: 'float 8s ease-in-out infinite reverse' }}></div>
                            <div style={{ position: 'absolute', width: '180px', height: '180px', background: 'radial-gradient(circle, #1A73E8 0%, transparent 70%)', borderRadius: '50%', bottom: '15%', left: '15%', animation: 'float 7s ease-in-out infinite' }}></div>
                            <div style={{ position: 'absolute', width: '320px', height: '320px', background: 'radial-gradient(circle, #28A8E0 0%, transparent 70%)', borderRadius: '50%', top: '30%', left: '60%', animation: 'float 9s ease-in-out infinite reverse' }}></div>
                        </div>

                        
                        {/* Pulsing Dots */}
                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.3 }}>
                            <div style={{ position: 'absolute', width: '12px', height: '12px', background: '#1A73E8', borderRadius: '50%', top: '15%', left: '40%', animation: 'pulse 3s ease-in-out infinite' }}></div>
                            <div style={{ position: 'absolute', width: '8px', height: '8px', background: '#28A8E0', borderRadius: '50%', top: '55%', left: '85%', animation: 'pulse 4s ease-in-out infinite reverse' }}></div>
                            <div style={{ position: 'absolute', width: '10px', height: '10px', background: '#1A73E8', borderRadius: '50%', top: '75%', left: '65%', animation: 'pulse 3.5s ease-in-out infinite' }}></div>
                        </div>
                        
                        {/* Hero Section */}
                        <div style={{ textAlign: 'center', padding: '4rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '90vh', flexDirection: 'column', position: 'relative', zIndex: 1 }}>
                            <div style={{ marginBottom: '2rem', animation: 'fadeInUp 1s ease-out' }}>
                                <h1 style={{ 
                                    fontSize: '5rem', 
                                    margin: '0 0 1rem 0',
                                    color: '#FFFFFF',
                                    fontWeight: 'bold',
                                    letterSpacing: '3px',
                                    textShadow: '0 4px 20px rgba(26, 115, 232, 0.3)',
                                    background: 'linear-gradient(45deg, #FFFFFF, #1A73E8)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent'
                                }}>Algonauts</h1>
                                <div style={{ width: '100px', height: '4px', background: 'linear-gradient(90deg, #1A73E8, #28A8E0)', margin: '0 auto', borderRadius: '2px' }}></div>
                            </div>
                            
                            <div style={{ marginBottom: '3rem', animation: 'fadeInUp 1s ease-out 0.2s both' }}>
                                <p style={{ fontSize: '1.5rem', color: '#FFFFFF', marginBottom: '1rem', fontWeight: '600', textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>Master Competitive Programming</p>
                                <p style={{ fontSize: '1.1rem', color: '#6B7280', marginBottom: '0', maxWidth: '650px', lineHeight: '1.8', margin: '0 auto' }}>Join our community of competitive programmers and accelerate your journey to mastery with structured guidance, smart problem queues, and expert mentorship.</p>
                            </div>
                            
                            <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', marginBottom: '4rem', animation: 'fadeInUp 1s ease-out 0.4s both' }}>
                                <button onClick={() => setActiveTab('cphelper')} style={{ 
                                    padding: '1.2rem 2.5rem', 
                                    fontSize: '1.1rem', 
                                    background: 'linear-gradient(45deg, #1A73E8, #28A8E0)', 
                                    color: 'white', 
                                    border: 'none', 
                                    borderRadius: '8px', 
                                    fontWeight: 'bold', 
                                    cursor: 'pointer', 
                                    boxShadow: '0 8px 25px rgba(26, 115, 232, 0.4)',
                                    transition: 'all 0.3s ease',
                                    transform: 'translateY(0)'
                                }}>Explore CP Helper</button>
                                <button onClick={() => setActiveTab('about')} style={{ 
                                    padding: '1.2rem 2.5rem', 
                                    fontSize: '1.1rem', 
                                    background: 'rgba(26, 115, 232, 0.1)', 
                                    color: '#1A73E8', 
                                    border: '2px solid #1A73E8', 
                                    borderRadius: '8px', 
                                    fontWeight: 'bold', 
                                    cursor: 'pointer',
                                    backdropFilter: 'blur(10px)',
                                    transition: 'all 0.3s ease',
                                    transform: 'translateY(0)'
                                }}>Learn More</button>
                            </div>
                            
                            {/* Feature Cards */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', maxWidth: '1000px', width: '100%', animation: 'fadeInUp 1s ease-out 0.6s both' }}>
                                <div style={{ background: 'rgba(26, 35, 50, 0.8)', padding: '2rem', borderRadius: '12px', border: '1px solid rgba(26, 115, 232, 0.3)', backdropFilter: 'blur(10px)', textAlign: 'left', transition: 'transform 0.3s ease' }}>
                                    <h3 style={{ color: '#FFFFFF', marginBottom: '0.5rem', fontSize: '1.3rem' }}>Smart Queue System</h3>
                                    <p style={{ color: '#6B7280', lineHeight: '1.6', margin: 0 }}>Intelligent problem recommendation based on your skill level and progress</p>
                                </div>
                                <div style={{ background: 'rgba(26, 35, 50, 0.8)', padding: '2rem', borderRadius: '12px', border: '1px solid rgba(26, 115, 232, 0.3)', backdropFilter: 'blur(10px)', textAlign: 'left', transition: 'transform 0.3s ease' }}>
                                    <h3 style={{ color: '#FFFFFF', marginBottom: '0.5rem', fontSize: '1.3rem' }}>Progress Tracking</h3>
                                    <p style={{ color: '#6B7280', lineHeight: '1.6', margin: 0 }}>Real-time analytics and performance insights to track your growth</p>
                                </div>
                                <div style={{ background: 'rgba(26, 35, 50, 0.8)', padding: '2rem', borderRadius: '12px', border: '1px solid rgba(26, 115, 232, 0.3)', backdropFilter: 'blur(10px)', textAlign: 'left', transition: 'transform 0.3s ease' }}>
                                    <h3 style={{ color: '#FFFFFF', marginBottom: '0.5rem', fontSize: '1.3rem' }}>Codeforces Integration</h3>
                                    <p style={{ color: '#6B7280', lineHeight: '1.6', margin: 0 }}>Seamless sync with Codeforces for automatic problem verification</p>
                                </div>
                            </div>
                        </div>
                        
                        <style jsx>{`
                            @keyframes fadeInUp {
                                from {
                                    opacity: 0;
                                    transform: translateY(30px);
                                }
                                to {
                                    opacity: 1;
                                    transform: translateY(0);
                                }
                            }
                            
                            @keyframes float {
                                0%, 100% {
                                    transform: translateY(0px) translateX(0px) rotate(0deg);
                                }
                                25% {
                                    transform: translateY(-30px) translateX(20px) rotate(90deg);
                                }
                                50% {
                                    transform: translateY(-10px) translateX(-15px) rotate(180deg);
                                }
                                75% {
                                    transform: translateY(20px) translateX(10px) rotate(270deg);
                                }
                            }
                            
                            @keyframes pulse {
                                0%, 100% {
                                    transform: scale(1);
                                    opacity: 0.3;
                                }
                                50% {
                                    transform: scale(1.5);
                                    opacity: 0.8;
                                }
                            }
                            
                            button:hover {
                                transform: translateY(-2px) !important;
                                box-shadow: 0 12px 35px rgba(26, 115, 232, 0.5) !important;
                            }
                            
                            div:hover {
                                transform: translateY(-5px);
                            }
                        `}</style>
                    </div>
                );
            case 'about':
                return (
                    <div style={{ padding: '3rem 2rem', maxWidth: '900px', margin: '0 auto', background: '#111111' }}>
                        <h2 style={{ fontSize: '2.5rem', marginBottom: '2rem', color: '#FFFFFF' }}>About Algonauts</h2>
                        <div style={{ display: 'grid', gap: '2rem' }}>
                            <div style={{ background: '#1A2332', padding: '2rem', borderRadius: '8px', border: '1px solid #28A8E0' }}>
                                <h3 style={{ color: '#FFFFFF', marginBottom: '1rem' }}>What is Algonauts?</h3>
                                <p style={{ lineHeight: '1.8', color: '#6B7280' }}>Algonauts is a competitive programming club dedicated to helping students master algorithmic problem-solving. We provide structured guidance, mentorship, and tools to accelerate your journey in competitive programming.</p>
                            </div>
                            <div style={{ background: '#1A2332', padding: '2rem', borderRadius: '8px', border: '1px solid #28A8E0' }}>
                                <h3 style={{ color: '#FFFFFF', marginBottom: '1rem' }}>Our Mission</h3>
                                <p style={{ lineHeight: '1.8', color: '#6B7280' }}>To empower students with the knowledge, skills, and confidence needed to excel in competitive programming contests and technical interviews.</p>
                            </div>
                            <div style={{ background: '#1A2332', padding: '2rem', borderRadius: '8px', border: '1px solid #28A8E0' }}>
                                <h3 style={{ color: '#FFFFFF', marginBottom: '1rem' }}>Why Join Us?</h3>
                                <ul style={{ lineHeight: '2', color: '#6B7280', paddingLeft: '1.5rem' }}>
                                    <li>Expert mentorship from experienced competitive programmers</li>
                                    <li>Structured problem-solving curriculum</li>
                                    <li>Smart upsolve queue to optimize your learning</li>
                                    <li>Real-time progress tracking and analytics</li>
                                    <li>Community support and collaboration</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                );
            case 'cphelper':
                return (
                    <div style={{ background: 'linear-gradient(135deg, #111111 0%, #0D1A33 100%)', minHeight: '90vh', position: 'relative', overflow: 'hidden' }}>
                        {/* Animated Background Elements */}
                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.15 }}>
                            <div style={{ position: 'absolute', width: '400px', height: '400px', background: 'radial-gradient(circle, #1A73E8 0%, transparent 70%)', borderRadius: '50%', top: '5%', left: '5%', animation: 'float 6s ease-in-out infinite' }}></div>
                            <div style={{ position: 'absolute', width: '250px', height: '250px', background: 'radial-gradient(circle, #28A8E0 0%, transparent 70%)', borderRadius: '50%', top: '50%', right: '10%', animation: 'float 8s ease-in-out infinite reverse' }}></div>
                            <div style={{ position: 'absolute', width: '180px', height: '180px', background: 'radial-gradient(circle, #1A73E8 0%, transparent 70%)', borderRadius: '50%', bottom: '15%', left: '15%', animation: 'float 7s ease-in-out infinite' }}></div>
                            <div style={{ position: 'absolute', width: '320px', height: '320px', background: 'radial-gradient(circle, #28A8E0 0%, transparent 70%)', borderRadius: '50%', top: '30%', left: '60%', animation: 'float 9s ease-in-out infinite reverse' }}></div>
                        </div>
                        
                        {/* Pulsing Dots */}
                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.3 }}>
                            <div style={{ position: 'absolute', width: '12px', height: '12px', background: '#1A73E8', borderRadius: '50%', top: '15%', left: '40%', animation: 'pulse 3s ease-in-out infinite' }}></div>
                            <div style={{ position: 'absolute', width: '8px', height: '8px', background: '#28A8E0', borderRadius: '50%', top: '55%', left: '85%', animation: 'pulse 4s ease-in-out infinite reverse' }}></div>
                            <div style={{ position: 'absolute', width: '10px', height: '10px', background: '#1A73E8', borderRadius: '50%', top: '75%', left: '65%', animation: 'pulse 3.5s ease-in-out infinite' }}></div>
                        </div>
                        
                        {/* Hero Section */}
                        <div style={{ textAlign: 'center', padding: '4rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '90vh', flexDirection: 'column', position: 'relative', zIndex: 1 }}>
                            <div style={{ marginBottom: '2rem', animation: 'fadeInUp 1s ease-out' }}>
                                <h1 style={{ 
                                    fontSize: '4.5rem', 
                                    margin: '0 0 1rem 0',
                                    color: '#FFFFFF',
                                    fontWeight: 'bold',
                                    letterSpacing: '3px',
                                    textShadow: '0 4px 20px rgba(26, 115, 232, 0.3)',
                                    background: 'linear-gradient(45deg, #FFFFFF, #1A73E8)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent'
                                }}>Algonauts CP Helper</h1>
                                <div style={{ width: '120px', height: '4px', background: 'linear-gradient(90deg, #1A73E8, #28A8E0)', margin: '0 auto', borderRadius: '2px' }}></div>
                            </div>
                            
                            <div style={{ marginBottom: '3rem', animation: 'fadeInUp 1s ease-out 0.2s both' }}>
                                <p style={{ fontSize: '1.4rem', color: '#FFFFFF', marginBottom: '1rem', fontWeight: '600', textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>Master Competitive Programming with Structure & Strategy</p>
                                <p style={{ fontSize: '1.1rem', color: '#6B7280', marginBottom: '0', maxWidth: '650px', lineHeight: '1.8', margin: '0 auto' }}>A comprehensive platform for mentors to manage student progress and students to systematically upsolve problems.</p>
                            </div>
                            
                            <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', marginBottom: '4rem', animation: 'fadeInUp 1s ease-out 0.4s both' }}>
                                <a href="/register" style={{ 
                                    padding: '1.2rem 2.5rem', 
                                    fontSize: '1.1rem', 
                                    background: 'linear-gradient(45deg, #1A73E8, #28A8E0)', 
                                    color: 'white', 
                                    border: 'none', 
                                    borderRadius: '8px', 
                                    fontWeight: 'bold', 
                                    cursor: 'pointer', 
                                    boxShadow: '0 8px 25px rgba(26, 115, 232, 0.4)',
                                    transition: 'all 0.3s ease',
                                    transform: 'translateY(0)',
                                    textDecoration: 'none',
                                    display: 'inline-block'
                                }}>Get Started</a>
                                <a href="/login" style={{ 
                                    padding: '1.2rem 2.5rem', 
                                    fontSize: '1.1rem', 
                                    background: 'rgba(26, 115, 232, 0.1)', 
                                    color: '#1A73E8', 
                                    border: '2px solid #1A73E8', 
                                    borderRadius: '8px', 
                                    fontWeight: 'bold', 
                                    cursor: 'pointer',
                                    backdropFilter: 'blur(10px)',
                                    transition: 'all 0.3s ease',
                                    transform: 'translateY(0)',
                                    textDecoration: 'none',
                                    display: 'inline-block'
                                }}>Sign In</a>
                            </div>
                            
                            {/* Feature Cards */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', maxWidth: '1000px', width: '100%', animation: 'fadeInUp 1s ease-out 0.6s both' }}>
                                <div style={{ background: 'rgba(26, 35, 50, 0.8)', padding: '2rem', borderRadius: '12px', border: '1px solid rgba(26, 115, 232, 0.3)', backdropFilter: 'blur(10px)', textAlign: 'left', transition: 'transform 0.3s ease' }}>
                                    <h3 style={{ color: '#FFFFFF', marginBottom: '0.5rem', fontSize: '1.3rem' }}>Smart Queue</h3>
                                    <p style={{ color: '#6B7280', lineHeight: '1.6', margin: 0 }}>Problems organized by priority and difficulty</p>
                                </div>
                                <div style={{ background: 'rgba(26, 35, 50, 0.8)', padding: '2rem', borderRadius: '12px', border: '1px solid rgba(26, 115, 232, 0.3)', backdropFilter: 'blur(10px)', textAlign: 'left', transition: 'transform 0.3s ease' }}>
                                    <h3 style={{ color: '#FFFFFF', marginBottom: '0.5rem', fontSize: '1.3rem' }}>Progress Tracking</h3>
                                    <p style={{ color: '#6B7280', lineHeight: '1.6', margin: 0 }}>Monitor student performance in real-time</p>
                                </div>
                                <div style={{ background: 'rgba(26, 35, 50, 0.8)', padding: '2rem', borderRadius: '12px', border: '1px solid rgba(26, 115, 232, 0.3)', backdropFilter: 'blur(10px)', textAlign: 'left', transition: 'transform 0.3s ease' }}>
                                    <h3 style={{ color: '#FFFFFF', marginBottom: '0.5rem', fontSize: '1.3rem' }}>Codeforces Integration</h3>
                                    <p style={{ color: '#6B7280', lineHeight: '1.6', margin: 0 }}>Seamless integration with Codeforces API</p>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'contact':
                return (
                    <div style={{ padding: '3rem 2rem', maxWidth: '600px', margin: '0 auto', background: '#111111' }}>
                        <h2 style={{ fontSize: '2.5rem', marginBottom: '2rem', color: '#FFFFFF', textAlign: 'center' }}>Get In Touch</h2>
                        <form className="form" style={{ background: '#1A2332', padding: '2rem', borderRadius: '8px', border: '1px solid #28A8E0' }}>
                            <div className="form-group">
                                <label style={{ color: '#FFFFFF' }}>Name</label>
                                <input type="text" placeholder="Your name" style={{ background: '#0D1A33', color: '#FFFFFF', border: '1px solid #28A8E0', padding: '0.7rem', borderRadius: '6px' }} />
                            </div>
                            <div className="form-group">
                                <label style={{ color: '#FFFFFF' }}>Email</label>
                                <input type="email" placeholder="Your email" style={{ background: '#0D1A33', color: '#FFFFFF', border: '1px solid #28A8E0', padding: '0.7rem', borderRadius: '6px' }} />
                            </div>
                            <div className="form-group">
                                <label style={{ color: '#FFFFFF' }}>Subject</label>
                                <input type="text" placeholder="Subject" style={{ background: '#0D1A33', color: '#FFFFFF', border: '1px solid #28A8E0', padding: '0.7rem', borderRadius: '6px' }} />
                            </div>
                            <div className="form-group">
                                <label style={{ color: '#FFFFFF' }}>Message</label>
                                <textarea rows="5" placeholder="Your message" style={{ background: '#0D1A33', color: '#FFFFFF', border: '1px solid #28A8E0', padding: '0.7rem', borderRadius: '6px' }}></textarea>
                            </div>
                            <button type="submit" style={{ marginTop: '1rem', padding: '0.7rem 2rem', fontSize: '1rem', background: '#1A73E8', color: '#FFFFFF', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Send Message</button>
                        </form>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div style={{ minHeight: '100vh', background: '#111111' }}>
            <nav style={{ 
                background: '#0D1A33', 
                borderBottom: '1px solid #E5E7EB', 
                padding: '1rem 2rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <div 
                    onClick={() => setActiveTab('home')}
                    style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#FFFFFF', letterSpacing: '1px', cursor: 'pointer' }}
                >
                    Algonauts
                </div>
                <div style={{ display: 'flex', gap: '2rem' }}>
                    <button 
                        onClick={() => setActiveTab('home')}
                        style={{
                            background: activeTab === 'home' ? '#1A73E8' : 'transparent',
                            color: activeTab === 'home' ? '#FFFFFF' : '#FFFFFF',
                            border: '1px solid rgba(255, 255, 255, 0.3)',
                            padding: '0.5rem 1rem',
                            cursor: 'pointer',
                            borderRadius: '6px',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        Home
                    </button>
                    <button 
                        onClick={() => setActiveTab('about')}
                        style={{
                            background: activeTab === 'about' ? '#1A73E8' : 'transparent',
                            color: activeTab === 'about' ? '#FFFFFF' : '#FFFFFF',
                            border: '1px solid rgba(255, 255, 255, 0.3)',
                            padding: '0.5rem 1rem',
                            cursor: 'pointer',
                            borderRadius: '6px',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        About
                    </button>
                    <button 
                        onClick={() => setActiveTab('cphelper')}
                        style={{
                            background: activeTab === 'cphelper' ? '#1A73E8' : 'transparent',
                            color: activeTab === 'cphelper' ? '#FFFFFF' : '#FFFFFF',
                            border: '1px solid rgba(255, 255, 255, 0.3)',
                            padding: '0.5rem 1rem',
                            cursor: 'pointer',
                            borderRadius: '6px',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        CP Helper
                    </button>
                    <button 
                        onClick={() => setActiveTab('contact')}
                        style={{
                            background: activeTab === 'contact' ? '#1A73E8' : 'transparent',
                            color: activeTab === 'contact' ? '#FFFFFF' : '#FFFFFF',
                            border: '1px solid rgba(255, 255, 255, 0.3)',
                            padding: '0.5rem 1rem',
                            cursor: 'pointer',
                            borderRadius: '6px',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        Contact Us
                    </button>
                </div>
            </nav>
            
            <main>
                {renderContent()}
            </main>
        </div>
    );
};

export default MainHome;
