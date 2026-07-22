import React, { useState } from 'react';
import { Search } from 'lucide-react';

const UserInput = ({ onSubmit, loading }) => {
    const [handle, setHandle] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const trimmed = handle.trim();
        if (trimmed) onSubmit(trimmed);
    };

    return (
        <form onSubmit={handleSubmit} className="card handle-form">
            <div className="form-group grow">
                <label className="label" htmlFor="cf-handle">Codeforces handle</label>
                <input
                    id="cf-handle"
                    type="text"
                    className="form-control mono"
                    value={handle}
                    onChange={(e) => setHandle(e.target.value)}
                    placeholder="tourist"
                    disabled={loading}
                />
            </div>
            <button
                type="submit"
                className="btn btn-primary"
                disabled={!handle.trim() || loading}
            >
                <Search size={15} />
                {loading ? 'Loading…' : 'Get stats'}
            </button>
        </form>
    );
};

export default UserInput;
