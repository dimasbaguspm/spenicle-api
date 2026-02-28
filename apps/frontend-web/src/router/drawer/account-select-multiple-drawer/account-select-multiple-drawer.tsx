import { DRAWER_ROUTES } from "@/constant/drawer-routes";
import { useApiAccountsInfiniteQuery } from "@/hooks/use-api";
import { useAccountFilter } from "@/hooks/use-filter-state";
import { When } from "@/lib/when";
import { useDrawerProvider } from "@/providers/drawer-provider";
import { AccountCard } from "@/ui/account-card";
import { AccountFilterFields } from "@/ui/account-filter-fields";
import {
  Button,
  ButtonGroup,
  ButtonIcon,
  Drawer,
  NoResults,
  PageLoader,
  SelectableMultipleInput,
  useDesktopBreakpoint,
} from "@dimasbaguspm/versaur";
import { SearchXIcon, XIcon } from "lucide-react";
import { type FC, useState } from "react";

interface AccountSelectMultipleDrawerProps {
  returnToDrawer: string;
  returnToDrawerId?: Record<string, string> | null;
  payload: Record<string, unknown>;
  payloadId: string;
}

export const AccountSelectMultipleDrawer: FC<AccountSelectMultipleDrawerProps> = ({
  returnToDrawer,
  returnToDrawerId = null,
  payloadId,
  payload,
}) => {
  const isDesktop = useDesktopBreakpoint();
  const { openDrawer } = useDrawerProvider();
  const [selectedAccountIds, setSelectedAccountIds] = useState<number[]>(
    Array.isArray(payload?.[payloadId])
      ? (payload[payloadId] as number[])
      : []
  );

  const filter = useAccountFilter({
    adapter: "state",
  });
  const [
    accounts,
    ,
    { isInitialFetching, isFetchingNextPage, hasNextPage },
    { fetchNextPage },
  ] = useApiAccountsInfiniteQuery({
    name: filter.appliedFilters.name,
    type: filter.appliedFilters.type,
    sortBy: "name",
    sortOrder: "asc",
    pageSize: 15,
  });

  const handleToggleAccount = (accountId: number) => {
    setSelectedAccountIds((prev) =>
      prev.includes(accountId)
        ? prev.filter((id) => id !== accountId)
        : [...prev, accountId]
    );
  };

  const handleOnSubmit = () => {
    openDrawer(returnToDrawer, returnToDrawerId, {
      replace: true,
      state: {
        payload: {
          ...payload,
          [payloadId]: selectedAccountIds.length > 0 ? selectedAccountIds : [],
        },
      },
    });
  };

  const handleOnCancel = () => {
    openDrawer(returnToDrawer, returnToDrawerId, {
      replace: true,
      state: {
        payload,
      },
    });
  };

  return (
    <>
      <Drawer.Header>
        <Drawer.Title>Select Accounts</Drawer.Title>
        <ButtonIcon
          as={XIcon}
          size="sm"
          variant="ghost"
          aria-label="Close"
          onClick={handleOnCancel}
        />
      </Drawer.Header>

      <Drawer.Body>
        <AccountFilterFields control={filter} />
        <When condition={isInitialFetching}>
          <PageLoader />
        </When>

        <When condition={!isInitialFetching}>
          <When condition={accounts.length}>
            <ul className="mb-4">
              {accounts?.map((account) => {
                return (
                  <li key={account.id}>
                    <SelectableMultipleInput
                      value={account.id.toString()}
                      checked={selectedAccountIds.includes(account.id)}
                      onChange={() => handleToggleAccount(account.id)}
                    >
                      <AccountCard
                        as="div"
                        account={account}
                        size="none"
                        supplementaryInfo=""
                      />
                    </SelectableMultipleInput>
                  </li>
                );
              })}
            </ul>
            <When condition={hasNextPage}>
              <ButtonGroup alignment="center">
                <Button
                  onClick={() => fetchNextPage()}
                  variant="outline"
                  disabled={isFetchingNextPage}
                >
                  Load More
                </Button>
              </ButtonGroup>
            </When>
          </When>
          <When condition={!accounts.length}>
            <NoResults
              icon={SearchXIcon}
              title="No accounts found"
              subtitle="Try adjusting your search criteria, or create a new account"
              action={
                <ButtonGroup>
                  <Button
                    variant="outline"
                    onClick={() => openDrawer(DRAWER_ROUTES.ACCOUNT_CREATE)}
                  >
                    Create Account
                  </Button>
                </ButtonGroup>
              }
            />
          </When>
        </When>
      </Drawer.Body>
      <Drawer.Footer>
        <ButtonGroup alignment="end" fluid={!isDesktop}>
          <Button variant="ghost" onClick={handleOnCancel}>
            Cancel
          </Button>
          <Button onClick={handleOnSubmit}>
            Select ({selectedAccountIds.length})
          </Button>
        </ButtonGroup>
      </Drawer.Footer>
    </>
  );
};
