export const REALTIME_EVENTS = {
  WALLET_BALANCE_UPDATED: 'homesafe:wallet-balance-updated',
  TRANSACTION_CREATED: 'homesafe:transaction-created',
  NOTIFICATION_RECEIVED: 'homesafe:notification-received',
} as const;

export type RealtimeEventName =
  (typeof REALTIME_EVENTS)[keyof typeof REALTIME_EVENTS];

export interface WalletBalanceUpdatedDetail {
  balance: string;
  currency?: string;
}

export interface TransactionCreatedDetail {
  transaction: {
    id: number;
    amount: string;
    type?: string;
    status?: string;
    reference_code?: string;
    payment_method?: string;
    created_at?: string;
    wallet_transaction?: {
      id: number;
      type?: string;
      source?: string;
      description?: string;
    };
  };
}

export interface NotificationReceivedDetail {
  unread_count: number;
  title?: string | null;
  message?: string | null;
}
