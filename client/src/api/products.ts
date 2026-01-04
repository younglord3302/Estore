import { useQuery } from "@tanstack/react-query";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3000";

export const fetchProducts = async (params?: {
  category?: string;
  search?: string;
  sort?: string;
  page?: number;
  limit?: number;
}) => {
  const url = new URL(`${API_BASE}/api/products`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.append(key, value.toString());
      }
    });
  }
  const response = await fetch(url.toString());
  if (!response.ok) throw new Error("Failed to fetch products");
  return response.json();
};

export const fetchProduct = async (id: string) => {
  const response = await fetch(`${API_BASE}/api/products/${id}`);
  if (!response.ok) throw new Error("Failed to fetch product");
  return response.json();
};

export const useProducts = (params?: {
  category?: string;
  search?: string;
  sort?: string;
  page?: number;
  limit?: number;
}) => {
  return useQuery({
    queryKey: ["products", params],
    queryFn: () => fetchProducts(params),
  });
};

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => fetchProduct(id),
  });
};

export const fetchCategories = async () => {
  const response = await fetch(`${API_BASE}/api/categories`);
  if (!response.ok) throw new Error("Failed to fetch categories");
  return response.json();
};

export const useCategories = () => {
  return useQuery({ queryKey: ["categories"], queryFn: fetchCategories });
};
