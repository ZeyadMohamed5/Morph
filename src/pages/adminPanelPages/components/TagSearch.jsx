import { useState, useMemo } from "react";
import { useTags } from "../../../hooks/useProducts"; // Adjust path as needed

const TagSearch = ({ selectedTags = [], setSelectedTags }) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Use React Query hook instead of useEffect
  const { data: allTags = [], isLoading, error } = useTags();

  // Ensure selectedTags is always an array
  const safeSelectedTags = Array.isArray(selectedTags) ? selectedTags : [];

  // Memoize filtered tags to avoid recalculation on every render
  const filteredTags = useMemo(() => {
    if (!searchTerm.trim()) return [];

    const lowerSearchTerm = searchTerm.toLowerCase();
    return allTags.filter(
      (tag) =>
        tag.name.toLowerCase().includes(lowerSearchTerm) &&
        !safeSelectedTags.some((selected) => selected.name === tag.name)
    );
  }, [allTags, searchTerm, safeSelectedTags]);

  // Memoize the search term existence check
  const exactMatch = useMemo(() => {
    if (!searchTerm.trim()) return null;
    return allTags.find(
      (tag) => tag.name.toLowerCase() === searchTerm.toLowerCase()
    );
  }, [allTags, searchTerm]);

  const handleAddTag = () => {
    if (!searchTerm.trim()) return;

    if (exactMatch) {
      handleTagSelect(exactMatch);
    } else {
      const newTag = { id: null, name: searchTerm.trim() };
      setSelectedTags([...safeSelectedTags, newTag]);
    }
    setSearchTerm("");
  };

  const handleTagSelect = (tag) => {
    setSelectedTags([...safeSelectedTags, tag]);
    setSearchTerm("");
  };

  const handleTagRemove = (indexToRemove) => {
    setSelectedTags((prev) => {
      const safePrev = Array.isArray(prev) ? prev : [];
      const newTags = safePrev.filter((_, index) => index !== indexToRemove);
      return newTags.length > 0 ? newTags : [];
    });
  };

  // Show error state if needed
  if (error) {
    return (
      <div className="text-red-500 text-sm">
        Error loading tags. Please try again.
      </div>
    );
  }

  return (
    <div>
      <input
        type="text"
        value={searchTerm}
        placeholder={isLoading ? "Loading tags..." : "Type a tag name"}
        className="w-full p-2 border border-gray-300 rounded"
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            handleAddTag();
          }
        }}
        disabled={isLoading}
      />

      {searchTerm.trim() && !exactMatch && (
        <p
          onClick={handleAddTag}
          className="text-sm text-blue-600 cursor-pointer mt-1 hover:underline"
        >
          Add tag + "<span className="font-medium">{searchTerm}</span>"
        </p>
      )}

      {!isLoading && searchTerm.trim() && filteredTags.length > 0 && (
        <ul className="border border-gray-300 rounded bg-white mt-1 max-h-40 overflow-y-auto z-10">
          {filteredTags.map((tag) => (
            <li
              key={tag.id}
              className="px-3 py-1 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleTagSelect(tag)}
            >
              {tag.name}
            </li>
          ))}
        </ul>
      )}

      <div className="flex flex-wrap mt-2 gap-2">
        {safeSelectedTags.map((tag, index) => (
          <span
            key={`${tag.id || "new"}-${index}`} // Better key for React
            className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full flex items-center"
          >
            {tag.name}
            <button
              type="button"
              onClick={() => handleTagRemove(index)}
              className="ml-2 text-red-500 hover:text-red-700"
              aria-label={`Remove ${tag.name} tag`}
            >
              ×
            </button>
          </span>
        ))}
      </div>
    </div>
  );
};

export default TagSearch;
