import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import Sidebar from "../../components/Sidebar/Sidebar";
import Loader from "../../components/Loader/Loader";
import SearchBar from "../../components/SearchBar/SearchBar";
import userService from "../../services/userService";
import { formatDate } from "../../utils/formatters";
import "../AdminDashboard/AdminDashboard.css";
import "../ProductManagement/ProductManagement.css";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await userService.getUsers({ keyword });
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to load users:", err);
    } finally {
      setLoading(false);
    }
  }, [keyword]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await userService.deleteUser(id);
      toast.success("User deleted");
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete user");
    }
  };

  return (
    <div className="container page-wrapper">
      <h1 className="mb-24">User Management</h1>

      <div className="admin-layout">
        <Sidebar />

        <div className="admin-content">
          <div style={{ maxWidth: 320 }} className="mb-16">
            <SearchBar onSearch={setKeyword} placeholder="Search by name or email..." />
          </div>

          {loading ? (
            <Loader />
          ) : (
            <div className="card table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td>{user.fullName}</td>
                      <td>{user.email}</td>
                      <td>{user.phone || "—"}</td>
                      <td>{formatDate(user.createdAt)}</td>
                      <td>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(user._id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {users.length === 0 && <p className="text-muted" style={{ padding: 20 }}>No users found.</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
