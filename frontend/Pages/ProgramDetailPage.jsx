import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../src/context/AuthContext';
import NavbarComponent from '../Components/NavbarComponent';

const difficultyStyle = {
    Easy:   { background: '#dcfce7', color: '#166534' },
    Medium: { background: '#fef9c3', color: '#854d0e' },
    Hard:   { background: '#fee2e2', color: '#991b1b' },
};

function ProgramDetailPage() {
    const { id } = useParams();
    const { user, token } = useAuth();
    const navigate = useNavigate();

    const [program, setProgram] = useState(null);
    const [loading, setLoading] = useState(true);

    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({ title: '', description: '', difficulty: 'Easy' });
    const [saveLoading, setSaveLoading] = useState(false);
    const [saveError, setSaveError] = useState('');

    useEffect(() => {
        fetchProgram();
    }, [id]);

    async function fetchProgram() {
        setLoading(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/programs/${id}`);
            const data = await res.json();
            setProgram(data[0] || null);
        } catch {
            setProgram(null);
        } finally {
            setLoading(false);
        }
    }

    function startEditing() {
        setEditData({
            title: program.title,
            description: program.description,
            difficulty: program.difficulty,
        });
        setSaveError('');
        setIsEditing(true);
    }

    async function handleSave(e) {
        e.preventDefault();
        setSaveError('');

        if (!editData.title.trim() || !editData.description.trim()) {
            setSaveError('Please fill in all fields.');
            return;
        }

        setSaveLoading(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/programs/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(editData),
            });
            if (res.ok) {
                setIsEditing(false);
                fetchProgram();
            } else {
                const data = await res.json();
                setSaveError(data.message || 'Failed to update program.');
            }
        } catch {
            setSaveError('Unable to reach server.');
        } finally {
            setSaveLoading(false);
        }
    }

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', background: '#f7f8fb' }}>
                <NavbarComponent />
                <div style={{ maxWidth: '800px', margin: '0 auto', padding: '32px 24px' }}>
                    <p style={{ color: '#6b7280' }}>Loading...</p>
                </div>
            </div>
        );
    }

    if (!program) {
        return (
            <div style={{ minHeight: '100vh', background: '#f7f8fb' }}>
                <NavbarComponent />
                <div style={{ maxWidth: '800px', margin: '0 auto', padding: '32px 24px' }}>
                    <p style={{ color: '#b91c1c' }}>Program not found.</p>
                    <button
                        onClick={() => navigate('/programs')}
                        style={{ color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', padding: 0 }}
                    >
                        Back to Programs
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', background: '#f7f8fb' }}>
            <NavbarComponent />
            <div style={{ maxWidth: '800px', margin: '0 auto', padding: '32px 24px' }}>

                <button
                    onClick={() => navigate('/programs')}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: '#6b7280',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        padding: 0,
                        marginBottom: '20px',
                    }}
                >
                    ← Back to Programs
                </button>

                <div style={{
                    background: '#fff',
                    borderRadius: '16px',
                    padding: '32px',
                    boxShadow: '0 4px 16px rgba(16,24,40,0.08)',
                }}>
                    {!isEditing ? (
                        <>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                                <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#111827', margin: 0 }}>
                                    {program.title}
                                </h1>
                                <span style={{
                                    ...(difficultyStyle[program.difficulty] || { background: '#e5e7eb', color: '#374151' }),
                                    padding: '4px 12px',
                                    borderRadius: '9999px',
                                    fontSize: '0.85rem',
                                    fontWeight: 600,
                                    whiteSpace: 'nowrap',
                                    marginLeft: '12px',
                                }}>
                                    {program.difficulty}
                                </span>
                            </div>
                            <p style={{ color: '#6b7280', fontSize: '0.88rem', margin: '0 0 24px' }}>
                                By {program.created_by}
                            </p>
                            <div style={{ color: '#374151', fontSize: '1rem', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
                                {program.description}
                            </div>

                            {user?.role === 'admin' && (
                                <button
                                    onClick={startEditing}
                                    style={{
                                        marginTop: '24px',
                                        padding: '8px 20px',
                                        borderRadius: '8px',
                                        border: 'none',
                                        background: '#2563eb',
                                        color: '#fff',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                        fontSize: '0.9rem',
                                    }}
                                >
                                    Edit Program
                                </button>
                            )}
                        </>
                    ) : (
                        <form onSubmit={handleSave}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#374151' }}>Title</label>
                            <input
                                type="text"
                                value={editData.title}
                                onChange={e => setEditData({ ...editData, title: e.target.value })}
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
                                value={editData.description}
                                onChange={e => setEditData({ ...editData, description: e.target.value })}
                                rows={6}
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
                                value={editData.difficulty}
                                onChange={e => setEditData({ ...editData, difficulty: e.target.value })}
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
                                    disabled={saveLoading}
                                    style={{
                                        padding: '10px 24px',
                                        borderRadius: '10px',
                                        border: 'none',
                                        background: '#2563eb',
                                        color: '#fff',
                                        fontWeight: 700,
                                        cursor: saveLoading ? 'default' : 'pointer',
                                    }}
                                >
                                    {saveLoading ? 'Saving...' : 'Save Changes'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                    style={{
                                        padding: '10px 24px',
                                        borderRadius: '10px',
                                        border: 'none',
                                        background: '#f3f4f6',
                                        color: '#374151',
                                        fontWeight: 700,
                                        cursor: 'pointer',
                                    }}
                                >
                                    Cancel
                                </button>
                                {saveError && (
                                    <span style={{ color: '#b91c1c', fontSize: '0.95rem' }}>{saveError}</span>
                                )}
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ProgramDetailPage;
