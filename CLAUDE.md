# Construction Project Manager

## Project Overview
A construction company project management system where customers get real-time updates on their projects including photos, budget updates, progress percentage, and designs.

**Platforms:** Web + Mobile (mobile tech TBD - separate discussion)

**Based on:** CRMBaseKit (Laravel 12 + React/Inertia.js)

---

## User Roles

| Role | Access |
|------|--------|
| **Super Admin** | Full system access, manage companies (SaaS future) |
| **Manager** | Projects, budgets, expenses, approve updates, assign workers, chat, reports |
| **Field Worker** | Submit updates (photos/notes), view assigned projects only |
| **Customer** | View-only dashboard, chat, notifications |

---

## Core Features (Planned)

### Projects
- Name, description, site address
- Linked to customer
- Start date, estimated end date
- Status: draft, active, on_hold, completed, cancelled
- Total budget
- Assigned manager + field workers

### Designs
- Upload at project creation
- Types: floor_plan, elevation, electrical, plumbing, etc.
- Version history (v1 → v2 when revised)
- Customer can view designs

### Milestones/Phases
- Customizable per project (Foundation, Framing, Roofing, Electrical, Finishing, etc.)
- Target date, completion date
- Status: pending, in_progress, completed
- Visual progress indicator for customer

### Project Updates
- Submitted by field workers (mobile-friendly)
- Can include: notes only, photos only, or both
- Photos from camera or gallery
- Offline support needed (sync when connected)
- **Approval workflow:**
  1. Field worker submits → Manager sees real-time
  2. Manager approves/rejects/edits
  3. After approval → Customer sees immediately + push notification

### Budget & Expenses
- Full breakdown by category (labor, materials, permits, equipment, etc.)
- Estimated vs Spent vs Remaining
- Visual graph (spent vs remaining)
- Only managers enter expenses
- Customer sees full transparency

### Documents
- Contracts, permits, invoices, inspection reports
- Upload and organize per project

### Payments
- Track customer payments against budget
- Payment history

### Real-time Chat
- Customer ↔ Manager direct messaging
- Chat history saved
- Push notifications for new messages
- WebSockets needed (Laravel Reverb/Pusher)

### Reports
- Downloadable PDF reports
- Project summary, budget reports, timeline reports

### Notifications
- **Customer:** new update approved, new chat message
- **Manager:** new update pending, new chat message, milestone due
- **Field Worker:** assigned to project, update rejected
- Push (mobile) + in-app (web + mobile)

---

## Customer Portal Features
- Login with credentials
- Dashboard with:
  - Project completion % (graph)
  - Budget usage (graph - spent vs remaining)
  - Recent updates
  - Notifications
- View project details, designs, milestones, updates
- Real-time chat with manager
- View-only access (no editing)
- Multiple projects possible (rare, but supported)

---

## Development Phases

### Phase 1 - MVP (COMPLETED)
- [x] Projects CRUD (create, update, status change)
- [x] Link projects to customers
- [x] Project model with customer/manager relationships
- [x] Basic project fields: name, customer, address, dates, status, budget, progress
- [x] ProjectController with full CRUD + status update
- [x] Form requests with validation
- [x] ProjectPolicy for authorization
- [x] React pages (Index, Create, Edit, Show)
- [x] Comprehensive tests (33 tests, 174 assertions)
- [x] Search by name, address, city, customer
- [x] Filter by status

### Phase 2 (Next)
- [ ] Designs upload with version history
- [ ] Milestones/phases
- [ ] Project updates (photos/notes)
- [ ] Approval workflow
- [ ] Customer portal (view project, progress)
- [ ] Basic notifications

### Phase 3
- [ ] Budget tracking & detailed expenses
- [ ] Real-time chat (WebSockets)
- [ ] Documents upload
- [ ] PDF reports

### Phase 4
- [ ] Payment tracking
- [ ] Multi-company SaaS
- [ ] Advanced analytics
- [ ] Mobile app (separate discussion)

---

## Technical Decisions

### Existing from CRMBaseKit (to repurpose/modify)
- Users, authentication, roles & permissions (Spatie)
- Customers model (will link to Projects)
- Leads model (may remove or repurpose)
- Businesses model (may remove or repurpose for contractors)
- Follow-ups model (may repurpose for updates/milestones)
- Contact persons (may keep for customer contacts)

