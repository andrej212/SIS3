import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../src/context/AuthContext';
import NavbarComponent from '../Components/NavbarComponent';

function ForumPage() {
    const { user, token } = useAuth();
    const navigate = useNavigate();

    const [threads, setThreads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    const [showForm, setShowForm] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [newContent, setNewContent] = useState('');
    const [formError, setFormError] = useState('');
    const [formLoading, setFormLoading] = useState(false);

    useEffect(() => {
        fetchThreads();
    }, []);

    async function fetchThreads() {
        setLoading(true);
        try {
            const res = await fetch('http://localhost:5000/forum');
            const data = await res.json();
            setThreads(data);
        } catch {
            setThreads([]);
        } finally {
            setLoading(false);
        }
    }

    async function handleCreateThread(e) {
        e.preventDefault();
        setFormError('');
        if (!newTitle.trim() || !newContent.trim()) {
            setFormError('Title and content are required.');
            return;
        }
        setFormLoading(true);
        try {
            const res = await fetch('http://localhost:5000/forum', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ title: newTitle.trim(), content: newContent.trim() }),
            });
            if (res.ok) {
                const data = await res.json();
                setNewTitle('');
                setNewContent('');
                setShowForm(false);
                navigate(`/forum/${data.id}`);
            } else {
                const data = await res.json();
                setFormError(data.message || 'Failed to create thread.');
            }
        } catch {
            setFormError('Unable to reach server.');
        } finally {
            setFormLoading(false);
        }
    }

    const filtered = threads.filter(t =>
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.username.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div style={{ minHeight: '100vh', background: '#f7f8fb' }}>
            <NavbarComponent />
            <div style={{ maxWidth: '800px', margin: '0 auto', padding: '32px 24px' }}>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#111827', margin: 0 }}>Forum</h1>
                    <button
                        onClick={() => { setShowForm(!showForm); setFormError(''); }}
                        style={{
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
                        {showForm ? 'Cancel' : '+ New Thread'}
                    </button>
                </div>

                {showForm && (
                    <form
                        onSubmit={handleCreateThread}
                        style={{
                            background: '#fff',
                            borderRadius: '14px',
                            padding: '24px',
                            boxShadow: '0 4px 16px rgba(16,24,40,0.08)',
                            marginBottom: '24px',
                        }}
                    >
                        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#111827', margin: '0 0 16px' }}>
                            New Thread
                        </h2>
                        <input
                            value={newTitle}
                            onChange={e => setNewTitle(e.target.value)}
                            placeholder="Thread title"
                            style={{
                                width: '100%',
                                padding: '10px 14px',
                                borderRadius: '10px',
                                border: '1px solid #d1d5db',
                                fontSize: '0.95rem',
                                boxSizing: 'border-box',
                                marginBottom: '12px',
                            }}
                        />
                        <textarea
                            value={newContent}
                            onChange={e => setNewContent(e.target.value)}
                            placeholder="What's on your mind?"
                            rows={4}
                            style={{
                                width: '100%',
                                padding: '10px 14px',
                                borderRadius: '10px',
                                border: '1px solid #d1d5db',
                                fontSize: '0.95rem',
                                resize: 'vertical',
                                boxSizing: 'border-box',
                                marginBottom: '12px',
                            }}
                        />
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <button
                                type="submit"
                                disabled={formLoading}
                                style={{
                                    padding: '8px 20px',
                                    borderRadius: '8px',
                                    border: 'none',
                                    background: '#2563eb',
                                    color: '#fff',
                                    fontWeight: 600,
                                    cursor: formLoading ? 'default' : 'pointer',
                                    fontSize: '0.9rem',
                                }}
                            >
                                {formLoading ? 'Creating...' : 'Create Thread'}
                            </button>
                            {formError && <span style={{ color: '#b91c1c', fontSize: '0.9rem' }}>{formError}</span>}
                        </div>
                    </form>
                )}

                <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search threads..."
                    style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '10px',
                        border: '1px solid #d1d5db',
                        fontSize: '0.95rem',
                        boxSizing: 'border-box',
                        marginBottom: '20px',
                    }}
                />

                {loading && <p style={{ color: '#6b7280' }}>Loading...</p>}
                {!loading && filtered.length === 0 && (
                    <p style={{ color: '#6b7280' }}>No threads found. Start the conversation!</p>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {filtered.map(t => (
                        <div
                            key={t.id}
                            onClick={() => navigate(`/forum/${t.id}`)}
                            style={{
                                background: '#fff',
                                borderRadius: '14px',
                                padding: '20px 24px',
                                boxShadow: '0 2px 8px rgba(16,24,40,0.06)',
                                cursor: 'pointer',
                                transition: 'box-shadow 0.15s',
                            }}
                            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(16,24,40,0.12)'}
                            onMouseLeave={e => e.currentTarget.style.boxShadow = '0 2px 8px rgba(16,24,40,0.06)'}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#111827', margin: '0 0 6px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {t.title}
                                    </h3>
                                    <p style={{ color: '#6b7280', fontSize: '0.88rem', margin: '0 0 8px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                                        {t.content}
                                    </p>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <span style={{ fontSize: '0.82rem', color: '#9ca3af' }}>
                                            by <strong style={{ color: '#374151' }}>{t.username}</strong>
                                        </span>
                                        <span style={{ fontSize: '0.82rem', color: '#9ca3af' }}>
                                            {new Date(t.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                    <span style={{
                                        background: '#eff6ff',
                                        color: '#2563eb',
                                        fontSize: '0.8rem',
                                        fontWeight: 600,
                                        padding: '4px 10px',
                                        borderRadius: '20px',
                                    }}>
                                        {t.post_count} {t.post_count === 1 ? 'reply' : 'replies'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ForumPage;
