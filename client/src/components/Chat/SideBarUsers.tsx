import { useEffect, useState } from "react";
import tz from "moment-timezone";
import useAxiosPrivateCustomer from "../../hooks/useAxiosPrivateCustomer";

interface SideBarUserProps {
  userID: string;
  userType: string;
  socket: any;
  setRoomID: React.Dispatch<React.SetStateAction<string | undefined>>;
  room: Room;
  setMessages: React.Dispatch<React.SetStateAction<any[]>>;
  setOtherChatUser: React.Dispatch<React.SetStateAction<User | null>>;
}

interface Room {
  roomID: string;
  customerID: string;
  sellerID: string;
  dateCreated: Date;
}

interface User {
  userID: string;
  username: string;
  password: string;
  email: string;
  dateCreated: string;
  image: string;
}

const SideBarUser = ({
  userID,
  userType,
  socket,
  setRoomID,
  room,
  setMessages,
  setOtherChatUser,
}: SideBarUserProps) => {
  const [otherUser, setOtherUser] = useState<User | null>(null);
  const timezone = tz.tz.guess();

  const axiosPrivateCustomer = useAxiosPrivateCustomer();

  const getOtherUser = async () => {
    const otherUserIDLink =
      userType === "customer"
        ? `/getSeller/${room.sellerID}`
        : `/getCustomer/${room.customerID}`;

    try {
      const res = await axiosPrivateCustomer.get(otherUserIDLink);
      setOtherUser(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const joinRoom = () => {
    if (userID !== "" && room.roomID != null) {
      socket.emit("join_room", room.roomID);
      setRoomID(room.roomID);
    }
  };

  const getMessages = async () => {
    try {
      const res = await axiosPrivateCustomer.get(
        `/getRoomMessages?roomID=${room.roomID}&timezone=${timezone}`
      );
      console.log("res.data messages: ", res.data);
      setMessages(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getOtherUser();
  }, []);

  return (
    <>
      <div
        className="sideBarUser flex items-center space-x-4 hover:cursor-pointer p-5 rounded-md"
        onClick={() => {
          joinRoom();
          getMessages();
          setOtherChatUser(otherUser);
        }}
      >
        <div className="flex-shrink-0">
          <img
            className="w-12 h-12 rounded-full bg-slate-500"
            src=""
            alt="Neil image"
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white truncate">
            {otherUser?.username}
          </p>
          {/* <p className="text-sm text-gray-300 truncate">{user.age}</p> */}
        </div>
      </div>
    </>
  );
};

export default SideBarUser;
