import React, { useMemo, useState, useEffect } from 'react';
import MaterialReactTable, {
  MRT_Cell,
  type MRT_ColumnDef,
} from 'material-react-table';
import DeleteIcon from '@mui/icons-material/Delete';

import useAxiosPrivateSeller from "../../hooks/useAxiosPrivateSeller.js";
import { cld } from "../../Cloudinary/Cloudinary";
import { AdvancedImage } from "@cloudinary/react";
import CloudinaryUploader from "../../Cloudinary/CloudinaryUploader";

interface Category {
  categoryId: number;
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
  sku?: string;
}

interface Product {
  productId: number;
  active: boolean;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string[];
  sku: string;
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
        let variation1Arr: string[] = [];

        if (currentProduct?.subRows[0].variation2) {
          const variationName2 = currentProduct?.subRows[0].variation2?.split(": ")[0];
          
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

  const [selectedCategory, setSelectedCategory] = useState<number>(1);

  useEffect(() => {
    console.log(selectedCategory)
  }, [selectedCategory])

  useEffect(() => {
    if (currentProduct && currentProduct.categoryId) {
      setSelectedCategory(currentProduct.categoryId);
    }
  }, [currentProduct])

  const handleCategoryChange = (event: any) => {
    const selectedValue = event.target.value;
    setSelectedCategory(selectedValue);
  };

  const [productVariations, setProductVariations] = useState<ProductVariations[]>([]);

  useEffect(() => {
    let updatedProductVariations: ProductVariations[] = [];

    if (currentProduct) {
      currentProduct.subRows.forEach((variation) => {
        updatedProductVariations.push({
          name: variation.name,
          var1: variation.variation1 ? variation.variation1 : "",
          var2: variation.variation2 ? variation.variation2 : "",
          price: variation.price ? parseFloat(variation.price.toString()) : 0,
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
      productVariations[row.index].price = parseFloat(value);
    } else if (column.id === "quantity") {
      productVariations[row.index].quantity = parseInt(value);
    }
    setProductVariations([...productVariations]);
  }

  const [imageURL, setImageURL] = useState<string[]>([]);
  const [imageURLMap, setImageURLMap] = useState<string[][]>([]);

  useEffect(() => {
    console.log("imageURL", imageURL);
  }, [imageURL])

  useEffect(() => {
    console.log("imageURLMap", imageURLMap);
  }, [imageURLMap])

  useEffect(() => {
    if (currentProduct) {
      if (currentProduct.subRows.length === 0) setImageURL(currentProduct.imageUrl);
      else {
        let urlArr: string[][] = [];
        currentProduct.subRows.forEach((variation) => {
          urlArr.push(variation.imageUrl);
        })
        setImageURLMap(urlArr);
      }
    }
  }, [currentProduct])

  const handleUpload = async (resultInfo: any) => {
    console.log("Successfully uploaded:", resultInfo.public_id);
    setImageURL((prevImageURL) => [...prevImageURL, resultInfo.public_id]);
  }

  const handleDeleteImage = (index: number) => {
    setImageURL((prevImageURL) => {
      const updatedImageURL = [...prevImageURL];
      updatedImageURL.splice(index, 1);
      return updatedImageURL;
    });
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
      {
        accessorKey: 'imageUrl',
        header: 'Image',
        size: 80,
        enableEditing: false,
        Cell: ({row}) => (
          <>
            {imageURLMap[productVariations.findIndex(variation => variation.name === row.original.name)] && 
              imageURLMap[productVariations.findIndex(variation => variation.name === row.original.name)].map((imageUrl: string, index: number) => (
              <div key={index} className="flex flex-row w-40 h-40 mb-5">
                <AdvancedImage cldImg={cld.image(imageUrl)} />
                <button 
                  type="button"
                  className="flex"
                  onClick={() => {
                    row.original.imageUrl.splice(index, 1);
                    const updatedImageURLMap = [...imageURLMap];
                    updatedImageURLMap[row.index] = row.original.imageUrl;
                    setImageURLMap(updatedImageURLMap);
                  }}
                >
                  <DeleteIcon />
                </button>
              </div>
            ))}
            <CloudinaryUploader 
              onSuccess={(resultInfo: any) => {
                row.original.imageUrl.push(resultInfo.public_id);
                const updatedImageURLMap = [...imageURLMap];
                updatedImageURLMap[row.index] = row.original.imageUrl;
                setImageURLMap(updatedImageURLMap);
              }} 
              caption={"Upload Image"}
            />
          </>
        )
      },
    ],
    [imageURLMap]
  );

  const [nameError, setNameError] = useState("");
  const [priceError, setPriceError] = useState("");
  const [quantityError, setQuantityError] = useState("");
  const [imageError, setImageError] = useState<string>("");
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
    const categoryName = category.options[category.selectedIndex].text;

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
      setRowErrors("Please either enter a variation or delete the variation field.");
      return;
    } else {
      productVariations.forEach((variation) => {
        if (isNaN(variation.price) || isNaN(variation.quantity) || variation.price <= 0 || variation.quantity <= 0) {
          setRowErrors("Please input valid values greater than zero.");
          validVariationInput = false;
          return;
        } 
      }) 
    
      if (validVariationInput) {
        productVariations.forEach((variation) => {
          if (variation.imageUrl.length === 0) {
            setRowErrors("Please upload at least 1 image for each variation.");
            validVariationInput = false;
            return; 
          }
        })
        if (validVariationInput) {
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
      categoryId: selectedCategory ? selectedCategory : 1,
      category: categoryName,
      variations: productVariations,
    };

    if (currentProduct) {
      formData.productId = currentProduct.productId;
      formData.sku = currentProduct.sku;
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
            value={selectedCategory}
            onChange={handleCategoryChange}
          >
            {categories.map((category: Category) => {
              return (
                <>
                  {category.categoryId === selectedCategory ? (
                    <option key={category.categoryId} value={category.categoryId} selected>
                    {category.name}
                  </option>
                  ): (<option key={category.categoryId} value={category.categoryId}>
                    {category.name}
                  </option>)}
                </>
              );
            })}
          </select>
        </label>
        <br />
        
        {variations.length === 0 && (
          <span className="tooltip">This field is required for products without variations.</span>
        )}  

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
          {quantityError && (
            <span className="tooltip">{quantityError}</span>
          )}
        </label>

        <label>
          {variations.length === 0 && (
            <>
              <br />
              {imageURL && imageURL.map((imageUrl: string, index: number) => (
                <div key={index} className="flex flex-row w-40 h-40 mb-5">
                  <AdvancedImage cldImg={cld.image(imageUrl)} />
                  <button 
                    type="button"
                    className="flex"
                    onClick={() => handleDeleteImage(index)}
                  >
                    <DeleteIcon />
                  </button>
                </div>
              ))}
              <CloudinaryUploader 
                onSuccess={handleUpload} 
                caption={"Upload Image"} 
              />
              {imageError && (
                <span className="tooltip">{imageError}</span>
              )}
              <br />
              <br />
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

