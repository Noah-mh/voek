// import React, { useState, useEffect } from 'react'
import SellerSidebar from "../SellerSidebar/SellerSidebar.js";
import useSeller from "../../hooks/useSeller.js";

import useAxiosPrivateSeller from "../../hooks/useAxiosPrivateSeller.js";

// import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
// import MaterialReactTable from 'material-react-table';
// import type { MRT_ColumnDef } from 'material-react-table'; // If using TypeScript (optional, but recommended)

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

export type Person = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  age: number;
  state: string;
};

interface ProductVariations {
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

  const data: Person[] = [
    {
      id: '9s41rp',
      firstName: 'Kelvin',
      lastName: 'Langosh',
      email: 'Jerod14@hotmail.com',
      age: 19,
      state: 'Ohio',
    },
    {
      id: '08m6rx',
      firstName: 'Molly',
      lastName: 'Purdy',
      email: 'Hugh.Dach79@hotmail.com',
      age: 37,
      state: 'Rhode Island',
    },
    {
      id: '5ymtrc',
      firstName: 'Henry',
      lastName: 'Lynch',
      email: 'Camden.Macejkovic@yahoo.com',
      age: 20,
      state: 'California',
    },
    {
      id: 'ek5b97',
      firstName: 'Glenda',
      lastName: 'Douglas',
      email: 'Eric0@yahoo.com',
      age: 38,
      state: 'Montana',
    },
    {
      id: 'xxtydd',
      firstName: 'Leone',
      lastName: 'Williamson',
      email: 'Ericka_Mueller52@yahoo.com',
      age: 19,
      state: 'Colorado',
    },
    {
      id: 'wzxj9m',
      firstName: 'Mckenna',
      lastName: 'Friesen',
      email: 'Veda_Feeney@yahoo.com',
      age: 34,
      state: 'New York',
    },
    {
      id: '21dwtz',
      firstName: 'Wyman',
      lastName: 'Jast',
      email: 'Melvin.Pacocha@yahoo.com',
      age: 23,
      state: 'Montana',
    },
    {
      id: 'o8oe4k',
      firstName: 'Janick',
      lastName: 'Willms',
      email: 'Delfina12@gmail.com',
      age: 25,
      state: 'Nebraska',
    },
  ];

  const states: Array<String> = [
    'Alabama',
    'Alaska',
    'Arizona',
    'Arkansas',
    'California',
    'Colorado',
    'Connecticut',
    'Delaware',
    'Florida',
    'Georgia',
    'Hawaii',
    'Idaho',
    'Illinois',
    'Indiana',
    'Iowa',
    'Kansas',
    'Kentucky',
    'Louisiana',
    'Maine',
    'Maryland',
    'Massachusetts',
    'Michigan',
    'Minnesota',
    'Mississippi',
    'Missouri',
    'Montana',
    'Nebraska',
    'Nevada',
    'New Hampshire',
    'New Jersey',
    'New Mexico',
    'New York',
    'North Carolina',
    'North Dakota',
    'Ohio',
    'Oklahoma',
    'Oregon',
    'Pennsylvania',
    'Rhode Island',
    'South Carolina',
    'South Dakota',
    'Tennessee',
    'Texas',
    'Utah',
    'Vermont',
    'Virginia',
    'Washington',
    'West Virginia',
    'Wisconsin',
    'Wyoming',
    'Puerto Rico',
  ];

  const axiosPrivateSeller = useAxiosPrivateSeller();

  const { seller } = useSeller();
  const sellerId = seller.seller_id;

  const [tableData1, setTableData1] = useState<Product[]>([]);

