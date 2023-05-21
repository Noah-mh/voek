import React, { useState, useEffect } from 'react'
import SellerSidebar from "../SellerSidebar/SellerSidebar.js";
import useSeller from "../../hooks/useSeller.js";

import useAxiosPrivateSeller from "../../hooks/useAxiosPrivateSeller.js";

interface Category {
  category_id: number;
  name: string;
}

const CreateProduct = () => {

  const axiosPrivateSeller = useAxiosPrivateSeller();

  const { seller } = useSeller();
  const sellerId = seller.seller_id;

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
      <SellerSidebar />

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