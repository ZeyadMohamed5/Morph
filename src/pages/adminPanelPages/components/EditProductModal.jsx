import { useState } from "react";
import { updateProduct } from "../../../Api/products";
import TagSearch from "./TagSearch";

const EditProductModal = ({ product, onClose, onUpdate }) => {
  // Updated initializeTags function for EditProductModal
  const initializeTags = (tags) => {
    if (!tags) return [];
    if (Array.isArray(tags)) {
      return tags
        .filter((tag) => tag != null) // Remove null/undefined items
        .map((tag) => {
          // Handle the backend structure: {id, name, categories}
          if (typeof tag === "object" && tag.name) {
            return {
              id: tag.id || null,
              name: String(tag.name),
            };
          }
          // Handle string tags (fallback)
          if (typeof tag === "string") {
            return { id: null, name: tag };
          }
          // Handle other object structures (fallback)
          if (typeof tag === "object" && tag !== null) {
            // If it has an id but no name, skip it
            if (!tag.name) {
              console.warn("Tag object missing name field:", tag);
              return null;
            }
            return {
              id: tag.id || null,
              name: String(tag.name),
            };
          }
          console.warn("Unexpected tag format:", tag);
          return null;
        })
        .filter((tag) => tag !== null && tag.name.trim() !== ""); // Remove null tags and empty names
    }
    return [];
  };

  const initializeVariants = (variants) => {
    if (!variants || !Array.isArray(variants)) return [];
    return variants.map((variant) => ({
      id: variant?.id,
      sku: variant?.sku || "",
      color: variant?.color || "",
      mainImageFile: null,
      additionalImageFiles: [],
      sizes: Array.isArray(variant?.sizes)
        ? variant.sizes.map((s) => ({
            size: s?.size || "",
            stock: s?.stock || 0,
          }))
        : [{ size: "", stock: 0 }],
    }));
  };

  const [formData, setFormData] = useState({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price || "",
    previousPrice: product?.previousPrice || "",
    isActive: product?.isActive ?? true,
    tags: initializeTags(product?.tags),
    mainImageFile: null,
    additionalImageFiles: [],
    variants: initializeVariants(product?.variants),
  });

  const [loading, setLoading] = useState(false);

  // Variant change
  const handleVariantChange = (index, key, value) => {
    const updatedVariants = [...formData.variants];
    updatedVariants[index][key] = value;
    setFormData({ ...formData, variants: updatedVariants });
  };

  // Size change
  const handleSizeChange = (variantIndex, sizeIndex, key, value) => {
    const updatedVariants = [...formData.variants];
    updatedVariants[variantIndex].sizes[sizeIndex][key] = value;
    setFormData({ ...formData, variants: updatedVariants });
  };

  // Add size to variant
  const addSizeToVariant = (variantIndex) => {
    const updatedVariants = [...formData.variants];
    updatedVariants[variantIndex].sizes.push({ size: "", stock: 0 });
    setFormData({ ...formData, variants: updatedVariants });
  };

  // Remove size from variant
  const removeSizeFromVariant = (variantIndex, sizeIndex) => {
    const updatedVariants = [...formData.variants];
    updatedVariants[variantIndex].sizes.splice(sizeIndex, 1);
    setFormData({ ...formData, variants: updatedVariants });
  };

  // Add new variant
  const addVariant = () => {
    setFormData((prev) => ({
      ...prev,
      variants: [
        ...prev.variants,
        {
          id: undefined,
          color: "",
          sku: "",
          mainImageFile: null,
          additionalImageFiles: [],
          sizes: [{ size: "", stock: 0 }],
        },
      ],
    }));
  };

  // Remove variant
  const removeVariant = (index) => {
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
    }));
  };

  // Form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const submissionForm = new FormData();

    submissionForm.append("name", formData.name);
    submissionForm.append("description", formData.description);
    submissionForm.append("price", formData.price);
    submissionForm.append("previousPrice", formData.previousPrice);
    submissionForm.append("isActive", formData.isActive);
    submissionForm.append(
      "tags",
      JSON.stringify(
        Array.isArray(formData.tags) ? formData.tags.map((tag) => tag.name) : []
      )
    );

    // Variants
    const variantsForServer = formData.variants.map((variant) => ({
      id: variant.id,
      color: variant.color,
      sku: variant.sku,
      sizes: variant.sizes.map((s) => ({
        size: s.size,
        stock: Number(s.stock),
      })),
    }));
    submissionForm.append("variants", JSON.stringify(variantsForServer));

    // Main product images
    if (formData.mainImageFile) {
      submissionForm.append("mainImage", formData.mainImageFile);
    }
    if (formData.additionalImageFiles.length > 0) {
      formData.additionalImageFiles.forEach((file, idx) => {
        submissionForm.append(`images`, file); // Changed to match backend expectation
      });
    }

    // Variant images - Fixed field naming
    formData.variants.forEach((variant, index) => {
      if (variant.mainImageFile) {
        // Use consistent field naming that matches backend processing
        submissionForm.append(
          `variantMainImage_${index}`,
          variant.mainImageFile
        );
      }
      if (
        variant.additionalImageFiles &&
        variant.additionalImageFiles.length > 0
      ) {
        variant.additionalImageFiles.forEach((file, fileIdx) => {
          // Use consistent field naming
          submissionForm.append(`variantAdditionalImages_${index}`, file);
        });
      }
    });

    console.log("Submitting form data:");
    // Log form data entries for debugging
    for (let [key, value] of submissionForm.entries()) {
      console.log(key, value);
    }

    try {
      await updateProduct(product.id, submissionForm);
      onUpdate();
    } catch (err) {
      console.error("Update error:", err);
      alert("Failed to update product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 relative max-h-[90vh] overflow-y-auto">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-xl font-semibold mb-4">Edit Product</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                className="w-full border rounded px-2 py-1"
                name="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Price</label>
              <input
                className="w-full border rounded px-2 py-1"
                name="price"
                type="number"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Previous Price
              </label>
              <input
                className="w-full border rounded px-2 py-1"
                name="previousPrice"
                type="number"
                value={formData.previousPrice}
                onChange={(e) =>
                  setFormData({ ...formData, previousPrice: e.target.value })
                }
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">
                Description
              </label>
              <textarea
                className="w-full border rounded px-2 py-1"
                name="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={2}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Main Image
              </label>
              <div className="relative">
                <label className="px-2 py-1 bg-blue-100 text-blue-700 rounded cursor-pointer block text-center hover:bg-blue-200 transition">
                  {formData.mainImageFile
                    ? formData.mainImageFile.name
                    : "Choose Main Image"}
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        mainImageFile: e.target.files[0],
                      })
                    }
                  />
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Additional Images
              </label>
              <div className="relative">
                <label className="px-2 py-1 bg-blue-100 text-blue-700 rounded cursor-pointer block text-center hover:bg-blue-200 transition">
                  {formData.additionalImageFiles &&
                  formData.additionalImageFiles.length > 0
                    ? `${formData.additionalImageFiles.length} file(s)`
                    : "Choose Additional Images"}
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    multiple
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        additionalImageFiles: Array.from(e.target.files),
                      })
                    }
                  />
                </label>
              </div>
            </div>
            <div className="flex items-center gap-2 col-span-2">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={(e) =>
                  setFormData({ ...formData, isActive: e.target.checked })
                }
                id="isActive"
              />
              <label htmlFor="isActive" className="text-sm">
                Active
              </label>
            </div>
          </div>

          {/* TAGS */}
          <div>
            <label className="block text-sm font-medium mb-1">Tags</label>
            <TagSearch
              selectedTags={formData.tags}
              setSelectedTags={(tags) => {
                setFormData((prev) => ({ ...prev, tags }));
              }}
            />
          </div>

          {/* VARIANTS */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold">Variants</h3>
              <button
                type="button"
                className="px-2 py-1 bg-green-500 text-white rounded text-xs"
                onClick={addVariant}
              >
                + Add Variant
              </button>
            </div>
            <div className="space-y-4">
              {formData.variants.map((variant, vIndex) => (
                <div
                  key={vIndex}
                  className="border rounded p-3 bg-gray-50 space-y-3"
                >
                  {/* Color Input */}
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Color
                    </label>
                    <input
                      type="text"
                      className="border rounded px-2 py-1 w-full"
                      value={variant.color}
                      onChange={(e) =>
                        handleVariantChange(vIndex, "color", e.target.value)
                      }
                      placeholder="Color"
                    />
                  </div>

                  {/* SKU Input */}
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      SKU
                    </label>
                    <input
                      type="text"
                      className="border rounded px-2 py-1 w-full"
                      value={variant.sku}
                      onChange={(e) =>
                        handleVariantChange(vIndex, "sku", e.target.value)
                      }
                      placeholder="SKU"
                    />
                  </div>

                  {/* Image Inputs Row */}
                  <div className="flex gap-2 items-center">
                    {/* Main Image */}
                    <div className="relative flex-1">
                      <label className="block text-sm font-medium mb-1">
                        Main Image
                      </label>
                      <label className="px-2 py-1 bg-blue-100 text-blue-700 rounded cursor-pointer block text-center hover:bg-blue-200 transition">
                        {variant.mainImageFile
                          ? variant.mainImageFile.name
                          : "Choose Main Image"}
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={(e) =>
                            handleVariantChange(
                              vIndex,
                              "mainImageFile",
                              e.target.files[0]
                            )
                          }
                        />
                      </label>
                    </div>

                    {/* Additional Images */}
                    <div className="relative flex-1">
                      <label className="block text-sm font-medium mb-1">
                        Additional Images
                      </label>
                      <label className="px-2 py-1 bg-blue-100 text-blue-700 rounded cursor-pointer block text-center hover:bg-blue-200 transition">
                        {variant.additionalImageFiles &&
                        variant.additionalImageFiles.length > 0
                          ? `${variant.additionalImageFiles.length} file(s)`
                          : "Choose Additional Images"}
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          multiple
                          onChange={(e) =>
                            handleVariantChange(
                              vIndex,
                              "additionalImageFiles",
                              Array.from(e.target.files)
                            )
                          }
                        />
                      </label>
                    </div>

                    {/* Remove Variant Button */}
                    <button
                      type="button"
                      className="self-end ml-2 px-2 py-1 bg-red-500 text-white rounded text-xs"
                      onClick={() => removeVariant(vIndex)}
                    >
                      Remove
                    </button>
                  </div>

                  {/* Sizes Section */}
                  <div>
                    {variant.sizes.map((sizeObj, sIndex) => (
                      <div key={sIndex} className="flex gap-2 mt-2 items-start">
                        <div className="flex flex-col">
                          <label className="font-medium text-sm">Size</label>
                          <input
                            type="text"
                            className="border rounded px-2 py-1 w-50"
                            value={sizeObj.size}
                            onChange={(e) =>
                              handleSizeChange(
                                vIndex,
                                sIndex,
                                "size",
                                e.target.value
                              )
                            }
                            placeholder="Size"
                          />
                        </div>

                        <div className="flex flex-col">
                          <label className="font-medium text-sm">Stock</label>
                          <input
                            type="number"
                            className="border rounded px-2 py-1 w-50"
                            min="0"
                            value={sizeObj.stock}
                            onChange={(e) =>
                              handleSizeChange(
                                vIndex,
                                sIndex,
                                "stock",
                                Number(e.target.value)
                              )
                            }
                            placeholder="Stock"
                          />
                        </div>

                        <button
                          type="button"
                          className="text-red-500 text-lg mt-6"
                          onClick={() => removeSizeFromVariant(vIndex, sIndex)}
                          title="Remove size"
                        >
                          &times;
                        </button>
                      </div>
                    ))}

                    <button
                      type="button"
                      className="mt-3 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs"
                      onClick={() => addSizeToVariant(vIndex)}
                    >
                      + Add Size
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductModal;
