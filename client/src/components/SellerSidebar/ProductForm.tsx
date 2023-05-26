// import { useState, useEffect } from 'react'
// import useSeller from "../../hooks/useSeller.js";
// import ProductVariationsTable from './ProductVariationsTable.js';

import React, { useMemo, useState, useEffect } from 'react';
import MaterialReactTable, {
  MRT_Cell,
  type MRT_ColumnDef,
  type MRT_Row,
} from 'material-react-table';

import useAxiosPrivateSeller from "../../hooks/useAxiosPrivateSeller.js";
import { TableCell, TableRow, Tooltip } from '@mui/material';

interface Category {
  category_id: number;
  name: string;
}

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
  sku?: string;
}

interface SubmitInterface {
  name: string;
  description: string;
  price: number;
  quantity: number;
  categoryId: number;
  category: string;
  variations: Array<SubmitVariationsInterface>;

  // optional properties
  // edit product only
  productId?: number;
  sku?: string;
}

interface Product {
  productId: number;
  active: boolean;
  name: string;
  price: number;
  quantity: number;
  sku: string;
  subRows: Array<Product>;

  // optional properties
  // product only
  showSubrows?: boolean;
  description?: string;
  categoryId?: number;
  category?: string;

  // product variations only
  variation1?: string;
  varitation2?: string;
}

interface ProductFormProps {
  product?: Product;
  onSubmit: (data: SubmitInterface) => void;
}

// const validateRequired = (value: string) => !!value.length;
// const validateEmail = (email: string) =>
//   !!email.length &&
//   email
//     .toLowerCase()
//     .match(
//       /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
//     );
// const validateAge = (age: number) => age >= 18 && age <= 50;

