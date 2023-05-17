import { useState, useEffect } from 'react'
import SellerSidebar from "../SellerSidebar/SellerSidebar.js";

import useAxiosPrivateSeller from "../../hooks/useAxiosPrivateSeller.js";

interface Product {
  product_id: number;
  name: string;
  description: string;
  category: number;
  price: number;
}

const ManageProducts = () => {

  const axiosPrivateSeller = useAxiosPrivateSeller();

  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    const getAllProducts = async() => {
      return axiosPrivateSeller
        .get('/api/data') // Replace '/api/data' with the actual API endpoint URL
        .then((response) => {
          setTableData(response.data);
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
        });
    };
    getAllProducts();
  }, []);

  return (
    <div className="flex flex-row">
        <SellerSidebar />
        <div>ManageProducts</div>

        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((item: Product) => (
              <tr key={item.product_id}>
                <td>{item.name}</td>
                <td>{item.description}</td>
                <td>{item.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
    </div>
  )
}

export default ManageProducts