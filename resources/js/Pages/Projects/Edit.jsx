import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '../../Layouts/AdminLayout';

export default function Edit({ project, statuses, customers, managers, auth }) {
    const { data, setData, put, processing, errors } = useForm({
        customer_id: project.customer_id || '',
        manager_id: project.manager_id || '',
        name: project.name || '',
        description: project.description || '',
        address: project.address || '',
        city: project.city || '',
        state: project.state || '',
        zip: project.zip || '',
        start_date: project.start_date || '',
        estimated_end_date: project.estimated_end_date || '',
        actual_end_date: project.actual_end_date || '',
        total_budget: project.total_budget || '',
        status: project.status || 'draft',
        progress_percentage: project.progress_percentage || 0,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(`/projects/${project.id}`);
    };

    return (
        <AdminLayout user={auth?.user}>
            <Head title={`Edit Project - ${project.name}`} />

            <div className="page-header">
                <h1 className="page-title">Edit Project</h1>
                <p className="page-subtitle">{project.name}</p>
            </div>

            <div className="row">
                <div className="col-lg-8">
                    <form onSubmit={handleSubmit}>
                        <div className="admin-card mb-4">
                            <div className="card-header">
                                <h2 className="card-title">Project Information</h2>
                            </div>
                            <div className="card-body">
                                <div className="row g-3">
                                    <div className="col-md-12">
                                        <label className="form-label">Project Name *</label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                        />
                                        {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label">Customer *</label>
                                        <select
                                            className={`form-select ${errors.customer_id ? 'is-invalid' : ''}`}
                                            value={data.customer_id}
                                            onChange={(e) => setData('customer_id', e.target.value)}
                                        >
                                            <option value="">Select Customer</option>
                                            {customers.map((customer) => (
                                                <option key={customer.id} value={customer.id}>{customer.name}</option>
                                            ))}
                                        </select>
                                        {errors.customer_id && <div className="invalid-feedback">{errors.customer_id}</div>}
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label">Project Manager</label>
                                        <select
                                            className={`form-select ${errors.manager_id ? 'is-invalid' : ''}`}
                                            value={data.manager_id}
                                            onChange={(e) => setData('manager_id', e.target.value)}
                                        >
                                            <option value="">Unassigned</option>
                                            {managers.map((manager) => (
                                                <option key={manager.id} value={manager.id}>{manager.name}</option>
                                            ))}
                                        </select>
                                        {errors.manager_id && <div className="invalid-feedback">{errors.manager_id}</div>}
                                    </div>

                                    <div className="col-12">
                                        <label className="form-label">Description</label>
                                        <textarea
                                            className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                                            rows="3"
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                        />
                                        {errors.description && <div className="invalid-feedback">{errors.description}</div>}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="admin-card mb-4">
                            <div className="card-header">
                                <h2 className="card-title">Project Site Address</h2>
                            </div>
                            <div className="card-body">
                                <div className="row g-3">
                                    <div className="col-12">
                                        <label className="form-label">Street Address</label>
                                        <textarea
                                            className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                                            rows="2"
                                            value={data.address}
                                            onChange={(e) => setData('address', e.target.value)}
                                        />
                                        {errors.address && <div className="invalid-feedback">{errors.address}</div>}
                                    </div>

                                    <div className="col-md-5">
                                        <label className="form-label">City</label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.city ? 'is-invalid' : ''}`}
                                            value={data.city}
                                            onChange={(e) => setData('city', e.target.value)}
                                        />
                                        {errors.city && <div className="invalid-feedback">{errors.city}</div>}
                                    </div>

                                    <div className="col-md-4">
                                        <label className="form-label">State</label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.state ? 'is-invalid' : ''}`}
                                            value={data.state}
                                            onChange={(e) => setData('state', e.target.value)}
                                        />
                                        {errors.state && <div className="invalid-feedback">{errors.state}</div>}
                                    </div>

                                    <div className="col-md-3">
                                        <label className="form-label">ZIP Code</label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.zip ? 'is-invalid' : ''}`}
                                            value={data.zip}
                                            onChange={(e) => setData('zip', e.target.value)}
                                        />
                                        {errors.zip && <div className="invalid-feedback">{errors.zip}</div>}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="admin-card mb-4">
                            <div className="card-header">
                                <h2 className="card-title">Timeline & Budget</h2>
                            </div>
                            <div className="card-body">
                                <div className="row g-3">
                                    <div className="col-md-4">
                                        <label className="form-label">Start Date</label>
                                        <input
                                            type="date"
                                            className={`form-control ${errors.start_date ? 'is-invalid' : ''}`}
                                            value={data.start_date}
                                            onChange={(e) => setData('start_date', e.target.value)}
                                        />
                                        {errors.start_date && <div className="invalid-feedback">{errors.start_date}</div>}
                                    </div>

                                    <div className="col-md-4">
                                        <label className="form-label">Estimated End Date</label>
                                        <input
                                            type="date"
                                            className={`form-control ${errors.estimated_end_date ? 'is-invalid' : ''}`}
                                            value={data.estimated_end_date}
                                            onChange={(e) => setData('estimated_end_date', e.target.value)}
                                        />
                                        {errors.estimated_end_date && <div className="invalid-feedback">{errors.estimated_end_date}</div>}
                                    </div>

                                    <div className="col-md-4">
                                        <label className="form-label">Actual End Date</label>
                                        <input
                                            type="date"
                                            className={`form-control ${errors.actual_end_date ? 'is-invalid' : ''}`}
                                            value={data.actual_end_date}
                                            onChange={(e) => setData('actual_end_date', e.target.value)}
                                        />
                                        {errors.actual_end_date && <div className="invalid-feedback">{errors.actual_end_date}</div>}
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label">Total Budget ($)</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            className={`form-control ${errors.total_budget ? 'is-invalid' : ''}`}
                                            value={data.total_budget}
                                            onChange={(e) => setData('total_budget', e.target.value)}
                                        />
                                        {errors.total_budget && <div className="invalid-feedback">{errors.total_budget}</div>}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="d-flex justify-content-end gap-2">
                            <Link href={`/projects/${project.id}`} className="btn btn-outline-secondary">
                                Cancel
                            </Link>
                            <button type="submit" className="btn btn-primary" disabled={processing}>
                                {processing ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>

                <div className="col-lg-4">
                    <div className="admin-card mb-4">
                        <div className="card-header">
                            <h2 className="card-title">Status</h2>
                        </div>
                        <div className="card-body">
                            {Object.entries(statuses).map(([value, label]) => (
                                <div className="form-check mb-2" key={value}>
                                    <input
                                        type="radio"
                                        className="form-check-input"
                                        id={`status-${value}`}
                                        checked={data.status === value}
                                        onChange={() => setData('status', value)}
                                    />
                                    <label className="form-check-label" htmlFor={`status-${value}`}>
                                        {label}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="admin-card">
                        <div className="card-header">
                            <h2 className="card-title">Progress</h2>
                        </div>
                        <div className="card-body">
                            <label className="form-label">Completion Percentage: {data.progress_percentage}%</label>
                            <input
                                type="range"
                                className="form-range"
                                min="0"
                                max="100"
                                value={data.progress_percentage}
                                onChange={(e) => setData('progress_percentage', parseInt(e.target.value))}
                            />
                            <div className="progress mt-2">
                                <div
                                    className="progress-bar bg-primary"
                                    style={{ width: `${data.progress_percentage}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
