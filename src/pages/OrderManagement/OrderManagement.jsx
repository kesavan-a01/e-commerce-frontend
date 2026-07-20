import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import Sidebar from "../../components/Sidebar/Sidebar";
import Loader from "../../components/Loader/Loader";
import SearchBar from "../../components/SearchBar/SearchBar";
import orderService from "../../services/orderService";
import { formatPrice, formatDate } from "../../utils/formatters";
import { ORDER_STATUSES } from "../../utils/constants";
import "../AdminDashboard/AdminDashboard.css";
import "../ProductManagement/ProductManagement.css";
import "./OrderManagement.css";

const statusClass = (status) => `badge badge-${status.toLowerCase()}`;

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const loadOrders = useCallback(async () => {
    try {
      setLoading(true);
      const res = await orderService.getAllOrders({
        keyword,
        status: statusFilter,
        limit: 50,
      });
      setOrders(res.data);
    } catch (err) {
      console.error("Failed to load orders:", err);
    } finally {
      setLoading(false);
    }
  }, [keyword, statusFilter]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const handleStatusChange = async (orderId, status) => {
    try {
      await orderService.updateOrderStatus(orderId, status);
      toast.success("Order status updated");
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status } : o))
      );
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update status");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this order permanently?")) return;
    try {
      await orderService.deleteOrder(id);
      toast.success("Order deleted");
      setOrders((prev) => prev.filter((o) => o._id !== id));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete order");
    }
  };

  return (
    <div className="container page-wrapper">
      <h1 className="mb-24">Order Management</h1>

      <div className="admin-layout">
        <Sidebar />

        <div className="admin-content">
          <div className="flex mb-16 gap-12" style={{ flexWrap: "wrap" }}>
            <div style={{ maxWidth: 320, flex: 1 }}>
              <SearchBar onSearch={setKeyword} placeholder="Search by order ID, name, email..." />
            </div>
            <select
              className="form-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ maxWidth: 200 }}
            >
              <option value="">All Statuses</option>
              {ORDER_STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {loading ? (
            <Loader />
          ) : (
            <div className="card table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id}>
                      <td>#{order._id.slice(-8).toUpperCase()}</td>
                      <td>
                        {order.user?.fullName || "Unknown"}
                        <br />
                        <span className="text-muted" style={{ fontSize: "0.8rem" }}>{order.user?.email}</span>
                      </td>
                      <td>{formatDate(order.createdAt)}</td>
                      <td>{formatPrice(order.totalPrice)}</td>
                      <td>
                        <select
                          className="form-select status-select"
                          value={order.status}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        >
                          {ORDER_STATUSES.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                        <span className={`${statusClass(order.status)} mt-8`} style={{ display: "block", width: "fit-content" }}>
                          {order.status}
                        </span>
                      </td>
                      <td>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(order._id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {orders.length === 0 && <p className="text-muted" style={{ padding: 20 }}>No orders found.</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderManagement;
