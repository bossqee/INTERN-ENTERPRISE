export interface JournalEntry {
  id: string;
  date: string;
  title: string;
  tools: string[];
  content: string;
  images?: string[];
  image?: string; // Keep for backward compatibility if needed, or remove if safe
}

export interface FilterState {
  search: string;
  tool: string;
  startDate: string;
  endDate: string;
}

export interface User {
  id: string;
  accountName: string;
  firstName: string;
  lastName: string;
  employeeId: string;
}
