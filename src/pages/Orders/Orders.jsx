import { useEffect, useState } from "react";
import orderService from "../../services/orderService";
import Loader from "../../components/Loader/Loader";
import EmptyState from "../../components/EmptyState/EmptyState";
import { formatPrice, formatDate } from "../../utils/formatters";
import "./Orders.css";

const statusClass = (status) => `badge badge-${status.toLowerCase()}`;

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);
        const res = await orderService.getMyOrders();
        setOrders(res.data);
      } catch (err) {
        console.error("Failed to load orders:", err);
      } finally {
        setLoading(false);
      }
    };
    loadOrders();
  }, []);

  if (loading) return <Loader fullPage />;

  return (
    <div className="container page-wrapper">
      <h1 className="mb-24">My Orders</h1>

      {orders.length === 0 ? (
        <EmptyState
          title="No Orders Yet"
          message="You haven't placed any orders yet. Start shopping to see your orders here."
          actionLabel="Browse Products"
          actionTo="/products"
        />
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order._id} className="card order-card">
              <div className="order-card-header">
                <div>
                  <p className="text-muted" style={{ fontSize: "0.82rem" }}>Order ID</p>
                  <p style={{ fontWeight: 600 }}>#{order._id.slice(-8).toUpperCase()}</p>
                </div>
                <div>
                  <p className="text-muted" style={{ fontSize: "0.82rem" }}>Date</p>
                  <p style={{ fontWeight: 600 }}>{formatDate(order.createdAt)}</p>
                </div>
                <div>
                  <p className="text-muted" style={{ fontSize: "0.82rem" }}>Total</p>
                  <p style={{ fontWeight: 600 }}>{formatPrice(order.totalPrice)}</p>
                </div>
                <span className={statusClass(order.status)}>{order.status}</span>
              </div>

              <div className="order-card-items">
                {order.items.map((item, idx) => (
                  <div key={idx} className="order-item-row">
                    <span>{item.name}</span>
                    <span className="text-muted">
                      {item.quantity} × {formatPrice(item.price)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
