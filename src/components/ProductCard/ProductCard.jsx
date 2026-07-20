import { Link } from "react-router-dom";
import { formatPrice, getImageUrl } from "../../utils/formatters";
import useCart from "../../hooks/useCart";
import "./ProductCard.css";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product._id, 1);
  };

  return (
    <div className="product-card card">
      <Link to={`/products/${product._id}`} className="product-card-image">
        <img src={getImageUrl(product.image)} alt={product.name} />
        {product.stock === 0 && <span className="out-of-stock-tag">Out of Stock</span>}
      </Link>

      <div className="product-card-body">
        <span className="product-card-category">{product.category}</span>
        <Link to={`/products/${product._id}`}>
          <h4 className="product-card-name">{product.name}</h4>
        </Link>

        <div className="product-card-rating">
          ★ {product.rating?.toFixed(1) || "0.0"}
        </div>

        <div className="flex-between mt-8">
          <span className="product-card-price">{formatPrice(product.price)}</span>
          <span className="text-muted" style={{ fontSize: "0.82rem" }}>
            Stock: {product.stock}
          </span>
        </div>

        <div className="product-card-actions">
          <Link to={`/products/${product._id}`} className="btn btn-outline btn-sm btn-block">
            View
          </Link>
          <button
            className="btn btn-primary btn-sm btn-block"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
