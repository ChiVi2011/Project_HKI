import cauBeImg from "../assets/img/cau_be_vidaiary.png";
import meBauImg from "../assets/img/me-bau_vidaiary.png";
import ongBaImg from "../assets/img/ong_ba_vidairy.png";
import suaHatImg from "../assets/img/sua_hat_vidairy.png";

export const CATEGORIES_DATA = [
  {
    id: "tre-em",
    name: "Sản phẩm Trẻ Em",
    slug: "tre-em",
    tagline: "Vững vàng đề kháng - Thông minh vượt trội",
    description:
      "Dòng sản phẩm dinh dưỡng chuyên biệt cho trẻ sơ sinh và trẻ nhỏ, bổ sung tổ hợp DHA tinh khiết, 2'-FL HMO, Canxi sinh học và hơn 30 vi chất thiết yếu theo chuẩn quốc tế CODEX.",
    image: cauBeImg,
    heroBadge: "Bán chạy #1",
    targetAge: "0 - 12 tuổi",
    keyBenefits: [
      "Phát triển trí não & thị giác tối ưu (DHA, ARA, Choline)",
      "Hệ miễn dịch khỏe mạnh nhờ đại dưỡng chất 2'-FL HMO & Kẽm",
      "Phát triển chiều cao và khung xương vững chắc (Canxi Nano & D3, K2)",
      "Hệ tiêu hóa êm dịu, ngừa táo bón với chất xơ hòa tan FOS/Inulin",
    ],
  },
  {
    id: "me-bau",
    name: "Sản phẩm Mẹ Bầu",
    slug: "me-bau",
    tagline: "Mẹ tròn con vuông - Dinh dưỡng trọn vẹn thai kỳ",
    description:
      "Công thức ít béo, vị thanh nhạt tự nhiên giúp mẹ giảm nghén hiệu quả, bổ sung Acid Folic, Sắt hữu cơ và Canxi không gây nóng trong, cung cấp dưỡng chất vàng cho thai nhi phát triển toàn diện.",
    image: meBauImg,
    heroBadge: "Khuyên dùng bởi bác sĩ",
    targetAge: "Phụ nữ chuẩn bị mang thai, mang thai & cho con bú",
    keyBenefits: [
      "Ngừa dị tật ống thần kinh thai nhi với 100% nhu cầu Acid Folic",
      "Sắt hữu cơ không táo bón, phòng ngừa thiếu máu thai kỳ",
      "Bổ sung Canxi & Magie chống chuột rút cho mẹ, tạo khung xương cho con",
      "Hàm lượng đường thấp, kiểm soát tốt chỉ số đường huyết thai kỳ",
    ],
  },
  {
    id: "nguoi-lon",
    name: "Sản phẩm Người Lớn & Người Cao Tuổi",
    slug: "nguoi-lon",
    tagline: "Khớp dẻo xương chắc - Sống khỏe mỗi ngày",
    description:
      "Giải pháp dinh dưỡng y học phục hồi thể lực, bảo vệ hệ tim mạch và ngăn ngừa loãng xương cho người trưởng thành, người trung niên và người cao tuổi.",
    image: ongBaImg,
    heroBadge: "Công thức y học",
    targetAge: "Người từ 30 tuổi trở lên & Người cao tuổi",
    keyBenefits: [
      "Tỉ lệ Canxi, Phospho & Vitamin D3 chuẩn giúp tái tạo mật độ xương",
      "Collagen thủy phân & Glucosamine nuôi dưỡng sụn khớp trơn tru",
      "Chất béo không no MUFA, PUFA tốt cho tim mạch và huyết áp",
      "Hỗ trợ giấc ngủ sâu và tăng cảm giác ngon miệng với tổ hợp Kẽm & Magie",
    ],
  },
  {
    id: "sua-hat",
    name: "Sản phẩm Sữa Hạt Tự Nhiên",
    slug: "sua-hat",
    tagline: "Dinh dưỡng thuần thực vật - Sống lành an nhiên",
    description:
      "100% nguyên liệu hạt organic chọn lọc (Óc chó, Hạnh nhân, Yến mạch, Đậu nành không biến đổi gen), không chất bảo quản, giữ trọn hương vị bùi béo tự nhiên và nguồn chất xơ dồi dào.",
    image: suaHatImg,
    heroBadge: "100% Organic Plant-Based",
    targetAge: "Mọi lứa tuổi trong gia đình",
    keyBenefits: [
      "Giàu Omega 3-6-9 tốt cho não bộ và chống lão hóa da",
      "Chất xơ tự nhiên dồi dào hỗ trợ vóc dáng thon gọn và hệ tiêu hóa khỏe",
      "Hoàn toàn không Lactose, an toàn cho người bất dung nạp đường sữa",
      "Nguồn gốc thuần thực vật, thân thiện với môi trường",
    ],
  },
];

