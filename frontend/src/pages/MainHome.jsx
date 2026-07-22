import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Zap,
    LineChart,
    Plug,
    Target,
    Users,
    CheckCircle2,
    AlertCircle,
    ArrowRight
} from 'lucide-react';
import { contactAPI } from '../utils/api';
import '../App.css';

const TABS = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'cphelper', label: 'CP Helper' },
    { id: 'contact', label: 'Contact' }
];

const HOME_FEATURES = [
    {
        icon: Zap,
        title: 'Smart Queue System',
        body: 'Intelligent problem recommendation based on your skill level and progress.'
    },
    {
        icon: LineChart,
        title: 'Progress Tracking',
        body: 'Real-time analytics and performance insights to track your growth.'
    },
    {
        icon: Plug,
        title: 'Codeforces Integration',
        body: 'Seamless sync with Codeforces for automatic problem verification.'
    }
];

const CP_FEATURES = [
    { icon: Zap, title: 'Smart Queue', body: 'Problems organized by priority and difficulty.' },
    { icon: LineChart, title: 'Progress Tracking', body: 'Monitor student performance in real time.' },
    { icon: Plug, title: 'Codeforces Integration', body: 'Seamless integration with the Codeforces API.' }
];

const WHY_JOIN = [
    'Expert mentorship from experienced competitive programmers',
    'Structured problem-solving curriculum',
    'Smart upsolve queue to optimise your learning',
    'Real-time progress tracking and analytics',
    'Community support and collaboration'
];

