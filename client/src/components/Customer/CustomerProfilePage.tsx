import { useState, useEffect } from "react";
import CustomerProfile from "./CustomerProfile";
import ViewOrders from "./ViewOrders";
import ViewReceived from "./ViewReceived";
import ViewDelivered from "./ViewDelivered";
import useCustomer from "../../hooks/UseCustomer";
import { Customer } from "./CustomerProfile";
import useAxiosPrivateCustomer from "../../hooks/useAxiosPrivateCustomer";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import AddressDisplay from "./Address";
import Loader from "../Loader/Loader";


interface Product {
  description: string;
  name: string;
  price: number;
  product_id: number;
  variation_1?: string;
  variation_2?: string;
  quantity: number;
  sku: string;
  orders_date?: string;
  shipment_created?: string;
  shipment_delivered?: string;
  image_url?: string;
  orders_product_id?: number;
  seller_id: string;
  orders_id: string;
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
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box
          sx={{
            p: 3,
            flexGrow: 1, // make it take up the remaining space

            width: "80%",
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

const CustomerProfilePage = () => {
  const { customer } = useCustomer();
  const axiosPrivateCustomer = useAxiosPrivateCustomer();
  const [customerData, SetCustomerData] = useState<Customer>();
  const [orders, setOrders] = useState<Product[]>([]);
  const [deliveredOrders, setDeliveredOrders] = useState<Product[]>([]);
  const [receivedOrders, setReceivedOrders] = useState<Product[]>([]);
  const [value, setValue] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    console.log(event)
    setValue(newValue);
  };

  const getCustomerDetails = async () => {
    try {
      return await axiosPrivateCustomer.get(
        `/customer/profile/${customer.customer_id}`
      );
    } catch (err: any) {
      console.log(err);
    }
  };

  const getOrders = async () => {
    try {
      return await axiosPrivateCustomer.get(
        `/customer/orders/${customer.customer_id}`
      );
    } catch (err: any) {
      console.log(err);
    }
  };

  const getDeliveredOrders = async () => {
    try {
      return await axiosPrivateCustomer.get(
        `/customer/delivered/orders/${customer.customer_id}`
      );
    } catch (err: any) {
      console.log(err);
    }
  };

  const getReceivedOrders = async () => {
    try {
      return await axiosPrivateCustomer.get(
        `/customer/received/orders/${customer.customer_id}`
      );
    } catch (err: any) {
      console.log(err);
    }
  };

  useEffect(() => {
    getAll();
  }, []);

  const getAll = async () => {
    try {
      const result: any = await Promise.all([
        getCustomerDetails(),
        getOrders(),
        getDeliveredOrders(),
        getReceivedOrders(),
      ]);
      SetCustomerData(result[0].data.details[0]);
      setOrders(result[1].data.listedOrders);
      setDeliveredOrders(result[2].data.listedOrdersDelivered);
      setReceivedOrders(result[3].data.listedOrdersReceived);
      setIsLoading(false);
    } catch (err: any) {
      console.log(err);
    }
  };
  if (isLoading) {
    return (
      <div className="flex justify-center items-center">
        <Loader />
      </div>
    );
  } else {
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
          <Tab label="Profile" {...a11yProps(0)} />
          <Tab label="Addresses" {...a11yProps(1)} />
          <Tab label="Orders" {...a11yProps(2)} />
          <Tab label="Delivered Orders" {...a11yProps(3)} />
          <Tab label="Received Orders" {...a11yProps(4)} />
        </Tabs>
        <TabPanel value={value} index={0}>
          {/* Profile content */}
          <CustomerProfile customerData={customerData!} getAll={getAll} />
        </TabPanel>
        <TabPanel value={value} index={1}>
          {/* Addresses content */}
          <AddressDisplay customerData={customerData!} getAll = {getAll}/>
        </TabPanel>
        <TabPanel value={value} index={2}>
          {/* Orders content */}
          <ViewOrders orders={orders} />
        </TabPanel>
        <TabPanel value={value} index={3}>
          {/* Delivered Orders content */}
          <ViewDelivered deliveredOrders={deliveredOrders} getAll={getAll} />
        </TabPanel>
        <TabPanel value={value} index={4}>
          {/* Received Orders content */}
          <ViewReceived receivedOrders={receivedOrders} />
        </TabPanel>
      </Box>
    );
  }
};

export default CustomerProfilePage;
