import { Link } from "react-router-dom";
import "./EmptyState.css";

const EmptyState = ({ title, message, actionLabel, actionTo }) => {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">🛍️</div>
      <h3>{title}</h3>
      <p className="text-muted">{message}</p>
      {actionLabel && actionTo && (
        <Link to={actionTo} className="btn btn-primary mt-16">
          {actionLabel}
        </Link>
      )}
    </div>
  );
};

export default EmptyState;
