interface SortDropdownProps {
    onSortChange: (sortBy: string) => void;
  }
  
  export default function SortDropdown({ onSortChange }: SortDropdownProps) {
    return (
      <select
        onChange={(e) => onSortChange(e.target.value)}
        className="p-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
      >
        <option value="name">Sort by Name</option>
        <option value="date">Sort by Date</option>
        <option value="privacy_status">Sort by Status</option>
        <option value="meal_type">Type</option>
      </select>
    );
  }
  