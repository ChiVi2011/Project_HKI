const Product = require("../models/productModel");

// Danh mục sản phẩm dự phòng (trong trường hợp DB chưa kết nối hoặc trống)
const FALLBACK_PRODUCTS = [
  {
    ProductID: "me-1",
    ProductName: "ColosBaby Gold for Mum (Lon 800g)",
    CategoryID: "san-pham-cho-me",
    BrandName: "ColosBaby Mum",
    price: 445000,
    packaging: "Lon thiếc 800g",
    targetUser: "Mẹ mang thai & sau sinh cho con bú",
    description: "Kháng thể IgG tự nhiên từ sữa non Mỹ 24h, Axit Folic, Sắt hữu cơ, Canxi và FOS/Inulin chống táo bón thai kỳ.",
    imageUrl: "/products/colosbaby-mum.jpg",
  },
  {
    ProductID: "me-3",
    ProductName: "Oggi Mum Bổ Não & Khỏe Xương (Lon 900g)",
    CategoryID: "san-pham-cho-me",
    BrandName: "Oggi Mum",
    price: 395000,
    packaging: "Lon thiếc 900g",
    targetUser: "Phụ nữ chuẩn bị mang thai & đang mang thai",
    description: "DHA, Choline, Canxi Nano và Vitamin D3 giúp thai nhi thông minh và mẹ ngừa đau lưng, loãng xương.",
    imageUrl: "/products/oggi-mum.jpg",
  },
  {
    ProductID: "be-1",
    ProductName: "ColosBaby Gold 1+ (Lon 800g)",
    CategoryID: "san-pham-cho-be",
    BrandName: "ColosBaby",
    price: 495000,
    packaging: "Lon thiếc 800g",
    targetUser: "Trẻ từ 1 - 2 tuổi",
    description: "Bổ sung sữa non ColosIgG 24h nhập khẩu Mỹ, 2'-FL HMO, chất xơ FOS giúp miễn dịch khỏe, êm bụng ngừa táo bón, tăng cân khoa học.",
    imageUrl: "/products/colosbaby-gold.jpg",
  },
  {
    ProductID: "be-3",
    ProductName: "Calokid Gold Tăng Cân & Tiêu Hóa (Lon 800g)",
    CategoryID: "san-pham-cho-be",
    BrandName: "Calokid",
    price: 480000,
    packaging: "Lon thiếc 800g",
    targetUser: "Trẻ biếng ăn, suy dinh dưỡng, chậm tăng cân",
    description: "Năng lượng cao 1.0 - 1.2 kcal/ml, chất béo chuỗi trung bình MCT dễ hấp thu, phức hợp 2'-FL HMO và ColosIgG 24h.",
    imageUrl: "/products/calokid-gold.jpg",
  },
  {
    ProductID: "be-4",
    ProductName: "ColosBaby Pha Sẵn Tiện Lợi (Lốc 4x180ml)",
    CategoryID: "san-pham-cho-be",
    BrandName: "ColosBaby",
    price: 68000,
    packaging: "Lốc 4 hộp x 180ml",
    targetUser: "Trẻ từ 1 tuổi trở lên",
    description: "Sữa nước tiệt trùng tiện lợi mang đi học, tăng cường kháng thể IgG và dinh dưỡng cân bằng.",
    imageUrl: "/products/colosbaby-uht.jpg",
  },
  {
    ProductID: "nguoi-lon-1",
    ProductName: "CaloSure Gold Dinh Dưỡng Phục Hồi (Lon 900g)",
    CategoryID: "san-pham-cho-nguoi-lon-tuoi",
    BrandName: "CaloSure",
    price: 495000,
    packaging: "Lon thiếc 900g",
    targetUser: "Người lớn tuổi, người cần phục hồi sức khỏe sau phẫu thuật",
    description: "Không chứa đường Lactose, bổ sung MUFA, PUFA tốt cho tim mạch, Canxi Nano và Glucosamine nuôi dưỡng sụn khớp dẻo dai.",
    imageUrl: "/products/calosure-gold.jpg",
  },
  {
    ProductID: "nguoi-lon-3",
    ProductName: "Gluvita Gold Kiểm Soát Đường Huyết (Lon 900g)",
    CategoryID: "san-pham-cho-nguoi-lon-tuoi",
    BrandName: "Gluvita",
    price: 520000,
    packaging: "Lon thiếc 900g",
    targetUser: "Người đái tháo đường & tiền đái tháo đường",
    description: "Chỉ số đường huyết GI thấp nhờ hệ bột đường Palatinose & Isomalt, giàu MUFA/PUFA bảo vệ tim mạch và FOS ngừa táo bón.",
    imageUrl: "/products/gluvita-gold.jpg",
  },
  {
    ProductID: "nguoi-lon-4",
    ProductName: "Nepro 1 Dành Cho Bệnh Nhân Thận Chưa Chạy Thận (Lon 400g)",
    CategoryID: "san-pham-cho-nguoi-lon-tuoi",
    BrandName: "Nepro",
    price: 260000,
    packaging: "Lon thiếc 400g",
    targetUser: "Bệnh nhân suy thận mạn giai đoạn bảo tồn (chưa lọc máu)",
    description: "Hàm lượng đạm thấp, ít Natri, Kali, Photpho giúp giảm tải áp lực lọc cho thận, làm chậm tiến triển suy thận.",
    imageUrl: "/products/nepro-1.jpg",
  },
  {
    ProductID: "dung-kem-1",
    ProductName: "Sữa Non ColosIgG 24h Bột Nguyên Chất (Hộp 60 gói x 1.5g)",
    CategoryID: "dung-kem",
    BrandName: "ColosIgG 24h",
    price: 560000,
    packaging: "Hộp 60 gói x 1.5g",
    targetUser: "Mọi lứa tuổi (trẻ sơ sinh, trẻ nhỏ, người già, người ốm yếu)",
    description: "100% Sữa non 24h nhập khẩu trực tiếp từ Mỹ, giàu kháng thể tự nhiên IgG, pha cùng nước ấm, cháo hoặc sữa thường.",
    imageUrl: "/products/colosigg-24h.jpg",
  },
];

