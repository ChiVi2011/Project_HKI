import { useState, useRef, useEffect } from "react";
import logoImg from "../assets/img/logo.png";
import "../style/chat-box.css";

const QUICK_SUGGESTIONS = [
  "👶 Tư vấn sữa cho bé",
  "🤰 Dinh dưỡng mẹ bầu",
  "👵 Sữa Canxi người lớn",
  "🌱 Sữa hạt dinh dưỡng",
  "📞 Hotline hỗ trợ",
];

const BOT_RESPONSES = {
  "👶 Tư vấn sữa cho bé":
    "ViDairy cung cấp các dòng sản phẩm sữa công thức bổ sung DHA tinh khiết, Canxi sinh học và HMO giúp bé tăng cường miễn dịch và phát triển trí não vượt trội. Bạn có thể cho tôi biết bé nhà mình được mấy tháng tuổi rồi không ạ?",
  "🤰 Dinh dưỡng mẹ bầu":
    "Dòng sữa ViDairy Mama bổ sung Acid Folic, Sắt, Canxi và tổ hợp Vitamin nhóm B giúp mẹ giảm ốm nghén và thai nhi phát triển khỏe mạnh ngay từ những tháng đầu đời.",
  "👵 Sữa Canxi người lớn":
    "Đối với người lớn và người cao tuổi, dòng sữa ViDairy BoneCare bổ sung Canxi Nano kết hợp Vitamin D3 & MK7 giúp nuôi dưỡng sụn khớp dẻo dai và phòng ngừa loãng xương hiệu quả.",
  "🌱 Sữa hạt dinh dưỡng":
    "Sữa hạt dinh dưỡng ViDairy được làm từ 100% hạt tự nhiên (Hạt óc chó, hạnh nhân, yến mạch), giàu chất xơ và chất chống oxy hóa, thích hợp cho người ăn chay và theo đuổi lối sống lành mạnh.",
  "📞 Hotline hỗ trợ":
    "Bạn có thể gọi ngay Hotline tư vấn dinh dưỡng miễn phí của ViDairy: 0989 584 592 hoặc gửi email về chivinguyen1998@gmail.com để được hỗ trợ tận tình nhất!",
};

export default function ChatBox() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "bot",
      text: "Xin chào bạn! 👋 Tôi là trợ lý dinh dưỡng ViDairy. Tôi có thể hỗ trợ gì cho bạn và gia đình hôm nay?",
      time: "Vừa xong",
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);

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

  const handleSendMessage = (textToSend) => {
    const text = typeof textToSend === "string" ? textToSend : inputText;
    if (!text.trim()) return;

    const userMessage = {
      id: Date.now(),
      sender: "user",
      text: text.trim(),
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsTyping(true);

    // Xử lý phản hồi từ Bot
    setTimeout(() => {
      let botReply =
        "Cảm ơn câu hỏi của bạn! Chuyên viên dinh dưỡng ViDairy đã nhận được thông tin và sẽ phản hồi chi tiết. Nếu cần hỗ trợ khẩn cấp, bạn có thể gọi hotline: 0989 584 592 nhé!";

      // Kiểm tra câu hỏi mẫu
      if (BOT_RESPONSES[text]) {
        botReply = BOT_RESPONSES[text];
      } else {
        const lower = text.toLowerCase();
        if (
          lower.includes("bé") ||
          lower.includes("trẻ") ||
          lower.includes("con")
        ) {
          botReply = BOT_RESPONSES["👶 Tư vấn sữa cho bé"];
        } else if (lower.includes("bầu") || lower.includes("mang thai")) {
          botReply = BOT_RESPONSES["🤰 Dinh dưỡng mẹ bầu"];
        } else if (
          lower.includes("canxi") ||
          lower.includes("già") ||
          lower.includes("lớn tuổi") ||
          lower.includes("khớp")
        ) {
          botReply = BOT_RESPONSES["👵 Sữa Canxi người lớn"];
        } else if (
          lower.includes("hạt") ||
          lower.includes("chay") ||
          lower.includes("thực vật")
        ) {
          botReply = BOT_RESPONSES["🌱 Sữa hạt dinh dưỡng"];
        } else if (
          lower.includes("hotline") ||
          lower.includes("sđt") ||
          lower.includes("liên hệ") ||
          lower.includes("gặp")
        ) {
          botReply = BOT_RESPONSES["📞 Hotline hỗ trợ"];
        }
      }

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "bot",
          text: botReply,
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
      setIsTyping(false);
    }, 800);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
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
          title="Tư vấn trực tuyến với ViDairy"
          aria-label="Mở khung chat hỗ trợ"
        >
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
                <h4 className="chat-title">Trợ Lý Dinh Dưỡng ViDairy</h4>
                <span className="chat-subtitle">
                  <i className="bi bi-circle-fill online-icon"></i> Đang hoạt
                  động
                </span>
              </div>
            </div>
            <div className="chat-header-actions">
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
                    <div className="chat-bubble">{msg.text}</div>
                    <span className="chat-time">{msg.time}</span>
                  </div>
                </div>
              ))}

              {/* Hiệu ứng Bot đang gõ chữ */}
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
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Gợi ý câu hỏi nhanh */}
            <div className="chat-quick-suggestions">
              <span className="quick-title">Gợi ý câu hỏi nhanh:</span>
              <div className="quick-chips">
                {QUICK_SUGGESTIONS.map((item) => (
                  <button
                    key={item}
                    type="button"
                    className="quick-chip-btn"
                    onClick={() => handleSendMessage(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
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
                placeholder="Nhập câu hỏi của bạn..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                className="chat-input-field"
                aria-label="Nội dung tin nhắn"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
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
