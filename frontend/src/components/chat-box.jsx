import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logoImg from "../assets/img/logo.png";
import "../style/chat-box.css";

// Danh sách gợi ý câu hỏi thực tế và thông minh
const QUICK_SUGGESTIONS = [
  "👶 Bé bị táo bón & chậm tăng cân nên uống loại nào?",
  "🩺 Người bệnh tiểu đường có sữa nào phù hợp?",
  "🤰 Sữa cho mẹ bầu giảm ốm nghén, dễ uống?",
  "👵 Sữa bổ sung Canxi ngừa loãng xương cho người già?",
  "🛡️ Sữa non tăng cường đề kháng cho gia đình?",
  "📞 Cần gặp nhân viên tư vấn",
];

// Hàm chuyển đổi văn bản Markdown cơ bản sang HTML an toàn
function formatMarkdown(text) {
  if (!text) return "";

  // Xóa mã thẻ [PRODUCT:xxx] khỏi văn bản hiển thị vì đã có thẻ sản phẩm riêng
  let cleanText = text.replace(/\[PRODUCT:[a-zA-Z0-9\-_]+\]/g, "");

  // Tách dòng
  const lines = cleanText.split("\n");
  const formattedElements = [];

  lines.forEach((line, index) => {
    let trimmed = line.trim();
    if (!trimmed) {
      formattedElements.push(<div key={index} className="chat-line-break" />);
      return;
    }

    // Xử lý in đậm **text**
    const parts = [];
    const boldRegex = /\*\*(.*?)\*\*/g;
    let lastIndex = 0;
    let match;

    while ((match = boldRegex.exec(trimmed)) !== null) {
      if (match.index > lastIndex) {
        parts.push(trimmed.substring(lastIndex, match.index));
      }
      parts.push(
        <strong key={`b-${index}-${match.index}`} className="chat-bold-text">
          {match[1]}
        </strong>
      );
      lastIndex = boldRegex.lastIndex;
    }
    if (lastIndex < trimmed.length) {
      parts.push(trimmed.substring(lastIndex));
    }

    // Kiểm tra gạch đầu dòng
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      formattedElements.push(
        <div key={index} className="chat-bullet-line">
          <span className="bullet-dot">•</span>
          <span className="bullet-text">
            {parts.length > 0 ? parts : trimmed.substring(2)}
          </span>
        </div>
      );
    } else {
      formattedElements.push(
        <div key={index} className="chat-text-line">
          {parts.length > 0 ? parts : trimmed}
        </div>
      );
    }
  });

  return formattedElements;
}

