# GridFlex Portal Onboarding Guide

This guide is for a new teammate who needs to understand how the GridFlex portal works before touching much code. It explains the business decisions behind the main flows: how the portal is organized, how users get access, how regions and other units depend on each other, how customer and meter setup works, and why approvals appear in the process.

The examples here are based on the current frontend implementation in `gridflex`. Backend rules may add extra validation, but this is the portal behavior a user sees.

## 1. The Short Version

GridFlex is an operations portal for managing an electricity distribution business. The portal is built around five ideas:

1. **Organization hierarchy**: the business is divided into nodes such as Root, Region, Business Hub, Service Center, Substation, Feeder Line, and DSS.
2. **Permission groups**: a group decides which modules a user can see and what actions they can perform.
3. **Users**: every user belongs to one organization node and one permission group.
4. **Operational master data**: bands, tariffs, meters, customers, debt settings, and meter manufacturers must be configured before daily work can happen.
5. **Review and Approval**: important Data Management changes are staged for approval before becoming fully active.

In practice, onboarding a new operating area follows the activity diagrams in the next section. If a button or page is missing, first check the user's permission group and node type.

## 2. Diagrams

These diagrams summarize the operating model before the guide explains each area in detail.

### 2.1 System Context Diagram

This shows the major systems and actors around the GridFlex portal.

```mermaid
flowchart LR
  AdminPortal["Admin Portal"] --> OrgTree["Organization Tree"]
  OrgTree --> GridFlex["GridFlex Portal"]

  FirstAdmin["First Admin"] --> GridFlex
  OpsUsers["Operations Users"] --> GridFlex
  Approver["Approver"] --> GridFlex
  VendingOperator["Vending Operator"] --> GridFlex
  HesOperator["HES Operator"] --> GridFlex

  GridFlex --> MainBackend["GridFlex Backend Service"]
  GridFlex --> HesBackend["HES Backend Service"]

  MainBackend --> Customers["Customers"]
  MainBackend --> Meters["Meters"]
  MainBackend --> Tariffs["Bands, Tariffs, Debt Settings"]
  MainBackend --> Approvals["Approval Records"]
  MainBackend --> Vending["Vending Transactions"]

  HesBackend --> MeterComms["Meter Communication Data"]
```

### 2.2 Onboarding Activity Diagram

This is the main onboarding activity flow. It reflects the current operating decision that the organization tree is created from the admin portal before the first admin creates users in GridFlex.

```mermaid
flowchart TD
  A["Admin Portal creates organization tree"] --> B["First admin logs into GridFlex"]
  B --> C["First admin creates permission groups"]
  C --> D["First admin creates users and attaches each user to a node"]
  D --> E["Data manager configures bands, tariffs, debt settings, and manufacturers"]
  E --> F["Approver reviews pending master data"]
  F --> G{"Approved?"}
  G -->|Yes| H["Business Hub or Service Center user adds/uploads customers"]
  G -->|No| E
  H --> I["Meter is created or confirmed available"]
  I --> J["Assign meter from Meters submodule"]
  J --> K["Approve assigned meter where required"]
  K --> L["Assigned meter appears in Assigned Meter table"]
  L --> M["Apply debit/credit adjustments when needed"]
  M --> N["Vend tokens, monitor reports, HES, and audit logs"]
```

### 2.3 User And Access Diagram

This shows the main user types and the work they normally perform.

```mermaid
flowchart TB
  FirstAdmin["First Admin\nUser Management only"] --> Groups["Create permission groups"]
  FirstAdmin --> Users["Create users"]

  DataManager["Data Manager"] --> MasterData["Configure bands, tariffs, debt settings, manufacturers, meters"]
  DataManager --> Customers["Manage customers if attached to Business Hub or Service Center"]

  Approver["Approver"] --> Review["Review and Approval"]
  Review --> Approve["Approve pending records"]
  Review --> Reject["Reject pending records"]

  BhScUser["Business Hub / Service Center User"] --> AddCustomers["Add or upload customers"]
  BhScUser --> CustomerActions["Edit customer details, assign meters, block/unblock where permitted"]

  VendingOperator["Vending Operator"] --> Tokens["Generate and print vending tokens"]
  HesOperator["HES Operator"] --> HesWork["View communication, realtime data, profile/events, remote configuration"]
  Auditor["Auditor"] --> AuditReports["Review audit logs and reports"]
```

