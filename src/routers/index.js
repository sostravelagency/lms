const express = require("express");
const router = express.Router();
const multer = require("multer"); // Thư viện để xử lý upload file
const fs = require("fs"); // Thư viện để thao tác với file
const path = require("path");
const mysql = require("mysql2/promise");
const nodemailer = require("nodemailer");
const checkLoggedIn = require("../middleware/checkLogin");
const dbConfig = {
  host: "localhost",
  user: "root",
  password: "",
  database: "lms",
};

// Tạo pool kết nối MySQL
const pool = mysql.createPool(dbConfig);

// Thiết lập multer cho upload file
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "..", "uploads")); // Thư mục lưu trữ file upload
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // Đổi tên file để tránh trùng lặp
  },
});
const upload = multer({ storage: storage });
router.use(checkLoggedIn)
router.post("/login", async (req, res) => {
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
  else {
    return res.send(
      "Tài khoản hoặc mật khẩu không chính xác hoặc không tồn tại"
    );
  }
});

router.post("/student/addArticle", upload.single("file"), async (req, res) => {
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

router.post("/admin/addstudent", async (req, res) => {
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

router.post("/admin/updateStudent/:student_id", async (req, res) => {
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

router.post("/admin/deleteStudent/:student_id", async (req, res) => {
  const { student_id } = req.params;
  const connection = await pool.getConnection();
  const [rows] = await connection.query(
    "DELETE FROM student WHERE student_id= ?",
    [student_id]
  );
  connection.release();
  return res.send("Đã xoá sinh viên sinh viên thành công");
});

router.post("/admin/createDepartmentManager", async (req, res) => {
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

router.post(
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

router.post("/admin/updateDepartmentManager/:manager_id", async (req, res) => {
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

router.post("/admin/deleteDepartmentManager/:manager_id", async (req, res) => {
  const { manager_id } = req.params;
  const connection = await pool.getConnection();
  const [rows] = await connection.query(
    "DELETE FROM departmentManager WHERE department_manager_id= ?",
    [manager_id]
  );
  connection.release();
  return res.send("Đã xoá quản lý khoa thành công");
});

router.post(
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

router.post("/admin/editFaculty/:facultyId", async (req, res)=> {
  const connection= await pool.getConnection()
  const facultyId= req.params.facultyId
  const {name }= req.body
  const [rows]= await connection.query('update faculty SET department_name= ? WHERE department_id= ?', [name, facultyId])
  res.send("Update falcuty   successfully")
})

router.post("/admin/deleteFaculty/:facultyId", async (req, res)=> {
  const connection= await pool.getConnection()
  const facultyId= req.params.facultyId
  const [rows]= await connection.query('DELETE  from faculty WHERE department_id= ?', [facultyId])
  res.send("Delete falcuty successfully")
})

router.post('/admin/createAcademicYear', async (req, res) => {
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

router.post("/admin/addFaculty", async (req, res)=> {
  const connection= await pool.getConnection()
  const {name }= req.body
  const [result] = await connection.execute('INSERT into faculty(department_name) VALUES (?)', [name]);
  await connection.release();
  res.redirect('/admin/faculty');
})


router.post("/admin/createMarketing", async (req, res) => {
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


router.post("/admin/updateMarketing/:manager_id", async (req, res) => {
  const { name, email } = req.body;
  const { manager_id } = req.params;
  const connection = await pool.getConnection();
  const [rows] = await connection.query(
    "UPDATE marketing SET marketing_name= ?, marketing_email= ? WHERE marketing_id= ?",
    [name, email, manager_id]
  );
  connection.release();
  return res.render("admin/marketing/updateMarketing", {success: true});
});

router.post("/admin/deleteMarketing/:manager_id", async (req, res) => {
  const { manager_id } = req.params;
  const connection = await pool.getConnection();
  const [rows] = await connection.query(
    "DELETE FROM marketing WHERE marketing_id= ?",
    [manager_id]
  );
  connection.release();
  return res.send("Successfully delete marketing manager");
});


module.exports = router;
