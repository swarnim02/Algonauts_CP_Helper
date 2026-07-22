import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import PasswordStrengthChecker from '../components/PasswordStrengthChecker';
import EmailChecker from '../components/EmailChecker';
import '../App.css';

const ROLES = [
    { value: 'student', label: 'Student', desc: 'Practise and upsolve' },
    { value: 'mentor', label: 'Mentor', desc: 'Run groups and contests' }
];

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        codeforcesHandle: '',
        password: '',
        confirmPassword: '',
        role: 'student'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);

        const result = await register(
            formData.name,
            formData.email,
            formData.password,
            formData.role,
            formData.codeforcesHandle
        );

        if (result.success) {
            navigate('/dashboard');
        } else {
            setError(result.error);
        }

        setLoading(false);
    };

    const mismatch =
        formData.confirmPassword.length > 0 &&
        formData.password !== formData.confirmPassword;

    return (
        <div className="auth-container">
            <Link to="/" className="btn btn-ghost btn-sm auth-back">
                ← Back to home
            </Link>

            <div className="auth-card animate-fade-in" style={{ maxWidth: '520px' }}>
                <div className="auth-header">
                    <div className="brand" style={{ justifyContent: 'center', marginBottom: 'var(--sp-5)' }}>
                        <span className="brand-mark">A</span>
                        <span>Algonauts</span>
                    </div>
                    <h1>Create your account</h1>
                    <p>Start tracking your competitive programming progress</p>
                </div>

                {error && <div className="error-message" role="alert">{error}</div>}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label className="label" htmlFor="name">Full name</label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            className="form-control"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            autoComplete="name"
                            placeholder="Ada Lovelace"
                        />
                    </div>

                    <div className="form-group">
                        <label className="label" htmlFor="email">Email</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            className="form-control"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            autoComplete="email"
                            placeholder="you@example.com"
                        />
                        <EmailChecker email={formData.email} />
                    </div>

                    <div className="form-group">
                        <label className="label" htmlFor="codeforcesHandle">
                            Codeforces handle <span className="faint">(optional)</span>
                        </label>
                        <input
                            id="codeforcesHandle"
                            name="codeforcesHandle"
                            type="text"
                            className="form-control mono"
                            value={formData.codeforcesHandle}
                            onChange={handleChange}
                            placeholder="tourist"
                        />
                        <span className="form-hint">
                            Link it now to sync your submissions automatically.
                        </span>
                    </div>

                    <div className="form-group">
                        <label className="label" htmlFor="password">Password</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            className="form-control"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            autoComplete="new-password"
                            placeholder="At least 8 characters"
                        />
                        <PasswordStrengthChecker password={formData.password} />
                    </div>

                    <div className="form-group">
                        <label className="label" htmlFor="confirmPassword">Confirm password</label>
                        <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            className="form-control"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            autoComplete="new-password"
                            placeholder="Re-enter your password"
                            aria-invalid={mismatch}
                        />
                        {mismatch && (
                            <span className="form-hint" style={{ color: 'var(--danger)' }}>
                                Passwords do not match
                            </span>
                        )}
                    </div>

                    <div className="form-group">
                        <span className="label">I am a…</span>
                        <div className="role-grid">
                            {ROLES.map((r) => (
                                <button
                                    key={r.value}
                                    type="button"
                                    className={`role-option${formData.role === r.value ? ' selected' : ''}`}
                                    aria-pressed={formData.role === r.value}
                                    onClick={() => setFormData({ ...formData, role: r.value })}
                                >
                                    <div className="role-option-label">{r.label}</div>
                                    <div className="role-option-desc">{r.desc}</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary btn-lg btn-block"
                        disabled={loading || mismatch}
                    >
                        {loading ? 'Creating account…' : 'Create account'}
                    </button>
                </form>

                <p className="auth-switch">
                    Already have an account? <Link to="/login">Sign in</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
