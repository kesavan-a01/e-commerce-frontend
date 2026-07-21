import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import useAuth from "../../hooks/useAuth";
import "../../styles/auth.css";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      const user = await login(formData);
      toast.success("Welcome back!");
      const redirectTo = location.state?.from?.pathname;
      if (user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate(redirectTo || "/");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper auth-page">
      <div className="card form-card">
        <h2 className="mb-8" style={{ textAlign: "center" }}>Welcome Back</h2>
        <p className="text-muted mb-24" style={{ textAlign: "center" }}>
          Login to continue shopping
        </p>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              className="form-input"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
            />
            {errors.email && <p className="form-error">{errors.email}</p>}
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              className="form-input"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
            />
            {errors.password && <p className="form-error">{errors.password}</p>}
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-24 text-muted" style={{ textAlign: "center" }}>
          Don't have an account? <Link to="/register" style={{ color: "var(--color-primary)", fontWeight: 600 }}>Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;






// import { useState } from "react";
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import toast from "react-hot-toast";
// import useAuth from "../../hooks/useAuth";
// import "../../styles/auth.css";

// const Login = () => {
//   const { login } = useAuth();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [formData, setFormData] = useState({ email: "", password: "" });
//   const [errors, setErrors] = useState({});
//   const [loading, setLoading] = useState(false);

//   const validate = () => {
//     const newErrors = {};
//     if (!formData.email) newErrors.email = "Email is required";
//     if (!formData.password) newErrors.password = "Password is required";
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validate()) return;

//     try {
//       setLoading(true);
//       const user = await login(formData);
//       toast.success("Welcome back!");
//       const redirectTo = location.state?.from?.pathname;
//       if (user.role === "admin") {
//         navigate("/admin/dashboard");
//       } else {
//         navigate(redirectTo || "/");
//       }
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Login failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="page-wrapper auth-page">
//       <div className="card form-card">
//         <h2 className="mb-8" style={{ textAlign: "center" }}>Welcome Back</h2>
//         <p className="text-muted mb-24" style={{ textAlign: "center" }}>
//           Login to continue shopping
//         </p>

//         <form onSubmit={handleSubmit} noValidate>
//           <div className="form-group">
//             <label className="form-label">Email</label>
//             <input
//               type="email"
//               name="email"
//               className="form-input"
//               value={formData.email}
//               onChange={handleChange}
//               placeholder="you@example.com"
//             />
//             {errors.email && <p className="form-error">{errors.email}</p>}
//           </div>

//           <div className="form-group">
//             <label className="form-label">Password</label>
//             <input
//               type="password"
//               name="password"
//               className="form-input"
//               value={formData.password}
//               onChange={handleChange}
//               placeholder="••••••••"
//             />
//             {errors.password && <p className="form-error">{errors.password}</p>}
//           </div>

//           <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
//             {loading ? "Logging in..." : "Login"}
//           </button>
//         </form>

//         <p className="mt-24 text-muted" style={{ textAlign: "center" }}>
//           Don't have an account? <Link to="/register" style={{ color: "var(--color-primary)", fontWeight: 600 }}>Register</Link>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Login;
