import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import userService from "../../services/userService";
import Sidebar from "../../components/Sidebar/Sidebar";
import Loader from "../../components/Loader/Loader";
import { formatPrice, formatDate } from "../../utils/formatters";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const res = await userService.getDashboardStats();
        setStats(res.data);
      } catch (err) {
        console.error("Failed to load dashboard stats:", err);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  return (
    <div className="container page-wrapper">
      <h1 className="mb-24">Admin Dashboard</h1>

      <div className="admin-layout">
        <Sidebar />

        <div className="admin-content">
          {loading || !stats ? (
            <Loader />
          ) : (
            <>
              <div className="grid grid-4-stats mb-24">
                <div className="card stat-card">
                  <p className="text-muted">Total Users</p>
                  <h2>{stats.totalUsers}</h2>
                </div>
                <div className="card stat-card">
                  <p className="text-muted">Total Products</p>
                  <h2>{stats.totalProducts}</h2>
                </div>
                <div className="card stat-card">
                  <p className="text-muted">Total Orders</p>
                  <h2>{stats.totalOrders}</h2>
                </div>
                <div className="card stat-card">
                  <p className="text-muted">Total Revenue</p>
                  <h2>{formatPrice(stats.totalRevenue)}</h2>
                </div>
              </div>

              <div className="grid grid-2">
                <div className="card admin-panel">
                  <h3 className="mb-16">Recent Orders</h3>
                  {stats.recentOrders.length === 0 ? (
                    <p className="text-muted">No orders yet</p>
                  ) : (
                    stats.recentOrders.map((order) => (
                      <div key={order._id} className="admin-list-row">
                        <div>
                          <p style={{ fontWeight: 600 }}>{order.user?.fullName || "Unknown"}</p>
                          <p className="text-muted" style={{ fontSize: "0.82rem" }}>{formatDate(order.createdAt)}</p>
                        </div>
                        <span>{formatPrice(order.totalPrice)}</span>
                      </div>
                    ))
                  )}
                  <Link to="/admin/orders" className="text-muted mt-16" style={{ display: "inline-block" }}>
                    View All Orders →
                  </Link>
                </div>

                <div className="card admin-panel">
                  <h3 className="mb-16">Low Stock Products</h3>
                  {stats.lowStockProducts.length === 0 ? (
                    <p className="text-muted">All products well stocked</p>
                  ) : (
                    stats.lowStockProducts.map((product) => (
                      <div key={product._id} className="admin-list-row">
                        <p style={{ fontWeight: 600 }}>{product.name}</p>
                        <span className="badge badge-cancelled">{product.stock} left</span>
                      </div>
                    ))
                  )}
                  <Link to="/admin/products" className="text-muted mt-16" style={{ display: "inline-block" }}>
                    Manage Products →
                  </Link>
                </div>
              </div>

              <div className="grid grid-2 mt-24">
                <Link to="/admin/products" className="card quick-nav-card">
                  <h4>Manage Products</h4>
                  <p className="text-muted">Add, edit, or remove products</p>
                </Link>
                <Link to="/admin/orders" className="card quick-nav-card">
                  <h4>Manage Orders</h4>
                  <p className="text-muted">Track and update order status</p>
                </Link>
                <Link to="/admin/users" className="card quick-nav-card">
                  <h4>Manage Users</h4>
                  <p className="text-muted">View and manage customer accounts</p>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
