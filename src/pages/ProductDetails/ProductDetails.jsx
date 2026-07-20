import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import productService from "../../services/productService";
import useCart from "../../hooks/useCart";
import Loader from "../../components/Loader/Loader";
import ProductGrid from "../../components/ProductGrid/ProductGrid";
import { formatPrice, getImageUrl } from "../../utils/formatters";
import "./ProductDetails.css";

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        setQuantity(1);
        const res = await productService.getProductById(id);
        setProduct(res.data);

        const relatedRes = await productService.getProducts({
          category: res.data.category,
          limit: 4,
        });
        setRelated(relatedRes.data.filter((p) => p._id !== id));
      } catch (err) {
        console.error("Failed to load product:", err);
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) return <Loader fullPage />;
  if (!product) {
    return (
      <div className="container page-wrapper">
        <p>Product not found. <Link to="/products">Back to products</Link></p>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product._id, quantity);
  };

  return (
    <div className="container page-wrapper">
      <div className="product-details-grid">
        <div className="product-details-image">
          <img src={getImageUrl(product.image)} alt={product.name} />
        </div>

        <div className="product-details-info">
          <span className="product-card-category">{product.category}</span>
          <h1 className="mt-8">{product.name}</h1>
          <div className="product-card-rating mt-8">★ {product.rating?.toFixed(1) || "0.0"} ({product.numReviews || 0} reviews)</div>

          <p className="text-muted mt-16">{product.description}</p>

          <div className="product-details-price mt-24">{formatPrice(product.price)}</div>

          <p className={`mt-8 ${product.stock === 0 ? "text-danger" : "text-muted"}`}>
            {product.stock === 0 ? "Out of Stock" : `${product.stock} items available`}
          </p>

          {product.stock > 0 && (
            <div className="quantity-selector mt-16">
              <button onClick={() => setQuantity((q) => Math.max(1, q - 1))}>−</button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}>+</button>
            </div>
          )}

          <button
            className="btn btn-primary mt-24"
            style={{ width: "100%", maxWidth: 300 }}
            onClick={handleAddToCart}
            disabled={product.stock === 0}
          >
            {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
          </button>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-24" style={{ marginTop: 48 }}>
          <h2 className="section-title">Related Products</h2>
          <ProductGrid products={related} />
        </section>
      )}
    </div>
  );
};

export default ProductDetails;
