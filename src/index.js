const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");
const router = require("./routers");
const path = require("path");
const cookieParser = require("cookie-parser");
const checkAdminRole = require("./middleware/checkAdmin");
const checkLoggedIn = require("./middleware/checkLogin");
const extractUidFromCookie = require("./middleware/exactCookie");
const nodemailer = require("nodemailer");
const multer = require("multer");
const archiver = require('archiver');
const fs= require("fs")
const app = express();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "uploads")); // Thư mục lưu trữ file upload
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // Đổi tên file để tránh trùng lặp
  },
});
const upload = multer({ storage: storage });
// Cấu hình CORS
app.use(cors());

// Cấu hình kết nối MySQL
const dbConfig = {
  host: "localhost",
  user: "root",
  password: "",
  database: "lms",
};

// Tạo pool kết nối MySQL
const pool = mysql.createPool(dbConfig);

// Middleware cho JSON và dữ liệu form
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Cấu hình static files
app.use(express.static("public"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// Cấu hình template engine (ví dụ: Pug)
app.set("view engine", "ejs");
app.set("views", __dirname + "/views"); // Đường dẫn tới thư mục chứa các file .ejs
// app.use(router);
app.use(cookieParser());
app.use(checkLoggedIn);
app.use(extractUidFromCookie);

app.get("/logout", (req, res) => {
  res.clearCookie("role");
  res.clearCookie("uid");
  res.redirect("/");
});
app.get("/api/users", async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query("SELECT * FROM student");
    connection.release();
    res.json(rows);
  } catch (error) {
    console.error("Lỗi truy vấn cơ sở dữ liệu:", error);
    res.status(500).json({ err: "Lỗi truy vấn cơ sở dữ liệu" });
  }
});

// Định nghĩa route để hiển thị trang web
app.get("/", async (req, res) => {
  const connection = await pool.getConnection();
    const [rows] = await connection.query("SELECT * FROM post WHERE article_default= 1");
    connection.release();
  res.render("index", { title: "Home page", post: rows[0] });
});

app.get("/home", (req, res) => {
  res.redirect("/");
});

app.get("/login", (req, res) => {
  if (req.cookies.role === "admin") {
    res.redirect("admin/student");
  }
  if (req.cookies.role === "student") {
    res.redirect("student");
  }
  res.render("login", { title: "cLogin" });
});

app.get("/abc", (req, res) => {
  res.render("a", { title: "abc" });
});

app.get("/admin/addStudent", checkAdminRole, async (req, res) => {
  const connection = await pool.getConnection();
  const [rows] = await connection.query("SELECT * from faculty");
  res.render("admin/addStudent", { title: "Add student", faculty: rows });
});

app.get("/admin/student", checkAdminRole, async (req, res) => {
  const connection = await pool.getConnection();
  const [rows] = await connection.query("SELECT * FROM student");
  connection.release();
  res.render("admin/student", { students: rows });
});

app.get("/students/edit/:student_id", checkAdminRole, async (req, res) => {
  const connection = await pool.getConnection();
  const { student_id } = req.params;
  const [rows] = await connection.query(
    "SELECT * FROM student WHERE student_id= ?",
    [student_id]
  );
  connection.release();
  res.render("admin/updateStudent", {
    student: rows?.[0],
    title: "Update student",
  });
});

app.get("/students/delete/:student_id", checkAdminRole, async (req, res) => {
  const connection = await pool.getConnection();
  const { student_id } = req.params;
  const [rows] = await connection.query(
    "SELECT * FROM student WHERE student_id= ?",
    [student_id]
  );
  connection.release();
  res.render("admin/deleteStudent", {
    student: rows?.[0],
    title: "Delete student",
  });
});

//

app.get(
  "/admin/department/addDepartmentManager",
  checkAdminRole,
  async (req, res) => {
    const connection = await pool.getConnection();
    const [rows] = await connection.query("SELECT * from faculty");
    return res.render("admin/department/addDepartmentManager", {
      title: "Add department Manager",
      faculty: rows,
    });
  }
);


app.get(
  "/marketing/department/addDepartmentManager",
  // checkAdminRole,
  async (req, res) => {
    const connection = await pool.getConnection();
    const [rows] = await connection.query("SELECT * from faculty");
    return res.render("marketing/department/addDepartmentManager", {
      title: "Add department Manager",
      faculty: rows,
    });
  }
);

