import ProductCard from "../ProductCard/ProductCard";
import EmptyState from "../EmptyState/EmptyState";

const ProductGrid = ({ products }) => {
  if (!products || products.length === 0) {
    return (
      <EmptyState
        title="No Products Found"
        message="Try adjusting your search or filters to find what you're looking for."
      />
    );
  }

  return (
    <div className="grid grid-products">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
