// =========================================================================
// DỮ LIỆU 10 BÀI VIẾT TIN TỨC & KHUYẾN MÃI ĐỘC QUYỀN MỚI CHO CỬA HÀNG
// Bao gồm: 5 chương trình khuyến mãi tiêu biểu + 5 bài viết sự kiện/cẩm nang dinh dưỡng
// Hoàn toàn không sao chép nội dung từ bất kỳ trang nào bên ngoài
// =========================================================================

export const newsData = [
  // ================= 1. NĂM BÀI VIẾT TỪ MỤC THÔNG TIN KHUYẾN MÃI =================
  {
    id: "news-1",
    title: "CHÀO BẠN MỚI: TẶNG MÃ GIẢM 50.000Đ & FREESHIP ĐƠN ĐẦU TIÊN",
    date: "01/01/2026",
    categoryName: "Ưu đãi thành viên",
    imageUrl: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=700&auto=format&fit=crop&q=80",
    summary: "Đăng ký tài khoản thành viên ngay hôm nay để nhận voucher giảm 50.000đ cho đơn hàng đầu tiên cùng đặc quyền miễn phí giao hàng toàn quốc.",
    content: [
      "Chào mừng bạn đến với hệ thống phân phối sữa dinh dưỡng chính hãng! Để tri ân sự tin tưởng và đồng hành của quý khách hàng, chúng tôi trân trọng gửi tặng món quà đặc biệt dành riêng cho thành viên mới.",
      "Khi đăng ký tài khoản thành công và phát sinh đơn hàng đầu tiên từ 350.000đ, quý khách sẽ được giảm trực tiếp 50.000đ vào tổng hóa đơn bằng mã ưu đãi 'CHAO2026'. Đồng thời, đơn hàng sẽ được áp dụng chính sách miễn phí vận chuyển tiêu chuẩn trên toàn quốc.",
      "Chương trình áp dụng cho tất cả các dòng sản phẩm sữa bột, sữa non và thực phẩm dinh dưỡng bổ sung hiện có trên toàn hệ thống cửa hàng."
    ],
    author: "Ban Quản Trị Hệ Thống",
    readTime: "2 phút đọc"
  },
  {
    id: "news-2",
    title: "COMBO TIẾT KIỆM: MUA 2 LON SỮA TẶNG BỘ ĐỒ CHƠI LẮP RÁP TRÍ TUỆ",
    date: "01/04/2026",
    categoryName: "Quà tặng cho bé",
    imageUrl: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=700&auto=format&fit=crop&q=80",
    summary: "Khi mua từ 2 lon sữa dinh dưỡng bất kỳ (lon 800g trở lên), ba mẹ sẽ được tặng ngay bộ đồ chơi lắp ráp khối thông minh giúp kích thích tư duy sáng tạo của bé.",
    content: [
      "Nhằm mang đến niềm vui trọn vẹn cho bé yêu trong từng giai đoạn phát triển, chương trình quà tặng đặc biệt 'Combo Tiết Kiệm - Rinh Quà Thông Minh' chính thức khởi động trên toàn hệ thống.",
      "Với mỗi đơn hàng mua từ 2 lon sữa dinh dưỡng trọng lượng từ 800g trở lên, khách hàng sẽ nhận ngay một bộ đồ chơi lắp ghép mô hình trí tuệ bằng chất liệu nhựa ABS nguyên sinh an toàn tuyệt đối cho trẻ nhỏ (trị giá 180.000đ).",
      "Quà tặng được đóng gói cẩn thận cùng kiện hàng và gửi trực tiếp đến tay khách hàng. Số lượng quà tặng có hạn, chương trình có thể kết thúc sớm khi hết quà tại kho."
    ],
    author: "Phòng Quản Lý Khuyến Mãi",
    readTime: "3 phút đọc"
  },
  {
    id: "news-3",
    title: "NGÀY VÀNG DINH DƯỠNG: GIẢM ĐẾN 15% TOÀN BỘ SỮA MẸ & BÉ VÀO CUỐI TUẦN",
    date: "15/04/2026",
    categoryName: "Giờ vàng cuối tuần",
    imageUrl: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=700&auto=format&fit=crop&q=80",
    summary: "Săn deal chớp nhoáng mỗi cuối tuần với mức ưu đãi giảm giá lên đến 15% cho các dòng sữa dinh dưỡng công thức, sữa bầu và thực phẩm bổ sung tăng đề kháng.",
    content: [
      "Cứ vào mỗi dịp cuối tuần từ 00h00 Thứ Sáu đến 23h59 Chủ Nhật, ngày hội săn deal dinh dưỡng lại bùng nổ với hàng ngàn voucher giảm giá cực sốc dành cho mẹ và bé.",
      "Khách hàng nhập mã 'WEEKENDGOLD' khi thanh toán sẽ nhận ngay mức chiết khấu: Giảm 10% cho đơn hàng từ 600.000đ và giảm tới 15% cho đơn hàng từ 1.200.000đ.",
      "Đây là cơ hội tuyệt vời để các mẹ tích lũy nguồn sữa dinh dưỡng chất lượng cao với chi phí tiết kiệm nhất cho cả gia đình."
    ],
    author: "Khối Kinh Doanh Trực Tuyến",
    readTime: "2 phút đọc"
  },
  {
    id: "news-4",
    title: "TÍCH LŨY ĐIỂM THƯỞNG: RINH NGAY XE ĐẨY DU LỊCH & GHẾ ĂN DẶM CAO CẤP",
    date: "20/04/2026",
    categoryName: "Hội viên thân thiết",
    imageUrl: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=700&auto=format&fit=crop&q=80",
    summary: "Mỗi 10.000đ chi tiêu tích lũy ngay 1 điểm thưởng. Đổi ngay hàng ngàn phần quà giá trị cho bé như xe đẩy du lịch gấp gọn, ghế ăn dặm và nồi nấu cháo chậm.",
    content: [
      "Chương trình tích điểm hội viên thân thiết được nâng cấp với cơ chế đổi quà vô cùng hấp dẫn và tiện lợi. Mỗi lần mua hàng thành công, số điểm thưởng sẽ tự động tích lũy vào tài khoản cá nhân của bạn.",
      "Chỉ cần tích đủ điểm, bạn có thể dễ dàng quy đổi thành các sản phẩm gia dụng và đồ chơi cao cấp: Mốc 500 điểm nhận ngay ghế ăn dặm đa năng; mốc 1000 điểm nhận ngay xe đẩy du lịch siêu nhẹ gấp gọn.",
      "Quà tặng được miễn phí vận chuyển tận nhà trên phạm vi toàn quốc. Điểm thưởng có hiệu lực trong vòng 12 tháng kể từ ngày tích lũy."
    ],
    author: "Ban Chăm Sóc Hội Viên",
    readTime: "3 phút đọc"
  },
  {
    id: "news-5",
    title: "MUA SẮM AN TÂM 100%: ĐỔI TRẢ MIỄN PHÍ 7 NGÀY & TƯ VẤN DINH DƯỠNG 1:1",
    date: "25/04/2026",
    categoryName: "Đặc quyền an tâm",
    imageUrl: "https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?w=700&auto=format&fit=crop&q=80",
    summary: "Đặc quyền an tâm: Đổi trả sản phẩm miễn phí trong 7 ngày nếu bé không hợp khẩu vị cùng chương trình kết nối 1:1 với chuyên gia dinh dưỡng hướng dẫn chăm con.",
    content: [
      "Thấu hiểu nỗi lo lắng của các bậc phụ huynh khi đổi sữa mới cho bé, chúng tôi cam kết chính sách bảo trợ tiêu hóa toàn diện: Hỗ trợ đổi sản phẩm hoàn toàn miễn phí trong vòng 7 ngày nếu bé không hợp khẩu vị hoặc gặp tình trạng khó tiêu.",
      "Đồng thời, mỗi khách hàng khi mua sắm đều có quyền đặt lịch tư vấn 1:1 miễn phí cùng đội ngũ chuyên gia dinh dưỡng giàu kinh nghiệm để thiết kế thực đơn phù hợp theo từng độ tuổi của trẻ.",
      "Chúng tôi cam kết cung cấp sản phẩm 100% chính hãng, đầy đủ hóa đơn chứng từ và bảo quản trong điều kiện chuẩn nhiệt độ."
    ],
    author: "Đội Ngũ Chuyên Gia Dinh Dưỡng",
    readTime: "3 phút đọc"
  },

  // ================= 2. NĂM BÀI VIẾT TIN TỨC SỰ KIỆN & KIẾN THỨC MỚI =================
  {
    id: "news-6",
    title: "NGÀY HỘI DINH DƯỠNG MẸ & BÉ: THĂM KHÁM & ĐO VI CHẤT MIỄN PHÍ CÙNG BÁC SĨ NHI",
    date: "02/05/2026",
    categoryName: "Sự kiện cộng đồng",
    imageUrl: "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=700&auto=format&fit=crop&q=80",
    summary: "Chuỗi sự kiện 'Khởi đầu khỏe mạnh' mang đến cơ hội thăm khám chiều cao, cân nặng và xét nghiệm vi chất miễn phí cho hơn 500 bé yêu tại các chi nhánh cửa hàng.",
    content: [
      "Nhằm đồng hành cùng các bậc phụ huynh theo dõi sát sao sự tăng trưởng của con, ngày hội 'Khởi đầu khỏe mạnh' đã chính thức được tổ chức với sự tham gia của các bác sĩ chuyên khoa nhi và chuyên gia dinh dưỡng hàng đầu.",
      "Tại ngày hội, các bé được đo mật độ canxi xương, kiểm tra chiều cao, cân nặng và đánh giá chỉ số phát triển theo chuẩn WHO hoàn toàn miễn phí. Bố mẹ được tư vấn chi tiết về chế độ ăn uống, giấc ngủ và cách bổ sung sữa công thức đúng cách.",
      "Ban tổ chức cũng dành tặng hơn 500 phần quà dinh dưỡng và cẩm nang chăm sóc trẻ cho các gia đình tham gia sự kiện."
    ],
    author: "Ban Tổ Chức Sự Kiện",
    readTime: "4 phút đọc"
  },
  {
    id: "news-7",
    title: "CHÍNH THỨC RA MẮT DỊCH VỤ GIAO SỮA HỎA TỐC 2H TRONG NỘI THÀNH",
    date: "10/05/2026",
    categoryName: "Dịch vụ tiện ích",
    imageUrl: "https://images.unsplash.com/photo-1526367790999-0150786686a2?w=700&auto=format&fit=crop&q=80",
    summary: "Giải pháp cứu cánh cho mẹ bỉm bận rộn: Đặt sữa online nhận ngay trong 2 giờ tại khu vực nội thành, đảm bảo sữa luôn được bảo quản chuẩn nhiệt độ mát.",
    content: [
      "Hiểu được sự cấp thiết khi bé bất ngờ hết sữa giữa đêm hoặc mẹ bỉm quá bận rộn không thể ra ngoài mua sắm, chúng tôi chính thức triển khai dịch vụ 'Giao sữa hỏa tốc 2H'.",
      "Đội ngũ vận hành chuyên nghiệp cam kết đơn hàng sẽ được đóng gói bằng thùng chống sốc 2 lớp và giao tận tay khách hàng trong vòng 120 phút kể từ lúc xác nhận đơn trên hệ thống website.",
      "Dịch vụ áp dụng tại toàn bộ các quận nội thành, hoạt động liên tục từ 8h00 đến 21h00 mỗi ngày kể cả thứ Bảy và Chủ Nhật."
    ],
    author: "Khối Vận Hành & Logistics",
    readTime: "3 phút đọc"
  },
  {
    id: "news-8",
    title: "BÍ QUYẾT CHỌN SỮA CÔNG THỨC GIÚP BÉ TĂNG CÂN CHUẨN, TIÊU HÓA TỐT VÀ NGỪA TÁO BÓN",
    date: "18/05/2026",
    categoryName: "Cẩm nang dinh dưỡng",
    imageUrl: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=700&auto=format&fit=crop&q=80",
    summary: "Chia sẻ từ chuyên gia dinh dưỡng về các tiêu chí chọn sữa công thức: Hàm lượng đạm whey dễ tiêu, chất xơ FOS/GOS và tỷ lệ vàng Canxi/Photpho giúp bé hấp thu tối ưu.",
    content: [
      "Hệ tiêu hóa của trẻ nhỏ trong những năm đầu đời còn rất non nớt, việc chọn sữa có tỷ lệ đạm và dưỡng chất không phù hợp rất dễ dẫn đến tình trạng đầy bụng, táo bón hoặc chậm tăng cân.",
      "Các chuyên gia khuyến nghị mẹ nên ưu tiên lựa chọn dòng sữa có bổ sung đạm whey thủy phân dễ tiêu hóa, hàm lượng chất xơ kép FOS/Inulin cùng lợi khuẩn đường ruột Bifidobacterium để tạo môi trường vi sinh khỏe mạnh.",
      "Ngoài ra, việc pha sữa đúng nhiệt độ chuẩn từ 45°C - 50°C và đong đúng tỉ lệ gạt ngang của muỗng cũng đóng vai trò quyết định đến hiệu quả hấp thu dưỡng chất của con."
    ],
    author: "Bác Sĩ Trưởng Khoa Nhi",
    readTime: "5 phút đọc"
  },
  {
    id: "news-9",
    title: "CHIẾN DỊCH 'TRIỆU LY SỮA YÊU THƯƠNG': TRAO TẶNG NGUỒN DINH DƯỠNG CHO TRẺ EM VÙNG CAO",
    date: "28/05/2026",
    categoryName: "Hoạt động cộng đồng",
    imageUrl: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=700&auto=format&fit=crop&q=80",
    summary: "Hành trình mang 10.000 ly sữa dinh dưỡng cùng học bổng và áo ấm đến với các em học sinh có hoàn cảnh khó khăn tại các điểm trường vùng cao phía Bắc.",
    content: [
      "Nằm trong chuỗi hoạt động trách nhiệm xã hội thường niên, chiến dịch 'Triệu Ly Sữa Yêu Thương 2026' đã đến với các em nhỏ tại các xã vùng cao khó khăn.",
      "Hơn 1.200 thùng sữa dinh dưỡng giàu kháng thể, 500 chiếc áo ấm mùa đông cùng 50 suất học bổng đã được trao tận tay các em học sinh mầm non và tiểu học.",
      "Chúng tôi tin rằng mỗi hộp sữa trao đi không chỉ cung cấp dưỡng chất quý báu cho thể trạng của các em mà còn tiếp thêm niềm tin và nghị lực trên con đường học tập."
    ],
    author: "Ban Công Tác Xã Hội",
    readTime: "4 phút đọc"
  },
  {
    id: "news-10",
    title: "CHÍNH THỨC KHAI TRƯƠNG KHÔNG GIAN TRẢI NGHIỆM DINH DƯỠNG TIÊU CHUẨN HIỆN ĐẠI",
    date: "05/06/2026",
    categoryName: "Sự kiện thương hiệu",
    imageUrl: "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=700&auto=format&fit=crop&q=80",
    summary: "Ra mắt không gian mua sắm và tư vấn dinh dưỡng chuẩn 5 sao với khu vui chơi trẻ em, quầy pha chế trải nghiệm vị sữa miễn phí và quà tặng khai trương cực khủng.",
    content: [
      "Showroom trải nghiệm dinh dưỡng thế hệ mới chính thức mở cửa chào đón quý khách hàng đến tham quan và mua sắm trong không gian hiện đại, tiện nghi bậc nhất.",
      "Tại đây, bố mẹ sẽ được trải nghiệm các dịch vụ hoàn toàn mới: Quầy thử sữa miễn phí giúp bé chọn đúng hương vị yêu thích, khu vực vui chơi an toàn cho bé và góc tư vấn sức khỏe gia đình riêng tư cùng bác sĩ.",
      "Trong tuần lễ khai trương, 100 khách hàng đầu tiên ghé thăm mỗi ngày đều nhận được phần quà là bình giữ nhiệt cao cấp hoặc balo chống gù thời trang cho bé."
    ],
    author: "Ban Quản Lý Showroom",
    readTime: "3 phút đọc"
  }
];
