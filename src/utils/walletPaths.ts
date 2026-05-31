/** Base path for wallet routes: `/employer` or `/employee` */
export const getWalletBasePath = (pathname: string): string =>
  pathname.startsWith('/employee') ? '/employee' : '/employer';

export const walletRoutes = (basePath: string) => ({
  wallet: `${basePath}/wallet`,
  topUp: `${basePath}/wallet/top-up`,
  paymentVerify: `${basePath}/wallet/payment/verify`,
});