### New Models Needed
- Project
- ProjectDesign
- ProjectMilestone
- ProjectUpdate
- ProjectUpdatePhoto
- ProjectExpense (budget items)
- ProjectDocument
- ProjectPayment
- ChatMessage

### Tech Stack
- **Backend:** Laravel 12, MySQL
- **Frontend:** React + Inertia.js
- **Styling:** Tailwind CSS, Bootstrap
- **Real-time:** Laravel Reverb or Pusher (for chat)
- **Mobile:** TBD (React Native / Flutter - separate discussion)

---

## Database Schema (Planned)

### projects
```
id, customer_id, manager_id, name, description, address, city, state, zip
start_date, estimated_end_date, actual_end_date
total_budget, status (draft/active/on_hold/completed/cancelled)
created_at, updated_at
```

### project_designs
```
id, project_id, title, description, file_path, file_type
design_type (floor_plan/elevation/electrical/plumbing/etc)
version, is_current, uploaded_by
created_at, updated_at
```

### project_milestones
```
id, project_id, name, description, sort_order
target_date, completed_date, status (pending/in_progress/completed)
created_at, updated_at
```

### project_updates
```
id, project_id, user_id (field worker), notes
progress_percentage, status (pending/approved/rejected)
approved_by, approved_at, visible_to_customer
created_at, updated_at
```

### project_update_photos
```
id, project_update_id, file_path, caption
created_at, updated_at
```

### project_expenses
```
id, project_id, category (labor/materials/permits/equipment/other)
description, estimated_amount, actual_amount
date, entered_by
created_at, updated_at
```

### project_documents
```
id, project_id, title, file_path, document_type
uploaded_by, visible_to_customer
created_at, updated_at
```

### project_payments
```
id, project_id, amount, payment_date, payment_method
reference_number, notes, received_by
created_at, updated_at
```

### project_team (pivot)
```
id, project_id, user_id, role (manager/worker)
assigned_at, assigned_by
```

### chat_messages
```
id, project_id, sender_id, receiver_id, message
read_at, created_at, updated_at
```

---

## Development Workflow (MUST FOLLOW)

### Git Branching Strategy
- **main** branch is always production-ready and synced with origin
- Every feature/step gets a new branch from main
- Branch naming: `feature/<feature-name>` (e.g., `feature/project-model`)
- After PR merged, delete feature branch and sync main

### Before Every PR
Run ALL of these and ensure they pass:

```bash
# 1. Code formatting (Pint)
./vendor/bin/pint

# 2. Static analysis (Larastan)
./vendor/bin/phpstan analyse

# 3. Tests (Pest)
php artisan test

# Or run all at once:
composer test
```

### Quality Requirements
- **Tests:** Every new model, controller, service MUST have tests
- **Larastan:** Code must pass static analysis (level 5+)
- **Pint:** Code must be formatted before commit
- **No skipping:** Never use --no-verify or skip checks

### Workflow Per Feature

```
1. git checkout main
2. git pull origin main
3. git checkout -b feature/<feature-name>
4. Write code + tests
5. ./vendor/bin/pint (format)
6. ./vendor/bin/phpstan analyse (static analysis)
7. php artisan test (all tests pass)
8. git add . && git commit
9. git push -u origin feature/<feature-name>
10. Create PR → Review → Merge
11. git checkout main && git pull origin main
12. Delete feature branch
```

### Test Coverage Requirements
Each feature must include tests for:
- Model relationships & attributes
- Controller CRUD operations
- Authorization (who can access what)
- Validation rules
- Edge cases

---

## Current Status
**Phase:** Phase 1 MVP COMPLETED
**Branch:** `feature/project-model` (pending merge to main)
**Tests:** 217 total (33 new for Projects)
**Next Step:** Merge PR, then start Phase 2 (Designs, Milestones, Updates)

### Completed Features
- Project model with full CRUD
- Customer-Project relationship
- Project status management
- Progress percentage tracking
- Search and filtering
- Role-based authorization
- Comprehensive test coverage
