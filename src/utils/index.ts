import { Category } from "@/interfaces/category";
import Collection from "@/interfaces/collection";
import { Color } from "@/interfaces/color";
import Depot from "@/interfaces/depot";
import { Product } from "@/interfaces/product";
import { Role } from "@/interfaces/role&permission";
import { Size } from "@/interfaces/size";

export const formatDepotOption = (depots: Depot[]) => {
  return depots.map((depot) => {
    return {
      label: depot.name,
      value: depot.id,
    };
  });
};
export const formatRoleOption = (roles: Role[]) => {
  return roles.map((role) => {
    return {
      label: role.name,
      value: role.id,
    };
  });
};

export const formatSizeOption = (sizes: Size[]) => {
  return sizes.map((size) => {
    return {
      label: size.id,
      value: size.name,
    };
  });
};

export function formatCategoryOption(categories: Category[]) {
  if (!Array.isArray(categories)) return [];

  return categories.map((category) => ({
    label: category.name,
    value: category.id,
  }));
}

export const formatCollectionOption = (collections: Collection[]) => {
  return collections.map((collection) => {
    return {
      label: collection.name,
      value: collection.id,
    };
  });
};

export const formatProductOption = (products: Product[] | undefined) => {
  if (!products) return [];
  return products.map((product) => ({
    label: product.name,
    value: product.id,
  }));
};
export const buildProductOptionsMap = (
  products: Product[] | undefined
): Record<string, string> => {
  if (!products) return {};
  return products.reduce((acc, product) => {
    acc[product.id] = product.name;
    return acc;
  }, {} as Record<string, string>);
};

export const formatColorOption = (colors: Color[] | undefined) => {
  if (!colors) return [];
  return colors.map((color) => ({
    label: color.hexaCode,
    value: color.id,
  }));
};