// Hàm lấy dữ liệu sản phẩm từ MongoDB (có fallback)
async function getProductsCatalog() {
  try {
    const dbProducts = await Product.find({ Status: { $ne: false } })
      .select("ProductID ProductName CategoryID BrandName price packaging targetUser description slogan imageUrl")
      .limit(40)
      .lean();

    if (dbProducts && dbProducts.length > 0) {
      return dbProducts;
    }
  } catch (err) {
    console.warn("⚠️ Không thể truy vấn MongoDB cho Catalog AI, dùng danh mục fallback:", err.message);
  }
  return FALLBACK_PRODUCTS;
}

const CLOSING_NOTE =
  "Mời bạn xem qua các hộp sữa mà chúng tôi đề xuất ở đây, nếu có thắc mắc cần giải đáp thì chúng tôi sẽ chuyển thông tin bạn cho nhân viên tư vấn cụ thể hơn nhé.";
const HUMAN_HANDOFF_REPLY =
  "Chúng tôi đã chuyển thông tin của bạn cho nhân viên tư vấn, vui lòng đợi nhân viên phản hồi trong giây lát ạ.";

// Xây dựng System Prompt chuẩn chuyên gia dinh dưỡng ViDairy
function buildSystemPrompt(catalog) {
  const catalogText = catalog
    .map(
      (p) =>
        `- [Mã: ${p.ProductID}] | Tên: ${p.ProductName} | Thương hiệu: ${p.BrandName} | Đối tượng: ${p.targetUser} | Giá: ${Number(p.price || 0).toLocaleString("vi-VN")} đ | Quy cách: ${p.packaging} | Công dụng: ${p.description || p.slogan}`
    )
    .join("\n");

  return `Bạn là Bác sĩ & Chuyên gia Tư Vấn Dinh Dưỡng ảo chính thức của ViDairy - thương hiệu dinh dưỡng hàng đầu với nguyên liệu Sữa Non ColosIgG 24h nhập khẩu từ Mỹ.

DƯỚI ĐÂY LÀ DANH MỤC CÁC SẢN PHẨM CỦA CỬA HÀNG:
${catalogText}

QUY TẮC TƯ VẤN BẮT BUỘC:
1. Xưng hô: Ân cần, lễ phép, xưng "Bác sĩ / Chuyên viên ViDairy" và gọi khách hàng là "bạn" hoặc "quý khách", "mẹ" (nếu mẹ bầu/chăm con).
2. QUY TẮC ĐÚNG ĐỐI TƯỢNG (CỰC KỲ QUAN TRỌNG):
   - Khi khách hàng hỏi về một đối tượng cụ thể (Ví dụ: "cho bé", "cho mẹ bầu", "cho người già", "cho người tiểu đường"): BẠN CHỈ ĐƯỢC PHÉP TƯ VẤN CÁC DÒNG SẢN PHẨM DÀNH RIÊNG CHO ĐỐI TƯỢNG ĐÓ.
   - TUYỆT ĐỐI KHÔNG TỰ Ý LIỆT KÊ SANG CÁC ĐỐI TƯỢNG KHÁC. Ví dụ: Nếu khách hỏi "có sữa nào phù hợp cho bé không?", bạn CHỈ được giới thiệu các dòng cho bé (ColosBaby, Calokid, Vitagrow...), CẤM KHÔNG ĐƯỢC nhắc hay liệt kê sữa cho mẹ bầu hoặc người già.
   - Tương tự, nếu khách hỏi về mẹ bầu thì chỉ tư vấn dòng ColosBaby Mum / Oggi Mum; khách hỏi về người già/tiểu đường thì chỉ tư vấn dòng CaloSure / Gluvita / Nepro.
3. QUY TẮC KẾT THÚC CÂU TƯ VẤN VÀ CHUYỂN TIẾP NHÂN VIÊN (BẮT BUỘC):
   - Sau khi tư vấn và đề xuất các sản phẩm sữa phù hợp, ở đoạn cuối cùng TUYỆT ĐỐI KHÔNG ĐƯỢC HỎI TIẾP KHÁCH HÀNG (không hỏi tuổi, không hỏi bệnh lý, không hỏi tháng tuổi). Thay vào đó, BẮT BUỘC KẾT THÚC BẰNG ĐÚNG NGUYÊN VĂN CÂU NÀY:
     "${CLOSING_NOTE}"
   - Nếu khách hàng bảo cần gặp nhân viên tư vấn (hoặc có thắc mắc cần nhân viên giải đáp, muốn gặp tư vấn viên, gặp người thật, chuyển thông tin): BẠN BẮT BUỘC CHỈ ĐƯỢC PHẢN HỒI DUY NHẤT NGUYÊN VĂN CÂU SAU:
     "${HUMAN_HANDOFF_REPLY}"
4. Phân tích triệu chứng / nhu cầu:
   - Trẻ táo bón, hấp thu kém: Đề xuất dòng chứa chất xơ FOS/Inulin và HMO như ColosBaby Gold hoặc Calokid.
   - Trẻ biếng ăn, chậm tăng cân: Đề xuất Calokid Gold (cao năng lượng, MCT dễ hấp thu).
   - Trẻ cần phát triển chiều cao: Đề xuất Vitagrow Plus (Canxi & 100% MK7).
   - Người bệnh tiểu đường / tiền tiểu đường: Đề xuất Gluvita Gold (chỉ số GI thấp, hệ bột đường hấp thu chậm).
   - Người suy thận chưa lọc máu: Đề xuất Nepro 1 (ít đạm, giảm tải thận); suy thận chạy thận: Nepro 2 (giàu đạm bù hao hụt).
   - Người già đau khớp, loãng xương: Đề xuất CaloSure Gold hoặc CaloSure Canxi (Canxi Nano & Glucosamine).
   - Mẹ mang thai, ốm nghén: Đề xuất ColosBaby Mum hoặc Oggi Mum (Axit Folic, Sắt, vị thanh dễ uống).
   - Tăng sức đề kháng mọi lứa tuổi: Đề xuất Sữa non ColosIgG 24h nhập khẩu Mỹ.
5. CÚ PHÁP ĐẶC BIỆT BẮT BUỘC:
   Mỗi khi nhắc đến một sản phẩm cụ thể, hãy viết tên sản phẩm kèm cú pháp: [PRODUCT:Mã_Sản_Phẩm] (Ví dụ: "**ColosBaby Gold 1+** [PRODUCT:be-1]"). 
   Hệ thống Frontend sẽ tự động nhận diện cú pháp này để hiển thị thẻ sản phẩm có nút đặt mua ngay.
6. Hướng dẫn pha & bảo quản chuẩn:
   - Nước ấm 45°C - 50°C (không dùng nước sôi vì sẽ làm hỏng kháng thể sinh học IgG).
   - Hạn dùng sau khi mở nắp: trong vòng 4 tuần, đậy kín nơi khô thoáng, không cho vào tủ lạnh.
7. Định dạng Markdown: Dùng gạch đầu dòng, in đậm tên sản phẩm và các từ khóa quan trọng để câu trả lời thoáng, dễ nhìn.`;
}

