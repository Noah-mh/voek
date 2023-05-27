import { useState, useEffect } from 'react'
// import useSeller from "../../hooks/useSeller.js";

import useAxiosPrivateSeller from "../../hooks/useAxiosPrivateSeller.js";

interface Category {
  category_id: number;
  name: string;
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

const CreateProduct = () => {

  const axiosPrivateSeller = useAxiosPrivateSeller();

  // const { seller } = useSeller();
  // const sellerId = seller.seller_id;

  // const [showVariations, setShowVariations] = useState(false);

  // const handleToggleVariations = () => {
  //   setShowVariations(!showVariations);
  // };

  const maximumVariations = 2; // Maximum number of variations allowed
  const [variations, setVariations] = useState([{ name: '', values: [''] }]);
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

  const addProduct = async () => {

  }

  return (
    <div className="flex flex-row">

      <div className="flex flex-column">
      <h1>Add Product</h1>
      <form>
        <label>
          Name:
          <input className="text-black border-gray-300 rounded-md shadow-sm" type="text" name="name" />
        </label>
        <br />
        <label>
          Description:
          <br />
          <textarea className="text-black border-gray-300 rounded-md shadow-sm" name="description" />
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
          <input className="text-black border-gray-300 rounded-md shadow-sm" type="number" step=".01" name="price" />
        </label>
        <br />
        <label>
          Quantity:
          <input className="text-black border-gray-300 rounded-md shadow-sm" type="number" step=".01" name="price" />
        </label>
        <br />

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
                    onChange={(e) => handleVariationNameChange(variationIndex, e.target.value)}
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

        <br />
        <button className="text-black border-gray-300 rounded-md shadow-sm" type="submit" name="submit" value="Submit"
          onClick={addProduct}
        />
        <button className="text-black border-gray-300 rounded-md shadow-sm" type="reset" name="reset" value="Reset" />
      </form>
      </div>
    </div>
  )
}

export default CreateProduct

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