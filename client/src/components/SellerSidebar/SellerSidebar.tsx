import React, { useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import HomePage from "../HomepageSeller/HomePage";
import AddProduct from "./AddProduct.js";
import ManageProducts from "./ManageProducts.js";
import ManageOrders from "./ManageOrders.js";
import SellerVouchers from "../SellerVouchers/SellerVouchers.js";
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
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box
          sx={{
            p: 3,
            flexGrow: 1, // make it take up the remaining space

            width: "150%",
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
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    console.log(event);
    setValue(newValue);
  };

  const [value, setValue] = useState<number>(0);

  return (
    // // <div className="flex flex-row">
    //     // <nav className={`sidebar ${isMinimized ? 'minimized' : ''} w-1/6 bg-red-100`}>
    //     <nav className={`sidebar ${isMinimized ? ("w-1/8") : ("w-1/6 bg-red-100")} transition-width duration-300`}>
    //         <button onClick={toggleSidebar}>Toggle Sidebar</button>
    //         {isMinimized ? (
    //             <div className="w-1/6 bg-red-100"></div>
    //         ) : (
    //             <div>
    //                 <div className="sidebar-content">
    //                     <Link to="/seller/manageProducts">
    //                         <p className="text-purpleAccent">Manage Products</p>
    //                     </Link>
    //                     <Link to="/seller/addProduct">
    //                         <p className="text-purpleAccent">Add Product</p>
    //                     </Link>
    //                     <Link to="/seller/manageOrders">
    //                         <p className="text-purpleAccent">Manage Orders</p>
    //                     </Link>
    //                 </div>
    //             </div>
    //         )
    //         }
    //     </nav>
    // // </div>
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
        <Tab label="Manager Vouchers" {...a11yProps(4)} />
      </Tabs>
      <TabPanel value={value} index={0}>
        <HomePage />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <AddProduct />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <ManageProducts />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <ManageOrders />
      </TabPanel>
      <TabPanel value={value} index={4}>
        <SellerVouchers />
      </TabPanel>
    </Box>
  );
};

export default Sidebar;