export const PRODUCTS_DATA = [
  // Nhóm 1: Trẻ em
  {
    id: 1,
    name: "Sữa Bột ViDairy Opti-Grow Số 1 (0-12 Tháng)",
    category: "tre-em",
    categoryName: "Sản phẩm Trẻ Em",
    price: 495000,
    originalPrice: 550000,
    rating: 4.9,
    reviewsCount: 128,
    image: cauBeImg,
    badge: "Bán chạy",
    discount: "-10%",
    unit: "Lon 800g",
    volumes: [
      { label: "Lon 400g", price: 265000 },
      { label: "Lon 800g", price: 495000 },
      { label: "Thùng 6 lon 800g", price: 2850000 },
    ],
    summary:
      "Sữa bột công thức cao cấp bổ sung 2'-FL HMO, DHA tinh khiết từ vi tảo và Canxi Nano giúp trẻ sơ sinh tiêu hóa êm dịu, ngủ ngon và tăng cân khỏe mạnh.",
    description:
      "ViDairy Opti-Grow Số 1 được nghiên cứu bởi Viện Dinh Dưỡng Quốc Tế, mô phỏng cấu trúc dưỡng chất vàng trong sữa mẹ. Với hệ dưỡng chất Synbiotic kết hợp giữa Prebiotic (FOS/GOS) và Probiotic BB-12, sản phẩm giúp thiết lập hệ vi sinh đường ruột khỏe mạnh, giảm đến 70% nguy cơ nhiễm khuẩn đường ruột và táo bón ở trẻ nhỏ.",
    nutritionFacts: [
      { name: "Năng lượng", value: "512 kcal / 100g" },
      { name: "DHA & ARA", value: "85 mg / 100g" },
      { name: "2'-FL HMO", value: "180 mg / 100g" },
      { name: "Canxi sinh học", value: "480 mg / 100g" },
      { name: "Vitamin D3", value: "320 IU / 100g" },
      { name: "Chất xơ hòa tan FOS", value: "3.2 g / 100g" },
    ],
    instructions:
      "Rửa tay và tiệt trùng dụng cụ pha. Đun sôi nước sạch và để nguội đến khoảng 40-50°C. Pha 1 muỗng gạt ngang với 30ml nước ấm. Đậy nắp và lắc đều đến khi tan hoàn toàn.",
  },
  {
    id: 2,
    name: "Sữa Nước Tiệt Trùng ViDairy Kids IQ Thùng 48 Hộp",
    category: "tre-em",
    categoryName: "Sản phẩm Trẻ Em",
    price: 360000,
    originalPrice: 395000,
    rating: 4.8,
    reviewsCount: 95,
    image: cauBeImg,
    badge: "Yêu thích",
    discount: "-9%",
    unit: "Thùng 48 hộp 180ml",
    volumes: [
      { label: "Lốc 4 hộp 110ml", price: 32000 },
      { label: "Lốc 4 hộp 180ml", price: 48000 },
      { label: "Thùng 48 hộp 180ml", price: 360000 },
    ],
    summary:
      "Sữa tươi tiệt trùng thơm ngon giàu DHA, Choline, Vitamin A và Canxi hỗ trợ trẻ từ 1 tuổi học hỏi nhanh, sáng mắt và dồi dào năng lượng đến trường.",
    description:
      "Sữa dinh dưỡng ViDairy Kids IQ chiết xuất 100% từ nguồn sữa bò tươi trang trại sinh thái đạt chuẩn Green Farm. Sản phẩm được bổ sung tăng cường Vitamin A, D3, K2 và khoáng chất, đóng gói tiện lợi cho bé mang theo đi học hoặc vui chơi hàng ngày.",
    nutritionFacts: [
      { name: "Năng lượng", value: "78 kcal / 100ml" },
      { name: "Chất đạm", value: "3.1 g / 100ml" },
      { name: "Canxi", value: "125 mg / 100ml" },
      { name: "DHA", value: "15 mg / 100ml" },
      { name: "Vitamin A", value: "210 IU / 100ml" },
    ],
    instructions:
      "Lắc đều trước khi uống. Ngon hơn khi uống lạnh. Dùng 2-3 hộp mỗi ngày.",
  },

  // Nhóm 2: Mẹ bầu
  {
    id: 3,
    name: "Sữa Dinh Dưỡng ViDairy Mama Care Vị Vani Thanh",
    category: "me-bau",
    categoryName: "Sản phẩm Mẹ Bầu",
    price: 435000,
    originalPrice: 470000,
    rating: 4.9,
    reviewsCount: 84,
    image: meBauImg,
    badge: "Bác sĩ khuyên dùng",
    discount: "-7%",
    unit: "Lon 900g",
    volumes: [
      { label: "Lon 400g", price: 235000 },
      { label: "Lon 900g", price: 435000 },
    ],
    summary:
      "Công thức vàng cho phụ nữ mang thai: Giàu Acid Folic, Sắt hữu cơ, Canxi và DHA tinh khiết, giảm ốm nghén và kiểm soát đường huyết tối ưu.",
    description:
      "ViDairy Mama Care là nguồn dinh dưỡng cân bằng và lành mạnh cho mẹ bầu. Nhờ công nghệ khử béo hiện đại và vị ngọt thanh chiết xuất từ cỏ ngọt tự nhiên, mẹ bầu uống không bị ngấy, hấp thu trọn vẹn dưỡng chất nuôi thai nhi khỏe mạnh mà không lo tăng cân quá mức sau sinh.",
    nutritionFacts: [
      { name: "Năng lượng", value: "398 kcal / 100g" },
      { name: "Acid Folic", value: "620 mcg / 100g" },
      { name: "Sắt hữu cơ", value: "24 mg / 100g" },
      { name: "Canxi", value: "1100 mg / 100g" },
      { name: "DHA", value: "70 mg / 100g" },
      { name: "Chất xơ SC-FOS", value: "4.5 g / 100g" },
    ],
    instructions:
      "Pha 4 muỗng gạt với 180ml nước ấm (45°C). Khuấy đều và uống 2 ly mỗi ngày để cung cấp đủ dưỡng chất cho thai kỳ.",
  },

  // Nhóm 3: Người lớn
  {
    id: 4,
    name: "Sữa Y Tế Phục Hồi ViDairy BoneCare & Glucosamine",
    category: "nguoi-lon",
    categoryName: "Sản phẩm Người Lớn & Người Cao Tuổi",
    price: 520000,
    originalPrice: 580000,
    rating: 5.0,
    reviewsCount: 162,
    image: ongBaImg,
    badge: "Bảo vệ xương khớp",
    discount: "-10%",
    unit: "Lon 850g",
    volumes: [
      { label: "Lon 400g", price: 280000 },
      { label: "Lon 850g", price: 520000 },
      { label: "Thùng 6 lon 850g", price: 2990000 },
    ],
    summary:
      "Giải pháp phục hồi thể trạng, tăng mật độ xương và bôi trơn ổ khớp với Canxi Nano, Collagen Type II, Glucosamine và chất béo tốt cho tim mạch.",
    description:
      "ViDairy BoneCare mang đến sự bảo vệ toàn diện cho hệ xương khớp của người trung niên và cao tuổi. Công thức kết hợp Canxi Nano siêu mịn cùng Vitamin D3 và K2 giúp canxi gắn thẳng vào xương, hạn chế lắng đọng gây sỏi thận hoặc vôi hóa mạch máu.",
    nutritionFacts: [
      { name: "Canxi Nano", value: "1400 mg / 100g" },
      { name: "Glucosamine Sulphate", value: "650 mg / 100g" },
      { name: "Collagen Thủy Phân", value: "320 mg / 100g" },
      { name: "Vitamin K2 (MK7)", value: "45 mcg / 100g" },
      { name: "MUFA & PUFA", value: "9.8 g / 100g" },
    ],
    instructions:
      "Pha 5 muỗng gạt với 200ml nước ấm (50°C). Sử dụng đều đặn mỗi ngày 1-2 ly sau bữa ăn hoặc trước khi ngủ 1 giờ.",
  },

  // Nhóm 4: Sữa hạt
  {
    id: 5,
    name: "Sữa Hạt Dinh Dưỡng ViDairy 4 Hạt Organic (Hộp 1 Lít)",
    category: "sua-hat",
    categoryName: "Sản phẩm Sữa Hạt Tự Nhiên",
    price: 68000,
    originalPrice: 75000,
    rating: 4.9,
    reviewsCount: 110,
    image: suaHatImg,
    badge: "100% Organic",
    discount: "-9%",
    unit: "Hộp 1 Lít",
    volumes: [
      { label: "Lốc 4 hộp 180ml", price: 56000 },
      { label: "Hộp 1 Lít", price: 68000 },
      { label: "Thùng 12 hộp 1 Lít", price: 780000 },
    ],
    summary:
      "Sự hòa quyện sánh mịn giữa hạt Óc chó, Hạnh nhân, Macca và Yến mạch hữu cơ, giàu Omega 3-6 và chất chống oxy hóa tự nhiên.",
    description:
      "Sữa hạt dinh dưỡng 4 Hạt Organic của ViDairy là lựa chọn hoàn hảo cho bữa sáng nhanh gọn, lối sống eat clean và người ăn chay. Không chứa đường tinh luyện, vị ngọt thanh tự nhiên từ quả chà là, không chứa lactose và cholesterol.",
    nutritionFacts: [
      { name: "Năng lượng", value: "62 kcal / 100ml" },
      { name: "Chất béo Omega 3-6", value: "3.6 g / 100ml" },
      { name: "Chất xơ thực vật", value: "1.8 g / 100ml" },
      { name: "Canxi thực vật", value: "95 mg / 100ml" },
      { name: "Vitamin E", value: "4.2 mg / 100ml" },
    ],
    instructions:
      "Lắc kỹ trước khi dùng. Dùng trực tiếp hoặc kết hợp cùng ngũ cốc, sinh tố, cà phê.",
  },
  {
    id: 6,
    name: "Sữa Đậu Nành Nguyên Chất ViDairy Tươi Mát Thùng 48 Hộp",
    category: "sua-hat",
    categoryName: "Sản phẩm Sữa Hạt Tự Nhiên",
    price: 245000,
    originalPrice: 270000,
    rating: 4.8,
    reviewsCount: 77,
    image: suaHatImg,
    badge: "Non-GMO",
    discount: "-9%",
    unit: "Thùng 48 hộp 200ml",
    volumes: [
      { label: "Lốc 4 hộp 200ml", price: 24000 },
      { label: "Thùng 48 hộp 200ml", price: 245000 },
    ],
    summary:
      "Làm từ 100% hạt đậu nành không biến đổi gen (Non-GMO), giữ trọn vẹn hoạt chất Isoflavone và đạm thực vật quý giá.",
    description:
      "Sữa đậu nành ViDairy được sản xuất theo công nghệ trích ly khép kín hiện đại, giúp giữ lại tối đa protein thực vật và hương thơm đậu nành truyền thống, hỗ trợ làm đẹp da và cân bằng nội tiết tố tự nhiên.",
    nutritionFacts: [
      { name: "Chất đạm đậu nành", value: "3.4 g / 100ml" },
      { name: "Isoflavone", value: "28 mg / 100ml" },
      { name: "Canxi", value: "80 mg / 100ml" },
    ],
    instructions:
      "Bảo quản nơi khô ráo, thoáng mát. Dùng ngon hơn khi uống lạnh.",
  },
];