### 2.4 Customer And Meter Activity Diagram

This focuses on the customer-to-meter relationship. The important point is that meter assignment starts from `Meters`, while `Assigned Meter` is the management view after assignment.

```mermaid
flowchart TD
  A["Business Hub or Service Center user creates/uploads customer"] --> B["Confirm meter exists and is available"]
  B --> C["Open Data Management > Meter Management > Meters"]
  C --> D["Select assignment action"]
  D --> E["Select customer and meter"]
  E --> F["Provide payment mode and image details where required"]
  F --> G["Submit assignment"]
  G --> H["Approve assigned meter where required"]
  H --> I["Assigned meter appears in Assigned Meter table"]
  I --> J{"Later action needed?"}
  J -->|Detach| K["Use Assigned Meter to detach"]
  J -->|Edit assigned info| L["Use Assigned Meter to edit assigned information"]
  J -->|No| M["Use customer-meter relationship for vending, adjustments, reports"]
```

### 2.5 Approval State Diagram

This diagram captures the rejection rule: rejecting a newly created meter deletes it, while other rejected changes return to the prior state.

```mermaid
stateDiagram-v2
  [*] --> Draft: user creates or edits
  Draft --> Pending: save/submit
  Pending --> Approved: approve
  Pending --> Deleted: reject meter create
  Pending --> PriorState: reject other changes
  Approved --> Active: available for use
  Deleted --> [*]
  PriorState --> [*]
```

### 2.6 Module Dependency Diagram

This shows why the setup order matters.

```mermaid
flowchart LR
  Org["Organization Tree"] --> Users["Users"]
  Groups["Permission Groups"] --> Users
  Groups --> Navigation["Sidebar and actions"]

  Org --> Customers["Customers"]
  Manufacturers["Meter Manufacturers"] --> Meters["Meters"]
  Bands["Bands"] --> Tariffs["Tariffs"]
  Bands --> DebtSettings["Debt Settings"]
  DebtSettings --> Adjustments["Debit/Credit Adjustments"]

  Customers --> Assignment["Meter Assignment"]
  Meters --> Assignment
  Assignment --> AssignedMeters["Assigned Meter Records"]
  AssignedMeters --> Vending["Vending"]
  AssignedMeters --> Reports["Reports and Audit"]
  AssignedMeters --> Hes["HES Operations"]
  Adjustments --> Vending

  Meters --> Approval["Review and Approval"]
  Bands --> Approval
  Tariffs --> Approval
  DebtSettings --> Approval
  Approval --> Assignment
  Approval --> Vending
```

### 2.7 Permission Decision Diagram

Use this when a user cannot see a module or action.

```mermaid
flowchart TD
  A["User cannot see page or button"] --> B["Check module access"]
  B --> C{"Has module access?"}
  C -->|No| D["Update permission group module access"]
  C -->|Yes| E["Check submodule access"]
  E --> F{"Has submodule access?"}
  F -->|No| G["Update permission group submodule access"]
  F -->|Yes| H["Check action permission"]
  H --> I{"Has edit/approve/disable as needed?"}
  I -->|No| J["Update action permission"]
  I -->|Yes| K["Check node type rule"]
  K --> L{"Allowed for this node type?"}
  L -->|No| M["Use correct user/node level"]
  L -->|Yes| N["Investigate page state, approval status, or backend issue"]
```

## 3. Repository Map

The workspace contains multiple projects:

