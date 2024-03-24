const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const router = require('./routers');
const path = require('path');
const cookieParser = require('cookie-parser');
const checkAdminRole = require('./middleware/checkAdmin');
const checkLoggedIn = require('./middleware/checkLogin');
const extractUidFromCookie = require('./middleware/exactCookie');
const app = express();

// Cấu hình CORS
app.use(cors());

// Cấu hình kết nối MySQL
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'lms'
};

// Tạo pool kết nối MySQL
const pool = mysql.createPool(dbConfig);

// Middleware cho JSON và dữ liệu form
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Cấu hình static files
app.use(express.static('public'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Cấu hình template engine (ví dụ: Pug)
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views'); // Đường dẫn tới thư mục chứa các file .ejs
app.use(router)
app.use(cookieParser());
app.use(checkLoggedIn);
app.use(extractUidFromCookie)


app.get('/logout', (req, res) => {
  res.clearCookie('role');
  res.clearCookie('uid');
  res.redirect('/');
});
app.get('/api/users', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM SinhVien');
    connection.release();
    res.json(rows);
  } catch (error) {
    console.error('Lỗi truy vấn cơ sở dữ liệu:', error);
    res.status(500).json({err: 'Lỗi truy vấn cơ sở dữ liệu'});
  }
});

// Định nghĩa route để hiển thị trang web
app.get('/', (req, res) => {
  res.render('index', { title: 'Home page' });
});

app.get("/home", (req, res)=> {
  res.redirect("/")
})

app.get("/login", (req, res)=> {
  if(req.cookies.role=== "admin") {
    res.redirect("admin/student")
  }
  if(req.cookies.role=== "student") {
    res.redirect("student")
  }
  res.render("login", {title: "cLogin"})
})

app.get("/abc", (req, res)=> {
  res.render("a", {title: "abc"})
})

app.get("/admin/addStudent", checkAdminRole, (req, res)=> {
  res.render("admin/addStudent", {title: "Add student"})
})

app.get("/admin/student", checkAdminRole, async (req, res)=> {
  const connection = await pool.getConnection();
  const [rows] = await connection.query('SELECT * FROM SinhVien');
  connection.release();
  res.render("admin/student", {students: rows})
})

app.get("/students/edit/:student_id", checkAdminRole, async (req, res)=> {
  const connection = await pool.getConnection();
  const {student_id }= req.params
  const [rows] = await connection.query('SELECT * FROM SinhVien WHERE student_id= ?', [student_id]);
  connection.release();
  res.render("admin/updateStudent", {student: rows?.[0], title: "Update student"})

})

app.get("/students/delete/:student_id", checkAdminRole, async (req, res)=> {
  const connection = await pool.getConnection();
  const {student_id }= req.params
  const [rows] = await connection.query('SELECT * FROM SinhVien WHERE student_id= ?', [student_id]);
  connection.release();
  res.render("admin/deleteStudent", {student: rows?.[0], title: "Delete student"})
})


// 

app.get("/admin/department/addDepartmentManager", checkAdminRole, (req, res)=> {
  return res.render("admin/department/addDepartmentManager", {title: "Add department Manager"})
})

app.get("/admin/department", async (req, res)=> {
  const connection = await pool.getConnection();
  const [rows] = await connection.query('SELECT * FROM QuanLyKhoa ');
  connection.release();
  return res.render("admin/department/index", {departments: rows, title: "Manage department manager"})
})

// 


app.get("/student", (req, res)=> {
  res.redirect("student/post")
})

app.get("/student/addArticle", (req, res)=> {
  res.render("student/addArticle", {title: "Add new post"})
})

app.get("/student/post", async (req, res)=> {
  const connection = await pool.getConnection();
  const student_id= req.cookies.uid
  const [rows] = await connection.query('SELECT * FROM BaiViet WHERE article_author_id = ?', [student_id]);
  console.log(rows)
  connection.release();
  res.render("student/post", {title: "Post", posts: rows})
})

app.get("/student/editArticle/:article_id", async (req, res)=> {
  const connection = await pool.getConnection();
  const student_id= req.cookies.uid
  const article_id= req.params.article_id
  const [rows] = await connection.query('SELECT * FROM BaiViet WHERE article_author_id = ? AND article_id= ?', [student_id, article_id]);
  connection.release();
  res.render("student/editArticle", {title: "Post", article: rows[0]})
})

