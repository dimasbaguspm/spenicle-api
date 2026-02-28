import type { TransactionFilterModel } from "@/hooks/use-filter-state/built/use-transaction-filter";
import type { FilterTransactionsFormSchema } from "./types";

/**
 * Converts TransactionFilterModel to FilterTransactionsFormSchema
 * @param filters - The TransactionFilterModel to convert
 * @returns FilterTransactionsFormSchema for form usage
 */
export const convertTransactionFilterToFormSchema = (
  filters: TransactionFilterModel,
): FilterTransactionsFormSchema => {
  return {
    accountIds: filters.accountIds ?? [],
    categoryIds: filters.categoryIds ?? [],
  };
};
