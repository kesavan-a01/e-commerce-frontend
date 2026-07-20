import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import productService from "../../services/productService";
import ProductGrid from "../../components/ProductGrid/ProductGrid";
import Loader from "../../components/Loader/Loader";
import { PRODUCT_CATEGORIES } from "../../utils/constants";
import "./Home.css";

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [latest, setLatest] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [featuredRes, latestRes] = await Promise.all([
          productService.getProducts({ sort: "price_desc", limit: 4 }),
          productService.getProducts({ sort: "newest", limit: 8 }),
        ]);
        setFeatured(featuredRes.data);
        setLatest(latestRes.data);
      } catch (err) {
        console.error("Failed to load home data:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-text">
            <h1>Shop Smarter, Live Better</h1>
            <p className="text-muted mt-16">
              Discover quality products across electronics, fashion, home essentials, books, and sports gear — all in one place.
            </p>
            <Link to="/products" className="btn btn-primary mt-24">
              Shop Now
            </Link>
          </div>
        </div>
      </section>

      <div className="container page-wrapper">
        {loading ? (
          <Loader />
        ) : (
          <>
            {/* Categories */}
            <section className="mb-24">
              <h2 className="section-title">Shop by Category</h2>
              <div className="categories-grid">
                {PRODUCT_CATEGORIES.map((cat) => (
                  <Link
                    key={cat}
                    to={`/products?category=${encodeURIComponent(cat)}`}
                    className="category-card card"
                  >
                    {cat}
                  </Link>
                ))}
              </div>
            </section>

            {/* Featured Products */}
            <section className="mb-24">
              <div className="flex-between mb-16">
                <h2 className="section-title" style={{ marginBottom: 0 }}>Featured Products</h2>
                <Link to="/products" className="text-muted">View All →</Link>
              </div>
              <ProductGrid products={featured} />
            </section>

            {/* Latest Products */}
            <section>
              <div className="flex-between mb-16">
                <h2 className="section-title" style={{ marginBottom: 0 }}>Latest Arrivals</h2>
                <Link to="/products?sort=newest" className="text-muted">View All →</Link>
              </div>
              <ProductGrid products={latest} />
            </section>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
