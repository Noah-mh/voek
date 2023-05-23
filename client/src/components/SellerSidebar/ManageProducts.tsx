import React, { useCallback, useMemo, useState, useEffect } from 'react';
import MaterialReactTable, {
  type MaterialReactTableProps,
  type MRT_Cell,
  type MRT_ColumnDef,
  type MRT_Row,
} from 'material-react-table';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Tooltip,
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';

import SellerSidebar from "../SellerSidebar/SellerSidebar.js";
import useSeller from "../../hooks/useSeller.js";
import Active from "./Active.tsx"

import { Link } from 'react-router-dom';

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

type ProductOrProductVariations = Product | ProductVariations;

const ManageProducts = () => {

  const axiosPrivateSeller = useAxiosPrivateSeller();

  const { seller } = useSeller();
  const sellerId = seller.seller_id;

  const [tableData, setTableData] = useState<Product[]>([]);
  const [validationErrors, setValidationErrors] = useState<{
    [cellId: string]: string;
  }>({});

  // console.log tableData everytime it changes
  useEffect(() => {
    console.log("Updated tableData:", tableData);
    // tableData.forEach((item) => console.log(item));
  }, [tableData]);
  

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
          subRows: []
        };
        // console.log("hi");
        let currentProductId: number = 0;
        let sellerProducts: Product[] = [];
        let currentIdx: number = -1;
        let newIsCheckedMap: boolean[][] = [];   
        // let arr: Boolean[] = [];

        await Promise.all (response.data.map((item: any) => {
          // if current item is not a variation of the previous item, they will not have the same product_id. 
          // hence, this would be a new product, so sellerProduct would need to be reinitialised
          if (currentProductId != item.product_id) {
            currentProductId = item.product_id;
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
              quantity: 0
            }

            // check for existing product variation
            if (item.variation_1 != null || item.variation_2 != null) {
              let sellerProductVariation: ProductVariations = {
                productId: item.product_id,
                active: item.availability,
                name: `${item.variation_1} + ${item.variation_2}`,
                price: item.price,
                sku: item.sku,
                variation1: item.variation_1,
                varitation2: item.variation_2,
                quantity: item.quantity,
              }
              sellerProduct.subRows.push(sellerProductVariation);

              // tallying total quantity including all variations
              if (sellerProduct.quantity == undefined) sellerProduct.quantity = item.price;
              else sellerProduct.quantity += item.quantity

              newIsCheckedMap.push([item.active, item.availability]);
            } else {
              sellerProduct.sku = item.sku;
              sellerProduct.quantity = item.quantity
              newIsCheckedMap.push([item.active]);
            }

            // add Product to sellerProducts
            // console.log(`sellerProduct: ${Object.values(sellerProduct)}`)
            sellerProducts.push(sellerProduct);
            // console.log("sellerProducts:", sellerProducts.map(obj => JSON.stringify(obj)));

          } else { 
            // same product_id means that this is a product variation
            // add subRow to sellerProducts[currentIdx]
            let sellerProductVariation: ProductVariations = {
              productId: item.product_id,
              active: item.availability,
              name: `${item.variation_1} + ${item.variation_2}`,
              price: item.price,
              sku: item.sku,
              variation1: item.variation_1,
              varitation2: item.variation_2,
              quantity: item.quantity,
            }
            sellerProducts[currentIdx].subRows.push(sellerProductVariation);              

            if (sellerProducts[currentIdx].quantity == undefined) sellerProducts[currentIdx].quantity = item.price;
            else sellerProducts[currentIdx].quantity += item.quantity

            // finding lowest price among all variations
            if (item.price < sellerProducts[currentIdx].price) sellerProducts[currentIdx].price = item.price
          
            newIsCheckedMap[currentProductId-1].push(item.availability);
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

  // edit
  // const handleSaveRowEdits: MaterialReactTableProps<Product>['onEditingRowSave'] =
  // async ({ exitEditingMode, row, values }) => {
  //   if (!Object.keys(validationErrors).length) {
  //     const updatedData = {
  //       id: row.original.productId, 
  //       ...values,
  //     };

  //     console.log("updatedData", updatedData)

  //     try {
  //       // Make an API call to send the updated data to the backend
  //       await axiosPrivateSeller.put(`/editProduct/` + updatedData.id, updatedData);

  //       // If the API call is successful, update the local table data and exit editing mode
  //       tableData[row.index] = values;
  //       console.log(tableData[row.index])

  //       setTableData([...tableData]);
  //       exitEditingMode(); // Required to exit editing mode and close the modal
  //     } catch (error) {
  //       // Handle any error that occurred during the API call
  //       console.error('Error updating data:', error);
  //     }
  //   }
  // };

  // const handleCancelRowEdits = () => {
  //   setValidationErrors({});
  // };

  // const getCommonEditTextFieldProps = useCallback(
  //   (
  //     cell: MRT_Cell<Product>,
  //   ): MRT_ColumnDef<Product>['muiTableBodyCellEditTextFieldProps'] => {
  //     return {
  //       error: !!validationErrors[cell.id],
  //       helperText: validationErrors[cell.id],
  //       onBlur: (event) => {
  //         const isValid =
  //           cell.column.id === 'email'
  //             ? validateEmail(event.target.value)
  //             : cell.column.id === 'age'
  //             ? validateAge(+event.target.value)
  //             : validateRequired(event.target.value);
  //         if (!isValid) {
  //           //set validation error for cell if invalid
  //           setValidationErrors({
  //             ...validationErrors,
  //             [cell.id]: `${cell.column.columnDef.header} is required`,
  //           });
  //         } else {
  //           //remove validation error for cell if valid
  //           delete validationErrors[cell.id];
  //           setValidationErrors({
  //             ...validationErrors,
  //           });
  //         }
  //       },
  //     };
  //   },
  //   [validationErrors],
  // );

  // const [isChecked, setIsChecked] = useState<boolean | undefined>(undefined);

  const [isCheckedMap, setIsCheckedMap] = useState<boolean[][]>([]);

  useEffect(() => {
    console.log("Updated isCheckedMap:", isCheckedMap);
    isCheckedMap.forEach((item) => console.log(item));
    // console.log("help", isCheckedMap["0"][0])
  }, [isCheckedMap]);


  const updateCheckedMap = () => {
    const newMap: boolean[][] = [];

    tableData.forEach((product) => {
      if (product.subRows.length == 0) {
        newMap.push([product.active]);
      } else {
        let arr: boolean[] = [product.active];
        for (var i = 0; i < product.subRows.length; i++) {
          arr.push(product.subRows[i].active);
        }
        newMap.push(arr);
      }
    });

    setIsCheckedMap(newMap);
  };

  const handleToggle = async (row: any) => {
    const productId = row.original.productId - 1;
    console.log("productId", productId)
    // let idx = 0;
    // if (row.original.sku == "" && row.originalSubRows == undefined) idx = row.index;
  
        // const toggleActive = async () => {
        // update row.original.active
        row.original.active = !row.original.active;
        console.log("row", row.original.active)

        // if sku is an empty string, product.active is being toggled
        if (row.original.sku == "") {
            await axiosPrivateSeller.put(`/updateProduct/active/${row.original.productId}`, 
            JSON.stringify({ active: row.original.active }), {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            })
            
            setIsCheckedMap((prevMap: boolean[][]) => {
              const updatedMap = [...prevMap];
              updatedMap[productId][0] = !prevMap[productId][0];
              // if subrows exist, update productVariation.active to change accordingly
              if (row.originalSubRows.length > 0) {
                for (var i = 1; i <= row.originalSubRows.length; i++) {
                  updatedMap[productId][i] = updatedMap[productId][0];
                }
              }
              console.log("updatedMap", updatedMap)
              return updatedMap;
            });

            row.originalSubRows ? row.originalSubRows.forEach((item: ProductVariations) => {
              console.log("subrow", item)
              item.active = row.original.active;
            // setIsChecked(item.active);
            }) : ""
        } else { 
            // if sku is not empty, product with no productVariation OR productVariation.active is being toggled. 
            // check if all productVariations are inactive in backend. if all are inactive, product.active will become inactive
            // hence, checking by sku will work even for products with no product variations
            console.log("row.index", row.index);

            await axiosPrivateSeller.put(`/updateProductVariation/active/${row.original.productId}`, 
            JSON.stringify({ active: row.original.active, sku: row.original.sku }), {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            })

            if (!row.getParentRow()) {
              console.log("no product variations")
              setIsCheckedMap((prevMap: boolean[][]) => {
                const updatedMap = [...prevMap];
                updatedMap[productId][0] = !prevMap[productId][0];
                return updatedMap;
              });
            } else if (row.original.active && row.getParentRow()) {
              // if productVariation becomes active but product inactive, make product active
              console.log("productVariation becomes active but product inactive")
              setIsCheckedMap((prevMap: boolean[][]) => {
                const updatedMap = [...prevMap];
                updatedMap[productId][row.index+1] = !prevMap[productId][row.index+1];
                if (!row.getParentRow().original.active) {
                  updatedMap[productId][0] = true;
                  row.getParentRow().original.active = true;
                }
                console.log("updatedMap", updatedMap)
                return updatedMap;
              });
              // console.log("help", row.getParentRow().original.active)
              // // setIsChecked(row.getParentRow().original.active);
              // console.log("help2", row.getParentRow().original.active)
            } else if (!row.original.active && row.getParentRow()) {
              // if all productVariations become inactive but product active, make product inactive 
              console.log("all productVariations become inactive but product active")
              var productVariationsAllInactive = true;
              for (var i = 0; i < row.getParentRow().originalSubRows.length; i++) {
                if (row.getParentRow().originalSubRows[i].active) {
                  productVariationsAllInactive = false;
                  break;
                }
              }
              setIsCheckedMap((prevMap: boolean[][]) => {
                const updatedMap = [...prevMap];
                updatedMap[productId][row.index+1] = !prevMap[productId][row.index+1];
                if (row.getParentRow().original.active && productVariationsAllInactive) {
                  updatedMap[productId][0] = false;
                  row.getParentRow().original.active = false;
                }
                console.log("updatedMap", updatedMap)
                return updatedMap;
              });
              // if (productVariationsAllInactive) {
              // // console.log("help", row.getParentRow().original.active)
              // // row.getParentRow().original.active = false;
              // // // setIsChecked(row.getParentRow().original.active);
              // // console.log("help2", row.getParentRow().original.active)
              // }
            }
        }
        // setIsChecked(!row.original.active);
            // setIsCheckedMap((prevMap: boolean[][]) => {
    //   const updatedMap = [...prevMap];
    //   // if (!updatedMap[productId]) {
    //   //   updatedMap[productId] = [];
    //   // }
    //   updatedMap[productId][idx] = !prevMap[productId][idx];
    //   console.log("updatedMap", updatedMap)
    //   return updatedMap;
    // });

    console.log("isCheckedMap", isCheckedMap);
  }

  

  const columns = useMemo<MRT_ColumnDef<Product>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Name',
        enableClickToCopy: true,
        size: 140,
        // muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
        //   ...getCommonEditTextFieldProps(cell),
        // }),
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
        // enableEditing: true,
        size: 80,
        // muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
        //   ...getCommonEditTextFieldProps(cell),
        //   type: 'number',
        // }),
      },
      {
        accessorKey: 'quantity',
        header: 'Stock',
        // enableEditing: true,
        size: 80,
        // muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
        //   ...getCommonEditTextFieldProps(cell),
        //   type: 'number',
        // }),
      },
      {
        accessorKey: 'sku',
        header: 'SKU',
        enableClickToCopy: true,
        // enableEditing: false, //disable editing on this column
        size: 140,
        // muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
        //   ...getCommonEditTextFieldProps(cell),
        // }),
      },
      {
        accessorKey: 'active',
        header: 'Active',
        size: 80,
        Cell: ({row}) => (
          <Active 
            // row = {row}  
            key={row.id}
            row={row}
            // isChecked={row.original.active}
            // isCheckedMap={isCheckedMap}

            isChecked={isCheckedMap?.[row.original.productId]?.[row.index] ? isCheckedMap[row.original.productId-1][row.index] : row.original.active}
            onToggle={handleToggle}
          />
        )
      },
      {
        accessorKey: 'productId',
        header: 'Edit',
        size: 80,
        Cell: ({ row }: { row: MRT_Row<Product> }) => (
          <Link 
            to="/seller/editProduct/" 
            state={{ Product: row.original }} 
          >
            Edit
          </Link>
        ),
      },
    ],
    []
  );

  return (
    <div className="flex flex-row">
        <SellerSidebar />

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
        // editingMode="row" 
        // enableEditing
        // onEditingRowSave={handleSaveRowEdits}
        // onEditingRowCancel={handleCancelRowEdits}
        // renderRowActions={({ row, table }) => (
        //   <Box sx={{ display: 'flex', gap: '1rem' }}>
        //     <Tooltip arrow placement="left" title="Edit">
        //       <IconButton onClick={() => table.setEditingRow(row)}>
        //         <Edit />
        //       </IconButton>
        //     </Tooltip>
        //     <Tooltip arrow placement="right" title="Delete">
        //       <IconButton color="error" onClick={() => handleDeleteRow(row)}>
        //         <Delete />
        //       </IconButton>
        //     </Tooltip>
        //   </Box>
        // )}
        // renderTopToolbarCustomActions={() => (
        //   <Button
        //     color="secondary"
        //     onClick={() => setCreateModalOpen(true)}
        //     variant="contained"
        //   >
        //     Create New Account
        //   </Button>
        // )}
      />
    </div>
  );
}

