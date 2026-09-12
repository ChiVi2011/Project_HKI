// =========================================================================
// DỮ LIỆU BÀI VIẾT TIN TỨC & CẨM NANG DINH DƯỠNG ĐỘC QUYỀN VIDAIRY
// Bao gồm:
// - Bài viết tiêu điểm PAS 2060 (ID: 100)
// - Các bài viết cẩm nang dinh dưỡng chuyên sâu (ID: 1 - 6)
// - Các bài viết khuyến mãi & sự kiện cộng đồng (ID: news-1 - news-10)
// =========================================================================

import BannerImg from "../assets/img/ViDairy_banner_1527x633_full.png";

export const newsData = [
  // ================= 1. BÀI VIẾT TIÊU ĐIỂM (ID: 100) =================
  {
    id: 100,
    title: "ViDairy tiên phong đạt chứng nhận Trung hòa Carbon: Bước tiến xanh vì sức khỏe triệu gia đình Việt",
    category: "Sự kiện & Khuyến mãi",
    categoryName: "Sự kiện & Khuyến mãi",
    date: "28/08/2026",
    readTime: "5 phút đọc",
    author: "Ban Biên Tập Bền Vững ViDairy",
    authorRole: "Hội đồng Nghiên cứu & Phát triển Bền vững ViDairy",
    authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
    views: 3420,
    likes: 284,
    image: BannerImg,
    imageUrl: BannerImg,
    summary: "ViDairy tự hào trở thành doanh nghiệp sữa đầu tiên tại Việt Nam đạt chứng chỉ trung hòa Carbon PAS 2060 cho cả nhà máy và trang trại sinh thái, khẳng định cam kết phát triển bền vững và chất lượng quốc tế.",
    tags: ["Trung hòa Carbon", "Phát triển bền vững", "ViDairy Xanh", "Chứng nhận quốc tế", "PAS 2060"],
    relatedProductIds: [28, 1, 10],
    sections: [
      {
        heading: "Dấu ấn lịch sử: Doanh nghiệp sữa đầu tiên đạt chuẩn PAS 2060 tại Việt Nam",
        paragraphs: [
          "Ngày 28/08/2026, tại Trung tâm Hội nghị Quốc tế, ViDairy chính thức đón nhận chứng chỉ Trung hòa Carbon theo tiêu chuẩn quốc tế PAS 2060 do Tổ chức Tiêu chuẩn Vương quốc Anh (BSI) chứng nhận. Đây là mốc son chói lọi đánh dấu bước chuyển mình tiên phong của ngành sữa Việt Nam trên lộ trình Net Zero 2050.",
          "Tiêu chuẩn PAS 2060 đòi hỏi quy trình đánh giá và thẩm định vô cùng khắt khe về phát thải khí nhà kính (GHG) trên toàn bộ chuỗi cung ứng: Từ quy trình canh tác thức ăn chăn nuôi, vận hành trang trại sinh thái thông minh, đến dây chuyền chế biến sữa khép kín bằng năng lượng tái tạo."
        ]
      },
      {
        heading: "Hệ sinh thái nông nghiệp tuần hoàn: Không phát thải, trọn vẹn dinh dưỡng",
        paragraphs: [
          "Tại cụm trang trại sinh thái ViDairy EcoFarm, 100% chất thải hữu cơ được xử lý qua hệ thống Biogas hiện đại để tạo ra năng lượng điện phục vụ lại cho trang trại. Nước tưới được xử lý theo công nghệ màng vi sinh lọc tuần hoàn tái sử dụng 98%.",
          "Những cô bò sữa được sống trong môi trường âm nhạc êm dịu, hệ thống làm mát phun sương đối lưu tự nhiên và thực đơn cỏ Alfalfa hữu cơ kết hợp vi chất cân đối, mang lại nguồn sữa tươi nguyên liệu thuần khiết nhất."
        ],
        quote: {
          text: "Một ly sữa thật sự tốt cho sức khỏe con người phải được tạo nên từ một hệ sinh thái khỏe mạnh và một hành tinh xanh. Đó là lời cam kết của ViDairy với tương lai con trẻ.",
          author: "Đại diện Hội đồng Quản trị ViDairy"
        }
      },
      {
        heading: "Lộ trình hướng tới Net Zero: Vì sức khỏe của các thế hệ mai sau",
        paragraphs: [
          "ViDairy cam kết tiếp tục tái đầu tư 15% lợi nhuận hằng năm vào công nghệ năng lượng mặt trời áp mái, chuyển đổi 100% bao bì giấy đạt chuẩn FSC có nguồn gốc rừng trồng bền vững và giảm thiểu hạt vi nhựa.",
          "Bằng việc lựa chọn các dòng sản phẩm của ViDairy, người tiêu dùng Việt Nam không chỉ bổ sung dinh dưỡng tối ưu cho bản thân và gia đình mà còn chung tay đóng góp bảo vệ môi trường sống cho thế hệ con cháu."
        ],
        advice: {
          title: "Thông điệp xanh từ ViDairy",
          content: "Hãy cùng ViDairy phân loại vỏ hộp sữa sau khi sử dụng và mang tới các điểm tiếp nhận tái chế tại các showroom ViDairy trên toàn quốc để nhận ngay điểm thưởng 'Sống Xanh - Đổi Quà Khỏe'!"
        }
      }
    ]
  },

  // ================= 2. BÀI VIẾT DINH DƯỠNG BÉ YÊU (ID: 1) =================
  {
    id: 1,
    title: "Bí quyết bổ sung DHA và HMO giúp trẻ phát triển trí não vượt trội trong 1000 ngày đầu đời",
    category: "Dinh dưỡng bé yêu",
    categoryName: "Dinh dưỡng bé yêu",
    date: "27/08/2026",
    readTime: "4 phút đọc",
    author: "Bác Sĩ Chuyên Khoa II Nguyễn Thị Thu Hà",
    authorRole: "Trưởng Ban Cố vấn Y khoa & Dinh dưỡng Nhi ViDairy",
    authorAvatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&auto=format&fit=crop&q=80",
    views: 4520,
    likes: 395,
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80",
    imageUrl: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80",
    summary: "Khám phá các dưỡng chất vàng như DHA tinh khiết, HMO và Canxi sinh học đóng vai trò nền tảng cho sự phát triển thông minh và đề kháng khỏe mạnh của trẻ.",
    tags: ["DHA", "HMO", "Dinh dưỡng bé yêu", "Phát triển trí não", "1000 ngày đầu đời"],
    relatedProductIds: [10, 11, 12],
    sections: [
      {
        heading: "1000 ngày đầu đời: Giai đoạn vàng kiến tạo cấu trúc não bộ",
        paragraphs: [
          "Các nghiên cứu khoa học thần kinh đã chứng minh rằng 80% cấu trúc não bộ của con người được hoàn thiện trong 1000 ngày đầu đời (từ khi thụ thai đến 2 tuổi). Tại giai đoạn này, hàng triệu tế bào thần kinh kết nối với tốc độ kinh ngạc mỗi giây.",
          "DHA (Docosahexaenoic Acid) chiếm tới 20% trọng lượng của não bộ và gần 50% võng mạc mắt. Khi được cung cấp đủ DHA chuẩn tinh khiết, trẻ sẽ có khả năng quan sát nhanh nhạy, phản xạ ngôn ngữ tốt và chỉ số trí tuệ cảm xúc vượt trội."
        ]
      },
      {
        heading: "HMO - 'Lá chắn kép' bảo vệ đường ruột và tăng cường miễn dịch",
        paragraphs: [
          "HMO (Human Milk Oligosaccharides) là đại dưỡng chất nhiều thứ ba trong sữa mẹ, đóng vai trò nuôi dưỡng hệ lợi khuẩn đường ruột (Probiotics) và ngăn chặn mầm bệnh bám dính vào niêm mạc ruột.",
          "Khi đường ruột khỏe mạnh nhờ HMO (đặc biệt là 2'-FL HMO), bé sẽ tiêu hóa hấp thu dinh dưỡng trọn vẹn hơn, giảm hẳn tình trạng ốm vặt, sốt virus và táo bón sinh lý thường gặp."
        ],
        advice: {
          title: "Lời khuyên từ Bác sĩ ViDairy",
          content: "Ba mẹ nên duy trì thói quen cho bé bú mẹ hoàn toàn trong 6 tháng đầu và kết hợp các dòng sữa bổ sung bộ đôi 'DHA tảo biển tinh khiết + 2'-FL HMO' chuẩn liều lượng khuyến cáo của WHO để tạo bệ phóng vững chắc cho tương lai con."
        }
      },
      {
        heading: "Hướng dẫn bổ sung DHA đúng cách theo độ tuổi",
        paragraphs: [
          "Bên cạnh sữa công thức giàu DHA & HMO như ColosBaby Gold hay Oggi IQ, mẹ có thể bổ sung các nguồn thực phẩm tự nhiên giàu Omega-3 khi trẻ bước vào giai đoạn ăn dặm như cá hồi Na Uy, lòng đỏ trứng gà, quả bơ và dầu hạt lanh.",
          "Lưu ý: Không nên đun nấu dầu giàu DHA ở nhiệt độ quá cao vì nhiệt độ sẽ phá hủy liên kết axit béo không no quý giá này."
        ]
      }
    ]
  },

  // ================= 3. BÀI VIẾT MẸ BẦU (ID: 2) =================
  {
    id: 2,
    title: "Thực đơn dinh dưỡng khoa học cho mẹ bầu 3 tháng đầu thai kỳ: Giảm ốm nghén, con đủ chất",
    category: "Sức khỏe mẹ bầu",
    categoryName: "Sức khỏe mẹ bầu",
    date: "26/08/2026",
    readTime: "4 phút đọc",
    author: "ThS. Dược sĩ Trần Hồng Hạnh",
    authorRole: "Chuyên gia Tư vấn Chăm sóc Sức khỏe Sản khoa",
    authorAvatar: "https://images.unsplash.com/photo-1594824813589-9a7444c1c911?w=200&auto=format&fit=crop&q=80",
    views: 3890,
    likes: 312,
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop&q=80",
    imageUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop&q=80",
    summary: "Chuyên gia ViDairy chia sẻ các nguyên tắc bổ sung Acid Folic, Sắt và Vitamin nhóm B giúp mẹ vượt qua cơn nghén nhẹ nhàng và bảo vệ thai nhi tối đa.",
    tags: ["Mẹ bầu", "3 tháng đầu", "Giảm ốm nghén", "Axit Folic", "ColosBaby Mum"],
    relatedProductIds: [1, 2, 3],
    sections: [
      {
        heading: "Tầm quan trọng của dinh dưỡng 3 tháng đầu (Tam cá nguyệt thứ nhất)",
        paragraphs: [
          "3 tháng đầu là thời điểm phân chia tế bào mạnh mẽ nhất để hình thành các cơ quan trọng yếu của thai nhi: Não bộ, tủy sống, tim và hệ thần kinh trung ương. Tuy nhiên, đây cũng là giai đoạn mẹ bầu chịu đựng nhiều triệu chứng ốm nghén, buồn nôn và nhạy cảm mùi vị nhất.",
          "Nếu không có chế độ dinh dưỡng phù hợp, mẹ dễ bị sụt cân, suy nhược và thiếu hụt vi chất dẫn đến nguy cơ dị tật ống thần kinh thai nhi."
        ]
      },
      {
        heading: "Bộ ba vi chất 'vàng' không thể thiếu cho mẹ bầu",
        paragraphs: [
          "1. Axit Folic (Vitamin B9): Cần bổ sung 400 - 600 mcg mỗi ngày để ngăn ngừa tới 70% nguy cơ dị tật ống thần kinh.",
          "2. Sắt hữu cơ & Vitamin B12: Tăng cường sản sinh hồng cầu, vận chuyển oxy đi nuôi cơ thể mẹ và em bé, hạn chế hoa mắt chóng mặt.",
          "3. Kháng thể tự nhiên IgG từ sữa non: Hỗ trợ hệ miễn dịch mẹ luôn vững vàng trước các đợt cảm cúm, nhiễm khuẩn mùa lạnh mà không cần dùng thuốc kháng sinh."
        ],
        advice: {
          title: "Bí quyết khắc phục ốm nghén từ ViDairy",
          content: "Mẹ nên chia nhỏ 5 - 6 bữa ăn nhẹ trong ngày, tránh để bụng đói. Hãy uống 1 ly sữa ấm ColosBaby Mum có vị thanh mát ít ngọt vào buổi sáng và trước khi đi ngủ để vừa êm dịu dạ dày vừa nạp đủ năng lượng."
        }
      }
    ]
  },

  // ================= 4. BÀI VIẾT NGƯỜI LỚN TUỔI (ID: 3) =================
  {
    id: 3,
    title: "Giải pháp bảo vệ hệ vận động và ngăn ngừa loãng xương cho người lớn tuổi với Canxi Nano",
    category: "Người lớn & Người cao tuổi",
    categoryName: "Người lớn & Người cao tuổi",
    date: "25/08/2026",
    readTime: "5 phút đọc",
    author: "Bác Sĩ Chuyên Khoa Nội Lão Khoa Lê Văn Đức",
    authorRole: "Cố vấn Y khoa Dinh dưỡng Người cao tuổi ViDairy",
    authorAvatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&auto=format&fit=crop&q=80",
    views: 2980,
    likes: 245,
    image: "https://images.unsplash.com/photo-1528750997573-59b89d66f4f7?w=800&auto=format&fit=crop&q=80",
    imageUrl: "https://images.unsplash.com/photo-1528750997573-59b89d66f4f7?w=800&auto=format&fit=crop&q=80",
    summary: "Bổ sung Canxi kết hợp Vitamin D3 & MK7 theo tỉ lệ vàng giúp xương chắc khỏe, khớp dẻo dai và nâng cao chất lượng cuộc sống cho người cao tuổi.",
    tags: ["Người cao tuổi", "Canxi Nano", "Loãng xương", "Xương khớp", "CaloSure Gold"],
    relatedProductIds: [19, 20, 21],
    sections: [
      {
        heading: "Hiểu đúng về tốc độ mất xương sau tuổi 50",
        paragraphs: [
          "Sau độ tuổi 50, quá trình hủy xương diễn ra nhanh hơn quá trình tạo xương do sự suy giảm nội tiết tố và hấp thu vi chất ở đường tiêu hóa. Trung bình mỗi năm, mật độ xương giảm từ 1% đến 2%, khiến xương trở nên giòn xốp và dễ gãy.",
          "Những cơn đau mỏi thắt lưng, đầu gối lục cục khi lên xuống cầu thang hay chuột rút đêm là hồi chuông cảnh báo thiếu hụt Canxi trầm trọng mà nhiều người lớn tuổi thường bỏ qua."
        ]
      },
      {
        heading: "Đột phá Canxi Nano kết hợp Vitamin D3 & MK7 (Vitamin K2)",
        paragraphs: [
          "Canxi thông thường có kích thước lớn, khó hấp thu và dễ gây lắng cặn tại thận hoặc táo bón. Công nghệ Canxi Nano tại ViDairy giúp giảm kích thước phân tử xuống hàng trăm lần, tăng khả năng thẩm thấu qua thành ruột lên đến 200%.",
          "Đặc biệt, sự hiện diện của Vitamin D3 giúp dẫn truyền Canxi vào máu, còn MK7 (Vitamin K2 tự nhiên) hoạt động như 'người dẫn đường' đưa Canxi gắn thẳng vào mô xương thay vì bám vào thành mạch gây xơ vữa."
        ],
        advice: {
          title: "Chế độ sinh hoạt lành mạnh cho ông bà, cha mẹ",
          content: "Duy trì uống 2 ly sữa dinh dưỡng CaloSure Gold mỗi ngày kết hợp 20-30 phút tắm nắng sớm hoặc đi bộ nhẹ nhàng sẽ giúp duy trì hệ xương vững chắc và tinh thần thư thái."
        }
      }
    ]
  },

  // ================= 5. BÀI VIẾT SỮA HẠT & SỐNG XANH (ID: 4) =================
  {
    id: 4,
    title: "Xu hướng sống xanh: Vì sao sữa hạt thuần thực vật ViDairy Plant-Based được ưa chuộng?",
    category: "Sống khỏe & Sữa hạt",
    categoryName: "Sống khỏe & Sữa hạt",
    date: "24/08/2026",
    readTime: "3 phút đọc",
    author: "Chuyên Gia Dinh Dưỡng Thực Dưỡng Mai Anh Thư",
    authorRole: "Đại sứ Lối sống Thuần Chay ViDairy Care",
    authorAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80",
    views: 3120,
    likes: 278,
    image: "https://images.unsplash.com/photo-1559598467-f8b76c8155d0?w=800&auto=format&fit=crop&q=80",
    imageUrl: "https://images.unsplash.com/photo-1559598467-f8b76c8155d0?w=800&auto=format&fit=crop&q=80",
    summary: "Sự kết hợp hoàn hảo giữa hạt óc chó, hạnh nhân và yến mạch mang lại nguồn dinh dưỡng thanh nhẹ, giàu chất chống oxy hóa cho mọi thành viên gia đình.",
    tags: ["Sữa hạt", "Plant-Based", "Sống xanh", "Thuần thực vật", "Healthy Life"],
    relatedProductIds: [28, 19],
    sections: [
      {
        heading: "Làn sóng dinh dưỡng thực vật chinh phục gia đình hiện đại",
        paragraphs: [
          "Trong những năm gần đây, xu hướng tiêu dùng thực phẩm có nguồn gốc thực vật (Plant-based) đang phát triển mạnh mẽ trên toàn cầu. Người tiêu dùng ngày càng ưu tiên những sản phẩm vừa lành mạnh cho tim mạch, vừa thân thiện với hệ sinh thái môi trường.",
          "Sữa hạt dinh dưỡng ViDairy được tinh chọn từ 100% hạt cao cấp nhập khẩu: Óc chó Mỹ giàu Omega-3, Hạnh nhân Úc giàu Vitamin E chống lão hóa và Yến mạch nguyên cám giàu chất xơ hòa tan Beta-Glucan."
        ]
      },
      {
        heading: "Không Cholesterol, nhẹ bụng, phù hợp mọi đối tượng",
        paragraphs: [
          "Khác với sữa động vật truyền thống, sữa thực vật hoàn toàn không chứa Cholesterol và Lactose, là giải pháp hoàn hảo cho những người có hội chứng bất dung nạp đường lactose hoặc đang theo đuổi chế độ ăn kiêng thanh lọc cơ thể.",
          "Vị ngọt thanh tự nhiên từ gạo lứt nảy mầm và chà là, không thêm đường tinh luyện, đem lại cảm giác tươi mát và nhẹ nhõm sau mỗi lần thưởng thức."
        ]
      }
    ]
  },

  // ================= 6. BÀI VIẾT HOẠT ĐỘNG CỘNG ĐỒNG (ID: 5) =================
  {
    id: 5,
    title: "Hành trình 1 triệu ly sữa: ViDairy chung tay mang dinh dưỡng đến trẻ em vùng cao",
    category: "Sự kiện & Khuyến mãi",
    categoryName: "Sự kiện & Khuyến mãi",
    date: "22/08/2026",
    readTime: "4 phút đọc",
    author: "Quỹ Phát Triển Trẻ Em ViDairy",
    authorRole: "Ban Công tác Xã hội & Trách nhiệm Doanh nghiệp (CSR)",
    authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
    views: 4120,
    likes: 462,
    image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&auto=format&fit=crop&q=80",
    imageUrl: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&auto=format&fit=crop&q=80",
    summary: "Chương trình thường niên của Quỹ sữa ViDairy tiếp tục lan tỏa niềm yêu thương, mang đến những hộp sữa thơm ngon cho hơn 50.000 học sinh khó khăn.",
    tags: ["Thiện nguyện", "Triệu ly sữa", "Trẻ em vùng cao", "CSR", "Lan tỏa yêu thương"],
    relatedProductIds: [10, 28],
    sections: [
      {
        heading: "Vượt ngàn cây số mang hơi ấm dinh dưỡng tới vùng cao",
        paragraphs: [
          "Hành trình '1 Triệu Ly Sữa Cho Em 2026' đã lăn bánh qua hơn 30 điểm trường mầm non và tiểu học tại các huyện vùng cao Hà Giang, Điện Biên và Sơn La. Dù điều kiện đường sá gập ghềnh hiểm trở, đoàn tình nguyện ViDairy vẫn kiên định đưa từng kiện sữa non nguyên chất đến tận tay các em.",
          "Ánh mắt rạng rỡ và nụ cười ngây thơ của các em khi đón nhận những hộp sữa mát lành là động lực to lớn nhất cho tập thể cán bộ nhân viên ViDairy tiếp tục sứ mệnh ươm mầm sức sống."
        ]
      },
      {
        heading: "Đồng hành cùng tầm vóc Việt",
        paragraphs: [
          "Bên cạnh việc trao tặng sữa dinh dưỡng, đoàn bác sĩ ViDairy còn tổ chức các buổi khám dinh dưỡng sàng lọc, tẩy giun và hướng dẫn các cô giáo mầm non cách vệ sinh, phòng chống suy dinh dưỡng thấp còi cho học sinh bản địa.",
          "Mỗi đơn hàng của quý khách tại hệ thống cửa hàng ViDairy đều được trích 1.000đ đóng góp vào Quỹ 'Nâng Bước Trẻ Em Vùng Cao'."
        ]
      }
    ]
  },

  // ================= 7. BÀI VIẾT DỊ ỨNG ĐẠM SỮA BÒ (ID: 6) =================
  {
    id: 6,
    title: "Cách nhận biết và chăm sóc dinh dưỡng đúng cách cho trẻ bị dị ứng đạm sữa bò",
    category: "Dinh dưỡng bé yêu",
    categoryName: "Dinh dưỡng bé yêu",
    date: "20/08/2026",
    readTime: "4 phút đọc",
    author: "Bác Sĩ CKI Phạm Quỳnh Trang",
    authorRole: "Chuyên khoa Tiêu hóa - Miễn dịch Dị ứng Nhi",
    authorAvatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&auto=format&fit=crop&q=80",
    views: 3750,
    likes: 318,
    image: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=800&auto=format&fit=crop&q=80",
    imageUrl: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=800&auto=format&fit=crop&q=80",
    summary: "Bác sĩ chuyên khoa giải đáp dấu hiệu dị ứng thức ăn và hướng dẫn mẹ chọn dòng sữa thủy phân hoặc sữa đậu nành an toàn cho hệ tiêu hóa của bé.",
    tags: ["Dị ứng đạm sữa", "CMA", "Sữa thủy phân", "Tiêu hóa bé", "Dinh dưỡng chuyên sâu"],
    relatedProductIds: [10, 11],
    sections: [
      {
        heading: "Dị ứng đạm sữa bò (CMA) là gì?",
        paragraphs: [
          "Dị ứng đạm sữa bò là phản ứng miễn dịch quá mức của cơ thể trẻ với các chuỗi protein (Casein và Whey) có trong sữa bò. Tình trạng này thường biểu hiện ở khoảng 2 - 7.5% trẻ nhỏ dưới 1 tuổi.",
          "Các dấu hiệu điển hình bao gồm: Nổi mẩn đỏ quanh miệng, nôn trớ sau bú, đi ngoài phân lỏng có chất nhầy hoặc vệt máu, quấy khóc không dứt và tăng cân chậm chạp."
        ]
      },
      {
        heading: "Giải pháp dinh dưỡng an toàn cho trẻ dị ứng đạm sữa bò",
        paragraphs: [
          "1. Sữa mẹ vẫn là lựa chọn số 1: Mẹ cần kiêng toàn bộ các sản phẩm từ sữa bò trong chế độ ăn hằng ngày của mình.",
          "2. Sữa công thức đạm thủy phân toàn phần (eHF): Các phân tử đạm đã được bẻ gãy thành các đoạn peptide siêu nhỏ, hệ miễn dịch của trẻ không nhận diện là dị nguyên gây phản ứng.",
          "3. Sữa công thức axit amin tự do (AAF): Dành cho các bé có mức độ dị ứng nặng hoặc không đáp ứng với sữa đạm thủy phân toàn phần."
        ],
        advice: {
          title: "Lưu ý sống còn từ Bác sĩ",
          content: "Không tự ý cho trẻ dùng sữa dê hoặc sữa đậu nành mà chưa tham vấn ý kiến bác sĩ, bởi tỉ lệ dị ứng chéo giữa sữa dê và sữa bò lên đến hơn 90%."
        }
      }
    ]
  },

  // ================= 8. CÁC BÀI VIẾT TỪ KHUYẾN MÃI & ƯU ĐÃI (ID: news-1 đến news-10) =================
  {
    id: "news-1",
    title: "CHÀO BẠN MỚI: TẶNG MÃ GIẢM 50.000Đ & FREESHIP ĐƠN ĐẦU TIÊN",
    date: "01/01/2026",
    category: "Ưu đãi thành viên",
    categoryName: "Ưu đãi thành viên",
    imageUrl: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=700&auto=format&fit=crop&q=80",
    image: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=700&auto=format&fit=crop&q=80",
    summary: "Đăng ký tài khoản thành viên ngay hôm nay để nhận voucher giảm 50.000đ cho đơn hàng đầu tiên cùng đặc quyền miễn phí giao hàng toàn quốc.",
    author: "Ban Quản Trị Hệ Thống ViDairy",
    authorRole: "Bộ phận Chăm sóc Khách hàng & Hội viên",
    readTime: "2 phút đọc",
    views: 1850,
    likes: 195,
    tags: ["Khuyến mãi", "Thành viên mới", "Freeship", "Voucher"],
    relatedProductIds: [1, 10, 19],
    sections: [
      {
        heading: "Đặc quyền dành riêng cho khách hàng mới",
        paragraphs: [
          "Chào mừng bạn đến với hệ thống phân phối sữa dinh dưỡng chính hãng ViDairy! Để tri ân sự tin tưởng và đồng hành của quý khách hàng, chúng tôi trân trọng gửi tặng món quà đặc biệt dành riêng cho thành viên mới.",
          "Khi đăng ký tài khoản thành công và phát sinh đơn hàng đầu tiên từ 350.000đ, quý khách sẽ được giảm trực tiếp 50.000đ vào tổng hóa đơn bằng mã ưu đãi 'CHAO2026'. Đồng thời, đơn hàng sẽ được áp dụng chính sách miễn phí vận chuyển tiêu chuẩn trên toàn quốc.",
          "Chương trình áp dụng cho tất cả các dòng sản phẩm sữa bột, sữa non và thực phẩm dinh dưỡng bổ sung hiện có trên toàn hệ thống cửa hàng."
        ]
      }
    ]
  },
  {
    id: "news-2",
    title: "COMBO TIẾT KIỆM: MUA 2 LON SỮA TẶNG BỘ ĐỒ CHƠI LẮP RÁP TRÍ TUỆ",
    date: "01/04/2026",
    category: "Quà tặng cho bé",
    categoryName: "Quà tặng cho bé",
    imageUrl: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=700&auto=format&fit=crop&q=80",
    image: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=700&auto=format&fit=crop&q=80",
    summary: "Khi mua từ 2 lon sữa dinh dưỡng bất kỳ (lon 800g trở lên), ba mẹ sẽ được tặng ngay bộ đồ chơi lắp ráp khối thông minh giúp kích thích tư duy sáng tạo của bé.",
    author: "Phòng Quản Lý Khuyến Mãi",
    authorRole: "Ban Khuyến mại & Sự kiện",
    readTime: "3 phút đọc",
    views: 2150,
    likes: 210,
    tags: ["Combo tiết kiệm", "Quà tặng bé", "Đồ chơi trí tuệ", "Khuyến mãi"],
    relatedProductIds: [10, 11],
    sections: [
      {
        heading: "Rinh quà thông minh cùng ViDairy",
        paragraphs: [
          "Nhằm mang đến niềm vui trọn vẹn cho bé yêu trong từng giai đoạn phát triển, chương trình quà tặng đặc biệt 'Combo Tiết Kiệm - Rinh Quà Thông Minh' chính thức khởi động trên toàn hệ thống.",
          "Với mỗi đơn hàng mua từ 2 lon sữa dinh dưỡng trọng lượng từ 800g trở lên, khách hàng sẽ nhận ngay một bộ đồ chơi lắp ghép mô hình trí tuệ bằng chất liệu nhựa ABS nguyên sinh an toàn tuyệt đối cho trẻ nhỏ (trị giá 180.000đ).",
          "Quà tặng được đóng gói cẩn thận cùng kiện hàng và gửi trực tiếp đến tay khách hàng. Số lượng quà tặng có hạn, chương trình có thể kết thúc sớm khi hết quà tại kho."
        ]
      }
    ]
  },
  {
    id: "news-3",
    title: "NGÀY VÀNG DINH DƯỠNG: GIẢM ĐẾN 15% TOÀN BỘ SỮA MẸ & BÉ VÀO CUỐI TUẦN",
    date: "15/04/2026",
    category: "Giờ vàng cuối tuần",
    categoryName: "Giờ vàng cuối tuần",
    imageUrl: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=700&auto=format&fit=crop&q=80",
    image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=700&auto=format&fit=crop&q=80",
    summary: "Săn deal chớp nhoáng mỗi cuối tuần với mức ưu đãi giảm giá lên đến 15% cho các dòng sữa dinh dưỡng công thức, sữa bầu và thực phẩm bổ sung tăng đề kháng.",
    author: "Khối Kinh Doanh Trực Tuyến",
    authorRole: "Phòng Thương Mại Điện Tử",
    readTime: "2 phút đọc",
    views: 1650,
    likes: 180,
    tags: ["Giờ vàng", "Cuối tuần", "Flash sale", "Giảm 15%"],
    relatedProductIds: [1, 10],
    sections: [
      {
        heading: "Đại tiệc ưu đãi cuối tuần",
        paragraphs: [
          "Cứ vào mỗi dịp cuối tuần từ 00h00 Thứ Sáu đến 23h59 Chủ Nhật, ngày hội săn deal dinh dưỡng lại bùng nổ với hàng ngàn voucher giảm giá cực sốc dành cho mẹ và bé.",
          "Khách hàng nhập mã 'WEEKENDGOLD' khi thanh toán sẽ nhận ngay mức chiết khấu: Giảm 10% cho đơn hàng từ 600.000đ và giảm tới 15% cho đơn hàng từ 1.200.000đ.",
          "Đây là cơ hội tuyệt vời để các mẹ tích lũy nguồn sữa dinh dưỡng chất lượng cao với chi phí tiết kiệm nhất cho cả gia đình."
        ]
      }
    ]
  },
  {
    id: "news-4",
    title: "TÍCH LŨY ĐIỂM THƯỞNG: RINH NGAY XE ĐẨY DU LỊCH & GHẾ ĂN DẶM CAO CẤP",
    date: "20/04/2026",
    category: "Hội viên thân thiết",
    categoryName: "Hội viên thân thiết",
    imageUrl: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=700&auto=format&fit=crop&q=80",
    image: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=700&auto=format&fit=crop&q=80",
    summary: "Mỗi 10.000đ chi tiêu tích lũy ngay 1 điểm thưởng. Đổi ngay hàng ngàn phần quà giá trị cho bé như xe đẩy du lịch gấp gọn, ghế ăn dặm và nồi nấu cháo chậm.",
    author: "Ban Chăm Sóc Hội Viên",
    authorRole: "Trung tâm Loyalty ViDairy",
    readTime: "3 phút đọc",
    views: 1980,
    likes: 174,
    tags: ["Tích điểm", "Đổi quà", "Xe đẩy", "Ghế ăn dặm"],
    relatedProductIds: [10, 28],
    sections: [
      {
        heading: "Cơ chế tích điểm linh hoạt",
        paragraphs: [
          "Chương trình tích điểm hội viên thân thiết được nâng cấp với cơ chế đổi quà vô cùng hấp dẫn và tiện lợi. Mỗi lần mua hàng thành công, số điểm thưởng sẽ tự động tích lũy vào tài khoản cá nhân của bạn.",
          "Chỉ cần tích đủ điểm, bạn có thể dễ dàng quy đổi thành các sản phẩm gia dụng và đồ chơi cao cấp: Mốc 500 điểm nhận ngay ghế ăn dặm đa năng; mốc 1000 điểm nhận ngay xe đẩy du lịch siêu nhẹ gấp gọn.",
          "Quà tặng được miễn phí vận chuyển tận nhà trên phạm vi toàn quốc. Điểm thưởng có hiệu lực trong vòng 12 tháng kể từ ngày tích lũy."
        ]
      }
    ]
  },
  {
    id: "news-5",
    title: "MUA SẮM AN TÂM 100%: ĐỔI TRẢ MIỄN PHÍ 7 NGÀY & TƯ VẤN DINH DƯỠNG 1:1",
    date: "25/04/2026",
    category: "Đặc quyền an tâm",
    categoryName: "Đặc quyền an tâm",
    imageUrl: "https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?w=700&auto=format&fit=crop&q=80",
    image: "https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?w=700&auto=format&fit=crop&q=80",
    summary: "Đặc quyền an tâm: Đổi trả sản phẩm miễn phí trong 7 ngày nếu bé không hợp khẩu vị cùng chương trình kết nối 1:1 với chuyên gia dinh dưỡng hướng dẫn chăm con.",
    author: "Đội Ngũ Chuyên Gia Dinh Dưỡng",
    authorRole: "Phòng Dịch vụ Khách hàng",
    readTime: "3 phút đọc",
    views: 2310,
    likes: 220,
    tags: ["Đổi trả 7 ngày", "Tư vấn 1:1", "Cam kết chính hãng", "An tâm mua sắm"],
    relatedProductIds: [1, 10],
    sections: [
      {
        heading: "Cam kết đồng hành trọn đời cùng mẹ và bé",
        paragraphs: [
          "Thấu hiểu nỗi lo lắng của các bậc phụ huynh khi đổi sữa mới cho bé, chúng tôi cam kết chính sách bảo trợ tiêu hóa toàn diện: Hỗ trợ đổi sản phẩm hoàn toàn miễn phí trong vòng 7 ngày nếu bé không hợp khẩu vị hoặc gặp tình trạng khó tiêu.",
          "Đồng thời, mỗi khách hàng khi mua sắm đều có quyền đặt lịch tư vấn 1:1 miễn phí cùng đội ngũ chuyên gia dinh dưỡng giàu kinh nghiệm để thiết kế thực đơn phù hợp theo từng độ tuổi của trẻ.",
          "Chúng tôi cam kết cung cấp sản phẩm 100% chính hãng, đầy đủ hóa đơn chứng từ và bảo quản trong điều kiện chuẩn nhiệt độ mát."
        ]
      }
    ]
  },
  {
    id: "news-6",
    title: "NGÀY HỘI DINH DƯỠNG MẸ & BÉ: THĂM KHÁM & ĐO VI CHẤT MIỄN PHÍ CÙNG BÁC SĨ NHI",
    date: "02/05/2026",
    category: "Sự kiện cộng đồng",
    categoryName: "Sự kiện cộng đồng",
    imageUrl: "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=700&auto=format&fit=crop&q=80",
    image: "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=700&auto=format&fit=crop&q=80",
    summary: "Chuỗi sự kiện 'Khởi đầu khỏe mạnh' mang đến cơ hội thăm khám chiều cao, cân nặng và xét nghiệm vi chất miễn phí cho hơn 500 bé yêu tại các chi nhánh cửa hàng.",
    author: "Ban Tổ Chức Sự Kiện",
    authorRole: "Phòng Truyền thông & Sự kiện ViDairy",
    readTime: "4 phút đọc",
    views: 2450,
    likes: 260,
    tags: ["Ngày hội dinh dưỡng", "Khám miễn phí", "Bác sĩ nhi", "Sự kiện"],
    relatedProductIds: [10, 28],
    sections: [
      {
        heading: "Ngày hội sức khỏe cho cộng đồng",
        paragraphs: [
          "Nhằm đồng hành cùng các bậc phụ huynh theo dõi sát sao sự tăng trưởng của con, ngày hội 'Khởi đầu khỏe mạnh' đã chính thức được tổ chức với sự tham gia của các bác sĩ chuyên khoa nhi và chuyên gia dinh dưỡng hàng đầu.",
          "Tại ngày hội, các bé được đo mật độ canxi xương, kiểm tra chiều cao, cân nặng và đánh giá chỉ số phát triển theo chuẩn WHO hoàn toàn miễn phí. Bố mẹ được tư vấn chi tiết về chế độ ăn uống, giấc ngủ và cách bổ sung sữa công thức đúng cách.",
          "Ban tổ chức cũng dành tặng hơn 500 phần quà dinh dưỡng và cẩm nang chăm sóc trẻ cho các gia đình tham gia sự kiện."
        ]
      }
    ]
  },
  {
    id: "news-7",
    title: "CHÍNH THỨC RA MẮT DỊCH VỤ GIAO SỮA HỎA TỐC 2H TRONG NỘI THÀNH",
    date: "10/05/2026",
    category: "Dịch vụ tiện ích",
    categoryName: "Dịch vụ tiện ích",
    imageUrl: "https://images.unsplash.com/photo-1526367790999-0150786686a2?w=700&auto=format&fit=crop&q=80",
    image: "https://images.unsplash.com/photo-1526367790999-0150786686a2?w=700&auto=format&fit=crop&q=80",
    summary: "Giải pháp cứu cánh cho mẹ bỉm bận rộn: Đặt sữa online nhận ngay trong 2 giờ tại khu vực nội thành, đảm bảo sữa luôn được bảo quản chuẩn nhiệt độ mát.",
    author: "Khối Vận Hành & Logistics",
    authorRole: "Trung tâm Điều vận ViDairy Express",
    readTime: "3 phút đọc",
    views: 1820,
    likes: 190,
    tags: ["Giao hàng 2h", "Hỏa tốc", "Tiện ích bỉm sữa", "Freeship"],
    relatedProductIds: [10, 1],
    sections: [
      {
        heading: "Tốc độ và chất lượng bảo quản vượt trội",
        paragraphs: [
          "Hiểu được sự cấp thiết khi bé bất ngờ hết sữa giữa đêm hoặc mẹ bỉm quá bận rộn không thể ra ngoài mua sắm, chúng tôi chính thức triển khai dịch vụ 'Giao sữa hỏa tốc 2H'.",
          "Đội ngũ vận hành chuyên nghiệp cam kết đơn hàng sẽ được đóng gói bằng thùng chống sốc 2 lớp và giao tận tay khách hàng trong vòng 120 phút kể từ lúc xác nhận đơn trên hệ thống website.",
          "Dịch vụ áp dụng tại toàn bộ các quận nội thành, hoạt động liên tục từ 8h00 đến 21h00 mỗi ngày kể cả thứ Bảy và Chủ Nhật."
        ]
      }
    ]
  },
  {
    id: "news-8",
    title: "BÍ QUYẾT CHỌN SỮA CÔNG THỨC GIÚP BÉ TĂNG CÂN CHUẨN, TIÊU HÓA TỐT VÀ NGỪA TÁO BÓN",
    date: "18/05/2026",
    category: "Cẩm nang dinh dưỡng",
    categoryName: "Cẩm nang dinh dưỡng",
    imageUrl: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=700&auto=format&fit=crop&q=80",
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=700&auto=format&fit=crop&q=80",
    summary: "Chia sẻ từ chuyên gia dinh dưỡng về các tiêu chí chọn sữa công thức: Hàm lượng đạm whey dễ tiêu, chất xơ FOS/GOS và tỷ lệ vàng Canxi/Photpho giúp bé hấp thu tối ưu.",
    author: "Bác Sĩ Trưởng Khoa Nhi",
    authorRole: "Hội Đồng Khoa Học ViDairy",
    readTime: "5 phút đọc",
    views: 3100,
    likes: 330,
    tags: ["Tăng cân chuẩn", "Ngừa táo bón", "Đạm Whey", "Chất xơ FOS", "ColosBaby"],
    relatedProductIds: [10, 11, 12],
    sections: [
      {
        heading: "Tại sao bé hay bị táo bón khi dùng sữa công thức?",
        paragraphs: [
          "Hệ tiêu hóa của trẻ nhỏ trong những năm đầu đời còn rất non nớt, việc chọn sữa có tỷ lệ đạm và dưỡng chất không phù hợp rất dễ dẫn đến tình trạng đầy bụng, táo bón hoặc chậm tăng cân.",
          "Các chuyên gia khuyến nghị mẹ nên ưu tiên lựa chọn dòng sữa có bổ sung đạm whey thủy phân dễ tiêu hóa, hàm lượng chất xơ kép FOS/Inulin cùng lợi khuẩn đường ruột Bifidobacterium để tạo môi trường vi sinh khỏe mạnh.",
          "Ngoài ra, việc pha sữa đúng nhiệt độ chuẩn từ 45°C - 50°C và đong đúng tỉ lệ gạt ngang của muỗng cũng đóng vai trò quyết định đến hiệu quả hấp thu dưỡng chất của con."
        ]
      }
    ]
  },
  {
    id: "news-9",
    title: "CHIẾN DỊCH 'TRIỆU LY SỮA YÊU THƯƠNG': TRAO TẶNG NGUỒN DINH DƯỠNG CHO TRẺ EM VÙNG CAO",
    date: "28/05/2026",
    category: "Hoạt động cộng đồng",
    categoryName: "Hoạt động cộng đồng",
    imageUrl: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=700&auto=format&fit=crop&q=80",
    image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=700&auto=format&fit=crop&q=80",
    summary: "Hành trình mang 10.000 ly sữa dinh dưỡng cùng học bổng và áo ấm đến với các em học sinh có hoàn cảnh khó khăn tại các điểm trường vùng cao phía Bắc.",
    author: "Ban Công Tác Xã Hội",
    authorRole: "Quỹ Thiện Nguyện ViDairy Vì Trẻ Thơ",
    readTime: "4 phút đọc",
    views: 2890,
    likes: 350,
    tags: ["Từ thiện", "Học sinh vùng cao", "Triệu ly sữa", "Cộng đồng"],
    relatedProductIds: [10, 28],
    sections: [
      {
        heading: "Hành trình thắp sáng niềm tin",
        paragraphs: [
          "Nằm trong chuỗi hoạt động trách nhiệm xã hội thường niên, chiến dịch 'Triệu Ly Sữa Yêu Thương 2026' đã đến với các em nhỏ tại các xã vùng cao khó khăn.",
          "Hơn 1.200 thùng sữa dinh dưỡng giàu kháng thể, 500 chiếc áo ấm mùa đông cùng 50 suất học bổng đã được trao tận tay các em học sinh mầm non và tiểu học.",
          "Chúng tôi tin rằng mỗi hộp sữa trao đi không chỉ cung cấp dưỡng chất quý báu cho thể trạng của các em mà còn tiếp thêm niềm tin và nghị lực trên con đường học tập."
        ]
      }
    ]
  },
  {
    id: "news-10",
    title: "CHÍNH THỨC KHAI TRƯƠNG KHÔNG GIAN TRẢI NGHIỆM DINH DƯỠNG TIÊU CHUẨN HIỆN ĐẠI",
    date: "05/06/2026",
    category: "Sự kiện thương hiệu",
    categoryName: "Sự kiện thương hiệu",
    imageUrl: "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=700&auto=format&fit=crop&q=80",
    image: "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=700&auto=format&fit=crop&q=80",
    summary: "Ra mắt không gian mua sắm và tư vấn dinh dưỡng chuẩn 5 sao với khu vui chơi trẻ em, quầy pha chế trải nghiệm vị sữa miễn phí và quà tặng khai trương cực khủng.",
    author: "Ban Quản Lý Showroom",
    authorRole: "Phòng Trải nghiệm Khách hàng ViDairy",
    readTime: "3 phút đọc",
    views: 2670,
    likes: 290,
    tags: ["Khai trương", "Showroom 5 sao", "Trải nghiệm miễn phí", "ViDairy Flagship"],
    relatedProductIds: [1, 10, 19, 28],
    sections: [
      {
        heading: "Không gian mua sắm và trải nghiệm đẳng cấp",
        paragraphs: [
          "Showroom trải nghiệm dinh dưỡng thế hệ mới chính thức mở cửa chào đón quý khách hàng đến tham quan và mua sắm trong không gian hiện đại, tiện nghi bậc nhất.",
          "Tại đây, bố mẹ sẽ được trải nghiệm các dịch vụ hoàn toàn mới: Quầy thử sữa miễn phí giúp bé chọn đúng hương vị yêu thích, khu vực vui chơi an toàn cho bé và góc tư vấn sức khỏe gia đình riêng tư cùng bác sĩ.",
          "Trong tuần lễ khai trương, 100 khách hàng đầu tiên ghé thăm mỗi ngày đều nhận được phần quà là bình giữ nhiệt cao cấp hoặc balo chống gù thời trang cho bé."
        ]
      }
    ]
  }
];

