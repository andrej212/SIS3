import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../src/context/AuthContext';
import NavbarComponent from '../Components/NavbarComponent';

function BlogPage() {
    const { user, token } = useAuth();
    const navigate = useNavigate();

    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ title: '', content: '', pdfUrl: '' });
    const [formLoading, setFormLoading] = useState(false);
    const [formMessage, setFormMessage] = useState('');

    useEffect(() => {
        fetchBlogs();
    }, []);

    async function fetchBlogs() {
        setLoading(true);
        try {
            const res = await fetch('http://localhost:5000/blogs');
            const data = await res.json();
            setBlogs(data);
        } catch {
            setError('Failed to load blogs.');
        } finally {
            setLoading(false);
        }
    }

    async function handleAddBlog(e) {
        e.preventDefault();
        setFormMessage('');

        if (!formData.title.trim() || !formData.content.trim()) {
            setFormMessage('Title and content are required.');
            return;
        }

        setFormLoading(true);
        try {
            const res = await fetch('http://localhost:5000/blogs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    title: formData.title,
                    content: formData.content,
                    pdfUrl: formData.pdfUrl || null,
                    createdBy: user.username,
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                setFormMessage(data.message || 'Failed to create blog.');
            } else {
                setFormData({ title: '', content: '', pdfUrl: '' });
                setShowForm(false);
                fetchBlogs();
            }
        } catch {
            setFormMessage('Unable to reach server.');
        } finally {
            setFormLoading(false);
        }
    }

    async function handleDeleteBlog(id, e) {
        e.stopPropagation();
        if (!window.confirm('Delete this blog post?')) return;
        try {
            const res = await fetch(`http://localhost:5000/blogs/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` },
            });
            if (!res.ok) {
                alert('Failed to delete blog.');
                return;
            }
            fetchBlogs();
        } catch {
            alert('Failed to delete blog.');
        }
    }

    function toggleForm() {
        setShowForm(p => !p);
        setFormMessage('');
    }

    return (
        <div style={{ minHeight: '100vh', background: '#f7f8fb' }}>
            <NavbarComponent />
            <div style={{ maxWidth: '860px', margin: '0 auto', padding: '32px 24px' }}>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#111827', margin: 0 }}>Blog</h1>
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
                            {showForm ? 'Cancel' : '+ Add Blog'}
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
                            New Blog Post
                        </h2>
                        <form onSubmit={handleAddBlog}>
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

                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#374151' }}>Content</label>
                            <textarea
                                value={formData.content}
                                onChange={e => setFormData({ ...formData, content: e.target.value })}
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

                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#374151' }}>
                                PDF URL <span style={{ color: '#9ca3af', fontWeight: 400 }}>(optional)</span>
                            </label>
                            <input
                                type="text"
                                value={formData.pdfUrl}
                                onChange={e => setFormData({ ...formData, pdfUrl: e.target.value })}
                                style={{
                                    width: '100%',
                                    padding: '10px 14px',
                                    borderRadius: '10px',
                                    border: '1px solid #d1d5db',
                                    marginBottom: '20px',
                                    fontSize: '1rem',
                                    boxSizing: 'border-box',
                                }}
                            />

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
                                    {formLoading ? 'Publishing...' : 'Publish Blog'}
                                </button>
                                {formMessage && (
                                    <span style={{ color: '#b91c1c', fontSize: '0.95rem' }}>{formMessage}</span>
                                )}
                            </div>
                        </form>
                    </div>
                )}

                {loading && <p style={{ color: '#6b7280' }}>Loading blogs...</p>}
                {error && <p style={{ color: '#b91c1c' }}>{error}</p>}
                {!loading && !error && blogs.length === 0 && (
                    <p style={{ color: '#6b7280' }}>No blog posts yet.</p>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {blogs.map(blog => (
                        <div
                            key={blog.id}
                            onClick={() => navigate(`/blogs/${blog.id}`)}
                            style={{
                                background: '#fff',
                                borderRadius: '16px',
                                padding: '24px',
                                boxShadow: '0 4px 16px rgba(16,24,40,0.07)',
                                cursor: 'pointer',
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#111827', margin: '0 0 4px' }}>
                                        {blog.title}
                                    </h2>
                                    <p style={{ color: '#6b7280', fontSize: '0.83rem', margin: '0 0 10px' }}>
                                        By {blog.created_by}
                                    </p>
                                    {blog.content && (
                                        <p style={{ color: '#4b5563', fontSize: '0.95rem', margin: 0, lineHeight: 1.6 }}>
                                            {blog.content.length > 160 ? blog.content.slice(0, 160) + '...' : blog.content}
                                        </p>
                                    )}
                                </div>
                                {user?.role === 'admin' && (
                                    <button
                                        onClick={(e) => handleDeleteBlog(blog.id, e)}
                                        style={{
                                            marginLeft: '16px',
                                            flexShrink: 0,
                                            padding: '6px 14px',
                                            borderRadius: '8px',
                                            border: 'none',
                                            background: '#fee2e2',
                                            color: '#b91c1c',
                                            fontWeight: 600,
                                            cursor: 'pointer',
                                            fontSize: '0.85rem',
                                        }}
                                    >
                                        Delete
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default BlogPage;
