-- phpMyAdmin SQL Dump
-- version 5.0.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Apr 05, 2024 at 06:28 AM
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
-- Database: `lms`
--

-- --------------------------------------------------------

--
-- Table structure for table `academic_years`
--

CREATE TABLE `academic_years` (
  `id` int(11) NOT NULL,
  `year` varchar(255) NOT NULL,
  `start_date` varchar(255) NOT NULL,
  `end_date` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `academic_years`
--

INSERT INTO `academic_years` (`id`, `year`, `start_date`, `end_date`) VALUES
(4, 'Year 1', '2024-03-27', '2024-08-03');

-- --------------------------------------------------------

--
-- Table structure for table `Admin`
--

CREATE TABLE `Admin` (
  `id` int(11) NOT NULL,
  `admin_account` varchar(255) NOT NULL,
  `admin_password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `Admin`
--

INSERT INTO `Admin` (`id`, `admin_account`, `admin_password`) VALUES
(1, 'admin@gmail.com', '124567');

-- --------------------------------------------------------

--
-- Table structure for table `admin_post`
--

CREATE TABLE `admin_post` (
  `article_id` int(11) NOT NULL,
  `article_title` varchar(255) NOT NULL,
  `article_content` varchar(255) NOT NULL,
  `article_file` varchar(255) NOT NULL,
  `article_created_at` varchar(255) NOT NULL,
  `article_updated_at` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `admin_post`
--

INSERT INTO `admin_post` (`article_id`, `article_title`, `article_content`, `article_file`, `article_created_at`, `article_updated_at`) VALUES
(2, 'aaaaa1', 'aaaa', '1711732783617-1711731116568-I WILL CALL IT LOVE [HaIÌ_ LeIÌ_].jpg', 'Sat Mar 30 2024 00:19:43 GMT+0700 (Indochina Time)', 'Sat Mar 30 2024 00:19:43 GMT+0700 (Indochina Time)');

-- --------------------------------------------------------

--
-- Table structure for table `Comment`
--

CREATE TABLE `Comment` (
  `id` int(11) NOT NULL,
  `author_id` int(11) NOT NULL,
  `content` varchar(255) NOT NULL,
  `article_id` int(11) NOT NULL,
  `time_created` varchar(2555) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `Comment`
--

INSERT INTO `Comment` (`id`, `author_id`, `content`, `article_id`, `time_created`) VALUES
(1, 1, 'aaa', 2, 'Fri Apr 05 2024 01:03:27 GMT+0700 (Indochina Time)'),
(2, 1, 'aaa', 2, 'Fri Apr 05 2024 01:07:04 GMT+0700 (Indochina Time)'),
(3, 1, 'aa', 2, 'Fri Apr 05 2024 01:08:56 GMT+0700 (Indochina Time)'),
(4, 1, 'aaa', 2, 'Fri Apr 05 2024 01:09:36 GMT+0700 (Indochina Time)'),
(5, 1, 'aaaaaa', 2, 'Fri Apr 05 2024 01:09:51 GMT+0700 (Indochina Time)'),
(6, 1, 'llllllll', 2, 'Fri Apr 05 2024 10:59:43 GMT+0700 (Indochina Time)'),
(7, 1, 'aaaaa', 16, 'Fri Apr 05 2024 11:09:20 GMT+0700 (Indochina Time)'),
(8, 1, 'mojmm', 2, 'Fri Apr 05 2024 11:12:13 GMT+0700 (Indochina Time)'),
(9, 1, '', 2, 'Fri Apr 05 2024 11:12:14 GMT+0700 (Indochina Time)'),
(10, 1, 'klll\n', 2, 'Fri Apr 05 2024 11:12:36 GMT+0700 (Indochina Time)');

-- --------------------------------------------------------

--
-- Table structure for table `departmentManager`
--

CREATE TABLE `departmentManager` (
  `department_manager_id` int(11) NOT NULL,
  `department_id` int(11) DEFAULT NULL,
  `manager_name` varchar(255) DEFAULT NULL,
  `manager_email` varchar(255) DEFAULT NULL,
  `manager_password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `departmentManager`
--

INSERT INTO `departmentManager` (`department_manager_id`, `department_id`, `manager_name`, `manager_email`, `manager_password`) VALUES
(1, 1, 'Nguyen Aaaaaa', 'gianglamweb@gmail.com', '124567'),
(3, 1, 'aaaa', 'admsaain@gmail.com', '124567'),
(4, 1, 'ssaasaas', 'asasasasas@gmail.com', '124567');

-- --------------------------------------------------------

--
-- Table structure for table `faculty`
--

CREATE TABLE `faculty` (
  `department_id` int(11) NOT NULL,
  `department_name` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `faculty`
--

INSERT INTO `faculty` (`department_id`, `department_name`) VALUES
(1, 'Khoa CNTT6'),
(2, 'KHMT');

-- --------------------------------------------------------

--
-- Table structure for table `marketing`
--

CREATE TABLE `marketing` (
  `marketing_id` int(11) NOT NULL,
  `marketing_name` varchar(255) NOT NULL,
  `marketing_email` varchar(255) NOT NULL,
  `marketing_password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `marketing`
--

INSERT INTO `marketing` (`marketing_id`, `marketing_name`, `marketing_email`, `marketing_password`) VALUES
(1, 'Marketing 211', 'datistpham@gmail.com', '124567890');

-- --------------------------------------------------------

--
-- Table structure for table `post`
--

CREATE TABLE `post` (
  `article_id` int(11) NOT NULL,
  `article_title` varchar(255) DEFAULT NULL,
  `article_content` text DEFAULT NULL,
  `article_file` varchar(255) NOT NULL,
  `article_author_id` int(11) DEFAULT NULL,
  `article_default` int(11) NOT NULL DEFAULT 0,
  `article_created_at` varchar(255) NOT NULL,
  `article_updated_at` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `post`
--

INSERT INTO `post` (`article_id`, `article_title`, `article_content`, `article_file`, `article_author_id`, `article_default`, `article_created_at`, `article_updated_at`) VALUES
(2, 'aaaaa12', 'aaaa', '1711732783617-1711731116568-I WILL CALL IT LOVE [HaIÌ_ LeIÌ_].jpg', 3, 0, 'Sun Mar 24 2024 20:04:33 GMT+0700 (Indochina Time)', 'Sun Mar 24 2024 20:04:33 GMT+0700 (Indochina Time)'),
(3, 'qq', 'aaaa', '1711303949778-11 (1).png', 3, 1, 'Mon Mar 25 2024 01:12:29 GMT+0700 (Indochina Time)', 'Mon Mar 25 2024 01:12:29 GMT+0700 (Indochina Time)'),
(4, 'aaa', 'aaaa', '1711304027589-Company_Profile (1).pdf', 3, 1, 'Mon Mar 25 2024 01:13:47 GMT+0700 (Indochina Time)', 'Mon Mar 25 2024 01:13:47 GMT+0700 (Indochina Time)'),
(5, 'aaa', 'aaaaa', '1711478692115-ababa1.png', 3, 0, 'Wed Mar 27 2024 01:44:52 GMT+0700 (Indochina Time)', 'Wed Mar 27 2024 01:44:52 GMT+0700 (Indochina Time)'),
(6, 'aaa', 'aaaaa', '1711478734681-z5285489300639_d58a5ad9c26ccf81e16aec93be31b965 (1).jpg', 3, 1, 'Wed Mar 27 2024 01:45:34 GMT+0700 (Indochina Time)', 'Wed Mar 27 2024 01:45:34 GMT+0700 (Indochina Time)'),
(7, 'aaaaa', 'aaaaaaaaa', '1711481805112-431246147_789506672539189_6245120796590572149_n.png', 3, 1, 'Wed Mar 27 2024 02:36:45 GMT+0700 (Indochina Time)', 'Wed Mar 27 2024 02:36:45 GMT+0700 (Indochina Time)'),
(8, 'aa', 'aaa', '1711567384109-hiÌnh trang trang gioÌÌi thieÌ£Ìu Minh Khang.png', 4, 1, 'Thu Mar 28 2024 02:23:04 GMT+0700 (Indochina Time)', 'Thu Mar 28 2024 02:23:04 GMT+0700 (Indochina Time)'),
(15, 'aaa', 'aaaa', '1712290111558-msg5019194192-40376.jpg', 4, 0, 'Fri Apr 05 2024 11:08:31 GMT+0700 (Indochina Time)', 'Fri Apr 05 2024 11:08:31 GMT+0700 (Indochina Time)'),
(16, 'aaa1111', 'aaaa11111', '1712290133387-post (2).zip', 4, 0, 'Fri Apr 05 2024 11:08:53 GMT+0700 (Indochina Time)', 'Fri Apr 05 2024 11:08:53 GMT+0700 (Indochina Time)'),
(17, 'abvabababa', 'abababababa', '1712290500394-post (2).zip', 3, 0, 'Fri Apr 05 2024 11:15:00 GMT+0700 (Indochina Time)', 'Fri Apr 05 2024 11:15:00 GMT+0700 (Indochina Time)');

-- --------------------------------------------------------

--
-- Table structure for table `student`
--

CREATE TABLE `student` (
  `student_id` int(11) NOT NULL,
  `student_name` varchar(255) DEFAULT NULL,
  `student_email` varchar(255) DEFAULT NULL,
  `student_password` varchar(255) DEFAULT NULL,
  `student_department_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `student`
--

INSERT INTO `student` (`student_id`, `student_name`, `student_email`, `student_password`, `student_department_id`) VALUES
(2, 'aaaaadasass', 'dak@gmail.com', '12456789', 1),
(3, 'Nguyen A', 'datistpham@gmail.com', '12456789', 1),
(4, 'giang', 'gianglamweb@gmail.com', '12456789', 1),
(5, 'aaaaaaaa', 'datistpham4@gmail.com', '1245678', 2);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `academic_years`
--
ALTER TABLE `academic_years`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `Admin`
--
ALTER TABLE `Admin`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `admin_post`
--
ALTER TABLE `admin_post`
  ADD PRIMARY KEY (`article_id`);

--
-- Indexes for table `Comment`
--
ALTER TABLE `Comment`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `departmentManager`
--
ALTER TABLE `departmentManager`
  ADD PRIMARY KEY (`department_manager_id`),
  ADD KEY `department_id` (`department_id`);

--
-- Indexes for table `faculty`
--
ALTER TABLE `faculty`
  ADD PRIMARY KEY (`department_id`);

--
-- Indexes for table `marketing`
--
ALTER TABLE `marketing`
  ADD PRIMARY KEY (`marketing_id`);

--
-- Indexes for table `post`
--
ALTER TABLE `post`
  ADD PRIMARY KEY (`article_id`);

--
-- Indexes for table `student`
--
ALTER TABLE `student`
  ADD PRIMARY KEY (`student_id`),
  ADD KEY `student_department_id` (`student_department_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `academic_years`
--
ALTER TABLE `academic_years`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `Admin`
--
ALTER TABLE `Admin`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `admin_post`
--
ALTER TABLE `admin_post`
  MODIFY `article_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `Comment`
--
ALTER TABLE `Comment`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `departmentManager`
--
ALTER TABLE `departmentManager`
  MODIFY `department_manager_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `faculty`
--
ALTER TABLE `faculty`
  MODIFY `department_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `marketing`
--
ALTER TABLE `marketing`
  MODIFY `marketing_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `post`
--
ALTER TABLE `post`
  MODIFY `article_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `student`
--
ALTER TABLE `student`
  MODIFY `student_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `departmentManager`
--
ALTER TABLE `departmentManager`
  ADD CONSTRAINT `departmentmanager_ibfk_1` FOREIGN KEY (`department_id`) REFERENCES `Khoa` (`department_id`);

--
-- Constraints for table `student`
--
ALTER TABLE `student`
  ADD CONSTRAINT `student_ibfk_1` FOREIGN KEY (`student_department_id`) REFERENCES `Khoa` (`department_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