app.get("/admin/department", async (req, res) => {
  const connection = await pool.getConnection();
  const [rows] = await connection.query("SELECT * FROM departmentManager ");
  connection.release();
  return res.render("admin/department/index", {
    departments: rows,
    title: "Manage department manager",
  });
});

//

app.get("/student", (req, res) => {
  res.redirect("student/post");
});

app.get("/student/addArticle", (req, res) => {
  res.render("student/addArticle", { title: "Add new post" });
});

app.get("/student/post", async (req, res) => {
  const connection = await pool.getConnection();
  const student_id = req.cookies.uid;
  const [rows] = await connection.query(
    "SELECT * FROM post WHERE article_author_id = ?",
    [student_id]
  );
  console.log(rows);
  connection.release();
  res.render("student/post", { title: "Post", posts: rows });
});

app.get("/student/editArticle/:article_id", async (req, res) => {
  const connection = await pool.getConnection();
  const student_id = req.cookies.uid;
  const article_id = req.params.article_id;
  const [rows] = await connection.query(
    "SELECT * FROM post WHERE article_author_id = ? AND article_id= ?",
    [student_id, article_id]
  );
  connection.release();
  res.render("student/editArticle", { title: "Post", article: rows[0] });
});

//

app.get("/admin/departments/edit/:manager_id", async (req, res) => {
  const manager_id = req.params.manager_id;
  const connection = await pool.getConnection();
  const [rows] = await connection.query(
    "SELECT * FROM departmentManager WHERE department_manager_id = ?",
    [manager_id]
  );
  connection.release();
  res.render("admin/department/updateDepartmentManager", {
    title: "Update manager",
    departmentManager: rows[0],
  });
});

app.get("/marketing/departments/edit/:manager_id", async (req, res) => {
  const manager_id = req.params.manager_id;
  const connection = await pool.getConnection();
  const [rows] = await connection.query(
    "SELECT * FROM departmentManager WHERE department_manager_id = ?",
    [manager_id]
  );
  connection.release();
  res.render("marketing/department/updateDepartmentManager", {
    title: "Update manager",
    departmentManager: rows[0],
  });
});

app.get("/admin/departments/delete/:manager_id", async (req, res) => {
  const manager_id = req.params.manager_id;
  const connection = await pool.getConnection();
  const [rows] = await connection.query(
    "SELECT * FROM departmentManager INNER JOIN faculty ON faculty.department_id = departmentManager.department_id WHERE department_manager_id = ?",
    [manager_id]
  );
  connection.release();
  res.render("admin/department/deleteDepartmentManager", {
    title: "Delete manager",
    departmentManager: rows[0],
  });
});


app.get("/admin/marketing/delete/:manager_id", async (req, res) => {
  const manager_id = req.params.manager_id;
  const connection = await pool.getConnection();
  const [rows] = await connection.query(
    "SELECT * FROM departmentManager INNER JOIN faculty ON faculty.department_id = departmentManager.department_id WHERE department_manager_id = ?",
    [manager_id]
  );
  connection.release();
  res.render("marketing/department/deleteDepartmentManager", {
    title: "Delete manager",
    departmentManager: rows[0],
  });
});

app.get("/admin/post", async (req, res) => {
  const connection = await pool.getConnection();
  const [rows] = await connection.query(
    "SELECT * FROM post INNER JOIN student ON post.article_author_id = student.student_id"
  );
  connection.release();
  console.log(rows);
  res.render("admin/post/index", { title: "Post manager", posts: rows });
});

app.get("/department/student", async (req, res) => {
  const connection = await pool.getConnection();
  const manager_id = req.cookies.uid;
  const [rows0] = await connection.query(
    "SELECT * FROM departmentManager INNER JOIN faculty ON faculty.department_id = departmentManager.department_id WHERE departmentManager.department_manager_id= ?",
    [manager_id]
  );
  const [rows] = await connection.query(
    "SELECT * FROM student INNER JOIN faculty ON student.student_department_id = faculty.department_id WHERE faculty.department_id",
    [rows0[0].department_id]
  );
  connection.release();
  res.render("department/student", {
    title: "Student manager",
    students: rows,
  });
});

