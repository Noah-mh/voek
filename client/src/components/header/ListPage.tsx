import Product from "./Product";

interface ListPageProps {
  searchResults: Array<object>;
}

const ListPage = ({ searchResults }: ListPageProps) => {
  const results = searchResults.map((result: any) => {
    return <Product result={result} />;
  });

  const content = searchResults.length ? (
    results
  ) : (
    <div className="p-2">No results found</div>
  );

  return <main>{content}</main>;
};

export default ListPage;
