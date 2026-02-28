import { DRAWER_ROUTES } from "@/constant/drawer-routes";
import { useApiCategoriesInfiniteQuery } from "@/hooks/use-api";
import { useCategoryFilter } from "@/hooks/use-filter-state";
import { When } from "@/lib/when";
import { useDrawerProvider } from "@/providers/drawer-provider";
import { CategoryCard } from "@/ui/category-card";
import { CategoryFilterFields } from "@/ui/category-filter-fields";
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

interface CategorySelectMultipleDrawerProps {
  returnToDrawer: string;
  returnToDrawerId?: Record<string, string> | null;
  payload: Record<string, unknown>;
  payloadId: string;
}

export const CategorySelectMultipleDrawer: FC<
  CategorySelectMultipleDrawerProps
> = ({ returnToDrawer, returnToDrawerId = null, payloadId, payload }) => {
  const isDesktop = useDesktopBreakpoint();
  const { openDrawer } = useDrawerProvider();
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>(
    Array.isArray(payload?.[payloadId])
      ? (payload[payloadId] as number[])
      : []
  );

  const filters = useCategoryFilter({
    adapter: "state",
  });
  const [
    categories,
    ,
    { isInitialFetching, isFetchingNextPage, hasNextPage },
    { fetchNextPage },
  ] = useApiCategoriesInfiniteQuery({
    name: filters.appliedFilters.name,
    type: filters.appliedFilters.type,
    sortBy: "name",
    sortOrder: "asc",
    pageSize: 15,
  });

  const handleToggleCategory = (categoryId: number) => {
    setSelectedCategoryIds((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleOnSubmit = () => {
    openDrawer(returnToDrawer, returnToDrawerId, {
      replace: true,
      state: {
        payload: {
          ...payload,
          [payloadId]: selectedCategoryIds.length > 0 ? selectedCategoryIds : [],
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
        <Drawer.Title>Select Categories</Drawer.Title>
        <ButtonIcon
          as={XIcon}
          size="sm"
          variant="ghost"
          aria-label="Close"
          onClick={handleOnCancel}
        />
      </Drawer.Header>

      <Drawer.Body>
        <CategoryFilterFields control={filters} />
        <When condition={isInitialFetching}>
          <PageLoader />
        </When>

        <When condition={!isInitialFetching}>
          <When condition={categories.length}>
            <ul className="mb-4">
              {categories?.map((category) => {
                return (
                  <li key={category.id}>
                    <SelectableMultipleInput
                      value={category.id.toString()}
                      checked={selectedCategoryIds.includes(category.id)}
                      onChange={() => handleToggleCategory(category.id)}
                    >
                      <CategoryCard
                        as="div"
                        category={category}
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
          <When condition={!categories.length}>
            <NoResults
              icon={SearchXIcon}
              title="No categories found"
              subtitle="Try adjusting your search criteria, or create a new category"
              action={
                <ButtonGroup>
                  <Button
                    variant="outline"
                    onClick={() => openDrawer(DRAWER_ROUTES.CATEGORY_CREATE)}
                  >
                    Create Category
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
            Select ({selectedCategoryIds.length})
          </Button>
        </ButtonGroup>
      </Drawer.Footer>
    </>
  );
};
