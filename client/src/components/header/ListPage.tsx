import Product from "../header/Product";

interface ListPageProps {
  searchResults: Array<object>;
  fnMouseClick?: () => void;
}

const ListPage = ({ searchResults, fnMouseClick }: ListPageProps) => {
  const results = searchResults.map((result: any, index: number) => {
    return (
      <span key={index}>
        <Product result={result} fnMouseClick={fnMouseClick} />
      </span>
    );
  });

  const content = searchResults.length ? (
    results
  ) : (
    <div className="p-2">No results found</div>
  );

  return <main>{content}</main>;
};

export default ListPage;
