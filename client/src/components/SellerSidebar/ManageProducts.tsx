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

import { Link } from 'react-router-dom';

import useAxiosPrivateSeller from "../../hooks/useAxiosPrivateSeller.js";


interface ProductVariations {
  name: string;
  active: boolean;
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
    tableData.forEach((item) => console.log(item));
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
                name: `${item.variation_1} + ${item.variation_2}`,
                active: item.availability,
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
            } else {
              sellerProduct.sku = item.sku;
              sellerProduct.quantity = item.quantity
            }

            // add Product to sellerProducts
            // console.log(`sellerProduct: ${Object.values(sellerProduct)}`)
            sellerProducts.push(sellerProduct);
            // console.log("sellerProducts:", sellerProducts.map(obj => JSON.stringify(obj)));

          } else { 
            // same product_id means that this is a product variation
            // add subRow to sellerProducts[currentIdx]
            let sellerProductVariation: ProductVariations = {
              name: `${item.variation_1} + ${item.variation_2}`,
              active: item.availability,
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
          }

        }))

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
        // enableEditing: false, //disable editing on this column
        size: 140,
        // muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
        //   ...getCommonEditTextFieldProps(cell),
        // }),
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
  )

  // const toggleSubrows = (itemId: number) => {
  //   setTableData((prevTableData: Product[]) =>
  //     prevTableData.map((item: Product) =>
  //       item.product_id === itemId ? { ...item, showSubrows: !item.showSubrows } : item
  //     )
  //   );
  // }; 

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
      {/* <CreateNewAccountModal
        columns={columns}
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleCreateNewRow}
      /> */}

        {/* <MaterialReactTable
          columns={columns}
          data={data}
          enableExpanding
          getSubRows={(originalRow) => originalRow.subRows} //default, can customize
        /> */}

        {/* material react table */}
        {/* <Table className="flex flex-column">
          <TableHead>
            <TableRow>
              <TableCell>Product Info</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Active</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData.map((item) => (
              <React.Fragment key={item.product_id}>
                <TableRow>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.price}</TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell>
                    <button onClick={() => toggleSubrows(item.product_id)}>
                      {item.showSubrows ? '-' : '+'}
                    </button>
                  </TableCell>
                </TableRow>
                {item.showSubrows && (
                  <TableRow>
                    <TableCell colSpan={3}> */}
                      {/* Render subrows content here */}
                      {/* Subrow 1
                      <br />
                      Subrow 2
                      <br />
                      Subrow 3
                      <br />
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))}
          </TableBody>
        </Table> */}

        {/* <table className="border">
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
        </table> */}
    </div>
  )
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