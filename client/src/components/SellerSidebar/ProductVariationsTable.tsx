import React, { useMemo, useState, useEffect } from 'react';
import MaterialReactTable, {
  type MRT_ColumnDef,
  type MRT_Row,
} from 'material-react-table';

interface ProductVariations {
    name: string;
    var1: string;
    var2: string;
    price: number;
    quantity: number;
    sku?: string;
}

interface SubmitVariationsInterface {
    var1: string; 
    var2: string;
    price: number;
    quantity: number;
}

interface ProductVariationsTableProps {
    var1Arr: string[];
    var2Arr: string[];
    onSubmit: (data: SubmitVariationsInterface[]) => void;
}

const ProductVariationsTable: React.FC<ProductVariationsTableProps> = ({ var1Arr, var2Arr, onSubmit }) => {

    console.log("var1Arr", var1Arr)
    console.log("var2Arr", var2Arr)

    const [tableData, setTableData] = useState<ProductVariations[]>([]);

    useEffect(() => {
        console.log("Updated tableData:", tableData);
        // tableData.forEach((item) => console.log(item));
      }, [tableData]);

    useEffect(() => {
        let newData: ProductVariations[] = [];

        var1Arr.forEach((var1) => {
            var2Arr.forEach((var2) => {
                let newVar: ProductVariations = {
                    name: `${var1} + ${var2}`,
                    var1: var1,
                    var2: var2,
                    price: 0,
                    quantity: 0
                }
                newData.push(newVar);
            })
        })

        setTableData(newData);
    }, [var1Arr, var2Arr]);


    const [price, setPrice] = useState<number>(0);
    const [quantity, setQuantity] = useState<number>(0);

    const handlePriceChange = (event: any) => {
        setPrice(event.target.value);
    };
    
    const handleQuantityChange = (event: any) => {
        setQuantity(event.target.value);
    };

    const handleApplyToAll = (event: any) => {
        event.preventDefault();
        console.log(price)
        console.log(quantity)

        const updatedData = tableData.map((variation) => ({
            ...variation,
            price: price >= 0 ? price : variation.price,
            quantity: quantity >= 0 ? quantity : variation.quantity,
        }));
    
        setTableData(updatedData);
    }

    const handleVariationsSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        let toSubmit: SubmitVariationsInterface[] = [];
        tableData.forEach((variation) => {
            toSubmit.push({
                var1: variation.var1,
                var2: variation.var2,
                price: variation.price,
                quantity: variation.quantity,
            })
        })
        onSubmit(toSubmit);
    };

    const columns = useMemo<MRT_ColumnDef<ProductVariations>[]>(
        () => [
          {
            accessorKey: 'name',
            header: 'Name',
            enableClickToCopy: true,
            enableEditing: false,
            size: 140,
          },
          {
            accessorKey: 'price',
            header: 'Price',
            enableClickToCopy: true,
            size: 80,
          },
          {
            accessorKey: 'quantity',
            header: 'Stock',
            enableClickToCopy: true,
            size: 80,
          },
        ],
        []
    );
    

  return (
    <form onSubmit={handleVariationsSubmit}>
        <div>ProductVariationsTable</div>

        <MaterialReactTable
            key={tableData.map((item) => item.name + item.price + item.quantity).join("-")}
            displayColumnDefOptions={{
            'mrt-row-actions': {
                muiTableHeadCellProps: {
                align: 'center',
                },
                size: 120,
            },
            }}
            columns={columns}
            data={tableData}
            enableColumnOrdering
            enableEditing
            editingMode='table'
            renderTopToolbarCustomActions={() => (
                <form>
                    <input 
                        className="text-black placeholder-gray-800 border-gray-300 rounded-md shadow-sm" 
                        type="number" 
                        // step=".01"
                        name="price" 
                        value={price}
                        placeholder="Price"
                        onChange={(e) => handlePriceChange(e)}
                    />
                    <input 
                        className="text-black placeholder-gray-800 border-gray-300 rounded-md shadow-sm" 
                        type="number" 
                        name="quantity" 
                        value={quantity}
                        placeholder="Stock"
                        onChange={(e) => handleQuantityChange(e)}
                    />
                    <button
                    type="submit"
                    name="applyToAll"
                    onClick={(e) => handleApplyToAll(e)}
                    >
                    Apply To All
                    </button>
                </form>
            )}
        />
    </form>
  )
}

export default ProductVariationsTable