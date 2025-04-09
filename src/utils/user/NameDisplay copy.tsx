export const getFirstChar = (text: string | undefined | null): string => {
  if (!text) return "";
  return text.charAt(0);
};