// 

app.get("/admin/departments/edit/:manager_id", async (req, res)=> {
  const manager_id= req.params.manager_id
  const connection = await pool.getConnection();
  const [rows] = await connection.query('SELECT * FROM QuanLyKhoa WHERE department_manager_id = ?', [manager_id]);
  connection.release();
  res.render("admin/department/updateDepartmentManager", {title: "Update manager", departmentManager: rows[0]})
})

app.get("/admin/departments/delete/:manager_id", async (req, res)=> {
  const manager_id= req.params.manager_id
  const connection= await pool.getConnection()
  const [rows] = await connection.query('SELECT * FROM QuanLyKhoa INNER JOIN Khoa ON Khoa.department_id = QuanLyKhoa.department_id WHERE department_manager_id = ?', [manager_id]);
  connection.release();
  res.render("admin/department/deleteDepartmentManager", {title: "Delete manager", departmentManager: rows[0]})

})

app.get("/admin/post", async (req, res)=> {
  const connection= await pool.getConnection()
  const [rows] = await connection.query('SELECT * FROM BaiViet INNER JOIN SinhVien ON BaiViet.article_author_id = SinhVien.student_id');
  connection.release();
  console.log(rows)
  res.render("admin/post/index", {title: "Post manager", posts: rows})

})


app.get("/department/student", async (req, res)=> {
  const connection= await pool.getConnection()
  const manager_id = req.cookies.uid
  const [rows0]= await connection.query("SELECT * FROM QuanLyKhoa INNER JOIN Khoa ON Khoa.department_id = QuanLyKhoa.department_id WHERE QuanLyKhoa.department_manager_id= ?", [manager_id])
  const [rows] = await connection.query('SELECT * FROM SinhVien INNER JOIN Khoa ON SinhVien.student_department_id = Khoa.department_id WHERE Khoa.department_id', [rows0[0].department_id]);
  connection.release();
  res.render("department/student", {title: "Student manager", students: rows})
  
})

app.get("/department/post", async (req, res)=> {
  const connection= await pool.getConnection()
  const manager_id = req.cookies.uid
  const [rows0]= await connection.query("SELECT * FROM QuanLyKhoa INNER JOIN Khoa ON Khoa.department_id = QuanLyKhoa.department_id WHERE QuanLyKhoa.department_manager_id= ?", [manager_id])
  const [rows] = await connection.query('SELECT * FROM BaiViet INNER JOIN SinhVien ON BaiViet.article_author_id = SinhVien.student_id WHERE SinhVien.student_department_id= ?', [rows0[0].department_id]);
  connection.release();
  console.log(rows)
  res.render("department/post", {title: "Post manager", posts: rows})

})

app.get("/editArticle/:article_id", async (req, res)=> {
  const connection = await pool.getConnection();
  const article_id= req.params.article_id
  const [rows] = await connection.query('SELECT * FROM BaiViet WHERE article_id = ?', [article_id]);
  connection.release();
  res.render("editArticle", {title: "Edit article", article: rows[0]})
})

// app.get("/")

app.get("/viewArticle/:post_id", async (req, res)=> {
  const connection= await pool.getConnection()
  const post_id= req.params.post_id
  const [rows0]= await connection.query('SELECT * FROM Comment INNER JOIN QuanLyKhoa ON Comment.author_id = QuanLyKhoa.department_manager_id INNER JOIN BaiViet ON BaiViet.article_id = Comment.article_id WHERE BaiViet.article_id = ?', [post_id])
  const [rows] = await connection.query('SELECT * FROM BaiViet INNER JOIN SinhVien ON SinhVien.student_id = BaiViet.article_author_id WHERE BaiViet.article_id = ?', [post_id]);
  const [rows1] = await connection.query('SELECT * FROM BaiViet WHERE article_id = ?', [post_id]);
  connection.release();
  console.log(rows)
  res.render("department/detailPost", {title: "View detail article", post: rows1[0], author: rows[0], comments: rows0})

})

// Khởi động server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server đang chạy trên cổng ${PORT}`);
});
