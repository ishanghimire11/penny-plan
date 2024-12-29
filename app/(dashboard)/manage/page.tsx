"use client";

import React from "react";
import CreateCategoryDialog from "@/components/CreateCategoryDialog";
import { CurrencyComboBox } from "@/components/CurrencyComboBox";
import SkeletonWrapper from "@/components/SkeletonWrapper";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TransactionType } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import {
  PlusSquareIcon,
  TrashIcon,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Category } from "@prisma/client";
import DeleteCategoryDialog from "@/components/DeleteCategoryDialog";

const page = () => {
  return (
    <>
      <div className="border-b bg-card">
        <div className="container flex flex-wrap items-center justify-between gap-6 py-6 px-4 mx-auto">
          <div>
            <p className="text-3xl font-bold">Manage</p>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 flex flex-col gap-4 p-4">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Currency</CardTitle>
            <CardDescription>
              Set your default curreny for transaction.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CurrencyComboBox />
          </CardContent>
        </Card>

        <div className="flex flex-col gap-4">
          <CategoryList type="income"></CategoryList>

          <CategoryList type="expense"></CategoryList>
        </div>
      </div>
    </>
  );
};

export default page;

function CategoryList({ type }: { type: TransactionType }) {
  const getAllCategories = async () => {
    const response = await fetch(`/api/categories?type=${type}`);
    return response.json();
  };

  const categoriesQuery = useQuery({
    queryKey: ["categories", type],
    queryFn: getAllCategories,
  });

  const handleCategoryDelete = (categoryId: string) => {
    console.log(categoryId);
  };

  const hasCategoriesData =
    categoriesQuery.data && categoriesQuery.data.length > 0;

  return (
    <>
      <SkeletonWrapper isLoading={categoriesQuery.isLoading}>
        <Card>
          <CardHeader>
            <CardTitle className="flex flex-col md:flex-row md:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                {type === "income" ? (
                  <TrendingUp className="h-12 w-12 rounded-lg bg-emerald-400/10 p-2 text-emerald-500" />
                ) : (
                  <TrendingDown className="h-12 w-12 rounded-lg bg-red-400/10 p-2 text-red-500" />
                )}

                <div>
                  {type === "income" ? "Incomes" : "Expenses"} categories
                  <div className="text-sm text-muted-foreground">
                    Sorted by name
                  </div>
                </div>
              </div>

              <CreateCategoryDialog
                type={type}
                successCallBack={() => categoriesQuery.refetch}
                trigger={
                  <Button className="gap-2 text-sm">
                    <PlusSquareIcon className="h-4 w-4" />
                    Create Category
                  </Button>
                }
              />
            </CardTitle>
          </CardHeader>
          <Separator />
          {!hasCategoriesData && (
            <div className="flex h-40 w-full flex-col items-center justify-center">
              <p>No categories found</p>
            </div>
          )}

          {hasCategoriesData && (
            <div className="py-4 px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {categoriesQuery.data.map((category: Category) => {
                return (
                  <div
                    key={category.categoryId}
                    className="border rounded-md p-4 text-center"
                  >
                    <p className="text-2xl mb-4">{category.icon}</p>
                    <p>{category.name}</p>
                    <DeleteCategoryDialog
                      category={category}
                      trigger={
                        <Button
                          className="w-full text-muted-foreground mt-2 hover:bg-red-500 hover:text-white gap-1"
                          variant="secondary"
                          type="button"
                          onClick={() =>
                            handleCategoryDelete(category.categoryId)
                          }
                        >
                          <TrashIcon className="h-4 w-4" /> Delete
                        </Button>
                      }
                    />
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </SkeletonWrapper>
    </>
  );
}
