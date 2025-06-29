# Admin API Implementation

## Overview
This document outlines the implementation of the admin API integration for the AdminSettings.tsx page.

## Files Modified

### 1. `src/api/adminApi.ts`
- **Added**: `getAdminList()` method to fetch admins using `/api/users?role=admin&limit=10`
- **Parameters**: 
  - `page` - Page number for pagination (default: 1)
  - `limit` - Number of items per page (default: 10)

### 2. `src/pages/admin/AdminSettings.tsx`
- **Updated**: Replaced mock data with real API calls
- **Added**: Proper TypeScript interface matching API response
- **Enhanced**: Error handling and loading states
- **Improved**: Table display with proper data mapping
- **Added**: Real admin deletion functionality

## API Endpoints Used

### Get All Admins
```
GET /api/users?role=admin&limit=10&page=1
```

**Query Parameters:**
- `role=admin` - Filter users by admin role
- `limit` - Number of admins per page
- `page` - Page number for pagination

### Delete Admin
```
DELETE /api/admin/delete-admin/{adminId}
```

**Parameters:**
- `adminId` - ID of the admin to delete

## Example API Calls

### 1. Get All Admins
```bash
curl -X GET "https://homesafeng.xyz/api/users?role=admin&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 2. Get Admins with Pagination
```bash
curl -X GET "https://homesafeng.xyz/api/users?role=admin&limit=10&page=2" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 3. Delete Admin
```bash
curl -X DELETE "https://homesafeng.xyz/api/admin/delete-admin/123" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## API Response Structure

```typescript
interface AdminResponse {
  status: boolean;
  message: string;
  data: {
    current_page: number;
    data: Admin[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: Array<{
      url: string | null;
      label: string;
      active: boolean;
    }>;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
  };
}

interface Admin {
  id: number;
  first_name: string;
  last_name: string;
  title?: string;
  username?: string;
  email: string;
  email_verified_at?: string;
  avatar?: string;
  gender: string;
  dob?: string;
  phone: string;
  address?: string;
  status: number;
  is_verified: number;
  salary?: string;
  profile_description?: string;
  created_by?: number;
  approval_status: string;
  is_blocked: boolean;
  fcm_token?: string;
  password_changed_at?: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}
```

## Features Implemented

### 1. Real-time Data Fetching
- Fetches admin data from the API on component mount
- Proper loading states during API calls
- Error handling for failed requests

### 2. Pagination
- Server-side pagination with proper page controls
- Displays current page and total pages
- Navigation between pages

### 3. Enhanced Table Display
- Admin names from `first_name` and `last_name`
- Formatted dates using `date-fns`
- Avatar display with fallback to initials
- Verification status with appropriate badges
- Proper gender display with capitalization

### 4. Admin Management
- Delete admin functionality using real API
- Proper error handling for delete operations
- UI updates after successful operations

### 5. Error Handling
- Graceful error handling for API failures
- User-friendly error messages
- Console logging for debugging

## Code Usage

### In AdminSettings.tsx:
```typescript
import adminApi from '../../api/adminApi';
import adminSettingsApi from '../../api/adminSettingsApi';

// Fetch admins
const response = await adminApi.getAdminList(currentPage, 10);

// Delete admin
await adminSettingsApi.deleteAdmin(adminId);
```

### In adminApi.ts:
```typescript
// New method added
getAdminList: async (page = 1, limit = 10) => {
  try {
    const response = await axiosInstance.get('/users', {
      params: {
        role: 'admin',
        page,
        limit
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching admin list:', error);
    throw error;
  }
}
```

## Testing

The implementation can be tested by:

1. **Loading the AdminSettings page** - Should fetch and display real admin data
2. **Pagination** - Navigate between pages to test pagination
3. **Delete functionality** - Try deleting an admin (if permissions allow)
4. **Error handling** - Test with invalid tokens or network issues

## Future Enhancements

1. **Search Functionality**: Add search capability for admins
2. **Filtering**: Add filters by verification status, creation date, etc.
3. **Bulk Operations**: Add ability to perform bulk operations on admins
4. **Admin Details Modal**: Add detailed view for individual admins
5. **Edit Admin**: Add functionality to edit admin details
6. **Role Management**: Add ability to manage admin roles and permissions
