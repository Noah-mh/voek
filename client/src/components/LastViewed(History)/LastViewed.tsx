import { useState } from "react";
import Calendar from "./Calendar";

const LastViewed = () => {
  const [selectedDate, setSelectedDate] = useState<string>("");

  return (
    <>
      <Calendar onSelectDate={setSelectedDate} selected={selectedDate} />
    </>
  );
};

export default LastViewed;
