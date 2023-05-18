import { useEffect, useState, useContext } from "react";
import { macbook } from "./images";
import { Link } from "react-router-dom";
import Loader from "../Loader/Loader";
import "./css/WishlistCard.css";
import useAxiosPrivateCustomer from "../../hooks/useAxiosPrivateCustomer";
import axios from "../../api/axios";
import CustomerContext from "../../context/CustomerProvider";
import { AdvancedImage } from "@cloudinary/react";
import { cld } from "../../Cloudinary/Cloudinary";

interface Pricing {
  lowestPrice: number;
  highestPrice: number;
}

const WishlistCard = () => {
  const axiosPrivateCustomer = useAxiosPrivateCustomer();

  const [wishlistItems, setWishlistItems] = useState<any>([]);
  const [status, setStatus] = useState<boolean>(false);
  const [categoryProduct, setCategoryProduct] = useState<any>([]);

  const { customer } = useContext(CustomerContext);
  const customerId = customer.customer_id;

  useEffect(() => {
    axiosPrivateCustomer
      .post(`/getWishlistItems`, JSON.stringify({ customerId }), {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      })
      .then((response) => response.data)
      .then((data) => {
        const promises = data.map((product: any) => {
          return axios
            .get(`/getProductImage/${product.product_id}`)
            .then((response: any) => {
              return { product: product, data: response.data };
            });
        });
        return Promise.all(promises);
      })
      .then((responses: any) => {
        const wishlistItems = responses.map((response: any) => {
          response.product.image = response.data[0].imageURL;
          return response.product;
        });
        return wishlistItems;
      })
      .then((wishlistItems: any) => {
        const promises = wishlistItems.map((product: any) => {
          return axios
            .get(`/getProductVariationsPricing/${product.product_id}`)
            .then((response: any) => {
              return { product: product, data: response.data };
            });
        });
        return Promise.all(promises);
      })
      .then((responses: any) => {
        const wishlistItems = responses.map((response: any) => {
          response.product.lowestPrice = response.data[0].lowestPrice;
          response.product.highestPrice = response.data[0].highestPrice;
          return response.product;
        });
        setWishlistItems(wishlistItems);
        return wishlistItems;
      })
      .then((wishlistItems: any) => {
        const randomNum: number = Math.floor(
          Math.random() * wishlistItems.length
        );
        const randomProduct: any = wishlistItems[randomNum];
        console.log("randomProduct", randomProduct);
        return axiosPrivateCustomer.get(
          `/getRecommendedProductBasedOnCat/${randomProduct.category_id}`
        );
      })
      .then((response: any) => response.data)
      .then((data) => {
        setStatus(true);
        const image = axios.get(`/getProductImage/${data[0].product_id}`);
        const pricing = axios.get(
          `/getProductVariationsPricing/${data[0].product_id}`
        );
        const promises = [image, pricing];
        return Promise.all(promises).then((responses) => {
          const product = data[0];
          product.image = responses[0].data[0].imageURL;
          product.lowestPrice = responses[1].data[0].lowestPrice;
          product.highestPrice = responses[1].data[0].highestPrice;
          return product;
        });
      })
      .then((product: any) => {
        setCategoryProduct(product);
      })
      .catch((err: any) => {
        console.log(err);
        setStatus(false);
      });
  }, []);

  useEffect(() => {
    console.log("categoryProduct", categoryProduct);
  }, [categoryProduct]);

  return (
    <div>
      {status ? (
        <div className="container flex">
          {wishlistItems.length > 0 ? (
            <div className="w-7/12 bg-white rounded-lg shadow-lg p-2">
              {wishlistItems.map((item: any, index: number) => {
                return (
                  <Link
                    to={`/productDetailsWithReviews/${item.product_id}`}
                    key={index}
                  >
                    <div className="p-1">
                      <div className="flex flex-col items-center bg-gray-100 rounded-lg shadow md:flex-row md:max-w-xl hover:bg-lighterGreyAccent hover:cursor-pointer">
                        <AdvancedImage
                          className="object-cover w-full rounded-t-lg h-96 md:h-auto md:w-48 md:rounded-none md:rounded-l-lg"
                          cldImg={cld.image(item.image)}
                          alt="product image"
                        />
                        <div className="flex flex-col justify-between p-4 leading-normal">
                          <h5 className="mb-2 text-2xl font-bold tracking-wider text-greyAccent">
                            {item.name}
                          </h5>
                          <h5 className="whislistPrice mb-2 text-2xl font-bold tracking-wider dark:text-white">
                            $
                            {item?.lowestPrice === item?.highestPrice
                              ? item?.lowestPrice
                              : item?.lowestPrice + " - $" + item?.highestPrice}
                          </h5>
                          <p className="whislistDescription mb-3 font-normal text-greyAccent dark:text-gray-400">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div>
              <div>Uh-oh!</div>
              <div>It seems like you don't have any wishlisted item.</div>
              <div>Let's go find some items!</div>
            </div>
          )}
          <div className="wishlistCardRecommendedProducts right w-5/12 p-5 bg-softerPurple flex flex-col items-center">
            <h1 className="tracking-wider">Recommended Product</h1>
            {categoryProduct != null ? (
              <Link
                to={`/productDetailsWithReviews/${categoryProduct.product_id}`}
              >
                <div className="p-1">
                  <div className="flex flex-col items-center bg-gray-100 rounded-lg shadow md:flex-row md:max-w-xl hover:bg-lighterGreyAccent hover:cursor-pointer">
                    <AdvancedImage
                      className="object-cover w-full rounded-t-lg h-96 md:h-auto md:w-48 md:rounded-none md:rounded-l-lg"
                      cldImg={cld.image(categoryProduct.image)}
                      alt="product image"
                    />
                    <div className="flex flex-col justify-between p-4 leading-normal">
                      <h5 className="mb-2 text-2xl font-bold tracking-wider text-greyAccent">
                        {categoryProduct.name}
                      </h5>
                      <h5 className="whislistPrice mb-2 text-2xl font-bold tracking-wider dark:text-white">
                        $
                        {categoryProduct?.lowestPrice ===
                        categoryProduct?.highestPrice
                          ? categoryProduct?.lowestPrice
                          : categoryProduct?.lowestPrice +
                            " - $" +
                            categoryProduct?.highestPrice}
                      </h5>
                      <h6 className="whislistCardDescription mb-3 font-normal text-greyAccent">
                        {categoryProduct.description}
                      </h6>
                    </div>
                  </div>
                </div>
              </Link>
            ) : (
              <div>No items to recommend at this moment</div>
            )}
          </div>
        </div>
      ) : (
        <Loader />
      )}
    </div>
  );
};

export default WishlistCard;