| Folder                     | Purpose                                                                                           |
| -------------------------- | ------------------------------------------------------------------------------------------------- |
| `gridflex`                 | Current customer-facing/admin frontend portal. This is the main frontend discussed in this guide. |
| `gridflex-backend-service` | Main backend service. Spring Boot/Maven service.                                                  |
| `hes-backend-springboot`   | HES-related backend service.                                                                      |
| `gridflex-admin-portal`    | Another frontend/admin project.                                                                   |
| `gridflex-landing-page`    | Marketing or landing page project.                                                                |

Inside `gridflex`:

| Path                             | Purpose                                                                |
| -------------------------------- | ---------------------------------------------------------------------- |
| `src/app/(protected)`            | Authenticated portal routes.                                           |
| `src/components`                 | Page components, tables, dialogs, and module UI.                       |
| `src/hooks`                      | React Query hooks and API-facing frontend logic.                       |
| `src/context/auth-context.tsx`   | Login, logout, user session, and route entry behavior.                 |
| `src/components/sidebar-nav.tsx` | Main navigation and module visibility rules.                           |
| `src/utils/permissions.ts`       | Basic permission helpers and post-login landing route.                 |
| `src/types`                      | Frontend data shapes for users, meters, vending, approvals, and so on. |

Common frontend commands:

| Command             | Use                                     |
| ------------------- | --------------------------------------- |
| `npm run dev`       | Start local Next.js development server. |
| `npm run typecheck` | Check TypeScript.                       |
| `npm run lint`      | Run linting.                            |
| `npm run build`     | Build the frontend.                     |

## 4. Core Mental Model

### 4.1 Organization Nodes

The organization tree is the business structure. It controls where data belongs and what scope a user operates within.

The frontend recognizes these hierarchy levels:

```mermaid
flowchart TD
  Root["Root / Head Office"] --> Region["Region"]
  Region --> BusinessHub["Business Hub"]
  BusinessHub --> ServiceCenter["Service Center"]
  ServiceCenter --> Substation["Substation"]
  Substation --> FeederLine["Feeder Line"]
  FeederLine --> DSS["DSS"]
```

The organization module allows adding:

| Node Type          | Typical Meaning                                 |
| ------------------ | ----------------------------------------------- |
| Root / Head Office | The top of the business.                        |
| Region             | A large operating area.                         |
| Business Hub       | A business unit under a region.                 |
| Service Center     | A lower operating office under a business hub.  |
| Substation         | Technical network asset under a service center. |
| Feeder Line        | Technical feeder under a substation.            |
| DSS                | Distribution substation under a feeder line.    |

Business decisions:

- Users are attached to a node, so the node determines their operational scope.
- Some actions are intentionally limited to specific node levels.
- In Customer Management, the current rule is that **Business Hub** and **Service Center** users can add or upload customers, because those levels own the direct customer relationship.
- Meter Inventory is hidden from Business Hub and Service Center users. That is separate from customer creation: these users can own customer onboarding without managing central meter stock.

### 4.2 Permission Groups

Permission groups decide two things:

1. Which modules and submodules a user can see.
2. Which actions the user can perform.

The main action permissions are:

| Permission | Meaning                                     |
| ---------- | ------------------------------------------- |
| `view`     | User can see the module/page.               |
| `edit`     | User can create or edit records.            |
| `approve`  | User can approve or reject pending records. |
| `disable`  | User can disable supported records.         |

The portal navigation checks the user's group modules and submodules. Most sidebar pages are hidden unless the assigned group has access to that module/submodule. Two current exceptions are Audit Log and Incident Report, which are marked as always visible in the sidebar component.

### 4.3 Users

A user depends on:

- A permission group.
- An organization hierarchy level.
- A specific unit/node at that hierarchy level.
- Basic profile details and a default password.

When creating a user, the portal sends:

