import React, { useEffect, useState, useContext } from "react";
import axios from "../../api/axios";
import Loader from "../Loader/Loader";
import { useParams } from "react-router-dom";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import AllProducts from "./AllProducts";
import CategoryProducts from "./CategoryProducts";
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
    total_product: number;
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
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
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
            const result: any = await Promise.all([getSellerData(), getCategoryData(), getProductData()]);
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

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        console.log(event);
        setValue(newValue);
    };

    categoryData?.map((category) => (
        console.log(category.category_name)
    ));



    if (isLoading) {
        return (
            <div className="flex justify-center items-center">
                <Loader />
            </div>
        );
    } else {
        return (
            <div >
                <Box sx={{ maxWidth: { xs: 320, sm: 480 }, bgcolor: 'background.paper' }}>
                    <Tabs value={value}
                        onChange={handleChange}
                        variant="scrollable"
                        scrollButtons="auto"
                        aria-label="scrollable auto tabs example">
                        <Tab label="All Products" {...a11yProps(0)} />
                        {categoryData?.map((category, index) => (
                            <Tab key={index} label={category.category_name} {...a11yProps(index + 1)} />
                        ))}
                    </Tabs>
                </Box>
                <TabPanel value={value} index={0}>
                    <AllProducts productData={productData} />
                </TabPanel>
                {categoryData?.map((category, index) => (
                    <TabPanel key={index} value={value} index={index + 1}>
                        <CategoryProducts seller_id={sellerData[0].seller_id} category_id={category.category_id} />
                    </TabPanel>
                ))}
            </div>
        )
    }
}

export default CustomerSellerProfilePage;