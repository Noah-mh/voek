import React, { useState, useEffect } from 'react'
import SellerSidebar from "../SellerSidebar/SellerSidebar.js";
import useSeller from "../../hooks/useSeller.js";

import useAxiosPrivateSeller from "../../hooks/useAxiosPrivateSeller.js";

interface Category {
  category_id: number;
  name: string;
}

const CreateProduct = () => {

  const axiosPrivateSeller = useAxiosPrivateSeller();

  const { seller } = useSeller();
  const sellerId = seller.seller_id;

  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const getAllCategories = async () => {
      try {
        const response = await axiosPrivateSeller.get(`/categories`);
        setCategories(response.data);
      } catch (error: any) {
        console.error('Error fetching data:', error);
      }
    }

    getAllCategories();
  }, []);

  const createProduct = async () => {

  }

  return (
    <div className="flex flex-row">
      <SellerSidebar />
      <p>CreateProduct</p>
      {/* add product */}
      <form>
        <label>
          Name:
          <input className="text-black" type="text" name="name" />
        </label>
        <br />
        <label>
          Description:
          <br />
          <textarea className="text-black" name="description" />
        </label>
        <br />
        <label>
          <select>
          {categories.map(item => (
            <option key={item.category_id} value={item.category_id}>{item.name}</option>
          ))}
          </select>
        </label>
        <br />
        <label>
          Price:
          <input className="text-black" type="number" step=".01" name="price" />
        </label>
        <br />
        <button className="text-black" type="submit" name="submit" value="Submit"
          onClick={createProduct}
        />
        <button className="text-black" type="reset" name="reset" value="Reset" />
      </form>
    </div>
  )
}

export default CreateProduct