export default ManageProducts

interface CreateModalProps {
  columns: MRT_ColumnDef<Product>[];
  onClose: () => void;
  onSubmit: (values: Product) => void;
  open: boolean;
}

//example of creating a mui dialog modal for creating new rows
export const CreateNewAccountModal = ({
  open,
  columns,
  onClose,
  onSubmit,
}: CreateModalProps) => {
  const [values, setValues] = useState<any>(() =>
    columns.reduce((acc, column) => {
      acc[column.accessorKey ?? ''] = '';
      return acc;
    }, {} as any),
  );

  const handleSubmit = () => {
    //put your validation logic here
    onSubmit(values);
    onClose();
  };

  return (
    <Dialog open={open}>
      <DialogTitle textAlign="center">Create New Account</DialogTitle>
      <DialogContent>
        <form onSubmit={(e) => e.preventDefault()}>
          <Stack
            sx={{
              width: '100%',
              minWidth: { xs: '300px', sm: '360px', md: '400px' },
              gap: '1.5rem',
            }}
          >
            {columns.map((column) => (
              <TextField
                key={column.accessorKey}
                label={column.header}
                name={column.accessorKey}
                onChange={(e) =>
                  setValues({ ...values, [e.target.name]: e.target.value })
                }
              />
            ))}
          </Stack>
        </form>
      </DialogContent>
      <DialogActions sx={{ p: '1.25rem' }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button color="secondary" onClick={handleSubmit} variant="contained">
          Create New Account
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const validateRequired = (value: string) => !!value.length;
const validateEmail = (email: string) =>
  !!email.length &&
  email
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    );
const validateAge = (age: number) => age >= 18 && age <= 50;