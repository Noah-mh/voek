import React, { useEffect, useState, useContext } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CustomerContext from "../../context/CustomerProvider";
import moment from "moment";
import tz from "moment-timezone";
import useAxiosPrivateCustomer from "../../hooks/useAxiosPrivateCustomer";

import Button from "@mui/material/Button";

const timezone = tz.tz.guess();
const currentDate = moment().format("YYYY-MM-DD");
import DayCard from "./DayCard";

import "./css/DailyCoins.css";
const DailyCoin: React.FC = () => {
  const { customer } = useContext(CustomerContext);
  const customer_id = customer.customer_id;
  const axiosPrivateCustomer = useAxiosPrivateCustomer();

  const [alreadyCheckedIn, setAlreadyCheckedIn] = useState<boolean>(false);
  const [currentDayStreak, setCurrentDayStreak] = useState<number>(0);
  const [newCheckIn, setNewCheckIn] = useState<boolean>(false);

  const getCurrentDayStreak = async () => {
    try {
      const res = await axiosPrivateCustomer.get(
        `/customer/checkIn/getCheckIn/${customer_id}`
      );
      console.log(res.data);
      console.log("coins date");
      if (res.data.length === 0) {
        setCurrentDayStreak(0);
        setNewCheckIn(true);
      } else {
        if (res.data[0].daysSinceLastCheckIn < 1) {
          setAlreadyCheckedIn(true);
        }
        setCurrentDayStreak(res.data[0].current_day_streak);
      }
    } catch (err: any) {
      console.log(err);
    }
  };

  const checkIn = async () => {
    if (alreadyCheckedIn) {
      toast.error("You have already checked in :(", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } else {
      try {
        if (newCheckIn) {
          await axiosPrivateCustomer.post(`/customer/checkIn/newCheckIn`, {
            customer_id: customer_id,
          });
        } else {
          await axiosPrivateCustomer.put(`/customer/checkIn/updateCheckIn`, {
            customer_id: customer_id,
          });
        }

        toast.success("You have checked in for today!", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      } catch (err: any) {
        console.log(err);
        toast.error("Unable to check in :(", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    }
    getCurrentDayStreak();
  };

  useEffect(() => {
    getCurrentDayStreak();
  }, []);

  return (
    <div className="entireWrapper flex align-middle items-center bg-darkerPurple ">
      <div className="container bg-white rounded p-9">
        {currentDayStreak === 0 ? (
          <div className="text-center text-md">
            You currently don't have a streak.
          </div>
        ) : (
          <div className="text-center text-xs font-bold font-Barlow ">
            You currently are on a{" "}
            <span className="text-purpleAccent">{currentDayStreak} </span>day
            streak.
          </div>
        )}

        <div className="dayCards p-10 flex justify-center">
          {Array.from({ length: 7 }).map((_, index) => {
            return (
              <DayCard
                key={index}
                number={index + 1}
                checked={index < currentDayStreak}
              />
            );
          })}
        </div>

        <button
          className="text-center bg-purpleAccent rounded px-2 py-1 font-bold w-full text-xs text-white font-Barlow disabled:opacity-50"
          onClick={checkIn}
        >
          {alreadyCheckedIn
            ? "Already Checked In"
            : "Check in now to claim coins!"}
        </button>
      </div>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default DailyCoin;
