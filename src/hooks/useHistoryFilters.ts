import { useState, useMemo } from "react";
import type { AnalyzedItem } from "../domain/entities/AnalyzedItem";
import { getModCount } from "../domain/entities/AnalyzedItem";

export interface UseHistoryFiltersOptions {
  items: AnalyzedItem[];
}

export const useHistoryFilters = ({ items }: UseHistoryFiltersOptions) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "name" | "mods">("date");

  const filteredAndSortedItems = useMemo(() => {
    let filtered = items;

    // 検索フィルター
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = items.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.modEntries.some(
            (mod) =>
              mod.mod.toLowerCase().includes(query) || mod.value.toLowerCase().includes(query)
          )
      );
    }

    // ソート
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "date":
          return new Date(b.analyzedAt).getTime() - new Date(a.analyzedAt).getTime();
        case "name":
          return a.name.localeCompare(b.name);
        case "mods":
          return getModCount(b) - getModCount(a);
        default:
          return 0;
      }
    });

    return sorted;
  }, [items, searchQuery, sortBy]);

  const statistics = useMemo(() => {
    const totalItems = items.length;
    const filteredItems = filteredAndSortedItems.length;

    return {
      totalItems,
      filteredItems,
    };
  }, [items, filteredAndSortedItems]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleSort = (newSortBy: "date" | "name" | "mods") => {
    setSortBy(newSortBy);
  };

  return {
    filteredItems: filteredAndSortedItems,
    statistics,
    searchQuery,
    sortBy,
    handleSearch,
    handleSort,
  };
};
