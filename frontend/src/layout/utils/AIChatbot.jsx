import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getBookById } from "../../api/BookApi";
import { getAllImageByBook } from "../../api/ImageApi";
import { endpointBE } from "./Constant";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import ChatIcon from "@mui/icons-material/Chat";

// Component con để render thẻ sách gợi ý trong nội dung tin nhắn
const InlineBookCard = ({ idBook, onClickLink }) => {
    const [book, setBook] = useState(null);
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        getBookById(idBook)
            .then(res => {
                if (isMounted && res) {
                    setBook(res);
                    return getAllImageByBook(idBook);
                }
            })
            .then(imgs => {
                if (isMounted && imgs) {
                    setImages(imgs);
                }
                if (isMounted) setLoading(false);
            })
            .catch(err => {
                console.error("Error loading inline book card:", err);
                if (isMounted) setLoading(false);
            });
        return () => { isMounted = false; };
    }, [idBook]);

    if (loading) {
        return (
            <div className="ms-inline-card-loading">
                <span className="spinner-border spinner-border-sm text-secondary me-2"></span>
                Đang tải gợi ý sách...
            </div>
        );
    }

    if (!book) return null;

    const imageUrl = images[0]?.urlImage || "/images/books/hinh_nen_sach.jpg";

    return (
        <div className="ms-inline-book-card">
            <img src={imageUrl} alt={book.nameBook} className="ms-inline-book-img" />
            <div className="ms-inline-book-info">
                <div className="ms-inline-book-title">{book.nameBook}</div>
                <div className="ms-inline-book-author">{book.author}</div>
                <div className="ms-inline-book-price">
                    {book.sellPrice?.toLocaleString()}đ
                    {book.discountPercent > 0 && (
                        <span className="ms-inline-book-disc">-{book.discountPercent}%</span>
                    )}
                </div>
                <button className="ms-inline-book-btn" onClick={() => onClickLink(book.idBook)}>
                    Xem chi tiết
                </button>
            </div>
        </div>
    );
};

const AIChatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            role: "model",
            text: "Xin chào! 👋 Tôi là Trợ lý ảo thông minh của Mộc Sách. Bạn muốn tìm thể loại sách gì hay cần tư vấn cuốn nào hôm nay?"
        }
    ]);
    const [inputValue, setInputValue] = useState("");
    const [isSending, setIsSending] = useState(false);
    const messagesEndRef = useRef(null);
    const navigate = useNavigate();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async (textToSend) => {
        if (!textToSend || textToSend.trim() === "" || isSending) return;

        const userMsg = { role: "user", text: textToSend };
        setMessages(prev => [...prev, userMsg]);
        setInputValue("");
        setIsSending(true);

        try {
            // Prepare history format matching backend AIChatRequest
            // Map 'model' to 'model' and 'user' to 'user'
            const formattedHistory = messages.map(m => ({
                role: m.role,
                text: m.text
            }));

            const response = await fetch(`${endpointBE}/books/ai-chat`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    message: textToSend,
                    history: formattedHistory
                })
            });

            if (response.ok) {
                const data = await response.json();
                setMessages(prev => [...prev, { role: "model", text: data.reply || "Tôi chưa nhận được phản hồi phù hợp." }]);
            } else {
                setMessages(prev => [...prev, { role: "model", text: "Xin lỗi, đã xảy ra sự cố khi kết nối tới Trợ lý AI. Bạn hãy thử lại sau nhé." }]);
            }
        } catch (error) {
            console.error("AI chat error:", error);
            setMessages(prev => [...prev, { role: "model", text: "Lỗi kết nối mạng. Không thể liên lạc được với Trợ lý AI." }]);
        } finally {
            setIsSending(false);
        }
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        handleSendMessage(inputValue);
    };

    const handleQuickQuery = (queryText) => {
        handleSendMessage(queryText);
    };

    const handleBookClick = (idBook) => {
        setIsOpen(false);
        navigate(`/book/${idBook}`);
    };

    // Hàm render nội dung tin nhắn và tự động chèn thẻ sách nếu chứa mã [BOOK_ID:x]
    const renderMessageContent = (text) => {
        if (!text) return "";

        const regex = /\[BOOK_ID:(\d+)\]/g;
        const parts = [];
        let lastIndex = 0;
        let match;

        while ((match = regex.exec(text)) !== null) {
            const index = match.index;
            const idBook = parseInt(match[1]);

            // Add text before match
            if (index > lastIndex) {
                parts.push(<span key={`txt-${lastIndex}`}>{text.substring(lastIndex, index)}</span>);
            }

            // Add InlineBookCard
            parts.push(
                <InlineBookCard 
                    key={`book-${idBook}-${index}`} 
                    idBook={idBook} 
                    onClickLink={handleBookClick} 
                />
            );

            lastIndex = regex.lastIndex;
        }

        if (lastIndex < text.length) {
            parts.push(<span key={`txt-${lastIndex}`}>{text.substring(lastIndex)}</span>);
        }

        return parts.length > 0 ? parts : text;
    };

    return (
        <>
            <style>{`
                /* Floating chat bubble icon */
                .ms-ai-chat-bubble {
                    position: fixed;
                    bottom: 24px;
                    right: 24px;
                    width: 56px;
                    height: 56px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #2C7B8F 0%, #1A5E70 100%);
                    box-shadow: 0 4px 16px rgba(44, 123, 143, 0.4);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    cursor: pointer;
                    z-index: 1000;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .ms-ai-chat-bubble:hover {
                    transform: scale(1.08) rotate(-8deg);
                    box-shadow: 0 6px 20px rgba(44, 123, 143, 0.5);
                }
                
                /* Chat window container */
                .ms-ai-chat-window {
                    position: fixed;
                    bottom: 96px;
                    right: 24px;
                    width: 380px;
                    height: 520px;
                    border-radius: 16px;
                    background: #fff;
                    box-shadow: 0 12px 36px rgba(0,0,0,0.15);
                    display: flex;
                    flex-direction: column;
                    z-index: 1000;
                    overflow: hidden;
                    font-family: 'DM Sans', sans-serif;
                    border: 1px solid #E2E8F0;
                    animation: msSlideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1) both;
                }
                @keyframes msSlideIn {
                    from { opacity: 0; transform: translateY(20px) scale(0.95); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }

                /* Header */
                .ms-ai-chat-header {
                    background: linear-gradient(135deg, #2C7B8F 0%, #1A5E70 100%);
                    color: white;
                    padding: 14px 16px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }
                .ms-ai-chat-title-group {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                .ms-ai-chat-header-title {
                    font-size: 15px;
                    font-weight: 600;
                    margin: 0;
                    letter-spacing: 0.2px;
                }
                .ms-ai-chat-header-status {
                    font-size: 11px;
                    color: #A5F3FC;
                    margin: 0;
                    display: flex;
                    align-items: center;
                    gap: 4px;
                }
                .ms-ai-chat-online-dot {
                    width: 6px;
                    height: 6px;
                    border-radius: 50%;
                    background: #10B981;
                    display: inline-block;
                }
                .ms-ai-chat-close-btn {
                    background: transparent;
                    border: none;
                    color: white;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 4px;
                    border-radius: 50%;
                    transition: background 0.2s;
                }
                .ms-ai-chat-close-btn:hover {
                    background: rgba(255, 255, 255, 0.15);
                }

                /* Messages Area */
                .ms-ai-chat-messages {
                    flex: 1;
                    padding: 16px;
                    overflow-y: auto;
                    background: #F8FAFC;
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }
                .ms-chat-msg {
                    display: flex;
                    flex-direction: column;
                    max-width: 80%;
                }
                .ms-chat-msg.user {
                    align-self: flex-end;
                }
                .ms-chat-msg.model {
                    align-self: flex-start;
                }
                .ms-chat-bubble-text {
                    padding: 10px 14px;
                    font-size: 13.5px;
                    line-height: 1.5;
                    white-space: pre-line;
                }
                .ms-chat-msg.user .ms-chat-bubble-text {
                    background: #2C7B8F;
                    color: white;
                    border-radius: 14px 14px 2px 14px;
                }
                .ms-chat-msg.model .ms-chat-bubble-text {
                    background: white;
                    color: #1E293B;
                    border: 1px solid #E2E8F0;
                    border-radius: 14px 14px 14px 2px;
                    box-shadow: 0 1px 2px rgba(0,0,0,0.02);
                }

                /* Quick Prompts */
                .ms-ai-chat-quick {
                    display: flex;
                    gap: 8px;
                    overflow-x: auto;
                    padding: 8px 12px;
                    background: #F1F5F9;
                    border-top: 1px solid #E2E8F0;
                    scrollbar-width: none;
                }
                .ms-ai-chat-quick::-webkit-scrollbar {
                    display: none;
                }
                .ms-quick-btn {
                    flex-shrink: 0;
                    background: white;
                    border: 1px solid #CBD5E1;
                    border-radius: 20px;
                    padding: 6px 12px;
                    font-size: 12px;
                    color: #475569;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .ms-quick-btn:hover {
                    border-color: #2C7B8F;
                    color: #2C7B8F;
                    background: #EEF8FA;
                }

                /* Input Area */
                .ms-ai-chat-input-form {
                    padding: 10px 14px;
                    border-top: 1px solid #E2E8F0;
                    display: flex;
                    gap: 8px;
                    align-items: center;
                    background: white;
                }
                .ms-ai-chat-input {
                    flex: 1;
                    border: 1px solid #CBD5E1;
                    border-radius: 20px;
                    padding: 8px 16px;
                    font-size: 13.5px;
                    outline: none;
                    transition: border 0.2s;
                }
                .ms-ai-chat-input:focus {
                    border-color: #2C7B8F;
                }
                .ms-ai-chat-send-btn {
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    border: none;
                    background: #2C7B8F;
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: background 0.2s;
                }
                .ms-ai-chat-send-btn:hover {
                    background: #1A5E70;
                }
                .ms-ai-chat-send-btn:disabled {
                    background: #94A3B8;
                    cursor: not-allowed;
                }

                /* Typing Indicator */
                .ms-typing-indicator {
                    display: flex;
                    gap: 4px;
                    padding: 8px 12px;
                    background: white;
                    border: 1px solid #E2E8F0;
                    border-radius: 12px;
                    width: 50px;
                    justify-content: center;
                    align-self: flex-start;
                    box-shadow: 0 1px 2px rgba(0,0,0,0.02);
                }
                .ms-typing-indicator span {
                    width: 6px;
                    height: 6px;
                    background: #94A3B8;
                    border-radius: 50%;
                    animation: msBounce 1.4s infinite both;
                }
                .ms-typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
                .ms-typing-indicator span:nth-child(3) { animation-delay: 0.4s; }
                @keyframes msBounce {
                    0%, 80%, 100% { transform: scale(0); }
                    40% { transform: scale(1); }
                }

                /* Inline Book Card */
                .ms-inline-book-card {
                    display: flex;
                    gap: 12px;
                    background: #F8FAFC;
                    border: 1px solid #E2E8F0;
                    border-radius: 8px;
                    padding: 10px;
                    margin-top: 8px;
                    width: 100%;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.02);
                }
                .ms-inline-book-img {
                    width: 60px;
                    height: 80px;
                    object-fit: contain;
                    border-radius: 4px;
                    background: white;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.08);
                }
                .ms-inline-book-info {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                }
                .ms-inline-book-title {
                    font-size: 13px;
                    font-weight: 600;
                    color: #1E293B;
                    line-height: 1.3;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
                .ms-inline-book-author {
                    font-size: 11px;
                    color: #64748B;
                }
                .ms-inline-book-price {
                    font-size: 12.5px;
                    font-weight: 700;
                    color: #2C7B8F;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }
                .ms-inline-book-disc {
                    background: #2C7B8F;
                    color: white;
                    font-size: 9px;
                    padding: 1px 4px;
                    border-radius: 4px;
                    font-weight: 600;
                }
                .ms-inline-book-btn {
                    align-self: flex-start;
                    background: white;
                    border: 1px solid #2C7B8F;
                    color: #2C7B8F;
                    padding: 3px 8px;
                    font-size: 11px;
                    font-weight: 600;
                    border-radius: 4px;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .ms-inline-book-btn:hover {
                    background: #2C7B8F;
                    color: white;
                }

                .ms-inline-card-loading {
                    display: flex;
                    align-items: center;
                    font-size: 12px;
                    color: #64748B;
                    padding: 8px;
                    border: 1px dashed #CBD5E1;
                    border-radius: 6px;
                    margin-top: 6px;
                    background: #F8FAFC;
                }

                /* Responsive */
                @media (max-width: 480px) {
                    .ms-ai-chat-window {
                        width: calc(100% - 32px);
                        right: 16px;
                        left: 16px;
                        height: 480px;
                        bottom: 90px;
                    }
                }
            `}</style>

            {/* Bubble Button */}
            <div className="ms-ai-chat-bubble" onClick={() => setIsOpen(!isOpen)} title="Trợ lý AI Mộc Sách">
                {isOpen ? <CloseIcon /> : <ChatIcon />}
            </div>

            {/* Chat Window */}
            {isOpen && (
                <div className="ms-ai-chat-window">
                    {/* Header */}
                    <div className="ms-ai-chat-header">
                        <div className="ms-ai-chat-title-group">
                            <SmartToyIcon sx={{ fontSize: 24, color: "#E0F2FE" }} />
                            <div>
                                <h3 className="ms-ai-chat-header-title">Trợ Lý AI</h3>
                                <p className="ms-ai-chat-header-status">
                                    <span className="ms-ai-chat-online-dot"></span> Đang hoạt động
                                </p>
                            </div>
                        </div>
                        <button className="ms-ai-chat-close-btn" onClick={() => setIsOpen(false)}>
                            <CloseIcon sx={{ fontSize: 18 }} />
                        </button>
                    </div>

                    {/* Message list */}
                    <div className="ms-ai-chat-messages">
                        {messages.map((msg, i) => (
                            <div key={i} className={`ms-chat-msg ${msg.role}`}>
                                <div className="ms-chat-bubble-text">
                                    {renderMessageContent(msg.text)}
                                </div>
                            </div>
                        ))}
                        {isSending && (
                            <div className="ms-typing-indicator">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Quick Suggestions */}
                    <div className="ms-ai-chat-quick">
                        <button className="ms-quick-btn" onClick={() => handleQuickQuery("Gợi ý sách trinh thám hot")}>
                            Sách trinh thám 🔎
                        </button>
                        <button className="ms-quick-btn" onClick={() => handleQuickQuery("Sách kỹ năng sống nên đọc")}>
                            Kỹ năng sống 🌱
                        </button>
                        <button className="ms-quick-btn" onClick={() => handleQuickQuery("Sách nào mới nhập?")}>
                            Sách mới về 🆕
                        </button>
                        <button className="ms-quick-btn" onClick={() => handleQuickQuery("Sách bán chạy nhất là gì?")}>
                            Bán chạy nhất 🔥
                        </button>
                    </div>

                    {/* Form Input */}
                    <form className="ms-ai-chat-input-form" onSubmit={handleFormSubmit}>
                        <input
                            type="text"
                            className="ms-ai-chat-input"
                            placeholder="Nhập câu hỏi của bạn..."
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            disabled={isSending}
                        />
                        <button 
                            type="submit" 
                            className="ms-ai-chat-send-btn" 
                            disabled={isSending || !inputValue.trim()}
                        >
                            <SendIcon sx={{ fontSize: 16 }} />
                        </button>
                    </form>
                </div>
            )}
        </>
    );
};

export default AIChatbot;