app.get("/department/post", async (req, res) => {
  const connection = await pool.getConnection();
  const manager_id = req.cookies.uid;
  const [rows0] = await connection.query(
    "SELECT * FROM departmentManager INNER JOIN faculty ON faculty.department_id = departmentManager.department_id WHERE departmentManager.department_manager_id= ?",
    [manager_id]
  );
  const [rows] = await connection.query(
    "SELECT * FROM post INNER JOIN student ON post.article_author_id = student.student_id WHERE student.student_department_id= ?",
    [rows0[0].department_id]
  );
  connection.release();
  console.log(rows);
  res.render("department/post", { title: "Post manager", posts: rows });
});

app.get("/editArticle/:article_id", async (req, res) => {
  const connection = await pool.getConnection();
  const article_id = req.params.article_id;
  const [rows] = await connection.query(
    "SELECT * FROM post WHERE article_id = ?",
    [article_id]
  );
  connection.release();
  res.render("editArticle", { title: "Edit article", article: rows[0] });
});

// app.get("/")

app.get("/viewArticle/:post_id", async (req, res) => {
  const connection = await pool.getConnection();
  const post_id = req.params.post_id;
  const [rows0] = await connection.query(
    "SELECT * FROM Comment INNER JOIN departmentManager ON Comment.author_id = departmentManager.department_manager_id INNER JOIN post ON post.article_id = Comment.article_id WHERE post.article_id = ?",
    [post_id]
  );
  const [rows] = await connection.query(
    "SELECT * FROM post INNER JOIN student ON student.student_id = post.article_author_id WHERE post.article_id = ?",
    [post_id]
  );
  const [rows1] = await connection.query(
    "SELECT * FROM post WHERE article_id = ?",
    [post_id]
  );
  connection.release();
  console.log(rows);
  res.render("department/detailPost", {
    title: "View detail article",
    post: rows1[0],
    author: rows[0],
    comments: rows0,
  });
});

app.get("/admin/addFaculty", async (req, res) => {
  res.render("admin/faculty/addFaculty", { title: "Add faculty" });
});

app.get("/admin/faculty", async (req, res) => {
  const connection = await pool.getConnection();
  const [rows] = await connection.query("SELECT * from faculty");
  res.render("admin/faculty", { title: "Manage Faculty", departments: rows });
});

app.get("/admin/editFaculty/:facultyId", async (req, res) => {
  const connection = await pool.getConnection();
  const facultyId = req.params.facultyId;
  const [rows] = await connection.query(
    "SELECT * from faculty WHERE department_id= ?",
    [facultyId]
  );
  console.log(rows[0]);
  res.render("admin/faculty/updateFaculty", {
    title: "Update Faculty",
    department: rows[0],
  });
});

app.get("/admin/deleteFaculty/:facultyId", async (req, res) => {
  const connection = await pool.getConnection();
  const facultyId = req.params.facultyId;
  const [rows] = await connection.query(
    "SELECT * from faculty WHERE department_id= ?",
    [facultyId]
  );
  console.log(rows[0]);
  res.render("admin/faculty/deleteFaculty", {
    title: "Update Faculty",
    department: rows[0],
  });
});

app.get("/admin/faculty/student", async (req, res) => {
  const connection = await pool.getConnection();
  const [departments] = await connection.execute("SELECT * from faculty");
  if (req.query.department) {
    const departmentId = req.query.department;
    const [selectedDepartment] = await connection.execute(
      "SELECT * from faculty WHERE department_id = ?",
      [departmentId]
    );
    const [students] = await connection.execute(
      "SELECT * FROM student WHERE student_department_id = ?",
      [departmentId]
    );
    res.render("admin/facultyStudent", {
      departments,
      students,
      selectedDepartment,
    });
  } else {
    res.render("admin/facultyStudent", { departments, students: undefined });
  }
});

app.get("/admin/year", async (req, res) => {
  const connection = await pool.getConnection();

  const [rows] = await connection.execute("SELECT * FROM academic_years");
  await connection.release();
  if (rows.length > 0) {
    res.render("admin/year/view", {
      title: "Manage year",
      academicYear: rows[0],
    });
  } else {
    res.redirect("/admin/year/setup");
  }
});

