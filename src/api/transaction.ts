import { request } from "@/api/client";
import type {
  CreateTransactionPayload,
  TransactionDto,
  TransactionFilters,
} from "@/type/transaction";

export function getTransactions(
  filters?: TransactionFilters,
): Promise<TransactionDto[]> {
  return request<TransactionDto[]>("/users/me/transactions", {
    query: { category: filters?.category, transactionType: filters?.transactionType },
  });
}

export function createTransaction(
  payload: CreateTransactionPayload,
): Promise<TransactionDto> {
  return request<TransactionDto>("/users/me/transactions", {
    method: "POST",
    body: payload,
  });
}
