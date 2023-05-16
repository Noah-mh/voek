import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Products from "./Products";

const SearchResults = () => {
  const [input, setInput] = useState<string | undefined>("");
  const { userInput } = useParams<{ userInput: string }>();

  useEffect(() => {
    setInput(userInput);
  }, [userInput]);

  return <div>{input !== "" && <Products userInput={input} />}</div>;
};

export default SearchResults;