app.get("/admin/year/setup", async (req, res) => {
  res.render("admin/year", { title: "Set up year" });
});

app.get("/admin/createDepartment", async (req, res) => {
  res.render("admin/addFaculty", { title: "Create faculty" });
});

app.get("/admin/dashboardData", async (req, res) => {
  const connection = await pool.getConnection();

  const [studentCountRows] = await connection.execute(
    "SELECT COUNT(*) AS totalStudents FROM student"
  );
  const [deptManagerCountRows] = await connection.execute(
    "SELECT COUNT(*) AS totalDeptManagers FROM departmentManager"
  );
  connection.release();
  res.json({
    totalStudents: studentCountRows[0].totalStudents,
    totalDeptManagers: deptManagerCountRows[0].totalDeptManagers,
  });
});

app.get("/admin/dashboard", async (req, res)=> {
  const connection= await pool.getConnection()
  res.render("admin/dashboard", {title: "Dashboard"})
})

app.get("/marketing/dashboard", async (req, res)=> {
  const connection= await pool.getConnection()
  res.render("marketing/dashboard", {title: "Dashboard"})
})

app.get("/admin/marketing", async (req, res) => {
  const connection = await pool.getConnection();
  const [rows] = await connection.query("SELECT * FROM marketing ");
  connection.release();
  return res.render("admin/marketing/index", {
    marketings: rows,
    title: "Manage marketing manager",
  });
});

app.get("/admin/marketing/addMarketing", async (req, res)=> {
  res.render("admin/marketing/addMarketing")
})

app.get("/admin/marketing/edit/:manager_id", async (req, res) => {
  const manager_id = req.params.manager_id;
  const connection = await pool.getConnection();
  const [rows] = await connection.query(
    "SELECT * FROM marketing WHERE marketing_id = ?",
    [manager_id]
  );
  connection.release();
  res.render("admin/marketing/updateMarketing", {
    title: "Update marketing",
    marketing: rows[0],
    success: false
  });
});

app.post("/login", async (req, res) => {
  const connection = await pool.getConnection();
  const { email, password } = req.body;
  const [rows] = await connection.query(
    "SELECT * FROM student WHERE student_email = ? AND student_password= ?",
    [email, password]
  );
  if (rows.length > 0) {
    res.cookie("uid", rows[0].student_id);
    res.cookie("role", "student");
    connection.release();
    return res.redirect("student");
  }
  const [rows2] = await connection.query(
    "SELECT * FROM Admin WHERE admin_account = ? AND admin_password = ?",
    [email, password]
  );
  if (rows2.length > 0) {
    res.cookie("uid", rows2[0].id);
    res.cookie("role", "admin");
    connection.release();
    return res.redirect("admin/student");
  } 
  const [rows3] = await connection.query(
    "SELECT * FROM departmentManager WHERE manager_email = ? AND manager_password = ?",
    [email, password]
  );
  if (rows3.length > 0) {
    res.cookie("uid", rows3[0].department_manager_id);
    res.cookie("role", "d_manager");
    connection.release();
    return res.redirect("department/student");
  } 
  const [rows4] = await connection.query(
    "SELECT * FROM marketing WHERE marketing_email = ? AND marketing_password = ?",
    [email, password]
  );
  if (rows4.length > 0) {
    res.cookie("uid", rows4[0].marketing_id);
    res.cookie("role", "marketing");
    connection.release();
    return res.redirect("marketing");
  } 
  else {
    return res.send(
      "Tài khoản hoặc mật khẩu không chính xác hoặc không tồn tại"
    );
  }
});

