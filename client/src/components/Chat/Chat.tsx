import { useEffect, useState, useMemo, useContext } from "react";
import io from "socket.io-client";
import ScrollToBottom from "react-scroll-to-bottom";
import CustomerContext from "../../context/CustomerProvider";
import SellerContext from "../../context/SellerProvider.tsx";
import SideBar from "./SideBar.tsx";
import useAxiosPrivateCustomer from "../../hooks/useAxiosPrivateCustomer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import "./css/Chat.css";

const socket = io(
  import.meta.env.VITE_APP_BACKEND_BASE_URL || "http://localhost:3500",
  { transports: ["websocket"] }
);

interface ChatProps {
  userType: string;
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

interface User {
  userID: string;
  username: string;
  password: string;
  email: string;
  dateCreated: string;
  image: string;
}

const Chat = ({ userType }: ChatProps) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Array<ChatMessage>>([]);
  const [roomID, setRoomID] = useState<string | undefined>();
  const [otherUser, setOtherUser] = useState<User | null>(null);

  const { customer } = useContext(CustomerContext);
  const { seller } = useContext(SellerContext);
  const userID =
    userType === "customer" ? customer.customer_id : seller.seller_id;
  const axiosPrivateCustomer = useAxiosPrivateCustomer();

  const sendMessage = async () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
    const day = currentDate.getDate().toString().padStart(2, "0");
    const hours = currentDate.getHours().toString().padStart(2, "0");
    const minutes = currentDate.getMinutes().toString().padStart(2, "0");
    const seconds = currentDate.getSeconds().toString().padStart(2, "0");

    const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

    console.log("formattedDate: ", formattedDateTime);

    if (message !== "") {
      const messageContent: ChatMessage = {
        roomID: roomID!,
        text: message,
        image: "",
        senderID: userID,
        senderRole: userType,
        dateCreated: formattedDateTime,
      };
      await socket.emit("send_message", messageContent);
      await axiosPrivateCustomer.post("/createMessage", messageContent);
      setMessages([...messages, messageContent]);
      setMessage("");
    }
  };

  const convertDate = (date: string) => {
    console.log("date in convertDate: ", date);
    const dateObj = new Date(date);
    let hours = dateObj.getHours();
    const minutes = dateObj.getMinutes().toString().padStart(2, "0");
    console.log("minutes: ", minutes);
    console.log("typeof minutes: ", typeof minutes);
    const ampm = hours >= 12 ? "pm" : "am";

    // Convert 24-hour format to 12-hour format
    hours = hours % 12;
    hours = hours || 12; // Assign 12 if the hour value is 0

    const formattedTime = hours + ":" + minutes + " " + ampm;
    console.log("formattedTime in convertDate: ", formattedTime);
    return formattedTime;
  };

  const receiveMessageCallback = useMemo(() => {
    return (data: ChatMessage) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    };
  }, []);

  useEffect(() => {
    socket.on("receive_message", receiveMessageCallback);

    return () => {
      socket.off("receive_message", receiveMessageCallback);
    };
  }, [socket, receiveMessageCallback]);

  return (
    <div className="chatContainer flex flex-col md:flex-row overflow-hidden">
      <div className="hidden md:block md:w-1/4">
        <SideBar
          socket={socket}
          userID={userID}
          userType={userType}
          roomID={roomID}
          setRoomID={setRoomID}
          setMessages={setMessages}
          setOtherChatUser={setOtherUser}
        />
      </div>
      <div className="w-full md:w-3/4 flex">
        <div className="chatColumn flex justify-center items-center">
          {userID == null || roomID == null ? (
            <div className="chat-window noChatChosenBody bg-gray-50 flex justify-center items-center text-gray-300">
              Pick someone to start chatting!
            </div>
          ) : (
            <div className="chat-window">
              <div className="chat-header">
                <p className="pl-4 tracking-wide">{otherUser?.username}</p>
              </div>
              <div className="chat-body">
                <ScrollToBottom className="message-container">
                  {roomID != null &&
                    messages
                      .filter((data) => data.roomID === roomID)
                      .map((messageContent, index) => {
                        return (
                          <div className="flex flex-col" key={index}>
                            <div
                              className="message p-3"
                              id={
                                userID === messageContent.senderID
                                  ? "you"
                                  : "other"
                              }
                            >
                              <div>
                                <div className="message-content rounded-lg">
                                  {messageContent.text}
                                </div>
                                <div className="message-meta">
                                  <div className="message-sender text-gray-50 mr-2">
                                    {userID === messageContent.senderID
                                      ? ""
                                      : otherUser?.username}
                                  </div>
                                  <div className="message-date text-gray-50">
                                    {convertDate(messageContent.dateCreated!)}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                </ScrollToBottom>
              </div>
              <form
                className="chat-footer"
                onSubmit={(e) => {
                  e.preventDefault();
                  sendMessage();
                }}
              >
                <input
                  type="text"
                  className="text-gray-300"
                  placeholder="Enter your message..."
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                  }}
                />
                <button type="submit">
                  <FontAwesomeIcon icon={faPaperPlane} size="sm" />
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