- `groupId`: selected permission group.
- `nodeId`: selected organization unit.
- user profile fields: first name, last name, email, password, and related details.

This is why organization setup and group permission setup should happen before user onboarding.

Current Add User behavior supports assigning users to Head Office, Region, Business Hub, and Service Center. The organization tree can contain Substation, Feeder Line, and DSS nodes, but those lower technical nodes are not currently offered as user hierarchy choices in the Add User form.

## 5. Module Overview

### 5.1 Data Management

Data Management is the foundation module. It contains:

| Submodule           | Purpose                                                                                | Depends On                               | Output                                               |
| ------------------- | -------------------------------------------------------------------------------------- | ---------------------------------------- | ---------------------------------------------------- |
| Dashboard           | Summary view of data management activity.                                              | Existing data.                           | Operational overview.                                |
| Organization        | Build the hierarchy tree.                                                              | Root/business setup.                     | Regions, hubs, service centers, and technical nodes. |
| Meter Manufacturers | Add manufacturers.                                                                     | None beyond permission.                  | Manufacturer list used by meter setup.               |
| Meter Inventory     | Manage physical meter stock.                                                           | Manufacturers and meter details.         | Available meters.                                    |
| Meters              | Create and edit meter records.                                                         | Manufacturers, technical meter data.     | Meters awaiting or passing approval.                 |
| Assigned Meter      | View assigned meters and pending detached meters; detach or edit assigned information. | Existing customer-meter relationship.    | Assigned meter records and detach/edit workflows.    |
| Customer Management | Add, edit, upload, block, unblock customers.                                           | Organization/user scope.                 | Customer records.                                    |
| Band Management     | Configure supply bands.                                                                | None beyond permission.                  | Bands, usually approval-managed.                     |
| Tariff Rate         | Configure tariff rates.                                                                | Bands.                                   | Tariffs, usually approval-managed.                   |
| Debt Setting        | Configure liability causes and percentage ranges.                                      | Bands for percentage ranges.             | Debt configuration.                                  |
| Debit Adjustment    | Apply debit-related adjustments.                                                       | Customers/meters and debt configuration. | Adjustment records.                                  |
| Credit Adjustment   | Apply credit-related adjustments.                                                      | Customers/meters and debt configuration. | Adjustment records.                                  |
| Review and Approval | Approve or reject pending changes.                                                     | Pending records from Data Management.    | Approved or rejected records.                        |

### 5.2 User Management

User Management contains:

| Submodule        | Purpose                                                                   |
| ---------------- | ------------------------------------------------------------------------- |
| Group Permission | Create permission groups and decide module/action access.                 |
| Users            | Create users and attach them to permission groups and organization nodes. |

Important decision: create permission groups before adding users. A user without the right group may log in but see the wrong pages or miss required buttons.

### 5.3 Vending

Vending generates tokens for customers/meters. The visible token flows include:

| Token Flow           | What It Does                                               |
| -------------------- | ---------------------------------------------------------- |
| Credit Token         | Calculates payment result first, then generates the token. |
| KCT                  | Generates key change token.                                |
| Clear Tamper         | Generates clear tamper token.                              |
| Clear Credit         | Generates clear credit token.                              |
| KCT and Clear Tamper | Generates a combined KCT/clear tamper token.               |
| Compensation         | Generates compensation token based on unit value.          |

Vending depends on customer and meter setup. If a meter is not created, approved, and assigned correctly, vending will fail or return incomplete results.

### 5.4 HES

HES is for meter communication and technical operations. The frontend includes:

| Submodule                  | Purpose                            |
| -------------------------- | ---------------------------------- |
| Dashboard                  | HES overview.                      |
| Communication Report       | Meter communication reporting.     |
| Realtime Data              | Live or near-live meter data.      |
| Profile and Events         | Meter profile/event data.          |
| Meter Remote Configuration | Remote configuration and controls. |

### 5.5 Audit, Reports, And Incidents

These modules are supporting modules:

