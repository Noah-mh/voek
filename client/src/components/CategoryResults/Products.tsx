import { useEffect, useState } from "react";
import Loader from "../Loader/Loader";
import ProductCard from "../Result/ProductCard";
import axios from "../../api/axios";

interface ProductsProps {
  categoryId: string | undefined;
}

interface Product {
  product_id: number;
  name: string;
  description: string;
  image: string;
}

const Products = ({ categoryId }: ProductsProps) => {
  const [products, setProducts] = useState<Array<Product>>([]);
  const [status, setStatus] = useState<boolean>(false);

  useEffect(() => {
    axios
      .get(`/getProductsUsingCategory/${categoryId}`, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      })
      .then((response: any) => response.data)
      .then((data: Array<Product>) => {
        setStatus(true);
        setProducts(data);
      })
      .catch((err: any) => {
        console.error(err);
        setStatus(false);
      });
  }, [categoryId]);

  return (
    <div>
      <div>
        {status ? (
          <div>
            {products.length > 0 ? (
              <div className="flex flex-wrap">
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
                No products are currently sold for this category
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
