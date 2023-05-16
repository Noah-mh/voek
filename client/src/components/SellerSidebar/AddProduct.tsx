import React from 'react'
import SellerSidebar from "../SellerSidebar/SellerSidebar.js";

import axios from "../../api/axios.js";

import useAxiosPrivateSeller from "../../hooks/useAxiosPrivateSeller.js";

type Props = {}

const CreateProduct = (props: Props) => {

  const axiosPrivateSeller = useAxiosPrivateSeller();

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
            <option value="1">Books</option>
            <option value="2">Tech</option>
            <option value="3">Shoes</option>
            <option value="4">Accessories</option>
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