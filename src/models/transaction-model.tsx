
export default interface TransactionModel {
    id: number;
    date: Date; // Use Date object for easier manipulation
    amount: string; // Formatted currency string
    categoryName: string; // Category name for display
    type: 'Income' | 'Expense'; // User-friendly display
  }