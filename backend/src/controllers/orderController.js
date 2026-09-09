const Order = require("../models/orderModel");

const orderController = {
  // Tạo đơn hàng mới từ Frontend (Checkout / Giỏ hàng)
  async createOrder(req, res) {
    try {
      const rawCustomer = req.body.customer || {};
      const receiverName = (req.body.ReceiverName || rawCustomer.fullName || rawCustomer.name || "").trim();
      const receiverPhone = (req.body.ReceiverPhone || rawCustomer.phone || "").trim();
      const rawShippingAddress = (req.body.ShippingAddress || rawCustomer.shippingAddress || rawCustomer.address || "").trim();
      const rawItems = req.body.Items || req.body.items || [];
      const deliveryType = req.body.DeliveryType || req.body.deliveryType || "DELIVERY";
      const branchName = req.body.BranchName || req.body.branchName || "";
      const computedSubTotal = rawItems.reduce(
        (sum, item) =>
          sum +
          Number(item.UnitPrice || item.price || 0) *
            Number(item.Quantity || item.quantity || 1),
        0
      );
      const subTotal = Number(
        req.body.SubTotal !== undefined
          ? req.body.SubTotal
          : req.body.subTotal !== undefined
          ? req.body.subTotal
          : computedSubTotal
      );
      const discount = Number(req.body.Discount || req.body.discount || 0);
      const shippingFee = Number(req.body.ShippingFee || req.body.shippingFee || 0);
      const totalAmount = Number(
        req.body.TotalAmount !== undefined
          ? req.body.TotalAmount
          : req.body.totalAmount !== undefined
          ? req.body.totalAmount
          : Math.max(0, subTotal - discount + shippingFee)
      );
      const couponCode = (req.body.CouponCode || req.body.couponCode || "").trim();
      const paymentMethod = req.body.PaymentMethod || req.body.paymentMethod || "COD";
      const hasVAT = Boolean(req.body.HasVAT !== undefined ? req.body.HasVAT : req.body.hasVAT);
      const vatInfo = req.body.VATInfo || req.body.vatInfo || {};
      const note = req.body.Note || req.body.note || rawCustomer.orderNote || "";
      const userID = req.body.UserID || req.body.userId || null;

      if (!receiverName || !receiverPhone || !Array.isArray(rawItems) || rawItems.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Vui lòng nhập đầy đủ thông tin người nhận và ít nhất 1 sản phẩm.",
        });
      }

      const totalOrderQty = rawItems.reduce(
        (sum, it) => sum + Number(it.Quantity || it.quantity || 1),
        0
      );
      if (totalOrderQty > 50) {
        return res.status(400).json({
          success: false,
          message: "Tổng số lượng tất cả sản phẩm trong 1 đơn hàng bán lẻ không được vượt quá 50 hộp!",
        });
      }

      // Tạo mã đơn hàng độc nhất: VD + YYMMDD + 4 chữ số thứ tự
      const datePart = new Date().toISOString().slice(2, 10).replace(/-/g, "");
      const orderCount = await Order.countDocuments();
      const OrderCode = `VD${datePart}${String(orderCount + 1).padStart(4, "0")}`;

      const finalShippingAddress =
        deliveryType === "STORE_PICKUP"
          ? `Nhận tại chi nhánh: ${branchName || "Cửa hàng VitaDairy"}`
          : rawShippingAddress;

      const newOrder = await Order.create({
        OrderCode,
        UserID: userID,
        ReceiverName: receiverName,
        ReceiverPhone: receiverPhone,
        ShippingAddress: finalShippingAddress,
        DeliveryType: deliveryType,
        BranchName: branchName,
        Items: rawItems.map((item) => ({
          ProductID: String(item.ProductID || item.id || "sp-default"),
          ProductName: item.ProductName || item.name || "Sữa VitaDairy",
          VariantName: item.VariantName || item.packaging || item.volume || "Lon tiêu chuẩn",
          Quantity: Number(item.Quantity || item.quantity || 1),
          UnitPrice: Number(item.UnitPrice || item.price || 0),
          ImageURL: item.ImageURL || item.imageUrl || item.image || "",
        })),
        SubTotal: subTotal,
        Discount: discount,
        TotalAmount: totalAmount,
        ShippingFee: shippingFee,
        CouponCode: couponCode,
        PaymentMethod: paymentMethod,
        PaymentStatus: paymentMethod === "COD" ? "Pending" : "Completed",
        OrderStatus: "Processing",
        HasVAT: hasVAT,
        VATInfo: hasVAT ? {
          Company: vatInfo?.Company || vatInfo?.company || "",
          TaxId: vatInfo?.TaxId || vatInfo?.taxId || "",
          Email: vatInfo?.Email || vatInfo?.email || "",
          Address: vatInfo?.Address || vatInfo?.address || "",
        } : {},
        Note: note,
      });

      return res.status(201).json({
        success: true,
        message: "Đặt hàng thành công!",
        data: newOrder,
      });
    } catch (err) {
      console.error("Lỗi createOrder:", err);
      return res.status(500).json({
        success: false,
        message: "Lỗi máy chủ khi tạo đơn hàng.",
        error: err.message,
      });
    }
  },

  // Lấy danh sách đơn hàng (cho Admin hoặc xem đơn hàng người dùng)
  async getOrders(req, res) {
    try {
      const { status, search, userId } = req.query;
      const query = {};

      if (status && status !== "ALL") {
        query.OrderStatus = status;
      }
      if (userId) {
        query.UserID = userId;
      }
      if (search && search.trim()) {
        const regex = new RegExp(search.trim(), "i");
        query.$or = [
          { OrderCode: regex },
          { ReceiverName: regex },
          { ReceiverPhone: regex },
        ];
      }

      const orders = await Order.find(query).sort({ createdAt: -1 }).lean();

      return res.status(200).json({
        success: true,
        count: orders.length,
        data: orders,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Lỗi máy chủ khi lấy danh sách đơn hàng.",
        error: err.message,
      });
    }
  },

  // Lấy chi tiết một đơn hàng theo ID hoặc OrderCode
  async getOrderById(req, res) {
    try {
      const { id } = req.params;
      let order = await Order.findOne({ OrderCode: id }).lean();
      if (!order && id.match(/^[0-9a-fA-F]{24}$/)) {
        order = await Order.findById(id).lean();
      }

      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy đơn hàng.",
        });
      }

      return res.status(200).json({
        success: true,
        data: order,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Lỗi khi lấy chi tiết đơn hàng.",
        error: err.message,
      });
    }
  },

  // [ADMIN] Cập nhật trạng thái đơn hàng (Processing, Shipping, Completed, Cancelled)
  async updateOrderStatus(req, res) {
    try {
      const { id } = req.params;
      const { OrderStatus, PaymentStatus } = req.body;

      let order = await Order.findOne({ OrderCode: id });
      if (!order && id.match(/^[0-9a-fA-F]{24}$/)) {
        order = await Order.findById(id);
      }

      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy đơn hàng.",
        });
      }

      if (OrderStatus) order.OrderStatus = OrderStatus;
      if (PaymentStatus) order.PaymentStatus = PaymentStatus;

      await order.save();

      return res.status(200).json({
        success: true,
        message: `Đã cập nhật trạng thái đơn hàng sang: ${order.OrderStatus}`,
        data: order,
      });
    } catch (err) {
      console.error("Lỗi updateOrderStatus:", err);
      return res.status(500).json({
        success: false,
        message: "Lỗi khi cập nhật trạng thái đơn hàng.",
        error: err.message,
      });
    }
  },
};

module.exports = orderController;
