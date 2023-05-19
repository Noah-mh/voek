import { useParams } from "react-router-dom";
import Products from "./Products";

const CategoryResults = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  return <div>{categoryId !== "" && <Products categoryId={categoryId} />}</div>;
};

export default CategoryResults;
