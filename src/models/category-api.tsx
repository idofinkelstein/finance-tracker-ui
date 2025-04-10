import TransactionApiResponse from "./transaction-api";

export default interface CategoryApiResponse {
    id: number;
    name: string;
    transactions?: TransactionApiResponse[];
}