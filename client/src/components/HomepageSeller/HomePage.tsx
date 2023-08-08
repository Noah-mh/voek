import { useEffect, useState } from 'react'
import useAxiosPrivateSeller from '../../hooks/useAxiosPrivateSeller'
import useSeller from '../../hooks/useSeller'
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, } from 'recharts';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';

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

  const [categoriesFilter, setCategoriesFilter] = useState<string>("all");
  const [categoriesData, setCategoriesData] = useState<CategoriesData[]>([]);
  const [bestProductsFilter, setBestProductsFilter] = useState<string>("all");
  const [bestProductsData, setBestProductsData] = useState<BestProductsData[]>([]);

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
    getSoldCategories(categoriesFilter);
  }, [categoriesFilter])

  useEffect(() => {
    getBestProducts(bestProductsFilter);
  }, [bestProductsFilter])

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF5733', '#FFB700', '#FFC733', '#FFD966'];

  return (
<div>
  <div>
    <h1 className="text-2xl font-bold mb-4">Sales made based on categories</h1>
    <TextField
      select
      label="Period"
      required
      value={categoriesFilter}
      onChange={(e) => {
        setCategoriesFilter(e.target.value);
      }}
      fullWidth
      sx={{ m: 2 }}
    >
      <MenuItem value="all">All Time</MenuItem>
      <MenuItem value="month">Month</MenuItem>
      <MenuItem value="week">Week</MenuItem>
    </TextField>
    <PieChart width={400} height={300}>
      <Pie
        dataKey="value"
        data={categoriesData}
        cx="200"
        cy="100"
        labelLine={false}
        outerRadius={80}
        fill="#8884d8"
        label
      >
        {categoriesData.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  </div>
  <div>
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
      sx={{ m: 2 }}
    >
      <MenuItem value="all">All Time</MenuItem>
      <MenuItem value="month">Month</MenuItem>
      <MenuItem value="week">Week</MenuItem>
    </TextField>
    <BarChart
      width={700}
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
  </div>
</div>
  );
};

export default HomePage

// interface BestSellers {
//   productId: number;
//   name: string;
//   category: string;
//   totalQuantity: number;
// }

// const sellerId = seller.seller_id;

// const [bestSellersData, setBestSellersData] = useState<BestSellers[]>([]);

// useEffect(() => {
//   const getBestSellers = async () => {
//     try {
//       const response = await axiosPrivateSeller.get(`/bestSellers/${sellerId}`);
//       setBestSellersData(response.data);
//     } catch (err: any) {
//       console.log(err);
//     }
//   };
  
//   getBestSellers();
// }, [])

// const columns = useMemo<MRT_ColumnDef<BestSellers>[]>(
//   () => [
//     {
//       accessorKey: 'name',
//       header: 'Name',
//       enableClickToCopy: true,
//       size: 140,
//     },
//     {
//       accessorKey: 'category',
//       header: 'Category',
//       enableClickToCopy: true,
//       size: 80,
//     },
//     {
//       accessorKey: 'totalQuantity',
//       header: 'Sold',
//       enableClickToCopy: true,
//       size: 80,
//     },
//   ],
//   []
// );

// <div className="flex flex-col items-center">
//         <div className="text-9xl m-4 mb-2 font-extrabold">VOEK</div>
//         <div className="text-4xl m-4 mt-0 mb-5 pb-5 font-semibold">Seller Centre</div>
//       </div>

//       <h1 className="text-xl font-medium mb-2">Best Sellers</h1>

//       <MaterialReactTable 
//         displayColumnDefOptions={{
//           'mrt-row-actions': {
//             muiTableHeadCellProps: {
//               align: 'center',
//             },
//             size: 120,
//           },
//         }}
//         columns={columns}
//         data={bestSellersData}
//         enableColumnOrdering
//         enablePagination={false}
//       />