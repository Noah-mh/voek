import { useEffect, useState } from "react";
import tz from "moment-timezone";
import useAxiosPrivateCustomer from "../../hooks/useAxiosPrivateCustomer";
import { AdvancedImage } from "@cloudinary/react";
import { cld } from "../../Cloudinary/Cloudinary";
import { get } from "http";

interface SideBarUserProps {
  userID: string;
  userType: string;
  setRoomID: React.Dispatch<React.SetStateAction<string | undefined>>;
  room: Room;
  setMessages: React.Dispatch<React.SetStateAction<any[]>>;
  setOtherChatUser: React.Dispatch<React.SetStateAction<User | null>>;
  setUpdateSideBar: React.Dispatch<React.SetStateAction<boolean>>;
  updateSideBar: boolean;
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

interface ChatMessage {
  cmID?: string;
  roomID: string;
  senderID: string;
  senderRole: string;
  text: string;
  image: string;
  status?: string;
  dateCreated?: string;
}

const SideBarUser = ({
  userID,
  userType,
  setRoomID,
  room,
  setMessages,
  setOtherChatUser,
  setUpdateSideBar,
  updateSideBar,
}: SideBarUserProps) => {
  const [otherUser, setOtherUser] = useState<User | null>(null);
  const [unreadMessages, setUnreadMessages] = useState<Array<ChatMessage>>([]);
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
      getUserUnreadMessages(res.data.userID);
    } catch (err) {
      console.log(err);
    }
  };

  const joinRoom = () => {
    if (userID !== "" && room.roomID != null) {
      // socket.emit("join_room", room.roomID);
      setRoomID(room.roomID);
    }
  };

  const getMessages = async () => {
    try {
      const res = await axiosPrivateCustomer.get(
        `/getRoomMessages?roomID=${room.roomID}&timezone=${timezone}`
      );
      setMessages(res.data);
      await axiosPrivateCustomer.put(`/updateMessagesStatus`, {
        roomID: room.roomID,
        senderID: otherUser?.userID,
      });
      getUserUnreadMessages(otherUser?.userID);
    } catch (err) {
      console.log(err);
    }
  };

  const getUserUnreadMessages = async (senderID: string | undefined) => {
    try {
      const res = await axiosPrivateCustomer.get(
        `/getUserUnreadMessages?userID=${userID}&roomID=${room.roomID}&senderID=${senderID}`
      );
      console.log("res.data unread messages: ", res.data);
      setUnreadMessages(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getOtherUser();
  }, []);

  useEffect(() => {
    if (updateSideBar) {
      getOtherUser();
    }
    setUpdateSideBar(false);
  }, [updateSideBar]);

  return (
    <>
      <div
        className="sideBarUser flex justify-between items-center space-x-4 hover:cursor-pointer p-5 rounded-md"
        onClick={() => {
          joinRoom();
          getMessages();
          setOtherChatUser(otherUser);
        }}
      >
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0">
            <AdvancedImage
              className="w-12 h-12 rounded-full bg-slate-500"
              cldImg={cld.image(otherUser?.image)}
              alt="User's profile picture"
            />
          </div>
          <div className="flex-1 min-w-0">
            {unreadMessages != null && unreadMessages.length > 0 ? (
              <p className="text-sm font-medium text-gray-100 truncate tracking-wide">
                {otherUser?.username}
              </p>
            ) : (
              <p className="text-sm font-medium text-[#b0b3b8] truncate tracking-wide">
                {otherUser?.username}
              </p>
            )}
          </div>
        </div>
        {unreadMessages != null && unreadMessages.length > 0 ? (
          <div className="badge">
            <h1 className="inline-flex items-center justify-center w-5 h-5 ml-2 text-xs text-gray-300 bg-softerPurple rounded-full">
              {unreadMessages.length}
            </h1>
          </div>
        ) : null}
      </div>
    </>
  );
};

export default SideBarUser;
