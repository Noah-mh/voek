import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import Loader from "../Loader/Loader";
import { cld } from "../../Cloudinary/Cloudinary";
import useAxiosPrivateCustomer from "../../hooks/useAxiosPrivateCustomer";
import useCustomer from "../../hooks/UseCustomer";
import { AdvancedImage } from "@cloudinary/react";
import { useParams } from "react-router-dom";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import AllProducts from "./AllProducts";
import CategoryProducts from "./CategoryProducts";
import RedeemVoucher from "../RedeemVoucher/RedeemVoucher";
import { AiOutlineShop, AiOutlineStar, AiOutlineShopping } from "react-icons/ai";
import { GrUserExpert } from "react-icons/gr";
import { CiChat1 } from "react-icons/ci";
import { ToastContainer, toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import moment from "moment";
import "./css/CustomerSellerProfilePage.css";

//Noah's code
export interface Product {
  product_id: number;
  name: string;
  price: number;
  sku: string;
  rating: number;
  category_id: number;
  category_name: string;
  image_url: string;
}

interface seller {
  seller_id: number;
  shop_name: string;
  image_url: string;
  total_products: number;
  total_reviews: number;
  rating: number;
  date_created: Date;
}

interface Category {
  category_id: number;
  category_name: string;
}
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const CustomerSellerProfilePage: React.FC = () => {
  const params = useParams();
  const { seller_id } = params;
  const [sellerData, setSellerData] = useState<seller[]>([]);
  const [diffInMonths, setDiffInMonths] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [categoryData, setCategoryData] = useState<Category[]>([]);
  const [productData, setProductData] = useState<Product[]>([]);
  const [value, setValue] = useState<number>(0);
  const navigate = useNavigate();
  const axiosPrivateCustomer = useAxiosPrivateCustomer();
  const { customer } = useCustomer();
  const customer_id = customer.customer_id;

  const getSellerData = async () => {
    try {
      return await axios.get(`/sellerDetails/${seller_id}`);
    } catch (err: any) {
      console.log(err);
    }
  };

  const getCategoryData = async () => {
    try {
      return await axios.get(`/sellerCategories/${seller_id}`);
    } catch (err: any) {
      console.log(err);
    }
  };

  const getProductData = async () => {
    try {
      return await axios.get(`/sellerProducts/${seller_id}`);
    } catch (err: any) {
      console.log(err);
    }
  };

  const getAllData = async () => {
    try {
      const result: any = await Promise.all([
        getSellerData(),
        getCategoryData(),
        getProductData(),
      ]);
      setSellerData(result[0].data.sellerDetails);
      setCategoryData(result[1].data.sellerCategories);
      setProductData(result[2].data.sellerProductsDetails);
      setIsLoading(false);
    } catch (err: any) {
      console.log(err);
    }
  };

  useEffect(() => {
    getAllData();
  }, []);

  useEffect(() => {
    if (sellerData.length > 0) {
      const date_created = moment(sellerData[0].date_created);

      const diffInMonths = moment().diff(date_created, "months");
      console.log(diffInMonths);
      setDiffInMonths(diffInMonths);
    }
  }, [sellerData]);

  const handleOnClickChat = () => {
    if (!customer_id) {
      toast.warn("Please Log in to chat with the seller", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    } else {
      axiosPrivateCustomer
        .post(
          "/createDMRoom",
          JSON.stringify({
            customerID: customer_id,
            sellerID: sellerData[0].seller_id,
          }),
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        )
        .then((response) => {
          console.log("response", response);
          if (response.status === 201 || response.status === 200) {
            navigate("/chat");
          } else {
            toast.error("Error!", {
              position: "top-center",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            });
          }
        })
        .catch((error) => {
          // Handle error here
          console.error(error);
          toast.error("Error!", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        });
    }
  };
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    console.log(event);
    setValue(newValue);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center">
        <Loader />
      </div>
    );
  } else {
    return (
      <div className="">
        <ToastContainer />
        <div className="flex my-8 items-center justify-center sellerBanner">
          <div className="mx-auto">
            <div className="w-full">
              <div className="w-full bg-white flex p-6 content-between items-center overflow-visible shadow-sm">

                <div className="pr-12 box-border border-r border-gray-200 flex max-w-[27.5rem] justify-center items-center">
                  <Link
                    to={`/customerSellerProfile/${sellerData[0].seller_id}`}
                    className="flex-shrink-0 mr-5 relative overflow-visible outline-0"
                  >
                    <div className="w-20 h-20">
                      <AdvancedImage
                        cldImg={cld.image(sellerData[0].image_url)}
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>
                  </Link>
                  <div className="grow flex flex-col content-center overflow-hidden">
                    <Link
                      to={`/customerSellerProfile/${sellerData[0].seller_id}`}
                      className="overflow-hidden text-ellipsis whitespace-nowrap"
                    >
                      {sellerData[0].shop_name}
                    </Link>
                    <div className="mt-2 flex space-x-2">
                      <div
                        onClick={handleOnClickChat}
                        className="outline-0 border border-purpleAccent bg-pink bg-opacity-10 relative overflow-visible h-9 px-4 flex justify-center items-center hover:cursor-pointer"
                      >
                        <CiChat1 /> <h1 className="ml-2">Chat</h1>
                      </div>
                      <Link
                        to={`/customerSellerProfile/${sellerData[0].seller_id}`}
                        className="outline-0 border border-opacity-10 relative overflow-visible h-9 px-4 flex justify-center items-center"
                      >
                        <AiOutlineShop /> <h1 className="ml-2">Shop</h1>
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="grow grid grid-cols-3 gap-x-36 gap-y-20 pl-10 text-gray-900">
                  <div className="flex space-x-3 relative overflow-visible items-center">
                    <AiOutlineShopping />
                    <h1>Total Products:</h1>{" "}
                    <h1 className="text-pink">
                      {sellerData[0].total_products}
                    </h1>
                  </div>
                  <div className="flex space-x-3 relative overflow-visible items-center">
                    <AiOutlineStar />
                    <h1>Ratings:</h1>{" "}
                    <h1 className="text-pink">{sellerData[0].rating}</h1>
                    <h1 className="text-pink">( {sellerData[0].total_reviews} {sellerData[0].total_reviews < 2 ? "Rating" : "Ratings"} )</h1>
                  </div>
                  <div className="flex space-x-3 relative overflow-visible items-center">
                    <GrUserExpert />
                    <h1>Joined:</h1>{" "}
                    <h1 className="text-pink">
                      {diffInMonths}{" "}
                      {diffInMonths === 1 || diffInMonths === 0 ? "month" : "months"}
                    </h1>
                    <span>ago</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="voucherBox">
          <RedeemVoucher seller_id={sellerData[0].seller_id} />
        </div>
        <div className="contentBox  ">
          <div className="productBox mt-5 justify-center">
            <Box
              sx={{
                maxWidth: { xs: 320, sm: 480, md: 1000, xl: 1000 },
                bgcolor: "background.paper",
              }}
            >
              <Tabs
                value={value}
                onChange={handleChange}
                variant="scrollable"
                scrollButtons="auto"
                aria-label="scrollable auto tabs example"
              >
                <Tab label="All Products" {...a11yProps(0)} />
                {categoryData?.map((category, index) => (
                  <Tab
                    key={index}
                    label={category.category_name}
                    {...a11yProps(index + 1)}
                  />
                ))}
              </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
              <AllProducts productData={productData} />
            </TabPanel>
            {categoryData?.map((category, index) => (
              <TabPanel key={index} value={value} index={index + 1}>
                <CategoryProducts
                  seller_id={sellerData[0].seller_id}
                  category_id={category.category_id}
                />
              </TabPanel>
            ))}
          </div>
        </div>
      </div>
    );
  }
};

export default CustomerSellerProfilePage;
