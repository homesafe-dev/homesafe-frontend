// User interface for notification data
export interface NotificationUser {
  id: number;
  first_name: string;
  last_name: string;
  title: string;
  username: string | null;
  email: string;
  email_verified_at: string;
  avatar: string;
  gender: string;
  dob: string;
  phone: string;
  address: string;
  status: number;
  otp_code: string | null;
  otp_expires_at: string | null;
  otp_purpose: string | null;
  is_verified: number;
  salary: string;
  profile_description: string | null;
  password_changed_at: string;
  created_at: string;
  updated_at: string;
}

// Notification data interface based on API response
export interface NotificationData {
  user: NotificationUser;
  message: string;
}

// Main notification interface based on API response
export interface ApiNotification {
  id: string;
  type: string;
  notifiable_type: string;
  notifiable_id: number;
  data: NotificationData;
  read_at: string | null;
  created_at: string;
  updated_at: string;
}

// Simplified notification interface for UI components
export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type:
    | 'medical'
    | 'salary'
    | 'wallet'
    | 'placement'
    | 'contract'
    | 'system'
    | 'registration'
    | 'other';
  avatar?: string;
  user?: {
    name: string;
    avatar: string;
  };
}

// API response interface
export interface NotificationApiResponse {
  status: boolean;
  message: string;
  data: ApiNotification[];
}

// Single notification API response interface
export interface SingleNotificationApiResponse {
  status: boolean;
  message: string;
  data: ApiNotification;
}

// Utility function to convert API notification to UI notification
export const convertApiNotificationToUI = (
  apiNotification: ApiNotification
): NotificationItem => {
  // Extract notification type from the class name
  const getNotificationType = (type: string): NotificationItem['type'] => {
    if (type.includes('WalletTransaction')) return 'wallet';
    if (type.includes('Medical')) return 'medical';
    if (type.includes('Salary')) return 'salary';
    if (type.includes('Placement')) return 'placement';
    if (type.includes('Contract')) return 'contract';
    if (type.includes('System')) return 'system';
    if (type.includes('Registration')) return 'registration';
    return 'other';
  };

  // Generate title based on notification type
  const generateTitle = (type: string, data: NotificationData): string => {
    console.log(data);
    const notificationType = getNotificationType(type);
    switch (notificationType) {
      case 'wallet':
        return 'Wallet Transaction';
      case 'medical':
        return 'Medical Check-up';
      case 'salary':
        return 'Salary Notification';
      case 'placement':
        return 'Placement Update';
      case 'contract':
        return 'Contract Update';
      case 'system':
        return 'System Notification';
      case 'registration':
        return 'New Registration';
      default:
        return 'Notification';
    }
  };

  // Format date to relative time
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24)
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7)
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;

    return date.toLocaleDateString();
  };

  return {
    id: apiNotification.id,
    title: generateTitle(apiNotification.type, apiNotification.data),
    message: apiNotification.data.message,
    date: formatDate(apiNotification.created_at),
    read: !!apiNotification.read_at,
    type: getNotificationType(apiNotification.type),
    avatar: apiNotification.data.user?.avatar,
    user: {
      name: `${apiNotification.data.user?.first_name} ${apiNotification.data.user?.last_name}`,
      avatar: apiNotification.data.user?.avatar || '',
    },
  };
};
