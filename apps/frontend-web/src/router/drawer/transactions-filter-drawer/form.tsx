import { FormLayout, TextInputAsButton } from "@dimasbaguspm/versaur";
import { Controller, useForm } from "react-hook-form";
import type { FilterTransactionsFormSchema } from "./types";
import type { FC } from "react";
import { DRAWER_ROUTES } from "@/constant/drawer-routes";
import { useDrawerProvider } from "@/providers/drawer-provider";
import { useWatch } from "react-hook-form";

interface FormProps {
  defaultValues?: Partial<FilterTransactionsFormSchema>;
  handleOnValidSubmit: (data: FilterTransactionsFormSchema) => void;
}

export const formId = "transactions-filter-form";

export const Form: FC<FormProps> = ({ defaultValues, handleOnValidSubmit }) => {
  const { control, handleSubmit } = useForm<FilterTransactionsFormSchema>({
    defaultValues,
  });
  const { openDrawer } = useDrawerProvider();
  const watchedValues = useWatch({ control });

  const handleOnOpenSelectDrawer =
    (drawerId: string, fieldId: string) => () => {
      openDrawer(
        drawerId,
        {
          payloadId: fieldId,
        },
        {
          replace: true,
          state: {
            payload: watchedValues,
            returnToDrawer: DRAWER_ROUTES.TRANSACTIONS_FILTER,
          },
        },
      );
    };

  const accountCount = watchedValues.accountIds?.length ?? 0;
  const categoryCount = watchedValues.categoryIds?.length ?? 0;

  return (
    <form id={formId} onSubmit={handleSubmit(handleOnValidSubmit)}>
      <FormLayout>
        <FormLayout.Column span={12}>
          <Controller
            control={control}
            name="accountIds"
            render={({ field }) => (
              <TextInputAsButton
                {...field}
                onClick={handleOnOpenSelectDrawer(
                  DRAWER_ROUTES.SELECT_MULTIPLE_ACCOUNTS,
                  "accountIds",
                )}
                label="Accounts"
                placeholder="Select accounts"
                displayValue={
                  accountCount > 0 ? `${accountCount} account(s) selected` : ""
                }
              />
            )}
          />
        </FormLayout.Column>
        <FormLayout.Column span={12}>
          <Controller
            control={control}
            name="categoryIds"
            render={({ field }) => (
              <TextInputAsButton
                {...field}
                onClick={handleOnOpenSelectDrawer(
                  DRAWER_ROUTES.SELECT_MULTIPLE_CATEGORIES,
                  "categoryIds",
                )}
                label="Categories"
                placeholder="Select categories"
                displayValue={
                  categoryCount > 0 ? `${categoryCount} categor(ies) selected` : ""
                }
              />
            )}
          />
        </FormLayout.Column>
      </FormLayout>
    </form>
  );
};
