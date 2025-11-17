# Dashboard API Documentation

## Overview

The Dashboard API provides role-specific aggregated data for users to view their key metrics, recent activities, and important information at a glance. Each role receives tailored data relevant to their responsibilities.

**Base URL:** `http://localhost:8000/api` (adjust for your environment)

**Endpoint:** `GET /dashboard`

**Authentication:** Required (Bearer Token)

---

## Authentication

All dashboard requests require authentication via Bearer token. Obtain a token by logging in:

```bash
POST /api/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "passw0rd"
}
```

**Response:**
```json
{
  "status": true,
  "message": "User login successfully.",
  "data": {
    "token": "1|exampletokenhere00000000000000000000",
    "first_name": "Admin",
    "username": null,
    "role": "admin"
  }
}
```

Use the `token` in subsequent requests:
```
Authorization: Bearer {token}
```

---

## Request

### Basic Request

```bash
GET /api/dashboard
Authorization: Bearer {token}
Accept: application/json
```

### Request with Filters

```bash
GET /api/dashboard?transaction_type=credit&from_date=2025-01-01&sort_by=created_at&sort_order=desc
Authorization: Bearer {token}
Accept: application/json
```

### Available Query Parameters

#### For Transactions (Wallet & Admin):
- `transaction_type` - Filter by type: `credit` or `debit`
- `transaction_source` - Filter by source: `top-up`, `transfer`, `payroll`, `refund`, `salary-advance`
- `transaction_status` - Filter by status: `successful`, `pending`, `failed`, `declined` (Admin only)
- `payment_method` - Filter by payment method (Admin only)
- `from_date` - Start date (YYYY-MM-DD)
- `to_date` - End date (YYYY-MM-DD)
- `search` - Search across multiple fields (Admin only)
- `sort_by` - Sort field: `created_at`, `amount`, `type`, `status`
- `sort_order` - Sort order: `asc` or `desc`

#### For Notifications:
- `read` - Filter by read status: `true` or `false`
- `type` - Filter by notification type
- `from_date` - Start date (YYYY-MM-DD)
- `to_date` - End date (YYYY-MM-DD)
- `sort_by` - Sort field: `created_at`, `read_at`
- `sort_order` - Sort order: `asc` or `desc`

#### For Activity Logs (Admin only):
- `user_id` - Filter by user ID
- `action` - Filter by action
- `from_date` - Start date (YYYY-MM-DD)
- `to_date` - End date (YYYY-MM-DD)
- `sort_by` - Sort field: `created_at`, `action`, `log_level`
- `sort_order` - Sort order: `asc` or `desc`

---

## Response Structure

The response structure varies by role. All responses follow this format:

```json
{
  "status": true,
  "message": "{Role} dashboard retrieved successfully",
  "data": {
    // Role-specific data structure
  }
}
```

---

## Role-Specific Dashboards

### 1. Admin Dashboard

**What Admins Can See:**
- Complete system overview
- All users across all roles
- Approval management statistics
- System-wide financial data
- All transactions across the platform
- Review statistics
- Activity logs
- System metrics

**Sample Request:**
```bash
curl -X GET "http://localhost:8000/api/dashboard" \
  -H "Authorization: Bearer {admin_token}" \
  -H "Accept: application/json"
```

**Sample Response:**
```json
{
  "status": true,
  "message": "Admin dashboard retrieved successfully",
  "data": {
    "users": {
      "total_count": 6,
      "by_role": {
        "admin": 1,
        "agent": 1,
        "employer": 2,
        "employee": 2
      },
      "active_count": 5,
      "inactive_count": 1,
      "verified_count": 6,
      "unverified_count": 0
    },
    "approvals": {
      "pending_count": 2,
      "approved_today": 0,
      "approved_this_week": 0,
      "approved_this_month": 1,
      "declined_count": 0
    },
    "user_management": {
      "blocked_count": 0,
      "unblocked_count": 6
    },
    "employment": {
      "active_contracts_count": 0,
      "pending_contracts_count": 0,
      "terminated_contracts_count": 0,
      "total_suggestions_count": 0
    },
    "financial": {
      "total_transactions_count": 7,
      "total_transaction_volume": 26500.00,
      "total_wallet_balance": "26270.35",
      "recent_transactions": [
        {
          "id": 2,
          "user": {
            "id": 3,
            "name": "John Adamu",
            "email": "upton.dell@example.net"
          },
          "recipient": null,
          "type": "credit",
          "amount": 2000,
          "source": "top-up",
          "description": "Wallet top-up",
          "initial_balance": "5277.30",
          "current_balance": "7277.30",
          "created_at": "2025-11-15T22:56:32.000000Z"
        }
      ]
    },
    "reviews": {
      "total_count": 0,
      "average_rating": 0,
      "rating_distribution": {}
    },
    "activity": {
      "recent_logs": [
        {
          "id": 49,
          "action": "Logged in",
          "user": {
            "id": 1,
            "name": "Admin Bailey"
          },
          "model_type": "App\\Models\\User",
          "model_id": 1,
          "description": null,
          "created_at": "2025-11-15T22:41:39.000000Z"
        }
      ],
      "new_registrations_today": 0,
      "new_registrations_this_week": 0,
      "new_registrations_this_month": 0,
      "active_contracts_this_month": 0,
      "completed_contracts_this_month": 0
    },
    "notifications": {
      "unread_count": 0
    }
  }
}
```

