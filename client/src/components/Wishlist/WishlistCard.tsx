import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import Loader from "../Loader/Loader";
import "./css/WishlistCard.css";
import useAxiosPrivateCustomer from "../../hooks/useAxiosPrivateCustomer";
import axios from "../../api/axios";
import CustomerContext from "../../context/CustomerProvider";
import { AdvancedImage } from "@cloudinary/react";
import { cld } from "../../Cloudinary/Cloudinary";

const WishlistCard = () => {
  const axiosPrivateCustomer = useAxiosPrivateCustomer();

  const [wishlistItems, setWishlistItems] = useState<any>([]);
  const [status, setStatus] = useState<boolean>(false);
  const [categoryProducts, setCategoryProducts] = useState<any>([]);

  const { customer } = useContext(CustomerContext);
  const customerId = customer.customer_id;

  useEffect(() => {
    axiosPrivateCustomer
      .get(`/getWishlistItems/${customerId}`)
      .then((response) => {
        const products = response.data.map((product: any) => {
          const image = axios.get(`/getProductImage/${product.product_id}`);
          const pricing = axios.get(
            `/getProductVariationsPricing/${product.product_id}`
          );
          return Promise.all([image, pricing]).then((responses) => {
            console.log("response.data[0]: ", responses[0].data[0]);
            if (responses[0].data[0] === undefined) {
              product.image = "/test/No_Image_Available_hyxfvc.jpg";
            } else {
              product.image = responses[0].data[0].imageURL;
            }
            product.lowestPrice = responses[1].data[0].lowestPrice;
            product.highestPrice = responses[1].data[0].highestPrice;
            return product;
          });
        });
        console.log("products", products);
        return products;
      })
      .then((products) => {
        return Promise.all(products).then((products) => {
          setWishlistItems(products);
          return products;
        });
      })
      .then((wishlistItems: any) => {
        if (wishlistItems.length > 0) {
          const randomNum: number = Math.floor(
            Math.random() * wishlistItems.length
          );
          const randomProduct: any = wishlistItems[randomNum];
          console.log("randomProduct", randomProduct);
          return axiosPrivateCustomer.get(
            `/getRecommendedProductsBasedOnCatWishlist/${randomProduct.category_id}`
          );
        }
      })
      .then((response: any) => {
        if (response != null) {
          const products = response.data.map((product: any) => {
            const image = axios.get(`/getProductImage/${product.product_id}`);
            const pricing = axios.get(
              `/getProductVariationsPricing/${product.product_id}`
            );
            const promises = [image, pricing];
            return Promise.all(promises).then((responses) => {
              product.image = responses[0].data[0].imageURL;
              product.lowestPrice = responses[1].data[0].lowestPrice;
              product.highestPrice = responses[1].data[0].highestPrice;
              return product;
            });
          });
          return products;
        }
      })
      .then((products) => {
        if (products != null) {
          Promise.all(products).then((products) => {
            setCategoryProducts(products);
          });
        }
        setStatus(true);
      })
      .catch((err: any) => {
        console.log(err);
        setStatus(false);
      });
  }, []);

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
            <div className="my-3 mx-36 flex justify-center items-center text-lg whitespace-nowrap">
              <div>
                <div className="py-1">Uh-oh! 😔</div>
                <div className="py-1">
                  It seems like you don't have any wishlisted item.
                </div>
                <Link
                  to="/"
                  className="text-purpleAccent font-semibold hover:text-softerPurple py-1"
                >
                  Let's go find some items!
                </Link>
              </div>
            </div>
          )}
          <div className="wishlistCardRecommendedProducts right w-5/12 p-5 bg-softerPurple flex flex-col items-center">
            <h1 className="tracking-wider">Recommended Products</h1>
            {categoryProducts.length > 0 ? (
              categoryProducts.map((item: any, index: number) => {
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
                          <h6 className="whislistCardDescription mb-3 font-normal text-greyAccent">
                            {item.description}
                          </h6>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })
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
