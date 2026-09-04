const Branch = require("../models/branchModel");

const branchController = {
  // Lấy danh sách chi nhánh
  async getBranches(req, res) {
    try {
      const branches = await Branch.find().sort({ createdAt: -1 }).lean();
      return res.status(200).json({
        success: true,
        count: branches.length,
        data: branches,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Lỗi máy chủ khi lấy danh sách chi nhánh.",
        error: err.message,
      });
    }
  },

  // [ADMIN] Tạo chi nhánh mới
  async createBranch(req, res) {
    try {
      const { code, name, address, city, phone, hours } = req.body;
      if (!name || !address || !phone) {
        return res.status(400).json({
          success: false,
          message: "Vui lòng nhập đầy đủ tên, địa chỉ và số điện thoại chi nhánh.",
        });
      }

      const count = await Branch.countDocuments();
      const branchCode = code || `CN${String(count + 1).padStart(3, "0")}`;

      const branch = await Branch.create({
        code: branchCode,
        name: name.trim(),
        address: address.trim(),
        city: city || "TP. Hồ Chí Minh",
        phone: phone.trim(),
        hours: hours || "08:00 - 21:00 (Mở cửa cả tuần)",
        status: 1,
      });

      return res.status(201).json({
        success: true,
        message: "Thêm chi nhánh mới thành công!",
        data: branch,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Lỗi khi tạo chi nhánh mới.",
        error: err.message,
      });
    }
  },

  // [ADMIN] Bật / Tắt trạng thái chi nhánh
  async updateBranchStatus(req, res) {
    try {
      const { id } = req.params;
      let branch = await Branch.findOne({ code: id });
      if (!branch && id.match(/^[0-9a-fA-F]{24}$/)) {
        branch = await Branch.findById(id);
      }

      if (!branch) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy chi nhánh.",
        });
      }

      branch.status = branch.status === 1 ? 0 : 1;
      await branch.save();

      return res.status(200).json({
        success: true,
        message: `Đã chuyển đổi trạng thái chi nhánh: ${branch.name}`,
        data: branch,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Lỗi khi cập nhật chi nhánh.",
        error: err.message,
      });
    }
  },
};

module.exports = branchController;