| Module          | Purpose                                  |
| --------------- | ---------------------------------------- |
| Audit Log       | Track user/system activity.              |
| Report Summary  | Reporting and export-oriented summaries. |
| Incident Report | Operational issue reporting.             |

Billing routes exist in the frontend, but the Billing sidebar section is currently commented out. Change Log and About Us are defined in the sidebar source but are filtered out of the rendered sidebar.

## 6. Recommended Onboarding Sequence

Use this when setting up a new operating area or bringing a team onto the portal.

### Step 1: Confirm First Admin Access

Start with the first admin user. This first admin does not manage the operating data directly in this portal; their access is focused on User Management.

The first admin should have:

- User Management access.
- Edit permission for creating permission groups and users.

The login flow stores the authenticated user and redirects them to the first module their permission group allows.

### Step 2: Confirm The Organization Tree

Before users are created in this portal, the organization tree should already have been created for the business from the admin portal.

Confirm that the expected nodes exist:

1. Region.
2. Business Hub under Region.
3. Service Center under Business Hub.
4. Substation under Service Center.
5. Feeder Line under Substation.
6. DSS under Feeder Line.

Why order matters: child nodes require a parent. For example, a Service Center needs a Business Hub parent, and a Feeder Line needs a Substation parent.

### Step 3: Create Permission Groups

Go to:

`User Management > Group Permission`

Create groups based on job responsibilities, not individual people. Example groups:

| Group                 | Suggested Access                                              |
| --------------------- | ------------------------------------------------------------- |
| Super Admin           | All modules, all action permissions.                          |
| Regional Data Manager | Data Management, Customer Management, Meter Management, edit. |
| Regional Approver     | Review and Approval, approve.                                 |
| Vending Operator      | Vending access, edit.                                         |
| HES Operator          | HES access, view/edit depending on responsibility.            |
| Auditor               | Audit Log and Report Summary, view only.                      |

The portal supports module-level and Data Management submodule-level access. For example, a user can have Data Management access but only see Customer Management and Review and Approval if that is how the group is configured.

### Step 4: Create Users

Go to:

`User Management > Users`

Each user must be attached to:

- A group permission.
- A hierarchy type.
- A unit name under that hierarchy.

Example: A regional user should choose `Region` as the hierarchy and then choose the specific region as the unit.

Root/Head Office users are attached to the root node automatically after selecting the root hierarchy.

Current Add User hierarchy options are Head Office, Region, Business Hub, and Service Center.

### Step 5: Configure Master Data

Set up the operational data needed before customers and meters can work cleanly.

Recommended order:

1. `Data Management > Band Management`
2. `Data Management > Tariff Rate`
3. `Data Management > Debt Management > Debt Setting`
4. `Data Management > Meter Management > Meter Manufacturers`
5. `Data Management > Meter Management > Meters` or `Meter Inventory`

Why order matters:

- Tariffs depend on bands.
- Percentage ranges in debt settings can depend on bands.
- Meters depend on manufacturers and meter technical details.
- Vending depends on valid customers and assigned meters.

### Step 6: Approve Pending Master Data

Go to:

`Data Management > Review and Approval`

The approval tabs include:

- Percentage Range.
- Liability Cause.
- Band.
- Tariff.
- Meter.

Approvers can inspect details, approve, reject, or bulk approve supported records.

Important decision: the portal separates create/edit from approve/reject so one user can prepare data while another user validates it. This reduces accidental activation of wrong tariffs, bands, debt settings, and meter records.

### Step 7: Add Customers

Go to:

`Data Management > Customer Management`

Current frontend rule:

- Business Hub and Service Center users can see Add Customer and Upload Customer.
- Root/Head Office and Region users do not see those actions.

Customers can be added individually or uploaded in bulk. Customer records include identity/contact information, location, address, and VAT preference.

Note: this Add/Upload visibility is currently based on node type. Row-level customer actions such as edit, assign meter, block, and related table actions are controlled by edit permission.

