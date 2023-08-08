import React, { useMemo, useState, useEffect } from 'react';
import MaterialReactTable, {
  MRT_Cell,
  type MRT_ColumnDef,
} from 'material-react-table';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import Box from "@mui/material/Box";
import TextField from '@mui/material/TextField';

import useAxiosPrivateSeller from "../../hooks/useAxiosPrivateSeller.js";
import { cld } from "../../Cloudinary/Cloudinary";
import { AdvancedImage } from "@cloudinary/react";
import CloudinaryUploader from "../../Cloudinary/CloudinaryUploader";
// import CloudinaryUpload from '../../Cloudinary/CloudinaryUpload.js';
import MenuItem from '@mui/material/MenuItem';
import InputAdornment from '@mui/material/InputAdornment';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import FormHelperText from '@mui/material/FormHelperText';

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
  imageUrl: string;
  sku?: string;
}

interface SubmitVariationsInterface {
  var1: string;
  var2: string;
  price: number;
  quantity: number;
  imageUrl: string;
  // sku?: string;
}

interface SubmitInterface {
  name: string;
  description: string;
  price: number;
  quantity: number;
  imageUrl: string;
  categoryId: number;
  // category: string;
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
  imageUrl: string;
  sku: string;
  subRows: Array<Product>;

  // optional properties
  // product only
  // showSubrows?: boolean;
  description?: string;
  categoryId?: number;
  category?: string;

  // product variations only
  variation1?: string | null;
  variation2?: string | null;
}

interface FormValues {
  name: {
    value: string;
    error: boolean;
    errorMessage: string;
  };
  description: {
    value: string;
    error: boolean;
    errorMessage: string;
  };
  selectedCategory: {
    value: number | null;
    error: boolean;
    errorMessage: string;
  };
  price: {
    value: string;
    parsedValue: number | null;
    error: boolean;
    errorMessage: string;
  };
  quantity: {
    value: string;
    parsedValue: number | null;
    error: boolean;
    errorMessage: string;
  };
  imageUrl: {
    value: string;
    error: boolean;
    errorMessage: string;
  };
}