const ProductForm: React.FC<ProductFormProps> = ({ product, onSubmit }) => {

  const axiosPrivateSeller = useAxiosPrivateSeller();

  // const { seller } = useSeller();
  // const sellerId = seller.seller_id;

  // const [showVariations, setShowVariations] = useState(false);

  // const handleToggleVariations = () => {
  //   setShowVariations(!showVariations);
  // };

  const maximumVariations = 2; // Maximum number of variations allowed
  const [variations, setVariations] = useState([{ name: '', values: [''] }]);

  const [var1Arr, setVar1Arr] = useState<string[]>([]);
  const [var2Arr, setVar2Arr] = useState<string[]>([]);

  const capitaliseFirstLetter = (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  useEffect(() => {
    let arr1: string[] = [];
    let arr2: string[] = [];

    variations[0] ? variations[0].values.forEach((value) => 
      variations[0].name && value 
        ? arr1.push(`${capitaliseFirstLetter(variations[0].name)}: ${capitaliseFirstLetter(value)}`) 
        : ""
    ): "" ;
    variations[1] ? variations[1].values.forEach((value) => 
      variations[1].name && value 
      ? arr2.push(`${capitaliseFirstLetter(variations[1].name)}: ${capitaliseFirstLetter(value)}`)
      : ""
    ): "" ;

    setVar1Arr(arr1);
    setVar2Arr(arr2);
  }, [variations])

  const [showAddVariation, setShowAddVariation] = useState(true);

  const handleVariationNameChange = (index: number, name: string) => {
    const updatedVariations = [...variations];
    updatedVariations[index].name = name;
    setVariations(updatedVariations);
  };

  const handleVariationValueChange = (variationIndex: number, valueIndex: number, value: string) => {
    const updatedVariations = [...variations];
    updatedVariations[variationIndex].values[valueIndex] = value;
    setVariations(updatedVariations);
  };

  const handleAddVariationValue = (variationIndex: number) => {
    const updatedVariations = [...variations];
    updatedVariations[variationIndex].values.push('');
    setVariations(updatedVariations);
  };

  const handleRemoveVariationValue = (variationIndex: number, valueIndex: number) => {
    const updatedVariations = [...variations];
    updatedVariations[variationIndex].values.splice(valueIndex, 1);
    setVariations(updatedVariations);
  };

  const handleAddVariation = () => {
    if (variations.length < maximumVariations) {
      const updatedVariations = [...variations];
      updatedVariations.push({ name: '', values: [''] });
      setVariations(updatedVariations);
    }

    if (variations.length === maximumVariations - 1) {
      setShowAddVariation(false);
    }
  };

  const handleRemoveVariation = (variationIndex: number) => {
    const updatedVariations = [...variations];
    updatedVariations.splice(variationIndex, 1);
    setVariations(updatedVariations);

    if (variations.length === maximumVariations) {
      setShowAddVariation(true);
    }
  };

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

  const [productVariations, setProductVariations] = useState<ProductVariations[]>([]);

  // useEffect(() => {
  //   console.log("Updated productVariations:", productVariations);
  //   // productVariations.forEach((item) => console.log(item));
  // }, [productVariations]);

  useEffect(() => {
    let updatedProductVariations: ProductVariations[] = [];

    if (var2Arr.length > 0) {
      var1Arr.forEach((var1) => {
          var2Arr.forEach((var2) => {
              let newVar: ProductVariations = {
                  name: `${var1} + ${var2}`,
                  var1: var1,
                  var2: var2,
                  price: 0,
                  quantity: 0
              }
              updatedProductVariations.push(newVar);
          })
      })
    } else {
      var1Arr.forEach((var1) => {
        let newVar: ProductVariations = {
          name: `${var1}`,
          var1: var1,
          var2: "",
          price: 0,
          quantity: 0
        }
        updatedProductVariations.push(newVar);
      })
    }

    setProductVariations(updatedProductVariations);
  }, [var1Arr, var2Arr]);

  // const handleVariationsData = async (variationsData: SubmitVariationsInterface[]) => {
  //   setProductVariations(variationsData);
  // }

  const [priceForAll, setPriceForAll] = useState<number>(0);
  const [quantityForAll, setQuantityForAll] = useState<number>(0);

  const handlePriceForAllChange = (event: any) => {
      setPriceForAll(event.target.value);
  };
  
  const handleQuantityForAllChange = (event: any) => {
      setQuantityForAll(event.target.value);
  };

  const handleApplyToAll = (event: any) => {
    event.preventDefault();
    console.log(priceForAll)
    console.log(quantityForAll)

    const updatedProductVariations = productVariations.map((variation) => ({
        ...variation,
        price: priceForAll >= 0 ? priceForAll : variation.price,
        quantity: quantityForAll >= 0 ? quantityForAll : variation.quantity,
    }));

    setProductVariations(updatedProductVariations);
  }

  const [rowErrors, setRowErrors] = useState<string>("");

  const handleSaveCell = (cell: MRT_Cell<ProductVariations>, value: any) => {
    const { column, row } = cell;

    if (column.id === "price") {
      // const parsedValue = parseFloat(value);
      // console.log(isNaN(parsedValue))
      // if (isNaN(parsedValue) || parsedValue <= 0) {
      //   setRowErrors(`Invalid price for ${row.original.name}`);
      //   return;
      // }
      productVariations[row.index].price = parseFloat(value);
    } else if (column.id === "quantity") {
      // const parsedValue = parseFloat(value);
      // if (isNaN(parsedValue) || parsedValue <= 0) {
      //   setRowErrors(`Invalid quantity for ${row.original.name}`);
      //   return;
      // }
      productVariations[row.index].quantity = parseInt(value);
    }
    setProductVariations([...productVariations]); //re-render with new data

    console.log("productVariations", productVariations)
  }

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

  const [nameError, setNameError] = useState("");
  const [priceError, setPriceError] = useState("");
  const [quantityError, setQuantityError] = useState("");
  const [submitStatus, setSubmitStatus] = useState("");

  const handleProductFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setSubmitStatus("Please try again.");
    setRowErrors("");

    const form = e.target as HTMLFormElement;
    
    const name = form.elements.namedItem('name') as HTMLInputElement;

    if (name.value.trim() === "") {
      setNameError("Please input a name.");
      return;
    }

    const description = form.elements.namedItem('description') as HTMLTextAreaElement;
    const category = form.elements.namedItem('category') as HTMLSelectElement;
    const selectedCategoryOption = category.options[category.selectedIndex];
    const categoryId = parseInt(selectedCategoryOption.value);
    const categoryName = selectedCategoryOption.text;

    const price = form.elements.namedItem('priceNoVariation') as HTMLInputElement;

    if (!price.disabled && (isNaN(parseFloat(price.value)) || parseFloat(price.value) <= 0)) {
      setPriceError("Please input a valid price that is more than 0 cents.");
      return;
    } else if (priceError !== "") setPriceError("")

    const quantity = form.elements.namedItem('quantityNoVariation') as HTMLInputElement;

    if (!quantity.disabled && (isNaN(parseInt(quantity.value)) || parseInt(quantity.value) <= 0)) {
      setQuantityError("Please input a valid quantity that is more than 0.");
      return;
    } else if (quantityError !== "") setQuantityError("")

    if (variations.length > 0 && productVariations.length === 0) {
      console.log("check")
      setRowErrors("Please either enter a variation or delete the variation field.");
      return;
    } else {
      productVariations.forEach((variation) => {
        if (isNaN(variation.price) || isNaN(variation.quantity) || variation.price <= 0 || variation.quantity <= 0) {
          setRowErrors("Please input valid values greater than zero.");
          return;
        } else setRowErrors("")
      })  
    }

    if (rowErrors != "") return;

    const formData: SubmitInterface = {
      name: name.value,
      description: description.value,
      price: Number.isNaN(parseFloat(price.value)) ? -1 : parseFloat(price.value),
      quantity: Number.isNaN(parseFloat(quantity.value)) ? -1 : parseFloat(quantity.value),
      categoryId: categoryId,
      category: categoryName,
      variations: productVariations,
    };

    if (product != undefined) {
      formData.productId = product.productId;
    }

    onSubmit(formData);
    setSubmitStatus("Success!");
  };

  return (
    <form 
      className="flex flex-col"
      onSubmit={handleProductFormSubmit}
    >
      <section className="flex flex-col">
        <label>
          Name:
          <input 
            className="text-black border-gray-300 rounded-md shadow-sm" 
            type="text" 
            name="name"
            required 
          />
        </label>
        
        {nameError && (
          <span className="tooltip">{nameError}</span>
        )}
        <br />

        <label>
          Description:
          <br />
          <textarea 
            className="text-black border-gray-300 rounded-md shadow-sm" 
            name="description" 
          />
        </label>

        <label>
          <select name="category">
            {categories.map(item => (
              <option key={item.category_id} value={item.category_id}>{item.name}</option>
            ))}
          </select>
        </label>
        <br />
        
        <label>
          Price:
          <input
            className="text-black border-gray-300 rounded-md shadow-sm disabled:opacity-25 disabled:text-gray-500 disabled:bg-gray-400"
            type="number"
            step=".01"
            disabled={variations.length > 0}
            name="priceNoVariation"
          />
          <br />
          {variations.length === 0 && (
            <span className="tooltip">This field is required for products without variations.</span>
          )}           
          <br />
          {priceError && (
            <span className="tooltip">{priceError}</span>
          )}
        </label>

        <label>
          Quantity:
          <input
            className="text-black border-gray-300 rounded-md shadow-sm disabled:opacity-25 disabled:text-gray-500 disabled:bg-gray-400"
            type="number"
            disabled={variations.length > 0}
            name="quantityNoVariation"
          />
          <br />
          {variations.length === 0 && (
            <span className="tooltip">This field is required for products without variations.</span>
          )}
          <br />
          {quantityError && (
            <span className="tooltip">{quantityError}</span>
          )}
        </label>

        {variations.map((variation, variationIndex) => (
            <div key={variationIndex} className="variation-section">
              <div className="variation-header">
                <button
                  className="remove-variation"
                  type="button"
                  onClick={() => handleRemoveVariation(variationIndex)}
                >
                  &#10006;
                </button>
              </div>

              <div className="variation-content">
                <label>
                  Variation Name:
                  <input
                    className="text-black border-gray-300 rounded-md shadow-sm"
                    type="text"
                    value={variation.name}
                    onChange={(e) => {console.log(e);handleVariationNameChange(variationIndex, e.target.value)}}
                  />
                </label>

                {variation.values.map((value, valueIndex) => (
                  <div key={valueIndex}>
                    <label>
                      Variation Value:
                      <input
                        className="text-black border-gray-300 rounded-md shadow-sm"
                        type="text"
                        value={value}
                        onChange={(e) => handleVariationValueChange(variationIndex, valueIndex, e.target.value)}
                      />
                    </label>

                    {valueIndex === variation.values.length - 1 && (
                      <button
                        className="text-black border-gray-300 rounded-md shadow-sm"
                        type="button"
                        onClick={() => handleAddVariationValue(variationIndex)}
                      >
                        Add Value
                      </button>
                    )}

                    {valueIndex !== 0 && (
                      <button
                        className="text-black border-gray-300 rounded-md shadow-sm"
                        type="button"
                        onClick={() => handleRemoveVariationValue(variationIndex, valueIndex)}
                      >
                        Remove Value
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {showAddVariation && (
            <button
              className="text-black border-gray-300 rounded-md shadow-sm"
              type="button"
              onClick={handleAddVariation}
            >
              Add Variation ({variations.length}/{maximumVariations})
            </button>
          )}
      </section>

      <section>
        <br />
        
        <MaterialReactTable
            key={productVariations.map((item) => item.name + item.price + item.quantity).join("-")}
            displayColumnDefOptions={{
            'mrt-row-actions': {
                muiTableHeadCellProps: {
                align: 'center',
                },
                size: 120,
            },
            }}
            columns={columns}
            data={productVariations}
            enableColumnOrdering
            enableEditing
            editingMode='table'
            muiTableBodyCellEditTextFieldProps={({ cell }) => ({
              //onBlur is more efficient, but could use onChange instead
              onBlur: (event) => {
                handleSaveCell(cell, event.target.value);
              }
            })}
            renderTopToolbarCustomActions={() => (
                <div>
                    <input 
                        className="text-black placeholder-gray-800 border-gray-300 rounded-md shadow-sm" 
                        type="number" 
                        // step=".01"
                        name="price" 
                        value={priceForAll}
                        placeholder="Price"
                        onChange={(e) => handlePriceForAllChange(e)}
                    />
                    <input 
                        className="text-black placeholder-gray-800 border-gray-300 rounded-md shadow-sm" 
                        type="number" 
                        name="quantity" 
                        value={quantityForAll}
                        placeholder="Stock"
                        onChange={(e) => handleQuantityForAllChange(e)}
                    />
                    <button
                    type="submit"
                    name="applyToAll"
                    onClick={(e) => handleApplyToAll(e)}
                    >
                    Apply To All
                    </button>
                </div>
            )}
        />
        <br />
        {rowErrors && (
          <span className="tooltip">{rowErrors}</span>
        )}
        {/* <ProductVariationsTable
          var1Arr={var1Arr}
          var2Arr={var2Arr}
          onSubmit={handleVariationsData}
        /> */}
      </section>

        <br />
        {submitStatus && (
          <span className="tooltip">{submitStatus}</span>
        )}

        <button 
          className="text-black p-3 border-gray-300 rounded-md shadow-sm" 
          type="submit" 
          name="submit" 
          value="Submit"
          // onClick={ProductForm}
        >
          Submit
        </button>

        <button 
          className="text-black p-3 border-gray-300 rounded-md shadow-sm" 
          type="reset" 
          name="reset" 
          value="Reset"
        >
          Reset
        </button>
      </form>
  )
}

export default ProductForm

  // edit
  // const [validationErrors, setValidationErrors] = useState<{
  //   [cellId: string]: string;
  // }>({});

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