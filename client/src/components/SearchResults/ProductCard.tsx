import { macbook } from "./images";

interface ProductCardProps {
  product: {
    name: string;
    price: number;
    description: string;
    image: string;
  };
}

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <div>
      <div className="w-full max-w-sm bg-gray-50 border rounded-lg shadow-xl p-2 m-2">
        <a href="#">
          <img className="p-8 rounded-t-lg" src={macbook} alt="product image" />
        </a>
        <div className="px-5 pb-5">
          <a href="#">
            <h5 className="text-xl font-semibold tracking-tight text-greyAccent">
              {product.name}
            </h5>
          </a>
          <div className="flex items-center mt-2.5 mb-5">
            <span className="bg-softerPurple text-lighterGreyAccent text-xs font-semibold mr-2 px-2.5 py-0.5 rounded ml-3">
              5.0
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-3xl font-bold text-greyAccent">
              ${product.price}
            </span>
            <a
              href="#"
              className="text-white bg-purpleAccent hover:bg-softerPurple focus:ring-4 focus:outline-none focus:ring-softerPurple font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
              Add to cart
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
