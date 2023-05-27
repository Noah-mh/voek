import { useState, useEffect } from 'react';
import useSeller from '../../hooks/useSeller.js';
import useAxiosPrivateSeller from "../../hooks/useAxiosPrivateSeller.js";
import ViewSellerOrders from './ViewSellerOrders.js';
import ViewSellerShipped from './ViewSellerShipped.js';
import ViewSellerDelivered from './ViewSellerDelivered.js';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';


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


interface Order {
  orders_id: number;
  customer_id: number;
  username: string;
  email: string;
  quantity: number;
  product_id: number;
  orders_product_id: number;
  variation_1?: string;
  variation2?: string;
  orders_date?: string;
  shipment_created?: string;
  shipment_delivered?: string;
  total_price: number;
  name: string;
}

const ManageOrders = () => {
  const axiosPrivateSeller = useAxiosPrivateSeller();
  const { seller } = useSeller();

  const [orders, setOrders] = useState<Order[]>([]);
  const [shippedOrders, setShippedOrders] = useState<Order[]>([]);
  const [deliveredOrders, setDeliveredOrders] = useState<Order[]>([]);
  const [activeComponent, setActiveComponent] = useState<string>('orders');
  const [value, setValue] = useState<number>(0);


  const getOrders = async () => {
    try {
      return await axiosPrivateSeller.get(`/seller/orders/${seller.seller_id}`);
    } catch (err: any) {
      console.log(err);
    }
  }

  const getShippedOrders = async () => {
    try {
      return await axiosPrivateSeller.get(`/seller/orders/shipped/${seller.seller_id}`);
    } catch (err: any) {
      console.log(err);
    }
  }

  const getDeliveredOrders = async () => {
    try {
      return await axiosPrivateSeller.get(`/seller/orders/delivered/${seller.seller_id}`);
    } catch (err: any) {
      console.log(err);
    }
  }

  useEffect(() => {
    getAll();
  }, []);

  const getAll = async () => {
    try {
      const result: any = await Promise.all([getOrders(), getShippedOrders(), getDeliveredOrders()]);
      setOrders(result[0].data.orders);
      setShippedOrders(result[1].data.shipped);
      setDeliveredOrders(result[2].data.delivered);
    } catch (err: any) {
      console.log(err);
    }
  }


  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    console.log(event);
    setValue(newValue);
};

  return (
    <div className="flex">
      <div>
        <Box sx={{ maxWidth: { xs: 320, sm: 480 }, bgcolor: 'background.paper' }}>
          <Tabs value={value}
            onChange={handleChange}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="scrollable auto tabs example">
            <Tab label="Orders" {...a11yProps(0)} />
            <Tab label="Shipped" {...a11yProps(1)} />
            <Tab label="Delivered" {...a11yProps(2)} />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          <ViewSellerOrders orders={orders} getAll={getAll} />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <ViewSellerShipped shippedOrders={shippedOrders} />
        </TabPanel>
        <TabPanel value={value} index={2}>
          <ViewSellerDelivered deliveredOrders={deliveredOrders} />
        </TabPanel>
      </div>
    </div>
  )
}

export default ManageOrders; 
