import { useState, useMemo } from "react";
import { filterProducts, productsData } from "../services/productservice";

export function useProducts() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDosha, setSelectedDosha] = useState("all");
  const [selectedBenefit, setSelectedBenefit] = useState("");
  const [sortBy, setSortBy] = useState("popular");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [priceMax, setPriceMax] = useState(5000);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  const filteredProducts = useMemo(() => {
    return filterProducts({
      category: selectedCategory,
      dosha: selectedDosha,
      benefit: selectedBenefit,
      search: searchQuery,
      sortBy,
      inStockOnly,
      priceMax
    });
  }, [
    selectedCategory,
    selectedDosha,
    selectedBenefit,
    searchQuery,
    sortBy,
    inStockOnly,
    priceMax
  ]);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedDosha("all");
    setSelectedBenefit("");
    setSortBy("popular");
    setInStockOnly(false);
    setPriceMax(5000);
  };

  const isFilterActive =
    searchQuery !== "" ||
    selectedCategory !== "all" ||
    selectedDosha !== "all" ||
    selectedBenefit !== "" ||
    inStockOnly ||
    priceMax < 5000;

  return {
    allProducts: productsData,
    filteredProducts,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedDosha,
    setSelectedDosha,
    selectedBenefit,
    setSelectedBenefit,
    sortBy,
    setSortBy,
    inStockOnly,
    setInStockOnly,
    priceMax,
    setPriceMax,
    quickViewProduct,
    setQuickViewProduct,
    resetFilters,
    isFilterActive
  };
}

export default useProducts;
