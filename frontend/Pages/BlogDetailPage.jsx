import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../src/context/AuthContext';
import NavbarComponent from '../Components/NavbarComponent';

function BlogDetailPage() {
    const { id } = useParams();
    const { user, token } = useAuth();
    const navigate = useNavigate();

    const [blog, setBlog] = useState(null);
    const [blogLoading, setBlogLoading] = useState(true);

    const [comments, setComments] = useState([]);
    const [commentsLoading, setCommentsLoading] = useState(true);

    const [newComment, setNewComment] = useState('');
    const [commentLoading, setCommentLoading] = useState(false);
    const [commentError, setCommentError] = useState('');

    const [replyingTo, setReplyingTo] = useState(null);
    const [replyText, setReplyText] = useState('');
    const [replyLoading, setReplyLoading] = useState(false);

    useEffect(() => {
        fetchBlog();
        fetchComments();
    }, [id]);

    async function fetchBlog() {
        setBlogLoading(true);
        try {
            const res = await fetch(`http://localhost:5000/blogs/${id}`);
            const data = await res.json();
            setBlog(data[0] || null);
        } catch {
            setBlog(null);
        } finally {
            setBlogLoading(false);
        }
    }

    async function fetchComments() {
        setCommentsLoading(true);
        try {
            const res = await fetch(`http://localhost:5000/blogs/${id}/comments`);
            const data = await res.json();
            setComments(data);
        } catch {
            setComments([]);
        } finally {
            setCommentsLoading(false);
        }
    }

    async function handleAddComment(e) {
        e.preventDefault();
        setCommentError('');
        if (!newComment.trim()) {
            setCommentError('Comment cannot be empty.');
            return;
        }
        setCommentLoading(true);
        try {
            const res = await fetch(`http://localhost:5000/blogs/${id}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ comment: newComment }),
            });
            if (res.ok) {
                setNewComment('');
                fetchComments();
            } else {
                const data = await res.json();
                setCommentError(data.message || 'Failed to post comment.');
            }
        } catch {
            setCommentError('Unable to reach server.');
        } finally {
            setCommentLoading(false);
        }
    }

    async function handleReply(commentId) {
        if (!replyText.trim()) return;
        setReplyLoading(true);
        try {
            const res = await fetch(`http://localhost:5000/blogs/comments/${commentId}/reply`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ reply: replyText }),
            });
            if (res.ok) {
                setReplyingTo(null);
                setReplyText('');
                fetchComments();
            }
        } catch {
            // silent
        } finally {
            setReplyLoading(false);
        }
    }

    async function handleDeleteComment(commentId) {
        if (!window.confirm('Delete this comment?')) return;
        try {
            await fetch(`http://localhost:5000/blogs/comments/${commentId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` },
            });
            fetchComments();
        } catch {
            alert('Failed to delete comment.');
        }
    }

    function openReply(comment) {
        setReplyingTo(comment.id);
        setReplyText(comment.reply || '');
    }

    if (blogLoading) {
        return (
            <div style={{ minHeight: '100vh', background: '#f7f8fb' }}>
                <NavbarComponent />
                <div style={{ maxWidth: '800px', margin: '0 auto', padding: '32px 24px' }}>
                    <p style={{ color: '#6b7280' }}>Loading...</p>
                </div>
            </div>
        );
    }

    if (!blog) {
        return (
            <div style={{ minHeight: '100vh', background: '#f7f8fb' }}>
                <NavbarComponent />
                <div style={{ maxWidth: '800px', margin: '0 auto', padding: '32px 24px' }}>
                    <p style={{ color: '#b91c1c' }}>Blog post not found.</p>
                    <button
                        onClick={() => navigate('/blogs')}
                        style={{ color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', padding: 0 }}
                    >
                        Back to Blog
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
                    onClick={() => navigate('/blogs')}
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
                    ← Back to Blog
                </button>

                {/* Blog content */}
                <div style={{
                    background: '#fff',
                    borderRadius: '16px',
                    padding: '32px',
                    boxShadow: '0 4px 16px rgba(16,24,40,0.08)',
                    marginBottom: '32px',
                }}>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#111827', margin: '0 0 8px' }}>
                        {blog.title}
                    </h1>
                    <p style={{ color: '#6b7280', fontSize: '0.88rem', margin: '0 0 24px' }}>
                        By {blog.created_by}
                    </p>
                    <div style={{ color: '#374151', fontSize: '1rem', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
                        {blog.content}
                    </div>
                    {blog.pdf_url && (
                        <a
                            href={blog.pdf_url}
                            target="_blank"
                            rel="noreferrer"
                            style={{
                                display: 'inline-block',
                                marginTop: '24px',
                                padding: '8px 20px',
                                background: '#2563eb',
                                color: '#fff',
                                borderRadius: '8px',
                                textDecoration: 'none',
                                fontWeight: 600,
                                fontSize: '0.9rem',
                            }}
                        >
                            View PDF
                        </a>
                    )}
                </div>

                {/* Comments */}
                <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#111827', margin: '0 0 16px' }}>
                    Comments ({comments.length})
                </h2>

                {/* Post comment form — visible to all logged-in users */}
                {token && (
                    <form onSubmit={handleAddComment} style={{
                        background: '#fff',
                        borderRadius: '12px',
                        padding: '20px',
                        boxShadow: '0 2px 8px rgba(16,24,40,0.06)',
                        marginBottom: '20px',
                    }}>
                        <textarea
                            value={newComment}
                            onChange={e => setNewComment(e.target.value)}
                            placeholder="Write a comment..."
                            rows={3}
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
                                disabled={commentLoading}
                                style={{
                                    padding: '8px 20px',
                                    borderRadius: '8px',
                                    border: 'none',
                                    background: '#2563eb',
                                    color: '#fff',
                                    fontWeight: 600,
                                    cursor: commentLoading ? 'default' : 'pointer',
                                    fontSize: '0.9rem',
                                }}
                            >
                                {commentLoading ? 'Posting...' : 'Post Comment'}
                            </button>
                            {commentError && (
                                <span style={{ color: '#b91c1c', fontSize: '0.9rem' }}>{commentError}</span>
                            )}
                        </div>
                    </form>
                )}

                {commentsLoading && <p style={{ color: '#6b7280' }}>Loading comments...</p>}
                {!commentsLoading && comments.length === 0 && (
                    <p style={{ color: '#6b7280' }}>No comments yet. Be the first!</p>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {comments.map(c => (
                        <div
                            key={c.id}
                            style={{
                                background: '#fff',
                                borderRadius: '12px',
                                padding: '16px 20px',
                                boxShadow: '0 2px 8px rgba(16,24,40,0.06)',
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                                        <span style={{ fontWeight: 700, color: '#111827', fontSize: '0.9rem' }}>{c.username}</span>
                                        <span style={{ color: '#9ca3af', fontSize: '0.8rem' }}>
                                            {new Date(c.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p style={{ color: '#374151', fontSize: '0.95rem', margin: '0 0 8px', lineHeight: 1.6 }}>
                                        {c.comment}
                                    </p>

                                    {/* Admin reply display */}
                                    {c.reply && replyingTo !== c.id && (
                                        <div style={{
                                            background: '#eff6ff',
                                            borderLeft: '3px solid #2563eb',
                                            borderRadius: '0 8px 8px 0',
                                            padding: '10px 14px',
                                            marginTop: '10px',
                                        }}>
                                            <span style={{ fontWeight: 700, color: '#1d4ed8', fontSize: '0.83rem' }}>Admin reply</span>
                                            <p style={{ color: '#1e40af', fontSize: '0.92rem', margin: '4px 0 0', lineHeight: 1.6 }}>
                                                {c.reply}
                                            </p>
                                        </div>
                                    )}

                                    {/* Admin reply form */}
                                    {user?.role === 'admin' && replyingTo === c.id && (
                                        <div style={{ marginTop: '10px' }}>
                                            <textarea
                                                value={replyText}
                                                onChange={e => setReplyText(e.target.value)}
                                                placeholder="Write a reply..."
                                                rows={2}
                                                style={{
                                                    width: '100%',
                                                    padding: '8px 12px',
                                                    borderRadius: '8px',
                                                    border: '1px solid #bfdbfe',
                                                    fontSize: '0.9rem',
                                                    resize: 'vertical',
                                                    boxSizing: 'border-box',
                                                    marginBottom: '8px',
                                                }}
                                            />
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <button
                                                    onClick={() => handleReply(c.id)}
                                                    disabled={replyLoading}
                                                    style={{
                                                        padding: '6px 16px',
                                                        borderRadius: '6px',
                                                        border: 'none',
                                                        background: '#2563eb',
                                                        color: '#fff',
                                                        fontWeight: 600,
                                                        cursor: 'pointer',
                                                        fontSize: '0.85rem',
                                                    }}
                                                >
                                                    {replyLoading ? 'Sending...' : 'Send Reply'}
                                                </button>
                                                <button
                                                    onClick={() => { setReplyingTo(null); setReplyText(''); }}
                                                    style={{
                                                        padding: '6px 16px',
                                                        borderRadius: '6px',
                                                        border: 'none',
                                                        background: '#f3f4f6',
                                                        color: '#374151',
                                                        fontWeight: 600,
                                                        cursor: 'pointer',
                                                        fontSize: '0.85rem',
                                                    }}
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Admin action buttons */}
                                {user?.role === 'admin' && replyingTo !== c.id && (
                                    <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                                        <button
                                            onClick={() => openReply(c)}
                                            style={{
                                                padding: '4px 12px',
                                                borderRadius: '6px',
                                                border: 'none',
                                                background: '#eff6ff',
                                                color: '#2563eb',
                                                fontWeight: 600,
                                                cursor: 'pointer',
                                                fontSize: '0.8rem',
                                            }}
                                        >
                                            {c.reply ? 'Edit Reply' : 'Reply'}
                                        </button>
                                        <button
                                            onClick={() => handleDeleteComment(c.id)}
                                            style={{
                                                padding: '4px 12px',
                                                borderRadius: '6px',
                                                border: 'none',
                                                background: '#fee2e2',
                                                color: '#b91c1c',
                                                fontWeight: 600,
                                                cursor: 'pointer',
                                                fontSize: '0.8rem',
                                            }}
                                        >
                                            Delete
                                        </button>
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

export default BlogDetailPage;
