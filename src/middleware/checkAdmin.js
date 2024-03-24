const checkAdminRole = (req, res, next) => {
    // Kiểm tra xem cookie 'role' có tồn tại và có giá trị 'admin' hay không
    if (req.cookies.role === 'admin') {
      // Nếu cookie 'role' tồn tại và có giá trị 'admin', tiếp tục xử lý các yêu cầu khác
      next();
    } else {
      // Nếu cookie 'role' không tồn tại hoặc có giá trị không phải 'admin', trả về lỗi 403 (Forbidden)
      res.status(403).send('You do not have permission to access this page.');
    }
  };

module.exports= checkAdminRole