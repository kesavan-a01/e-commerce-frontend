import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import Sidebar from "../../components/Sidebar/Sidebar";
import Loader from "../../components/Loader/Loader";
import SearchBar from "../../components/SearchBar/SearchBar";
import productService from "../../services/productService";
import { formatPrice, getImageUrl } from "../../utils/formatters";
import { PRODUCT_CATEGORIES } from "../../utils/constants";
import "../AdminDashboard/AdminDashboard.css";
import "./ProductManagement.css";

const emptyForm = {
  name: "",
  description: "",
  category: PRODUCT_CATEGORIES[0],
  price: "",
  stock: "",
};

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [saving, setSaving] = useState(false);

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await productService.getProducts({ keyword, limit: 50 });
      setProducts(res.data);
    } catch (err) {
      console.error("Failed to load products:", err);
    } finally {
      setLoading(false);
    }
  }, [keyword]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const openAddModal = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setImageFile(null);
    setImagePreview(null);
    setShowModal(true);
  };

  const openEditModal = (product) => {
    setEditingId(product._id);
    setFormData({
      name: product.name,
      description: product.description,
      category: product.category,
      price: product.price,
      stock: product.stock,
    });
    setImageFile(null);
    setImagePreview(getImageUrl(product.image));
    setShowModal(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const fd = new FormData();
      Object.entries(formData).forEach(([key, value]) => fd.append(key, value));
      if (imageFile) fd.append("image", imageFile);

      if (editingId) {
        await productService.updateProduct(editingId, fd);
        toast.success("Product updated successfully");
      } else {
        await productService.createProduct(fd);
        toast.success("Product created successfully");
      }
      setShowModal(false);
      loadProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await productService.deleteProduct(id);
      toast.success("Product deleted");
      loadProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete product");
    }
  };

  return (
    <div className="container page-wrapper">
      <h1 className="mb-24">Product Management</h1>

      <div className="admin-layout">
        <Sidebar />

        <div className="admin-content">
          <div className="flex-between mb-16" style={{ flexWrap: "wrap", gap: 12 }}>
            <div style={{ maxWidth: 320, flex: 1 }}>
              <SearchBar onSearch={setKeyword} placeholder="Search products..." />
            </div>
            <button className="btn btn-primary" onClick={openAddModal}>+ Add Product</button>
          </div>

          {loading ? (
            <Loader />
          ) : (
            <div className="card table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product._id}>
                      <td>
                        <img src={getImageUrl(product.image)} alt={product.name} className="table-thumb" />
                      </td>
                      <td>{product.name}</td>
                      <td>{product.category}</td>
                      <td>{formatPrice(product.price)}</td>
                      <td>{product.stock}</td>
                      <td>
                        <div className="flex gap-8">
                          <button className="btn btn-outline btn-sm" onClick={() => openEditModal(product)}>Edit</button>
                          <button className="btn btn-danger btn-sm" onClick={() => handleDelete(product._id)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {products.length === 0 && <p className="text-muted" style={{ padding: 20 }}>No products found.</p>}
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content card" onClick={(e) => e.stopPropagation()}>
            <h3 className="mb-16">{editingId ? "Edit Product" : "Add Product"}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Product Name</label>
                <input type="text" name="name" className="form-input" value={formData.name} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea name="description" className="form-textarea" rows="3" value={formData.description} onChange={handleChange} required></textarea>
              </div>

              <div className="grid grid-2">
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select name="category" className="form-select" value={formData.category} onChange={handleChange}>
                    {PRODUCT_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Price (₹)</label>
                  <input type="number" name="price" className="form-input" value={formData.price} onChange={handleChange} min="0" required />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Stock Quantity</label>
                <input type="number" name="stock" className="form-input" value={formData.stock} onChange={handleChange} min="0" required />
              </div>

              <div className="form-group">
                <label className="form-label">Product Image</label>
                <input type="file" accept="image/*" onChange={handleImageChange} />
                {imagePreview && (
                  <img src={imagePreview} alt="Preview" className="image-preview mt-8" />
                )}
              </div>

              <div className="flex gap-8 mt-16">
                <button type="button" className="btn btn-outline btn-block" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary btn-block" disabled={saving}>
                  {saving ? "Saving..." : editingId ? "Update Product" : "Create Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;
