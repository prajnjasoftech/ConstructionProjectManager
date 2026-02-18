<?php

use App\Models\Customer;
use App\Models\Project;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

beforeEach(function (): void {
    $this->seed(\Database\Seeders\RolesAndPermissionsSeeder::class);
});

describe('Project Index', function (): void {
    it('shows projects list to authorized user', function (): void {
        $user = User::factory()->create();
        $user->assignRole('sales');

        Project::factory()->count(3)->create();

        $response = $this->actingAs($user)->get('/projects');

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Projects/Index')
            ->has('projects.data', 3)
            ->has('statuses')
        );
    });

    it('allows user role to view projects', function (): void {
        $user = User::factory()->create();
        $user->assignRole('user');

        $response = $this->actingAs($user)->get('/projects');

        $response->assertStatus(200);
    });

    it('denies access to unauthenticated user', function (): void {
        $response = $this->get('/projects');

        $response->assertRedirect('/login');
    });
});

describe('Project Create', function (): void {
    it('shows create form to authorized user', function (): void {
        $user = User::factory()->create();
        $user->assignRole('sales');

        $response = $this->actingAs($user)->get('/projects/create');

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Projects/Create')
            ->has('statuses')
            ->has('customers')
            ->has('managers')
        );
    });

    it('stores project with valid data', function (): void {
        $user = User::factory()->create();
        $user->assignRole('sales');

        $customer = Customer::factory()->create();

        $response = $this->actingAs($user)->post('/projects', [
            'customer_id' => $customer->id,
            'name' => 'Kitchen Renovation',
            'description' => 'Complete kitchen remodel',
            'address' => '123 Main St',
            'city' => 'Test City',
            'state' => 'TC',
            'zip' => '12345',
            'start_date' => '2026-03-01',
            'estimated_end_date' => '2026-06-01',
            'total_budget' => 50000,
            'status' => 'draft',
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('projects', [
            'name' => 'Kitchen Renovation',
            'customer_id' => $customer->id,
            'status' => 'draft',
        ]);
    });

    it('validates required fields', function (): void {
        $user = User::factory()->create();
        $user->assignRole('sales');

        $response = $this->actingAs($user)->post('/projects', []);

        $response->assertSessionHasErrors(['name', 'customer_id']);
    });

    it('validates customer exists', function (): void {
        $user = User::factory()->create();
        $user->assignRole('sales');

        $response = $this->actingAs($user)->post('/projects', [
            'customer_id' => 9999,
            'name' => 'Test Project',
        ]);

        $response->assertSessionHasErrors(['customer_id']);
    });

    it('validates end date after start date', function (): void {
        $user = User::factory()->create();
        $user->assignRole('sales');

        $customer = Customer::factory()->create();

        $response = $this->actingAs($user)->post('/projects', [
            'customer_id' => $customer->id,
            'name' => 'Test Project',
            'start_date' => '2026-06-01',
            'estimated_end_date' => '2026-03-01',
        ]);

        $response->assertSessionHasErrors(['estimated_end_date']);
    });

    it('denies create to user role', function (): void {
        $user = User::factory()->create();
        $user->assignRole('user');

        $response = $this->actingAs($user)->get('/projects/create');

        $response->assertStatus(403);
    });
});

describe('Project Show', function (): void {
    it('shows project details to authorized user', function (): void {
        $user = User::factory()->create();
        $user->assignRole('sales');

        $project = Project::factory()->create();

        $response = $this->actingAs($user)->get("/projects/{$project->id}");

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Projects/Show')
            ->has('project')
            ->has('statuses')
        );
    });

    it('shows project with customer relationship', function (): void {
        $user = User::factory()->create();
        $user->assignRole('sales');

        $customer = Customer::factory()->create();
        $project = Project::factory()->create(['customer_id' => $customer->id]);

        $response = $this->actingAs($user)->get("/projects/{$project->id}");

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Projects/Show')
            ->has('project.customer')
        );
    });
});

