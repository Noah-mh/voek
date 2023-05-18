import { useEffect, useState, useContext } from "react";
import { macbook } from "./images";
import { Link } from "react-router-dom";
import Loader from "../Loader/Loader";
import "./css/WishlistCard.css";
import useAxiosPrivateCustomer from "../../hooks/useAxiosPrivateCustomer";
import CustomerContext from "../../context/CustomerProvider";

const WishlistCard = () => {
  const axiosPrivateCustomer = useAxiosPrivateCustomer();

  const [wishlistItems, setWishlistItems] = useState<any>([]);
  const [status, setStatus] = useState<boolean>(false);

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
        setStatus(true);
        setWishlistItems(data);
      })
      .catch((err: any) => {
        console.log(err);
        setStatus(false);
      });
  }, []);

  return (
    <div>
      {status ? (
        <div>
          {wishlistItems.length > 0 ? (
            <div>
              {wishlistItems.map((item: any) => {
                return (
                  <Link to={`/productDetailsWithReviews/${item.product_id}`}>
                    <div className="p-1">
                      <div className="flex flex-col items-center bg-gray-100 rounded-lg shadow md:flex-row md:max-w-xl hover:bg-lighterGreyAccent hover:cursor-pointer">
                        <img
                          className="object-cover w-full rounded-t-lg h-96 md:h-auto md:w-48 md:rounded-none md:rounded-l-lg"
                          src={macbook}
                          alt=""
                        />
                        <div className="flex flex-col justify-between p-4 leading-normal">
                          <h5 className="mb-2 text-2xl font-bold tracking-wider text-greyAccent">
                            {item.name}
                          </h5>
                          <h5 className="whislistPrice mb-2 text-2xl font-bold tracking-wider dark:text-white">
                            ${item.price}
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
        </div>
      ) : (
        <Loader />
      )}
    </div>
  );
};

export default WishlistCard;
