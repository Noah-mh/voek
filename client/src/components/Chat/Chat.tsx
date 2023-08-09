import {
  useEffect,
  useState,
  useMemo,
  useContext,
  ChangeEvent,
  useCallback,
  useRef,
} from "react";
import io from "socket.io-client";
import ScrollToBottom from "react-scroll-to-bottom";
import CustomerContext from "../../context/CustomerProvider";
import SellerContext from "../../context/SellerProvider.tsx";
import SideBar from "./SideBar.tsx";
import axios from "axios";
import useAxiosPrivateCustomer from "../../hooks/useAxiosPrivateCustomer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faPaperclip } from "@fortawesome/free-solid-svg-icons";
import "./css/Chat.css";
import { AdvancedImage } from "@cloudinary/react";
import { cld } from "../../Cloudinary/Cloudinary";
import { Link } from "react-router-dom";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { cloudName, chatPreset } from "../../Cloudinary/Cloudinary";
import { RiDeleteBin5Fill } from "react-icons/ri";
import ImagePopUpModel from "../../Cloudinary/ImagePopUpModel";
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
  const [socket, setSocket] = useState<any>(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Array<ChatMessage>>([]);
  const [roomID, setRoomID] = useState<string | undefined>();
  const [otherUser, setOtherUser] = useState<User | null>(null);
  const [updateSideBar, setUpdateSideBar] = useState(false);
  const { customer } = useContext(CustomerContext);
  const { seller } = useContext(SellerContext);
  const userID =
    userType === "customer" ? customer.customer_id : seller.seller_id;
  const axiosPrivateCustomer = useAxiosPrivateCustomer();

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploaded, setIsUploaded] = useState<boolean[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [popUpImage, setPopUpImage] = useState<string>("");

  const handleOpenModal = (image_url: string) => {
    setPopUpImage(image_url);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleUpload = useCallback(async () => {
    if (selectedFiles.length > 0) {
      const responses = await Promise.all(
        selectedFiles.map((file) => {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("upload_preset", chatPreset);

          return axios.post(
            `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
            formData
          );
        })
      );

      setPreviewUrls(responses.map((response) => response.data.public_id));
      setIsUploaded(new Array(selectedFiles.length).fill(true));
      return responses;
    }
  }, [selectedFiles]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFilesArray = Array.from(event.target.files);

      // Merge the new files with the existing ones
      const mergedFiles = [...selectedFiles, ...newFilesArray];
      setSelectedFiles(mergedFiles);

      console.log("newFilesArray: ", newFilesArray);

      const newUrls = newFilesArray.map((file) => URL.createObjectURL(file));
      const mergedUrls = [...previewUrls, ...newUrls];
      setPreviewUrls(mergedUrls);

      const mergedUploadStatus = [
        ...isUploaded,
        ...new Array(newFilesArray.length).fill(false),
      ];
      setIsUploaded(mergedUploadStatus);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } else {
      setSelectedFiles([]);
      setPreviewUrls([]);
      setIsUploaded([]);
    }
  };

  const handleDeleteImage = (deleteIndex: number) => {
    // Update previewUrls
    const newPreviewUrls = previewUrls.filter(
      (_, index) => index !== deleteIndex
    );
    setPreviewUrls(newPreviewUrls);

    // Update selectedFiles
    const newSelectedFiles = selectedFiles.filter(
      (_, index) => index !== deleteIndex
    );
    setSelectedFiles(newSelectedFiles);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const sendMessage = async () => {
    setIsSending(true); // Start sending

    try {
      const currentDate = new Date();
      const formattedDateTime = currentDate.toISOString().split('.')[0].replace('T', ' ');

      if (selectedFiles.length > 0) {
        console.log("selectedFiles: ", selectedFiles);
        const responses = await handleUpload();
        if (responses) {
          const sendImageMessage = async (response: any) => {
            const messageContent: ChatMessage = {
              roomID: roomID!,
              text: "",
              image: response.data.public_id,
              senderID: userID,
              senderRole: userType,
              dateCreated: formattedDateTime,
            };

            await socket.emit("send_message", messageContent);
            await axiosPrivateCustomer.post("/createMessage", messageContent);
            setMessages((prevMessages) => [...prevMessages, messageContent]);
          };

          const promises = responses.map((response) =>
            sendImageMessage(response)
          );
          await Promise.all(promises);

          setSelectedFiles([]);
          setPreviewUrls([]);
          setIsUploaded([]);
        }
      }

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
        setMessages((prevMessages) => [...prevMessages, messageContent]);
        setMessage("");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsSending(false); // Finished sending, whether successful or not
    }
  };

  const convertDate = (date: string) => {
    const dateObj = new Date(date);
    let hours = dateObj.getHours();
    const minutes = dateObj.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "pm" : "am";

    hours = hours % 12;
    hours = hours || 12;

    const formattedTime = hours + ":" + minutes + " " + ampm;
    return formattedTime;
  };

  const addEmoji = (e: any) => {
    let emoji = e.native;
    setMessage(message + emoji);
  };

  const receiveMessageCallback = useMemo(() => {
    return (data: ChatMessage) => {
      console.log("data in receiveMessageCallback: ", data);
      if (data.roomID === roomID) {
        console.log("same room: ", data.roomID === roomID, "roomID: ", roomID);
        setMessages((prevMessages) => [...prevMessages, data]);
      } else {
        setUpdateSideBar(true);
      }
    };
  }, [roomID]);

  const receiveBroadcastCallback = useMemo(() => {
    return async (data: ChatMessage) => {
      if (userType === "seller") {
        const sellerIsInThatRoom: any = await axiosPrivateCustomer.get(
          `/checkWhetherSellerIsInRoom?roomID=${data.roomID}&sellerID=${userID}`
        );
        console.log("data in receiveBroadcastCallback: ", data);
        console.log("sellerIsInThatRoom: ", sellerIsInThatRoom);
        if (sellerIsInThatRoom.status === 200) {
          console.log("seller is in that room");
          setUpdateSideBar(true);
          socket.emit("join_room", data.roomID);
        }
      }
    };
  }, [socket]);

  useEffect(() => {
    const socket = io(
      import.meta.env.VITE_APP_BACKEND_BASE_URL || "http://localhost:3500",
      {
        transports: ["websocket"],
        query: {
          userID: userID,
          userType: userType,
        },
      }
    );
    setSocket(socket);
    return () => {
      socket.close();
    };
  }, [setSocket]);

  useEffect(() => {
    if (socket == null) return;
    socket.on("receive_message", receiveMessageCallback);

    return () => {
      socket.off("receive_message", receiveMessageCallback);
    };
  }, [socket, receiveMessageCallback]);

  useEffect(() => {
    if (socket == null) return;
    socket.on("broadcast_message", receiveBroadcastCallback);

    return () => {
      socket.off("broadcast_message", receiveBroadcastCallback);
    };
  }, [socket, receiveBroadcastCallback]);

  return (
    <div className="chatContainer flex grow flex-col xl:flex-row overflow-hidden">
      <div className="hidden xl:flex xl:w-1/4">
        <SideBar
          userID={userID}
          userType={userType}
          roomID={roomID}
          messages={messages}
          updateSideBar={updateSideBar}
          setRoomID={setRoomID}
          setMessages={setMessages}
          setOtherChatUser={setOtherUser}
          setUpdateSideBar={setUpdateSideBar}
        />
      </div>
      <div className="w-full xl:w-3/4 flex grow">
        <div className="chatColumn flex flex-col justify-center items-start grow">
          {userID == null || roomID == null ? (
            <div className="chat-window noChatChosenBody bg-gray-50 flex justify-center items-center text-gray-300 grow w-full">
              <div className="chat-body flex justify-center items-center">
                Pick someone to start chatting!
              </div>
            </div>
          ) : (
            <div
              className="chat-window flex flex-col grow w-full"
              onClick={async () => {
                await axiosPrivateCustomer.put(`/updateMessagesStatus`, {
                  roomID: roomID,
                  senderID: otherUser?.userID,
                });
              }}
            >
              {userType === "customer" ? (
                <Link
                  to={`/customerSellerProfile/${otherUser?.userID}`}
                  className="chat-header flex pl-4 space-x-2 items-center hover:cursor-pointer"
                >
                  <AdvancedImage
                    className="w-8 h-8 rounded-full bg-slate-500"
                    cldImg={cld.image(otherUser?.image)}
                    alt="User's profile picture"
                  />
                  <p className="tracking-wide">{otherUser?.username}</p>
                </Link>
              ) : (
                <div className="chat-header flex pl-4 space-x-2 items-center hover:cursor-default">
                  <AdvancedImage
                    className="w-8 h-8 rounded-full bg-slate-500 hover:cursor-default"
                    cldImg={cld.image(otherUser?.image)}
                    alt="User's profile picture"
                  />
                  <p className="tracking-wide">{otherUser?.username}</p>
                </div>
              )}
              <div className="chat-body flex grow">
                <ScrollToBottom className="message-container">
                  {roomID != null && messages.length > 0 ? (
                    messages
                      .filter((data) => data.roomID === roomID)
                      .map((messageContent, index) => {
                        return (
                          <div className="flex flex-col" key={index}>
                            <div
                              className="message p-3"
                              id={
                                userID === messageContent.senderID &&
                                  userType === messageContent.senderRole
                                  ? "you"
                                  : "other"
                              }
                            >
                              <div>
                                {messageContent.image ? (
                                  <button onClick={() => {
                                    handleOpenModal(messageContent.image)
                                  }}>
                                    <div className="message-content-image rounded-lg">
                                      <section className="my-1">
                                        <AdvancedImage
                                          cldImg={cld.image(messageContent.image)}
                                          alt="Uploaded image"
                                        />
                                      </section>
                                    </div></button>
                                ) : (
                                  <div className="message-content rounded-lg">
                                    {
                                      messageContent.text && (
                                        <div>{messageContent.text}</div>
                                      )
                                    }
                                  </div>
                                )}
                                <div className="message-meta">
                                  <div className="message-sender text-gray-50 mr-2">
                                    {userID === messageContent.senderID &&
                                      userType === messageContent.senderRole
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
                      })
                  ) : (
                    <div></div>
                  )}
                </ScrollToBottom>
              </div>
              <ImagePopUpModel isOpen={isModalOpen} onClose={handleCloseModal} image_url={popUpImage} />
              {selectedFiles &&
                selectedFiles.length > 0 &&
                previewUrls &&
                previewUrls.length === selectedFiles.length && (
                  <div className="relative border-2 border border-[#3a3b3c] flex fixed w-auto bg-[#242526] p-2 rounded-lg">
                    <div className="flex justify-start">
                      {previewUrls.map((url, index) => (
                        <div key={index} className="relative mr-4">
                          <img
                            src={url}
                            alt="Preview"
                            className="w-40 h-40 object-cover rounded"
                          />
                          <button
                            onClick={() => handleDeleteImage(index)}
                            className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-1"
                            style={{ transform: "translate(50%, -50%)" }}
                          >
                            <RiDeleteBin5Fill />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              <form
                className="chat-footer"
                onSubmit={(e) => {
                  e.preventDefault();
                  sendMessage();
                }}
              >
                <input
                  ref={fileInputRef}
                  id="file-upload"
                  type="file"
                  accept="image/png, image/jpeg"
                  onChange={handleFileChange}
                  className="hidden"
                  multiple
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer flex justify-center items-center mx-1 ml-4"
                >
                  <FontAwesomeIcon
                    icon={faPaperclip}
                    size="xl"
                    className="text-gray-400 hover:text-[#2a4d58]"
                  />
                </label>

                <input
                  type="text"
                  className="text-gray-300"
                  placeholder="Enter your message..."
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                  }}
                />
                <button type="submit" disabled={isSending}>
                  {isSending ?
                    <span className="loader"></span> :
                    <FontAwesomeIcon icon={faPaperPlane} size="sm" className={"text-blue-500"} />
                  }
                </button>
              </form>
            </div>
          )}
        </div>
      </div >
      <div className="hidden xl:flex justify-start items-end grow">
        <Picker data={data} onEmojiSelect={addEmoji} />
      </div>
    </div >
  );
};

export default Chat;