describe('Project Edit', function (): void {
    it('shows edit form to authorized user', function (): void {
        $user = User::factory()->create();
        $user->assignRole('sales');

        $project = Project::factory()->create();

        $response = $this->actingAs($user)->get("/projects/{$project->id}/edit");

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Projects/Edit')
            ->has('project')
            ->has('statuses')
            ->has('customers')
            ->has('managers')
        );
    });

    it('updates project with valid data', function (): void {
        $user = User::factory()->create();
        $user->assignRole('sales');

        $project = Project::factory()->create();

        $response = $this->actingAs($user)->put("/projects/{$project->id}", [
            'name' => 'Updated Project Name',
            'status' => 'active',
            'progress_percentage' => 25,
        ]);

        $response->assertRedirect("/projects/{$project->id}");
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('projects', [
            'id' => $project->id,
            'name' => 'Updated Project Name',
            'status' => 'active',
            'progress_percentage' => 25,
        ]);
    });

    it('denies edit to user role', function (): void {
        $user = User::factory()->create();
        $user->assignRole('user');

        $project = Project::factory()->create();

        $response = $this->actingAs($user)->get("/projects/{$project->id}/edit");

        $response->assertStatus(403);
    });
});

describe('Project Delete', function (): void {
    it('deletes project', function (): void {
        $user = User::factory()->create();
        $user->assignRole('admin');

        $project = Project::factory()->create();

        $response = $this->actingAs($user)->delete("/projects/{$project->id}");

        $response->assertRedirect('/projects');
        $response->assertSessionHas('success');

        $this->assertDatabaseMissing('projects', ['id' => $project->id]);
    });

    it('denies delete to sales role', function (): void {
        $user = User::factory()->create();
        $user->assignRole('sales');

        $project = Project::factory()->create();

        $response = $this->actingAs($user)->delete("/projects/{$project->id}");

        $response->assertStatus(403);
    });

    it('denies delete to user role', function (): void {
        $user = User::factory()->create();
        $user->assignRole('user');

        $project = Project::factory()->create();

        $response = $this->actingAs($user)->delete("/projects/{$project->id}");

        $response->assertStatus(403);
    });
});

describe('Project Status Update', function (): void {
    it('updates project status', function (): void {
        $user = User::factory()->create();
        $user->assignRole('sales');

        $project = Project::factory()->draft()->create();

        $response = $this->actingAs($user)->post("/projects/{$project->id}/status", [
            'status' => 'active',
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('projects', [
            'id' => $project->id,
            'status' => 'active',
        ]);
    });

    it('validates status value', function (): void {
        $user = User::factory()->create();
        $user->assignRole('sales');

        $project = Project::factory()->create();

        $response = $this->actingAs($user)->post("/projects/{$project->id}/status", [
            'status' => 'invalid_status',
        ]);

        $response->assertSessionHasErrors(['status']);
    });
});

describe('Project Search', function (): void {
    it('filters projects by name', function (): void {
        $user = User::factory()->create();
        $user->assignRole('sales');

        Project::factory()->create(['name' => 'Kitchen Renovation']);
        Project::factory()->create(['name' => 'Bathroom Remodel']);

        $response = $this->actingAs($user)->get('/projects?search=Kitchen');

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Projects/Index')
            ->has('projects.data', 1)
        );
    });

    it('filters projects by status', function (): void {
        $user = User::factory()->create();
        $user->assignRole('sales');

        Project::factory()->active()->create();
        Project::factory()->active()->create();
        Project::factory()->draft()->create();

        $response = $this->actingAs($user)->get('/projects?status=active');

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Projects/Index')
            ->has('projects.data', 2)
        );
    });

    it('filters projects by customer name', function (): void {
        $user = User::factory()->create();
        $user->assignRole('sales');

        $customer1 = Customer::factory()->create(['name' => 'John Smith']);
        $customer2 = Customer::factory()->create(['name' => 'Jane Doe']);

        Project::factory()->create(['customer_id' => $customer1->id]);
        Project::factory()->create(['customer_id' => $customer2->id]);

        $response = $this->actingAs($user)->get('/projects?search=John');

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Projects/Index')
            ->has('projects.data', 1)
        );
    });

    it('returns all projects when search is empty', function (): void {
        $user = User::factory()->create();
        $user->assignRole('sales');

        Project::factory()->count(3)->create();

        $response = $this->actingAs($user)->get('/projects?search=');

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Projects/Index')
            ->has('projects.data', 3)
        );
    });
});

