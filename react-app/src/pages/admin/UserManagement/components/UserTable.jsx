// react-app/src/pages/admin/UserManagement/components/UserTable.jsx

import React from 'react';
import '../../styles/shared.css';
import '../../styles/UserManagement.css';

export default function UserTable({
    users,
    pagination,
    onPageChange,
    onViewUser,
    onToggleStatus,
    onDeleteUser
}) {

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const renderPagination = () => {
        const pages = [];
        const maxVisible = 5;
        let startPage = Math.max(1, pagination.page - Math.floor(maxVisible / 2));
        let endPage = Math.min(pagination.totalPages, startPage + maxVisible - 1);

        if (endPage - startPage < maxVisible - 1) {
            startPage = Math.max(1, endPage - maxVisible + 1);
        }

        // Previous button
        pages.push(
            <button
                key="prev"
                onClick={() => onPageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
            >
                ← Previous
            </button>
        );

        // First page
        if (startPage > 1) {
            pages.push(
                <button key={1} onClick={() => onPageChange(1)}>
                    1
                </button>
            );
            if (startPage > 2) {
                pages.push(<span key="dots1" className="pagination-dots">...</span>);
            }
        }

        // Page numbers
        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => onPageChange(i)}
                    className={i === pagination.page ? 'active' : ''}
                >
                    {i}
                </button>
            );
        }

        // Last page
        if (endPage < pagination.totalPages) {
            if (endPage < pagination.totalPages - 1) {
                pages.push(<span key="dots2" className="pagination-dots">...</span>);
            }
            pages.push(
                <button
                    key={pagination.totalPages}
                    onClick={() => onPageChange(pagination.totalPages)}
                >
                    {pagination.totalPages}
                </button>
            );
        }

        // Next button
        pages.push(
            <button
                key="next"
                onClick={() => onPageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
            >
                Next →
            </button>
        );

        return pages;
    };

    if (users.length === 0) {
        return (
            <div className="admin-card user-table-empty">
                <div className="empty-icon">👥</div>
                <h3 className="empty-title">No users found</h3>
                <p className="empty-subtitle">Try adjusting your filters</p>
            </div>
        );
    }

    return (
        <div className="admin-card user-table-card">
            <div className="user-table-header">
                <h3 className="user-table-title">
                    👥 Users ({pagination.total} total)
                </h3>
                <div className="user-table-page-info">
                    Page {pagination.page} of {pagination.totalPages}
                </div>
            </div>

            <div className="user-table-wrapper">
                <table className="admin-table">
                    <thead>
                        <tr>
                            {/* <th>ID</th> */}
                            <th>User</th>
                            <th>Email</th>
                            <th>Role</th>
                            {/* <th>Provider</th> */}
                            <th>Verified Status</th>
                            <th>Active Status</th>
                            <th>Joined</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id}>
                                {/* <td className="user-id-cell">
                                    #{user.id}
                                </td> */}

                                <td>
                                    <div className="user-info">
                                        <div className="user-avatar">
                                            {user.username?.charAt(0).toUpperCase() || '?'}
                                        </div>
                                        <span className="user-username">
                                            {user.username}
                                        </span>
                                    </div>
                                </td>

                                <td className="user-email-cell">
                                    {user.email}
                                </td>

                                <td>
                                    <span
                                        className={`admin-badge admin-badge-${user.role === 'admin' ? 'danger' : 'info'}`}
                                        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                                    >
                                        {user.role === 'admin' ? (
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="18"
                                                height="18"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                className="lucide lucide-shield-user"
                                            >
                                                <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
                                                <path d="M6.376 18.91a6 6 0 0 1 11.249.003" />
                                                <circle cx="12" cy="11" r="4" />
                                            </svg>
                                        ) : (
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="18"
                                                height="18"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                className="lucide lucide-user"
                                            >
                                                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                                                <circle cx="12" cy="7" r="4" />
                                            </svg>
                                        )}

                                        <span>{user.role}</span>
                                    </span>

                                </td>

                                {/* <td>
                                    <span className="admin-badge admin-badge-secondary">
                                        {user.provider === 'google' ? '🔵' : '📧'} {user.provider || 'local'}
                                    </span>
                                </td> */}

                                <td>
                                    <div className="status-badges">
                                        {user.is_verified ? (
                                            <span className="admin-badge admin-badge-success" title="Verified">✓</span>
                                        ) : (
                                            <span className="admin-badge admin-badge-danger" title="Not Verified">✗</span>
                                        )}
                                    </div>
                                </td>

                                <td>
                                    <div className="status-badges">
                                        <span
                                            className={`admin-badge admin-badge-${user.is_active ? 'success' : 'danger'}`}
                                            title={user.is_active ? 'Active' : 'Inactive'}
                                        >
                                            {user.is_active ? '🟢' : '🔴'}
                                        </span>
                                    </div>
                                </td>

                                <td className="user-date-cell">
                                    {formatDate(user.created_at)}
                                </td>

                                <td>
                                    <div className="user-actions">
                                        <button
                                            onClick={() => onViewUser(user.id)}
                                            className="admin-button admin-button-secondary user-action-btn"
                                            title="View Details"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye-icon lucide-eye"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" /><circle cx="12" cy="12" r="3" /></svg>
                                        </button>

                                        <button
                                            onClick={() => onToggleStatus(user.id)}
                                            className={`admin-button user-action-btn ${user.is_active ? 'admin-button-warning' : 'admin-button-primary'}`}
                                            title={user.is_active ? 'Deactivate' : 'Activate'}
                                        >
                                            {user.is_active ? 'Deactivate' : 'Activate'}
                                        </button>

                                        <button
                                            onClick={() => onDeleteUser(user.id)}
                                            className="admin-button admin-button-danger user-action-btn"
                                            title="Delete User"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash2-icon lucide-trash-2"><path d="M10 11v6" /><path d="M14 11v6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" /><path d="M3 6h18" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {pagination.totalPages > 1 && (
                <div className="admin-pagination">
                    {renderPagination()}
                </div>
            )}
        </div>
    );
}