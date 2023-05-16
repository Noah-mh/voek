import { useEffect } from "react";
import { Link } from "react-router-dom";

interface ResultProps {
  result: {
    name: string;
  };
  fnMouseClick?: () => void;
}

const Product = ({ result, fnMouseClick }: ResultProps) => {
  // useEffect(() => {
  //   console.log("result", result);
  // }, [result]);

  return (
    <Link
      to={`/searchResults/${result.name}`}
      onMouseDown={(e) => e.preventDefault()}
      onClick={() => {
        fnMouseClick && fnMouseClick();
      }}
    >
      <div className="hover:cursor-pointer hover:bg-greyAccent hover:bg-opacity-10 p-2">
        {result.name}
      </div>
    </Link>
  );
};

export default Product;
