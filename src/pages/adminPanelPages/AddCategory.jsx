import { useEffect, useState } from "react";
import {
  getCategoriesByAdmin,
  addCategoryOrTag,
  deleteCategoryOrTag,
  toggleCategoryOrTagStatus,
  getTagsByAdmin,
} from "../../Api/category";

const AddCategory = () => {
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [newName, setNewName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("category");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTagIds, setSelectedTagIds] = useState([]);
  const [tagSearch, setTagSearch] = useState("");
  const [newTagNames, setNewTagNames] = useState([]);

  const loadCategoriesAndTags = async () => {
    try {
      const data = await getCategoriesByAdmin();
      setCategories(data.categories || []);

      const tagsData = await getTagsByAdmin();
      setTags(tagsData.tags || []);
    } catch (err) {
      console.error("Failed to fetch categories and tags:", err);
    }
  };

  const handleAddCategoryOrTag = async () => {
    if (!newName.trim() || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("name", newName);
      formData.append("type", type);

      formData.append("description", description);
      if (type === "category" && imageUrl) {
        formData.append("image", imageUrl);
      }
      if (type === "category") {
        const tagNamesFromIds = tags
          .filter((tag) => selectedTagIds.includes(tag.id))
          .map((tag) => tag.name);

        const allTagNames = [...tagNamesFromIds, ...newTagNames];
        formData.append("tagNames", JSON.stringify(allTagNames));

        console.log("Selected & New Tags:", allTagNames);
      }

      await addCategoryOrTag(formData);

      // Reset form
      setNewName("");
      setImageUrl("");
      setDescription("");
      setSelectedTagIds([]);
      setNewTagNames([]);
      loadCategoriesAndTags();
    } catch (err) {
      alert("Error adding item");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id, itemType) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete this ${itemType}?`
    );
    if (!confirmDelete) return;

    try {
      await deleteCategoryOrTag(id, itemType);
      loadCategoriesAndTags();
    } catch (err) {
      alert(`Error deleting ${itemType}`);
    }
  };

  const handleToggleActiveStatus = async (id, currentStatus, itemType) => {
    try {
      await toggleCategoryOrTagStatus(id, currentStatus, itemType);
      loadCategoriesAndTags();
    } catch (err) {
      alert(`Error updating ${itemType} status`);
    }
  };

  useEffect(() => {
    loadCategoriesAndTags();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Category & Tag Management
          </h1>
          <p className="text-gray-600">
            Create and manage your categories and tags with ease
          </p>
        </div>

        {/* Add Form */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
              <span className="text-white text-lg">+</span>
            </div>
            Add New {type === "category" ? "Category" : "Tag"}
          </h2>

          <div className="space-y-6">
            {/* Type Selection */}
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => setType("category")}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  type === "category"
                    ? "bg-blue-500 text-white shadow-lg"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Category
              </button>
              <button
                type="button"
                onClick={() => setType("tag")}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  type === "tag"
                    ? "bg-blue-500 text-white shadow-lg"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Tag
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {type === "category" ? "Category" : "Tag"} Name
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder={`Enter ${type} name`}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              {type === "category" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageUrl(e.target.files[0])}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              )}
            </div>

            {type === "category" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Connect Tags
                </label>
                <div className="space-y-4">
                  <input
                    type="text"
                    value={tagSearch}
                    onChange={(e) => setTagSearch(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        const name = tagSearch.trim();
                        if (!name) return;

                        const exists = tags.some(
                          (tag) => tag.name.toLowerCase() === name.toLowerCase()
                        );
                        const alreadySelected = newTagNames.includes(name);

                        if (!exists && !alreadySelected) {
                          setNewTagNames((prev) => [...prev, name]);
                          setTagSearch("");
                        }
                      }
                    }}
                    placeholder="Search existing tags or type to create new ones..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />

                  {/* Selected Tags */}
                  {(selectedTagIds.length > 0 || newTagNames.length > 0) && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">
                        Selected Tags:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedTagIds.map((id) => {
                          const tag = tags.find((t) => t.id === id);
                          if (!tag) return null;
                          return (
                            <span
                              key={id}
                              className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2 border border-blue-200"
                            >
                              {tag.name}
                              <button
                                type="button"
                                className="text-blue-600 hover:text-blue-800 font-bold"
                                onClick={() =>
                                  setSelectedTagIds((prev) =>
                                    prev.filter((tid) => tid !== id)
                                  )
                                }
                              >
                                ×
                              </button>
                            </span>
                          );
                        })}
                        {newTagNames.map((name) => (
                          <span
                            key={name}
                            className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center gap-2 border border-green-200"
                          >
                            {name} (new)
                            <button
                              type="button"
                              className="text-green-600 hover:text-green-800 font-bold"
                              onClick={() =>
                                setNewTagNames((prev) =>
                                  prev.filter((n) => n !== name)
                                )
                              }
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Available Tags */}
                  {tagSearch && (
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">
                        Available Tags:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {tags
                          .filter(
                            (tag) =>
                              tag.name
                                .toLowerCase()
                                .includes(tagSearch.toLowerCase()) &&
                              !selectedTagIds.includes(tag.id)
                          )
                          .slice(0, 8)
                          .map((tag) => (
                            <button
                              type="button"
                              key={tag.id}
                              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full border border-gray-300 hover:bg-blue-100 hover:text-blue-700 hover:border-blue-300 text-sm transition-all duration-200"
                              onClick={() =>
                                setSelectedTagIds((prev) => [...prev, tag.id])
                              }
                            >
                              {tag.name}
                            </button>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description (Optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter description..."
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            <button
              onClick={handleAddCategoryOrTag}
              disabled={isSubmitting}
              className={`w-full py-3 px-6 rounded-lg font-medium text-white transition-all duration-200 ${
                isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl"
              }`}
            >
              {isSubmitting ? "Creating..." : `Create ${type}`}
            </button>
          </div>
        </div>

        {/* Categories Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
            <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center mr-3">
              <span className="text-white text-lg">📁</span>
            </div>
            Categories ({categories.length})
          </h3>

          {categories.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📂</div>
              <p className="text-gray-500 text-lg">
                No categories found. Create your first category!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="bg-gray-50 rounded-lg p-6 border border-gray-200 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-3">
                      {cat.imageUrl ? (
                        <img
                          src={cat.imageUrl}
                          alt={cat.name}
                          className="w-12 h-12 object-cover rounded-lg border-2 border-gray-200"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gradient-to-br from-gray-300 to-gray-400 rounded-lg flex items-center justify-center">
                          <span className="text-white text-lg">📁</span>
                        </div>
                      )}
                      <div>
                        <h4 className="font-semibold text-gray-800 text-lg">
                          {cat.name}
                        </h4>
                        <p className="text-sm text-gray-500">ID: {cat.id}</p>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        cat.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {cat.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>

                  {cat.description && (
                    <p className="text-gray-600 text-sm mb-4">
                      {cat.description}
                    </p>
                  )}

                  {/* Tags Display */}
                  <div className="mb-4">
                    <h5 className="text-sm font-medium text-gray-700 mb-2">
                      Tags:
                    </h5>
                    {cat.tags && cat.tags.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {cat.tags.map((tag) => (
                          <span
                            key={tag.id}
                            className={`px-2 py-1 rounded-full text-xs ${
                              tag.isActive
                                ? "bg-blue-100 text-blue-800 border border-blue-200"
                                : "bg-gray-100 text-gray-600 border border-gray-200"
                            }`}
                          >
                            {tag.name}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-400 text-xs italic">
                        No tags assigned
                      </p>
                    )}
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() =>
                        handleToggleActiveStatus(
                          cat.id,
                          cat.isActive,
                          "category"
                        )
                      }
                      className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        cat.isActive
                          ? "bg-red-100 text-red-700 hover:bg-red-200"
                          : "bg-green-100 text-green-700 hover:bg-green-200"
                      }`}
                    >
                      {cat.isActive ? "Deactivate" : "Activate"}
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id, "category")}
                      className="px-3 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-all duration-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tags Section */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center mr-3">
              <span className="text-white text-lg">🏷️</span>
            </div>
            Tags ({tags.length})
          </h3>

          {tags.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🏷️</div>
              <p className="text-gray-500 text-lg">
                No tags found. Create your first tag!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {tags.map((tag) => (
                <div
                  key={tag.id}
                  className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-medium text-gray-800">{tag.name}</h4>
                      <p className="text-xs text-gray-500">ID: {tag.id}</p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        tag.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {tag.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>

                  {tag.description && (
                    <p className="text-gray-600 text-sm mb-3">
                      {tag.description}
                    </p>
                  )}

                  <div className="flex space-x-2">
                    <button
                      onClick={() =>
                        handleToggleActiveStatus(tag.id, tag.isActive, "tag")
                      }
                      className={`flex-1 px-2 py-1 rounded text-xs font-medium transition-all duration-200 ${
                        tag.isActive
                          ? "bg-red-100 text-red-700 hover:bg-red-200"
                          : "bg-green-100 text-green-700 hover:bg-green-200"
                      }`}
                    >
                      {tag.isActive ? "Deactivate" : "Activate"}
                    </button>
                    <button
                      onClick={() => handleDelete(tag.id, "tag")}
                      className="px-2 py-1 bg-red-500 text-white rounded text-xs font-medium hover:bg-red-600 transition-all duration-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddCategory;
