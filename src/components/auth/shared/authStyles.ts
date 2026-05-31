import { authTokens } from './authTokens';

export const authPillInputClass =
  'w-full h-[52px] pl-12 pr-4 border rounded-full bg-white text-[15px] font-medium text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#97F47D]/60 disabled:opacity-60';

export const authPillInputBorderStyle = {
  borderColor: authTokens.fieldBorder,
};

export const authFieldClass =
  'w-full px-4 py-2.5 border rounded-xl bg-white text-[15px] font-medium text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#97F47D]/60 disabled:opacity-60';

export const authFieldDisabledClass = `${authFieldClass} bg-gray-100 text-gray-600 cursor-not-allowed`;

export const authTextareaClass = `${authFieldClass} min-h-[96px] h-auto resize-none py-3`;

export const authLabelClass = 'block text-sm font-medium mb-1.5';

export const authOtpInputClass =
  'w-10 h-12 md:w-12 md:h-12 text-center border rounded-xl bg-white text-base md:text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-[#97F47D]/60 disabled:opacity-60';
