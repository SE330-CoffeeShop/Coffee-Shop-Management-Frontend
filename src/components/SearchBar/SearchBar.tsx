"use client";

import { SearchBarProps } from "@/types";
import { Input } from "@heroui/input";
import { useState } from "react";

const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [keyword, setKeyWord] = useState("");

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newKeyWord = e.target.value;
    setKeyWord(newKeyWord);
    onSearch(newKeyWord);
  };
  return (
    <div className="w-64">
      <Input
        value={keyword}
        onChange={handleChangeInput}
        placeholder="Tìm kiếm thức uống..."
        className="w-full p-2 border rounded-md"
      />
    </div>
  );
};

export default SearchBar;
