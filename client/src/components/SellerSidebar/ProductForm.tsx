import React, { useMemo, useState, useEffect } from 'react';
import MaterialReactTable, {
  MRT_Cell,
  type MRT_ColumnDef,
} from 'material-react-table';

import useAxiosPrivateSeller from "../../hooks/useAxiosPrivateSeller.js";
import CloudinaryUploader from "../../Cloudinary/CloudinaryUploader";

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
  imageUrl: string[];
  // sku?: string;
}

interface SubmitVariationsInterface {
  var1: string; 
  var2: string;
  price: number;
  quantity: number;
  imageUrl: string[];
  // sku?: string;
}

interface SubmitInterface {
  name: string;
  description: string;
  price: number;
  quantity: number;
  imageUrl: string[];
  categoryId: number;
  category: string;
  variations: Array<SubmitVariationsInterface>;

  // optional properties
  // edit product only
  productId?: number;
  // sku?: string;
}

interface Product {
  productId: number;
  active: boolean;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string[];
  // sku: string;
  subRows: Array<Product>;

  // optional properties
  // product only
  // showSubrows?: boolean;
  description?: string;
  categoryId?: number;
  category?: string;

  // product variations only
  variation1?: string;
  variation2?: string;
}

interface ProductFormProps {
  product?: Product;
  onSubmit: (data: SubmitInterface) => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ product, onSubmit }) => {

  const axiosPrivateSeller = useAxiosPrivateSeller();

  const [currentProduct, setCurrentProduct] = useState<Product>();

  useEffect(() => {
    if (product) {
      setCurrentProduct(Object.values(product)[0]);
    }
  }, [])

  useEffect(() => {
    console.log("currentProduct", currentProduct);
    currentProduct ? console.log("currentProduct name", currentProduct.name) : "";
  }, [currentProduct])

  // maximum number of variations allowed
  const maximumVariations = 2; 
  const [variations, setVariations] = useState([{ name: "", values: [""] }]);

  const [var1Arr, setVar1Arr] = useState<string[]>([]);
  const [var2Arr, setVar2Arr] = useState<string[]>([]);

  const capitaliseFirstLetter = (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  useEffect(() => {
    let defaultVariation: { name: string; values: string[]; }[] = [];
    if (currentProduct && currentProduct?.subRows.length > 0) {
      if (currentProduct?.subRows[0].variation1) {
        const variationName1 = currentProduct?.subRows[0].variation1?.split(": ")[0];
        console.log("var name", variationName1) 
        let variation1Arr: string[] = [];

        if (currentProduct?.subRows[0].variation2) {
          const variationName2 = currentProduct?.subRows[0].variation2?.split(": ")[0];
          console.log("var name", variationName2) 
          
          let variation2Arr: string[] = [];
          currentProduct?.subRows.forEach((variation) => {
            variation.variation1 ? variation1Arr.push(variation.variation1.split(": ")[1]) : "";
            variation.variation2 ? variation2Arr.push(variation.variation2.split(": ")[1]) : "";
          });    
          defaultVariation.push({
            name: variationName1,
            values: Array.from(new Set(variation1Arr)),
          });
          defaultVariation.push({
            name: variationName2,
            values: Array.from(new Set(variation2Arr)),
          });
        } else {
          currentProduct?.subRows.forEach((variation) => {
            variation.variation1 ? variation1Arr.push(variation.variation1.split(": ")[1]) : "";
          })
          defaultVariation.push({
            name: variationName1,
            values: Array.from(new Set(variation1Arr)),
          })  
        }
      }
    }
    setVariations(defaultVariation);
  }, [currentProduct])

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

    if (currentProduct) {
      currentProduct.subRows.forEach((variation) => {
        updatedProductVariations.push({
          name: variation.name,
          var1: variation.variation1 ? variation.variation1 : "",
          var2: variation.variation2 ? variation.variation2 : "",
          price: variation.price,
          quantity: variation.quantity,
          imageUrl: variation.imageUrl, 
        })
      });
    }
    
    setProductVariations(updatedProductVariations);
  }, [currentProduct])

  useEffect(() => {
    let updatedProductVariations: ProductVariations[] = [];

    if (var2Arr.length > 0) {
      var1Arr.forEach((var1) => {
          var2Arr.forEach((var2) => {
            let currentVariation1: Product | undefined = currentProduct?.subRows.find(
              (variation) =>
                variation.variation1 === var1 && variation.variation2 === var2
            );
            let currentVariation2: ProductVariations | undefined;
            if (!currentVariation1 && productVariations) {
              currentVariation2 = productVariations.find(
                (variation) =>
                  variation.var1 === var1 && variation.var2 === var2
              );
            }
            let newVar: ProductVariations = {
              name: `${var1} + ${var2}`,
              var1: var1,
              var2: var2,
              price: currentVariation1 ? currentVariation1.price : currentVariation2 ? currentVariation2.price : 0,
              quantity: currentVariation1 ? currentVariation1.quantity : currentVariation2 ? currentVariation2.quantity : 0,
              imageUrl: currentVariation1 ? currentVariation1.imageUrl : currentVariation2 ? currentVariation2.imageUrl : [],
            };
            updatedProductVariations.push(newVar);
          })
      })
    } else {
      var1Arr.forEach((var1) => {
        let currentVariation1: Product | undefined = currentProduct?.subRows.find(
          (variation) =>
            variation.variation1 === var1 && !variation.variation2
        );
        let currentVariation2: ProductVariations | undefined;      
        if (!currentVariation1 && productVariations) {
          currentVariation2 = productVariations.find(
            (variation) =>
              variation.var1 === var1 && !variation.var2
          );
        }
        let newVar: ProductVariations = {
          name: `${var1}`,
          var1: var1,
          var2: "",
          price: currentVariation1 ? currentVariation1.price : currentVariation2 ? currentVariation2.price : 0,
          quantity: currentVariation1 ? currentVariation1.quantity : currentVariation2 ? currentVariation2.quantity : 0,
          imageUrl: currentVariation1 ? currentVariation1.imageUrl : currentVariation2 ? currentVariation2.imageUrl : [],
        };
        updatedProductVariations.push(newVar);
      })
    }

    setProductVariations(updatedProductVariations);
  }, [var1Arr, var2Arr]);

  const [priceForAll, setPriceForAll] = useState<number>(0);
  const [quantityForAll, setQuantityForAll] = useState<number>(0);

  const handlePriceForAllChange = (event: any) => {
      setPriceForAll(parseFloat(event.target.value));
  };
  
  const handleQuantityForAllChange = (event: any) => {
      setQuantityForAll(parseInt(event.target.value));
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
      {
        accessorKey: 'imageUrl',
        header: 'Image',
        size: 80,
        enableEditing: false,
        Cell: ({row}) => (
          <CloudinaryUploader 
            // onSuccess={handleProductVariationImageUpload} 
            onSuccess={(resultInfo: any) => {
              console.log("Successfully uploaded:", resultInfo.public_id);
              row.original.imageUrl.push(resultInfo.public_id);
            }} 
            caption={"Upload Image"}
          />
        )
      },
    ],
    []
  );

  const [imageURL, setImageURL] = useState<string[]>([]);
  const [imageError, setImageError] = useState<string>("");

  const handleUpload = async (resultInfo: any) => {
    console.log("Successfully uploaded:", resultInfo.public_id);
    setImageURL(resultInfo.public_id);
    return;
  }

  const [nameError, setNameError] = useState("");
  const [priceError, setPriceError] = useState("");
  const [quantityError, setQuantityError] = useState("");
  const [submitStatus, setSubmitStatus] = useState("");

  const handleProductFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setSubmitStatus("Please try again.");
    setRowErrors("");
    // if (rowErrors != "") return;

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
    } else if (priceError !== "") setPriceError("");

    const quantity = form.elements.namedItem('quantityNoVariation') as HTMLInputElement;

    if (!quantity.disabled && (isNaN(parseInt(quantity.value)) || parseInt(quantity.value) <= 0)) {
      setQuantityError("Please input a valid quantity that is more than 0.");
      return;
    } else if (quantityError !== "") setQuantityError("");

    if (variations.length === 0 && imageURL.length === 0) {
      setImageError("Please upload an image.");
      return;
    } else if (imageError != "") setImageError("");

    let validVariationInput = true;

    if (variations.length > 0 && productVariations.length === 0) {
      console.log("check")
      setRowErrors("Please either enter a variation or delete the variation field.");
      return;
    } else {
      productVariations.forEach((variation) => {
        if (isNaN(variation.price) || isNaN(variation.quantity) || variation.price <= 0 || variation.quantity <= 0) {
          setRowErrors("Please input valid values greater than zero.");
          // console.log("check")
          console.log(rowErrors)
          validVariationInput = false;
          console.log("valid1", validVariationInput)
          return;
        } 
      }) 
  
      console.log("valid", validVariationInput)
  
      if (validVariationInput) {
        console.log("help");
        productVariations.forEach((variation) => {
          if (variation.imageUrl.length === 0) {
            setRowErrors("Please upload at least 1 image for each variation.");
            console.log(rowErrors)
            validVariationInput = false;
            console.log("valid2", validVariationInput) 
            return; 
          }
        })
        if (validVariationInput) {
          console.log("valid3", validVariationInput) 
          setRowErrors("");
        }
      }
    }

    if (!validVariationInput) return;

    const formData: SubmitInterface = {
      name: name.value,
      description: description.value,
      price: Number.isNaN(parseFloat(price.value)) ? -1 : parseFloat(price.value),
      quantity: Number.isNaN(parseFloat(quantity.value)) ? -1 : parseFloat(quantity.value),
      imageUrl: imageURL,
      categoryId: categoryId,
      category: categoryName,
      variations: productVariations,
    };

    if (product != undefined) {
      formData.productId = product.productId;
    }

    console.log("string or num", productVariations)
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
            defaultValue={currentProduct ? currentProduct.name : ""}
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
            defaultValue={currentProduct ? currentProduct.description : ""}
          />
        </label>

        <label>
          <select 
            name="category"
            defaultValue={currentProduct ? currentProduct.categoryId : 1}
          >
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
            defaultValue={currentProduct ? currentProduct.price : ""}
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
            defaultValue={currentProduct ? currentProduct.quantity : ""}
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

        <label>
          {variations.length === 0 && (
            <>
              <br />
              <CloudinaryUploader 
                onSuccess={handleUpload} 
                caption={"Upload Image"} 
              />
              <br />
              <span className="tooltip">This field is required for products without variations.</span>
              <br />
              {imageError && (
                <span className="tooltip">{imageError}</span>
              )}
            </>
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
        
          {(variations.length !== 0 && <MaterialReactTable
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
        />)}        
        <br />
        {rowErrors && (
          <span className="tooltip">{rowErrors}</span>
        )}
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