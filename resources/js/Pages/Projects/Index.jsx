import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '../../Layouts/AdminLayout';

export default function Index({ projects, statuses, auth, flash, filters }) {
    const [search, setSearch] = useState(filters?.search || '');
    const [status, setStatus] = useState(filters?.status || '');

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this project?')) {
            router.delete(`/projects/${id}`);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        router.get('/projects', { search, status }, { preserveState: true, preserveScroll: true });
    };

    const handleStatusFilter = (e) => {
        const newStatus = e.target.value;
        setStatus(newStatus);
        router.get('/projects', { search, status: newStatus }, { preserveState: true, preserveScroll: true });
    };

    const clearFilters = () => {
        setSearch('');
        setStatus('');
        router.get('/projects', {}, { preserveState: true, preserveScroll: true });
    };

    const statusColors = {
        draft: 'bg-secondary',
        active: 'bg-success',
        on_hold: 'bg-warning',
        completed: 'bg-info',
        cancelled: 'bg-danger',
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <AdminLayout user={auth?.user}>
            <Head title="Projects" />

            <div className="page-header d-flex justify-content-between align-items-center">
                <div>
                    <h1 className="page-title">Projects</h1>
                    <p className="page-subtitle">Manage construction projects</p>
                </div>
                <Link href="/projects/create" className="btn btn-primary">
                    <i className="bi bi-plus-lg me-2"></i>
                    Add Project
                </Link>
            </div>

            {flash?.success && (
                <div className="alert alert-success alert-dismissible fade show" role="alert">
                    {flash.success}
                    <button type="button" className="btn-close" data-bs-dismiss="alert"></button>
                </div>
            )}

            <div className="admin-card mb-3">
                <div className="card-body">
                    <form onSubmit={handleSearch} className="d-flex gap-2 flex-wrap">
                        <div className="input-group flex-grow-1">
                            <span className="input-group-text">
                                <i className="bi bi-search"></i>
                            </span>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search by name, address, or customer..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <select
                            className="form-select"
                            style={{ width: 'auto' }}
                            value={status}
                            onChange={handleStatusFilter}
                        >
                            <option value="">All Statuses</option>
                            {Object.entries(statuses).map(([key, label]) => (
                                <option key={key} value={key}>{label}</option>
                            ))}
                        </select>
                        <button type="submit" className="btn btn-primary">Search</button>
                        {(search || status) && (
                            <button type="button" className="btn btn-outline-secondary" onClick={clearFilters}>
                                Clear
                            </button>
                        )}
                    </form>
                </div>
            </div>

            <div className="admin-card">
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Project Name</th>
                                    <th>Customer</th>
                                    <th>Location</th>
                                    <th>Budget</th>
                                    <th>Progress</th>
                                    <th>Status</th>
                                    <th>Manager</th>
                                    <th width="120">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {projects.data.length === 0 ? (
                                    <tr>
                                        <td colSpan="8" className="text-center text-muted py-4">
                                            No projects found. Create your first project.
                                        </td>
                                    </tr>
                                ) : (
                                    projects.data.map((project) => (
                                        <tr key={project.id}>
                                            <td>
                                                <Link href={`/projects/${project.id}`} className="fw-medium text-decoration-none">
                                                    {project.name}
                                                </Link>
                                                <div className="small text-muted">
                                                    {formatDate(project.start_date)} - {formatDate(project.estimated_end_date)}
                                                </div>
                                            </td>
                                            <td>
                                                <Link href={`/customers/${project.customer?.id}`} className="text-decoration-none">
                                                    {project.customer?.name || '-'}
                                                </Link>
                                            </td>
                                            <td>
                                                {project.city && project.state ? (
                                                    <span>{project.city}, {project.state}</span>
                                                ) : (
                                                    <span className="text-muted">-</span>
                                                )}
                                            </td>
                                            <td>{formatCurrency(project.total_budget)}</td>
                                            <td>
                                                <div className="d-flex align-items-center gap-2">
                                                    <div className="progress flex-grow-1" style={{ height: '8px', width: '80px' }}>
                                                        <div
                                                            className="progress-bar bg-primary"
                                                            style={{ width: `${project.progress_percentage}%` }}
                                                        ></div>
                                                    </div>
                                                    <small>{project.progress_percentage}%</small>
                                                </div>
                                            </td>
                                            <td>
                                                <span className={`badge ${statusColors[project.status] || 'bg-secondary'}`}>
                                                    {statuses[project.status] || project.status}
                                                </span>
                                            </td>
                                            <td>{project.manager?.name || '-'}</td>
                                            <td>
                                                <div className="d-flex gap-1">
                                                    <Link
                                                        href={`/projects/${project.id}`}
                                                        className="btn btn-action btn-outline-secondary"
                                                        title="View"
                                                    >
                                                        <i className="bi bi-eye"></i>
                                                    </Link>
                                                    <Link
                                                        href={`/projects/${project.id}/edit`}
                                                        className="btn btn-action btn-outline-primary"
                                                        title="Edit"
                                                    >
                                                        <i className="bi bi-pencil"></i>
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(project.id)}
                                                        className="btn btn-action btn-outline-danger"
                                                        title="Delete"
                                                    >
                                                        <i className="bi bi-trash"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {projects.last_page > 1 && (
                    <div className="card-footer">
                        <nav>
                            <ul className="pagination pagination-sm mb-0 justify-content-center">
                                {projects.links.map((link, index) => (
                                    <li key={index} className={`page-item ${link.active ? 'active' : ''} ${!link.url ? 'disabled' : ''}`}>
                                        <Link
                                            href={link.url || '#'}
                                            className="page-link"
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
