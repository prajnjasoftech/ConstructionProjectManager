import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '../../Layouts/AdminLayout';

export default function Show({ project, statuses, auth, flash }) {
    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this project?')) {
            router.delete(`/projects/${project.id}`);
        }
    };

    const handleStatusChange = (newStatus) => {
        router.post(`/projects/${project.id}/status`, { status: newStatus });
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
        }).format(amount || 0);
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <AdminLayout user={auth?.user}>
            <Head title={`Project - ${project.name}`} />

            <div className="page-header d-flex justify-content-between align-items-center">
                <div>
                    <h1 className="page-title">{project.name}</h1>
                    <p className="page-subtitle">
                        <Link href={`/customers/${project.customer?.id}`} className="text-decoration-none">
                            {project.customer?.name}
                        </Link>
                    </p>
                </div>
                <div className="d-flex gap-2">
                    <Link href={`/projects/${project.id}/edit`} className="btn btn-primary">
                        <i className="bi bi-pencil me-2"></i>
                        Edit Project
                    </Link>
                    <button onClick={handleDelete} className="btn btn-outline-danger">
                        <i className="bi bi-trash me-2"></i>
                        Delete
                    </button>
                </div>
            </div>

            {flash?.success && (
                <div className="alert alert-success alert-dismissible fade show" role="alert">
                    {flash.success}
                    <button type="button" className="btn-close" data-bs-dismiss="alert"></button>
                </div>
            )}

            <div className="row">
                <div className="col-lg-8">
                    <div className="admin-card mb-4">
                        <div className="card-header">
                            <h2 className="card-title">Project Details</h2>
                        </div>
                        <div className="card-body">
                            {project.description && (
                                <div className="mb-4">
                                    <h6 className="text-muted mb-2">Description</h6>
                                    <p>{project.description}</p>
                                </div>
                            )}

                            <div className="row g-4">
                                <div className="col-md-6">
                                    <h6 className="text-muted mb-2">Site Address</h6>
                                    {project.address || project.city || project.state ? (
                                        <address className="mb-0">
                                            {project.address && <div>{project.address}</div>}
                                            {(project.city || project.state || project.zip) && (
                                                <div>
                                                    {project.city}{project.city && project.state && ', '}
                                                    {project.state} {project.zip}
                                                </div>
                                            )}
                                        </address>
                                    ) : (
                                        <span className="text-muted">No address provided</span>
                                    )}
                                </div>

                                <div className="col-md-6">
                                    <h6 className="text-muted mb-2">Project Manager</h6>
                                    <p className="mb-0">{project.manager?.name || 'Unassigned'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="admin-card mb-4">
                        <div className="card-header">
                            <h2 className="card-title">Timeline</h2>
                        </div>
                        <div className="card-body">
                            <div className="row g-4">
                                <div className="col-md-4">
                                    <h6 className="text-muted mb-2">Start Date</h6>
                                    <p className="mb-0">{formatDate(project.start_date)}</p>
                                </div>
                                <div className="col-md-4">
                                    <h6 className="text-muted mb-2">Estimated End Date</h6>
                                    <p className="mb-0">{formatDate(project.estimated_end_date)}</p>
                                </div>
                                <div className="col-md-4">
                                    <h6 className="text-muted mb-2">Actual End Date</h6>
                                    <p className="mb-0">{formatDate(project.actual_end_date)}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="admin-card mb-4">
                        <div className="card-header">
                            <h2 className="card-title">Customer Information</h2>
                        </div>
                        <div className="card-body">
                            <div className="row g-4">
                                <div className="col-md-4">
                                    <h6 className="text-muted mb-2">Customer Name</h6>
                                    <p className="mb-0">
                                        <Link href={`/customers/${project.customer?.id}`} className="text-decoration-none">
                                            {project.customer?.name || '-'}
                                        </Link>
                                    </p>
                                </div>
                                <div className="col-md-4">
                                    <h6 className="text-muted mb-2">Email</h6>
                                    <p className="mb-0">
                                        {project.customer?.email ? (
                                            <a href={`mailto:${project.customer.email}`}>{project.customer.email}</a>
                                        ) : '-'}
                                    </p>
                                </div>
                                <div className="col-md-4">
                                    <h6 className="text-muted mb-2">Phone</h6>
                                    <p className="mb-0">
                                        {project.customer?.phone ? (
                                            <a href={`tel:${project.customer.phone}`}>{project.customer.phone}</a>
                                        ) : '-'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-4">
                    <div className="admin-card mb-4">
                        <div className="card-header">
                            <h2 className="card-title">Status</h2>
                        </div>
                        <div className="card-body">
                            <span className={`badge ${statusColors[project.status]} mb-3`} style={{ fontSize: '1rem' }}>
                                {statuses[project.status] || project.status}
                            </span>

                            <div className="mt-3">
                                <label className="form-label text-muted small">Change Status</label>
                                <select
                                    className="form-select"
                                    value={project.status}
                                    onChange={(e) => handleStatusChange(e.target.value)}
                                >
                                    {Object.entries(statuses).map(([value, label]) => (
                                        <option key={value} value={value}>{label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="admin-card mb-4">
                        <div className="card-header">
                            <h2 className="card-title">Progress</h2>
                        </div>
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <span className="text-muted">Completion</span>
                                <span className="fw-bold">{project.progress_percentage}%</span>
                            </div>
                            <div className="progress" style={{ height: '12px' }}>
                                <div
                                    className="progress-bar bg-primary"
                                    style={{ width: `${project.progress_percentage}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>

                    <div className="admin-card mb-4">
                        <div className="card-header">
                            <h2 className="card-title">Budget</h2>
                        </div>
                        <div className="card-body">
                            <div className="text-center">
                                <h3 className="mb-0">{formatCurrency(project.total_budget)}</h3>
                                <small className="text-muted">Total Budget</small>
                            </div>
                        </div>
                    </div>

                    <div className="admin-card">
                        <div className="card-header">
                            <h2 className="card-title">Quick Actions</h2>
                        </div>
                        <div className="card-body">
                            <div className="d-grid gap-2">
                                <Link href={`/projects/${project.id}/edit`} className="btn btn-outline-primary">
                                    <i className="bi bi-pencil me-2"></i>
                                    Edit Project
                                </Link>
                                <Link href="/projects" className="btn btn-outline-secondary">
                                    <i className="bi bi-arrow-left me-2"></i>
                                    Back to Projects
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
