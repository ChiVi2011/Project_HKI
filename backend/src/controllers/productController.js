const Product = require("../models/productModel");

const productController = {
  // Lấy danh sách sản phẩm (hỗ trợ lọc theo category, search, sort, includeAll cho Admin)
  async getProducts(req, res) {
    try {
      const { category, search, sort, includeAll } = req.query;
      const query = {};

      // Nếu không yêu cầu includeAll (dành cho client), chỉ lấy sản phẩm đang bật (Status = true)
      if (includeAll !== "true") {
        query.Status = true;
      }

      // Lọc theo danh mục
      if (category && category !== "all" && category !== "thong-tin-khuyen-mai") {
        query.CategoryID = category;
      }

      // Tìm kiếm từ khóa (tên, slogan, mô tả, đối tượng, thương hiệu)
      if (search && search.trim()) {
        const regex = new RegExp(search.trim(), "i");
        query.$or = [
          { ProductName: regex },
          { slogan: regex },
          { description: regex },
          { targetUser: regex },
          { BrandName: regex },
        ];
      }

      // Sắp xếp
      let sortOption = { isHot: -1, isFeatured: -1, createdAt: -1 };
      if (sort === "price-asc") {
        sortOption = { price: 1 };
      } else if (sort === "price-desc") {
        sortOption = { price: -1 };
      }

      const products = await Product.find(query).sort(sortOption).lean();

      return res.status(200).json({
        success: true,
        count: products.length,
        data: products,
      });
    } catch (err) {
      console.error("Lỗi getProducts:", err);
      return res.status(500).json({
        success: false,
        message: "Lỗi máy chủ khi lấy danh sách sản phẩm.",
        error: err.message,
      });
    }
  },

  // Lấy chi tiết sản phẩm theo ID hoặc ProductID slug
  async getProductById(req, res) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ success: false, message: "Thiếu ID sản phẩm." });
      }

      let product = await Product.findOne({ ProductID: id }).lean();
      if (!product && id.match(/^[0-9a-fA-F]{24}$/)) {
        product = await Product.findById(id).lean();
      }

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy sản phẩm yêu cầu.",
        });
      }

      return res.status(200).json({
        success: true,
        data: product,
      });
    } catch (err) {
      console.error("Lỗi getProductById:", err);
      return res.status(500).json({
        success: false,
        message: "Lỗi máy chủ khi lấy thông tin sản phẩm.",
        error: err.message,
      });
    }
  },

  // [ADMIN] Tạo sản phẩm mới vào Database
  async createProduct(req, res) {
    try {
      const body = req.body;
      if (!body.ProductName && !body.name) {
        return res.status(400).json({
          success: false,
          message: "Vui lòng nhập tên sản phẩm.",
        });
      }

      const productName = (body.ProductName || body.name).trim();
      const price = Number(body.price || body.Price || 0);
      const categoryId = body.CategoryID || body.category || "san-pham-cho-be";
      const brandName = body.BrandName || body.brand || "ViDairy";
      const packaging = body.packaging || body.variant || "Lon 800g";
      const targetUser = body.targetUser || body.ageGroup || "Mọi lứa tuổi";
      const stock = Number(body.stock || 100);

      // Sinh mã ProductID duy nhất
      const count = await Product.countDocuments();
      const productSlug = `sp-${Date.now()}-${count + 1}`;

      const newProduct = await Product.create({
        ProductID: body.ProductID || productSlug,
        CategoryID: categoryId,
        BrandName: brandName,
        ProductName: productName,
        slogan: body.slogan || "Dinh dưỡng chuẩn y khoa cho gia đình",
        description: body.description || "Bổ sung vi chất thiết yếu giúp tăng cường sức đề kháng và phát triển toàn diện.",
        packaging: packaging,
        targetUser: targetUser,
        price: price,
        imageUrl: body.imageUrl || body.img || "https://vitadairy.vn/s/images/product/hinh-thumnail-sp-380-x-210.jpg",
        isHot: Boolean(body.isHot),
        isFeatured: body.isFeatured !== undefined ? Boolean(body.isFeatured) : true,
        rating: 5.0,
        soldCount: 0,
        Status: true,
      });

      return res.status(201).json({
        success: true,
        message: "Thêm sản phẩm mới vào cơ sở dữ liệu thành công!",
        data: newProduct,
      });
    } catch (err) {
      console.error("Lỗi createProduct:", err);
      return res.status(500).json({
        success: false,
        message: "Lỗi máy chủ khi tạo sản phẩm mới.",
        error: err.message,
      });
    }
  },

  // [ADMIN] Cập nhật thông tin sản phẩm
  async updateProduct(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;

      let product = await Product.findOne({ ProductID: id });
      if (!product && id.match(/^[0-9a-fA-F]{24}$/)) {
        product = await Product.findById(id);
      }

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy sản phẩm để cập nhật.",
        });
      }

      if (updates.ProductName || updates.name) product.ProductName = (updates.ProductName || updates.name).trim();
      if (updates.price !== undefined) product.price = Number(updates.price);
      if (updates.CategoryID || updates.category) product.CategoryID = updates.CategoryID || updates.category;
      if (updates.BrandName || updates.brand) product.BrandName = updates.BrandName || updates.brand;
      if (updates.packaging || updates.variant) product.packaging = updates.packaging || updates.variant;
      if (updates.targetUser || updates.ageGroup) product.targetUser = updates.targetUser || updates.ageGroup;
      if (updates.imageUrl || updates.img) product.imageUrl = updates.imageUrl || updates.img;
      if (updates.description) product.description = updates.description;
      if (updates.slogan) product.slogan = updates.slogan;
      if (updates.Status !== undefined) product.Status = Boolean(updates.Status);

      await product.save();

      return res.status(200).json({
        success: true,
        message: "Cập nhật sản phẩm thành công!",
        data: product,
      });
    } catch (err) {
      console.error("Lỗi updateProduct:", err);
      return res.status(500).json({
        success: false,
        message: "Lỗi khi cập nhật sản phẩm.",
        error: err.message,
      });
    }
  },

  // [ADMIN] Chuyển đổi trạng thái ẩn / hiện sản phẩm
  async toggleProductStatus(req, res) {
    try {
      const { id } = req.params;
      let product = await Product.findOne({ ProductID: id });
      if (!product && id.match(/^[0-9a-fA-F]{24}$/)) {
        product = await Product.findById(id);
      }

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy sản phẩm.",
        });
      }

      product.Status = !product.Status;
      await product.save();

      return res.status(200).json({
        success: true,
        message: `Đã ${product.Status ? "kích hoạt mở bán" : "tạm ẩn"} sản phẩm!`,
        data: { ProductID: product.ProductID, Status: product.Status },
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Lỗi khi chuyển trạng thái sản phẩm.",
        error: err.message,
      });
    }
  },

  // [ADMIN] Xóa sản phẩm khỏi Database
  async deleteProduct(req, res) {
    try {
      const { id } = req.params;
      let result = await Product.findOneAndDelete({ ProductID: id });
      if (!result && id.match(/^[0-9a-fA-F]{24}$/)) {
        result = await Product.findByIdAndDelete(id);
      }

      if (!result) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy sản phẩm để xóa.",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Xóa sản phẩm khỏi database thành công!",
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Lỗi khi xóa sản phẩm.",
        error: err.message,
      });
    }
  },
};

module.exports = productController;
