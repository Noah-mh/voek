import { FormEvent, ChangeEvent, FC, useState } from "react";
import ListPage from "../Header/ListPage";
import { Link } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

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
  const [userInput, setUserInput] = useState<string>("");
  let link = `/searchResults/${userInput}`;
  const [focus, setFocus] = useState(false);
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  const fnMouseClick = () => {
    setFocus(false);
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!focus) setFocus(true);
    if (!e.target.value) {
      setSearchResults(results);
      return;
    }

    const serachValue: string = e.target.value.toLowerCase();
    const resultsArray = results.filter((result) =>
      result.name.toLowerCase().includes(serachValue)
    );
    setUserInput(e.target.value);
    link = `/searchResults/${userInput}`;
    console.log("link", link);

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
          onBlur={(e) => {
            console.log(e.target.value);
            setFocus(false);
          }}
        />
        <Link to={link}>
          <button
            type="submit"
            className="text-white absolute right-2.5 bottom-5 bg-transparent hover:bg-transparent hover:cursor-pointer4 focus:ring-1 focus:outline-none focus:ring-softerPurple font-medium rounded-lg text-sm px-4 py-2"
          >
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              size="2xl"
              style={{ color: "#310d20" }}
            />
          </button>
        </Link>
      </form>
      {focus ? (
        <div className="absolute mt-20 w-1/3 p-2 bg-white shadow-lg rounded-bl rounded-br max-h-56 overflow-y-auto">
          <ListPage searchResults={searchResults} fnMouseClick={fnMouseClick} />
        </div>
      ) : null}
    </div>
  );
};

export default LiveSearch;
