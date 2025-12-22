/* eslint-disable react-hooks/exhaustive-deps */
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

import { getCategories } from "@/api/category";
import { getCollections } from "@/api/collection";
import { getAllColors } from "@/api/color";
import { getDepots } from "@/api/depot";
import { getSizes } from "@/api/size";

import { getProducts } from "@/api/product";
import { getUsers } from "@/api/user";
import { useCategoryStore } from "@/stores/category/categoryStore";
import { useCollectionStore } from "@/stores/collection/collectionStore";
import { useColorStore } from "@/stores/color/colorStore";
import { useDepotStore } from "@/stores/depot/depotStore";
import { useProductStore } from "@/stores/product/productStore";
import { useSizeStore } from "@/stores/size/sizeStore";
import { useUserStore } from "@/stores/user/userStore";

const useSetStore = () => {
  // Stores
  const setCategories = useCategoryStore((state) => state.setCategories);
  const setCollections = useCollectionStore((state) => state.setCollections);
  const setProducts = useProductStore(({ setProducts }) => setProducts);
  const setColors = useColorStore((state) => state.setColors);
  const setSizes = useSizeStore((state) => state.setSizes);
  const setUsers = useUserStore(({ setUsers }) => setUsers);

  const depotStore = useDepotStore();

  // Queries
  const { data: products } = useQuery({
    queryKey: ["get-all-product"],
    queryFn: () => getProducts({ getBaseInfo: true }),
  });

  const { data: allCategories } = useQuery({
    queryKey: ["get-all-categories"],
    queryFn: () => getCategories({}),
  });

  const { data: allCollections } = useQuery({
    queryKey: ["get-all-collections"],
    queryFn: () => getCollections({}),
  });

  const { data: allColors } = useQuery({
    queryKey: ["get-all-colors"],
    queryFn: getAllColors,
  });

  const { data: allSizes } = useQuery({
    queryKey: ["get-all-size"],
    queryFn: () => getSizes({}),
  });

  const { data: supplierDepots } = useQuery({
    queryKey: ["get-depots-supplier"],
    queryFn: () => getDepots({ isSupplier: true }),
  });

  const { data: localDepots } = useQuery({
    queryKey: ["get-depots-local"],
    queryFn: () => getDepots({ isSupplier: false }),
  });

  const { data: users } = useQuery({
    queryKey: ["users"],
    queryFn: () => getUsers({}),
  });

  // Effects
  useEffect(() => {
    if (products?.data)
      setProducts(products.data.sort((a, b) => a.name.localeCompare(b.name)));
  }, [products?.data]);

  useEffect(() => {
    if (allCategories?.data)
      setCategories(
        allCategories.data.sort((a, b) => a.name.localeCompare(b.name))
      );
  }, [allCategories?.data]);

  useEffect(() => {
    if (allCollections?.data)
      setCollections(
        allCollections.data.sort((a, b) => a.name.localeCompare(b.name))
      );
  }, [allCollections?.data]);

  useEffect(() => {
    if (allColors?.data)
      setColors(allColors.data.sort((a, b) => a.name.localeCompare(b.name)));
  }, [allColors?.data]);

  useEffect(() => {
    if (allSizes?.data)
      setSizes(allSizes.data.sort((a, b) => a.name.localeCompare(b.name)));
  }, [allSizes?.data]);

  useEffect(() => {
    if (supplierDepots?.data)
      depotStore.setSupplierDepots(
        supplierDepots.data.sort((a, b) => a.name.localeCompare(b.name))
      );
  }, [supplierDepots?.data]);

  useEffect(() => {
    if (localDepots?.data)
      depotStore.setLocalDepots(
        localDepots.data.sort((a, b) => a.name.localeCompare(b.name))
      );
  }, [localDepots?.data]);

  useEffect(() => {
    if (users?.data) setUsers(users.data);
  }, [users]);
};

export default useSetStore;
