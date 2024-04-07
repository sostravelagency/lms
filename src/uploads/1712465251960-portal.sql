-- phpMyAdmin SQL Dump
-- version 5.0.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Apr 04, 2024 at 08:18 AM
-- Server version: 10.4.11-MariaDB
-- PHP Version: 7.4.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `portal`
--

-- --------------------------------------------------------

--
-- Table structure for table `absense_application`
--

CREATE TABLE `absense_application` (
  `id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `class_id` int(11) NOT NULL,
  `content` text NOT NULL,
  `course_id` int(11) NOT NULL,
  `attach_file` varchar(255) NOT NULL,
  `time_absense` int(11) NOT NULL,
  `time_created` varchar(255) NOT NULL,
  `status` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `absense_application`
--

INSERT INTO `absense_application` (`id`, `student_id`, `class_id`, `content`, `course_id`, `attach_file`, `time_absense`, `time_created`, `status`) VALUES
(1, 2, 9, 'i want to leave to this school', 2, '8421a003-4965-422d-a89c-ab83e2647e01.pdf', 4, '2023-04-30 13:42:01.463000', 0),
(4, 2, 9, 'aaaa', 2, 'c3db2ba3-3808-4dde-9b6e-7fea19cf3c44.pdf', 3, '2023-04-30 14:23:18.817000', 0);

-- --------------------------------------------------------

--
-- Table structure for table `account`
--

CREATE TABLE `account` (
  `account_id` varchar(255) NOT NULL,
  `account` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `account`
--

INSERT INTO `account` (`account_id`, `account`, `password`, `role`) VALUES
('1', 'admin', '123456789', 3),
('1625c3e1-5048-449f-9e74-9c683223e2a9', '23614288', 'L|llTEf&', 0),
('1a83cceb-58da-4af0-b478-3cabd92e3db9', '23009742', 'm?T8qD^|', 0),
('2', 'student1', '1234567Aaa!', 1),
('226d3aa9-1012-4254-96a8-02771a721126', '23512278', 'SSp9%8B>', 0),
('3302a9a3-4c4a-42c7-a4cd-0eebba5a8db5', 'teacher4', '12456789', 2),
('37f24e90-f345-4797-9905-09b389d4c2dd', 'admin', '123456789', 1),
('44294ef1-d87f-4482-b3d3-154f3518f3e0', 'teacher234', '123456789', 2),
('61dde8be-cf3a-4297-983c-653f7536cb7a', 'aaaaaaaaa', 'aaaaaaaaaa', 2),
('6a5d63a8-7b55-4e49-8f18-7dbfc8b5b622', 'student12', 'Giangvippro1!', 1),
('6e6e35ad-43cb-4728-85d3-6ca8bac2fbb5', 'account12345678', '1111111111111', 1),
('6ef3cfff-48d9-4119-b08e-7c8bf1560d64', 'teacher1', '123456789', 2),
('b448400b-6dee-4045-aecc-f74e40d4638a', 'admin', '123456789', 1),
('bdf00ee4-f8bf-41b8-94dd-8523dbff4bd4', 'admin', '123456789', 1),
('bec2b166-81b0-4dfd-9c53-98a8c82a60a0', 'account3', '037482389239', 1),
('f4d9cde8-629b-4071-8848-6fb94f0a5229', 'student3', 'Giangvippro1!', 1);

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `id` int(11) NOT NULL,
  `account` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`id`, `account`, `password`) VALUES
(1, 'admin', '123456789\r\n');

-- --------------------------------------------------------

--
-- Table structure for table `attendance`
--

CREATE TABLE `attendance` (
  `id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `class_id` int(11) NOT NULL,
  `course_id` int(11) NOT NULL,
  `attendance` int(11) NOT NULL DEFAULT 0,
  `time_attendance` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `attendance`
--

INSERT INTO `attendance` (`id`, `student_id`, `class_id`, `course_id`, `attendance`, `time_attendance`) VALUES
(1, 2, 3, 2, 1, '07-05-2023');

-- --------------------------------------------------------

--
-- Table structure for table `class`
--

CREATE TABLE `class` (
  `class_id` int(11) NOT NULL,
  `class_name` varchar(255) NOT NULL,
  `class_description` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `class`
--

INSERT INTO `class` (`class_id`, `class_name`, `class_description`) VALUES
(1, '10a1', '10a1 class'),
(2, '10a2', '10a2 class'),
(3, '10a3', '10a3 class'),
(4, '10a4', '10a4 class'),
(5, '11a1', '11a1 class'),
(6, '11a2', '11a2 class'),
(7, '11a3 ', '11a3 class'),
(8, '11a4', '11a4 class'),
(9, '12a1', '12a1 class'),
(10, '12a2 ', '12a2 class'),
(11, '12a3', '12a3 class'),
(12, '12a4', '12a4 class');

-- --------------------------------------------------------

--
-- Table structure for table `course`
--

CREATE TABLE `course` (
  `course_id` int(11) NOT NULL,
  `course_name` varchar(255) NOT NULL,
  `course_description` text NOT NULL,
  `lesson_number` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `course`
--

INSERT INTO `course` (`course_id`, `course_name`, `course_description`, `lesson_number`) VALUES
(1, 'Ngữ Văn 10', 'Ngữ văn 10 description', 50),
(2, 'Ngữ văn 11', 'Ngữ văn 11 v', 40),
(3, 'Ngữ văn 12', 'Ngữ văn 12 desc', 100);

-- --------------------------------------------------------

--
-- Table structure for table `post`
--

CREATE TABLE `post` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `image` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `time_created` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `post`
--

INSERT INTO `post` (`id`, `title`, `image`, `content`, `time_created`) VALUES
(1, 'Post title 123', 'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg', '<p>Test post</p>', ''),
(2, 'sáas', '/assets/i/e8c624ad-b1b3-483a-b579-fb4c009af8a5.png', '<p>sasaasas</p>', '2023-04-22 16:41:53.003000');

-- --------------------------------------------------------

--
-- Table structure for table `schedule`
--

CREATE TABLE `schedule` (
  `id` int(11) NOT NULL,
  `course_id` int(11) NOT NULL,
  `class_id` int(11) NOT NULL,
  `day_schedule` varchar(255) NOT NULL,
  `shift` int(11) NOT NULL,
  `time_start` int(11) NOT NULL,
  `time_end` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `schedule`
--

INSERT INTO `schedule` (`id`, `course_id`, `class_id`, `day_schedule`, `shift`, `time_start`, `time_end`) VALUES
(1, 2, 3, '02/05/2023', 1, 3, 5);

-- --------------------------------------------------------

--
-- Table structure for table `score`
--

CREATE TABLE `score` (
  `score_id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `class_id` int(11) NOT NULL,
  `course_id` int(11) NOT NULL,
  `score_1` float NOT NULL,
  `score_2` float NOT NULL,
  `mid_term` float NOT NULL,
  `final_term` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `score`
--

INSERT INTO `score` (`score_id`, `student_id`, `class_id`, `course_id`, `score_1`, `score_2`, `mid_term`, `final_term`) VALUES
(1, 2, 3, 2, 9, 9, 10, 8.5),
(2, 12, 2, 3, 10, 10, 10, 10),
(3, 12, 2, 3, 11, 11, 11, 10),
(4, 12, 2, 3, 10, 10, 10, 10),
(5, 12, 3, 2, 10, 10, 10, 10);

-- --------------------------------------------------------

--
-- Table structure for table `sign_up_student`
--

CREATE TABLE `sign_up_student` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `middle_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `dob` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `class_id` int(11) NOT NULL,
  `avatar` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `student`
--

CREATE TABLE `student` (
  `student_id` int(11) NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `middle_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `class_id` int(11) NOT NULL,
  `dob` varchar(255) NOT NULL,
  `gender` int(11) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `account_id` varchar(255) NOT NULL,
  `avatar` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `student`
--

INSERT INTO `student` (`student_id`, `first_name`, `middle_name`, `last_name`, `class_id`, `dob`, `gender`, `phone`, `account_id`, `avatar`, `email`) VALUES
(2, 'Nguyen', 'Van ', 'A', 9, '06/08/2002', 0, '0328931219', '2', '/assets/i/48ad8edc-05b0-4a87-b897-ccc7a2004678.png', 'datistpham@gmail.com'),
(3, 'Nguyen', 'Van', 'B', 7, '10/07/2000', 0, '028192819', '6e6e35ad-43cb-4728-85d3-6ca8bac2fbb5', '/assets/i/9488dbff-b5a4-47ae-a84f-86c3e824d797.png', ''),
(4, 'Tran ', 'Van ', 'C', 7, '18/05/2023', 0, '038293122', 'bdf00ee4-f8bf-41b8-94dd-8523dbff4bd4', '', ''),
(5, 'Nguyen', 'Ngoc ', 'A', 9, '01/05/2023', 0, '0389289111', 'f4d9cde8-629b-4071-8848-6fb94f0a5229', '', ''),
(6, 'Pham', 'Van', 'D', 5, '21/05/2023', 0, '03819289211', '6a5d63a8-7b55-4e49-8f18-7dbfc8b5b622', '/assets/i/0590815d-0916-4d83-a0c6-20332e729eb3.png', ''),
(7, 'Nguyen ', 'Van', 'O', 7, '29/05/2023', 0, '03829192422', 'bec2b166-81b0-4dfd-9c53-98a8c82a60a0', '/assets/i/862ecbf9-a5bd-4c99-8953-c35d5a31326c.png', ''),
(11, 'Nguyen', 'Duc', 'A', 7, '20/05/2002', 0, '03289812121', '1a83cceb-58da-4af0-b478-3cabd92e3db9', '/assets/i/04afa761-45b0-4bcb-a6a4-410e5fd760cd.png', ''),
(12, 'Nguyen', 'Van ', 'A', 3, '03/05/2023', 0, '0321839120', '226d3aa9-1012-4254-96a8-02771a721126', '/assets/i/2d199d28-e716-4686-b1be-c56e43a420fd.png', '');

-- --------------------------------------------------------

--
-- Table structure for table `student_learning_course`
--

CREATE TABLE `student_learning_course` (
  `id` int(11) NOT NULL,
  `course_id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `time_register` varchar(255) NOT NULL,
  `status` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `student_learning_course`
--

INSERT INTO `student_learning_course` (`id`, `course_id`, `student_id`, `time_register`, `status`) VALUES
(1, 1, 2, '2023-04-28 23:54:24.126000', 0);

-- --------------------------------------------------------

--
-- Table structure for table `teacher`
--

CREATE TABLE `teacher` (
  `teacher_id` int(11) NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `middle_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `dob` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `account_id` varchar(255) NOT NULL,
  `avatar` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `teacher`
--

INSERT INTO `teacher` (`teacher_id`, `first_name`, `middle_name`, `last_name`, `dob`, `phone`, `account_id`, `avatar`) VALUES
(2, 'Nguyen', 'Thị', 'Yến Nhi', '06/01/1997', '03921891', '6ef3cfff-48d9-4119-b08e-7c8bf1560d64', '/assets/i/f9087ffa-2ee0-44ee-bb0c-110263f56662.png'),
(3, 'Nguyễn ', 'Thị ', 'Khánh Ngân', '12/07/1999', '0388015984', '44294ef1-d87f-4482-b3d3-154f3518f3e0', '/assets/i/23197e0c-cc98-40c1-b62b-e8acbfd6db7f.png'),
(4, 'aaa', 'aâ', 'aaaa', '25/03/2024', '0278728121', '3302a9a3-4c4a-42c7-a4cd-0eebba5a8db5', '/assets/i/9ec32e35-9ce4-4dac-9a76-c478214287df.png'),
(5, 'aaaa', 'aaaaaaa', 'aaaaaaa', '28/03/2024', '02678612211', 'd9eaaba8-df1e-46df-80c6-09e9fd71ccf4', '/assets/i/2e2b9106-8dcb-4e57-a88a-2e20ac88a1ac.png'),
(6, 'aaaa', 'aaaaaaa', 'aaaaaaa', '28/03/2024', '02678612211', '61dde8be-cf3a-4297-983c-653f7536cb7a', '/assets/i/39137a13-4796-4b29-a1fa-9b75e92583f1.png');

-- --------------------------------------------------------

--
-- Table structure for table `teacher_homeroom`
--

CREATE TABLE `teacher_homeroom` (
  `teacher_id` int(11) NOT NULL,
  `class_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `teacher_homeroom`
--

INSERT INTO `teacher_homeroom` (`teacher_id`, `class_id`) VALUES
(6, 5),
(2, 9);

-- --------------------------------------------------------

--
-- Table structure for table `teacher_teach_subject`
--

CREATE TABLE `teacher_teach_subject` (
  `teacher_teach_subject_id` int(11) NOT NULL,
  `teacher_id` int(11) NOT NULL,
  `course_id` int(11) NOT NULL,
  `class_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `teacher_teach_subject`
--

INSERT INTO `teacher_teach_subject` (`teacher_teach_subject_id`, `teacher_id`, `course_id`, `class_id`) VALUES
(2, 2, 2, 3);

-- --------------------------------------------------------

--
-- Table structure for table `verify_code`
--

CREATE TABLE `verify_code` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `code` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `verify_code`
--

INSERT INTO `verify_code` (`id`, `email`, `code`) VALUES
(10, 'datistpham@gmail.com', '512918');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `absense_application`
--
ALTER TABLE `absense_application`
  ADD PRIMARY KEY (`id`),
  ADD KEY `student_id` (`student_id`),
  ADD KEY `class_id` (`class_id`),
  ADD KEY `course_id` (`course_id`);

--
-- Indexes for table `account`
--
ALTER TABLE `account`
  ADD PRIMARY KEY (`account_id`);

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `attendance`
--
ALTER TABLE `attendance`
  ADD PRIMARY KEY (`id`),
  ADD KEY `student_id` (`student_id`),
  ADD KEY `class_id` (`class_id`);

--
-- Indexes for table `class`
--
ALTER TABLE `class`
  ADD PRIMARY KEY (`class_id`);

--
-- Indexes for table `course`
--
ALTER TABLE `course`
  ADD PRIMARY KEY (`course_id`);

--
-- Indexes for table `post`
--
ALTER TABLE `post`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `schedule`
--
ALTER TABLE `schedule`
  ADD PRIMARY KEY (`id`),
  ADD KEY `course_id` (`course_id`),
  ADD KEY `class_id` (`class_id`);

--
-- Indexes for table `score`
--
ALTER TABLE `score`
  ADD PRIMARY KEY (`score_id`),
  ADD KEY `student_id` (`student_id`),
  ADD KEY `class_id` (`class_id`),
  ADD KEY `course_id` (`course_id`);

--
-- Indexes for table `sign_up_student`
--
ALTER TABLE `sign_up_student`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `student`
--
ALTER TABLE `student`
  ADD PRIMARY KEY (`student_id`),
  ADD KEY `account_id` (`account_id`),
  ADD KEY `class_id` (`class_id`);

--
-- Indexes for table `student_learning_course`
--
ALTER TABLE `student_learning_course`
  ADD PRIMARY KEY (`id`),
  ADD KEY `time_register` (`time_register`),
  ADD KEY `student_id` (`student_id`),
  ADD KEY `course_id` (`course_id`);

--
-- Indexes for table `teacher`
--
ALTER TABLE `teacher`
  ADD PRIMARY KEY (`teacher_id`),
  ADD KEY `account_id` (`account_id`);

--
-- Indexes for table `teacher_homeroom`
--
ALTER TABLE `teacher_homeroom`
  ADD PRIMARY KEY (`class_id`,`teacher_id`),
  ADD KEY `teacher_id` (`teacher_id`);

--
-- Indexes for table `teacher_teach_subject`
--
ALTER TABLE `teacher_teach_subject`
  ADD PRIMARY KEY (`teacher_teach_subject_id`),
  ADD KEY `teacher_id` (`teacher_id`),
  ADD KEY `course_id` (`course_id`),
  ADD KEY `class_id` (`class_id`);

--
-- Indexes for table `verify_code`
--
ALTER TABLE `verify_code`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `absense_application`
--
ALTER TABLE `absense_application`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `attendance`
--
ALTER TABLE `attendance`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `class`
--
ALTER TABLE `class`
  MODIFY `class_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `course`
--
ALTER TABLE `course`
  MODIFY `course_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `post`
--
ALTER TABLE `post`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `schedule`
--
ALTER TABLE `schedule`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `score`
--
ALTER TABLE `score`
  MODIFY `score_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `sign_up_student`
--
ALTER TABLE `sign_up_student`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `student`
--
ALTER TABLE `student`
  MODIFY `student_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `student_learning_course`
--
ALTER TABLE `student_learning_course`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `teacher`
--
ALTER TABLE `teacher`
  MODIFY `teacher_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `teacher_teach_subject`
--
ALTER TABLE `teacher_teach_subject`
  MODIFY `teacher_teach_subject_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `verify_code`
--
ALTER TABLE `verify_code`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `absense_application`
--
ALTER TABLE `absense_application`
  ADD CONSTRAINT `absense_application_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `student` (`student_id`);

--
-- Constraints for table `attendance`
--
ALTER TABLE `attendance`
  ADD CONSTRAINT `attendance_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `student` (`student_id`);

--
-- Constraints for table `schedule`
--
ALTER TABLE `schedule`
  ADD CONSTRAINT `schedule_ibfk_1` FOREIGN KEY (`class_id`) REFERENCES `class` (`class_id`);

--
-- Constraints for table `score`
--
ALTER TABLE `score`
  ADD CONSTRAINT `score_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `student` (`student_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `score_ibfk_2` FOREIGN KEY (`class_id`) REFERENCES `class` (`class_id`),
  ADD CONSTRAINT `score_ibfk_3` FOREIGN KEY (`course_id`) REFERENCES `course` (`course_id`);

--
-- Constraints for table `student_learning_course`
--
ALTER TABLE `student_learning_course`
  ADD CONSTRAINT `student_learning_course_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `student` (`student_id`);

--
-- Constraints for table `teacher_homeroom`
--
ALTER TABLE `teacher_homeroom`
  ADD CONSTRAINT `teacher_homeroom_ibfk_1` FOREIGN KEY (`teacher_id`) REFERENCES `teacher` (`teacher_id`),
  ADD CONSTRAINT `teacher_homeroom_ibfk_2` FOREIGN KEY (`class_id`) REFERENCES `class` (`class_id`);

--
-- Constraints for table `teacher_teach_subject`
--
ALTER TABLE `teacher_teach_subject`
  ADD CONSTRAINT `teacher_teach_subject_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `course` (`course_id`),
  ADD CONSTRAINT `teacher_teach_subject_ibfk_2` FOREIGN KEY (`class_id`) REFERENCES `class` (`class_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