**Field Descriptions:**
- `users.by_role` - Breakdown of users by role
- `approvals.pending_count` - Users awaiting approval
- `financial.total_transaction_volume` - Sum of all transaction amounts
- `financial.recent_transactions` - Last 10 wallet transactions across all users
- `activity.recent_logs` - Last 10 system activity logs

---

### 2. Agent Dashboard

**What Agents Can See:**
- Employees they registered
- Placements (candidates on placement)
- Employee suggestions they made
- Contracts for their employees
- Reviews they received
- Their wallet balance and transactions
- Recent employee registrations
- Recent placements

**Sample Request:**
```bash
curl -X GET "http://localhost:8000/api/dashboard" \
  -H "Authorization: Bearer {agent_token}" \
  -H "Accept: application/json"
```

**Sample Response:**
```json
{
  "status": true,
  "message": "Agent dashboard retrieved successfully",
  "data": {
    "registered_employees": {
      "total_count": 0,
      "verified_count": 0,
      "unverified_count": 0
    },
    "placements": {
      "active_count": 0,
      "inactive_count": 0,
      "total_count": 0
    },
    "suggestions": {
      "total_count": 0,
      "pending_count": 0,
      "accepted_count": 0,
      "rejected_count": 0
    },
    "contracts": {
      "employees_with_active_contracts_count": 0,
      "employees_with_pending_contracts_count": 0
    },
    "reviews": {
      "average_rating": 0,
      "total_count": 0
    },
    "financial": {
      "wallet_balance": "218.04",
      "recent_transactions": []
    },
    "notifications": {
      "unread_count": 0,
      "recent": []
    },
    "activity": {
      "recent_registrations": [],
      "recent_placements": []
    }
  }
}
```

**Field Descriptions:**
- `registered_employees` - Employees registered by this agent (via `created_by` or `employeesAsAgent`)
- `placements.active_count` - Employees currently placed with employers (status='active' in user_agent_employee)
- `placements.inactive_count` - Previously placed employees (status='inactive')
- `suggestions` - Employee suggestions made by this agent to employers
- `activity.recent_registrations` - Last 5 employees registered by this agent
- `activity.recent_placements` - Last 5 active placements

**Sample Activity Data:**
```json
{
  "recent_registrations": [
    {
      "id": 4,
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "08012345678",
      "status": "verified",
      "registered_at": "2025-11-15T10:00:00.000000Z",
      "placement": "No employer assigned"
    }
  ],
  "recent_placements": [
    {
      "employee_id": 4,
      "employee_name": "John Doe",
      "employer_id": 3,
      "status": "active",
      "start_date": "2025-11-01",
      "placed_at": "2025-11-01T10:00:00.000000Z"
    }
  ]
}
```

---

### 3. Employer Dashboard

**What Employers Can See:**
- Their employees (total, active, inactive)
- Employment contracts (active, pending, completed, terminated)
- Employee suggestions received
- Payroll information
- Their wallet balance and transactions
- Reviews they received
- Notifications

**Sample Request:**
```bash
curl -X GET "http://localhost:8000/api/dashboard" \
  -H "Authorization: Bearer {employer_token}" \
  -H "Accept: application/json"
```

**Sample Response:**
```json
{
  "status": true,
  "message": "Employer dashboard retrieved successfully",
  "data": {
    "employees": {
      "total_count": 0,
      "active_count": 0,
      "inactive_count": 0
    },
    "contracts": {
      "active_count": 0,
      "pending_proposals_count": 0,
      "completed_count": 0,
      "terminated_count": 0
    },
    "suggestions": {
      "pending_count": 0,
      "accepted_count": 0,
      "rejected_count": 0
    },
    "payroll": {
      "recent_payrolls": [],
      "this_month_total": 0,
      "employees_with_active_advances_count": 0
    },
    "financial": {
      "wallet_balance": "7777.30",
      "recent_transactions": [
        {
          "id": 2,
          "type": "credit",
          "amount": 2000,
          "source": "top-up",
          "description": "Wallet top-up",
          "created_at": "2025-11-15T22:56:32.000000Z"
        },
        {
          "id": 4,
          "type": "debit",
          "amount": 500,
          "source": "transfer",
          "description": "Transfer to ayorinde3030@gmail.com",
          "created_at": "2025-11-15T22:56:32.000000Z"
        }
      ]
    },
    "reviews": {
      "average_rating": 0,
      "total_count": 0
    },
    "notifications": {
      "unread_count": 0,
      "recent": []
    }
  }
}
```

