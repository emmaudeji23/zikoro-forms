import { format, parseISO, isValid } from "date-fns";

export const formatDate = (value?: string) => {
  if (!value) return "—";

  try {
    const date = parseISO(value);
    if (!isValid(date)) return value;

    return format(date, "dd MMM yyyy");
  } catch {
    return value;
  }
};