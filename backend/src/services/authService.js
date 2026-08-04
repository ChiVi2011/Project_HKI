// Thiết lập điều kiện username
const detectLoginType = (account) => {
  const emailRegex =
    /^(?=.{6,100}$)[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  const phoneRegex = /^(0|\+84)[0-9]{9,10}$/;
  
  if (emailRegex.test(account)) {
    return "email";
  }
  if (phoneRegex.test(account)) {
    return "phone";
  }
  const isLikelyPhone = /^[0-9+]/.test(account);
  if (isLikelyPhone) {
    return "invalid_phone";
  }
  return "invalid_mail";
};


//Thiết lập điều kiện password
const isStrongPassword = (password) => {
  // Tối thiểu 10 ký tự, có chữ hoa, chữ thường, số, ký tự đặc biệt
  const strongPasswordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_\-+=])[A-Za-z\d@$!%*?&#^()_\-+=]{10,}$/;
  return strongPasswordRegex.test(password);
};

module.exports = { detectLoginType, isStrongPassword };
