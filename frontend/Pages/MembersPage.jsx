import { useState, useEffect } from 'react';
import { useAuth } from '../src/context/AuthContext';
import NavbarComponent from '../Components/NavbarComponent';

function formatDate(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB');
}

function toInputDate(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toISOString().split('T')[0];
}

function isExpired(endDate) {
    return new Date(endDate) < new Date(new Date().toDateString());
}

function MembersPage() {
    const { user, token } = useAuth();
    const canManage = user?.role === 'admin' || user?.role === 'employee';

    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState('');

    const [showAddForm, setShowAddForm] = useState(false);
    const [addForm, setAddForm] = useState({ name: '', surname: '', startDate: '' });
    const [addLoading, setAddLoading] = useState(false);
    const [addError, setAddError] = useState('');

    const [editingId, setEditingId] = useState(null);
    const [editDate, setEditDate] = useState('');
    const [editLoading, setEditLoading] = useState(false);
    const [editError, setEditError] = useState('');

    useEffect(() => {
        fetchMembers();
    }, []);

    async function fetchMembers() {
        setLoading(true);
        setFetchError('');
        try {
            const res = await fetch('http://localhost:5000/members', {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            setMembers(data);
        } catch {
            setFetchError('Failed to load members.');
        } finally {
            setLoading(false);
        }
    }

    async function handleAdd(e) {
        e.preventDefault();
        setAddError('');
        if (!addForm.name.trim() || !addForm.surname.trim() || !addForm.startDate) {
            setAddError('All fields are required.');
            return;
        }
        const duplicate = members.some(
            m => m.name.toLowerCase() === addForm.name.trim().toLowerCase() &&
                 m.surname.toLowerCase() === addForm.surname.trim().toLowerCase()
        );
        if (duplicate) {
            setAddError('A member with that name and surname already exists.');
            return;
        }
        setAddLoading(true);
        try {
            const res = await fetch('http://localhost:5000/members', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(addForm),
            });
            if (!res.ok) {
                const d = await res.json();
                setAddError(d.message || 'Failed to add member.');
            } else {
                setAddForm({ name: '', surname: '', startDate: '' });
                setShowAddForm(false);
                fetchMembers();
            }
        } catch {
            setAddError('Unable to reach server.');
        } finally {
            setAddLoading(false);
        }
    }

    async function handleEditSave(id) {
        setEditError('');
        if (!editDate) {
            setEditError('Start date is required.');
            return;
        }
        setEditLoading(true);
        try {
            const res = await fetch(`http://localhost:5000/members/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ startDate: editDate }),
            });
            if (!res.ok) {
                const d = await res.json();
                setEditError(d.message || 'Failed to update.');
            } else {
                setEditingId(null);
                fetchMembers();
            }
        } catch {
            setEditError('Unable to reach server.');
        } finally {
            setEditLoading(false);
        }
    }

    async function handleDelete(id) {
        if (!window.confirm('Remove this member?')) return;
        try {
            await fetch(`http://localhost:5000/members/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchMembers();
        } catch {
            // silent
        }
    }

    function startEdit(member) {
        setEditingId(member.id);
        setEditDate(toInputDate(member.start_date));
        setEditError('');
    }

    return (
        <div style={{ minHeight: '100vh', background: '#f7f8fb' }}>
            <NavbarComponent />
            <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 24px' }}>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#111827', margin: 0 }}>Members</h1>
                    {canManage && (
                        <button
                            onClick={() => { setShowAddForm(prev => !prev); setAddError(''); }}
                            style={{
                                padding: '10px 20px',
                                borderRadius: '10px',
                                border: 'none',
                                background: showAddForm ? '#6b7280' : '#2563eb',
                                color: '#fff',
                                fontWeight: 700,
                                cursor: 'pointer',
                            }}
                        >
                            {showAddForm ? 'Cancel' : '+ Add Member'}
                        </button>
                    )}
                </div>

                {canManage && showAddForm && (
                    <div style={{
                        background: '#fff',
                        borderRadius: '16px',
                        padding: '24px',
                        boxShadow: '0 4px 16px rgba(16,24,40,0.08)',
                        marginBottom: '28px',
                    }}>
                        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#111827', marginTop: 0, marginBottom: '20px' }}>
                            New Member
                        </h2>
                        <form onSubmit={handleAdd} style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'flex-end' }}>
                            <div style={{ flex: '1 1 160px' }}>
                                <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, color: '#374151', fontSize: '0.9rem' }}>Name</label>
                                <input
                                    type="text"
                                    value={addForm.name}
                                    onChange={e => setAddForm({ ...addForm, name: e.target.value })}
                                    style={inputStyle}
                                />
                            </div>
                            <div style={{ flex: '1 1 160px' }}>
                                <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, color: '#374151', fontSize: '0.9rem' }}>Surname</label>
                                <input
                                    type="text"
                                    value={addForm.surname}
                                    onChange={e => setAddForm({ ...addForm, surname: e.target.value })}
                                    style={inputStyle}
                                />
                            </div>
                            <div style={{ flex: '1 1 160px' }}>
                                <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, color: '#374151', fontSize: '0.9rem' }}>Start Date</label>
                                <input
                                    type="date"
                                    value={addForm.startDate}
                                    onChange={e => setAddForm({ ...addForm, startDate: e.target.value })}
                                    style={inputStyle}
                                />
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: '0 0 auto', paddingBottom: '1px' }}>
                                <button
                                    type="submit"
                                    disabled={addLoading}
                                    style={{
                                        padding: '10px 22px',
                                        borderRadius: '10px',
                                        border: 'none',
                                        background: '#2563eb',
                                        color: '#fff',
                                        fontWeight: 700,
                                        cursor: addLoading ? 'default' : 'pointer',
                                        whiteSpace: 'nowrap',
                                    }}
                                >
                                    {addLoading ? 'Adding...' : 'Add Member'}
                                </button>
                                {addError && <span style={{ color: '#b91c1c', fontSize: '0.9rem' }}>{addError}</span>}
                            </div>
                        </form>
                    </div>
                )}

                {loading && <p style={{ color: '#6b7280' }}>Loading members...</p>}
                {fetchError && <p style={{ color: '#b91c1c' }}>{fetchError}</p>}

                {!loading && !fetchError && (
                    <div style={{
                        background: '#fff',
                        borderRadius: '16px',
                        boxShadow: '0 4px 16px rgba(16,24,40,0.07)',
                        overflow: 'hidden',
                    }}>
                        {members.length === 0 ? (
                            <p style={{ color: '#6b7280', padding: '24px', margin: 0 }}>No members yet.</p>
                        ) : (
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.95rem' }}>
                                <thead>
                                    <tr style={{ background: '#f3f4f6', borderBottom: '2px solid #e5e7eb' }}>
                                        <th style={thStyle}>Name</th>
                                        <th style={thStyle}>Surname</th>
                                        <th style={thStyle}>Start Date</th>
                                        <th style={thStyle}>Expiration Date</th>
                                        {canManage && <th style={thStyle}>Actions</th>}
                                    </tr>
                                </thead>
                                <tbody>
                                    {members.map((m, i) => {
                                        const expired = isExpired(m.end_date);
                                        const rowBg = expired ? '#fef2f2' : i % 2 === 0 ? '#fff' : '#fafafa';
                                        const textColor = expired ? '#991b1b' : '#111827';
                                        return (
                                            <tr key={m.id} style={{ background: rowBg, borderBottom: '1px solid #e5e7eb' }}>
                                                <td style={{ ...tdStyle, color: textColor, fontWeight: expired ? 600 : 400 }}>{m.name}</td>
                                                <td style={{ ...tdStyle, color: textColor, fontWeight: expired ? 600 : 400 }}>{m.surname}</td>
                                                <td style={{ ...tdStyle, color: textColor }}>
                                                    {editingId === m.id ? (
                                                        <input
                                                            type="date"
                                                            value={editDate}
                                                            onChange={e => setEditDate(e.target.value)}
                                                            style={{ ...inputStyle, padding: '6px 10px', fontSize: '0.9rem' }}
                                                        />
                                                    ) : (
                                                        formatDate(m.start_date)
                                                    )}
                                                </td>
                                                <td style={{ ...tdStyle, color: expired ? '#b91c1c' : textColor }}>
                                                    {formatDate(m.end_date)}
                                                    {expired && (
                                                        <span style={{
                                                            marginLeft: '8px',
                                                            background: '#fecaca',
                                                            color: '#991b1b',
                                                            fontSize: '0.72rem',
                                                            fontWeight: 700,
                                                            padding: '2px 8px',
                                                            borderRadius: '9999px',
                                                        }}>
                                                            EXPIRED
                                                        </span>
                                                    )}
                                                </td>
                                                {canManage && (
                                                    <td style={{ ...tdStyle, whiteSpace: 'nowrap' }}>
                                                        {editingId === m.id ? (
                                                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                                                <button
                                                                    onClick={() => handleEditSave(m.id)}
                                                                    disabled={editLoading}
                                                                    style={btnStyle('#16a34a')}
                                                                >
                                                                    {editLoading ? 'Saving...' : 'Save'}
                                                                </button>
                                                                <button
                                                                    onClick={() => { setEditingId(null); setEditError(''); }}
                                                                    style={btnStyle('#6b7280')}
                                                                >
                                                                    Cancel
                                                                </button>
                                                                {editError && <span style={{ color: '#b91c1c', fontSize: '0.82rem' }}>{editError}</span>}
                                                            </div>
                                                        ) : (
                                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                                <button onClick={() => startEdit(m)} style={btnStyle('#2563eb')}>
                                                                    Edit
                                                                </button>
                                                                <button onClick={() => handleDelete(m.id)} style={btnStyle('#dc2626')}>
                                                                    Remove
                                                                </button>
                                                            </div>
                                                        )}
                                                    </td>
                                                )}
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

const inputStyle = {
    width: '100%',
    padding: '10px 14px',
    borderRadius: '10px',
    border: '1px solid #d1d5db',
    fontSize: '1rem',
    boxSizing: 'border-box',
};

const thStyle = {
    padding: '12px 16px',
    textAlign: 'left',
    fontWeight: 700,
    color: '#374151',
    fontSize: '0.85rem',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
};

const tdStyle = {
    padding: '12px 16px',
    color: '#111827',
};

function btnStyle(bg) {
    return {
        padding: '6px 14px',
        borderRadius: '8px',
        border: 'none',
        background: bg,
        color: '#fff',
        fontWeight: 600,
        cursor: 'pointer',
        fontSize: '0.85rem',
    };
}

export default MembersPage;
