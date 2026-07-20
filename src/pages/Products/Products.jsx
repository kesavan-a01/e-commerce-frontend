import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import productService from "../../services/productService";
import ProductGrid from "../../components/ProductGrid/ProductGrid";
import SearchBar from "../../components/SearchBar/SearchBar";
import Pagination from "../../components/Pagination/Pagination";
import Loader from "../../components/Loader/Loader";
import { PRODUCT_CATEGORIES, SORT_OPTIONS } from "../../utils/constants";
import "./Products.css";

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    keyword: searchParams.get("keyword") || "",
    category: searchParams.get("category") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    inStock: searchParams.get("inStock") || "",
    sort: searchParams.get("sort") || "newest",
    page: Number(searchParams.get("page")) || 1,
  });

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      const params = { ...filters, limit: 12 };
      Object.keys(params).forEach((key) => {
        if (params[key] === "") delete params[key];
      });
      const res = await productService.getProducts(params);
      setProducts(res.data);
      setPagination(res.pagination);
    } catch (err) {
      console.error("Failed to load products:", err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadProducts();
    const params = {};
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params[key] = value;
    });
    setSearchParams(params, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: key === "page" ? value : 1 }));
  };

  return (
    <div className="container page-wrapper">
      <h1 className="mb-24">All Products</h1>

      <div className="products-layout">
        {/* Filters Sidebar */}
        <aside className="filters-panel card">
          <h4 className="mb-16">Filters</h4>

          <div className="form-group">
            <label className="form-label">Category</label>
            <select
              className="form-select"
              value={filters.category}
              onChange={(e) => updateFilter("category", e.target.value)}
            >
              <option value="">All Categories</option>
              {PRODUCT_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Price Range</label>
            <div className="flex gap-8">
              <input
                type="number"
                className="form-input"
                placeholder="Min"
                value={filters.minPrice}
                onChange={(e) => updateFilter("minPrice", e.target.value)}
              />
              <input
                type="number"
                className="form-input"
                placeholder="Max"
                value={filters.maxPrice}
                onChange={(e) => updateFilter("maxPrice", e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              <input
                type="checkbox"
                checked={filters.inStock === "true"}
                onChange={(e) => updateFilter("inStock", e.target.checked ? "true" : "")}
                style={{ marginRight: 8 }}
              />
              In Stock Only
            </label>
          </div>

          <button
            className="btn btn-outline btn-sm btn-block"
            onClick={() =>
              setFilters({
                keyword: "",
                category: "",
                minPrice: "",
                maxPrice: "",
                inStock: "",
                sort: "newest",
                page: 1,
              })
            }
          >
            Clear Filters
          </button>
        </aside>

        {/* Main Content */}
        <div className="products-main">
          <div className="products-toolbar">
            <SearchBar
              onSearch={(val) => updateFilter("keyword", val)}
              placeholder="Search by name, category..."
            />
            <select
              className="form-select"
              value={filters.sort}
              onChange={(e) => updateFilter("sort", e.target.value)}
              style={{ maxWidth: 200 }}
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {loading ? (
            <Loader />
          ) : (
            <>
              <ProductGrid products={products} />
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.pages}
                onPageChange={(page) => updateFilter("page", page)}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
