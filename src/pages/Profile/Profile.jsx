import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import useAuth from "../../hooks/useAuth";
import authService from "../../services/authService";
import Loader from "../../components/Loader/Loader";
import "./Profile.css";

const Profile = () => {
  const { updateUserContext } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    currentPassword: "",
    newPassword: "",
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await authService.getProfile();
        const p = res.data;
        setFormData((prev) => ({
          ...prev,
          fullName: p.fullName || "",
          phone: p.phone || "",
          street: p.address?.street || "",
          city: p.address?.city || "",
          state: p.address?.state || "",
          pincode: p.address?.pincode || "",
        }));
      } catch (err) {
        console.error("Failed to load profile:", err);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.newPassword && !formData.currentPassword) {
      toast.error("Enter your current password to set a new one");
      return;
    }

    try {
      setSaving(true);
      const payload = {
        fullName: formData.fullName,
        phone: formData.phone,
        address: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
        },
      };
      if (formData.newPassword) {
        payload.currentPassword = formData.currentPassword;
        payload.newPassword = formData.newPassword;
      }

      const res = await authService.updateProfile(payload);
      updateUserContext(res.data);
      toast.success("Profile updated successfully");
      setFormData((prev) => ({ ...prev, currentPassword: "", newPassword: "" }));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader fullPage />;

  return (
    <div className="container page-wrapper">
      <h1 className="mb-24">My Profile</h1>

      <div className="card profile-card">
        <form onSubmit={handleSubmit}>
          <h3 className="mb-16">Personal Information</h3>
          <div className="grid grid-2">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input type="text" name="fullName" className="form-input" value={formData.fullName} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input type="tel" name="phone" className="form-input" value={formData.phone} onChange={handleChange} />
            </div>
          </div>

          <h3 className="mb-16 mt-24">Address</h3>
          <div className="form-group">
            <label className="form-label">Street Address</label>
            <input type="text" name="street" className="form-input" value={formData.street} onChange={handleChange} />
          </div>
          <div className="grid grid-2">
            <div className="form-group">
              <label className="form-label">City</label>
              <input type="text" name="city" className="form-input" value={formData.city} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">State</label>
              <input type="text" name="state" className="form-input" value={formData.state} onChange={handleChange} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Pincode</label>
            <input type="text" name="pincode" className="form-input" value={formData.pincode} onChange={handleChange} />
          </div>

          <h3 className="mb-16 mt-24">Change Password</h3>
          <div className="grid grid-2">
            <div className="form-group">
              <label className="form-label">Current Password</label>
              <input type="password" name="currentPassword" className="form-input" value={formData.currentPassword} onChange={handleChange} placeholder="Leave blank to keep current" />
            </div>
            <div className="form-group">
              <label className="form-label">New Password</label>
              <input type="password" name="newPassword" className="form-input" value={formData.newPassword} onChange={handleChange} placeholder="At least 6 characters" />
            </div>
          </div>

          <button type="submit" className="btn btn-primary mt-16" disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
