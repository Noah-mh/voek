import { useState } from "react";
import { useParams } from "react-router-dom";
import Products from "./Products";

const SearchResults = () => {
  const { userInput } = useParams<{ userInput: string }>();

  console.log("userInput SearchResults: ", userInput);

  return (
    <div>
      <Products userInput={userInput} />
    </div>
  );
};

export default SearchResults;