**Field Descriptions:**
- `employees.active_count` - Employees with active contracts (status='active' in user_agent_employee)
- `contracts.pending_proposals_count` - Contract proposals sent by employer awaiting employee response
- `payroll.recent_payrolls` - Last 3 payroll records with details
- `payroll.this_month_total` - Total payroll amount for current month
- `payroll.employees_with_active_advances_count` - Employees with active salary advances

**Sample Payroll Data:**
```json
{
  "recent_payrolls": [
    {
      "id": 1,
      "payment_date": "2025-11-26",
      "status": "completed",
      "total_amount": 50000.00,
      "employees_count": 5
    }
  ]
}
```

---

### 4. Employee Dashboard

**What Employees Can See:**
- Their profile and verification status
- Employment information (contracts, proposals)
- Financial data (wallet, salary, advances)
- Notifications
- Learning resources recommended to them

**Sample Request:**
```bash
curl -X GET "http://localhost:8000/api/dashboard" \
  -H "Authorization: Bearer {employee_token}" \
  -H "Accept: application/json"
```

**Sample Response:**
```json
{
  "status": true,
  "message": "Employee dashboard retrieved successfully",
  "data": {
    "profile": {
      "kyc_status": "verified",
      "profile_complete": true,
      "average_rating": 0,
      "total_reviews": 0
    },
    "employment": {
      "active_contracts_count": 0,
      "pending_proposals_count": 0,
      "total_contracts_count": 0,
      "is_employed": false
    },
    "financial": {
      "wallet_balance": "475.01",
      "recent_transactions": [],
      "has_active_salary_advance": false,
      "pending_salary_advance_requests_count": 0,
      "current_salary": "570.21",
      "last_salary_update": null
    },
    "notifications": {
      "unread_count": 0,
      "recent": []
    },
    "learning": {
      "recommended_resources_count": 4,
      "recent_resources": [
        {
          "id": 11,
          "occupation_id": 7,
          "video_link": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          "description": "Asperiores atque aut in et.",
          "created_at": "2025-08-13T16:37:17.000000Z",
          "updated_at": "2025-08-13T16:37:17.000000Z"
        }
      ]
    }
  }
}
```

**Field Descriptions:**
- `profile.kyc_status` - `"verified"` or `"not_verified"`
- `profile.profile_complete` - Boolean indicating if profile is complete
- `employment.is_employed` - Boolean indicating if employee has active contract
- `financial.has_active_salary_advance` - Boolean indicating active salary advance
- `learning.recommended_resources_count` - Count of learning resources matching employee's occupations
- `learning.recent_resources` - Last 3 learning resources

---

## Transaction Types

### Wallet Transaction Types
- `credit` - Money added to wallet
- `debit` - Money deducted from wallet

### Transaction Sources
- `top-up` - Wallet top-up
- `transfer` - Wallet-to-wallet transfer
- `payroll` - Salary payment
- `refund` - Refund transaction
- `salary-advance` - Salary advance payment

### Transaction Status (for Transaction model)
- `successful` - Transaction completed successfully
- `pending` - Transaction pending
- `failed` - Transaction failed
- `declined` - Transaction declined

---

## Notification Structure

**Sample Notification:**
```json
{
  "id": "uuid",
  "type": "contract_proposed",
  "data": {
    "title": "New Contract Proposal",
    "body": "You have received a new contract proposal",
    "contract_id": 1
  },
  "read_at": null,
  "created_at": "2025-11-15T10:00:00.000000Z"
}
```

**Notification Types:**
- `account_approved`, `account_declined`, `account_blocked`
- `salary_advance_requested`, `salary_advance_approved`, `salary_paid`
- `contract_proposed`, `contract_accepted`, `contract_terminated`
- `employee_assigned`, `employee_removed`
- `review_received`, `rating_updated`
- `learning_resource_recommended`
- And more...

---

## Error Responses

### Unauthorized (401)
```json
{
  "message": "Unauthenticated."
}
```

### Forbidden (403)
```json
{
  "status": false,
  "message": "Your account has been blocked. Please contact support."
}
```

