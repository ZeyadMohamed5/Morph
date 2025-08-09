import { useState } from "react";
import { addProduct, addVariants } from "../../Api/products";
import TagSearch from "./components/TagSearch";

const AddProduct = () => {
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    description: "",
    price: "",
    stock: "",
    previousPrice: "",
    imageUrl: null,
    images: [],
  });

  const [variants, setVariants] = useState([
    {
      color: "",
      sku: "",
      sizes: [{ size: "", stock: "" }],
      imageUrl: null,
      variantImages: [],
    },
  ]);

  const [selectedTags, setSelectedTags] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "imageUrl") {
      setFormData({ ...formData, imageUrl: files[0] });
    } else if (name === "images") {
      setFormData({ ...formData, images: Array.from(files) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleVariantChange = (index, e) => {
    const { name, files, value } = e.target;
    const updated = [...variants];
    if (name === "imageUrl") {
      updated[index].imageUrl = files[0];
    } else if (name === "variantImages") {
      updated[index].variantImages = Array.from(files);
    } else {
      updated[index][name] = value;
    }
    setVariants(updated);
  };

  const handleSizeChange = (variantIndex, sizeIndex, field, value) => {
    const updated = [...variants];
    updated[variantIndex].sizes[sizeIndex][field] = value;
    setVariants(updated);
  };

  const addSizeRow = (variantIndex) => {
    const updated = [...variants];
    updated[variantIndex].sizes.push({ size: "", stock: "" });
    setVariants(updated);
  };

  const removeSizeRow = (variantIndex, sizeIndex) => {
    const updated = [...variants];
    updated[variantIndex].sizes.splice(sizeIndex, 1);
    setVariants(updated);
  };

  const addVariantRow = () => {
    setVariants([
      ...variants,
      {
        color: "",
        sku: "",
        sizes: [{ size: "", stock: "" }],
        imageUrl: null,
        variantImages: [],
      },
    ]);
  };

  const removeVariantRow = (index) => {
    const updated = [...variants];
    updated.splice(index, 1);
    setVariants(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = new FormData();
      payload.append("name", formData.name);
      payload.append("sku", formData.sku);
      payload.append("description", formData.description);
      payload.append("price", formData.price);
      payload.append("previousPrice", formData.previousPrice);
      payload.append("stock", formData.stock);
      if (formData.imageUrl) payload.append("mainImage", formData.imageUrl);
      formData.images.forEach((img) => payload.append("images", img));
      payload.append(
        "tags",
        JSON.stringify(selectedTags.map((tag) => tag.name))
      );

      const res = await addProduct(payload);
      const productId = res.data.id;
      if (!productId) throw new Error("Product ID not returned.");

      // Batch variant uploads
      const variantPromises = variants
        .filter((v) => v.color && v.sizes.some((sz) => sz.size && sz.stock))
        .map((variant) => {
          const variantPayload = new FormData();
          variantPayload.append("productId", productId);
          variantPayload.append("color", variant.color);
          variantPayload.append("sku", variant.sku);
          variantPayload.append("sizes", JSON.stringify(variant.sizes));
          if (variant.imageUrl)
            variantPayload.append("imageUrl", variant.imageUrl);
          variant.variantImages.forEach((img) =>
            variantPayload.append("variantImages", img)
          );
          return addVariants(variantPayload);
        });

      await Promise.all(variantPromises);

      alert("Product and variants uploaded successfully");

      // Reset state
      setFormData({
        name: "",
        sku: "",
        description: "",
        price: "",
        stock: "",
        previousPrice: "",
        imageUrl: null,
        images: [],
      });
      setSelectedTags([]);
      setVariants([
        {
          color: "",
          sku: "",
          sizes: [{ size: "", stock: "" }],
          imageUrl: null,
          variantImages: [],
        },
      ]);
    } catch (err) {
      alert("Error uploading product: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 w-full bg-gray-50 max-w-[70%] mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Upload Product
      </h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Product Fields */}
        {["name", "sku", "description", "price", "previousPrice"].map(
          (field) => (
            <div key={field}>
              <label className="block mb-1 capitalize font-medium text-gray-700">
                {field.replace(/([A-Z])/g, " $1")}:
              </label>
              <input
                type="text"
                name={field}
                value={formData[field]}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
          )
        )}

        {/* Main Image */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">
            Main Image:
          </label>
          <input
            type="file"
            name="imageUrl"
            accept="image/*"
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        {/* Additional Images */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">
            Additional Images:
          </label>
          <input
            type="file"
            name="images"
            accept="image/*"
            multiple
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">Tags:</label>
          <TagSearch
            selectedTags={selectedTags}
            setSelectedTags={setSelectedTags}
          />
        </div>

        {/* Variants Section */}
        <div className="mt-4">
          <label className="block mb-2 font-semibold text-gray-800">
            Product Variants
          </label>
          {variants.map((variant, index) => (
            <div
              key={index}
              className="flex flex-col gap-4 mb-6 border border-gray-400 p-4 rounded-md bg-white shadow-sm"
            >
              {/* Color, SKU, and Images */}
              <div className="flex flex-wrap gap-2 items-center">
                <input
                  type="text"
                  name="color"
                  placeholder="Color"
                  value={variant.color}
                  onChange={(e) => handleVariantChange(index, e)}
                  className="p-2 border border-gray-300 rounded w-full sm:w-[30%]"
                />

                <div className="w-full sm:w-[30%]">
                  <label className="text-sm text-gray-600 block mb-1">
                    Main Image
                  </label>
                  <input
                    type="file"
                    name="imageUrl"
                    accept="image/*"
                    onChange={(e) => handleVariantChange(index, e)}
                    className="p-2 border border-gray-300 rounded w-full"
                  />
                </div>

                <div className="w-full sm:w-[35%]">
                  <label className="text-sm text-gray-600 block mb-1">
                    Additional Images
                  </label>
                  <input
                    type="file"
                    name="variantImages"
                    accept="image/*"
                    multiple
                    onChange={(e) => handleVariantChange(index, e)}
                    className="p-2 border border-gray-300 rounded w-full"
                  />
                </div>

                <input
                  type="text"
                  name="sku"
                  placeholder="SKU"
                  value={variant.sku}
                  onChange={(e) => handleVariantChange(index, e)}
                  className="p-2 border border-gray-300 rounded w-full sm:w-[30%]"
                />

                {variants.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeVariantRow(index)}
                    className="text-red-500 font-bold ml-auto"
                  >
                    ×
                  </button>
                )}
              </div>

              {/* Sizes */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Sizes
                </label>
                {variant.sizes.map((sz, szIndex) => (
                  <div key={szIndex} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Size"
                      value={sz.size}
                      onChange={(e) =>
                        handleSizeChange(index, szIndex, "size", e.target.value)
                      }
                      className="p-2 border border-gray-300 rounded w-full sm:w-[40%]"
                    />
                    <input
                      type="number"
                      placeholder="Stock"
                      min={0}
                      value={sz.stock}
                      onChange={(e) =>
                        handleSizeChange(
                          index,
                          szIndex,
                          "stock",
                          e.target.value
                        )
                      }
                      className="p-2 border border-gray-300 rounded w-full sm:w-[40%]"
                    />
                    {variant.sizes.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSizeRow(index, szIndex)}
                        className="text-red-500 font-bold"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addSizeRow(index)}
                  className="text-xs text-blue-600 hover:underline"
                >
                  + Add Size
                </button>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addVariantRow}
            className="text-sm text-blue-600 hover:underline mt-2"
          >
            + Add Color Variant
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`${
            loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
          } text-white px-4 py-2 rounded w-full transition`}
        >
          {loading ? "Uploading..." : "Submit Product"}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