// Helper tìm sản phẩm phù hợp nhất trong catalog theo danh sách từ khóa
function findMatchingProduct(catalog, keywords, fallbackId) {
  // Ưu tiên 1: Tìm theo ID chính xác hoặc tên sản phẩm chứa từ khóa
  let found = catalog.find((p) => {
    const id = (p.ProductID || "").toLowerCase();
    const name = (p.ProductName || "").toLowerCase();
    return keywords.some((kw) => id === kw.toLowerCase() || name.includes(kw.toLowerCase()));
  });

  // Ưu tiên 2: Toàn bộ thông tin chứa từ khóa
  if (!found) {
    found = catalog.find((p) => {
      const fullText = `${p.ProductID} ${p.ProductName} ${p.BrandName} ${p.description || ""} ${p.slogan || ""}`.toLowerCase();
      return keywords.some((kw) => fullText.includes(kw.toLowerCase()));
    });
  }
  return found || catalog.find((p) => p.ProductID === fallbackId) || null;
}

function isAskingForHumanStaff(message) {
  const text = (message || "").toLowerCase();
  return (
    text.includes("nhân viên") ||
    text.includes("tư vấn viên") ||
    text.includes("gặp người") ||
    text.includes("người thật") ||
    text.includes("chuyển thông tin") ||
    text.includes("gặp tư vấn") ||
    text.includes("người tư vấn") ||
    text.includes("cần tư vấn cụ thể") ||
    text.includes("liên hệ tư vấn") ||
    text.includes("nói chuyện với nhân viên") ||
    text.includes("kết nối nhân viên") ||
    (text.includes("thắc mắc") && (text.includes("cần") || text.includes("giải đáp") || text.includes("hỏi")))
  );
}

