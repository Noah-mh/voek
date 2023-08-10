import "./css/Homepage.css";
import { useState, useEffect, useContext } from "react";
import Slider from "./Slider.js";
import { Banner } from "./Banner.js";
import Category from "./Category.js";

import axios from "../../api/axios.js";
import CustomerContext from "../../context/CustomerProvider.js";

interface Product {
  product_id: number;
  name: string;
  description: string;
  image: string;
  rating: number;
}

const Homepage = () => {
  const [topProducts, setTopProducts] = useState<Array<Product>>([]);
  const [forYouProducts, setForYouProducts] = useState<Array<Product>>([]);

  const { customer } = useContext(CustomerContext);
  const customerId = customer.customer_id;

  useEffect(() => {
    axios
      .get("/topProducts")
      .then((response) => {
        const topProducts = response.data.map((product: any) => {
          const image = axios.get(`/getProductImage/${product.product_id}`);
          const pricing = axios.get(
            `/getProductVariationsPricing/${product.product_id}`
          );
          const promises = [image, pricing];
          return Promise.all(promises).then((responses) => {
            product.image = product.image =
              responses[0].data[0]?.imageURL ||
              "/test/No_Image_Available_hyxfvc.jpg";
            product.lowestPrice = responses[1].data[0].lowestPrice;
            product.highestPrice = responses[1].data[0].highestPrice;
            return product;
          });
        });
        return topProducts;
      })
      .then((topProducts) => {
        Promise.all(topProducts).then((products) => {
          setTopProducts(products);
        });
      })
      .catch((err: any) => {
        console.error(err);
      });

    if (customerId != undefined) {
      axios
        .get(`/getCustomerLastViewedCat/${customerId}`)
        .then((response) => {
          return response.data[0].categoryId;
        })
        .then((categoryId) => {
          return axios
            .get(`/getRecommendedProductsBasedOnCat/${categoryId}`)
            .then((response) => {
              return response.data;
            });
        })
        .then((data) => {
          console.log("data: ", data);
          if (data.length === 0) {
            return data;
          }
          const topProducts = data.map((product: any) => {
            const image = axios.get(`/getProductImage/${product.product_id}`);
            const pricing = axios.get(
              `/getProductVariationsPricing/${product.product_id}`
            );
            const promises = [image, pricing];
            return Promise.all(promises).then((responses) => {
              product.image = product.image =
                responses[0].data[0]?.imageURL ||
                "/test/No_Image_Available_hyxfvc.jpg";
              product.lowestPrice = responses[1].data[0].lowestPrice;
              product.highestPrice = responses[1].data[0].highestPrice;
              return product;
            });
          });
          return topProducts;
        })
        .then((topProducts) => {
          console.log("products: ", topProducts);
          Promise.all(topProducts).then((products) => {
            console.log("products: ", products);
            setForYouProducts(products);
          });
        })
        .catch((err: any) => {
          console.error(err);
        });
    }
  }, []);

  return (
    <div className="Homepage">
      <Banner />
      <Category />
      <div className="sliders">
        <Slider header={"Top Picks"} products={topProducts} />
        <div className="w-4/5 h-1 bg-gray-400 mx-auto rounded-md"></div>
        {customerId != undefined && forYouProducts.length > 0 && (
          <Slider header={"For You"} products={forYouProducts} />
        )}
      </div>
    </div>
  );
};

export default Homepage;