  useEffect(() => {
    console.log("Updated tableData1:", tableData1);
    tableData1.forEach((item) => console.log(item));
  }, [tableData1]);
  

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
        console.log("hi");
        let currentProductId: number = 0;
        let sellerProducts: Product[] = [];
        let currentIdx: number = -1;
        await Promise.all (response.data.map((item: any) => {
          // if current item is not a variation of the previous item, they will not have the same product_id. 
          // hence, this would be a new product, so sellerProduct would need to be reinitialised
          if (currentProductId != item.product_id) {
            currentProductId = item.product_id;
            console.log(currentProductId)

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
            console.log(`sellerProduct: ${Object.values(sellerProduct)}`)
            sellerProducts.push(sellerProduct);
            console.log("sellerProducts:", sellerProducts.map(obj => JSON.stringify(obj)));

          } else { 
            // same product_id means that this is a product variation
            // add subRow to sellerProducts[currentIdx]
            let sellerProductVariation: ProductVariations = {
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

        setTableData1(sellerProducts);

      } catch(error) {
        console.error('Error fetching data:', error);
      }
    };

    getAllProducts();

  }, []);

  // const toggleSubrows = (itemId: number) => {
  //   setTableData((prevTableData: Product[]) =>
  //     prevTableData.map((item: Product) =>
  //       item.product_id === itemId ? { ...item, showSubrows: !item.showSubrows } : item
  //     )
  //   );
  // };

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [tableData, setTableData] = useState<Person[]>(() => data);
  const [validationErrors, setValidationErrors] = useState<{
    [cellId: string]: string;
  }>({});

  const handleCreateNewRow = (values: Person) => {
    tableData.push(values);
    setTableData([...tableData]);
  };

  const handleSaveRowEdits: MaterialReactTableProps<Person>['onEditingRowSave'] =
    async ({ exitEditingMode, row, values }) => {
      if (!Object.keys(validationErrors).length) {
        tableData[row.index] = values;
        //send/receive api updates here, then refetch or update local table data for re-render
        setTableData([...tableData]);
        exitEditingMode(); //required to exit editing mode and close modal
      }
    };

  const handleCancelRowEdits = () => {
    setValidationErrors({});
  };

  const handleDeleteRow = useCallback(
    (row: MRT_Row<Person>) => {
      if (
        !confirm(`Are you sure you want to delete ${row.getValue('firstName')}`)
      ) {
        return;
      }
      //send api delete request here, then refetch or update local table data for re-render
      tableData.splice(row.index, 1);
      setTableData([...tableData]);
    },
    [tableData],
  );

  const getCommonEditTextFieldProps = useCallback(
    (
      cell: MRT_Cell<Person>,
    ): MRT_ColumnDef<Person>['muiTableBodyCellEditTextFieldProps'] => {
      return {
        error: !!validationErrors[cell.id],
        helperText: validationErrors[cell.id],
        onBlur: (event) => {
          const isValid =
            cell.column.id === 'email'
              ? validateEmail(event.target.value)
              : cell.column.id === 'age'
              ? validateAge(+event.target.value)
              : validateRequired(event.target.value);
          if (!isValid) {
            //set validation error for cell if invalid
            setValidationErrors({
              ...validationErrors,
              [cell.id]: `${cell.column.columnDef.header} is required`,
            });
          } else {
            //remove validation error for cell if valid
            delete validationErrors[cell.id];
            setValidationErrors({
              ...validationErrors,
            });
          }
        },
      };
    },
    [validationErrors],
  );

  const columns = useMemo<MRT_ColumnDef<Person>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
        enableColumnOrdering: false,
        enableEditing: false, //disable editing on this column
        enableSorting: false,
        size: 80,
      },
      {
        accessorKey: 'firstName',
        header: 'First Name',
        size: 140,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
      {
        accessorKey: 'lastName',
        header: 'Last Name',
        size: 140,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
      {
        accessorKey: 'email',
        header: 'Email',
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
          type: 'email',
        }),
      },
      {
        accessorKey: 'age',
        header: 'Age',
        size: 80,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
          type: 'number',
        }),
      },
      // {
      //   accessorKey: 'state',
      //   header: 'State',
      //   muiTableBodyCellEditTextFieldProps: {
      //     select: true, //change to select for a dropdown
      //     children: states.map((state) => (
      //       <MenuItem key={state} value={state}>
      //         {state}
      //       </MenuItem>
      //     )),
      //   },
      // },
    ],
    [getCommonEditTextFieldProps],
  );


  

  return (
    <div className="flex flex-row">
        <SellerSidebar />
        <div className="flex flex-column">ManageProducts</div>

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
        editingMode="modal" //default
        enableColumnOrdering
        enableEditing
        onEditingRowSave={handleSaveRowEdits}
        onEditingRowCancel={handleCancelRowEdits}
        renderRowActions={({ row, table }) => (
          <Box sx={{ display: 'flex', gap: '1rem' }}>
            <Tooltip arrow placement="left" title="Edit">
              <IconButton onClick={() => table.setEditingRow(row)}>
                <Edit />
              </IconButton>
            </Tooltip>
            <Tooltip arrow placement="right" title="Delete">
              <IconButton color="error" onClick={() => handleDeleteRow(row)}>
                <Delete />
              </IconButton>
            </Tooltip>
          </Box>
        )}
        renderTopToolbarCustomActions={() => (
          <Button
            color="secondary"
            onClick={() => setCreateModalOpen(true)}
            variant="contained"
          >
            Create New Account
          </Button>
        )}
      />
      <CreateNewAccountModal
        columns={columns}
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleCreateNewRow}
      />

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
  columns: MRT_ColumnDef<Person>[];
  onClose: () => void;
  onSubmit: (values: Person) => void;
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