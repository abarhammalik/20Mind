/**
 * Category constants with groupings and emoji icons.
 */

export interface CategoryItem {
  name: string;
  icon: string;
}

export interface CategoryGroup {
  title: string;
  items: CategoryItem[];
}

export const CATEGORY_GROUPS: CategoryGroup[] = [
  {
    title: "Science",
    items: [
      { name: "Physics", icon: "⚛️" },
      { name: "Biology", icon: "🧬" },
      { name: "Chemistry", icon: "🧪" },
      { name: "Mathematics", icon: "📐" },
      { name: "Science", icon: "🔬" },
    ],
  },
  {
    title: "Technology",
    items: [
      { name: "Artificial Intelligence", icon: "🤖" },
      { name: "Machine Learning", icon: "🧠" },
      { name: "Coding", icon: "💻" },
      { name: "Computer Science", icon: "🖥️" },
      { name: "Technology", icon: "📱" },
      { name: "Inventions", icon: "💡" },
    ],
  },
  {
    title: "Space & Nature",
    items: [
      { name: "Space", icon: "🚀" },
      { name: "Astronomy", icon: "🔭" },
      { name: "Geography", icon: "🌍" },
      { name: "Animals", icon: "🦁" },
      { name: "Nature", icon: "🌿" },
    ],
  },
  {
    title: "History & Humanities",
    items: [
      { name: "History", icon: "📜" },
      { name: "Historic Figures", icon: "👤" },
      { name: "Battles", icon: "⚔️" },
      { name: "Philosophy", icon: "🤔" },
      { name: "Economics", icon: "📊" },
      { name: "Religion", icon: "🕊️" },
      { name: "Languages", icon: "🗣️" },
    ],
  },
  {
    title: "Culture & Arts",
    items: [
      { name: "Books", icon: "📚" },
      { name: "Movies", icon: "🎬" },
      { name: "Music", icon: "🎵" },
      { name: "Art", icon: "🎨" },
      { name: "Architecture", icon: "🏛️" },
      { name: "Sports", icon: "⚽" },
      { name: "Mythology", icon: "🐉" },
    ],
  },
  {
    title: "Mind & Life",
    items: [
      { name: "Psychology", icon: "🧠" },
      { name: "Interesting Facts", icon: "✨" },
    ],
  },
];

/**
 * Flat list of all category names.
 */
export const ALL_CATEGORIES: string[] = CATEGORY_GROUPS.flatMap((group) =>
  group.items.map((item) => item.name)
);

/**
 * Get the emoji icon for a category name.
 */
export function getCategoryIcon(categoryName: string): string {
  for (const group of CATEGORY_GROUPS) {
    const item = group.items.find((i) => i.name === categoryName);
    if (item) return item.icon;
  }
  return "📖";
}
