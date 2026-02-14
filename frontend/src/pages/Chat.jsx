import { useState, useEffect } from "react";

const Chat = () => {
    const [selectedChat, setSelectedChat] = useState(null);
    const [message, setMessage] = useState("");

    // const [conversations, setConversations] = useState({
    //     1: [
    //         { from: "ngo", text: "Hi! Thanks for applying." }
    //     ],
    //     2: [
    //         { from: "ngo", text: "We reviewed your profile." }
    //     ]
    // });

    // const [unread, setUnread] = useState({
    //     1: 1,
    //     2: 1
    // });

    // const ngos = [
    //     { id: 1, name: "Health NGO" },
    //     { id: 2, name: "Education NGO" }
    // ];
    const [conversations, setConversations] = useState([]);
    const [ngos, setNgos] = useState([]);

    // Clear unread when opening chat
    useEffect(() => {
        if (selectedChat) {
            setUnread(prev => ({
                ...prev,
                [selectedChat.id]: 0
            }));
        }
    }, [selectedChat]);

    const handleSend = () => {
        if (!message.trim() || !selectedChat) return;

        const newMessage = { from: "volunteer", text: message };

        setConversations(prev => ({
            ...prev,
            [selectedChat.id]: [...prev[selectedChat.id], newMessage]
        }));

        setMessage("");

        // 🔥 Fake auto reply after 1.5s
        setTimeout(() => {
            const autoReply = {
                from: "ngo",
                text: "Thanks for your message! We'll get back to you soon."
            };

            setConversations(prev => ({
                ...prev,
                [selectedChat.id]: [...prev[selectedChat.id], autoReply]
            }));

            // Increase unread if user not viewing that chat
            if (!selectedChat) {
                setUnread(prev => ({
                    ...prev,
                    [selectedChat.id]: prev[selectedChat.id] + 1
                }));
            }

        }, 1500);
    };

    return (
        <div className="profile-page">
            <div className="profile-card" style={{ maxWidth: "1200px" }}>

                <div style={{ display: "flex", height: "600px" }}>

                    {/* LEFT SIDEBAR */}
                    <div style={{
                        width: "260px",
                        borderRight: "1px solid var(--gray-200)",
                        padding: "16px"
                    }}>
                        <h3 style={{ marginBottom: "16px" }}>Chats</h3>

                        {ngos.map(ngo => (
                            <div
                                key={ngo.id}
                                onClick={() => setSelectedChat(ngo)}
                                style={{
                                    padding: "10px",
                                    borderRadius: "var(--radius-md)",
                                    cursor: "pointer",
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    background:
                                        selectedChat?.id === ngo.id
                                            ? "var(--primary-50)"
                                            : "transparent",
                                    marginBottom: "8px"
                                }}
                            >
                                <span>{ngo.name}</span>

                                {/* 🔴 Unread Badge */}
                                {unread[ngo.id] > 0 && (
                                    <span style={{
                                        background: "var(--danger)",
                                        color: "white",
                                        fontSize: "0.75rem",
                                        padding: "2px 8px",
                                        borderRadius: "999px"
                                    }}>
                                        {unread[ngo.id]}
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* CHAT AREA */}
                    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>

                        {selectedChat ? (
                            <>
                                {/* HEADER */}
                                <div style={{
                                    padding: "16px",
                                    borderBottom: "1px solid var(--gray-200)",
                                    fontWeight: "600"
                                }}>
                                    Chat with {selectedChat.name}
                                </div>

                                {/* MESSAGES */}
                                <div style={{
                                    flex: 1,
                                    padding: "16px",
                                    overflowY: "auto"
                                }}>
                                    {(conversations[selectedChat.id] || []).map((msg, index) => (
                                        <div
                                            key={index}
                                            style={{
                                                display: "flex",
                                                justifyContent:
                                                    msg.from === "volunteer"
                                                        ? "flex-end"
                                                        : "flex-start",
                                                marginBottom: "12px"
                                            }}
                                        >
                                            <div style={{
                                                padding: "10px 14px",
                                                borderRadius: "20px",
                                                background:
                                                    msg.from === "volunteer"
                                                        ? "var(--gradient-btn)"
                                                        : "var(--gray-200)",
                                                color:
                                                    msg.from === "volunteer"
                                                        ? "white"
                                                        : "var(--gray-800)",
                                                maxWidth: "60%"
                                            }}>
                                                {msg.text}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* INPUT */}
                                <div style={{
                                    padding: "12px",
                                    borderTop: "1px solid var(--gray-200)",
                                    display: "flex",
                                    gap: "10px"
                                }}>
                                    <input
                                        type="text"
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        placeholder="Type a message..."
                                        style={{
                                            flex: 1,
                                            padding: "10px",
                                            borderRadius: "20px",
                                            border: "1px solid var(--gray-300)"
                                        }}
                                    />
                                    <button className="btn" onClick={handleSend}>
                                        Send
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div style={{
                                flex: 1,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "var(--gray-500)"
                            }}>
                                Select a chat to start messaging
                            </div>
                        )}

                    </div>
                </div>

            </div>
        </div>
    );
};

export default Chat;