app.post("/student/addArticle", upload.single("file"), async (req, res) => {
  const { title, content, student_id } = req.body;
  const file = req.file;
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query(
      "INSERT into post(article_title, article_content, article_file, article_author_id, article_created_at, article_updated_at) VALUES(?, ?, ?, ?, ?, ?)",
      [
        title,
        content,
        file.filename,
        student_id,
        new Date().toString(),
        new Date().toString(),
      ]
    );
    const [rows2]= await connection.query("SELECT * FROM student INNER JOIN departmentManager ON departmentManager.department_id = student.student_department_id WHERE student.student_id= ?", [student_id])
    if(rows2.length >0 ) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "datistpham@gmail.com", // Email của bạn
          pass: "xvthjqdnifhywkbt", // Mật khẩu của bạn
        },
      });
  
      const mailOptions = {
        from: "datistpham@gmail.com", // Email của bạn
        to: rows2[0].manager_email,
        subject: "Thông báo sinh viên đăng tải bài viết",
        text: `Xin chào ,Sinh viên ${rows2[0].student_name} đã đăng tải bài viết. Xin cảm ơn.`,
      };
      await transporter.sendMail(mailOptions);
    }
    connection.release();
    // res.json(rows);
    res.send("Bài viết đã được đăng thành công");
  } catch (error) {
    console.error("Lỗi truy vấn cơ sở dữ liệu:", error);
    res.status(500).json({ err: "Lỗi truy vấn cơ sở dữ liệu" });
  }
});

app.post("/admin/addstudent", async (req, res) => {
  const { name, email, password, department } = req.body;
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query(
      "INSERT INTO student(student_name, student_email, student_password, student_department_id) VALUES(?, ?, ?, ?)",
      [name, email, password, department]
    );
    connection.release();
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "datistpham@gmail.com", // Email của bạn
        pass: "xvthjqdnifhywkbt", // Mật khẩu của bạn
      },
    });

    const mailOptions = {
      from: "datistpham@gmail.com", // Email của bạn
      to: email,
      subject: "Thông tin tài khoản sinh viên",
      text: `Xin chào ${name},\n\nTài khoản của bạn đã được tạo.\nTên đăng nhập: ${email}\nMật khẩu: ${password} (mật khẩu của bạn)\n\nXin cảm ơn.`,
    };

    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
    return res.send("Đã thêm sinh viên thành công");
  } catch (error) {
    console.error("Lỗi truy vấn cơ sở dữ liệu:", error);
    return res.status(500).json({ err: "Lỗi truy vấn cơ sở dữ liệu" });
  }
});

app.post("/admin/updateStudent/:student_id", async (req, res) => {
  const { name, email, department } = req.body;
  const { student_id } = req.params;
  const connection = await pool.getConnection();
  const [rows] = await connection.query(
    "UPDATE student SET student_name= ?, student_email= ?, student_department_id= ? WHERE student_id= ?",
    [name, email, department, student_id]
  );
  connection.release();
  return res.send("Đã cập nhật sinh viên thành công");
});

app.post("/admin/deleteStudent/:student_id", async (req, res) => {
  const { student_id } = req.params;
  const connection = await pool.getConnection();
  const [rows] = await connection.query(
    "DELETE FROM student WHERE student_id= ?",
    [student_id]
  );
  connection.release();
  return res.send("Đã xoá sinh viên sinh viên thành công");
});

app.post("/admin/createDepartmentManager", async (req, res) => {
  const { email, name, department, password } = req.body;
  const connection = await pool.getConnection();
  const [rows] = await connection.query(
    "INSERT INTO departmentManager(department_id, manager_name, manager_email, manager_password ) VALUES(?, ?, ?, ?)",
    [department, name, email, password]
  );
  connection.release();
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "datistpham@gmail.com", // Email của bạn
      pass: "xvthjqdnifhywkbt", // Mật khẩu của bạn
    },
  });

  const mailOptions = {
    from: "datistpham@gmail.com", // Email của bạn
    to: email,
    subject: "Thông tin tài khoản người quản lý",
    text: `Xin chào ${name},\n\nTài khoản của bạn đã được tạo.\nTên đăng nhập: ${email}\nMật khẩu: ${password} (mật khẩu của bạn)\n\nXin cảm ơn.`,
  };

  await transporter.sendMail(mailOptions);
  return res.send(`Đã thêm người quản lý khoa ${name} thành công`);
});

app.post(
  "/student/updateArticle/:article_id",
  upload.single("file"),
  async (req, res) => {
    if (req.file) {
      const file = req.file.filename;
      const { title, content } = req.body;
      const { article_id } = req.params;
      const connection = await pool.getConnection();
      const [rows] = await connection.query(
        "UPDATE post SET article_title= ?, article_content= ?, article_file= ? WHERE article_id= ?",
        [title, content, file, article_id]
      );
      connection.release();
      return res.send("Đã cập nhật bài viết thành công");
    }
    const { title, content, file_old } = req.body;
    const { article_id } = req.params;
    const connection = await pool.getConnection();
    const [rows] = await connection.query(
      "UPDATE post SET article_title= ?, article_content= ?, article_file= ? WHERE article_id= ?",
      [title, content, file_old, article_id]
    );
    connection.release();
    return res.send("Đã cập nhật bài viết thành công");
  }
);

