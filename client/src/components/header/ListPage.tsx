import Product from "./Product";

interface ListPageProps {
  searchResults: Array<object>;
  fnMouseClick?: () => void;
}

const ListPage = ({ searchResults, fnMouseClick }: ListPageProps) => {
  const results = searchResults.map((result: any) => {
    return <Product result={result} fnMouseClick={fnMouseClick} />;
  });

  const content = searchResults.length ? (
    results
  ) : (
    <div className="p-2">No results found</div>
  );

  return <main>{content}</main>;
};

export default ListPage;