const MainHome = () => {
    const [activeTab, setActiveTab] = useState('home');
    const [contactForm, setContactForm] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [contactStatus, setContactStatus] = useState('');

    const handleContactChange = (e) => {
        setContactForm({ ...contactForm, [e.target.name]: e.target.value });
    };

    const handleContactSubmit = async (e) => {
        e.preventDefault();
        setContactStatus('sending');
        try {
            await contactAPI.submit(contactForm);
            setContactStatus('success');
            setContactForm({ name: '', email: '', subject: '', message: '' });
        } catch {
            setContactStatus('error');
        }
    };

    const renderFeatures = (features) => (
        <div className="features">
            {features.map((feature) => {
                const Icon = feature.icon;
                return (
                    <div key={feature.title} className="feature-card">
                        <div className="feature-icon">
                            <Icon size={20} strokeWidth={2} />
                        </div>
                        <h3>{feature.title}</h3>
                        <p>{feature.body}</p>
                    </div>
                );
            })}
        </div>
    );

    const renderContent = () => {
        switch (activeTab) {
            case 'home':
                return (
                    <div className="container animate-fade-in">
                        <section className="hero">
                            <p className="eyebrow">Competitive Programming Club</p>
                            <h1 className="text-gradient">Algonauts</h1>
                            <p className="hero-subtitle">Master Competitive Programming</p>
                            <p className="hero-description">
                                Join our community of competitive programmers and accelerate your
                                journey to mastery with structured guidance, smart problem queues,
                                and expert mentorship.
                            </p>
                            <div className="cta-buttons" style={{ justifyContent: 'center' }}>
                                <button
                                    className="btn btn-primary btn-lg"
                                    onClick={() => setActiveTab('cphelper')}
                                >
                                    Explore CP Helper <ArrowRight size={16} />
                                </button>
                                <button
                                    className="btn btn-secondary btn-lg"
                                    onClick={() => setActiveTab('about')}
                                >
                                    Learn more
                                </button>
                            </div>
                        </section>

                        <section className="section">{renderFeatures(HOME_FEATURES)}</section>
                    </div>
                );

            case 'about':
                return (
                    <div className="container page animate-fade-in">
                        <header style={{ textAlign: 'center', marginBottom: 'var(--sp-10)' }}>
                            <h2 className="section-title">About Algonauts</h2>
                            <p className="subtitle">
                                Empowering the next generation of competitive programmers
                            </p>
                        </header>

                        <div className="stack" style={{ gap: 'var(--sp-5)' }}>
                            <div className="card">
                                <div className="feature-icon">
                                    <Users size={20} strokeWidth={2} />
                                </div>
                                <h3 style={{ marginBottom: 'var(--sp-3)' }}>What is Algonauts?</h3>
                                <p>
                                    Algonauts is a competitive programming club dedicated to helping
                                    students master algorithmic problem-solving. We provide
                                    structured guidance, mentorship, and tools to accelerate your
                                    journey in competitive programming.
                                </p>
                            </div>

                            <div className="grid grid-2">
                                <div className="card">
                                    <div className="feature-icon">
                                        <Target size={20} strokeWidth={2} />
                                    </div>
                                    <h3 style={{ marginBottom: 'var(--sp-3)' }}>Our Mission</h3>
                                    <p>
                                        To empower students with the knowledge, skills, and
                                        confidence needed to excel in competitive programming
                                        contests and technical interviews.
                                    </p>
                                </div>

                                <div className="card">
                                    <div className="feature-icon">
                                        <CheckCircle2 size={20} strokeWidth={2} />
                                    </div>
                                    <h3 style={{ marginBottom: 'var(--sp-3)' }}>Why Join Us?</h3>
                                    <ul className="check-list">
                                        {WHY_JOIN.map((item) => (
                                            <li key={item}>{item}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            <div className="card cta-panel">
                                <div>
                                    <h3 style={{ marginBottom: 'var(--sp-2)' }}>
                                        Ready to start your journey?
                                    </h3>
                                    <p className="muted">
                                        Join students already improving their competitive
                                        programming skills.
                                    </p>
                                </div>
                                <div className="cta-buttons">
                                    <Link to="/register" className="btn btn-primary">
                                        Join now
                                    </Link>
                                    <button
                                        className="btn btn-secondary"
                                        onClick={() => setActiveTab('contact')}
                                    >
                                        Contact us
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 'cphelper':
                return (
                    <div className="container animate-fade-in">
                        <section className="hero">
                            <p className="eyebrow">The Platform</p>
                            <h1 className="text-gradient">Algonauts CP Helper</h1>
                            <p className="hero-subtitle">
                                Master competitive programming with structure &amp; strategy
                            </p>
                            <p className="hero-description">
                                A comprehensive platform for mentors to manage student progress and
                                for students to systematically upsolve problems.
                            </p>
                            <div className="cta-buttons" style={{ justifyContent: 'center' }}>
                                <Link to="/register" className="btn btn-primary btn-lg">
                                    Get started <ArrowRight size={16} />
                                </Link>
                                <Link to="/login" className="btn btn-secondary btn-lg">
                                    Sign in
                                </Link>
                                <Link to="/codeforces-stats" className="btn btn-ghost btn-lg">
                                    Try the analyzer
                                </Link>
                            </div>
                        </section>

                        <section className="section">{renderFeatures(CP_FEATURES)}</section>
                    </div>
                );

            case 'contact':
                return (
                    <div className="container page animate-fade-in" style={{ maxWidth: '760px' }}>
                        <header style={{ textAlign: 'center', marginBottom: 'var(--sp-10)' }}>
                            <h2 className="section-title">Get in touch</h2>
                            <p className="subtitle">Have questions? We&apos;d love to hear from you.</p>
                        </header>

                        <form onSubmit={handleContactSubmit} className="card form">
                            <div className="grid grid-2" style={{ gap: 'var(--sp-5)' }}>
                                <div className="form-group">
                                    <label className="label" htmlFor="c-name">Name</label>
                                    <input
                                        id="c-name"
                                        className="form-control"
                                        type="text"
                                        name="name"
                                        value={contactForm.name}
                                        onChange={handleContactChange}
                                        placeholder="Your name"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="label" htmlFor="c-email">Email</label>
                                    <input
                                        id="c-email"
                                        className="form-control"
                                        type="email"
                                        name="email"
                                        value={contactForm.email}
                                        onChange={handleContactChange}
                                        placeholder="you@example.com"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="label" htmlFor="c-subject">Subject</label>
                                <input
                                    id="c-subject"
                                    className="form-control"
                                    type="text"
                                    name="subject"
                                    value={contactForm.subject}
                                    onChange={handleContactChange}
                                    placeholder="What's this about?"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="label" htmlFor="c-message">Message</label>
                                <textarea
                                    id="c-message"
                                    className="form-control"
                                    rows="6"
                                    name="message"
                                    value={contactForm.message}
                                    onChange={handleContactChange}
                                    placeholder="Tell us more about your inquiry…"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary btn-lg"
                                disabled={contactStatus === 'sending'}
                            >
                                {contactStatus === 'sending' ? 'Sending…' : 'Send message'}
                            </button>

                            {contactStatus === 'success' && (
                                <div className="alert alert-success row">
                                    <CheckCircle2 size={16} />
                                    Message sent. We&apos;ll get back to you soon.
                                </div>
                            )}
                            {contactStatus === 'error' && (
                                <div className="alert alert-error row">
                                    <AlertCircle size={16} />
                                    Failed to send message. Please try again.
                                </div>
                            )}
                        </form>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="app">
            <nav className="nav">
                <div className="nav-inner">
                    <button className="brand" onClick={() => setActiveTab('home')}>
                        <span className="brand-mark">A</span>
                        <span>Algonauts</span>
                    </button>

                    <div className="nav-links">
                        {TABS.map((t) => (
                            <button
                                key={t.id}
                                className={`nav-link${activeTab === t.id ? ' active' : ''}`}
                                onClick={() => setActiveTab(t.id)}
                            >
                                {t.label}
                            </button>
                        ))}
                    </div>

                    <div className="nav-user">
                        <Link to="/login" className="btn btn-ghost btn-sm">Sign in</Link>
                        <Link to="/register" className="btn btn-primary btn-sm">Get started</Link>
                    </div>
                </div>
            </nav>

            <main>{renderContent()}</main>

            <footer className="footer">
                <div className="container row-between wrap">
                    <span className="faint">
                        Algonauts CP Helper — competitive programming practice management
                    </span>
                    <span className="faint mono">Powered by the Codeforces API</span>
                </div>
            </footer>
        </div>
    );
};

export default MainHome;
