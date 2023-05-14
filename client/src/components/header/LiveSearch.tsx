import { FormEvent, ChangeEvent, FC, useState } from "react";
import ListPage from "./ListPage";

interface LiveSearchProps {
  results: any[];
  setSearchResults(results: any[]): void;
  searchResults: any[];
}

const LiveSearch: FC<LiveSearchProps> = ({
  results,
  setSearchResults,
  searchResults,
}) => {
  const [focus, setFocus] = useState(false);
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.value) {
      setSearchResults(results);
      return;
    }

    const serachValue: string = e.target.value.toLowerCase();
    const resultsArray = results.filter((result) =>
      result.name.toLowerCase().includes(serachValue)
    );

    console.log("resultsArray", resultsArray);
    setSearchResults(resultsArray);
  };

  return (
    <div className="flex justify-center items-start">
      <form className="relative" onSubmit={handleSubmit}>
        <input
          type="text"
          className="w-[444px] h-12 px-5 py-3 text-lg rounded-full border-2 border-purpleAccent focus:border-l-purpleAccent outline-none transition text-greyAccent placeholder:text-gray-300"
          placeholder="Search for your product!"
          onChange={handleSearchChange}
          onFocus={() => {
            setFocus(true);
          }}
          onBlur={() => {
            setFocus(false);
          }}
        />
      </form>
      {focus ? (
        <div className="absolute mt-20 w-1/3 p-2 bg-white shadow-lg rounded-bl rounded-br max-h-56 overflow-y-auto">
          <ListPage searchResults={searchResults} />
        </div>
      ) : null}
    </div>
  );
};

export default LiveSearch;
