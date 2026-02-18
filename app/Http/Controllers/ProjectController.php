<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\StoreProjectRequest;
use App\Http\Requests\UpdateProjectRequest;
use App\Models\Customer;
use App\Models\Project;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProjectController extends Controller
{
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', Project::class);

        $search = $request->string('search')->toString();
        $status = $request->string('status')->toString();

        $projects = Project::query()
            ->with(['customer:id,name', 'manager:id,name'])
            ->when($search !== '', function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('address', 'like', "%{$search}%")
                        ->orWhere('city', 'like', "%{$search}%")
                        ->orWhereHas('customer', function ($q) use ($search) {
                            $q->where('name', 'like', "%{$search}%");
                        });
                });
            })
            ->when($status !== '', function ($query) use ($status) {
                $query->where('status', $status);
            })
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Projects/Index', [
            'projects' => $projects,
            'statuses' => Project::getStatuses(),
            'filters' => [
                'search' => $search,
                'status' => $status,
            ],
        ]);
    }

    public function create(Request $request): Response
    {
        $this->authorize('create', Project::class);

        $customerId = $request->query('customer_id');

        return Inertia::render('Projects/Create', [
            'statuses' => Project::getStatuses(),
            'customers' => $this->getCustomers(),
            'managers' => $this->getManagers(),
            'selectedCustomerId' => $customerId ? (int) $customerId : null,
        ]);
    }

    public function store(StoreProjectRequest $request): RedirectResponse
    {
        $this->authorize('create', Project::class);

        $project = Project::create($request->validated());

        return redirect()->route('projects.show', $project)
            ->with('success', 'Project created successfully.');
    }

    public function show(Project $project): Response
    {
        $this->authorize('view', $project);

        $project->load(['customer:id,name,email,phone', 'manager:id,name']);

        return Inertia::render('Projects/Show', [
            'project' => $project,
            'statuses' => Project::getStatuses(),
        ]);
    }

    public function edit(Project $project): Response
    {
        $this->authorize('update', $project);

        $project->load(['customer:id,name', 'manager:id,name']);

        return Inertia::render('Projects/Edit', [
            'project' => $project,
            'statuses' => Project::getStatuses(),
            'customers' => $this->getCustomers(),
            'managers' => $this->getManagers(),
        ]);
    }

    public function update(UpdateProjectRequest $request, Project $project): RedirectResponse
    {
        $this->authorize('update', $project);

        $project->update($request->validated());

        return redirect()->route('projects.show', $project)
            ->with('success', 'Project updated successfully.');
    }

    public function destroy(Project $project): RedirectResponse
    {
        $this->authorize('delete', $project);

        $project->delete();

        return redirect()->route('projects.index')
            ->with('success', 'Project deleted successfully.');
    }

    /**
     * Update project status.
     */
    public function updateStatus(Request $request, Project $project): RedirectResponse
    {
        $this->authorize('update', $project);

        $request->validate([
            'status' => ['required', 'in:'.implode(',', array_keys(Project::getStatuses()))],
        ]);

        $project->update(['status' => $request->input('status')]);

        return redirect()->back()
            ->with('success', 'Project status updated successfully.');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Collection<int, Customer>
     */
    private function getCustomers(): \Illuminate\Database\Eloquent\Collection
    {
        return Customer::query()
            ->select(['id', 'name'])
            ->where('status', Customer::STATUS_ACTIVE)
            ->orderBy('name')
            ->get();
    }

    /**
     * @return \Illuminate\Database\Eloquent\Collection<int, User>
     */
    private function getManagers(): \Illuminate\Database\Eloquent\Collection
    {
        return User::query()
            ->select(['id', 'name'])
            ->whereHas('roles', function ($query) {
                $query->whereIn('name', ['super-admin', 'admin', 'manager']);
            })
            ->orderBy('name')
            ->get();
    }
}
