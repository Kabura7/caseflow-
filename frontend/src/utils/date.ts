import { format, parse } from "date-fns";

export  const formatDate = (dateString: string) => {
    try {
      const parsedDate = parse(dateString, "EEE, dd MMM yyyy HH:mm:ss 'GMT'", new Date());
      return format(parsedDate, 'MMM dd, yyyy');
    } catch {
      return 'Invalid Date';
    }
  };

