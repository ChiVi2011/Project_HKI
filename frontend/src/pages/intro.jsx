import { useState, useEffect } from "react";
import BannerImg2 from "../assets/img/ViDairy_loihua_1527x633.png";
import BannerImg3 from "../assets/img/ViDairy_1527x633.png";
import TuanVyImg from "../assets/img/c02a2b67-233f-41ee-b44d-673c7a6777d8.png";
import TienDuy from "../assets/img/anh duy.png";
import "../style/intro.css";

export default function Intro() {
  const [activeTab, setActiveTab] = useState("hdqt");
  const [loading, setLoading] = useState(true);
  const [pageData, setPageData] = useState({
    menuItems: [],
    milestones: [],
    promises: [],
    directors: [],
    executives: [],
  });

  useEffect(() => {
    // Tương lai thay khối này bằng API thực tế
    const fetchData = async () => {
      try {
        setPageData({
          menuItems: [
            {
              id: "ceo-section",
              num: "01",
              title: "Lời gửi từ người dẫn đường",
            },
            {
              id: "promise-section",
              num: "02",
              title: "Điều ViDairy luôn giữ",
            },
            {
              id: "milestones-section",
              num: "03",
              title: "Những dấu mốc đáng nhớ",
            },
            {
              id: "leadership-section",
              num: "04",
              title: "Người đồng hành dẫn lối",
            },
            { id: "culture-section", num: "05", title: "Chung một mái nhà" },
          ],
          ceoData: {
            greeting: "Xin chào",
            challenge: "thử thách",
            imgSrc:
              "https://lh3.googleusercontent.com/a/ACg8ocKFrfQC0Q3FebjC6xelLaBHAoWDX6fE_mi4X3gpEA3ZkBOjTL0ang=s360-c-no",
            imgAlt: "Ông Nguyễn Chí Vĩ - Tổng Giám Đốc ViDairy",
            name: "Ông. Nguyễn Chí Vĩ",
            positionLine1: "Tổng Giám đốc Công ty CP Sữa ViDairy",
            positionLine2: "Chủ tịch HĐQT Tập Đoàn ViOne",
            quote:
              "ViDairy không bắt đầu từ một sản phẩm. ViDairy bắt đầu từ một niềm tin: sức khỏe tốt phải được nuôi dưỡng từ những điều căn bản nhất.",
            paragraphs: [
              "Chúng tôi nhìn thấy một đứa trẻ cần được lớn lên với một nền tảng dinh dưỡng toàn diện. Một người mẹ trong thai kỳ cần được chăm sóc đủ đầy để trao cho con những điều tốt đẹp nhất ngay từ những ngày đầu tiên. Một người trưởng thành cần dinh dưỡng phù hợp để sống khỏe, làm việc và tận hưởng cuộc sống. Và những người lớn tuổi cần được quan tâm để mỗi năm tháng phía trước vẫn là những năm tháng đáng sống.",
              "Từ đó, ViDairy được thành lập với một mục tiêu lớn hơn việc tạo ra sữa: xây dựng một hệ sinh thái dinh dưỡng có thể đồng hành cùng con người trong suốt hành trình của cuộc đời.",
              "Với định hướng phát triển từ nghiên cứu dinh dưỡng, vùng nguyên liệu, trang trại, nhà máy đến hệ thống phân phối, ViDairy từng bước xây dựng một nền tảng đủ lớn để phục vụ hàng triệu gia đình Việt Nam. Mỗi dòng sản phẩm được phát triển cho một nhu cầu, một độ tuổi, một giai đoạn sống khác nhau — nhưng cùng hướng về một điều: giúp mỗi người khỏe hơn từ bên trong.",
              "Chúng tôi không muốn trở thành thương hiệu chỉ xuất hiện trên bàn ăn. ViDairy muốn hiện diện trong những khoảnh khắc quan trọng nhất của mỗi gia đình — khi một em bé bắt đầu lớn lên, khi một người mẹ chuẩn bị đón con, khi một gia đình chăm sóc cha mẹ, và khi mỗi người lựa chọn sống khỏe hơn mỗi ngày. Bởi chúng tôi tin rằng, một thương hiệu dinh dưỡng lớn không được đo bằng việc có bao nhiêu sản phẩm, mà bằng việc đã đồng hành cùng bao nhiêu cuộc đời. Và đó cũng là lý do ViDairy được bắt đầu: từ một ly sữa, hướng đến một hành trình chăm sóc sức khỏe cho cả thế hệ.",
            ],
          },

          milestones: [
            {
              id: "1",
              year: "2024",
              title: "Khởi nguồn ý tưởng & Khảo sát",
              desc: "Nhen nhóm ước mơ mang nguồn dinh dưỡng chuẩn y khoa đến người Việt. Khảo sát thực tế trên 10.000 gia đình.",
            },
            {
              id: "2",
              year: "2025",
              title: "Sản phẩm đầu tiên được ra đời",
              desc: "Hoàn thiện các công thức sữa vàng và chuẩn hóa vùng nguyên liệu chuẩn sinh thái Green Farm & Non-GMO.",
            },
            {
              id: "3",
              year: "2026",
              title: "Chính thức thành lập ViDairy",
              desc: "Thành lập Công ty CP Sữa ViDairy Việt Nam, đưa hệ sinh thái dinh dưỡng ra mắt toàn diện trên thị trường.",
            },
          ],
          promises: [
            {
              num: "01",
              title: "Thực Thi Cam Kết",
              desc: "Tại ViDairy, minh bạch là chuẩn mực vận hành. Chúng tôi tinh tuyển mạng lưới đối tác toàn cầu nhằm ứng dụng nguồn nguyên liệu đạt chuẩn quốc tế và công nghệ sản xuất tiên tiến nhất. Mọi quyết định chế tác đều đặt sự an toàn của khách hàng cùng gia đình lên hàng đầu.",
            },
            {
              num: "02",
              title: "Minh Bạch Tuyệt Đối",
              desc: "Mọi thông điệp truyền thông từ ViDairy đều tuân thủ nguyên tắc trung thực và trực diện. Tự hào về chất lượng nguyên liệu đầu vào, chúng tôi cam kết công bố chính xác 100% thành phần trên bao bì. Những hợp chất không được ghi nhận, tuyệt đối không tồn tại trong sản phẩm.",
            },
            {
              num: "03",
              title: "Không Ngừng Đổi Mới",
              desc: 'Việc đáp ứng các tiêu chuẩn kiểm định khắt khe trước khi xuất xưởng chỉ là bước cơ bản. Với ViDairy, "tốt" chưa bao giờ là giới hạn cuối cùng. Chúng tôi liên tục thử thách các quy trình hiện tại để mỗi sản phẩm ra đời ngày mai đều ưu việt hơn hôm nay.',
            },
          ],
          directors: [
            {
              id: 1,
              title: "Ông",
              name: "Nguyễn Chí Vĩ",
              role: "Chủ tịch Hội đồng quản trị",
              img: "https://lh3.googleusercontent.com/a/ACg8ocKFrfQC0Q3FebjC6xelLaBHAoWDX6fE_mi4X3gpEA3ZkBOjTL0ang=s360-c-no",
            },
            {
              id: 2,
              title: "Ông",
              name: "Nguyễn Tuấn Vỹ",
              role: "Phó Chủ tịch Hội đồng quản trị",
              img: TuanVyImg,
            },
          ],
          executives: [
            {
              id: 1,
              title: "Ông",
              name: "Nguyễn Chí Vĩ",
              role: "Tổng giám đốc",
              img: "https://lh3.googleusercontent.com/a/ACg8ocKFrfQC0Q3FebjC6xelLaBHAoWDX6fE_mi4X3gpEA3ZkBOjTL0ang=s360-c-no",
            },
            {
              id: 2,
              title: "Ông",
              name: "Nguyễn Tiến Duy",
              role: "Giám đốc Điều hành Tài Chính Cấp Cao",
              img: TienDuy,
            },
            {
              id: 3,
              title: "Ông",
              name: "Nguyễn Viết Phương",
              role: "Giám đốc Điều Hành Nhân sự",
              img: "",
            },
            {
              id: 4,
              title: "Ông",
              name: "Nguyễn Quốc Khánh",
              role: "Giám đốc Điều hành Nghiên cứu và Phát triển",
              img: "",
            },
            {
              id: 5,
              title: "Ông",
              name: "Nguyễn Trần Nhật Long",
              role: "Giám đốc Điều hành Kinh Doanh",
              img: "",
            },
            {
              id: 6,
              title: "Ông",
              name: "Hồ Thái Sơn",
              role: "Giám đốc Điều hành Sản xuất",
              img: "",
            },
            {
              id: 7,
              title: "Ông",
              name: "Nguyễn Quang Trí",
              role: "Giám đốc Điều hành Marketing",
              img: "",
            },
          ],
        });
      } catch (error) {
        console.error("Lỗi gọi API:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  if (loading)
    return <div className="intro-page loading">Đang tải dữ liệu...</div>;

  return (
    <div className="intro-page">
      <section className="intro-hero-banner">
        <img
          src={BannerImg3}
          alt="ViDairy - Giới thiệu câu chuyện thương hiệu"
          className="intro-banner-img"
        />
      </section>

      <section className="about-philosophy">
        <div className="philosophy-header">
          <p className="sub-heading">Bản lĩnh. Đột phá</p>
          <h2 className="main-heading">GIỮ TRỌN CHẤT RIÊNG</h2>
        </div>
        <div className="philosophy-list">
          {pageData.menuItems.map((item) => (
            <div
              key={item.id}
              className="philosophy-item"
              onClick={() => scrollToSection(item.id)}
            >
              <span className="item-number">{item.num}</span>
              <span className="item-title">{item.title}</span>
            </div>
          ))}
        </div>
      </section>

      <section id="ceo-section" className="ceo-message">
        <div className="ceo-left">
          <div className="ceo-left-img">
            <h3 className="ceo-greeting">{pageData.ceoData.greeting}</h3>
            <div className="avatar-wrapper">
              <img
                src={pageData.ceoData.imgSrc}
                alt={pageData.ceoData.imgAlt}
                className="ceo-avatar-img"
              />
            </div>
            <h3 className="ceo-challenge">{pageData.ceoData.challenge}</h3>
          </div>
        </div>

        <div className="ceo-right">
          <div className="ceo-header-info">
            <h2 className="message-title">
              Thông điệp <br /> từ Tổng Giám Đốc
            </h2>
            <div className="ceo-name-block">
              <span className="ceo-name">{pageData.ceoData.name}</span>
              <span className="ceo-position">
                {pageData.ceoData.positionLine1} <br />{" "}
                {pageData.ceoData.positionLine2}
              </span>
            </div>
          </div>
          <blockquote className="ceo-quote">
            {pageData.ceoData.quote}
          </blockquote>
          <div className="ceo-body-text">
            {pageData.ceoData.paragraphs.map((text, index) => (
              <p key={index}>{text}</p>
            ))}
          </div>
        </div>
      </section>

      <section id="promise-section" className="promise-section">
        <div className="promise-left">
          <h2 className="promise-main-title">Lời hứa của ViDairy</h2>
          <div className="promise-list">
            {pageData.promises.map((p) => (
              <div key={p.num} className="promise-item">
                <div className="promise-header">
                  <h3 className="promise-title">{p.title}</h3>
                  <span className="promise-number">{p.num}</span>
                </div>
                <p className="promise-desc">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="promise-right">
          <div className="promise-img-card">
            <img src={BannerImg2} alt="Cam kết chất lượng ViDairy" />
          </div>
        </div>
      </section>

      <section id="milestones-section" className="milestones-section">
        <div className="timeline-wrapper">
          <div className="timeline-title">
            <h2>Những cột mốc không quên</h2>
          </div>
          <div className="timeline-track">
            {pageData.milestones.map((m) => (
              <div key={m.id} className="timeline-item">
                <div className="timeline-year">{m.year}</div>
                <div className="timeline-content">
                  <h3 className="timeline-item-title">{m.title}</h3>
                  <p className="timeline-desc">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="leadership-section" className="leadership-section">
        <h2 className="leadership-title">Người dẫn đường</h2>
        <div className="tab-switcher">
          <button
            type="button"
            className={`tab-btn ${activeTab === "hdqt" ? "active" : ""}`}
            onClick={() => setActiveTab("hdqt")}
          >
            HỘI ĐỒNG QUẢN TRỊ
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === "bdh" ? "active" : ""}`}
            onClick={() => setActiveTab("bdh")}
          >
            BAN ĐIỀU HÀNH
          </button>
        </div>

        {activeTab === "hdqt" && (
          <div className="tab-content active">
            <div className="hierarchy-tree">
              {/* Cấp 1: Chủ tịch HĐQT */}
              {pageData.directors.length > 0 && (
                <div className="hierarchy-level-top">
                  <div className="leader-card featured-leader">
                    <div className="leader-photo-frame">
                      {pageData.directors[0].img ? (
                        <img
                          src={pageData.directors[0].img}
                          alt={`${pageData.directors[0].title} ${pageData.directors[0].name}`}
                          className="leader-photo"
                        />
                      ) : (
                        <div className="photo-placeholder">
                          <i className="bi bi-person-fill"></i>
                        </div>
                      )}
                    </div>
                    <div className="leader-text-info">
                      <div className="member-name-row">
                        <span className="member-title">
                          {pageData.directors[0].title}
                        </span>
                        <h4 className="member-name">
                          {pageData.directors[0].name}
                        </h4>
                      </div>
                      <p className="member-role">
                        {pageData.directors[0].role}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Cấp 2: Các thành viên HĐQT bên dưới */}
              {pageData.directors.length > 1 && (
                <div className="hierarchy-level-bottom">
                  {pageData.directors.slice(1).map((member) => (
                    <div key={member.id} className="sub-leader-card">
                      <div className="sub-photo-frame">
                        {member.img ? (
                          <img
                            src={member.img}
                            alt={`${member.title} ${member.name}`}
                            className="sub-photo"
                          />
                        ) : (
                          <div className="photo-placeholder">
                            <i className="bi bi-person-fill"></i>
                          </div>
                        )}
                      </div>
                      <div className="sub-text-info">
                        <div className="member-name-row">
                          <span className="member-title">{member.title}</span>
                          <h4 className="member-name">{member.name}</h4>
                        </div>
                        <p className="member-role">{member.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "bdh" && (
          <div className="tab-content active">
            <div className="hierarchy-tree">
              {/* Cấp 1: Tổng Giám Đốc đứng đầu */}
              {pageData.executives.length > 0 && (
                <div className="hierarchy-level-top">
                  <div className="leader-card featured-leader">
                    <div className="leader-photo-frame">
                      {pageData.executives[0].img ? (
                        <img
                          src={pageData.executives[0].img}
                          alt={`${pageData.executives[0].title} ${pageData.executives[0].name}`}
                          className="leader-photo"
                        />
                      ) : (
                        <div className="photo-placeholder">
                          <i className="bi bi-person-fill"></i>
                        </div>
                      )}
                    </div>
                    <div className="leader-text-info">
                      <div className="member-name-row">
                        <span className="member-title">
                          {pageData.executives[0].title}
                        </span>
                        <h4 className="member-name">
                          {pageData.executives[0].name}
                        </h4>
                      </div>
                      <p className="member-role">
                        {pageData.executives[0].role}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Cấp 2: Các Giám Đốc Điều Hành nằm bằng nhau bên dưới */}
              {pageData.executives.length > 1 && (
                <div className="hierarchy-level-bottom">
                  {pageData.executives.slice(1).map((exec) => (
                    <div key={exec.id} className="sub-leader-card">
                      <div className="sub-photo-frame">
                        {exec.img ? (
                          <img
                            src={exec.img}
                            alt={`${exec.title} ${exec.name}`}
                            className="sub-photo"
                          />
                        ) : (
                          <div className="photo-placeholder">
                            <i className="bi bi-person-fill"></i>
                          </div>
                        )}
                      </div>
                      <div className="sub-text-info">
                        <div className="member-name-row">
                          <span className="member-title">{exec.title}</span>
                          <h4 className="member-name">{exec.name}</h4>
                        </div>
                        <p className="member-role">{exec.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
