import { useState, useEffect } from "react";
import useDebounce from "../../hooks/useDebounce";
import "./SearchBar.css";

const SearchBar = ({ onSearch, placeholder = "Search products..." }) => {
  const [value, setValue] = useState("");
  const debouncedValue = useDebounce(value, 400);

  useEffect(() => {
    onSearch(debouncedValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue]);

  return (
    <div className="search-bar">
      <input
        type="text"
        className="form-input"
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;
