import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PasswordStrengthChecker from '../components/PasswordStrengthChecker';
import EmailChecker from '../components/EmailChecker';
import '../App.css';

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

        // Validate passwords match
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

    return (
        <div style={{ background: 'linear-gradient(135deg, #111111 0%, #0D1A33 100%)', minHeight: '100vh', position: 'relative' }}>
            {/* Back to Home Button */}
            <div style={{ position: 'absolute', top: '2rem', left: '2rem', zIndex: 10 }}>
                <Link to="/" style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem 1.5rem',
                    background: 'rgba(26, 35, 50, 0.8)',
                    border: '1px solid rgba(26, 115, 232, 0.3)',
                    borderRadius: '8px',
                    color: '#FFFFFF',
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                    fontWeight: '500',
                    backdropFilter: 'blur(10px)',
                    transition: 'all 0.3s ease'
                }}>
                    ← Back to Home
                </Link>
            </div>
            {/* Static Background Elements */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.15 }}>
                <div style={{ position: 'absolute', width: '400px', height: '400px', background: 'radial-gradient(circle, #1A73E8 0%, transparent 70%)', borderRadius: '50%', top: '5%', left: '5%' }}></div>
                <div style={{ position: 'absolute', width: '250px', height: '250px', background: 'radial-gradient(circle, #28A8E0 0%, transparent 70%)', borderRadius: '50%', top: '50%', right: '10%' }}></div>
                <div style={{ position: 'absolute', width: '180px', height: '180px', background: 'radial-gradient(circle, #1A73E8 0%, transparent 70%)', borderRadius: '50%', bottom: '15%', left: '15%' }}></div>
                <div style={{ position: 'absolute', width: '320px', height: '320px', background: 'radial-gradient(circle, #28A8E0 0%, transparent 70%)', borderRadius: '50%', top: '30%', left: '60%' }}></div>
            </div>
            
            {/* Static Dots */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.3 }}>
                <div style={{ position: 'absolute', width: '12px', height: '12px', background: '#1A73E8', borderRadius: '50%', top: '15%', left: '40%' }}></div>
                <div style={{ position: 'absolute', width: '8px', height: '8px', background: '#28A8E0', borderRadius: '50%', top: '55%', left: '85%' }}></div>
                <div style={{ position: 'absolute', width: '10px', height: '10px', background: '#1A73E8', borderRadius: '50%', top: '75%', left: '65%' }}></div>
            </div>
            
            {/* Register Form */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '2rem', position: 'relative', zIndex: 1 }}>
                <div style={{ 
                    background: 'rgba(26, 35, 50, 0.9)', 
                    padding: '3rem', 
                    borderRadius: '16px', 
                    border: '1px solid rgba(26, 115, 232, 0.3)', 
                    backdropFilter: 'blur(20px)',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
                    width: '100%',
                    maxWidth: '500px'
                }}>
                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <h1 style={{ 
                            fontSize: '2.5rem', 
                            margin: '0 0 0.5rem 0',
                            color: '#FFFFFF',
                            fontWeight: 'bold',
                            background: 'linear-gradient(45deg, #FFFFFF, #1A73E8)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}>Join Algonauts</h1>
                        <p style={{ color: '#6B7280', fontSize: '1.1rem', margin: 0 }}>Create your account to get started</p>
                        <div style={{ width: '60px', height: '3px', background: 'linear-gradient(90deg, #1A73E8, #28A8E0)', margin: '1rem auto', borderRadius: '2px' }}></div>
                    </div>

                    {error && (
                        <div style={{ 
                            background: 'rgba(239, 68, 68, 0.1)', 
                            border: '1px solid rgba(239, 68, 68, 0.3)', 
                            color: '#FCA5A5', 
                            padding: '0.75rem', 
                            borderRadius: '8px', 
                            marginBottom: '1.5rem',
                            fontSize: '0.9rem'
                        }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div>
                            <label htmlFor="name" style={{ display: 'block', color: '#FFFFFF', marginBottom: '0.5rem', fontWeight: '500' }}>Full Name</label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                placeholder="Enter your name"
                                style={{
                                    width: '100%',
                                    padding: '0.875rem',
                                    background: 'rgba(13, 26, 51, 0.8)',
                                    border: '1px solid rgba(26, 115, 232, 0.3)',
                                    borderRadius: '8px',
                                    color: '#FFFFFF',
                                    fontSize: '1rem',
                                    transition: 'all 0.3s ease',
                                    backdropFilter: 'blur(10px)'
                                }}
                            />
                        </div>

                        <div>
                            <label htmlFor="email" style={{ display: 'block', color: '#FFFFFF', marginBottom: '0.5rem', fontWeight: '500' }}>Email</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                placeholder="Enter your email"
                                style={{
                                    width: '100%',
                                    padding: '0.875rem',
                                    background: 'rgba(13, 26, 51, 0.8)',
                                    border: '1px solid rgba(26, 115, 232, 0.3)',
                                    borderRadius: '8px',
                                    color: '#FFFFFF',
                                    fontSize: '1rem',
                                    transition: 'all 0.3s ease',
                                    backdropFilter: 'blur(10px)'
                                }}
                            />
                            <EmailChecker email={formData.email} />
                        </div>

                        <div>
                            <label htmlFor="codeforcesHandle" style={{ display: 'block', color: '#FFFFFF', marginBottom: '0.5rem', fontWeight: '500' }}>Codeforces Handle (Optional)</label>
                            <input
                                id="codeforcesHandle"
                                name="codeforcesHandle"
                                type="text"
                                value={formData.codeforcesHandle}
                                onChange={handleChange}
                                placeholder="e.g. tourist"
                                style={{
                                    width: '100%',
                                    padding: '0.875rem',
                                    background: 'rgba(13, 26, 51, 0.8)',
                                    border: '1px solid rgba(26, 115, 232, 0.3)',
                                    borderRadius: '8px',
                                    color: '#FFFFFF',
                                    fontSize: '1rem',
                                    transition: 'all 0.3s ease',
                                    backdropFilter: 'blur(10px)'
                                }}
                            />
                        </div>

                        <div>
                            <label htmlFor="password" style={{ display: 'block', color: '#FFFFFF', marginBottom: '0.5rem', fontWeight: '500' }}>Password</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                placeholder="Create a password"
                                style={{
                                    width: '100%',
                                    padding: '0.875rem',
                                    background: 'rgba(13, 26, 51, 0.8)',
                                    border: '1px solid rgba(26, 115, 232, 0.3)',
                                    borderRadius: '8px',
                                    color: '#FFFFFF',
                                    fontSize: '1rem',
                                    transition: 'all 0.3s ease',
                                    backdropFilter: 'blur(10px)'
                                }}
                            />
                            <PasswordStrengthChecker password={formData.password} />
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" style={{ display: 'block', color: '#FFFFFF', marginBottom: '0.5rem', fontWeight: '500' }}>Confirm Password</label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                                placeholder="Confirm your password"
                                style={{
                                    width: '100%',
                                    padding: '0.875rem',
                                    background: 'rgba(13, 26, 51, 0.8)',
                                    border: '1px solid rgba(26, 115, 232, 0.3)',
                                    borderRadius: '8px',
                                    color: '#FFFFFF',
                                    fontSize: '1rem',
                                    transition: 'all 0.3s ease',
                                    backdropFilter: 'blur(10px)'
                                }}
                            />
                        </div>

                        <div>
                            <label htmlFor="role" style={{ display: 'block', color: '#FFFFFF', marginBottom: '0.5rem', fontWeight: '500' }}>I am a...</label>
                            <select
                                id="role"
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                required
                                style={{
                                    width: '100%',
                                    padding: '0.875rem',
                                    background: 'rgba(13, 26, 51, 0.8)',
                                    border: '1px solid rgba(26, 115, 232, 0.3)',
                                    borderRadius: '8px',
                                    color: '#FFFFFF',
                                    fontSize: '1rem',
                                    transition: 'all 0.3s ease',
                                    backdropFilter: 'blur(10px)'
                                }}
                            >
                                <option value="student">Student</option>
                                <option value="mentor">Mentor</option>
                            </select>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                width: '100%',
                                padding: '1rem',
                                fontSize: '1.1rem',
                                background: loading ? 'rgba(26, 115, 232, 0.5)' : 'linear-gradient(45deg, #1A73E8, #28A8E0)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontWeight: 'bold',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                boxShadow: loading ? 'none' : '0 8px 25px rgba(26, 115, 232, 0.4)',
                                transition: 'all 0.3s ease',
                                transform: 'translateY(0)',
                                marginTop: '0.5rem'
                            }}
                        >
                            {loading ? 'Creating account...' : 'Create Account'}
                        </button>
                    </form>

                    <p style={{ textAlign: 'center', marginTop: '2rem', color: '#6B7280' }}>
                        Already have an account?{' '}
                        <Link to="/login" style={{ color: '#1A73E8', textDecoration: 'none', fontWeight: '500' }}>
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
            
            <style jsx>{`
                input:focus, select:focus {
                    outline: none;
                    border-color: #1A73E8 !important;
                    box-shadow: 0 0 0 3px rgba(26, 115, 232, 0.1) !important;
                }
                
                button:hover:not(:disabled) {
                    transform: translateY(-2px) !important;
                    box-shadow: 0 12px 35px rgba(26, 115, 232, 0.5) !important;
                }
                
                select option {
                    background: #0D1A33;
                    color: #FFFFFF;
                }
            `}</style>
        </div>
    );
};

export default Register;
