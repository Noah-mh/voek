import React, { useState, useEffect, useRef } from "react";
import moment from "moment";
import { Date as DateComponent } from "./Date";
import "react-calendar/dist/Calendar.css";
import "./css/Calendar.css";

import { motion } from "framer-motion";

interface CalendarProps {
  onSelectDate: (date: string) => void;
  selected: string;
}

const Calendar: React.FC<CalendarProps> = ({ onSelectDate, selected }) => {
  const [dates, setDates] = useState<string[]>([]);
  const [currentMonth, setCurrentMonth] = useState<string | undefined>();
  const ref = useRef<HTMLDivElement>(null);

  const getDates = () => {
    let _dates: string[] = [];
    for (let i = 30; i >= 0; i--) {
      const date = moment()
        .add(i * -1, "days")
        .format("YYYY-MM-DD");
      _dates.push(date);
    }
    setDates(_dates);
  };

  const scrollToBottom = () => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  };

  useEffect(() => {
    getDates();
    setTimeout(() => {
      scrollToBottom();
    }, 1);
  }, []);

  useEffect(() => {
    const month = moment(selected).format("MMMM");
    setCurrentMonth(month);
  }, [selected]);

  return (
    <>
      <div className="flex flex-col mt-2 calendarCentered">
        <h1 className="calendarTitle">
          Last Viewed <span className="text-purpleAccent">(Past 20 Days)</span>
        </h1>
        <motion.h2
          className="calendarTitle text-softerPurple"
          animate={{ rotate: [0, 20, 20, 0] }}
          transition={{ type: "tween", duration: 1 }}
        >
          {currentMonth}
        </motion.h2>
      </div>
      <div className="calendarDateSection">
        <div className="calendarScroll scroll-smooth">
          {dates.map((date, index) =>
            date === dates[dates.length - 1] ? (
              <section ref={ref} className="lastDate">
                <DateComponent
                  key={index}
                  date={date}
                  onSelectDate={onSelectDate}
                  selected={selected}
                  today={dates[dates.length - 1]}
                />
              </section>
            ) : (
              <DateComponent
                key={index}
                date={date}
                onSelectDate={onSelectDate}
                selected={selected}
                today={dates[dates.length - 1]}
              />
            )
          )}
        </div>
      </div>
    </>
  );
};

export default Calendar;
