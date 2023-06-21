import { useLocation } from 'react-router-dom';
import { axiosPrivateSeller } from '../../api/axios.tsx';
import ProductForm from "./ProductForm.tsx";

interface SubmitVariationsInterface {
  var1: string; 
  var2: string;
  price: number;
  quantity: number;
  imageUrl: string[];
  sku?: string;
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

const EditProduct = () => {

  let { state } = useLocation();
  
  let product: Product = state;

  const originalProduct: Product = JSON.parse(JSON.stringify(Object.values(product)[0]));

  const handleSubmit = async (e: SubmitInterface) => {
    let columns: string[] = [];
    let values: Array<string | number> = [e.name, e.description, e.categoryId];

    let imageURLMap: string[][] = [];
    let deleteImageURLMap: string[][] = [];
    
    if (e.variations.length === 0) {
      const newURLs = e.imageUrl.filter((url: string) =>
        !originalProduct?.imageUrl.includes(url)
      );
      imageURLMap.push(newURLs);

      const missingURLs = originalProduct.imageUrl.filter((url: string) =>
        !e.imageUrl.includes(url)
      );
      deleteImageURLMap.push(missingURLs);

      e.variations = [{
        var1: "",
        var2: "",
        price: e.price,
        quantity: e.quantity,
        imageUrl: e.imageUrl,
        sku: e.sku,
      }]
    } else {
      e.variations.forEach((variation: SubmitVariationsInterface) => {
        let existingVariation = originalProduct.subRows.find((existingVar: any) => {
            return existingVar.variation1 === variation.var1 && (variation.var2 ? existingVar.variation2 === variation.var2 : true);
          }
        );

        if (existingVariation) {
          variation.sku = existingVariation.sku

          const newURLs = variation.imageUrl.filter((url: string) =>
            !existingVariation?.imageUrl.includes(url)
          );
          imageURLMap.push(newURLs);

          const missingURLs = existingVariation.imageUrl.filter((url: string) =>
            !variation.imageUrl.includes(url)
          );
          deleteImageURLMap.push(missingURLs);
        } else {
          variation.sku = "";
          imageURLMap.push(variation.imageUrl);
          deleteImageURLMap.push([]);
        }
      });    
    }

    const editProduct = async () => {
      try {
        await axiosPrivateSeller.post(
          `/editProduct/${originalProduct.productId}`,
          {
            columns: columns,
            values: values,
            variations: e.variations,
            imageURLMap: imageURLMap,
            deleteImageURLMap: deleteImageURLMap
          }
        )
      } catch (err) {
        console.log(err);
      }
    }

    editProduct();
  }

  return (
    <div className="flex flex-row">

      <div className="flex flex-col w-max">
        <h1 className="text-xl font-medium mb-2">Edit Product</h1>

        <ProductForm 
          product={product}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};


export default EditProduct