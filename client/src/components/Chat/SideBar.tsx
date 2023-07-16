import { useState, useEffect } from "react";
import useAxiosPrivateCustomer from "../../hooks/useAxiosPrivateCustomer";
import SideBarUser from "./SideBarUsers";

interface SideBarProps {
  userID: string;
  userType: string;
  roomID: string | undefined;
  messages: ChatMessage[];
  updateSideBar: boolean;
  setRoomID: React.Dispatch<React.SetStateAction<string | undefined>>;
  setMessages: React.Dispatch<React.SetStateAction<any[]>>;
  setOtherChatUser: React.Dispatch<React.SetStateAction<User | null>>;
  setUpdateSideBar: React.Dispatch<React.SetStateAction<boolean>>;
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

const SideBar = ({
  userID,
  userType,
  messages,
  updateSideBar,
  setRoomID,
  setMessages,
  setOtherChatUser,
  setUpdateSideBar,
}: SideBarProps) => {
  const [rooms, setRooms] = useState<Room[]>([]);

  const axiosPrivateCustomer = useAxiosPrivateCustomer();

  const getUserRooms = async () => {
    const link =
      userType === "customer"
        ? `/getCustomerRooms/${userID}`
        : `/getSellerRooms/${userID}`;

    try {
      const res = await axiosPrivateCustomer.get(link);
      setRooms(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getUserRooms();
  }, []);

  useEffect(() => {
    getUserRooms();
  }, [messages]);

  return (
    <div className="w-full overflow-y-auto">
      <div className="flex flex-col h-screen bg-gray-800 chatSidebar">
        <div className="flex justify-stretch grow mt-10">
          <div className="flex flex-col grow">
            <div className="text-white flex flex-col justify-center items-center font-medium">
              <div className="text-2xl">Welcome to</div>
              <div className="text-2xl">Voek Chat</div>
            </div>
            <div className="flex flex-col mt-10 mx-3">
              {rooms.map((room: Room) => {
                return (
                  <SideBarUser
                    key={room.roomID}
                    userID={userID}
                    userType={userType}
                    setRoomID={setRoomID}
                    room={room}
                    setMessages={setMessages}
                    setOtherChatUser={setOtherChatUser}
                    setUpdateSideBar={setUpdateSideBar}
                    updateSideBar={updateSideBar}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
