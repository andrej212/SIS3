import { useState, useEffect } from 'react';
import { useAuth } from '../src/context/AuthContext';
import NavbarComponent from '../Components/NavbarComponent';

const difficultyStyle = {
    Easy:   { background: '#dcfce7', color: '#166534' },
    Medium: { background: '#fef9c3', color: '#854d0e' },
    Hard:   { background: '#fee2e2', color: '#991b1b' },
};

function ProgramsPage() {
    const { user, token } = useAuth();

    const [programs, setPrograms] = useState([]);
    const [loadingPrograms, setLoadingPrograms] = useState(true);
    const [fetchError, setFetchError] = useState('');
    const [search, setSearch] = useState('');

    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ title: '', description: '', difficulty: 'Easy' });
    const [formLoading, setFormLoading] = useState(false);
    const [formMessage, setFormMessage] = useState('');

    useEffect(() => {
        fetchPrograms();
    }, []);

    async function fetchPrograms() {
        setLoadingPrograms(true);
        try {
            const res = await fetch('http://localhost:5000/programs');
            const data = await res.json();
            setPrograms(data);
        } catch {
            setFetchError('Failed to load programs.');
        } finally {
            setLoadingPrograms(false);
        }
    }

    async function handleAddProgram(e) {
        e.preventDefault();
        setFormMessage('');

        if (!formData.title.trim() || !formData.description.trim()) {
            setFormMessage('Please fill in all fields.');
            return;
        }

        setFormLoading(true);
        try {
            const res = await fetch('http://localhost:5000/programs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    title: formData.title,
                    description: formData.description,
                    difficulty: formData.difficulty,
                    createdBy: user.username,
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                setFormMessage(data.message || 'Failed to create program.');
            } else {
                setFormData({ title: '', description: '', difficulty: 'Easy' });
                setShowForm(false);
                fetchPrograms();
            }
        } catch {
            setFormMessage('Unable to reach server.');
        } finally {
            setFormLoading(false);
        }
    }

    function toggleForm() {
        setShowForm(prev => !prev);
        setFormMessage('');
    }

    return (
        <div style={{ minHeight: '100vh', background: '#f7f8fb' }}>
            <NavbarComponent />
            <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 24px' }}>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#111827', margin: 0 }}>Programs</h1>
                    {user?.role === 'admin' && (
                        <button
                            onClick={toggleForm}
                            style={{
                                padding: '10px 20px',
                                borderRadius: '10px',
                                border: 'none',
                                background: showForm ? '#6b7280' : '#2563eb',
                                color: '#fff',
                                fontWeight: 700,
                                cursor: 'pointer',
                            }}
                        >
                            {showForm ? 'Cancel' : '+ Add Program'}
                        </button>
                    )}
                </div>

                {user?.role === 'admin' && showForm && (
                    <div style={{
                        background: '#fff',
                        borderRadius: '16px',
                        padding: '24px',
                        boxShadow: '0 4px 16px rgba(16,24,40,0.08)',
                        marginBottom: '28px',
                    }}>
                        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#111827', marginTop: 0, marginBottom: '20px' }}>
                            New Program
                        </h2>
                        <form onSubmit={handleAddProgram}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#374151' }}>Title</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                style={{
                                    width: '100%',
                                    padding: '10px 14px',
                                    borderRadius: '10px',
                                    border: '1px solid #d1d5db',
                                    marginBottom: '16px',
                                    fontSize: '1rem',
                                    boxSizing: 'border-box',
                                }}
                            />

                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#374151' }}>Description</label>
                            <textarea
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                rows={3}
                                style={{
                                    width: '100%',
                                    padding: '10px 14px',
                                    borderRadius: '10px',
                                    border: '1px solid #d1d5db',
                                    marginBottom: '16px',
                                    fontSize: '1rem',
                                    resize: 'vertical',
                                    boxSizing: 'border-box',
                                }}
                            />

                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#374151' }}>Difficulty</label>
                            <select
                                value={formData.difficulty}
                                onChange={e => setFormData({ ...formData, difficulty: e.target.value })}
                                style={{
                                    width: '100%',
                                    padding: '10px 14px',
                                    borderRadius: '10px',
                                    border: '1px solid #d1d5db',
                                    marginBottom: '20px',
                                    fontSize: '1rem',
                                    boxSizing: 'border-box',
                                }}
                            >
                                <option>Easy</option>
                                <option>Medium</option>
                                <option>Hard</option>
                            </select>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <button
                                    type="submit"
                                    disabled={formLoading}
                                    style={{
                                        padding: '10px 24px',
                                        borderRadius: '10px',
                                        border: 'none',
                                        background: '#2563eb',
                                        color: '#fff',
                                        fontWeight: 700,
                                        cursor: formLoading ? 'default' : 'pointer',
                                    }}
                                >
                                    {formLoading ? 'Creating...' : 'Create Program'}
                                </button>
                                {formMessage && (
                                    <span style={{ color: '#b91c1c', fontSize: '0.95rem' }}>{formMessage}</span>
                                )}
                            </div>
                        </form>
                    </div>
                )}

                <input
                    type="text"
                    placeholder="Search programs..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '10px',
                        border: '1px solid #d1d5db',
                        marginBottom: '24px',
                        fontSize: '1rem',
                        boxSizing: 'border-box',
                    }}
                />

                {loadingPrograms && <p style={{ color: '#6b7280' }}>Loading programs...</p>}
                {fetchError && <p style={{ color: '#b91c1c' }}>{fetchError}</p>}
                {!loadingPrograms && !fetchError && programs.length === 0 && (
                    <p style={{ color: '#6b7280' }}>No programs yet.</p>
                )}

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                    gap: '20px',
                }}>
                    {programs.filter(p =>
                        p.title.toLowerCase().includes(search.toLowerCase()) ||
                        p.description.toLowerCase().includes(search.toLowerCase())
                    ).map(program => (
                        <div
                            key={program.id}
                            style={{
                                background: '#fff',
                                borderRadius: '16px',
                                padding: '20px',
                                boxShadow: '0 4px 16px rgba(16,24,40,0.07)',
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#111827', margin: 0 }}>
                                    {program.title}
                                </h3>
                                <span style={{
                                    ...(difficultyStyle[program.difficulty] || { background: '#e5e7eb', color: '#374151' }),
                                    padding: '2px 10px',
                                    borderRadius: '9999px',
                                    fontSize: '0.78rem',
                                    fontWeight: 600,
                                    whiteSpace: 'nowrap',
                                    marginLeft: '8px',
                                }}>
                                    {program.difficulty}
                                </span>
                            </div>
                            <p style={{ color: '#6b7280', fontSize: '0.92rem', margin: 0, lineHeight: 1.6 }}>
                                {program.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ProgramsPage;
