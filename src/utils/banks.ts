// Nigerian Bank Codes and Names mapping
export interface Bank {
  name: string;
  code: string;
}

export const NIGERIAN_BANKS: Bank[] = [
  { name: 'Access Bank', code: '044' },
  { name: 'Citibank Nigeria', code: '023' },
  { name: 'Diamond Bank', code: '063' },
  { name: 'Ecobank Nigeria', code: '050' },
  { name: 'Fidelity Bank', code: '070' },
  { name: 'First Bank of Nigeria', code: '011' },
  { name: 'First City Monument Bank', code: '214' },
  { name: 'Guaranty Trust Bank', code: '058' },
  { name: 'Heritage Bank', code: '030' },
  { name: 'Keystone Bank', code: '082' },
  { name: 'Polaris Bank', code: '076' },
  { name: 'Providus Bank', code: '101' },
  { name: 'Stanbic IBTC Bank', code: '221' },
  { name: 'Standard Chartered Bank', code: '068' },
  { name: 'Sterling Bank', code: '232' },
  { name: 'SunTrust Bank', code: '100' },
  { name: 'Union Bank of Nigeria', code: '032' },
  { name: 'United Bank For Africa', code: '033' },
  { name: 'Unity Bank', code: '215' },
  { name: 'Wema Bank', code: '035' },
  { name: 'Zenith Bank', code: '057' },
];

/**
 * Get bank code by bank name
 * @param bankName - Name of the bank
 * @returns Bank code or null if not found
 */
export const getBankCode = (bankName: string): string | null => {
  const bank = NIGERIAN_BANKS.find(
    (b) => b.name.toLowerCase() === bankName.toLowerCase()
  );
  return bank ? bank.code : null;
};

/**
 * Get bank name by bank code
 * @param bankCode - Bank code
 * @returns Bank name or null if not found
 */
export const getBankName = (bankCode: string): string | null => {
  const bank = NIGERIAN_BANKS.find((b) => b.code === bankCode);
  return bank ? bank.name : null;
};

/**
 * Get all bank names for dropdown
 * @returns Array of bank names
 */
export const getBankNames = (): string[] => {
  return NIGERIAN_BANKS.map((bank) => bank.name);
};