interface ProductFormProps {
  product?: Product;
  // onSubmit: (data: SubmitInterface) => void;
  onSubmit: (data: SubmitInterface) => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ product, onSubmit }) => {

  const axiosPrivateSeller = useAxiosPrivateSeller();

  const [currentProduct, setCurrentProduct] = useState<Product>();

  // setCurrentProduct to product if product exists
  useEffect(() => {
    if (product) {
      // setCurrentProduct(Object.values(product)[0]);
      setCurrentProduct(product);
    }
  }, [])

  // console.log currentProduct every time it changes
  useEffect(() => {
    console.log("currentProduct", currentProduct);
    currentProduct ? console.log("currentProduct name", currentProduct.name) : "";
  }, [currentProduct])

  // maximum number of variations allowed
  const maximumVariations = 2;
  // variations state --> stores category name (e.g. colour, size) and variations (e.g. red, blue, small, medium, etc.)
  const [variations, setVariations] = useState([{ name: "", values: [""] }]);
  // formatted variations' names state
  const [var1Arr, setVar1Arr] = useState<string[]>([]);
  const [var2Arr, setVar2Arr] = useState<string[]>([]);

  const capitaliseFirstLetter = (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  // setVariations default a.k.a. according to currentProduct if exists
  const setVariationsDefault = () => {
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
  }

  // setVariations default a.k.a. according to currentProduct if it changes
  useEffect(() => {
    setVariationsDefault();
  }, [currentProduct])

  // setVar1Arr and setVar2Arr when variations changes
  useEffect(() => {
    let arr1: string[] = [];
    let arr2: string[] = [];

    variations[0] ? variations[0].values.forEach((value) =>
      variations[0].name && value
        ? arr1.push(`${capitaliseFirstLetter(variations[0].name)}: ${capitaliseFirstLetter(value)}`)
        : ""
    ) : "";
    variations[1] ? variations[1].values.forEach((value) =>
      variations[1].name && value
        ? arr2.push(`${capitaliseFirstLetter(variations[1].name)}: ${capitaliseFirstLetter(value)}`)
        : ""
    ) : "";

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

  // productVariations state --> stores productVariations to be submitted
  const [productVariations, setProductVariations] = useState<ProductVariations[]>([]);

  // setProductVariations default a.k.a. according to currentProduct if it exists
  const setProductVariationsDefault = () => {
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
          sku: variation.sku
        })
      });
    }

    setProductVariations(updatedProductVariations);
  }

  // setProductVariations default a.k.a. according to currentProduct if it changes
  useEffect(() => {
    setProductVariationsDefault();
  }, [currentProduct])

  // console.log productVariations every time it changes
  useEffect(() => {
    console.log("useEffect productVariations", productVariations)
  }, [productVariations]);

  // setProductVariations if var1Arr and var2Arr changes, meaning that variations changed
  useEffect(() => {
    let updatedProductVariations: ProductVariations[] = [];

    // if there are 2 variation categories
    if (var2Arr.length > 0) {
      var1Arr.forEach((var1) => {
        var2Arr.forEach((var2) => {
          // check if variation already exists in currentProduct
          let currentVariation1: Product | undefined = currentProduct?.subRows.find(
            (variation) =>
              variation.variation1 === var1 && variation.variation2 === var2
          );
          // if variation does not exist in currentProduct, check if it exists in productVariations a.k.a. exists in product form but not in database
          let currentVariation2: ProductVariations | undefined;
          if (!currentVariation1 && productVariations) {
            currentVariation2 = productVariations.find(
              (variation) =>
                variation.var1 === var1 && variation.var2 === var2
            );
          }
          // updated variation
          let newVar: ProductVariations = {
            name: `${var1} + ${var2}`,
            var1: var1,
            var2: var2,
            price: currentVariation1 ? currentVariation1.price : currentVariation2 ? currentVariation2.price : 0,
            quantity: currentVariation1 ? currentVariation1.quantity : currentVariation2 ? currentVariation2.quantity : 0,
            imageUrl: currentVariation1 ? currentVariation1.imageUrl : currentVariation2 ? currentVariation2.imageUrl : "",
            sku: currentVariation1 ? currentVariation1.sku : currentVariation2 ? currentVariation2.sku : "",
          };
          // add variation to updatedProductVariations array
          updatedProductVariations.push(newVar);
        })
      })
    } else { // only 1 variation category
      var1Arr.forEach((var1) => {
        // check if variation already exists in currentProduct
        let currentVariation1: Product | undefined = currentProduct?.subRows.find(
          (variation) =>
            variation.variation1 === var1 && !variation.variation2
        );
        // if variation does not exist in currentProduct, check if it exists in productVariations a.k.a. exists in product form but not in database
        let currentVariation2: ProductVariations | undefined;
        if (!currentVariation1 && productVariations) {
          currentVariation2 = productVariations.find(
            (variation) =>
              variation.var1 === var1 && !variation.var2
          );
        }
        // updated variation
        let newVar: ProductVariations = {
          name: `${var1}`,
          var1: var1,
          var2: "",
          price: currentVariation1 ? currentVariation1.price : currentVariation2 ? currentVariation2.price : 0,
          quantity: currentVariation1 ? currentVariation1.quantity : currentVariation2 ? currentVariation2.quantity : 0,
          imageUrl: currentVariation1 ? currentVariation1.imageUrl : currentVariation2 ? currentVariation2.imageUrl : "",
          sku: currentVariation1 ? currentVariation1.sku : currentVariation2 ? currentVariation2.sku : "",
        };
        // add variation to updatedProductVariations array
        updatedProductVariations.push(newVar);
      })
    }

    setProductVariations(updatedProductVariations);
  }, [var1Arr, var2Arr]);

  // const [priceForAll, setPriceForAll] = useState<number>(0);
  // const [quantityForAll, setQuantityForAll] = useState<number>(0);

  // const handlePriceForAllChange = (event: any) => {
  //   setPriceForAll(parseFloat(event.target.value));
  // };

  // const handleQuantityForAllChange = (event: any) => {
  //   setQuantityForAll(parseInt(event.target.value));
  // };

  // const handleApplyToAll = (event: any) => {
  //   event.preventDefault();

  // const updatedProductVariations = productVariations.map((variation) => ({
  //       ...variation,
  //       price: priceForAll >= 0 ? priceForAll : variation.price,
  //       quantity: quantityForAll >= 0 ? quantityForAll : variation.quantity,
  //   }));

  //   setProductVariations(updatedProductVariations);
  // }

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
        Cell: ({ row }) => (
          <Box key={row.index + row.original.name}>
            {(row.original.imageUrl && (
              <div className="flex flex-row w-40 h-40 mb-5">
                <AdvancedImage cldImg={cld.image(row.original.imageUrl)} />
                <Box>
                  <IconButton
                    type="button"
                    className="flex"
                    onClick={() => {
                      console.log("row", row)
                      setProductVariations((prevProductVariations) => {
                        const updatedVariations = [...prevProductVariations];
                        updatedVariations[row.index] = {
                          ...updatedVariations[row.index],
                          imageUrl: "",
                        };
                        return updatedVariations;
                      })
                      console.log("updated product variations", productVariations)
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </div>
            ))}
            <CloudinaryUploader
              onSuccess={async (resultInfo: any) => {
                console.log("row3", row)
                console.log("resultInfo", resultInfo)
                setProductVariations((prevProductVariations) => {
                  const updatedVariations = [...prevProductVariations];
                  updatedVariations[row.index] = {
                    ...updatedVariations[row.index],
                    imageUrl: resultInfo.public_id,
                  };
                  return updatedVariations;
                })
              }}
              caption={"Upload Image"}
              key={row.index}
            />
          </Box>
        )
      },
    ],
    [productVariations]
  );

  const [selectedCategory, setSelectedCategory] = useState<number>(0);

  const [formValues, setFormValues] = useState<FormValues>({
    name: {
      value: "",
      error: false,
      errorMessage: "Please enter a name."
    },
    description: {
      value: "",
      error: false,
      errorMessage: "Please enter a description."
    },
    selectedCategory: {
      value: null,
      error: false,
      errorMessage: "Please select a category."
    },
    price: {
      value: "",
      parsedValue: null,
      error: false,
      errorMessage: "Please enter a valid price."
    },
    quantity: {
      value: "",
      parsedValue: null,
      error: false,
      errorMessage: "Please enter a valid integer."
    },
    imageUrl: {
      value: "",
      error: false,
      errorMessage: "Please upload only one image."
    }
  })

  // console.log formValues every time it changes
  useEffect(() => {
    console.log("formValues", formValues);
  }, [formValues])

  // setFormValues default a.k.a. according to currentProduct if it exists
  const setFormValuesDefault = () => {
    currentProduct?.categoryId ? setSelectedCategory(currentProduct.categoryId) : "";
    if (currentProduct && currentProduct.categoryId) {
      setSelectedCategory(currentProduct.categoryId);
    }

    setFormValues(prevFormValues => ({
      ...prevFormValues,
      name: {
        ...prevFormValues.name,
        value: currentProduct?.name || ""
      },
      description: {
        ...prevFormValues.description,
        value: currentProduct?.description || ""
      },
      selectedCategory: {
        ...prevFormValues.selectedCategory,
        value: currentProduct?.categoryId || null
      },
      price: {
        ...prevFormValues.price,
        value: currentProduct?.price.toString() || "",
        parsedValue: currentProduct?.price || null
      },
      quantity: {
        ...prevFormValues.quantity,
        value: currentProduct?.quantity.toString() || "",
        parsedValue: currentProduct?.quantity || null
      },
      imageUrl: {
        ...prevFormValues.imageUrl,
        value: currentProduct?.imageUrl[0] || ""
      },
    }));
  }

  // setFormValues default a.k.a. according to currentProduct if it changes
  useEffect(() => {
    setFormValuesDefault();
  }, [currentProduct]);

  // console.log selectedCategory every time it changes
  useEffect(() => {
    console.log("selectedCategory", selectedCategory);
  }, [selectedCategory])

  const [categories, setCategories] = useState<Category[]>([]);

  // get categories options
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

  const handleUploadImage = async (resultInfo: any) => {
    console.log("Successfully uploaded:", resultInfo.public_id);
    setFormValues({
      ...formValues,
      imageUrl: {
        ...formValues.imageUrl,
        value: resultInfo.public_id
      }
    })
  }

  const handleDeleteImage = () => {
    setFormValues({
      ...formValues,
      imageUrl: {
        ...formValues.imageUrl,
        value: ""
      }
    })
  };

  const [priceForAll, setPriceForAll] = useState<number>();
  const [priceForAllError, setPriceForAllError] = useState<boolean>(false);

  const [quantityForAll, setQuantityForAll] = useState<number>();
  const [quantityForAllError, setQuantityForAllError] = useState<boolean>(false);

  const handleApplyToAll = (e: any) => {
    e.preventDefault();

    const updatedProductVariations = productVariations.map((variation) => ({
      ...variation,
      price: priceForAll && priceForAll >= 0 ? priceForAll : variation.price,
      quantity: quantityForAll && quantityForAll >= 0 ? quantityForAll : variation.quantity,
    }));

    setProductVariations(updatedProductVariations);
  }

  // reset form to default
  const handleReset = async () => {
    setFormValuesDefault();
    setVariationsDefault();
    setShowAddVariation(true);
    setProductVariationsDefault();
  }

  // submit form to parent component, either AddProduct.tsx or EditProduct.tsx
  const handleProductFormSubmit = async (e: any) => {
    e.preventDefault();

    if (formValues.name.error || formValues.description.error || (formValues.price.error && variations.length == 0) || (formValues.quantity.error && variations.length == 0)) {
      return;
    } else if (formValues.selectedCategory.value === null) {
      setFormValues({
        ...formValues,
        selectedCategory: {
          ...formValues.selectedCategory,
          error: true
        }
      })
      return;
    } else if (variations.length === 0 && formValues.imageUrl.value === "") {
      if (formValues.selectedCategory.error === true) {
        setFormValues({
          ...formValues,
          selectedCategory: {
            ...formValues.selectedCategory,
            error: false
          }
        })
      }
      setFormValues({
        ...formValues,
        imageUrl: {
          ...formValues.imageUrl,
          error: true
        }
      })
      return;
    }

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

    if (!validVariationInput) {
      return;
    }

    const formData: SubmitInterface = {
      name: formValues.name.value,
      description: formValues.description.value,
      categoryId: formValues.selectedCategory.value,
      price: formValues.price.parsedValue ? formValues.price.parsedValue : -1,
      quantity: formValues.quantity.parsedValue ? formValues.quantity.parsedValue : -1,
      imageUrl: formValues.imageUrl.value,
      variations: productVariations,
    };

    if (currentProduct) {
      formData.productId = currentProduct.productId;
      formData.sku = currentProduct.sku;
    }

    onSubmit(formData);
    if (!currentProduct) handleReset();
  }

  useEffect(() => {
    console.log("rowErrors", rowErrors);
  }, [rowErrors])

  useEffect(() => {
    console.log("formValues.imageUrl.errorMessage", formValues.imageUrl.errorMessage)
  }, [formValues.imageUrl.error, formValues.imageUrl.errorMessage])

  return (
    <Box
      component="form"
      onSubmit={handleProductFormSubmit}
    >
      <Box
        className="flex-1"
        // component="form"
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1,
          width: 1,
          flexGrow: 1,
          flexShrink: 1,
          // maxWidth: '75%'
        }}
      // noValidate
      // autoComplete="off"
      >
        <TextField
          id="name"
          label="Name"
          required
          variant="outlined"
          autoComplete="off"
          value={formValues.name.value}
          error={formValues.name.error}
          helperText={formValues.name.error && formValues.name.errorMessage}
          onChange={(e) => {
            const { value } = e.target;
            setFormValues({
              ...formValues,
              name: {
                ...formValues.name,
                value: value,
                error: value.trim() === ""
              }
            })
          }}
          fullWidth
          sx={{ m: 2 }}
        />
        <TextField
          id="description"
          label="Description"
          required
          variant="outlined"
          value={formValues.description.value}
          error={formValues.description.error}
          helperText={formValues.description.error && formValues.description.errorMessage}
          onChange={(e) => {
            const { value } = e.target;
            setFormValues({
              ...formValues,
              description: {
                ...formValues.description,
                value: value,
                error: value.trim() === ""
              }
            })
          }}
          fullWidth
          sx={{ m: 2, height: 'auto' }}
        />
        <TextField
          id="category"
          select
          label="Category"
          required
          // value={formValues.selectedCategory.value}
          // defaultValue={selectedCategory}
          value={selectedCategory}
          error={formValues.selectedCategory.error}
          helperText={formValues.selectedCategory.error && formValues.selectedCategory.errorMessage}
          onChange={(e) => {
            const { value } = e.target;
            setSelectedCategory(parseInt(value));
            setFormValues({
              ...formValues,
              selectedCategory: {
                ...formValues.selectedCategory,
                value: parseInt(value),
                error: isNaN(parseInt(value))
              }
            })
          }}
          fullWidth
          sx={{ m: 2 }}
        >
          {categories.map((category: Category) => (
            <MenuItem key={category.categoryId} value={category.categoryId}>
              {category.name}
            </MenuItem>
          ))}
        </TextField>

        {variations.map((variation, variationIndex) => (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              m: 2,
              // width: 1,
              bgcolor: '#bbdefb',
              borderRadius: '16px',
              flexShrink: 1,
              // maxWidth: '75%'
            }}
          >
            <Box
              sx={{
                flexGrow: 1
              }}
            >
              <Box
                key={variationIndex}
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  m: 2,
                  bgcolor: 'background.paper',
                  borderRadius: '16px'
                }}
              >
                <TextField
                  id="variation-category"
                  label="Category of Variation"
                  variant="outlined"
                  required
                  helperText="E.g. Colour, Size, etc."
                  value={variation.name}
                  onChange={(e) => handleVariationNameChange(variationIndex, e.target.value)}
                  fullWidth
                  sx={{
                    m: 2,
                    flexGrow: 1
                  }}
                />
              </Box>

              {variation.values.map((value, valueIndex) => (
                <Box
                  key={valueIndex}
                  className="flex flex-row"
                  sx={{
                    m: 2,
                    alignItems: 'center',
                    bgcolor: 'background.paper',
                    borderRadius: '16px'
                  }}
                >
                  <TextField
                    className="variation-name"
                    label="Variation"
                    variant="outlined"
                    required
                    helperText="E.g. Red, Blue, Small, Medium, etc."
                    value={value}
                    onChange={(e) => handleVariationValueChange(variationIndex, valueIndex, e.target.value)}
                    fullWidth
                    sx={{
                      m: 2,
                      flexGrow: 1
                    }}
                  />

                  {valueIndex === variation.values.length - 1 && (
                    <Box>
                      <IconButton
                        className="add-variation-value flex-end"
                        type="button"
                        onClick={() => handleAddVariationValue(variationIndex)}
                        sx={{ mr: 2 }}
                      >
                        <AddIcon />
                      </IconButton>
                    </Box>
                  )}

                  {variation.values.length !== 1 && (
                    <Box>
                      <IconButton
                        className="remove-variation-value flex-end"
                        type="button"
                        onClick={() => handleRemoveVariationValue(variationIndex, valueIndex)}
                        sx={{ mr: 2 }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  )}

                </Box>
              ))}
            </Box>

            <Box>
              <IconButton
                className="remove-variation flex-end"
                type="button"
                onClick={() => handleRemoveVariation(variationIndex)}
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  m: 2,
                  ml: 0
                }}
              >
                &#10006;
              </IconButton>
            </Box>
          </Box>
        ))}

        {showAddVariation && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              m: 2,
            }}
          >
            <Button
              variant="contained"
              type="button"
              onClick={handleAddVariation}
              // fullWidth
              sx={{

              }}
            >
              Add Variation ({variations.length}/{maximumVariations})
            </Button>
          </Box>
        )}

        {(variations.length !== 0 &&
          <Box
            sx={{
              // width: 'maxContent',
              // maxWidth: 400,
              width: '100%',
              overflowX: 'auto'
            }}
          >
            <div
              style={{
                width: 'maxContent',
                // width: '100%',
                overflowX: 'auto'
              }}
            >
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
                // muiTableBodyCellProps={{
                //   //simple styling with the `sx` prop, works just like a style prop in this example
                //   sx: {
                //     borderColor: 'purple',
                //   },
                // }}
                renderTopToolbarCustomActions={() => (
                  <Box
                    sx={{
                      height: 'auto',
                      alignItems: 'center'
                    }}
                  >
                    <TextField
                      id="price"
                      label="Price"
                      type="number"
                      variant="outlined"
                      InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                      }}
                      value={priceForAll}
                      error={priceForAllError}
                      helperText={priceForAllError && "Please enter a valid price."}
                      onChange={(e) => {
                        const { value } = e.target;
                        if (isNaN(parseFloat(value)) || value.includes("e")) setPriceForAllError(true);
                        else setPriceForAllError(false);
                        setPriceForAll(parseFloat(value));
                      }}
                      sx={{
                        m: 1,
                        maxWidth: 250
                      }}
                    />
                    <TextField
                      id="quantity"
                      label="Quantity"
                      type="number"
                      variant="outlined"
                      value={quantityForAll}
                      error={quantityForAllError}
                      helperText={quantityForAllError && "Please enter a valid price."}
                      onChange={(e) => {
                        const { value } = e.target;
                        if (isNaN(parseInt(value)) || value.includes("e")) setQuantityForAllError(true);
                        else setQuantityForAllError(false);
                        setQuantityForAll(parseInt(value));
                      }}
                      sx={{
                        m: 1,
                        maxWidth: 250
                      }}
                    />
                    <Button
                      variant="contained"
                      type="submit"
                      name="applyToAll"
                      disabled={priceForAllError || quantityForAllError}
                      onClick={(e) => handleApplyToAll(e)}
                      sx={{
                        m: 1,
                        mt: 2
                      }}
                    >
                      Apply To All
                    </Button>
                  </Box>
                )}
              />
            </div>
          </Box>
        )}

        {rowErrors && (
          <span className="tooltip">{rowErrors}</span>
        )}

        {variations.length === 0 &&
          <TextField
            id="price"
            label="Price"
            type="number"
            variant="outlined"
            required
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
            }}
            value={formValues.price.value}
            error={formValues.price.error}
            helperText={formValues.price.error && formValues.price.errorMessage}
            onChange={(e) => {
              const { value } = e.target;
              setFormValues({
                ...formValues,
                price: {
                  ...formValues.price,
                  value: value,
                  parsedValue: parseFloat(value),
                  error: isNaN(parseFloat(value)) || parseFloat(value) < 0 || value.includes("e")
                }
              })
            }}
            fullWidth
            sx={{ m: 2 }}
          />
        }

        {variations.length === 0 &&
          <TextField
            id="quantity"
            label="Quantity"
            type="number"
            variant="outlined"
            required
            value={formValues.quantity.value}
            error={formValues.quantity.error}
            helperText={formValues.quantity.error && formValues.quantity.errorMessage}
            onChange={(e) => {
              const { value } = e.target;
              setFormValues({
                ...formValues,
                quantity: {
                  ...formValues.quantity,
                  value: value,
                  parsedValue: parseInt(value),
                  error: isNaN(parseInt(value)) || parseInt(value) <= 0 || value.includes("e")
                }
              })
            }}
            fullWidth
            sx={{ m: 2 }}
          />
        }

        {variations.length === 0 && (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              m: 2,
              // maxWidth: '75%' 
            }}
          >
            {(formValues.imageUrl.value && (
              <div key={formValues.imageUrl.value} className="flex flex-row w-40 h-40 mb-5">
                <AdvancedImage cldImg={cld.image(formValues.imageUrl.value)} />
                <Box>
                  <IconButton
                    type="button"
                    onClick={() => handleDeleteImage()}
                    sx={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'flex-end'
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </div>
            ))}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center'
                }}
              >
                <CloudinaryUploader
                  onSuccess={handleUploadImage}
                  caption={"UPLOAD IMAGE"}
                />
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center'
                }}
              >
                {(!formValues.imageUrl.error &&
                  <FormHelperText className="outlined-image-helper-text">
                    {formValues.imageUrl.errorMessage}
                  </FormHelperText>
                )}
                {(formValues.imageUrl.error &&
                  <FormHelperText
                    className="outlined-image-helper-text"
                    sx={{ color: 'red' }}
                  >
                    {formValues.imageUrl.errorMessage}
                  </FormHelperText>
                )}
              </Box>
            </Box>
          </Box>
        )}
      </Box>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          m: 5,
          gap: 4,
          // maxWidth: '75%' 
        }}
      >
        <Button
          variant="contained"
          type="submit"
          color="success"
        // onClick=
        >
          Submit
        </Button>
        <Button
          variant="contained"
          type="reset"
          color="error"
          onClick={handleReset}
        >
          Reset
        </Button>
      </Box>
    </Box>
  )
}

export default ProductForm

