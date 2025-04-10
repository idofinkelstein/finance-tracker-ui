import CategoryApiResponse from "./category-api";

export default interface TransactionApiResponse {
    id?: number;
    date: Date; // Or a string representing a date/time
    amount: number;
    description: string;
    category?: CategoryApiResponse;
    categoryId?: number;
    transactionType: 'INCOME' | 'EXPENSE';
  }