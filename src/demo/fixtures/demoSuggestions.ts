export interface DemoSuggestion {
  id: string;
  suggestedKey: string;
  suggestedLabel: string;
  suggestedValue: string;
  reason: string;
}

export const demoSuggestions: DemoSuggestion[] = [
  {
    id: "demo-suggestion-1",
    suggestedKey: "favorite_watch_brands",
    suggestedLabel: "Favorite Watch Brand",
    suggestedValue: "Patek Philippe",
    reason:
      "You've discussed Patek Philippe in 3 recent conversations and added one to your collection.",
  },
];
