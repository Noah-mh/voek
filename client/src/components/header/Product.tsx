interface ResultProps {
  result: {
    name: string;
  };
}

const Product = ({ result }: ResultProps) => {
  return (
    <div className="hover:cursor-pointer hover:bg-greyAccent hover:bg-opacity-10 p-2">
      {result.name}
    </div>
  );
};

export default Product;
