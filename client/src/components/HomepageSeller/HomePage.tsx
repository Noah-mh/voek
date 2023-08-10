import { useEffect, useState } from 'react'
import useAxiosPrivateSeller from '../../hooks/useAxiosPrivateSeller'
import useSeller from '../../hooks/useSeller'
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line, } from 'recharts';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import StarBorderRoundedIcon from '@mui/icons-material/StarBorderRounded';
import StatisticsCard from './StatisticsCard';
import moment from 'moment';
import { blue } from '@mui/material/colors';
import '@fontsource/roboto/700.css';

interface RevenueData {
  Revenue: number;
  name: string;
}

interface CategoriesData {
  value: number;
  name: string;
}

interface BestProductsData {
  amt: number;
  name: string;
}

const HomePage = () => {

  const axiosPrivateSeller = useAxiosPrivateSeller();

  const { seller } = useSeller();

  const [totalRevenue, setTotalRevenue] = useState<string>("");
  const [percentileOfTotalRevenue, setPercentileOfTotalRevenue] = useState<string>("");
  const [totalProductsSold, setTotalProductsSold] = useState<string>("");
  const [percentileOfTotalProductsSold, setPercentileOfTotalProductsSold] = useState<string>("");
  const [totalCustomers, setTotalCustomers] = useState<string>("");
  const [percentileOfTotalCustomers, setPercentileOfTotalCustomers] = useState<string>("");
  const [averageRatingOfProducts, setAverageRatingOfProducts] = useState<string>("");
  const [ratingPercentileOfProducts, setRatingPercentileOfProducts] = useState<string>("");

  const [revenueFilter, setRevenueFilter] = useState<string>("all");
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [categoriesFilter, setCategoriesFilter] = useState<string>("all");
  const [categoriesData, setCategoriesData] = useState<CategoriesData[]>([]);
  const [bestProductsFilter, setBestProductsFilter] = useState<string>("all");
  const [bestProductsData, setBestProductsData] = useState<BestProductsData[]>([]);

  const getTotalRevenue = async () => {
    try {
      const { data } = await axiosPrivateSeller.get(`/seller/totalRevenue/${seller.seller_id}`);
      setTotalRevenue(data.totalRevenue[0].total_revenue);
    } catch (err: any) {
      console.log(err);
    }
  }

  const getPercentileOfTotalRevenue = async () => {
    try {
      const { data } = await axiosPrivateSeller.get(`/seller/revenuePercentile/${seller.seller_id}`);
      console.log(data)
      setPercentileOfTotalRevenue(data.revenuePercentile[0].revenue_percentile);
    } catch (err: any) {
      console.log(err);
    }
  }

  const getTotalProductsSold = async () => {
    try {
      const { data } = await axiosPrivateSeller.get(`/seller/totalSold/${seller.seller_id}`);
      setTotalProductsSold(data.totalProductsSold[0].total_products_sold);
    } catch (err: any) {
      console.log(err);
    }
  }

  const getPercentileOfTotalProductsSold = async () => {
    try {
      const { data } = await axiosPrivateSeller.get(`/seller/productPercentile/${seller.seller_id}`);
      console.log(data)
      setPercentileOfTotalProductsSold(data.productPercentile[0].product_percentile);
    } catch (err: any) {
      console.log(err);
    }
  }

  const getTotalCustomers = async () => {
    try {
      const { data } = await axiosPrivateSeller.get(`/seller/totalCustomers/${seller.seller_id}`);
      setTotalCustomers(data.totalCustomers[0].total_customers);
    } catch (err: any) {
      console.log(err);
    }
  }

  const getPercentileOfTotalCustomer = async () => {
    try {
      const { data } = await axiosPrivateSeller.get(`/seller/customerPercentile/${seller.seller_id}`);
      console.log(data)
      setPercentileOfTotalCustomers(data.customerPercentile[0].customer_percentile);
    } catch (err: any) {
      console.log(err);
    }
  }

  const getAverageRatingOfProducts = async () => {
    try {
      const { data } = await axiosPrivateSeller.get(`/seller/averageRating/${seller.seller_id}`);
      setAverageRatingOfProducts(data.averageRating[0].average_rating);
    } catch (err: any) {
      console.log(err);
    }
  }

  const getRatingPercentileOfProducts = async () => {
    try {
      const { data } = await axiosPrivateSeller.get(`/seller/ratingPercentile/${seller.seller_id}`);
      console.log(data)
      setRatingPercentileOfProducts(data.ratingPercentile[0].rating_percentile);
    } catch (err: any) {
      console.log(err);
    }
  }

  const getRevenue = async (filter: string) => {
    try {
      const { data } = await axiosPrivateSeller.get(`/seller/products/revenue/${seller.seller_id}/${filter}`);
      // setRevenueData(data.revenue.map((revenue: any) => ({ name: revenue.orders_date, Revenue: parseInt(revenue.total_revenue) })));
      // Extract revenue data
      const revenueData: RevenueData[] = data.revenue.map((revenue: any) => ({
        name: revenue.orders_day,
        Revenue: parseFloat(revenue.total_revenue),
      }));
      // setRevenueData(revenueData);

      const timeRange = [];

      if (filter === "today") {
        // Generate a range of hours
        const startHour = moment().startOf('day');
        const endHour = moment().endOf('day');
        const currentHour = startHour.clone();

        while (currentHour.isBefore(endHour)) {
          timeRange.push(currentHour.format('YYYY-MM-DD HH:00'));
          currentHour.add(1, 'hour');
        }
      } else if (filter === "week" || filter === "month") {
        // Generate a range of dates
        const startDate = moment().subtract(1, filter);
        const endDate = moment(); // Current date
        const currentDate = startDate.clone();

        while (currentDate.isBefore(endDate)) {
          timeRange.push(currentDate.format('YYYY-MM-DD'));
          currentDate.add(1, 'day');
        }
      } else {
        // Find the earliest and latest dates from the revenue data
        const earliestDate = moment.min(revenueData.map(revenue => moment(revenue.name))).startOf('day');
        const latestDate = moment.max(revenueData.map(revenue => moment(revenue.name))).startOf('day');
        const currentDate = earliestDate.clone();

        while (currentDate.isSameOrBefore(latestDate)) {
          timeRange.push(currentDate.format('YYYY-MM-DD'));
          currentDate.add(1, 'day');
        }
      }

      // Merge the generated date range with revenue data
      const mergedData = timeRange.map(time => {
        const matchingRevenue = revenueData?.find(data => data.name === time);
        return {
          name: time,
          Revenue: matchingRevenue ? matchingRevenue.Revenue : 0,
        };
      });

      setRevenueData(mergedData);
    } catch (err: any) {
      console.log(err);
    }
  }

  const getSoldCategories = async (filter: string) => {
    try {
      const { data } = await axiosPrivateSeller.get(`/seller/products/categories/${seller.seller_id}/${filter}`);
      setCategoriesData(data.soldCategories.map((category: any) => ({ name: category.name, value: parseInt(category.value) })));
    } catch (err: any) {
      console.log(err);
    }
  }
  const getBestProducts = async (filter: string) => {
    try {
      const { data } = await axiosPrivateSeller.get(`/seller/products/best/${seller.seller_id}/${filter}`);
      setBestProductsData(data.soldProducts.map((product: any) => ({ name: product.name, amt: parseInt(product.amount) })));
    } catch (err: any) {
      console.log(err);
    }
  }

  useEffect(() => {
    getRevenue(revenueFilter);
  }, [revenueFilter])

  useEffect(() => {
    getSoldCategories(categoriesFilter);
  }, [categoriesFilter])

  useEffect(() => {
    getBestProducts(bestProductsFilter);
  }, [bestProductsFilter])

  useEffect(() => {
    getTotalRevenue();
    getPercentileOfTotalRevenue();
    getTotalProductsSold();
    getPercentileOfTotalProductsSold();
    getTotalCustomers();
    getPercentileOfTotalCustomer();
    getAverageRatingOfProducts();
    getRatingPercentileOfProducts();
  }, [])

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF5733', '#FFB700', '#FFC733', '#FFD966'];

  return (
    <Box>
      <Box
        sx={{
          fontFamily: 'Roboto',
          fontSize: 100,
          padding: 2,
          backgroundColor: blue[100], 
          borderRadius: 5,
          background: `linear-gradient(to bottom, ${blue[100]}, #FFFFFF)`
        }}
      >
        Seller Dashboard
      </Box>
      <Box pr={3}>
        <Grid container spacing={3} m={3} mt={0} ml={0} >
          <StatisticsCard 
            icon={<AttachMoneyIcon />}
            title={"Total Revenue Earned"}
            subheader={`$${totalRevenue}`}
            percentage={`Percentile: ${percentileOfTotalRevenue}`}
          />
          <StatisticsCard 
            icon={<ShoppingCartOutlinedIcon />}
            title={"Total Products Sold"}
            subheader={totalProductsSold}
            percentage={`Percentile: ${percentileOfTotalProductsSold}`}
          />
          <StatisticsCard 
            icon={<AccountCircleIcon />}
            title={"Total Customers"}
            subheader={totalCustomers}
            percentage={`Percentile: ${percentileOfTotalCustomers}`}
          />
          <StatisticsCard 
            icon={<StarBorderRoundedIcon />}
            title={"Average Rating"}
            subheader={averageRatingOfProducts}
            percentage={`Percentile: ${ratingPercentileOfProducts}`}
          />
        </Grid>
        <Grid container spacing={3} m={3} ml={0} boxShadow={1} borderRadius={5}>
          <Grid item xs={12} lg={6}>
            <h1 className="text-2xl font-bold mb-4">Total Revenue</h1>
            <TextField
              select
              label="Period"
              required
              value={revenueFilter}
              onChange={(e) => {
                setRevenueFilter(e.target.value);
              }}
              fullWidth
              sx={{ m: 2, ml: 0 }}
            >
              <MenuItem value="all">All Time</MenuItem>
              <MenuItem value="month">Month</MenuItem>
              <MenuItem value="week">Week</MenuItem>
              <MenuItem value="today">Today</MenuItem>
            </TextField>
            <LineChart
              width={1200}
              height={400}
              data={revenueData}
              margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
            >
              <XAxis dataKey="name" />
              <Tooltip />
              <CartesianGrid stroke="#f5f5f5" />
              {/* <Line type="monotone" dataKey="value" stroke="#ff7300" yAxisId={0} /> */}
              <Line type="monotone" dataKey="Revenue" stroke="#387908" yAxisId={1} />
            </LineChart>
          </Grid>
          {/* <Grid item xs={12} lg={5}>
            <Slider /> 
          </Grid> */}
        </Grid>
        <Grid container spacing={3} rowSpacing={6} m={3} ml={0}>
          <Grid item xs={12} md={7} boxShadow={1} borderRadius={5}>
            <h1 className="text-2xl font-bold mb-4">Top Selling Products</h1>
            <TextField
              select
              label="Period"
              required
              value={bestProductsFilter}
              onChange={(e) => {
                setBestProductsFilter(e.target.value);
              }}
              fullWidth
              sx={{ m: 2, ml: 0, width: 600 }}
            >
              <MenuItem value="all">All Time</MenuItem>
              <MenuItem value="month">Month</MenuItem>
              <MenuItem value="week">Week</MenuItem>
            </TextField>
            <BarChart
              width={550}
              height={300}
              data={bestProductsData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
              barSize={20}
            >
              <XAxis dataKey="name" scale="point" padding={{ left: 10, right: 10 }} />
              <YAxis />
              <Tooltip />
              <Legend />
              <CartesianGrid strokeDasharray="3 3" />
              <Bar dataKey="amt" name="Amount Sold" fill="#8884d8" background={{ fill: '#eee' }} />
            </BarChart>
          </Grid>
          <Grid item md={0.5} />
          <Grid item xs={12} md={4.5} boxShadow={1} borderRadius={5} pr={3} >
            <h1 className="text-2xl font-bold mb-4">Sales Per Category</h1>
            <TextField
              select
              label="Period"
              required
              value={categoriesFilter}
              onChange={(e) => {
                setCategoriesFilter(e.target.value);
              }}
              fullWidth
              sx={{ m: 2, ml: 0 }}
            >
              <MenuItem value="all">All Time</MenuItem>
              <MenuItem value="month">Month</MenuItem>
              <MenuItem value="week">Week</MenuItem>
            </TextField>
            <PieChart width={400} height={300}>
              <Pie
                dataKey="value"
                data={categoriesData}
                cx="160"
                // cy="100"
                labelLine={false}
                outerRadius={90}
                fill="#8884d8"
                label
              >
                {categoriesData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default HomePage

