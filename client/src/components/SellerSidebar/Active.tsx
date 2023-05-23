import React, { useCallback, useMemo, useState, useEffect } from 'react';

import MaterialReactTable, {
    type MaterialReactTableProps,
    type MRT_Cell,
    type MRT_ColumnDef,
    type MRT_Row,
  } from 'material-react-table';
import useAxiosPrivateSeller from "../../hooks/useAxiosPrivateSeller.js";

interface ProductVariations {
    productId: number;
    active: boolean;
    name: string;
    price: number;
    sku: string;
    variation1: string;
    varitation2: string;
    quantity: number;
}
  
interface Product {
    productId: number;
    active: boolean;
    showSubrows: boolean;
    name: string;
    description: string;
    categoryId: number;
    category: string;
    price: number;
    quantity: number;
    sku: string;
    subRows: Array<ProductVariations>;
}

interface ActiveProps {
    row: any;
    isChecked: boolean;
    // isCheckedMap: boolean[][];
    onToggle: any;
}

const Active: React.FC<ActiveProps> = ({ row, isChecked, onToggle }) => {
    console.log("active renders")
    console.log(row)
    row.originalSubRows ? console.log(row.originalSubRows) : ""
    // console.log(isCheckedMap)

    const axiosPrivateSeller = useAxiosPrivateSeller();

    // const { row, isChecked, onToggle } = props;
    console.log("isChecked", isChecked);

    const handleCheckboxChange = () => {
        onToggle(row);
    };
    // let { row } = props;

    // const [isChecked, setIsChecked] = useState<boolean>(row.original.active);


    return (
        <label className="relative inline-flex items-center mb-5 cursor-pointer">
            <input
            type="checkbox"
            value=""
            className="sr-only peer"
            checked={isChecked}
            // onClick={toggleActive}
            onChange={handleCheckboxChange}
            />
            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"/>
        </label>
    )
}

export default Active