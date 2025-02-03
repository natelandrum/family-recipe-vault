import { useState } from "react";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    onSearch(e.target.value); // Call the parent function
  };

  return (
    <input
      type="text"
      placeholder="Search for recipes..."
      value={query}
      onChange={handleSearch}
      className="p-2 border rounded-lg w-full focus:outline-none focus:ring focus:ring-blue-300"
    />
  );
}
