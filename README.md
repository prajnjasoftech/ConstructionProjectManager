# Construction Project Manager

A Laravel-based construction project management system with customer portal, project tracking, and real-time updates. Built with Inertia.js and React.

## Features

### Core Modules

- **Projects Management** - Track construction projects with budget, timeline, and progress
- **Customers Management** - Manage customer information and their projects
- **Leads Management** - Track potential customers through the sales pipeline
- **Follow-ups** - Schedule and track follow-up activities
- **Contact Persons** - Multiple contacts per business entity
- **Users & Roles** - Role-based access control with granular permissions

### Projects

Construction projects with comprehensive tracking:

- **Basic Info**: Name, description, site address (street, city, state, zip)
- **Timeline**: Start date, estimated end date, actual end date
- **Budget**: Total budget tracking
- **Progress**: Percentage completion (0-100%)
- **Status**: draft, active, on_hold, completed, cancelled
- **Relationships**: Linked to customer and assigned manager

### Project Statuses

- `draft` - Project created but not started
- `active` - Project in progress
- `on_hold` - Project temporarily paused
- `completed` - Project finished
- `cancelled` - Project cancelled

### Customer Types

Both Leads and Customers support two entity types:

- **Individual** - Personal contacts with name, email, and phone
- **Business** - Company entities with multiple contact persons

### Search & Filtering

Projects support search and filtering:
- Search by project name, address, city, or customer name
- Filter by status
- Results are paginated

### Lead to Customer Conversion

When a lead reaches "won" status, it can be converted to a customer:
- All lead data is copied to the new customer record
- Contact persons are transferred for business entities
- Original lead is marked as converted

## Tech Stack

- **Backend**: Laravel 12, PHP 8.2+
- **Frontend**: React 19, Inertia.js
- **Styling**: Tailwind CSS, Bootstrap 5
- **Database**: MySQL
- **Authentication**: Laravel built-in
- **Authorization**: Spatie Laravel Permission
- **Testing**: Pest PHP

## Installation

```bash
# Clone the repository
git clone https://github.com/prajnjasoftech/ConstructionProjectManager.git
cd ConstructionProjectManager

# Install dependencies
composer install
npm install

# Configure environment
cp .env.example .env
php artisan key:generate

# Create database
# Create a MySQL database named 'construction_project_manager'

# Run migrations and seed data
php artisan migrate --seed

# Build assets
npm run build

# Start development server
composer dev
```

## Development

```bash
# Run all services concurrently (server, queue, logs, vite)
composer dev

# Or run individually
php artisan serve
npm run dev
```

## Roles & Permissions

### Super Admin
- Full access to all features
- Can manage users and roles
- Can delete any record

### Admin
- Manage users, businesses, leads, customers, projects
- Cannot delete users

### Manager
- View and manage leads, customers, and projects
- View users and businesses
- Cannot delete records

### Sales
- Create and edit leads, customers, and projects
- Manage contact persons and follow-ups
- Cannot delete records

### User
- View-only access to leads, customers, and projects

## API Routes

### Projects
- `GET /projects` - List all projects
- `GET /projects/create` - Show create form
- `POST /projects` - Store new project
- `GET /projects/{project}` - Show project details
- `GET /projects/{project}/edit` - Show edit form
- `PUT /projects/{project}` - Update project
- `DELETE /projects/{project}` - Delete project
- `POST /projects/{project}/status` - Update project status

### Customers
- `GET /customers` - List all customers
- `GET /customers/create` - Show create form
- `POST /customers` - Store new customer
- `GET /customers/{customer}` - Show customer details
- `GET /customers/{customer}/edit` - Show edit form
- `PUT /customers/{customer}` - Update customer
- `DELETE /customers/{customer}` - Delete customer

### Leads
- `GET /leads` - List all leads
- `GET /leads/create` - Show create form
- `POST /leads` - Store new lead
- `GET /leads/{lead}` - Show lead details
- `GET /leads/{lead}/edit` - Show edit form
- `PUT /leads/{lead}` - Update lead
- `DELETE /leads/{lead}` - Delete lead
- `GET /leads/{lead}/convert` - Show conversion form
- `POST /leads/{lead}/convert` - Convert to customer

### Follow-ups
- `GET /{entity}/{id}/follow-ups/create` - Show create form
- `POST /{entity}/{id}/follow-ups` - Store new follow-up
- `PUT /{entity}/{id}/follow-ups/{followUp}` - Update follow-up
- `DELETE /{entity}/{id}/follow-ups/{followUp}` - Delete follow-up
- `POST /{entity}/{id}/follow-ups/{followUp}/complete` - Mark as completed

### Contact Persons
- `GET /{entity}/{id}/contacts/create` - Create contact
- `POST /{entity}/{id}/contacts` - Store contact
- `PUT /{entity}/{id}/contacts/{contact}` - Update contact
- `DELETE /{entity}/{id}/contacts/{contact}` - Delete contact
- `POST /{entity}/{id}/contacts/{contact}/set-primary` - Set as primary

## Testing

```bash
# Run all tests
composer test

# Run specific test file
php artisan test tests/Feature/ProjectTest.php

# Run with filter
php artisan test --filter=ProjectTest
```

## Code Quality

```bash
# Format code with Pint
./vendor/bin/pint

# Run static analysis with PHPStan
./vendor/bin/phpstan analyse

# Run all quality checks
./vendor/bin/pint && ./vendor/bin/phpstan analyse && php artisan test
```

## Project Structure

```
app/
├── Http/
│   ├── Controllers/
│   │   ├── ProjectController.php      # Project CRUD
│   │   ├── CustomerController.php     # Customer CRUD
│   │   ├── LeadController.php         # Lead CRUD
│   │   ├── FollowUpController.php     # Follow-up management
│   │   └── ContactPersonController.php
│   └── Requests/
│       ├── StoreProjectRequest.php
│       ├── UpdateProjectRequest.php
│       └── ...
├── Models/
│   ├── Project.php                    # Project model
│   ├── Customer.php                   # Customer model
│   ├── Lead.php                       # Lead model
│   ├── FollowUp.php                   # Follow-up model
│   └── ContactPerson.php
├── Policies/
│   ├── ProjectPolicy.php              # Project authorization
│   └── ...
└── Services/
    ├── FollowUpService.php
    └── ContactPersonService.php

resources/js/
├── Components/
│   ├── FollowUpForm.jsx
│   ├── FollowUpList.jsx
│   └── ...
└── Pages/
    ├── Projects/
    │   ├── Index.jsx                  # Project list
    │   ├── Create.jsx                 # Create project form
    │   ├── Show.jsx                   # Project details
    │   └── Edit.jsx                   # Edit project form
    ├── Customers/
    ├── Leads/
    └── ...

tests/Feature/
├── ProjectTest.php                    # 33 tests
├── CustomerTest.php                   # 37 tests
├── LeadTest.php                       # 38 tests
└── ...
```

## Roadmap

See [CLAUDE.md](CLAUDE.md) for the full development roadmap.

### Phase 1 - MVP (Current)
- [x] Projects CRUD
- [x] Link projects to customers
- [x] Project status management
- [x] Basic project fields

### Phase 2 - Coming Soon
- [ ] Designs upload with version history
- [ ] Milestones/phases
- [ ] Project updates (photos/notes)
- [ ] Approval workflow
- [ ] Customer portal

### Phase 3
- [ ] Budget tracking & detailed expenses
- [ ] Real-time chat
- [ ] Documents upload
- [ ] PDF reports

### Phase 4
- [ ] Payment tracking
- [ ] Multi-company SaaS
- [ ] Mobile app

## License

This project is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
