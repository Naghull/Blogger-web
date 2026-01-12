import React from "react";
import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";

const Search = ({ value, onChange, placeholder = "Search...", style = {} }) => {
  return (
    <Input
      placeholder={placeholder}
      prefix={<SearchOutlined style={{ color: "gray" }} />}
      className="search-input"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={style}
    />
  );
};

export default Search;