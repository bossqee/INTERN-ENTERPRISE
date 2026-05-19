export interface JournalEntry {
  id: string;
  date: string;
  title: string;
  tools: string[];
  content: string;
  image?: string;
}

export interface FilterState {
  search: string;
  tool: string;
  startDate: string;
  endDate: string;
}