app.post("/admin/updateDepartmentManager/:manager_id", async (req, res) => {
  const { name, email, department } = req.body;
  const { manager_id } = req.params;
  const connection = await pool.getConnection();
  const [rows] = await connection.query(
    "UPDATE departmentManager SET manager_name= ?, manager_email= ?, department_id= ? WHERE department_manager_id= ?",
    [name, email, department, manager_id]
  );
  connection.release();
  return res.send("Đã cập nhật quản lý khoa thành công");
});

app.post("/admin/deleteDepartmentManager/:manager_id", async (req, res) => {
  const { manager_id } = req.params;
  const connection = await pool.getConnection();
  const [rows] = await connection.query(
    "DELETE FROM departmentManager WHERE department_manager_id= ?",
    [manager_id]
  );
  connection.release();
  return res.send("Đã xoá quản lý khoa thành công");
});

app.post(
  "/updateArticle/:article_id",
  upload.single("file"),
  async (req, res) => {
    if (req.file) {
      const file = req.file.filename;
      const { title, content } = req.body;
      const { article_id } = req.params;
      const connection = await pool.getConnection();
      const [rows] = await connection.query(
        "UPDATE post SET article_title= ?, article_content= ?, article_file= ? WHERE article_id= ?",
        [title, content, file, article_id]
      );
      connection.release();
      return res.send("Đã cập nhật bài viết thành công");
    }
    const { title, content, file_old } = req.body;
    const { article_id } = req.params;
    const connection = await pool.getConnection();
    const [rows] = await connection.query(
      "UPDATE post SET article_title= ?, article_content= ?, article_file= ? WHERE article_id= ?",
      [title, content, file_old, article_id]
    );
    connection.release();
    return res.send("Đã cập nhật bài viết thành công");
  }
);

app.post("/admin/editFaculty/:facultyId", async (req, res)=> {
  const connection= await pool.getConnection()
  const facultyId= req.params.facultyId
  const {name }= req.body
  const [rows]= await connection.query('update faculty SET department_name= ? WHERE department_id= ?', [name, facultyId])
  res.send("Update falcuty   successfully")
})

app.post("/admin/deleteFaculty/:facultyId", async (req, res)=> {
  const connection= await pool.getConnection()
  const facultyId= req.params.facultyId
  const [rows]= await connection.query('DELETE  from faculty WHERE department_id= ?', [facultyId])
  res.send("Delete falcuty successfully")
})

app.post('/admin/createAcademicYear', async (req, res) => {
  try { 
      const { year, startDate, endDate } = req.body;
      const connection= await pool.getConnection()
      const [result] = await connection.execute('INSERT INTO academic_years (year, start_date, end_date) VALUES (?, ?, ?)', [year, startDate, endDate]);
      await connection.release();
      res.redirect('/admin/year');
  } catch (error) {
      console.error('Error:', error);
      res.status(500).send('Internal Server Error');
  }
});

app.post("/admin/addFaculty", async (req, res)=> {
  const connection= await pool.getConnection()
  const {name }= req.body
  const [result] = await connection.execute('INSERT into faculty(department_name) VALUES (?)', [name]);
  await connection.release();
  res.redirect('/admin/faculty');
})


app.post("/admin/createMarketing", async (req, res) => {
  const { email, name, password } = req.body;
  const connection = await pool.getConnection();
  const [rows] = await connection.query(
    "INSERT INTO marketing(marketing_name, marketing_email, marketing_password ) VALUES(?, ?, ?)",
    [name, email, password]
  );
  connection.release();
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "datistpham@gmail.com", // Email của bạn
      pass: "xvthjqdnifhywkbt", // Mật khẩu của bạn
    },
  });

  const mailOptions = {
    from: "datistpham@gmail.com", // Email của bạn
    to: email,
    subject: "Infomation's marketing manager",
    text: `Hi ${name},\n\nYour account is created.\nAccount: ${email}\nPassword: ${password} (your password)\n\nBest regard.`,
  };

  await transporter.sendMail(mailOptions);
  return res.send(`Successful to create marketing manager ${name}`);
});


