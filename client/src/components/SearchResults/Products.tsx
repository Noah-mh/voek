import { useEffect, useState } from "react";
import Loader from "../Loader/Loader";
import ProductCard from "../Result/ProductCard";
import axios from "../../api/axios";

interface ProductsProps {
  userInput: string | undefined;
}

const Products = ({ userInput }: ProductsProps) => {
  const [products, setProducts] = useState<Array<object>>([]);
  const [status, setStatus] = useState<boolean>(false);

  useEffect(() => {
    console.log("userInput", userInput == undefined);
    axios
      .get(`/searchResult/${userInput == undefined ? "" : userInput}`)
      .then((response: any) => response.data)
      .then((data: Array<object>) => {
        setStatus(true);
        setProducts(data);
      })
      .catch((err: any) => {
        console.error(err);
        setStatus(false);
      });
  }, [userInput]);

  return (
    <div>
      <div>
        {status ? (
          <div>
            {products.length > 0 ? (
              <div className="flex flex-wrap space-x-2">
                {products.map((product: any, index: number) => {
                  return (
                    <div key={index}>
                      <ProductCard product={product} />
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex justify-center items-center">
                no products found for "{userInput}"
              </div>
            )}
          </div>
        ) : (
          <div className="flex justify-center items-center">
            <Loader />
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