### Step 8: Assign Meters

Go to:

`Data Management > Meter Management > Meters`

Meter assignment connects a customer to a meter. This flow depends on:

- Customer exists.
- Meter exists.
- Required meter image/payment mode information is provided where applicable.
- The backend accepts the assignment state.

After assignment is submitted, approve the assigned meter where approval is required. Once approved, confirm that the record appears in the assigned meter table.

The `Assigned Meter` submodule is not where the assignment starts. It shows meters that are already assigned and meters pending detach. Actions from `Assigned Meter` are focused on detach and editing assigned information.

### Step 9: Apply Adjustments When Needed

Go to:

`Data Management > Debt Management > Debit Adjustment`

or:

`Data Management > Debt Management > Credit Adjustment`

Adjustments are used after customer and meter setup when the business needs to apply debit or credit balances against a customer/meter. This flow depends on:

- Customer exists.
- Meter exists and is assigned where required.
- Debt settings and liability causes exist where the adjustment requires them.
- The user has Data Management, Debt Management, and edit access.

Use Debit Adjustment when the customer should owe an additional amount. Use Credit Adjustment when the customer should receive a credit balance.

### Step 10: Vend Tokens

Go to:

`Vending > Vending`

Before vending, confirm:

- The user has Vending access and edit permission.
- Customer exists.
- Meter exists and is assigned.
- The meter/account number is correct.
- Required token-specific fields are filled.

Credit token flow has two stages:

1. Calculate the vend details.
2. Generate the final token.

Other token flows generally generate the token after the required fields are submitted.

### Step 11: Monitor, Report, and Audit

Use dashboards, reports, HES views, and audit logs to confirm operations:

- Data Management Dashboard for setup activity.
- Vending Dashboard for vending activity.
- HES Dashboard and reports for meter communication.
- Audit Log for user/system traceability.
- Report Summary for export and review.

## 7. Approval Flow

Approval is a central business control in Data Management.

```mermaid
flowchart TD
  A["User creates or edits record"] --> B["Record enters pending state"]
  B --> C["Approver opens Review and Approval"]
  C --> D{"Decision"}
  D -->|Approve| E["Record becomes approved/active"]
  D -->|Reject meter create| F["Meter record is deleted from the system"]
  D -->|Reject other changes| G["Record returns to its prior state"]
```

Records covered by the current approval UI:

| Record Type      | Approval Tab     |
| ---------------- | ---------------- |
| Band             | Band             |
| Tariff           | Tariff           |
| Meter            | Meter            |
| Liability Cause  | Liability Cause  |
| Percentage Range | Percentage Range |

Operational guidance:

- Do not assume a saved record is active until its approval status is confirmed.
- If a newly created object is missing elsewhere, check its approval status. If it is pending, wait for approval. If it is not found at all, it may have been rejected and removed from the system.
- Rejection behavior differs by record type. Rejection for a newly created meter deletes the record entirely. For the other approval-managed records, rejection returns the object to its prior state.
- The current rejection flow does not provide a panel for entering a rejection reason.
- Bulk approval is useful after careful filtering and review, not as a replacement for validation.

## 8. Access Control and Missing Buttons

When a user says "I cannot see this page" or "I cannot see this button", troubleshoot in this order:

```mermaid
flowchart TD
  A["User reports missing page/button"] --> B["Check permission group"]
  B --> C["Does group include module/submodule?"]
  C -->|No| D["Update group module access"]
  C -->|Yes| E["Check action permission"]
  E --> F["Does group include edit/approve/disable as needed?"]
  F -->|No| G["Update group action permission"]
  F -->|Yes| H["Check user node type"]
  H --> I["Is action limited by node type?"]
  I -->|Yes| J["Move user to correct node or use correct account"]
  I -->|No| K["Investigate page-specific bug or backend state"]
```

Common examples:

