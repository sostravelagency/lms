// Middleware để trích xuất uid từ cookie
const extractUidFromCookie = (req, res, next) => {
    const uid = req.cookies.uid; // Giả sử cookie có tên là 'uid'
    res.locals.uid = uid; // Lưu giá trị uid vào biến locals để sử dụng trong các views
    next();
  };

module.exports= extractUidFromCookie