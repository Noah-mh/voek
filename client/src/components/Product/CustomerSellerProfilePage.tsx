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
import Typography from "@mui/material/Typography";
import AllProducts from "./AllProducts";
import CategoryProducts from "./CategoryProducts";
import RedeemVoucher from "../RedeemVoucher/RedeemVoucher";
import { AiOutlineShop } from "react-icons/ai";
import { ToastContainer, toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
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
        <div className=" flex items-center justify-center sellerBanner ">
          <div className="w-40 h-40 mb-5 mr-5">
            <AdvancedImage cldImg={cld.image(sellerData[0].image_url)} />
          </div>
          <div className="flex flex-col justify-center w-1/3  text-white opacity-90">
            <Typography
              gutterBottom
              variant="h4"
              component="div"
              classes="font-Barlow font-semibold"
            >
              {sellerData[0].shop_name}
            </Typography>
            <div className="flex">
              <AiOutlineShop className="mr-1" />
              <Typography variant="body2">
                Products: {sellerData[0].total_products}
              </Typography>
            </div>
          </div>
          <div>
            <button
              className=" flex items-center bg-transparent border-2 border-white  p-2 px-4 font-Barlow font-semibold uppercase text-white rounded-md text-xs  hover:bg-white  hover:text-darkerPurple"
              onClick={handleOnClickChat}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="w-6 h-6 mr-2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
                />
              </svg>
              Chat
            </button>
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
