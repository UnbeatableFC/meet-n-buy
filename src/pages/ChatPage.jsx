import { ArrowLeftCircleIcon, Send } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  listenForMessages,
  sendMessage,
} from "../repository/messages";
import { auth, db } from "../firebaseConfig";
import { Link, useParams } from "react-router";
import { doc, getDoc } from "firebase/firestore";
import { formatTimestamp } from "../lib/formatTimeStamp";
import { Button } from "../components/ui/button";

const ChatPage = () => {
  const { chatId } = useParams();
  const selectedId = chatId;

  const [messages, setMessages] = useState([]);
  const [messageText, sendMessageText] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    async function fetchUser() {
      if (!selectedId) return;
      try {
        const userDocRef = doc(db, "users", selectedId);
        const userSnap = await getDoc(userDocRef);

        if (userSnap.exists()) {
          setSelectedUser(userSnap.data());
        } else {
          console.log("No such user found!");
          setSelectedUser(null);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }

    fetchUser();
  }, [selectedId]);

  const chattingId =
    auth?.currentUser?.uid < selectedId
      ? `${auth?.currentUser?.uid}-${selectedId}`
      : `${selectedId}-${auth?.currentUser?.uid}`;
  const user1 = auth?.currentUser;
  const user2 = selectedUser;
  const senderEmail = auth?.currentUser?.email;

  useEffect(() => {
    listenForMessages(chattingId, setMessages);
  }, [chattingId]);

  const sortedMessages = useMemo(() => {
    return [...messages].sort((a, b) => {
      const aTimeStamp =
        a?.timeStamp?.seconds + a?.timeStamp?.nanoseconds / 1e9;
      const bTimeStamp =
        b?.timeStamp?.seconds + b?.timeStamp?.nanoseconds / 1e9;

      return aTimeStamp - bTimeStamp;
    });
  }, [messages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [sortedMessages]);

  const handleSend = () => {
    const newMessage = {
      sender: senderEmail,
      text: messageText,
      timeStamp: {
        seconds: Math.floor(Date.now() / 1000),
        nanoseconds: 0,
      },
    };

    sendMessage(messageText, chattingId, user1?.uid, user2?.uid);
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    sendMessageText("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div className="flex h-full">
      {/* Chat Area */}
      <div className="flex flex-col flex-1 bg-green-50">
        {/* Header */}
        <div className="flex justify-between items-center gap-3 p-4 border-b border-gray-300 bg-amber-900/50 shrink-0">
          <div className="flex items-center gap-3">
            <img
              src={
                selectedUser?.photoURL ||
                selectedUser?.displayName.charAt(0)
              }
              alt={selectedUser?.displayName.charAt(0)}
              className="size-12 bg-accent-content rounded-full"
            />
            <h3 className="text-3xl font-sans font-bold uppercase">
              {selectedUser?.displayName}
            </h3>
          </div>
          <div>
            <Link to={"/friends"}>
              <Button variant={"secondary"}>
                <ArrowLeftCircleIcon />
                Back
              </Button>
            </Link>
          </div>
        </div>

        {/* Messages */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 space-y-3"
        >
          {sortedMessages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg?.sender === auth?.currentUser?.email
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`px-4 py-2 rounded-2xl max-w-xs ${
                  msg?.sender === auth?.currentUser?.email
                    ? "bg-green-400 text-white rounded-br-none"
                    : "bg-gray-200 text-gray-900 rounded-bl-none"
                }`}
              >
                <p>{msg.text}</p>
                <span className="block text-xs mt-1 opacity-70">
                  {formatTimestamp(msg?.timeStamp, true)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="flex items-center gap-2 p-3 border-t border-gray-300 bg-white shrink-0">
          <input
            value={messageText}
            onChange={(e) => sendMessageText(e.target.value)}
            type="text"
            placeholder="Type a message..."
            className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-900"
            onKeyDown={handleKeyDown}
          />
          <button
            onClick={handleSend}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
