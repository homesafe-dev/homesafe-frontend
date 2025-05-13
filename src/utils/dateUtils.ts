/**
 * Calculate age from date of birth
 * @param dob - Date of birth in string format (YYYY-MM-DD)
 * @returns Age in years
 */
export const calculateAge = (dob: string | null): number => {
  if (!dob) return 0;

  const birthDate = new Date(dob);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();

  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
};

/**
 * Format date to a readable string
 * @param dateString - Date in string format
 * @param format - Format to use (default: 'DD MMM YYYY')
 * @returns Formatted date string
 */
export const formatDate = (
  dateString: string | null,
  format = 'DD MMM YYYY'
): string => {
  if (!dateString) return '';

  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    return '';
  }

  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();

  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  return format
    .replace('DD', day.toString().padStart(2, '0'))
    .replace('MMM', months[month])
    .replace('YYYY', year.toString());
};

/**
 * Extract location from address
 * @param address - Full address string
 * @returns Location (city or first part of address)
 */
export const extractLocation = (address: string | null): string => {
  if (!address) return 'Unknown';

  // Try to extract city from address
  const parts = address.split(',');
  if (parts.length > 1) {
    return parts[1].trim();
  }

  // If no comma, return first few words
  const words = address.split(' ');
  return words.slice(0, 2).join(' ');
};
