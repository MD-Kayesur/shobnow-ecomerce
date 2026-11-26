// src/components/AdminDashboard/SearchFilter.tsx
import { IoSearchSharp } from "react-icons/io5";
import { LuSlidersHorizontal } from "react-icons/lu";
import { CiExport } from "react-icons/ci";

interface SearchFilterProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onFilterClick: () => void;
  onExportClick: () => void;
}

const SearchFilter = ({
  searchTerm,
  onSearchChange,
  onFilterClick,
  onExportClick,
}: SearchFilterProps) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-3 sm:gap-4 w-full">
      {/* Search Box */}
      <div className="w-full">
        <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-2 bg-white shadow-xs focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
          <IoSearchSharp className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, order ID, email or phone..."
            className="h-9 flex-grow text-sm text-gray-800 placeholder:text-gray-400 bg-transparent outline-none"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2.5">
        {/* Filter Button */}
        <button
          onClick={onFilterClick}
          className="flex-1 md:flex-none flex items-center justify-center gap-2 border border-gray-200 px-4 py-2.5 rounded-xl bg-white text-gray-700 hover:border-primary/50 hover:text-primary transition-all text-sm font-semibold shadow-xs cursor-pointer"
        >
          <span>Filter</span>
          <LuSlidersHorizontal className="w-4 h-4" />
        </button>

        {/* Export Button */}
        <button
          onClick={onExportClick}
          className="flex-1 md:flex-none flex items-center justify-center gap-2 border border-gray-200 px-4 py-2.5 rounded-xl bg-white text-gray-700 hover:border-primary/50 hover:text-primary transition-all text-sm font-semibold shadow-xs cursor-pointer"
        >
          <span>Export</span>
          <CiExport className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default SearchFilter;
