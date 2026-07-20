import "./Loader.css";

const Loader = ({ fullPage = false }) => {
  return (
    <div className={fullPage ? "loader-fullpage" : "loader-inline"}>
      <div className="spinner"></div>
    </div>
  );
};

export default Loader;
