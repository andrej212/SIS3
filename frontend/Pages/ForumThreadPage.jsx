import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../src/context/AuthContext';
import NavbarComponent from '../Components/NavbarComponent';

function ForumThreadPage() {
    const { id } = useParams();
    const { user, token } = useAuth();
    const navigate = useNavigate();

    const [thread, setThread] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    const [newPost, setNewPost] = useState('');
    const [postLoading, setPostLoading] = useState(false);
    const [postError, setPostError] = useState('');

    const [editingThread, setEditingThread] = useState(false);
    const [editTitle, setEditTitle] = useState('');
    const [editContent, setEditContent] = useState('');

    const [editingPostId, setEditingPostId] = useState(null);
    const [editPostContent, setEditPostContent] = useState('');

    useEffect(() => {
        fetchThread();
    }, [id]);

    async function fetchThread() {
        setLoading(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/forum/${id}`);
            if (!res.ok) { setThread(null); return; }
            const data = await res.json();
            setThread(data.thread);
            setPosts(data.posts);
        } catch {
            setThread(null);
        } finally {
            setLoading(false);
        }
    }

    async function handleAddPost(e) {
        e.preventDefault();
        setPostError('');
        if (!newPost.trim()) { setPostError('Reply cannot be empty.'); return; }
        setPostLoading(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/forum/${id}/posts`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ content: newPost }),
            });
            if (res.ok) {
                setNewPost('');
                fetchThread();
            } else {
                const data = await res.json();
                setPostError(data.message || 'Failed to post reply.');
            }
        } catch {
            setPostError('Unable to reach server.');
        } finally {
            setPostLoading(false);
        }
    }

    async function handleEditThread(e) {
        e.preventDefault();
        if (!editTitle.trim() || !editContent.trim()) return;
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/forum/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ title: editTitle.trim(), content: editContent.trim() }),
            });
            if (res.ok) {
                setEditingThread(false);
                fetchThread();
            }
        } catch { /* silent */ }
    }

    async function handleDeleteThread() {
        if (!window.confirm('Delete this thread and all its replies?')) return;
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/forum/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` },
            });
            if (res.ok) navigate('/forum');
        } catch { /* silent */ }
    }

    async function handleEditPost(postId) {
        if (!editPostContent.trim()) return;
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/forum/posts/${postId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ content: editPostContent.trim() }),
            });
            if (res.ok) {
                setEditingPostId(null);
                setEditPostContent('');
                fetchThread();
            }
        } catch { /* silent */ }
    }

    async function handleDeletePost(postId) {
        if (!window.confirm('Delete this reply?')) return;
        try {
            await fetch(`${import.meta.env.VITE_API_URL}/forum/posts/${postId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` },
            });
            fetchThread();
        } catch { /* silent */ }
    }

    function canModifyThread() {
        return thread && (user?.id === thread.user_id || user?.role === 'admin');
    }

    function canModifyPost(post) {
        return user?.id === post.user_id || user?.role === 'admin';
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

    if (!thread) {
        return (
            <div style={{ minHeight: '100vh', background: '#f7f8fb' }}>
                <NavbarComponent />
                <div style={{ maxWidth: '800px', margin: '0 auto', padding: '32px 24px' }}>
                    <p style={{ color: '#b91c1c' }}>Thread not found.</p>
                    <button onClick={() => navigate('/forum')} style={{ color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', padding: 0 }}>
                        Back to Forum
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
                    onClick={() => navigate('/forum')}
                    style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', fontSize: '0.9rem', padding: 0, marginBottom: '20px' }}
                >
                    â† Back to Forum
                </button>

                {/* Thread */}
                <div style={{ background: '#fff', borderRadius: '16px', padding: '28px 32px', boxShadow: '0 4px 16px rgba(16,24,40,0.08)', marginBottom: '32px' }}>
                    {editingThread ? (
                        <form onSubmit={handleEditThread}>
                            <input
                                value={editTitle}
                                onChange={e => setEditTitle(e.target.value)}
                                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #d1d5db', fontSize: '1rem', fontWeight: 700, boxSizing: 'border-box', marginBottom: '12px' }}
                            />
                            <textarea
                                value={editContent}
                                onChange={e => setEditContent(e.target.value)}
                                rows={5}
                                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #d1d5db', fontSize: '0.95rem', resize: 'vertical', boxSizing: 'border-box', marginBottom: '12px' }}
                            />
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button type="submit" style={{ padding: '7px 18px', borderRadius: '7px', border: 'none', background: '#2563eb', color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}>Save</button>
                                <button type="button" onClick={() => setEditingThread(false)} style={{ padding: '7px 18px', borderRadius: '7px', border: 'none', background: '#f3f4f6', color: '#374151', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}>Cancel</button>
                            </div>
                        </form>
                    ) : (
                        <>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                                <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#111827', margin: '0 0 6px', flex: 1 }}>{thread.title}</h1>
                                {canModifyThread() && (
                                    <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                                        <button onClick={() => { setEditingThread(true); setEditTitle(thread.title); setEditContent(thread.content); }} style={{ padding: '4px 12px', borderRadius: '6px', border: 'none', background: '#eff6ff', color: '#2563eb', fontWeight: 600, cursor: 'pointer', fontSize: '0.8rem' }}>Edit</button>
                                        <button onClick={handleDeleteThread} style={{ padding: '4px 12px', borderRadius: '6px', border: 'none', background: '#fee2e2', color: '#b91c1c', fontWeight: 600, cursor: 'pointer', fontSize: '0.8rem' }}>Delete</button>
                                    </div>
                                )}
                            </div>
                            <p style={{ color: '#6b7280', fontSize: '0.85rem', margin: '0 0 20px' }}>
                                by <strong style={{ color: '#374151' }}>{thread.username}</strong> Â· {new Date(thread.created_at).toLocaleDateString()}
                            </p>
                            <div style={{ color: '#374151', fontSize: '1rem', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{thread.content}</div>
                        </>
                    )}
                </div>

                {/* Replies */}
                <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#111827', margin: '0 0 16px' }}>
                    Replies ({posts.length})
                </h2>

                {/* Add reply form */}
                <form onSubmit={handleAddPost} style={{ background: '#fff', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(16,24,40,0.06)', marginBottom: '20px' }}>
                    <textarea
                        value={newPost}
                        onChange={e => setNewPost(e.target.value)}
                        placeholder="Write a reply..."
                        rows={3}
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #d1d5db', fontSize: '0.95rem', resize: 'vertical', boxSizing: 'border-box', marginBottom: '12px' }}
                    />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <button type="submit" disabled={postLoading} style={{ padding: '8px 20px', borderRadius: '8px', border: 'none', background: '#2563eb', color: '#fff', fontWeight: 600, cursor: postLoading ? 'default' : 'pointer', fontSize: '0.9rem' }}>
                            {postLoading ? 'Posting...' : 'Post Reply'}
                        </button>
                        {postError && <span style={{ color: '#b91c1c', fontSize: '0.9rem' }}>{postError}</span>}
                    </div>
                </form>

                {posts.length === 0 && <p style={{ color: '#6b7280' }}>No replies yet. Be the first to reply!</p>}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {posts.map((p, idx) => (
                        <div key={p.id} style={{ background: '#fff', borderRadius: '12px', padding: '16px 20px', boxShadow: '0 2px 8px rgba(16,24,40,0.06)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                        <span style={{ fontWeight: 700, color: '#111827', fontSize: '0.88rem' }}>{p.username}</span>
                                        <span style={{ color: '#9ca3af', fontSize: '0.8rem' }}>{new Date(p.created_at).toLocaleDateString()}</span>
                                        <span style={{ color: '#d1d5db', fontSize: '0.8rem' }}>#{idx + 1}</span>
                                    </div>

                                    {editingPostId === p.id ? (
                                        <div>
                                            <textarea
                                                value={editPostContent}
                                                onChange={e => setEditPostContent(e.target.value)}
                                                rows={3}
                                                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.9rem', resize: 'vertical', boxSizing: 'border-box', marginBottom: '8px' }}
                                            />
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <button onClick={() => handleEditPost(p.id)} style={{ padding: '5px 14px', borderRadius: '6px', border: 'none', background: '#2563eb', color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: '0.82rem' }}>Save</button>
                                                <button onClick={() => { setEditingPostId(null); setEditPostContent(''); }} style={{ padding: '5px 14px', borderRadius: '6px', border: 'none', background: '#f3f4f6', color: '#374151', fontWeight: 600, cursor: 'pointer', fontSize: '0.82rem' }}>Cancel</button>
                                            </div>
                                        </div>
                                    ) : (
                                        <p style={{ color: '#374151', fontSize: '0.95rem', margin: 0, lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{p.content}</p>
                                    )}
                                </div>

                                {canModifyPost(p) && editingPostId !== p.id && (
                                    <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                                        <button onClick={() => { setEditingPostId(p.id); setEditPostContent(p.content); }} style={{ padding: '4px 10px', borderRadius: '6px', border: 'none', background: '#eff6ff', color: '#2563eb', fontWeight: 600, cursor: 'pointer', fontSize: '0.78rem' }}>Edit</button>
                                        <button onClick={() => handleDeletePost(p.id)} style={{ padding: '4px 10px', borderRadius: '6px', border: 'none', background: '#fee2e2', color: '#b91c1c', fontWeight: 600, cursor: 'pointer', fontSize: '0.78rem' }}>Delete</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ForumThreadPage;
