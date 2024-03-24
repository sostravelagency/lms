// Middleware để kiểm tra trạng thái đăng nhập
const checkLoggedIn = (req, res, next) => {
    // Kiểm tra xem có tồn tại cookie 'loggedIn' và có giá trị true hay không
    if (req.cookies.role) {
      // Nếu có, người dùng đã đăng nhập, tiếp tục xử lý các yêu cầu khác
      res.locals.isLoggedIn = true; // Truyền trạng thái đăng nhập vào res.locals để sử dụng trong các views
    } else {
      // Nếu không, người dùng chưa đăng nhập
      res.locals.isLoggedIn = false;
    }
    next();
  };

module.exports= checkLoggedIn