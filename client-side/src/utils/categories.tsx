// This file defines the categories used in the application, including their names, values, and colors.
export interface Category {
  name: string;
  value: string;
  color: string;
  hoverColor: string;
}

// This array contains the categories used in the application, each with a name, value, color, and hover color.
const categories: Category[] = [
  { name: "Essentials", value: "essentials", color: "#1F4E78", hoverColor: "#174F6B" },
  { name: "Entertainment", value: "entertainment", color: "#3DA5D9", hoverColor: "#3394C9" },
  { name: "Utilities", value: "utilities", color: "#F4B41A", hoverColor: "#F2A115" },
  { name: "Savings/Investments", value: "savings/investments", color: "#FF6F61", hoverColor: "#E75C4E" },
  { name: "Miscellaneous", value: "miscellaneous", color: "#8E44AD", hoverColor: "#7A3F9A" },
  { name: "Emergency", value: "emergency", color: "#FF0000", hoverColor: "#CC0000" },
];

export default categories;