| Symptom                     | Likely Cause                                                                      |
| --------------------------- | --------------------------------------------------------------------------------- |
| Sidebar page is missing     | Group does not have module/submodule access.                                      |
| Add/Edit button is missing  | Group lacks edit permission, or page has node-type restrictions.                  |
| Approve/Reject missing      | Group lacks approve permission or Review and Approval access.                     |
| Meter Inventory missing     | User node type is Business Hub or Service Center.                                 |
| Add/Upload Customer missing | User is not Business Hub or Service Center.                                       |
| Vending action blocked      | User lacks Vending access/edit permission, or meter/customer setup is incomplete. |

Audit Log and Incident Report are sidebar exceptions because they are configured as always visible in the current frontend.

## 9. Practical Runbooks

### 9.1 Confirm A New Region And Operating Units

1. Confirm the organization tree has been created from the admin portal.
2. Confirm the Region exists under Root.
3. Confirm the Business Hub exists under that Region.
4. Confirm the Service Center exists under that Business Hub.
5. Confirm technical nodes exist if needed: Substation, Feeder Line, DSS.
6. Use this portal to create the users and permission groups that will operate within those nodes.

### 9.2 Add a New User

1. Confirm the organization node already exists.
2. Confirm the permission group already exists.
3. Open `User Management > Users`.
4. Click Add User.
5. Enter profile details.
6. Select Group Permission.
7. Select Organizational Hierarchy.
8. Select Unit Name.
9. Set default password.
10. Save.
11. Ask the user to log in and confirm their landing page and sidebar access.

### 9.3 Create a Data Manager and an Approver

This is a good separation-of-duty pattern.

Data Manager group:

- Data Management access.
- Required submodules such as Organization, Meter Management, Customer Management, Band Management, Tariff, Debt Management.
- Edit permission.

Approver group:

- Data Management access.
- Review and Approval submodule.
- Approve permission.
- View permission.

Then create two users and attach each user to the correct group and node.

### 9.4 Add Band and Tariff

1. Open `Data Management > Band Management`.
2. Create the band.
3. Open `Data Management > Review and Approval`.
4. Approve the band.
5. Open `Data Management > Tariff Rate`.
6. Create the tariff and link it to the approved band.
7. Return to Review and Approval.
8. Approve the tariff.

### 9.5 Add Customer and Assign Meter

1. Confirm the user is Business Hub or Service Center if they need to add or upload customers.
2. Open `Data Management > Customer Management`.
3. Add customer or upload customer file.
4. Confirm the meter exists and is available.
5. Open `Data Management > Meter Management > Meters`.
6. Select customer and meter.
7. Complete payment mode and image steps if requested.
8. Submit assignment.
9. Approve the assigned meter where approval is required.
10. Confirm the assigned meter appears in the relevant table.

### 9.6 Add A Debit Or Credit Adjustment

1. Confirm the customer exists.
2. Confirm the meter exists and is assigned if the adjustment depends on the meter.
3. Confirm the relevant debt settings and liability causes exist.
4. Open `Data Management > Debt Management > Debit Adjustment` or `Data Management > Debt Management > Credit Adjustment`.
5. Search for the customer or meter.
6. Add the adjustment details.
7. Save and confirm the adjustment appears in the table.

### 9.7 Vend a Credit Token

1. Open `Vending > Vending`.
2. Choose Credit Token.
3. Choose whether to vend by Meter Number or Account Number.
4. Enter meter/account number.
5. Enter amount tendered.
6. Proceed to calculate.
7. Review the calculated result.
8. Generate token.
9. Print if required.

### 9.8 Approve or Reject Pending Changes

1. Open `Data Management > Review and Approval`.
2. Choose the correct tab.
3. Search/filter to find the pending record.
4. View details.
5. Approve if correct.
6. Reject if incorrect.
7. Confirm the record status changes.

## 10. Loading and User Feedback Rules

