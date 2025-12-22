/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { ProductDTO } from "@/api/product";
import { InputFileWithPreview } from "@/components/common/inputFileWithPreview";
import SelectCategory from "@/components/common/selectCategory";
import SelectModel from "@/components/common/selectCollection";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Product } from "@/interfaces/product";
import { UseMutationResult } from "@tanstack/react-query";
import { UseFormReturn } from "react-hook-form";

interface FormProps {
  product?: Product;
  form: UseFormReturn<any>;
  mutation: UseMutationResult<Product | undefined, any, ProductDTO, unknown>;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function ProductForm({
  product,
  form,
  mutation,
}: //   onSuccess,
FormProps) {
  const onSubmit = async (data: ProductDTO) => {
    mutation.mutate(data);
  };

  return (
    <div
      className="w-full mx-auto h-[60vh] overflow-y-auto"
      style={{ scrollbarWidth: "none" }}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-wrap max-sm:flex-col w-full gap-8">
            <div className="space-y-6 flex-1 border border-primary/10 rounded-md p-8 max-sm:p-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-1">
                  Informations sur un produit
                </h2>
                <p className="text-sm text-gray-500 mb-6">
                  Mentionnez tous les détails nécessaires
                </p>
              </div>

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="coupe"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Coupe
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Coupe"
                          {...field}
                          className="border-gray-200 focus:border-gray-300"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Sexe
                      </FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger className="border-gray-200 focus:border-gray-300">
                            <SelectValue placeholder="Sélectionnez une option" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="M">Homme</SelectItem>
                          <SelectItem value="F">Femme</SelectItem>
                          <SelectItem value="U">Unisexe</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex flex-wrap gap-2 max-sm:flex-col">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem className="flex-1 min-w-[150px]">
                        <FormLabel className="text-sm font-medium text-gray-700">
                          Prix <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Prix"
                            {...field}
                            value={field.value ?? ""} // pas de valeur par défaut
                            onChange={(e) =>
                              field.onChange(
                                e.target.value === ""
                                  ? undefined
                                  : Number(e.target.value)
                              )
                            }
                            className="border-gray-200 focus:border-gray-300"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="transferPrice"
                    render={({ field }) => (
                      <FormItem className="flex-1 min-w-[150px]">
                        <FormLabel className="text-sm font-medium text-gray-700">
                          Prix de transfert{" "}
                          <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Prix"
                            {...field}
                            value={field.value ?? ""} // pas de valeur par défaut
                            onChange={(e) =>
                              field.onChange(
                                e.target.value === ""
                                  ? undefined
                                  : Number(e.target.value)
                              )
                            }
                            className="border-gray-200 focus:border-gray-300"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6 flex-1 h-full max-sm:order-3 border border-primary/10 rounded-md p-8 max-sm:p-4">
              <InputFileWithPreview
                name="images"
                form={form}
                isUpdate={!!product}
                updateName="newImages"
                label="Gallerie"
                defaultFiles={product?.images}
                isReset={mutation.isSuccess}
              />
            </div>

            {/* Right Column - Category, Collection and Submit */}
            <div className="space-y-6 flex-1 max-sm:order-2 border border-primary/10 rounded-md p-8 max-sm:p-4 flex flex-col justify-between">
              <div>
                <SelectCategory form={form} isRequired />

                <SelectModel form={form} isRequired />
              </div>

              {/* Bouton submit desktop (caché en mobile) */}
              <div className="flex w-full items-end justify-end pt-8 max-sm:hidden">
                <Button
                  type="submit"
                  disabled={mutation.isPending || !form.formState.isValid}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  {mutation.isPending ? "En cours..." : "Valider"}
                </Button>
              </div>
            </div>
          </div>

          <div className="max-sm:flex hidden w-full items-end justify-end pt-8">
            <Button
              type="submit"
              disabled={mutation.isPending || !form.formState.isValid}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              {mutation.isPending ? "En cours..." : "Valider"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