export default function ChatBox() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "bot",
      text: "Xin chào bạn! 👋 Tôi là **Bác sĩ Dinh Dưỡng ViDairy**.\nTôi có thể tư vấn chuyên sâu về các dòng sữa cho bé, mẹ bầu, người lớn tuổi hoặc người có bệnh lý (tiểu đường, suy thận). Bạn cần hỗ trợ gì hôm nay?",
      suggestedProducts: [],
      time: "Vừa xong",
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const [showQuickSuggestions, setShowQuickSuggestions] = useState(true);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setHasUnread(false);
    }
  }, [messages, isOpen]);

  // URL Backend API
  const API_BASE_URL =
    (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_BASE_URL) ||
    (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_URL) ||
    "http://localhost:3000/api";

  const handleSendMessage = async (textToSend) => {
    const text = typeof textToSend === "string" ? textToSend : inputText;
    if (!text.trim() || isTyping) return;

    // Ẩn khung gợi ý câu hỏi khi người dùng bắt đầu gửi tin nhắn
    setShowQuickSuggestions(false);

    const userMessage = {
      id: Date.now(),
      sender: "user",
      text: text.trim(),
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputText("");
    setIsTyping(true);

    try {
      // Gửi yêu cầu đến Backend API (đã kết nối Gemini & Fallback Engine)
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: text.trim(),
          history: updatedMessages.map((m) => ({
            sender: m.sender,
            text: m.text,
          })),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            sender: "bot",
            text: data.reply || "Cảm ơn câu hỏi của bạn!",
            suggestedProducts: data.suggestedProducts || [],
            modelUsed: data.modelUsed || "AI Dinh Dưỡng ViDairy",
            time: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
        ]);
      } else {
        throw new Error(`Server returned status ${response.status}`);
      }
    } catch (err) {
      console.warn("Lỗi kết nối API Chat, kích hoạt trả lời dự phòng:", err);
      // Fallback an toàn nếu máy chủ backend mất mạng
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "bot",
          text: `Dạ, Bác sĩ ViDairy đã nhận được câu hỏi của bạn: "${text.trim()}".\nĐể được tư vấn ngay lập tức, bạn có thể gọi hotline: **0989 584 592** hoặc tham khảo các sản phẩm nổi bật của ViDairy tại mục Sản Phẩm nhé!`,
          suggestedProducts: [],
          modelUsed: "Hệ thống hỗ trợ",
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleNavigateToProduct = (productId) => {
    if (!productId) return;
    navigate(`/product/${productId}`);
    // Thu nhỏ chatbox trên mobile nếu cần để tiện xem
    if (window.innerWidth <= 768) {
      setIsOpen(false);
    }
  };

  return (
    <div className="vidairy-chat-container">
      {/* Nút Chat tròn nhỏ gọn nổi góc dưới bên phải */}
      {!isOpen && (
        <button
          type="button"
          className="chat-fab-btn"
          onClick={() => setIsOpen(true)}
          title="Tư vấn dinh dưỡng cùng Bác Sĩ AI ViDairy"
          aria-label="Mở khung chat hỗ trợ"
        >
          <span className="chat-ai-sparkle">✨</span>
          <i className="bi bi-chat-dots-fill chat-fab-icon"></i>
          {hasUnread && <span className="chat-fab-badge">1</span>}
        </button>
      )}

      {/* Cửa sổ Chat Box */}
      {isOpen && (
        <div className="chat-window-box">
          {/* Header của Chat Box */}
          <div className="chat-header">
            <div className="chat-header-info">
              <div className="chat-avatar-wrapper">
                <img src={logoImg} alt="ViDairy" className="chat-avatar-img" />
                <span
                  className="chat-status-dot"
                  title="Đang trực tuyến"
                ></span>
              </div>
              <div className="chat-header-text">
                <h4 className="chat-title">
                  Bác Sĩ Dinh Dưỡng ViDairy
                </h4>
                <span className="chat-subtitle">
                  <i className="bi bi-circle-fill online-icon"></i> Sẵn sàng giải đáp 24/7
                </span>
              </div>
            </div>
            <div className="chat-header-actions">
              <button
                type="button"
                className="chat-header-icon-btn"
                onClick={() => setShowQuickSuggestions((prev) => !prev)}
                title={showQuickSuggestions ? "Ẩn câu hỏi gợi ý" : "Xem câu hỏi gợi ý"}
                aria-label="Gợi ý câu hỏi"
              >
                <i className={`bi ${showQuickSuggestions ? "bi-lightbulb-fill" : "bi-lightbulb"}`}></i>
              </button>
              <button
                type="button"
                className="chat-close-btn"
                onClick={() => setIsOpen(false)}
                title="Thu nhỏ khung chat"
                aria-label="Đóng khung chat"
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
          </div>

          {/* Thân cửa sổ Chat (Danh sách tin nhắn) */}
          <div className="chat-body">
            <div className="chat-messages-list">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`chat-message-row ${
                    msg.sender === "user" ? "user-row" : "bot-row"
                  }`}
                >
                  {msg.sender === "bot" && (
                    <div className="chat-msg-avatar">
                      <img src={logoImg} alt="ViDairy" />
                    </div>
                  )}
                  <div className="chat-bubble-wrap">
                    {/* Bong bóng tin nhắn */}
                    <div className="chat-bubble">
                      {msg.sender === "bot"
                        ? formatMarkdown(msg.text)
                        : msg.text}
                    </div>

                    {/* Danh thiếp / Thẻ sản phẩm mini được AI gợi ý */}
                    {msg.sender === "bot" &&
                      Array.isArray(msg.suggestedProducts) &&
                      msg.suggestedProducts.length > 0 && (
                        <div className="chat-suggested-products-box">
                          <div className="suggested-header">
                            <i className="bi bi-stars"></i> Sản phẩm được bác sĩ khuyên dùng:
                          </div>
                          <div className="suggested-cards-scroll">
                            {msg.suggestedProducts.map((p) => (
                              <div
                                key={p.ProductID || p.id}
                                className="mini-product-card"
                                onClick={() =>
                                  handleNavigateToProduct(p.ProductID || p.id)
                                }
                                title="Bấm để xem chi tiết sản phẩm"
                              >
                                <img
                                  src={
                                    p.imageUrl ||
                                    "https://vitadairy.vn/s/images/product/hinh-thumnail-sp-380-x-210.jpg"
                                  }
                                  alt={p.ProductName}
                                  className="mini-card-img"
                                />
                                <div className="mini-card-info">
                                  <h5 className="mini-card-title">
                                    {p.ProductName}
                                  </h5>
                                  <div className="mini-card-meta">
                                    <span className="mini-card-price">
                                      {Number(p.price || 0).toLocaleString("vi-VN")}{" "}
                                      đ
                                    </span>
                                    {p.packaging && (
                                      <span className="mini-card-pack">
                                        {p.packaging}
                                      </span>
                                    )}
                                  </div>
                                  <button
                                    type="button"
                                    className="mini-card-action-btn"
                                  >
                                    Xem chi tiết <i className="bi bi-arrow-right-short"></i>
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    <div className="chat-meta-row">
                      <span className="chat-time">{msg.time}</span>
                    </div>
                  </div>
                </div>
              ))}

              {/* Hiệu ứng Bot đang suy nghĩ */}
              {isTyping && (
                <div className="chat-message-row bot-row">
                  <div className="chat-msg-avatar">
                    <img src={logoImg} alt="ViDairy" />
                  </div>
                  <div className="chat-bubble-wrap">
                    <div className="chat-bubble typing-bubble">
                      <span className="typing-dot"></span>
                      <span className="typing-dot"></span>
                      <span className="typing-dot"></span>
                      <span className="typing-text-hint">Bác sĩ đang phân tích...</span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Gợi ý câu hỏi nhanh (Chỉ hiển thị lần đầu khi mở web/tải lại trang, ẩn khi đã bắt đầu chat) */}
            {showQuickSuggestions && messages.length <= 1 && (
              <div className="chat-quick-suggestions">
                <div className="quick-title-bar">
                  <span className="quick-title">
                    <i className="bi bi-lightbulb-fill"></i> Gợi ý câu hỏi nhanh:
                  </span>
                  <button
                    type="button"
                    className="quick-close-btn"
                    onClick={() => setShowQuickSuggestions(false)}
                    title="Đóng khung gợi ý"
                    aria-label="Đóng gợi ý"
                  >
                    <i className="bi bi-x-lg"></i>
                  </button>
                </div>
                <div className="quick-chips">
                  {QUICK_SUGGESTIONS.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className="quick-chip-btn"
                      onClick={() => {
                        setShowQuickSuggestions(false);
                        handleSendMessage(item);
                      }}
                      disabled={isTyping}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Ô nhập nội dung tin nhắn */}
          <div className="chat-footer">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="chat-input-form"
            >
              <input
                type="text"
                placeholder="Hỏi về sữa cho bé, mẹ bầu, tiểu đường, cách pha..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                className="chat-input-field"
                aria-label="Nội dung tin nhắn"
                disabled={isTyping}
              />
              <button
                type="submit"
                disabled={!inputText.trim() || isTyping}
                className="chat-send-btn"
                title="Gửi tin nhắn"
                aria-label="Gửi"
              >
                <i className="bi bi-send-fill"></i>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