app.post("/admin/updateMarketing/:manager_id", async (req, res) => {
  const { name, email } = req.body;
  const { manager_id } = req.params;
  const connection = await pool.getConnection();
  const [rows] = await connection.query(
    "UPDATE marketing SET marketing_name= ?, marketing_email= ? WHERE marketing_id= ?",
    [name, email, manager_id]
  );
  const [rows1] = await connection.query(
    "SELECT * FROM marketing WHERE marketing_id = ?",
    [manager_id]
  );
  connection.release();
  connection.release();
  return res.render("admin/marketing/updateMarketing", {success: true, marketing: rows1[0], title: "Update marketing"});
});

app.post("/admin/deleteMarketing/:manager_id", async (req, res) => {
  const { manager_id } = req.params;
  const connection = await pool.getConnection();
  const [rows] = await connection.query(
    "DELETE FROM marketing WHERE marketing_id= ?",
    [manager_id]
  );
  connection.release();
  return res.send("Successfully delete marketing manager");
});


app.get("/admin/marketing/delete/:manager_id", async (req, res) => {
  const manager_id = req.params.manager_id;
  const connection = await pool.getConnection();
  const [rows] = await connection.query(
    "SELECT * FROM marketing WHERE marketing_id= ?",
    [manager_id]
  );
  connection.release();
  res.render("admin/marketing/deleteMarketing", {
    title: "Delete marketing",
    marketing: rows[0],
  });
});

// 


app.get("/marketing", async (req, res) => {
  const connection = await pool.getConnection();
  const [rows] = await connection.query(
    "SELECT * FROM post INNER JOIN student ON post.article_author_id = student.student_id",
  );
  connection.release();
  console.log(rows);
  res.render("marketing", { title: "Post manager", posts: rows });
});


app.get('/admin/downloadPostsZip', async (req, res) => {
  try {
      // Tạo một tệp zip
      const zipFileName = 'posts.zip';
      const zipFilePath = path.join(__dirname, '..', zipFileName);
      const output = fs.createWriteStream(zipFilePath);
      const archive = archiver('zip');
      const uploadsDir = path.join(__dirname, '/uploads');
      // Pipe các file đính kèm vào tệp zip
      archive.pipe(output);
      const connection = await pool.getConnection();
      const [posts] = await connection.query(
        "SELECT * FROM post INNER JOIN student ON post.article_author_id = student.student_id",
      );
      // Lặp qua danh sách các bài post và thêm file đính kèm vào tệp zip
      posts.forEach((post) => {
          const attachmentPath = path.join(uploadsDir, post.article_file);
          archive.append(fs.createReadStream(attachmentPath), { name: post.article_file });
      });

      // Gửi tệp zip về client khi hoàn thành
      archive.finalize();
      output.on('close', () => {
          res.download(zipFilePath, zipFileName, (err) => {
              // Xóa tệp zip sau khi tải về thành công hoặc xảy ra lỗi
              if (!err) {
                  fs.unlinkSync(zipFilePath);
              }
          });
      });
  } catch (err) {
      console.error('Error creating zip file:', err);
      res.status(500).send('Internal Server Error');
  }
});



app.get("/marketing/department", async (req, res) => {
  const connection = await pool.getConnection();
  const [rows] = await connection.query("SELECT * FROM departmentManager ");
  connection.release();
  return res.render("marketing/department/index", {
    departments: rows,
    title: "Manage department manager",
  });
});

app.get("/marketing/post", async (req, res)=> {
  res.redirect("/marketing")
})

app.post("/set-default-page/:article_id", async (req, res)=> {
  const article_id= req.params.article_id
  const connection = await pool.getConnection();
  const [rows] = await connection.query("UPDATE post SET article_default= 0 ");
  const [rows1] = await connection.query("UPDATE post SET article_default= 1 WHERE article_id= ? ", article_id);
  connection.release();
  return res.json({success: true})
})

// Khởi động server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server đang chạy trên cổng ${PORT}`);
});
