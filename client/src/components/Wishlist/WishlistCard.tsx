import { useEffect, useState } from "react";
import { macbook } from "./images";
import Loader from "./Loader";
import axios from "../../api/axios";

const WishlistCard = () => {
  const [wishlistItems, setWishlistItems] = useState<any>([]);
  const [status, setStatus] = useState<boolean>(false);
  const [customerId, setCustomerId] = useState<number>(1);

  useEffect(() => {
    const getWishlistItems = async () => {
      try {
        const response = await axios.post(
          `/getWishlistItems`,
          JSON.stringify({ customerId }),
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );
        console.log(response.data);
        return response.data;
      } catch (err: any) {
        setStatus(false);
      }
    };
    const reponseArr: Promise<any> = getWishlistItems().then((data: any) => {
      return data;
    });
    reponseArr.then((data: any) => {
      setStatus(true);
      setWishlistItems(data);
    });
  }, []);

  return (
    <div>
      {status ? (
        <div>
          {wishlistItems.map((item: any) => {
            return (
              <div className="p-1">
                <div className="flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
                  <img
                    className="object-cover w-full rounded-t-lg h-96 md:h-auto md:w-48 md:rounded-none md:rounded-l-lg"
                    src={macbook}
                    alt=""
                  />
                  <div className="flex flex-col justify-between p-4 leading-normal">
                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                      {item.name}
                    </h5>
                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                      ${item.price}
                    </h5>
                    <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <Loader />
      )}
    </div>
  );
};

export default WishlistCard;
