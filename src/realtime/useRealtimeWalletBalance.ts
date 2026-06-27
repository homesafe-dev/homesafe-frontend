import { useCallback } from 'react';
import { REALTIME_EVENTS, WalletBalanceUpdatedDetail } from './events';
import { useRealtimeEvent } from './useRealtimeEvent';

export function useRealtimeWalletBalance(
  onBalanceUpdate: (balance: string) => void
): void {
  const handler = useCallback(
    (detail: WalletBalanceUpdatedDetail) => {
      if (detail.balance) {
        onBalanceUpdate(detail.balance);
      }
    },
    [onBalanceUpdate]
  );

  useRealtimeEvent<WalletBalanceUpdatedDetail>(
    REALTIME_EVENTS.WALLET_BALANCE_UPDATED,
    handler
  );
}
