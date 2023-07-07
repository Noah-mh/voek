import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Products from "./Products";

const SearchResults = () => {
  const [input, setInput] = useState<string | undefined>(undefined);
  const { userInput } = useParams<{ userInput: string }>();

  useEffect(() => {
    // const currentInput = userInput == "" ? "" : userInput;
    // console.log("currentInput", currentInput == "");
    setInput(userInput);
  }, [userInput]);

  return (
    <div className="">{input !== "" && <Products userInput={input} />}</div>
  );
};

export default SearchResults;
