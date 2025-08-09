import { useEffect, useState } from "react";
import { getTags } from "../../../Api/category";

const TagSearch = ({ selectedTags = [], setSelectedTags }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [allTags, setAllTags] = useState([]);
  const [loading, setLoading] = useState(true);

  // Ensure selectedTags is always an array
  const safeSelectedTags = Array.isArray(selectedTags) ? selectedTags : [];

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await getTags();
        setAllTags(res.tags);
      } catch (error) {
        console.error("Error fetching tags:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTags();
  }, []);

  const filteredTags = allTags.filter(
    (tag) =>
      tag.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !safeSelectedTags.some((selected) => selected.name === tag.name)
  );

  const handleAddTag = () => {
    if (!searchTerm.trim()) return;

    const exists = allTags.find(
      (tag) => tag.name.toLowerCase() === searchTerm.toLowerCase()
    );
    if (exists) {
      handleTagSelect(exists);
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
    console.log("Removing tag at index:", indexToRemove);
    setSelectedTags((prev) => {
      const safePrev = Array.isArray(prev) ? prev : [];
      const newTags = safePrev.filter((_, index) => index !== indexToRemove);
      return newTags.length > 0 ? newTags : [];
    });
  };

  return (
    <div>
      <input
        type="text"
        value={searchTerm}
        placeholder="Type a tag name"
        className="w-full p-2 border border-gray-300 rounded"
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            handleAddTag();
          }
        }}
      />

      {searchTerm.trim() && (
        <p
          onClick={handleAddTag}
          className="text-sm text-blue-600 cursor-pointer mt-1 hover:underline"
        >
          Add tag + "<span className="font-medium">{searchTerm}</span>"
        </p>
      )}

      {!loading && searchTerm.trim() && filteredTags.length > 0 && (
        <ul className="border border-gray-300 rounded bg-white mt-1 max-h-40 overflow-y-auto z-10">
          {filteredTags.map((tag) => (
            <li
              key={tag.id}
              className="px-3 py-1 hover:bg-gray-100 cursor-pointer "
              onClick={() => handleTagSelect(tag)}
            >
              {tag.name}
            </li>
          ))}
        </ul>
      )}

      <div className="flex flex-wrap mt-2 gap-2">
        {safeSelectedTags.map((tag, index) => {
          return (
            <span
              key={index}
              className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full flex items-center"
            >
              {tag.name}
              <button
                type="button"
                onClick={() => handleTagRemove(index)}
                className="ml-2 text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </span>
          );
        })}
      </div>
    </div>
  );
};

export default TagSearch;
