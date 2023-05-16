import React, { useState, useEffect } from "react";
import moment from "moment";
import { Date as DateComponent } from "./Date";
import { Calendar as ReactCalendar } from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./css/Calendar.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";

import { motion } from "framer-motion";

interface CalendarProps {
  onSelectDate: (date: string) => void;
  selected: string;
}

const Calendar: React.FC<CalendarProps> = ({ onSelectDate, selected }) => {
  const [dates, setDates] = useState<string[]>([]);
  const [currentMonth, setCurrentMonth] = useState<string | undefined>();
  const [openDropDownCalendar, setOpenDropDownCalendar] = useState(false);

  const handleDateChange = (date: Date) => {
    onSelectDate(moment(date).format("YYYY-MM-DD"));
  };

  const getDates = () => {
    let _dates: string[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = moment()
        .add(i * -1, "days")
        .format("YYYY-MM-DD");
      _dates.push(date);
    }
    setDates(_dates);
    console.log(dates);
  };

  useEffect(() => {
    getDates();
  }, []);

  useEffect(() => {
    const month = moment(selected).format("MMMM");
    setCurrentMonth(month);
  }, [selected]);

  return (
    <>
      <div className="calendarCentered">
        <motion.h2
          className=".calendarTitle"
          animate={{ rotate: [0, 20, 20, 0] }}
          transition={{ type: "tween", duration: 2 }}
        >
          {currentMonth}
        </motion.h2>
      </div>
      <div className=".calendarDateSection">
        <div className="calendarScroll">
          {dates.map((date, index) => (
            <DateComponent
              key={index}
              date={date}
              onSelectDate={onSelectDate}
              selected={selected}
              today={dates[dates.length - 1]}
            />
          ))}
        </div>
      </div>

      <div className="flex justify-center items-center">
        <FontAwesomeIcon
          icon={faArrowDown}
          beat
          size="xl"
          style={{ color: "#dea1e3" }}
          onClick={() => {
            setOpenDropDownCalendar(!openDropDownCalendar);
          }}
          className="hover:cursor-pointer"
        />
      </div>

      {/* {openDropDownCalendar && (
        <>
          <div className="flex flex-col justify-center items-center dropDownCalendar mt-1">
            <div className="dropDownCalendarSquare"></div>
            <div className="flex">
              <ReactCalendar
                value={selected ? new Date(selected) : undefined}
                onChange={handleDateChange}
                className="react-calendar"
                calendarType="ISO 8601"
                showNeighboringMonth={false}
                onClickMonth={null}
                onClickYear={null}
                minDetail="year"
              />
            </div>
          </div>
        </>
      )} */}
    </>
  );
};

export default Calendar;