// Bộ xử lý thông minh cục bộ (Fallback Engine khi chưa có Gemini Key hoặc lỗi mạng)
function intelligentLocalAdvisor(userMessage, catalog) {
  const text = (userMessage || "").toLowerCase();

  let matchedProducts = [];
  let advice = "";

  // 1. KIỂM TRA NẾU KHÁCH BẢO CẦN GẶP NHÂN VIÊN TƯ VẤN
  if (isAskingForHumanStaff(userMessage)) {
    return {
      reply: HUMAN_HANDOFF_REPLY,
      suggestedProducts: [],
      modelUsed: "Hệ thống tư vấn ViDairy",
    };
  }

  // 2. NHẬN DIỆN ĐỐI TƯỢNG (TARGET AUDIENCE)
  const isBaby =
    text.includes("bé") ||
    text.includes("trẻ") ||
    text.includes("con") ||
    text.includes("cháu") ||
    text.includes("sơ sinh") ||
    text.includes("em bé") ||
    text.includes("calokid") ||
    text.includes("oggi") ||
    text.includes("vitagrow");

  const isMother =
    text.includes("mẹ") ||
    text.includes("bầu") ||
    text.includes("mang thai") ||
    text.includes("thai kỳ") ||
    text.includes("thai nhi") ||
    text.includes("ốm nghén") ||
    text.includes("nghén") ||
    text.includes("sau sinh") ||
    text.includes("cho con bú") ||
    text.includes("mum");

  const isAdult =
    text.includes("tiểu đường") ||
    text.includes("đường huyết") ||
    text.includes("thận") ||
    text.includes("chạy thận") ||
    text.includes("lọc máu") ||
    text.includes("người già") ||
    text.includes("lớn tuổi") ||
    text.includes("ông") ||
    text.includes("bà") ||
    text.includes("bác") ||
    text.includes("canxi") ||
    text.includes("loãng xương") ||
    text.includes("khớp") ||
    text.includes("người lớn") ||
    text.includes("calosure") ||
    text.includes("gluvita") ||
    text.includes("nepro");

  const isColostrum =
    text.includes("sữa non") ||
    text.includes("đề kháng") ||
    text.includes("miễn dịch") ||
    text.includes("colosigg") ||
    text.includes("colosimmune");

  // A. NẾU HỎI VỀ BÉ (EM BÉ, TRẺ EM)
  if (isBaby && !isMother) {
    if (text.includes("táo bón") || text.includes("tiêu hóa") || text.includes("bón") || text.includes("nóng")) {
      const prod1 = findMatchingProduct(catalog, ["colosbaby gold 1+", "colosbaby bio"], "be-1");
      const prod2 = findMatchingProduct(catalog, ["oggi gold pro", "colosbaby pha sẵn"], "be-4");
      if (prod1) matchedProducts.push(prod1);
      if (prod2 && prod2.ProductID !== prod1?.ProductID) matchedProducts.push(prod2);

      advice = `Chào mẹ! Tình trạng bé bị **táo bón, nóng trong hoặc tiêu hóa kém** thường do hệ vi sinh đường ruột non nớt hoặc sữa thiếu chất xơ hòa tan.\n\nBác sĩ khuyên mẹ nên cho bé dùng các dòng sữa chuyên biệt bổ sung HMO và men xơ sau:\n- **${prod1?.ProductName || "ColosBaby Gold 1+"}** [PRODUCT:${prod1?.ProductID || "be-1"}]: Bổ sung Kháng thể IgG tự nhiên từ Sữa non Mỹ 24h và phức hợp **2'-FL HMO kết hợp chất xơ FOS/Inulin** giúp làm mềm phân, êm bụng và dứt điểm táo bón.\n- **${prod2?.ProductName || "Oggi Gold PRO"}** [PRODUCT:${prod2?.ProductID || "be-4"}]: Hệ dưỡng chất dễ tiêu hóa, ngừa táo bón và giúp bé tăng cân bắt kịp đà tăng trưởng.\n\n${CLOSING_NOTE}`;
    } else if (text.includes("tăng cân") || text.includes("biếng ăn") || text.includes("còi") || text.includes("nhẹ cân") || text.includes("chậm lớn") || text.includes("suy dinh dưỡng")) {
      const prod1 = findMatchingProduct(catalog, ["calokid", "oggi gold pro", "biếng ăn"], "be-5") || findMatchingProduct(catalog, ["tăng cân"], "be-4");
      const prod2 = findMatchingProduct(catalog, ["colosbaby gold 1+"], "be-1");
      if (prod1) matchedProducts.push(prod1);
      if (prod2 && prod2.ProductID !== prod1?.ProductID) matchedProducts.push(prod2);

      advice = `Chào mẹ! Với các bé **chậm tăng cân, biếng ăn hoặc thấp còi**, bé cần nguồn sữa có đậm độ năng lượng cao và chất béo dễ hấp thu.\n\nBác sĩ gợi ý mẹ 2 dòng sữa tăng cân vượt trội cho bé:\n- **${prod1?.ProductName || "Calokid Gold Cao Năng Lượng"}** [PRODUCT:${prod1?.ProductID || "be-5"}]: Cung cấp **đậm độ năng lượng chuẩn khoa học 1.0 - 1.2 kcal/ml** kết hợp chất béo chuỗi trung bình **MCT** hấp thu nhanh, giúp bé tăng cân rõ rệt.\n- **${prod2?.ProductName || "ColosBaby Gold 1+"}** [PRODUCT:${prod2?.ProductID || "be-1"}]: Giúp bé có hệ miễn dịch vững vàng từ Sữa non ColosIgG 24h, ăn ngon miệng và phát triển khỏe mạnh.\n\n${CLOSING_NOTE}`;
    } else if (text.includes("chiều cao") || text.includes("cao lớn") || text.includes("vitagrow")) {
      const prod1 = findMatchingProduct(catalog, ["vitagrow", "chiều cao"], "be-9");
      const prod2 = findMatchingProduct(catalog, ["colosbaby gold 1+"], "be-1");
      if (prod1) matchedProducts.push(prod1);
      if (prod2 && prod2.ProductID !== prod1?.ProductID) matchedProducts.push(prod2);

      advice = `Chào mẹ! Để giúp bé **bứt phá chiều cao tối đa**, bé cần Canxi sinh học kết hợp vitamin định hướng gắn canxi vào xương.\n\nBác sĩ khuyên mẹ nên chọn:\n- **${prod1?.ProductName || "Vitagrow Plus Bứt Phá Chiều Cao"}** [PRODUCT:${prod1?.ProductID || "be-9"}]: Bổ sung 100% MK7 tự nhiên kết hợp Vitamin D3 giúp dẫn truyền Canxi trực tiếp vào xương, cho xương dài nhanh và chắc khỏe.\n- **${prod2?.ProductName || "ColosBaby Gold 1+"}** [PRODUCT:${prod2?.ProductID || "be-1"}]: Nền tảng miễn dịch khỏe toàn diện cho bé.\n\n${CLOSING_NOTE}`;
    } else {
      // HỎI CHUNG VỀ SỮA CHO BÉ (VÍ DỤ: "Có sữa nào phù hợp cho bé hông?", "Tư vấn sữa cho bé")
      const p1 = findMatchingProduct(catalog, ["colosbaby gold 1+"], "be-1");
      const p2 = findMatchingProduct(catalog, ["calokid gold", "oggi gold pro"], "be-5");
      const p3 = findMatchingProduct(catalog, ["vitagrow plus"], "be-9") || findMatchingProduct(catalog, ["oggi gold pro"], "be-4");
      if (p1) matchedProducts.push(p1);
      if (p2 && p2.ProductID !== p1?.ProductID) matchedProducts.push(p2);
      if (p3 && !matchedProducts.some((m) => m.ProductID === p3.ProductID)) matchedProducts.push(p3);

      advice = `Dạ có mẹ nhé! Dành riêng cho **các bé yêu**, ViDairy phát triển các dòng sữa dinh dưỡng chuyên biệt ứng dụng Sữa non ColosIgG 24h nhập khẩu từ Mỹ:\n\n1. **${p1?.ProductName || "ColosBaby Gold 1+"}** [PRODUCT:${p1?.ProductID || "be-1"}]: Dòng sữa toàn diện giúp bé **tăng đề kháng, tiêu hóa êm ái và ngừa táo bón** nhờ 2'-FL HMO & chất xơ FOS.\n2. **${p2?.ProductName || "Calokid Gold"}** [PRODUCT:${p2?.ProductID || "be-5"}]: Dòng chuyên biệt cho bé **biếng ăn, chậm tăng cân, cần bổ sung năng lượng cao**.\n3. **${p3?.ProductName || "Vitagrow Plus"}** [PRODUCT:${p3?.ProductID || "be-9"}]: Dòng đột phá giúp bé **phát triển chiều cao vượt trội** với Canxi & MK7 tự nhiên.\n\n${CLOSING_NOTE}`;
    }
  }

  // B. NẾU HỎI VỀ MẸ BẦU & SAU SINH
  else if (isMother) {
    const prod1 = findMatchingProduct(catalog, ["colosbaby gold for mum", "colosbaby mum"], "me-1");
    const prod2 = findMatchingProduct(catalog, ["oggi mum bổ não", "oggi mum"], "me-3");
    if (prod1) matchedProducts.push(prod1);
    if (prod2 && prod2.ProductID !== prod1?.ProductID) matchedProducts.push(prod2);

    advice = `Chào mẹ! Dành riêng cho **phụ nữ chuẩn bị mang thai, đang mang thai và cho con bú**, ViDairy có 2 dòng sữa bầu chuẩn vàng:\n\n1. **${prod1?.ProductName || "ColosBaby Gold for Mum"}** [PRODUCT:${prod1?.ProductID || "me-1"}]:\n- Bổ sung **Sữa non Mỹ 24h** tăng cường miễn dịch, giảm ốm vặt thai kỳ.\n- Cung cấp **Axit Folic & Sắt hữu cơ** ngừa dị tật ống thần kinh và thiếu máu.\n- Giàu hệ chất xơ FOS giúp mẹ hấp thu tốt và **chống táo bón thai kỳ** hiệu quả.\n\n2. **${prod2?.ProductName || "Oggi Mum Bổ Não & Khỏe Xương"}** [PRODUCT:${prod2?.ProductID || "me-3"}]:\n- Hương vị thanh mát, dễ uống, giảm cảm giác ốm nghén.\n- Tăng cường **DHA & Choline** giúp thai nhi phát triển não bộ, bổ sung Canxi Nano bảo vệ hệ xương của mẹ.\n\n${CLOSING_NOTE}`;
  }

  // C. NẾU HỎI VỀ NGƯỜI LỚN TUỔI / BỆNH LÝ (TIỂU ĐƯỜNG, THẬN, XƯƠNG KHỚP)
  else if (isAdult) {
    if (text.includes("tiểu đường") || text.includes("đường huyết") || text.includes("đái tháo đường")) {
      const prod = findMatchingProduct(catalog, ["gluvita", "tiểu đường"], "lon-5");
      if (prod) matchedProducts.push(prod);

      advice = `Chào bạn! Đối với **người bệnh đái tháo đường hoặc tiền đái tháo đường**, mục tiêu quan trọng nhất là duy trì đường huyết ổn định mà vẫn bổ sung đầy đủ dưỡng chất.\n\nBác sĩ khuyên dùng dòng chuyên biệt **${prod?.ProductName || "Gluvita Gold"}** [PRODUCT:${prod?.ProductID || "lon-5"}]:\n- **Chỉ số đường huyết GI thấp** nhờ hệ bột đường tiên tiến Palatinose & Isomalt hấp thu chậm, không làm đường huyết tăng vọt sau uống.\n- Giàu chất béo có lợi **MUFA & PUFA** bảo vệ hệ tim mạch khỏe mạnh.\n- Bổ sung FOS ngừa táo bón và các vitamin nhóm B giúp tăng cường chuyển hóa năng lượng.\n\n${CLOSING_NOTE}`;
    } else if (text.includes("thận") || text.includes("chạy thận") || text.includes("lọc máu")) {
      const prod = findMatchingProduct(catalog, ["nepro", "thận"], "lon-3");
      if (prod) matchedProducts.push(prod);

      advice = `Chào bạn! Về dinh dưỡng cho **người có bệnh lý thận**, việc kiểm soát nghiêm ngặt lượng đạm và chất khoáng là yếu tố sống còn.\n\nViDairy có dòng sữa y học chuyên biệt **${prod?.ProductName || "Nepro 1"}** [PRODUCT:${prod?.ProductID || "lon-3"}]:\n- **Đặc điểm**: Giảm tối đa lượng đạm và các khoáng chất Natri, Kali, Photpho nhằm giảm tải áp lực lọc cho cầu thận, giúp bảo tồn chức năng thận còn lại.\n- Cung cấp năng lượng cao và đầy đủ vi chất giúp người bệnh không bị suy kiệt.\n*(Lưu ý: Nếu bệnh nhân đã lọc máu/chạy thận nhân tạo, vui lòng sử dụng Nepro 2 với hàm lượng đạm cao hơn để bù đắp tiêu hao).*\n\n${CLOSING_NOTE}`;
    } else if (text.includes("canxi") || text.includes("loãng xương") || text.includes("khớp")) {
      const prod1 = findMatchingProduct(catalog, ["calosure canxi", "canxi khớp"], "lon-9");
      const prod2 = findMatchingProduct(catalog, ["calosure gold"], "lon-2") || findMatchingProduct(catalog, ["calosure america"], "lon-1");
      if (prod1) matchedProducts.push(prod1);
      if (prod2 && prod2.ProductID !== prod1?.ProductID) matchedProducts.push(prod2);

      advice = `Chào bạn! Ở người lớn tuổi, mật độ xương suy giảm và các khớp dần lão hóa gây đau nhức, đi lại khó khăn.\n\nBác sĩ khuyên bạn nên chọn các dòng sữa chuyên biệt sau:\n- **${prod1?.ProductName || "CaloSure Canxi Khớp Dẻo Dai"}** [PRODUCT:${prod1?.ProductID || "lon-9"}]: Bổ sung **Canxi Nano kết hợp Vitamin D3 & MK7** giúp đưa canxi thẳng vào xương, phòng ngừa loãng xương, kèm **Glucosamine** nuôi dưỡng sụn khớp dẻo dai.\n- **${prod2?.ProductName || "CaloSure Gold"}** [PRODUCT:${prod2?.ProductID || "lon-2"}]: Giàu đạm thực vật, không chứa đường Lactose, tốt cho hệ tim mạch và tiêu hóa.\n\n${CLOSING_NOTE}`;
    } else {
      // Hỏi chung về người lớn tuổi / người già
      const prod1 = findMatchingProduct(catalog, ["calosure gold"], "lon-2") || findMatchingProduct(catalog, ["calosure america"], "lon-1");
      const prod2 = findMatchingProduct(catalog, ["calosure canxi"], "lon-9");
      if (prod1) matchedProducts.push(prod1);
      if (prod2 && prod2.ProductID !== prod1?.ProductID) matchedProducts.push(prod2);

      advice = `Chào bạn! Dành riêng cho **người lớn tuổi và người cần phục hồi sức khỏe**, ViDairy có các dòng dinh dưỡng y học cao cấp:\n\n1. **${prod1?.ProductName || "CaloSure Gold"}** [PRODUCT:${prod1?.ProductID || "lon-2"}]: Sữa phục hồi sức khỏe toàn diện, 100% đạm thực vật không lactose, bổ sung MUFA/PUFA tốt cho tim mạch và dễ hấp thu.\n2. **${prod2?.ProductName || "CaloSure Canxi Khớp Dẻo Dai"}** [PRODUCT:${prod2?.ProductID || "lon-9"}]: Bổ sung Canxi Nano & Glucosamine giúp xương chắc khỏe, bảo vệ khớp dẻo dai.\n\n${CLOSING_NOTE}`;
    }
  }

  // D. NẾU HỎI VỀ SỮA NON / TĂNG ĐỀ KHÁNG GIA ĐÌNH
  else if (isColostrum) {
    const prod = findMatchingProduct(catalog, ["colosigg 24h dạng gói", "colosigg 24h"], "kem-1") || findMatchingProduct(catalog, ["colosimmune"], "kem-3");
    if (prod) matchedProducts.push(prod);

    advice = `Chào bạn! Để nâng cao **hệ miễn dịch tự nhiên nhanh và hiệu quả nhất**, nguồn sữa non thu hoạch trong 24 giờ đầu sau sinh là quý giá nhất.\n\nSản phẩm chuyên biệt **${prod?.ProductName || "ColosIgG 24h Dạng Gói"}** [PRODUCT:${prod?.ProductID || "kem-1"}]:\n- Nhập khẩu 100% từ các trang trại bò sữa hạng A tại Mỹ, chứa hàm lượng kháng thể IgG tự nhiên cực cao.\n- Phù hợp cho **mọi lứa tuổi** (trẻ sơ sinh, trẻ nhỏ, người lớn tuổi, người vừa ốm dậy).\n- Dạng gói tiện lợi, có thể pha kèm nước ấm, sữa công thức hoặc trộn vào cháo/súp.\n\n${CLOSING_NOTE}`;
  }

  // E. HƯỚNG DẪN PHA SỮA
  else if (text.includes("pha") || text.includes("nhiệt độ") || text.includes("nước") || text.includes("hướng dẫn")) {
    advice = `Dạ, Bác sĩ ViDairy xin hướng dẫn **4 bước pha sữa chuẩn y tế** để bảo toàn 100% kháng thể:\n1. **Tiệt trùng**: Rửa sạch tay và tiệt trùng dụng cụ pha trong nước sôi 5 phút.\n2. **Nhiệt độ chuẩn**: Đun sôi nước sạch và để nguội dần đến **45°C - 50°C**. *(Lưu ý: Không dùng nước sôi >50°C vì sẽ làm mất hoạt tính của kháng thể IgG và men vi sinh)*.\n3. **Đong bột**: Dùng muỗng gạt ngang có trong lon, đong đúng số muỗng theo bảng hướng dẫn trên vỏ lon.\n4. **Khuấy & dùng**: Khuấy đều tay cho bột sữa tan hoàn toàn, thử độ ấm trên cổ tay và dùng ngay trong vòng 1 giờ.\n*Lon đã mở nên đậy kín và dùng hết trong 4 tuần.*`;
  }

  // F. CÂU HỎI CHUNG CHUNG / KHÔNG NÊU ĐỐI TƯỢNG (Ví dụ: "Shop có sữa gì?", "Xin chào", "Tư vấn cho tôi")
  else {
    advice = `Xin chào bạn! Bác sĩ Dinh Dưỡng ViDairy rất vui được hỗ trợ bạn.\n\nViDairy cung cấp đầy đủ các giải pháp dinh dưỡng chuyên sâu ứng dụng Sữa non ColosIgG 24h từ Mỹ. Để bác sĩ tư vấn chính xác sản phẩm phù hợp nhất, bạn đang muốn tìm sữa cho đối tượng nào ạ:\n- 👶 **Sữa cho bé yêu** (tăng cân, ngừa táo bón, tăng đề kháng, phát triển chiều cao)\n- 🤰 **Sữa cho mẹ bầu & sau sinh** (giảm ốm nghén, bổ sung Axit Folic, ngừa thiếu máu)\n- 👵 **Sữa cho người lớn tuổi & bệnh lý** (tim mạch, xương khớp, tiểu đường, suy thận)\n\n${CLOSING_NOTE}`;
  }

  return {
    reply: advice,
    suggestedProducts: matchedProducts,
    modelUsed: "ViDairy-Intelligent-Engine (Offline Fallback)",
  };
}

