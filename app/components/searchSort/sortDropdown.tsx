interface SortDropdownProps {
  onSortChange: (sortBy: string) => void;
  onMealTypeChange: (mealType: string) => void;
}

export default function SortDropdown({ onSortChange, onMealTypeChange }: SortDropdownProps) {
  return (
    <div className="flex gap-4">
      <select
        onChange={(e) => onSortChange(e.target.value)}
        className="p-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
      >
        <option className="detail" value="sort_food">Sort</option>
        <option value="all">All</option>
        <option value="name">Name</option>
        <option value="date">Date</option>
      </select>

      <select
        onChange={(e) => onMealTypeChange(e.target.value)}
        className=" p-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
      >
        <option className="meal" value="All">Type</option>
        <option value="All">All</option>
        <option value="Breakfast">Breakfast</option>
        <option value="Lunch">Lunch</option>
        <option value="Dessert">Dessert</option>
        <option value="Snack">Snack</option>
        <option value="Dinner">Dinner</option>
      </select>
    </div>
  );
}