### Validation Error (422)
```json
{
  "message": "The given data was invalid.",
  "errors": {
    "from_date": ["The from date must be a valid date."]
  }
}
```

---

## Frontend Implementation Guide

### 1. Authentication Flow
1. User logs in → Get token
2. Store token securely (localStorage/sessionStorage)
3. Include token in all dashboard requests: `Authorization: Bearer {token}`

### 2. Role Detection
After login, check `data.role` to determine which dashboard UI to show:
- `admin` → Admin dashboard
- `agent` → Agent dashboard
- `employer` → Employer dashboard
- `employee` → Employee dashboard

### 3. Dashboard Components

#### Admin Dashboard Components:
- **Users Overview Card**: Display total users, breakdown by role
- **Approvals Card**: Show pending approvals with action buttons
- **Financial Overview**: Total transactions, volume, wallet balance
- **Recent Transactions Table**: List with filters (type, source, date range)
- **Activity Logs Table**: System activity with filters
- **Reviews Statistics**: Rating distribution chart

#### Agent Dashboard Components:
- **Registered Employees Card**: Total, verified, unverified counts
- **Placements Card**: Active vs inactive placements
- **Suggestions Card**: Pending, accepted, rejected counts
- **Recent Activity**: Two tabs - Registrations & Placements
- **Wallet Balance**: Current balance with recent transactions

#### Employer Dashboard Components:
- **Employees Card**: Total, active, inactive counts
- **Contracts Card**: Active, pending, completed, terminated
- **Payroll Card**: Recent payrolls, monthly total, active advances
- **Suggestions Card**: Pending suggestions from agents
- **Wallet Balance**: Current balance with recent transactions

#### Employee Dashboard Components:
- **Profile Status Card**: KYC status, profile completion
- **Employment Card**: Active contracts, pending proposals
- **Financial Card**: Wallet balance, salary, salary advances
- **Learning Resources**: Recommended resources list
- **Notifications**: Unread count with list

### 4. Filtering Implementation

```javascript
// Example: Filter transactions by type and date range
const filters = {
  transaction_type: 'credit',
  from_date: '2025-01-01',
  to_date: '2025-12-31',
  sort_by: 'created_at',
  sort_order: 'desc'
};

const queryString = new URLSearchParams(filters).toString();
const response = await fetch(`/api/dashboard?${queryString}`, {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/json'
  }
});
```

### 5. Data Refresh Strategy
- Refresh dashboard on mount
- Auto-refresh every 30-60 seconds for real-time data
- Manual refresh button
- Refresh on tab focus (if needed)

### 6. Loading States
Show loading indicators while fetching:
- Skeleton loaders for cards
- Spinner for tables
- Shimmer effect for lists

### 7. Error Handling
- Handle 401 → Redirect to login
- Handle 403 → Show blocked message
- Handle 500 → Show error message with retry button
- Network errors → Show offline message

### 8. Empty States
Show appropriate messages when:
- No transactions: "No transactions yet"
- No employees: "No employees registered"
- No contracts: "No active contracts"
- No notifications: "All caught up!"

---

## Example Frontend Code (React/TypeScript)

```typescript
interface DashboardData {
  // Role-specific interface
}

const fetchDashboard = async (token: string, filters?: Record<string, string>) => {
  const queryString = filters ? `?${new URLSearchParams(filters).toString()}` : '';
  const response = await fetch(`/api/dashboard${queryString}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    }
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch dashboard');
  }
  
  return response.json();
};

// Usage
const { data } = await fetchDashboard(token, {
  transaction_type: 'credit',
  sort_by: 'created_at',
  sort_order: 'desc'
});
```

---

## Testing Credentials

### Admin
- Email: `admin@example.com`
- Password: `passw0rd`

### Agent
- Email: `nasir53@example.com`
- Password: `passw0rd`

### Employer
- Email: `upton.dell@example.net`
- Password: `passw0rd`

### Employee
- Email: `ayorinde223@gmail.com`
- Password: `passw0rd`

---

## Notes

1. **Pagination**: Recent lists (transactions, notifications, etc.) are limited (5-10 items). Use dedicated endpoints for full paginated lists.

2. **Real-time Updates**: Dashboard data is not real-time. Implement polling or WebSocket for live updates if needed.

3. **Caching**: Consider caching dashboard data client-side for better performance.

4. **Date Formats**: All dates are in ISO 8601 format (YYYY-MM-DDTHH:mm:ss.sssZ).

5. **Amounts**: All monetary values are in the base currency (Naira) as decimal numbers.

6. **Null Values**: Some fields may be `null` if data doesn't exist (e.g., `last_salary_update`, `recipient`).

---

## Support

For issues or questions, contact the development team or refer to the main API documentation.

