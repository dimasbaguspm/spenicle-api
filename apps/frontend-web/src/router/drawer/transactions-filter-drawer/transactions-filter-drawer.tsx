import { useTransactionFilter } from "@/hooks/use-filter-state";
import { useDrawerProvider } from "@/providers/drawer-provider";
import {
  Button,
  ButtonGroup,
  Drawer,
  useDesktopBreakpoint,
} from "@dimasbaguspm/versaur";
import type { FC } from "react";
import { Form, formId } from "./form";
import type { FilterTransactionsFormSchema } from "./types";
import { convertTransactionFilterToFormSchema } from "./helpers";

interface TransactionsFilterDrawer {
  payload?: Record<string, unknown>;
}

export const TransactionsFilterDrawer: FC<TransactionsFilterDrawer> = ({
  payload,
}) => {
  const isDesktop = useDesktopBreakpoint();
  const transactionFilters = useTransactionFilter({
    adapter: "url",
    defaultValues: payload,
  });

  const { closeDrawer } = useDrawerProvider();

  const handleOnValidSubmit = (data: FilterTransactionsFormSchema) => {
    const { accountIds, categoryIds } = data ?? {};


    transactionFilters.replaceAll({
      accountIds:
        accountIds && accountIds.length > 0 ? accountIds : undefined,
      categoryIds:
        categoryIds && categoryIds.length > 0 ? categoryIds : undefined,
    });


  };

  const formDefaultValues = convertTransactionFilterToFormSchema({
    ...transactionFilters.appliedFilters,
    accountIds: Array.isArray(payload?.accountIds)
      ? (payload.accountIds as number[])
      : transactionFilters.appliedFilters.accountIds,
    categoryIds: Array.isArray(payload?.categoryIds)
      ? (payload.categoryIds as number[])
      : transactionFilters.appliedFilters.categoryIds,
  });

  return (
    <>
      <Drawer.Header>
        <Drawer.Title>Filter Transactions</Drawer.Title>
        <Drawer.CloseButton />
      </Drawer.Header>

      <Drawer.Body>
        <Form
          defaultValues={formDefaultValues}
          handleOnValidSubmit={handleOnValidSubmit}
        />
      </Drawer.Body>
      <Drawer.Footer>
        <ButtonGroup alignment="end" fluid={!isDesktop}>
          <Button variant="ghost" onClick={closeDrawer}>
            Cancel
          </Button>
          <Button type="submit" form={formId} variant="primary">
            Apply
          </Button>
        </ButtonGroup>
      </Drawer.Footer>
    </>
  );
};
