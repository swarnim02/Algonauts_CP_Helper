import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import '../App.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await login(email, password);

        if (result.success) {
            navigate('/dashboard');
        } else {
            setError(result.error);
        }

        setLoading(false);
    };

    return (
        <div className="auth-container">
            <Link to="/" className="btn btn-ghost btn-sm auth-back">
                ← Back to home
            </Link>

            <div className="auth-card animate-fade-in">
                <div className="auth-header">
                    <div className="brand" style={{ justifyContent: 'center', marginBottom: 'var(--sp-5)' }}>
                        <span className="brand-mark">A</span>
                        <span>Algonauts</span>
                    </div>
                    <h1>Welcome back</h1>
                    <p>Sign in to continue to your dashboard</p>
                </div>

                {error && <div className="error-message" role="alert">{error}</div>}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label className="label" htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            className="form-control"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            autoComplete="email"
                            placeholder="you@example.com"
                        />
                    </div>

                    <div className="form-group">
                        <label className="label" htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            autoComplete="current-password"
                            placeholder="Enter your password"
                        />
                    </div>

                    <button type="submit" className="btn btn-primary btn-lg btn-block" disabled={loading}>
                        {loading ? 'Signing in…' : 'Sign in'}
                    </button>
                </form>

                <p className="auth-switch">
                    Don&apos;t have an account? <Link to="/register">Create one</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
