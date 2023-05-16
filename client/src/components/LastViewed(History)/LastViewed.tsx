import { useState } from "react";
import Calendar from "./Calendar";
import HistoryProducts from "./HistoryProducts";

const LastViewed = () => {
  const [selectedDate, setSelectedDate] = useState<string>("");

  return (
    <>
      <Calendar onSelectDate={setSelectedDate} selected={selectedDate} />
      <HistoryProducts selected={selectedDate} />
    </>
  );
};

export default LastViewed;