// =========================================================================
// CÁC HÀM TIỆN ÍCH TRA CỨU DỮ LIỆU TIN TỨC (HELPERS)
// =========================================================================

/**
 * Tìm kiếm bài viết theo ID linh hoạt (hỗ trợ cả number, string, id tùy biến hoặc slug)
 */
export function getNewsById(id) {
  if (!id) return null;
  const targetIdStr = String(id).trim().toLowerCase();

  return (
    newsData.find((item) => {
      const itemIdStr = String(item.id).trim().toLowerCase();
      if (itemIdStr === targetIdStr) return true;
      if (item._id && String(item._id).trim().toLowerCase() === targetIdStr) return true;
      // Trích xuất số nếu id là "news-1" vs 1
      const itemNumeric = itemIdStr.replace(/\D/g, "");
      const targetNumeric = targetIdStr.replace(/\D/g, "");
      if (itemNumeric && targetNumeric && itemNumeric === targetNumeric) return true;
      return false;
    }) || null
  );
}

/**
 * Lấy danh sách các bài viết liên quan theo cùng danh mục
 */
export function getRelatedNews(category, currentId, limit = 3) {
  const currentIdStr = String(currentId).trim().toLowerCase();
  const matched = newsData.filter((item) => {
    if (String(item.id).trim().toLowerCase() === currentIdStr) return false;
    if (!category || category === "Tất cả") return true;
    return (
      (item.category && item.category.toLowerCase() === category.toLowerCase()) ||
      (item.categoryName && item.categoryName.toLowerCase() === category.toLowerCase())
    );
  });

  if (matched.length >= limit) return matched.slice(0, limit);
  // Nếu chưa đủ limit, lấy thêm các bài viết khác ngoài bài hiện tại
  const fallback = newsData.filter(
    (item) =>
      String(item.id).trim().toLowerCase() !== currentIdStr &&
      !matched.some((m) => m.id === item.id)
  );
  return [...matched, ...fallback].slice(0, limit);
}

/**
 * Lấy toàn bộ danh sách bài viết
 */
export function getAllNews() {
  return newsData;
}
