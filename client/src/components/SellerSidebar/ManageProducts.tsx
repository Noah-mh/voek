import { useMemo, useState, useEffect } from 'react';
import MaterialReactTable, {
  type MRT_ColumnDef,
  type MRT_Row,
} from 'material-react-table';

import useSeller from "../../hooks/useSeller.js";
import Active from "./Active.tsx"

import { Link } from 'react-router-dom';

import useAxiosPrivateSeller from "../../hooks/useAxiosPrivateSeller.js";

interface Product {
  productId: number;
  active: boolean;
  name: string;
  price: number;
  quantity: number;
  sku: string;
  subRows: Array<Product>;
  imageUrl: string[]

  // optional properties
  // product only
  showSubrows?: boolean;
  description?: string;
  categoryId?: number;
  category?: string;

  // product variations only
  variation1?: string;
  variation2?: string;
}

const ManageProducts = () => {

  const axiosPrivateSeller = useAxiosPrivateSeller();

  const { seller } = useSeller();
  const sellerId = seller.seller_id;

  const [tableData, setTableData] = useState<Product[]>([]);

  useEffect(() => {
    console.log("Updated tableData:", tableData);
    // tableData.forEach((item) => console.log(item));
  }, [tableData]);
  
  // populate tableData and isCheckedMap
  useEffect(() => {
    const getAllProducts = async() => {
      try {
        const response = await axiosPrivateSeller.get(`/products/${sellerId}`);
        let sellerProduct: Product = {
          productId: 0,
          active: false,
          showSubrows: false,
          name: "",
          description: "",
          categoryId: 0,
          category: "",
          price: 0,
          quantity: 0,
          sku: "",
          subRows: [],
          imageUrl: [],
        };
        let currentProductId: number = 0;
        let currentProductSku: string = "";
        let sellerProducts: Product[] = [];
        let currentIdx: number = -1;
        let newIsCheckedMap: boolean[][] = [];   

        await Promise.all (response.data.map((item: any) => {
          // console.log("item image_url", item.image_url)
          // if current item is not a variation of the previous item, they will not have the same product_id. 
          // hence, this would be a new product, so sellerProduct would need to be reinitialised
          if (currentProductId != item.product_id) {
            currentProductId = item.product_id;
            currentProductSku = item.sku;
            // console.log(currentProductId)

            currentIdx++;

            sellerProduct = {
              productId: item.product_id,
              active: item.active,
              showSubrows: false,
              name: item.name,
              description: item.description,
              categoryId: item.category_id,
              category: item.category,
              price: item.price,
              subRows: [],
              sku: "",
              quantity: 0,
              imageUrl: [],
            }

            // check for existing product variation
            if (item.variation_1 != null || item.variation_2 != null) {
              let sellerProductVariation: Product = {
                productId: item.product_id,
                active: item.availability,
                name: item.variation_2 ? `${item.variation_1} + ${item.variation_2}` : item.variation_1,
                price: item.price,
                sku: item.sku,
                variation1: item.variation_1,
                variation2: item.variation_2,
                quantity: item.quantity,
                imageUrl: [item.image_url],
                subRows: [],
              }
              sellerProduct.subRows.push(sellerProductVariation);

              // tallying total quantity including all variations
              if (sellerProduct.quantity == undefined) sellerProduct.quantity = item.price;
              else sellerProduct.quantity += item.quantity

              newIsCheckedMap.push([item.active, item.availability]);
            } else {
              sellerProduct.sku = item.sku;
              sellerProduct.quantity = item.quantity;
              sellerProduct.imageUrl.push(item.image_url);
              newIsCheckedMap.push([item.active]);
            }

            // add Product to sellerProducts
            // console.log(`sellerProduct: ${Object.values(sellerProduct)}`)
            sellerProducts.push(sellerProduct);
            // console.log("sellerProducts:", sellerProducts.map(obj => JSON.stringify(obj)));

          } else if (currentProductSku != item.sku) { 
            // same product_id means that this is a product variation
            // add subRow to sellerProducts[currentIdx]
            currentProductSku = item.sku;

            let sellerProductVariation: Product = {
              productId: item.product_id,
              active: item.availability,
              name: item.variation_2 ? `${item.variation_1} + ${item.variation_2}` : item.variation_1,
              price: item.price,
              sku: item.sku,
              variation1: item.variation_1,
              variation2: item.variation_2,
              quantity: item.quantity,
              imageUrl: [item.image_url],
              subRows: [],
            }
            sellerProducts[currentIdx].subRows.push(sellerProductVariation);              

            if (sellerProducts[currentIdx].quantity == undefined) sellerProducts[currentIdx].quantity = item.price;
            else sellerProducts[currentIdx].quantity += item.quantity

            // finding lowest price among all variations
            if (item.price < sellerProducts[currentIdx].price) sellerProducts[currentIdx].price = item.price
          
            newIsCheckedMap[currentIdx-1].push(item.availability);
          } else {
            sellerProducts[currentIdx].subRows[sellerProducts[currentIdx].subRows.length-1].imageUrl.push(item.image_url);
          }

        }))

        setIsCheckedMap(newIsCheckedMap);
        setTableData(sellerProducts);

      } catch(error) {
        console.error('Error fetching data:', error);
      }
    };

    getAllProducts();

  }, []);

  const [isCheckedMap, setIsCheckedMap] = useState<boolean[][]>([]);

  useEffect(() => {
    console.log("Updated isCheckedMap:", isCheckedMap);
    isCheckedMap.forEach((item) => console.log(item));
    // console.log("help", isCheckedMap["0"][0])
  }, [isCheckedMap]);


  // const updateCheckedMap = () => {
  //   const newMap: boolean[][] = [];

  //   tableData.forEach((product) => {
  //     if (product.subRows.length == 0) {
  //       newMap.push([product.active]);
  //     } else {
  //       let arr: boolean[] = [product.active];
  //       for (var i = 0; i < product.subRows.length; i++) {
  //         arr.push(product.subRows[i].active);
  //       }
  //       newMap.push(arr);
  //     }
  //   });

  //   setIsCheckedMap(newMap);
  // };

  // update isCheckedMap
  const handleToggle = async (row: any) => {
    // update row.original.active
    row.original.active = !row.original.active;
    // console.log("row", row.original.active)

    // if sku is an empty string, product.active is being toggled
    if (row.original.sku == "") {
        await axiosPrivateSeller.put(`/updateProduct/active/${row.original.productId}`, 
        JSON.stringify({ active: row.original.active }), {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        })
        
        setIsCheckedMap((prevMap: boolean[][]) => {
          const updatedMap = [...prevMap];
          updatedMap[row.id][0] = !prevMap[row.id][0];
          // if subrows exist, update productVariation.active to change accordingly
          if (row.originalSubRows.length > 0) {
            for (var i = 1; i <= row.originalSubRows.length; i++) {
              updatedMap[row.id][i] = updatedMap[row.id][0];
            }
          }
          // console.log("updatedMap", updatedMap)
          return updatedMap;
        });

        row.originalSubRows ? row.originalSubRows.forEach((item: Product) => {
          // console.log("subrow", item)
          item.active = row.original.active;
        }) : ""
    } else { 
        // if sku is not empty, product with no productVariation OR productVariation.active is being toggled. 
        // check if all productVariations are inactive in backend. if all are inactive, product.active will become inactive
        // hence, checking by sku will work even for products with no product variations
        // console.log("row.index", row.index);

        await axiosPrivateSeller.put(`/updateProductVariation/active/${row.original.productId}`, 
        JSON.stringify({ active: row.original.active, sku: row.original.sku }), {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        })

        if (!row.getParentRow()) {
          // console.log("no product variations")
          setIsCheckedMap((prevMap: boolean[][]) => {
            const updatedMap = [...prevMap];
            updatedMap[row.id][0] = !prevMap[row.id][0];
            return updatedMap;
          });
        } else if (row.original.active && row.getParentRow()) {
          // if productVariation becomes active but product inactive, make product active
          // console.log("productVariation becomes active but product inactive")
          setIsCheckedMap((prevMap: boolean[][]) => {
            const updatedMap = [...prevMap];
            updatedMap[row.id][row.index+1] = !prevMap[row.id][row.index+1];
            if (!row.getParentRow().original.active) {
              updatedMap[row.id][0] = true;
              row.getParentRow().original.active = true;
            }
            // console.log("updatedMap", updatedMap)
            return updatedMap;
          });
        } else if (!row.original.active && row.getParentRow()) {
          // if all productVariations become inactive but product active, make product inactive 
          // console.log("all productVariations become inactive but product active")
          var productVariationsAllInactive = true;
          for (var i = 0; i < row.getParentRow().originalSubRows.length; i++) {
            if (row.getParentRow().originalSubRows[i].active) {
              productVariationsAllInactive = false;
              break;
            }
          }
          setIsCheckedMap((prevMap: boolean[][]) => {
            const updatedMap = [...prevMap];
            updatedMap[row.id][row.index+1] = !prevMap[row.id][row.index+1];
            if (row.getParentRow().original.active && productVariationsAllInactive) {
              updatedMap[row.id][0] = false;
              row.getParentRow().original.active = false;
            }
            // console.log("updatedMap", updatedMap)
            return updatedMap;
          });
        }
    }
    // console.log("isCheckedMap", isCheckedMap);
  }


  const columns = useMemo<MRT_ColumnDef<Product>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Name',
        enableClickToCopy: true,
        size: 140,
      },
      {
        accessorKey: 'description',
        header: 'Description',
        enableClickToCopy: true,
        size: 80,
      },
      {
        accessorKey: 'category',
        header: 'Category',
        enableClickToCopy: true,
        size: 80,
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
      {
        accessorKey: 'sku',
        header: 'SKU',
        enableClickToCopy: true,
        size: 140,
      },
      {
        accessorKey: 'active',
        header: 'Active',
        size: 80,
        Cell: ({row}) => (
          <Active 
            key={row.id}
            row={row}
            isChecked={row.original.active}
            onToggle={handleToggle}
          />
        )
      },
      {
        accessorKey: 'productId',
        header: 'Edit',
        size: 80,
        Cell: ({ row }: { row: MRT_Row<Product> }) => (
          <>
            {!row.getParentRow() && (
              <Link 
                to="/seller/editProduct/" 
                state={{ Product: row.original }} 
              >
                Edit
              </Link>
            )}
          </>
        ),
      },
    ],
    []
  );

  return (
    <div className="flex flex-row">

        <MaterialReactTable
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
        enableExpanding
        getSubRows={(originalRow) => originalRow.subRows}
      />
    </div>
  );
}

export default ManageProducts