const sql = require("mssql");
const db = require("../config/database");
const bcrypt = require("bcrypt");

// Tạo mã khách hàng tự động +  lấy "KH" làm tiền tố
async function generateCustomeCode() {
  const result = await pool.request().query(`
        SELECT TOP 1 CustomerCode FROM Users ORDER BY UserID DESC`);
  const last = result.recordset[0]?.CustomerCode || "KH00000";
  const newCustomCode = pareInt(last.replace("KH", "")) + 1;
  return "KH" + String(newCustomCode).padStart(5, "0");
}

const userModel = {
  // Lấy ds User trên DB
  async getAll() {
    const pool = await db(); //Kết nối đến SQL Server
    const result = await pool.request().query(`SELECT * FROM Users`);
    return result.recordset;
  },
  //Lấy dữ liệu theo ID
  async getById(UserID) {
    const pool = await db(); //Kết nối đến SQL Server
    const result = await pool
      .request()
      .input("UserID", sql.Int, UserID)
      .query(`SELECT * FROM Users WHERE UserID = @UserID`);
    return result.recordset[0];
  },
  // lấy dữ liệu theo email
  async getByEmail(Email) {
    const pool = await db(); //Kết nối đến SQL Server
    const result = await pool
      .request()
      .input("Email", sql.Int, Email)
      .query(`SELECT * FROM Users WHERE Email = @Email`);
    return result.recordset[0];
  },
  // lấy dữ liệu theo sđt
  async getByPhone(Phone) {
    const pool = await db(); //Kết nối đến SQL Server
    const result = await pool
      .request()
      .input("Phone", sql.Int, Phone)
      .query(`SELECT * FROM Users WHERE Phone = @Phone`);
    return result.recordset[0];
  },
  // Lấy PasswordHash để so sánh khi login
  async getPasswordHash(UserID) {
    const pool = await db(); //Kết nối đến SQL Server
    const result = await pool
      .request()
      .input("UserID", sql.Int, UserID)
      .query(`SELECT * FROM Passwords WHERE UserID = @UserID`);
    return result.recordset[0]?.PasswordHash;
  },
  // Tạo User + Pass mới
  async createUser(user) {
    const pool = await db();
    const transaction = new sql.Transaction(pool); //truy cập 2 bảng khác nhau
    const passwordHash = await bcrypt.hash(user.Password, 10);
    await transaction.begin(); //Bắt đầu transaction — từ đây mọi lệnh SQL chưa lưu thật vào DB

    try {
      // Bước 1: Insert user (CustomerCode để tạm giá trị rỗng hoặc 'TEMP')
      const userResult = await transaction
        .request()
        .input("CustomerCode", sql.VarChar, "TEMP")
        .input("FullName", sql.NVarChar, user.FullName)
        .input("Gender", sql.Bit, user.Gender)
        .input("DateOfBirth", sql.Date, user.DateOfBirth ?? null)
        .input("Phone", sql.VarChar, user.Phone)
        .input("Email", sql.VarChar, user.Email)
        .input("Avatar", sql.VarChar, user.Avatar ?? null)
        .query(`INSERT INTO Users (CustomerCode,FullName, Gender, DateOfBirth, Phone, Email, Avatar)
        OUTPUT INSERTED.* VALUES (@CustomerCode, @FullName, @Gender, @DateOfBirth, @Phone, @Email, @Avatar)`);
      const newUser = userResult.recordset[0]; //  Lấy thông tin user vừa tạo (bao gồm UserID tự sinh)

      //Bước 2. Giờ đã có UserID thật, tạo mã KH chính thức
      const customerCode = `KH${String(newUser.UserID).padStart(6, "0")}`;

      // Bước 3: Update CustomerCode cho user vừa tạo
      await transaction
        .request()
        .input("CustomerCode", sql.VarChar, customerCode)
        .input("UserID", sql.Int, newUser.UserID)
        .query(
          "UPDATE Users SET CustomerCode = @CustomerCode WHERE UserID = @UserID",
        );
      // user impot pass

      await transaction
        .request()
        .input("UserID", sql.Int, newUser.UserID) // đổi từ kiểu int sang UUID
        .input("PasswordHash", sql.VarChar, passwordHash)
        .query(
          "INSERT INTO UserPasswords (UserID, PasswordHash) VALUES (@UserID, @PasswordHash)",
        );

      // Thực hiện lưu vào database
      await transaction.commit();
      newUser.CustomerCode = customerCode;
      return newUser;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
  // ===== UPDATE =====
  async updateProfile(UserID, data) {
    const pool = await db(); //Kết nối đến SQL Server
    const result = await pool
      .request()
      .input("UserID", sql.Int, UserID)
      .input("FullName", sql.NVARCHAR, data.FullName)
      .input("Phone", sql.VARCHAR, data.Phone)
      .input("Email", sql.VARCHAR, data.Email)
      .input("Avatar", sql.VARCHAR, data.Avatar)
      .input("Gender", sql.Bit, data.Gender ?? null)
      .input("DateOfBirth", sql.Date, data.DateOfBirth ?? null).query(`
        UPDATE Users SET 
        FullName = @FullName,
          Gender = @Gender,
          DateOfBirth = @DateOfBirth,
          Phone = @Phone,
          Email = @Email,
          Avatar = @Avatar,
          UpdatedAt = GETDATE() 
          OUTPUT INSERTED.*
          WHERE UserID = @UserID`);
    return result.recordset[0];
  },

  // Update Pass
  async updatePassword(UserID, newPassword) {
    const pool = await db(); //Kết nối đến SQL Server
    const newHash = await bcrypt.hash(newPassword, 10);
    await pool
      .request()
      .input("UserID", sql.Int, UserID)
      .input("PasswordHash", sql.VarChar, newHash)
      .query(
        `UPDATE Passwords SET PasswordHash = @PasswordHash WHERE UserID = @UserID`,
      );
  },
};
module.exports = userModel;