// Controller chính: POST /api/chat
const chatController = {
  async handleChat(req, res) {
    try {
      const { message, history } = req.body;

      if (!message || !message.trim()) {
        return res.status(400).json({
          success: false,
          message: "Vui lòng nhập nội dung câu hỏi.",
        });
      }

      // Kiểm tra ngay yêu cầu gặp nhân viên tư vấn
      if (isAskingForHumanStaff(message)) {
        return res.status(200).json({
          success: true,
          reply: HUMAN_HANDOFF_REPLY,
          suggestedProducts: [],
          modelUsed: "Hệ thống tư vấn ViDairy",
        });
      }

      // 1. Lấy dữ liệu sản phẩm mới nhất
      const catalog = await getProductsCatalog();

      // 2. Kiểm tra API Key Google Gemini
      const apiKey = process.env.GEMINI_API_KEY;

      if (apiKey && apiKey.trim() && !apiKey.includes("YOUR_GEMINI_API_KEY")) {
        try {
          // Xây dựng System Prompt với kiến thức về toàn bộ sản phẩm
          const systemPrompt = buildSystemPrompt(catalog);

          // Chuẩn bị nội dung gửi lên Gemini
          // Định dạng theo Google Gemini v1beta REST API
          const contents = [];

          if (Array.isArray(history) && history.length > 0) {
            // Giới hạn 6 tin nhắn gần nhất để tối ưu token
            const recentHistory = history.slice(-6);
            for (const item of recentHistory) {
              const role = item.sender === "user" ? "user" : "model";
              if (item.text && item.text.trim()) {
                contents.push({
                  role,
                  parts: [{ text: item.text }],
                });
              }
            }
          }

          // Thêm tin nhắn hiện tại của user
          contents.push({
            role: "user",
            parts: [{ text: message.trim() }],
          });

          // Gọi Gemini REST API (gemini-1.5-flash)
          const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey.trim()}`;

          const apiResponse = await fetch(geminiUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              systemInstruction: {
                parts: [{ text: systemPrompt }],
              },
              contents,
              generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 1200,
              },
            }),
          });

          if (apiResponse.ok) {
            const data = await apiResponse.json();
            const replyText =
              data?.candidates?.[0]?.content?.parts?.[0]?.text ||
              "Xin lỗi, bác sĩ chưa thể xử lý yêu cầu lúc này. Bạn vui lòng thử lại nhé!";

            // Trích xuất các ProductID được nhắc tới trong câu trả lời dạng [PRODUCT:xxx]
            const productRegex = /\[PRODUCT:([a-zA-Z0-9\-_]+)\]/g;
            const extractedIds = [];
            let match;
            while ((match = productRegex.exec(replyText)) !== null) {
              if (!extractedIds.includes(match[1])) {
                extractedIds.push(match[1]);
              }
            }

            const suggestedProducts = catalog.filter((p) => extractedIds.includes(p.ProductID));

            return res.status(200).json({
              success: true,
              reply: replyText,
              suggestedProducts,
              modelUsed: "Google Gemini 1.5 Flash",
            });
          } else {
            const errorBody = await apiResponse.text();
            console.warn("⚠️ Lỗi từ Gemini API:", apiResponse.status, errorBody);
            // Tiếp tục fallback bên dưới
          }
        } catch (geminiError) {
          console.warn("⚠️ Ngoại lệ khi gọi Gemini API:", geminiError.message);
          // Tiếp tục fallback bên dưới
        }
      }

      // 3. Fallback Engine: Hoạt động tự động khi không có API key hoặc API gặp sự cố
      const fallbackResult = intelligentLocalAdvisor(message, catalog);

      return res.status(200).json({
        success: true,
        reply: fallbackResult.reply,
        suggestedProducts: fallbackResult.suggestedProducts,
        modelUsed: fallbackResult.modelUsed,
      });
    } catch (err) {
      console.error("Lỗi chatController:", err);
      return res.status(500).json({
        success: false,
        message: "Lỗi máy chủ trong quá trình xử lý tin nhắn chat.",
        error: err.message,
      });
    }
  },
};

module.exports = chatController;
