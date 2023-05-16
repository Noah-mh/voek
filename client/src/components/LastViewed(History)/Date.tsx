import React, { useEffect, useState } from "react";
import moment from "moment";
import "./css/Date.css";

import { motion } from "framer-motion";

interface DateProps {
  date: string;
  onSelectDate: (date: string) => void;
  selected: string;
  today: string;
}

export const Date: React.FC<DateProps> = ({
  date,
  onSelectDate,
  selected,
  today,
}) => {
  const day =
    moment(date).format("YYYY-MM-DD") === moment().format("YYYY-MM-DD")
      ? "Today"
      : moment(date).format("ddd");
  const dayNumber = moment(date).format("D");
  const fullDate = moment(date).format("YYYY-MM-DD");

  useEffect(() => {
    onSelectDate(moment(today).format("YYYY-MM-DD"));
  }, []);

  return (
    <motion.div
      className="dateCardStyle hover:cursor-pointer focus:bg-softerPurple"
      animate={{ rotate: [0, 3, 0] }}
      whileHover={{
        scale: 1.2,
        transition: { duration: 1 },
      }}
      whileTap={{ scale: 0.9 }}
      onClick={() => {
        onSelectDate(fullDate);
      }}
    >
      <div className="dateBigStyle">{day}</div>
      <div style={{ height: 10 }} />
      <div className="dateMediumStyle">{dayNumber}</div>
    </motion.div>
  );
};