describe('Project Authorization', function (): void {
    it('allows admin full access', function (): void {
        $user = User::factory()->create();
        $user->assignRole('admin');

        $project = Project::factory()->create();

        $this->actingAs($user)->get('/projects')->assertStatus(200);
        $this->actingAs($user)->get('/projects/create')->assertStatus(200);
        $this->actingAs($user)->get("/projects/{$project->id}")->assertStatus(200);
        $this->actingAs($user)->get("/projects/{$project->id}/edit")->assertStatus(200);
        $this->actingAs($user)->delete("/projects/{$project->id}")->assertRedirect();
    });

    it('allows manager full access except delete', function (): void {
        $user = User::factory()->create();
        $user->assignRole('manager');

        $project = Project::factory()->create();

        $this->actingAs($user)->get('/projects')->assertStatus(200);
        $this->actingAs($user)->get('/projects/create')->assertStatus(200);
        $this->actingAs($user)->get("/projects/{$project->id}")->assertStatus(200);
        $this->actingAs($user)->get("/projects/{$project->id}/edit")->assertStatus(200);
        $this->actingAs($user)->delete("/projects/{$project->id}")->assertStatus(403);
    });

    it('allows sales to create and edit but not delete', function (): void {
        $user = User::factory()->create();
        $user->assignRole('sales');

        $project = Project::factory()->create();

        $this->actingAs($user)->get('/projects')->assertStatus(200);
        $this->actingAs($user)->get('/projects/create')->assertStatus(200);
        $this->actingAs($user)->get("/projects/{$project->id}")->assertStatus(200);
        $this->actingAs($user)->get("/projects/{$project->id}/edit")->assertStatus(200);
        $this->actingAs($user)->delete("/projects/{$project->id}")->assertStatus(403);
    });

    it('allows user role view only', function (): void {
        $user = User::factory()->create();
        $user->assignRole('user');

        $project = Project::factory()->create();

        $this->actingAs($user)->get('/projects')->assertStatus(200);
        $this->actingAs($user)->get('/projects/create')->assertStatus(403);
        $this->actingAs($user)->get("/projects/{$project->id}")->assertStatus(200);
        $this->actingAs($user)->get("/projects/{$project->id}/edit")->assertStatus(403);
        $this->actingAs($user)->delete("/projects/{$project->id}")->assertStatus(403);
    });
});

describe('Project Model', function (): void {
    it('belongs to customer', function (): void {
        $customer = Customer::factory()->create();
        $project = Project::factory()->create(['customer_id' => $customer->id]);

        expect($project->customer)->toBeInstanceOf(Customer::class);
        expect($project->customer->id)->toBe($customer->id);
    });

    it('belongs to manager', function (): void {
        $manager = User::factory()->create();
        $project = Project::factory()->create(['manager_id' => $manager->id]);

        expect($project->manager)->toBeInstanceOf(User::class);
        expect($project->manager->id)->toBe($manager->id);
    });

    it('generates full address', function (): void {
        $project = Project::factory()->create([
            'address' => '123 Main St',
            'city' => 'Test City',
            'state' => 'TC',
            'zip' => '12345',
        ]);

        expect($project->full_address)->toBe('123 Main St, Test City, TC, 12345');
    });

    it('checks status correctly', function (): void {
        $draftProject = Project::factory()->draft()->create();
        $activeProject = Project::factory()->active()->create();
        $completedProject = Project::factory()->completed()->create();

        expect($draftProject->isDraft())->toBeTrue();
        expect($draftProject->isActive())->toBeFalse();

        expect($activeProject->isActive())->toBeTrue();
        expect($activeProject->isDraft())->toBeFalse();

        expect($completedProject->isCompleted())->toBeTrue();
        expect($completedProject->progress_percentage)->toBe(100);
    });
});

describe('Customer Projects Relationship', function (): void {
    it('customer has many projects', function (): void {
        $customer = Customer::factory()->create();
        Project::factory()->count(3)->create(['customer_id' => $customer->id]);

        expect($customer->projects)->toHaveCount(3);
    });

    it('deletes projects when customer is deleted', function (): void {
        $customer = Customer::factory()->create();
        $project = Project::factory()->create(['customer_id' => $customer->id]);

        $customer->delete();

        $this->assertDatabaseMissing('projects', ['id' => $project->id]);
    });
});
