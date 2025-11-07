export interface ModEntry {
  mod: string;
  value: string;
}

export const isValidModEntry = (entry: ModEntry): boolean => {
  return entry.mod.trim().length > 1 && entry.value.trim().length > 0;
};

export const formatModEntry = (entry: ModEntry): string => {
  return `${entry.mod}: ${entry.value}`;
};
