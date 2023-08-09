import React, { useEffect, useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import HomePage from "../HomepageSeller/HomePage";
import AddProduct from "./AddProduct.js";
import ManageProducts from "./ManageProducts.js";
import EditProduct from "./EditProduct.js";
import ManageOrders from "./ManageOrders.js";
import SellerVouchers from "../SellerVouchers/SellerVouchers.js";
import Product from "../header/Product.js";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface Product {
  productId: number;
  active: boolean;
  name: string;
  price: number;
  quantity: number;
  sku: string;
  subRows: Array<Product>;
  imageUrl: string

  // optional properties
  // product only
  showSubrows?: boolean;
  description?: string;
  categoryId?: number;
  category?: string;

  // product variations only
  variation1?: string;
  variation2?: string;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box
          sx={{
            p: 3,
            flexGrow: 1, // make it take up the remaining space

            width: "100%",
          }}
        >
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

const Sidebar: React.FC = () => {
  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    sessionStorage.setItem('sCurrentTab', String(newValue));
  };
  useEffect(() => {
    const tabIndex = sessionStorage.getItem('sCurrentTab');
    if (tabIndex) {
      setValue(Number(tabIndex));
    }
  }, []);

  const [value, setValue] = useState<number>(0);

  const [product, setProduct] = useState<Product>({
    productId: 0,
    active: false,
    showSubrows: false,
    name: "",
    description: "",
    categoryId: 0,
    category: "",
    price: 0,
    quantity: 0,
    sku: "",
    subRows: [],
    imageUrl: "",
  });

  const updateProductValue = async (newProduct: Product) => {
    Promise.resolve(setProduct(newProduct))
      .then(() => { setValue(5) });
  }

  return (
    <Box
      sx={{
        flexGrow: 1,
        bgcolor: "background.paper",
        display: "flex",
      }}
      className="pl-10"
    >
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={handleChange}
        aria-label="Vertical tabs example"
        sx={{
          borderRight: 1,
          borderColor: "divider",
          width: "25%",
        }}
      >
        <Tab label="Home" {...a11yProps(0)} />
        <Tab label="Add Product" {...a11yProps(1)} />
        <Tab label="Manage Product" {...a11yProps(2)} />
        <Tab label="Manage Orders" {...a11yProps(3)} />
        <Tab label="Manage Vouchers" {...a11yProps(4)} />
        <Tab label="Edit Product" {...a11yProps(5)} disabled sx={{ opacity: 0 }} />
      </Tabs>
      <TabPanel value={value} index={0}>
        <HomePage />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <AddProduct />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <ManageProducts updateProductValue={() => { updateProductValue }} />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <ManageOrders />
      </TabPanel>
      <TabPanel value={value} index={4}>
        <SellerVouchers />
      </TabPanel>
      <TabPanel value={value} index={5}>
        <EditProduct product={product} />
      </TabPanel>
    </Box>
  );
};

export default Sidebar;