For create/edit/approve/reject/vending actions, the portal should show loading text linked to the actual request. This matters because users should know what is happening and should not submit the same action twice.

Expected examples:

| Action                     | Expected Loading Text                 |
| -------------------------- | ------------------------------------- |
| Create band                | `Adding...`                           |
| Edit band                  | `Saving...`                           |
| Create tariff/edit tariff  | `Saving...`                           |
| Add liability cause        | `Adding...`                           |
| Edit liability cause       | `Saving...`                           |
| Add percentage range       | `Adding...`                           |
| Edit percentage range      | `Saving...`                           |
| Approve record             | `Approving...`                        |
| Reject record              | `Rejecting...`                        |
| Vending credit calculation | `Calculating...`                      |
| Vending token generation   | `Generating...` or `Getting token...` |
| Print token                | `Printing...`                         |

Decision: dialogs should generally stay open while the request is pending. Closing too early makes users think work completed even when the backend request is still in progress.

Logout is different. It should clear local session state and move the user to the login page quickly, not show the protected layout loading screen.

## 11. Data Dependency Cheat Sheet

| Thing You Want To Do          | Must Exist First                                                   |
| ----------------------------- | ------------------------------------------------------------------ |
| Add a user                    | Organization node and permission group.                            |
| Show a module in sidebar      | User group with module/submodule access.                           |
| Show Add/Edit actions         | User group with edit permission and any required node type.        |
| Add/upload customers          | Business Hub or Service Center user node type.                     |
| Approve records               | User group with approve permission and Review and Approval access. |
| Create tariff                 | Band.                                                              |
| Create percentage range       | Usually band and debt setting context.                             |
| Create meter                  | Manufacturer and meter technical details.                          |
| Assign meter                  | Customer and meter.                                                |
| Apply debit/credit adjustment | Customer/meter context and required debt settings.                 |
| Vend token                    | Assigned customer/meter/account setup.                             |
| See HES data                  | HES access and backend meter communication data.                   |

## 12. Developer Appendix

This section is for a teammate who will occasionally inspect code.

### Important Frontend Files

| Area                   | File                                |
| ---------------------- | ----------------------------------- |
| Auth/session           | `src/context/auth-context.tsx`      |
| Protected route shell  | `src/app/(protected)/layout.tsx`    |
| Sidebar/navigation     | `src/components/sidebar-nav.tsx`    |
| Permission helper      | `src/utils/permissions.ts`          |
| User type              | `src/types/user-info.ts`            |
| Organization UI        | `src/components/organization`       |
| User Management UI     | `src/components/usermanagement`     |
| Customer Management UI | `src/components/customermanagement` |
| Meter Management UI    | `src/components/meter-management`   |
| Review and Approval UI | `src/components/reviewandapproval`  |
| Vending UI             | `src/components/vending`            |

### How Frontend Data Usually Flows

```mermaid
flowchart LR
  Page["Page in src/app"] --> Component["Component in src/components"]
  Component --> Hook["Hook in src/hooks"]
  Hook --> Backend["Backend API"]
  Backend --> Hook
  Hook --> Component
  Component --> UI["Table/Dialog/Button"]
```

Most server actions are wrapped in React Query hooks. That is why create/edit screens should use mutation pending states for loading UI.

### Approval UI

Review and Approval is split into table components:

- `bandtable.tsx`
- `tarifftable.tsx`
- `metertable.tsx`
- `liabilitycausetable.tsx`
- `percentagerangetable.tsx`

The shared confirmation dialog is:

- `confirmapprovaldialog.tsx`

### Current Business Rules Worth Remembering

- Business Hub and Service Center can add/upload customers.
- Business Hub and Service Center do not see Meter Inventory.
- Permission group access controls most sidebar visibility.
- Action permissions control create/edit/approve/disable behavior.
- Data Management records may need approval before they become operationally active.
- Vending depends on the customer-meter setup being correct.
