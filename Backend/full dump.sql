-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: ferenje_clinic_hcms
-- ------------------------------------------------------
-- Server version	8.0.42

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `appointment`
--

DROP TABLE IF EXISTS `appointment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `appointment` (
  `appointment_id` int NOT NULL AUTO_INCREMENT,
  `card_id` int DEFAULT NULL,
  `doctor_id` int DEFAULT NULL,
  `appointment_start_time` datetime DEFAULT NULL,
  `appointment_end_time` datetime DEFAULT NULL,
  `status` enum('scheduled','completed','cancelled') COLLATE utf8mb4_unicode_ci DEFAULT 'scheduled',
  PRIMARY KEY (`appointment_id`),
  KEY `card_id` (`card_id`),
  KEY `doctor_id` (`doctor_id`),
  CONSTRAINT `appointment_ibfk_1` FOREIGN KEY (`card_id`) REFERENCES `card` (`card_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `appointment_ibfk_2` FOREIGN KEY (`doctor_id`) REFERENCES `doctor` (`doctor_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `appointment`
--

LOCK TABLES `appointment` WRITE;
/*!40000 ALTER TABLE `appointment` DISABLE KEYS */;
INSERT INTO `appointment` VALUES (4,2,2,'2025-12-12 14:41:00','2025-12-12 14:41:00','scheduled'),(5,6,2,'2025-12-12 15:27:00','2025-12-12 15:27:00','scheduled'),(6,2,2,'2025-12-15 11:41:00','2025-12-15 11:41:00','scheduled'),(7,10,9,'2025-12-20 00:25:00','2025-12-20 00:25:00','scheduled'),(8,10,9,'2025-12-20 13:02:00','2025-12-20 13:02:00','completed'),(11,14,9,'2025-12-21 12:22:00','2025-12-21 12:22:00','scheduled'),(12,14,9,'2025-12-21 11:11:00','2025-12-21 11:11:00','scheduled');
/*!40000 ALTER TABLE `appointment` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-01-03 11:09:05
-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: ferenje_clinic_hcms
-- ------------------------------------------------------
-- Server version	8.0.42

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `available_lab_tests`
--

DROP TABLE IF EXISTS `available_lab_tests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `available_lab_tests` (
  `test_id` int NOT NULL AUTO_INCREMENT,
  `test_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `UnitOfMeasure` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `NormalRange_Male` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `NormalRange_Female` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `TestCategory` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`test_id`),
  UNIQUE KEY `test_name` (`test_name`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `available_lab_tests`
--

LOCK TABLES `available_lab_tests` WRITE;
/*!40000 ALTER TABLE `available_lab_tests` DISABLE KEYS */;
INSERT INTO `available_lab_tests` VALUES (1,'WBC','5.1-11x10³/cu mm','5.1-11','5.1-11','HEMA - CBC',120.00),(2,'L','%','31-60','31-60','HEMA - CBC',120.00),(3,'N','%','44-74','44-74','HEMA - CBC',120.00),(4,'M','%','4-10','4-10','HEMA - CBC',120.00),(5,'E','%','2-4','2-4','HEMA - CBC',120.00),(6,'B','%','0-2.5','0-2.5','HEMA - CBC',120.00),(7,'HCT','%','37-54','35-49','HEMA',120.00),(8,'Hgb','g/dL','13.2-17.7','11.8-15.6','HEMA',120.00),(9,'ESR','mm/hr','0-15','0-20','HEMA',120.00),(10,'RBC','x 10^6/cu mm','4.5-6.5','4.1-5.1','HEMA',120.00),(11,'Blood Group Rh','Rh Factor','Positive/Negative','Positive/Negative','HEMA',120.00),(12,'Blood Films','Result','Normal','Normal','HEMA',120.00),(13,'Reticulocyte','%','0.5-2.5','0.5-2.5','HEMA',120.00),(14,'TPHA/ASAH/Sickell','Result','Negative','Negative','HEMA',120.00),(15,'Platelet Count','x 10^3/cu mm','150-400','150-400','HEMA',120.00),(16,'Color','','','','URINALYSIS',120.00),(17,'Appearance','','','','URINALYSIS',120.00),(18,'PH','5.5-8.0','5.5-8.0','5.5-8.0','URINALYSIS',120.00),(19,'Protein','','Negative','Negative','URINALYSIS',120.00),(20,'Glucose','','Negative','Negative','URINALYSIS',120.00),(21,'Nitrite','','Negative','Negative','URINALYSIS',120.00),(22,'Bilirubin (D)','','Negative','Negative','URINALYSIS',120.00),(23,'Bilirubin (T)','','0.1-1.0 mg/dL','0.1-1.0 mg/dL','URINALYSIS',120.00),(24,'Ketone','','Negative','Negative','URINALYSIS',120.00),(25,'Urobilinogen','','0.1-1.0 mg/dL','0.1-1.0 mg/dL','URINALYSIS',120.00),(27,'RBS','mg/dL','80-120','80-120','CHEMISTRY',120.00),(28,'FBS','mg/dL','70-120','70-120','CHEMISTRY',120.00),(29,'VDRL','Titer','Negative','Negative','SEROLOGY',120.00),(30,'Well Felix','Titer','Negative','Negative','SEROLOGY',120.00),(31,'HBsAg','','Negative','Negative','SEROLOGY',120.00),(32,'HCVAb','','Negative','Negative','SEROLOGY',120.00),(33,'ANA','','Negative','Negative','SEROLOGY',120.00),(34,'ASO titer','Titer','Negative','Negative','SEROLOGY',120.00),(35,'Stool Ova/Parasite','','Negative','Negative','STOOL',120.00),(36,'Gram Stain','','Negative','Negative','BACTERIOLOGY',120.00);
/*!40000 ALTER TABLE `available_lab_tests` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-01-03 11:09:00
-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: ferenje_clinic_hcms
-- ------------------------------------------------------
-- Server version	8.0.42

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `card`
--

DROP TABLE IF EXISTS `card`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `card` (
  `card_id` int NOT NULL AUTO_INCREMENT,
  `patient_id` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `CardNumber` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('Active','Inactive','Expired') COLLATE utf8mb4_unicode_ci DEFAULT 'Active',
  `issue_date` date NOT NULL,
  `expire_date` date DEFAULT NULL,
  PRIMARY KEY (`card_id`),
  UNIQUE KEY `CardNumber` (`CardNumber`),
  KEY `patient_id` (`patient_id`),
  CONSTRAINT `card_ibfk_1` FOREIGN KEY (`patient_id`) REFERENCES `patient` (`patient_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `card`
--

LOCK TABLES `card` WRITE;
/*!40000 ALTER TABLE `card` DISABLE KEYS */;
INSERT INTO `card` VALUES (2,'1','CARD-0001','Active','2025-12-13','2026-12-13'),(6,'P176561631111151','274212163111111757','Active','2025-12-13','2026-12-13'),(7,'P1765621949458450','928345219494587495','Active','2025-12-13','2026-12-13'),(9,'P176620539929258','935561053992920902','Active','2025-12-19','2026-12-20'),(10,'P1766217223941365','729604172239413127','Active','2025-12-19','2026-12-20'),(14,'P1766299128394657','474756','Active','2025-12-20','2026-12-21'),(15,'P1766399281132427','695804','Active','2026-07-24','2026-12-22');
/*!40000 ALTER TABLE `card` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-01-03 11:09:07
-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: ferenje_clinic_hcms
-- ------------------------------------------------------
-- Server version	8.0.42

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `department`
--

DROP TABLE IF EXISTS `department`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `department` (
  `department_id` int NOT NULL AUTO_INCREMENT,
  `department_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`department_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `department`
--

LOCK TABLES `department` WRITE;
/*!40000 ALTER TABLE `department` DISABLE KEYS */;
INSERT INTO `department` VALUES (2,'Doctor'),(3,'Receptionist'),(4,'Lab Doctor'),(5,'Admin');
/*!40000 ALTER TABLE `department` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-01-03 11:09:11
-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: ferenje_clinic_hcms
-- ------------------------------------------------------
-- Server version	8.0.42

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `doctor`
--

DROP TABLE IF EXISTS `doctor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `doctor` (
  `doctor_id` int NOT NULL,
  `office_no` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `specialization` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`doctor_id`),
  CONSTRAINT `doctor_ibfk_1` FOREIGN KEY (`doctor_id`) REFERENCES `person` (`person_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `doctor`
--

LOCK TABLES `doctor` WRITE;
/*!40000 ALTER TABLE `doctor` DISABLE KEYS */;
INSERT INTO `doctor` VALUES (2,'Room 10','General Practitioner'),(9,'102',NULL);
/*!40000 ALTER TABLE `doctor` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-01-03 11:09:04
-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: ferenje_clinic_hcms
-- ------------------------------------------------------
-- Server version	8.0.42

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `lab_request_tests`
--

DROP TABLE IF EXISTS `lab_request_tests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lab_request_tests` (
  `id` int NOT NULL AUTO_INCREMENT,
  `request_id` int NOT NULL,
  `test_id` int NOT NULL,
  `payment_status` enum('unpaid','paid','pending') COLLATE utf8mb4_unicode_ci DEFAULT 'unpaid',
  PRIMARY KEY (`id`),
  KEY `request_id` (`request_id`),
  KEY `test_id` (`test_id`),
  CONSTRAINT `lab_request_tests_ibfk_1` FOREIGN KEY (`request_id`) REFERENCES `lab_request` (`request_id`) ON DELETE CASCADE,
  CONSTRAINT `lab_request_tests_ibfk_2` FOREIGN KEY (`test_id`) REFERENCES `available_lab_tests` (`test_id`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lab_request_tests`
--

LOCK TABLES `lab_request_tests` WRITE;
/*!40000 ALTER TABLE `lab_request_tests` DISABLE KEYS */;
INSERT INTO `lab_request_tests` VALUES (6,6,3,'paid'),(7,6,1,'paid'),(8,6,5,'paid'),(9,6,7,'paid'),(10,6,23,'paid'),(11,6,25,'paid'),(12,6,34,'paid'),(13,7,3,'paid'),(14,7,1,'paid'),(15,7,5,'paid'),(16,8,1,'unpaid'),(17,8,3,'unpaid'),(18,9,1,'paid'),(19,9,3,'paid'),(20,9,5,'paid'),(21,10,1,'unpaid'),(22,10,2,'unpaid'),(23,11,1,'unpaid'),(24,11,2,'unpaid'),(25,11,4,'unpaid'),(26,11,3,'unpaid'),(27,12,1,'unpaid'),(28,12,8,'unpaid'),(29,12,16,'unpaid'),(30,12,27,'unpaid'),(31,12,29,'unpaid'),(32,12,35,'unpaid'),(33,13,1,'paid'),(34,13,7,'paid'),(35,14,3,'unpaid'),(36,14,1,'unpaid'),(37,14,2,'unpaid'),(38,14,13,'unpaid'),(39,14,14,'unpaid'),(40,15,1,'paid'),(41,15,4,'paid'),(42,15,5,'paid'),(43,15,13,'paid'),(44,15,15,'paid');
/*!40000 ALTER TABLE `lab_request_tests` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-01-03 11:09:08
-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: ferenje_clinic_hcms
-- ------------------------------------------------------
-- Server version	8.0.42

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `lab_request`
--

DROP TABLE IF EXISTS `lab_request`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lab_request` (
  `request_id` int NOT NULL AUTO_INCREMENT,
  `VisitRecordID` int NOT NULL,
  `doctor_id` int DEFAULT NULL,
  `LabStatus` enum('pending','completed') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `RequestDate` datetime NOT NULL,
  `ReportDate` datetime DEFAULT NULL,
  PRIMARY KEY (`request_id`),
  KEY `VisitRecordID` (`VisitRecordID`),
  KEY `doctor_id` (`doctor_id`),
  CONSTRAINT `lab_request_ibfk_1` FOREIGN KEY (`VisitRecordID`) REFERENCES `patientvisitrecord` (`VisitRecordID`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `lab_request_ibfk_2` FOREIGN KEY (`doctor_id`) REFERENCES `doctor` (`doctor_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lab_request`
--

LOCK TABLES `lab_request` WRITE;
/*!40000 ALTER TABLE `lab_request` DISABLE KEYS */;
INSERT INTO `lab_request` VALUES (1,2,2,'completed','2025-01-05 07:00:00',NULL),(2,7,2,'pending','2025-12-15 16:33:57',NULL),(4,9,2,'completed','2025-12-16 02:55:18',NULL),(6,11,2,'completed','2025-12-20 01:39:55',NULL),(7,12,9,'completed','2025-12-19 23:17:19',NULL),(8,13,9,'completed','2025-12-20 05:46:10',NULL),(9,16,9,'completed','2025-12-21 04:39:15',NULL),(10,18,9,'pending','2025-12-22 09:13:00',NULL),(11,19,9,'pending','2025-12-22 09:16:03',NULL),(12,21,9,'pending','2025-12-22 10:25:52',NULL),(13,22,9,'completed','2025-12-22 07:33:16',NULL),(14,23,9,'pending','2025-12-28 09:40:14',NULL),(15,24,9,'completed','2025-12-28 06:48:32',NULL);
/*!40000 ALTER TABLE `lab_request` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-01-03 11:09:07
-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: ferenje_clinic_hcms
-- ------------------------------------------------------
-- Server version	8.0.42

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `labtestresult`
--

DROP TABLE IF EXISTS `labtestresult`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `labtestresult` (
  `result_id` int NOT NULL AUTO_INCREMENT,
  `request_id` int NOT NULL,
  `test_id` int NOT NULL,
  `test_result_value` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `interpretation` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`result_id`),
  KEY `request_id` (`request_id`),
  KEY `labtestresult_ibfk_2` (`test_id`),
  CONSTRAINT `labtestresult_ibfk_1` FOREIGN KEY (`request_id`) REFERENCES `lab_request` (`request_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `labtestresult_ibfk_2` FOREIGN KEY (`test_id`) REFERENCES `available_lab_tests` (`test_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `labtestresult`
--

LOCK TABLES `labtestresult` WRITE;
/*!40000 ALTER TABLE `labtestresult` DISABLE KEYS */;
INSERT INTO `labtestresult` VALUES (5,6,1,'12',NULL),(6,6,23,'Rt',NULL),(7,6,5,'12',NULL),(8,6,3,'12',NULL),(9,6,34,'ds',NULL),(10,6,7,'12',NULL),(11,6,25,'dd',NULL),(12,7,3,'12',NULL),(13,7,5,'12',NULL),(14,7,1,'aa',NULL),(15,8,3,'12',NULL),(16,8,1,'12',NULL),(17,9,1,'abc',NULL),(18,9,3,'12',NULL),(19,9,5,'12',NULL),(20,15,1,'ss',NULL),(21,15,4,'ds',NULL),(22,15,15,'ds',NULL),(23,15,5,'ds',NULL),(24,15,13,'ds',NULL),(25,13,1,'1.2',NULL),(26,13,7,'33',NULL);
/*!40000 ALTER TABLE `labtestresult` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-01-03 11:09:11
-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: ferenje_clinic_hcms
-- ------------------------------------------------------
-- Server version	8.0.42

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `medication`
--

DROP TABLE IF EXISTS `medication`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `medication` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `VisitRecordID` int DEFAULT NULL,
  `doctor_id` int DEFAULT NULL,
  `OrderedMedication` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `MedStatus` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `MedDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`Id`),
  KEY `VisitRecordID` (`VisitRecordID`),
  KEY `doctor_id` (`doctor_id`),
  CONSTRAINT `medication_ibfk_1` FOREIGN KEY (`VisitRecordID`) REFERENCES `patientvisitrecord` (`VisitRecordID`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `medication_ibfk_2` FOREIGN KEY (`doctor_id`) REFERENCES `doctor` (`doctor_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `medication`
--

LOCK TABLES `medication` WRITE;
/*!40000 ALTER TABLE `medication` DISABLE KEYS */;
INSERT INTO `medication` VALUES (1,2,2,'Paracetamol 100mg','Prescribed','2025-01-05 06:30:00');
/*!40000 ALTER TABLE `medication` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-01-03 11:09:05
-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: ferenje_clinic_hcms
-- ------------------------------------------------------
-- Server version	8.0.42

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `patient`
--

DROP TABLE IF EXISTS `patient`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `patient` (
  `patient_id` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `FirstName` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Father_Name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `GrandFather_Name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `DateOfBirth` date DEFAULT NULL,
  `Age` int DEFAULT NULL,
  `Sex` enum('Male','Female','Other') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Region` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Wereda` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `HouseNo` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `PhoneNo` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `date_registered` date DEFAULT NULL,
  `doctor_id` int DEFAULT NULL,
  PRIMARY KEY (`patient_id`),
  KEY `idx_patient_doctor_id` (`doctor_id`),
  CONSTRAINT `fk_patient_doctor` FOREIGN KEY (`doctor_id`) REFERENCES `doctor` (`doctor_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `patient`
--

LOCK TABLES `patient` WRITE;
/*!40000 ALTER TABLE `patient` DISABLE KEYS */;
INSERT INTO `patient` VALUES ('1','Jane','Smith','William','1990-05-15',33,'Female','Addis Ababa','Kolfe','123','0912345678','2024-01-15',2),('P176561631111151','New','Patient','Registered','2004-01-01',21,'Male','Addis Ababa','12','120','0990099099','2025-12-13',2),('P1765621949458450','john','william','Registered','2002-01-01',23,'Male','Addis Ababa','12','120','0990099099','2025-12-13',2),('P176620539929258','Abel','Negus','Tewlde','2004-01-01',21,'Male','Addis Ababa','AA','290','0910203040','2025-12-20',9),('P1766217223941365','wube','worlku','anjelo','2002-01-01',23,'Male','Addis Ababa','Kolfe','280','0961942689','2025-12-20',9),('P1766299128394657','Test','','','2002-01-01',23,'Male','','','','0910203040','2025-12-21',9),('P1766399281132427','plp','','','1972-01-01',53,'Male','','','','','2025-12-22',9);
/*!40000 ALTER TABLE `patient` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-01-03 11:09:09
-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: ferenje_clinic_hcms
-- ------------------------------------------------------
-- Server version	8.0.42

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `patientvisitrecord`
--

DROP TABLE IF EXISTS `patientvisitrecord`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `patientvisitrecord` (
  `VisitRecordID` int NOT NULL AUTO_INCREMENT,
  `card_id` int NOT NULL,
  `doctor_id` int DEFAULT NULL,
  `DateOfVisit` date NOT NULL,
  `ChiefComplaint` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `UrgentAttention` tinyint(1) DEFAULT '0',
  `HPI` text COLLATE utf8mb4_unicode_ci,
  `FinalDiagnosis` text COLLATE utf8mb4_unicode_ci,
  `Advice` text COLLATE utf8mb4_unicode_ci,
  `Treatment` text COLLATE utf8mb4_unicode_ci,
  `TimeCreated` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `TimeUpdated` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`VisitRecordID`),
  KEY `card_id` (`card_id`),
  KEY `doctor_id` (`doctor_id`),
  CONSTRAINT `patientvisitrecord_ibfk_1` FOREIGN KEY (`card_id`) REFERENCES `card` (`card_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `patientvisitrecord_ibfk_2` FOREIGN KEY (`doctor_id`) REFERENCES `doctor` (`doctor_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `patientvisitrecord`
--

LOCK TABLES `patientvisitrecord` WRITE;
/*!40000 ALTER TABLE `patientvisitrecord` DISABLE KEYS */;
INSERT INTO `patientvisitrecord` VALUES (2,2,2,'2025-01-04','Headache and fever',0,'Headache for 2 days, associated with fever','Malaria','Drink fluids and rest','Paracetamol 500mg TID','2025-12-12 21:22:53','2025-12-14 17:16:04'),(6,2,2,'2025-12-14','Abc',1,'ABC','ABC','BC','C','2025-12-15 15:57:47','2025-12-15 15:58:40'),(7,2,2,'2025-12-15','abc',1,'aaa',NULL,NULL,NULL,'2025-12-15 16:25:05','2025-12-15 16:25:05'),(9,2,2,'2025-12-16','new',0,'new',NULL,NULL,NULL,'2025-12-16 05:55:13','2025-12-16 05:55:13'),(11,9,2,'2025-12-19','new',0,'new','abc','abc','abc','2025-12-20 04:39:33','2025-12-20 04:43:49'),(12,10,9,'2025-12-19','Test',0,'Test','test','test','test','2025-12-20 08:16:03','2025-12-20 08:25:02'),(13,10,9,'2025-12-20','abc',1,'abc',NULL,NULL,NULL,'2025-12-20 08:41:28','2025-12-20 08:41:28'),(14,10,9,'2025-12-20','aa',0,'aa',NULL,NULL,NULL,'2025-12-20 08:53:34','2025-12-20 08:53:34'),(15,14,9,'2025-12-20','abc',1,'abc','abc','abc',NULL,'2025-12-21 06:41:17','2025-12-21 09:17:26'),(16,14,9,'2025-12-21','a',0,'aa',NULL,NULL,NULL,'2025-12-21 07:38:46','2025-12-21 07:38:46'),(17,14,9,'2025-12-21','aa',0,'aa',NULL,NULL,NULL,'2025-12-21 09:26:12','2025-12-21 09:26:12'),(18,14,9,'2025-12-22','aa',0,'aa',NULL,NULL,NULL,'2025-12-22 09:12:27','2025-12-22 09:12:27'),(19,14,9,'2025-12-22','Follow-up',0,NULL,NULL,NULL,NULL,'2025-12-22 09:15:55','2025-12-22 09:15:55'),(20,14,9,'2025-12-22','Follow-up',0,NULL,NULL,NULL,NULL,'2025-12-22 09:29:25','2025-12-22 09:29:25'),(21,9,9,'2025-12-22','kp',0,NULL,NULL,NULL,NULL,'2025-12-22 10:24:22','2025-12-22 10:24:22'),(22,15,9,'2025-12-22','yipl',0,NULL,NULL,NULL,NULL,'2025-12-22 10:33:09','2025-12-22 10:33:09'),(23,15,9,'2025-12-28','aa',0,'aaa',NULL,NULL,NULL,'2025-12-28 09:40:07','2025-12-28 09:40:07'),(24,10,9,'2025-12-28','aa',0,'aaa',NULL,NULL,NULL,'2025-12-28 09:48:21','2025-12-28 09:48:21'),(25,15,9,'2025-12-28','aa',0,'aa',NULL,NULL,NULL,'2025-12-28 12:20:02','2025-12-28 12:20:02');
/*!40000 ALTER TABLE `patientvisitrecord` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-01-03 11:09:04
-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: ferenje_clinic_hcms
-- ------------------------------------------------------
-- Server version	8.0.42

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `payment`
--

DROP TABLE IF EXISTS `payment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payment` (
  `payment_id` int NOT NULL AUTO_INCREMENT,
  `card_id` int DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL,
  `billing_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `description` text COLLATE utf8mb4_unicode_ci,
  `payment_type` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('pending','paid','cancelled') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  PRIMARY KEY (`payment_id`),
  KEY `card_id` (`card_id`),
  CONSTRAINT `payment_ibfk_1` FOREIGN KEY (`card_id`) REFERENCES `card` (`card_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment`
--

LOCK TABLES `payment` WRITE;
/*!40000 ALTER TABLE `payment` DISABLE KEYS */;
INSERT INTO `payment` VALUES (4,6,100.00,'2025-12-13 09:01:13','Card Renewal Fee','Card Renewal','paid'),(5,6,100.00,'2025-12-13 09:34:14','Card Renewal Fee','Card Renewal','paid'),(6,7,100.00,'2025-12-13 10:33:21','New patient registration and card fee','Card Registration','paid'),(7,2,250.00,'2025-12-13 10:57:10','Lab Request #1 Payment','Lab Test','paid'),(8,2,250.00,'2025-12-13 11:41:36','Lab Request #1 Payment','Lab Test','paid'),(9,2,250.00,'2025-12-16 10:02:49','Lab Request #2 Payment','Lab Test','paid'),(16,2,250.00,'2025-12-20 03:57:41','Lab Request #4 Payment','Lab Test','paid'),(17,9,100.00,'2025-12-20 04:37:19','New patient registration and card fee','Card Registration','paid'),(18,9,100.00,'2025-12-20 04:38:12','Card Renewal Fee','Card Renewal','paid'),(19,9,840.00,'2025-12-20 04:40:46','Lab Request #6 Payment','Lab Test','paid'),(20,10,100.00,'2025-12-20 07:55:51','New patient registration and card fee','Card Registration','paid'),(21,10,100.00,'2025-12-20 07:58:12','Card Renewal Fee','Card Renewal','paid'),(22,10,360.00,'2025-12-20 08:19:29','Lab Request #7 Payment','Lab Test','paid'),(27,14,100.00,'2025-12-21 06:39:30','New patient registration and card fee','Card Registration','paid'),(28,14,360.00,'2025-12-21 07:40:03','Lab Request #9 Payment','Lab Test','paid'),(29,14,100.00,'2025-12-21 09:22:53','Card Renewal Fee','Card Renewal','paid'),(30,15,100.00,'2025-12-22 10:32:06','New patient registration and card fee','Card Registration','paid'),(31,10,600.00,'2025-12-28 09:49:11','Lab Request #15 Payment','Lab Test','paid'),(32,15,240.00,'2025-12-28 12:08:13','Lab Request #13 Payment','Lab Test','paid');
/*!40000 ALTER TABLE `payment` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-01-03 11:09:02
-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: ferenje_clinic_hcms
-- ------------------------------------------------------
-- Server version	8.0.42

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `person`
--

DROP TABLE IF EXISTS `person`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `person` (
  `person_id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `address` text COLLATE utf8mb4_unicode_ci,
  `phone_number` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `department_id` int DEFAULT NULL,
  `role` enum('admin','doctor','receptionist','lab_doctor') COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`person_id`),
  UNIQUE KEY `email` (`email`),
  KEY `department_id` (`department_id`),
  CONSTRAINT `person_ibfk_1` FOREIGN KEY (`department_id`) REFERENCES `department` (`department_id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `person`
--

LOCK TABLES `person` WRITE;
/*!40000 ALTER TABLE `person` DISABLE KEYS */;
INSERT INTO `person` VALUES (2,'John','Doe','doctor@clinic.com','doctor123','Addis Ababa','0911234596',2,'doctor'),(3,'Aman','Daniel','receptionist@clinic.com','receptionist123','Addis Ababa','0911234560',3,'receptionist'),(4,'Dave','Daniel','lab@gmail.com','lab123','Addis Ababa','0912122330',4,'lab_doctor'),(5,'Tom','Adam','admin@gmail.com','admin123','Addis Ababa','0990099009',5,'admin'),(9,'Daniel','B/silassie','daniel@gmail.com','123','Addis Ababa','0972804020',2,'doctor');
/*!40000 ALTER TABLE `person` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-01-03 11:09:03
-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: ferenje_clinic_hcms
-- ------------------------------------------------------
-- Server version	8.0.42

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `queue`
--

DROP TABLE IF EXISTS `queue`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `queue` (
  `queue_id` int NOT NULL AUTO_INCREMENT,
  `card_id` int DEFAULT NULL,
  `doctor_id` int DEFAULT NULL,
  `status` enum('waiting','in_consultation','completed') COLLATE utf8mb4_unicode_ci DEFAULT 'waiting',
  `queue_position` int DEFAULT NULL,
  `date` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`queue_id`),
  KEY `card_id` (`card_id`),
  KEY `doctor_id` (`doctor_id`),
  CONSTRAINT `queue_ibfk_1` FOREIGN KEY (`card_id`) REFERENCES `card` (`card_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `queue_ibfk_2` FOREIGN KEY (`doctor_id`) REFERENCES `doctor` (`doctor_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `queue`
--

LOCK TABLES `queue` WRITE;
/*!40000 ALTER TABLE `queue` DISABLE KEYS */;
INSERT INTO `queue` VALUES (1,2,2,'waiting',1,'2025-01-05 10:00:00'),(2,6,2,'waiting',2,'2025-12-13 12:02:50'),(4,9,2,'waiting',3,'2025-12-20 07:38:33'),(5,10,9,'waiting',1,'2025-12-20 11:19:54'),(6,2,9,'waiting',2,'2025-12-20 11:20:09'),(10,14,9,'waiting',3,'2025-12-21 09:40:13');
/*!40000 ALTER TABLE `queue` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-01-03 11:09:09
-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: ferenje_clinic_hcms
-- ------------------------------------------------------
-- Server version	8.0.42

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `visitphysicalexam`
--

DROP TABLE IF EXISTS `visitphysicalexam`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `visitphysicalexam` (
  `ExamID` int NOT NULL AUTO_INCREMENT,
  `VisitRecordID` int NOT NULL,
  `GeneralAppearance` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `HEENT_Findings` text COLLATE utf8mb4_unicode_ci,
  `Chest_Findings` text COLLATE utf8mb4_unicode_ci,
  `Abdomen_Findings` text COLLATE utf8mb4_unicode_ci,
  `CVS_Findings` text COLLATE utf8mb4_unicode_ci,
  `CNS_Findings` text COLLATE utf8mb4_unicode_ci,
  `MSS_Findings` text COLLATE utf8mb4_unicode_ci,
  `Integumentary` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`ExamID`),
  KEY `VisitRecordID` (`VisitRecordID`),
  CONSTRAINT `visitphysicalexam_ibfk_1` FOREIGN KEY (`VisitRecordID`) REFERENCES `patientvisitrecord` (`VisitRecordID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `visitphysicalexam`
--

LOCK TABLES `visitphysicalexam` WRITE;
/*!40000 ALTER TABLE `visitphysicalexam` DISABLE KEYS */;
INSERT INTO `visitphysicalexam` VALUES (2,2,'Alert and conscious','Normal','Clear air entry','Soft','Normal heart sounds','Oriented','Normal movement',NULL),(5,6,'abc','abc','abc','abc','abc','abc','abc',NULL),(6,7,'abc','abc','abc','abc','abc','abc','abc',NULL),(8,9,'new','new','new','new','new','new','new',NULL),(10,11,'new','new','new','new','new','new','new',NULL),(11,12,'Ab','a','a','a','a','a','a',NULL),(12,13,'aa','aa','aa','aa','aa','aa','aa',NULL),(13,14,'a','a','a','a','a','a','a',NULL),(14,15,'abc',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(15,16,'ae',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(16,17,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(17,18,'as',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(18,19,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(19,20,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(20,21,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(21,22,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(22,23,'ss',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(23,24,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(24,25,'aa',NULL,NULL,NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `visitphysicalexam` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-01-03 11:09:05
-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: ferenje_clinic_hcms
-- ------------------------------------------------------
-- Server version	8.0.42

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `visitvitalsigns`
--

DROP TABLE IF EXISTS `visitvitalsigns`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `visitvitalsigns` (
  `VitalsID` int NOT NULL AUTO_INCREMENT,
  `VisitRecordID` int NOT NULL,
  `SystolicBP` int DEFAULT NULL,
  `DiastolicBP` int DEFAULT NULL,
  `PulseRate` int DEFAULT NULL,
  `RespiratoryRate` int DEFAULT NULL,
  `TemperatureC` decimal(4,2) DEFAULT NULL,
  `SPO2` decimal(4,2) DEFAULT NULL,
  `WeightKg` decimal(5,2) DEFAULT NULL,
  PRIMARY KEY (`VitalsID`),
  KEY `VisitRecordID` (`VisitRecordID`),
  CONSTRAINT `visitvitalsigns_ibfk_1` FOREIGN KEY (`VisitRecordID`) REFERENCES `patientvisitrecord` (`VisitRecordID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `visitvitalsigns`
--

LOCK TABLES `visitvitalsigns` WRITE;
/*!40000 ALTER TABLE `visitvitalsigns` DISABLE KEYS */;
INSERT INTO `visitvitalsigns` VALUES (1,2,120,80,79,18,37.50,97.00,60.50),(5,6,12,12,12,9,12.00,12.00,12.00),(6,7,12,12,12,12,12.00,12.00,11.70),(8,9,12,12,9,12,12.00,12.00,11.70),(10,11,12,12,12,12,12.00,12.00,12.00),(11,12,12,12,12,12,12.00,12.00,12.00),(12,13,12,12,11,11,11.00,9.00,-0.30),(13,14,12,12,12,12,12.00,12.00,12.00),(14,15,12,NULL,NULL,NULL,NULL,NULL,NULL),(15,16,9,NULL,NULL,NULL,NULL,NULL,NULL),(16,17,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(17,18,12,NULL,NULL,NULL,NULL,NULL,NULL),(18,19,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(19,20,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(20,21,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(21,22,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(22,23,NULL,11,NULL,NULL,NULL,NULL,NULL),(23,24,12,11,NULL,NULL,NULL,NULL,NULL),(24,25,12,NULL,NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `visitvitalsigns` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-01-03 11:09:01
-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: localhost    Database: ferenje_clinic_hcms2
-- ------------------------------------------------------
-- Server version	9.4.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `patient_report_submissions`
--

DROP TABLE IF EXISTS `patient_report_submissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `patient_report_submissions` (
  `submission_id` int NOT NULL AUTO_INCREMENT,
  `patient_id` int COLLATE utf8mb4_unicode_ci  NOT NULL,
  `doctor_id` int NOT NULL,
  `indicator_code` varchar(50) NOT NULL,
  `submission_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `patient_age` int DEFAULT NULL,
  `patient_gender` varchar(10) DEFAULT NULL,
  `visit_id` int DEFAULT NULL,
  PRIMARY KEY (`submission_id`),
  KEY `patient_id` (`patient_id`),
  KEY `doctor_id` (`doctor_id`),
  KEY `indicator_code` (`indicator_code`),
  CONSTRAINT `patient_report_submissions_ibfk_1` FOREIGN KEY (`patient_id`) REFERENCES `patient` (`patient_id`) ON DELETE CASCADE,
  CONSTRAINT `patient_report_submissions_ibfk_2` FOREIGN KEY (`doctor_id`) REFERENCES `doctor` (`doctor_id`),
  CONSTRAINT `patient_report_submissions_ibfk_3` FOREIGN KEY (`indicator_code`) REFERENCES `report_indicators` (`indicator_code`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=99 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `patient_report_submissions`
--

LOCK TABLES `patient_report_submissions` WRITE;
/*!40000 ALTER TABLE `patient_report_submissions` DISABLE KEYS */;
INSERT INTO `patient_report_submissions` VALUES (1,1,1,'AVAIL.1.6.','2025-12-30 16:03:02',25,'Male',NULL),(2,1,1,'MAT_CS','2025-12-30 16:06:59',29,'Male',NULL),(3,1,1,'MAT_ANC1','2025-12-30 16:08:03',29,'Male',NULL),(4,1,1,'MAT_ANC1_GA.1.2','2025-12-30 16:19:34',29,'Male',NULL),(5,1,1,'MAT_ANC1_GA.1.1','2025-12-30 16:21:11',29,'Male',NULL),(6,1,1,'MAT_B&D','2025-12-30 16:21:21',29,'Male',NULL),(7,1,1,'DA42','2025-12-30 16:37:21',35,'Female',NULL),(8,1,1,'MAT_ANC1','2025-12-30 16:38:18',29,'Male',NULL),(9,1,1,'MAT_ANC1_GA','2025-12-30 16:38:20',29,'Male',NULL),(10,1,1,'DA42','2025-12-30 16:38:25',29,'Male',NULL),(11,1,1,'CA00','2025-12-30 16:38:27',29,'Male',NULL),(12,1,1,'CA42','2025-12-30 16:38:28',29,'Male',NULL),(13,1,1,'MAT_ANC1','2025-12-30 16:39:00',29,'Male',NULL),(14,1,1,'MAT_LAFPR.1.1','2025-12-30 16:39:06',29,'Male',NULL),(15,1,1,'MAT_LAFPR.1.1','2025-12-30 16:39:06',29,'Male',NULL),(16,1,1,'MAT_LAFPR.1.1','2025-12-30 16:39:06',29,'Male',NULL),(17,1,1,'MAT_LAFPR.1.1','2025-12-30 16:39:07',29,'Male',NULL),(18,1,1,'MAT_LAFPR.1.1','2025-12-30 16:39:07',29,'Male',NULL),(19,1,1,'MAT_LAFPR.1.1','2025-12-30 16:39:07',29,'Male',NULL),(20,1,1,'MAT_LAFPR.1.1','2025-12-30 16:39:07',29,'Male',NULL),(21,1,1,'MAT_LAFPR.1.1','2025-12-30 16:39:07',29,'Male',NULL),(22,1,1,'MAT_LAFPR.1.1','2025-12-30 16:39:07',29,'Male',NULL),(23,1,1,'MAT_LAFPR.1.1','2025-12-30 16:39:08',29,'Male',NULL),(24,1,1,'MAT_LAFPR.1.1','2025-12-30 16:39:08',29,'Male',NULL),(25,1,1,'MAT_LAFPR.1.1','2025-12-30 16:39:08',29,'Male',NULL),(26,1,1,'MAT_LAFPR.1.1','2025-12-30 16:39:08',29,'Male',NULL),(27,1,1,'MAT_LAFPR.1.1','2025-12-30 16:39:08',29,'Male',NULL),(28,1,1,'MAT_LAFPR.1.1','2025-12-30 16:39:09',29,'Male',NULL),(29,1,1,'DA42','2025-12-30 16:44:56',29,'Male',NULL),(30,1,1,'DA42','2025-12-30 16:45:03',29,'Male',NULL),(31,1,1,'DA42','2025-12-30 16:45:03',29,'Male',NULL),(32,1,1,'DA42','2025-12-30 16:45:03',29,'Male',NULL),(33,1,1,'DA42','2025-12-30 16:45:03',29,'Male',NULL),(34,1,1,'MAT_ANC1','2025-12-30 16:52:44',29,'Male',NULL),(35,1,1,'MAT_ANC1_GA','2025-12-30 16:52:44',29,'Male',NULL),(36,1,1,'MAT_ANC1_GA.1.1','2025-12-30 16:52:44',29,'Male',NULL),(37,1,1,'DA42','2025-12-30 16:52:44',29,'Male',NULL),(38,1,1,'CA42','2025-12-30 16:52:44',29,'Male',NULL),(39,1,1,'CA00','2025-12-30 16:52:44',29,'Male',NULL),(40,1,1,'CA062','2025-12-30 16:52:44',29,'Male',NULL),(41,1,1,'CA06','2025-12-30 16:52:44',29,'Male',NULL);
/*!40000 ALTER TABLE `patient_report_submissions` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-01-03 11:10:18
-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: localhost    Database: ferenje_clinic_hcms2
-- ------------------------------------------------------
-- Server version	9.4.0
/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;

/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;

/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;

/*!50503 SET NAMES utf8 */;

/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;

/*!40103 SET TIME_ZONE='+00:00' */;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;

/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;

/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;

/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `report_indicators`
--
DROP TABLE IF EXISTS `report_indicators`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
  `report_indicators` (
    `indicator_code` varchar(50) NOT NULL,
    `description` text NOT NULL,
    `category` varchar(100) DEFAULT NULL,
    `page_number` int DEFAULT '1',
    PRIMARY KEY (`indicator_code`)
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `report_indicators`
--
LOCK TABLES `report_indicators` WRITE;

/*!40000 ALTER TABLE `report_indicators` DISABLE KEYS */;

INSERT INTO
  `report_indicators`
VALUES
  (
    'AGN_1',
    'Acute glomerulonephritis',
    'Common Morbidity',
    9
  ),
  (
    'AVAIL.1.6.',
    'ORS + Zinc sulphate',
    'Improve access to pharmaceuticals & medical devices & their rational & proper use',
    8
  ),
  (
    'CA00',
    'Nasopharyngitis (flu)',
    'Common Morbidity',
    9
  ),
  ('CA06', 'Pharyngitis', 'Common Morbidity', 9),
  ('CA062', 'Tonsillitis', 'Common Morbidity', 9),
  ('CA23', 'Bronchial Asthma', 'Common Morbidity', 9),
  ('CA400', 'Pneumonia', 'Common Morbidity', 9),
  ('CA42', 'Acute bronchitis', 'Common Morbidity', 9),
  (
    'CH',
    'Child Health',
    'Reproductive & Maternal Health',
    3
  ),
  (
    'CH_ASPH',
    'Asphyxiated neonates who were resuscitated (with bag & mask) and survived',
    'Reproductive & Maternal Health',
    3
  ),
  (
    'CH_ASPH.1.',
    'Number of neonates resuscitated and survived',
    'Reproductive & Maternal Health',
    3
  ),
  (
    'CH_ASPH.2.',
    'Total number of neonates resuscitated',
    'Reproductive & Maternal Health',
    3
  ),
  (
    'CH_CHDM',
    'Children aged 0 to 59 months Assessed for developmental milestone',
    'Reproductive & Maternal Health',
    4
  ),
  (
    'CH_CHDM.1',
    '0 to 24 months',
    'Reproductive & Maternal Health',
    4
  ),
  (
    'CH_CHDM.2',
    '24 to 59 months',
    'Reproductive & Maternal Health',
    4
  ),
  (
    'CH_CHDMS',
    'Children aged 0 to 59 months Assessed for developmental milestone and there status',
    'Reproductive & Maternal Health',
    4
  ),
  (
    'CH_CHDMS.1',
    'Suspected Developmental Delay',
    'Reproductive & Maternal Health',
    4
  ),
  (
    'CH_CHDMS.2',
    'Developmental Delay',
    'Reproductive & Maternal Health',
    4
  ),
  (
    'CH_CHDMS.3',
    'No Developmental Delay',
    'Reproductive & Maternal Health',
    4
  ),
  (
    'CH_CHX',
    'Newborns that received at least one dose of CHX to the cord on the first day after birth',
    'Reproductive & Maternal Health',
    4
  ),
  (
    'CH_CHX.1.',
    'Number of Newborns that received at least one dose of CHX to the cord on the first day after birth',
    'Reproductive & Maternal Health',
    4
  ),
  (
    'CH_IND.1',
    'Number of neonatal deaths in the first 24 hrs of life',
    'Reproductive & Maternal Health',
    3
  ),
  (
    'CH_IND.2',
    'Number of neonatal deaths between 1 -7 days of life',
    'Reproductive & Maternal Health',
    3
  ),
  (
    'CH_IND.3',
    'Number of neonatal deaths between 7 -28 days of life',
    'Reproductive & Maternal Health',
    3
  ),
  (
    'CH_KMC',
    'Low birth weight or premature newborns for whom KMC was initiated after delivery',
    'Reproductive & Maternal Health',
    3
  ),
  (
    'CH_KMC.1.',
    'Total number of newborns weighing <2000gm and/or premature newborns for which KMC initiated',
    'Reproductive & Maternal Health',
    3
  ),
  (
    'CH_KMC.2.',
    'Total number of newborns weighing <2000gm and/or premature',
    'Reproductive & Maternal Health',
    3
  ),
  (
    'CH_TX_DIAR',
    'Children treated with Zinc and ORS for diarrhea',
    'Reproductive & Maternal Health',
    3
  ),
  (
    'CH_TX_DIAR.1.',
    'Treated by ORS and zinc',
    'Reproductive & Maternal Health',
    3
  ),
  (
    'CH_TX_DIAR.2.',
    'Treated by ORS only',
    'Reproductive & Maternal Health',
    3
  ),
  (
    'CH_TX_NICU',
    'Treatment outcome of neonates admitted to NICU',
    'Reproductive & Maternal Health',
    3
  ),
  (
    'CH_TX_NICU.TO.1.',
    'Transferred',
    'Reproductive & Maternal Health',
    4
  ),
  (
    'CH_TX_NICUA.',
    'Total neonates admitted to NICU',
    'Reproductive & Maternal Health',
    3
  ),
  (
    'CH_TX_NICUD.',
    'Total neonates discharged from NICU',
    'Reproductive & Maternal Health',
    3
  ),
  (
    'CH_TX_PNEU',
    'Under-five children with pneumonia received antibiotic treatment',
    'Reproductive & Maternal Health',
    3
  ),
  (
    'CH_TX_PNEU.1.',
    'Number of under 5 children treated for pneumonia',
    'Reproductive & Maternal Health',
    3
  ),
  (
    'CH_TX_SYI.1',
    'Number of sick young infants 0-2 months treated for Critical Illness',
    'Reproductive & Maternal Health',
    3
  ),
  (
    'CH_TX_SYI.1.1',
    'Treated for Very Severe Diseases',
    'Reproductive & Maternal Health',
    3
  ),
  (
    'CH_TX_SYI.1.2',
    'Treated for Local bacterial infection ( LBI)',
    'Reproductive & Maternal Health',
    3
  ),
  (
    'CH_TX_SYI.1.3',
    'Treated for Pneumonia',
    'Reproductive & Maternal Health',
    3
  ),
  (
    'DA42',
    'Peptic ulcer disease',
    'Common Morbidity',
    9
  ),
  (
    'DIA_D_ND',
    'Diarrhea D no D',
    'Common Morbidity',
    9
  ),
  (
    'DQ_DA.1.1.',
    'LQAS first score for service report',
    'Evidence based decision making',
    9
  ),
  (
    'DQ_DA.1.2.',
    'LQAS last score for service report',
    'Evidence based decision making',
    9
  ),
  (
    'DQ_DA.2.1.',
    'LQAS first score for OPD report',
    'Evidence based decision making',
    9
  ),
  (
    'DQ_DA.2.2.',
    'LQAS last score for OPD report',
    'Evidence based decision making',
    9
  ),
  (
    'DQ_DA.3.1.',
    'LQAS last score for IPD report',
    'Evidence based decision making',
    9
  ),
  (
    'DQ_DA1.',
    'Did the HF conduct LQAS for service report?',
    'Evidence based decision making',
    9
  ),
  (
    'DQ_DA2.',
    'Did the HF conduct LQAS for OPD report?',
    'Evidence based decision making',
    9
  ),
  (
    'DQ_DA3.',
    'Did the HF conduct LQAS for IPD report?',
    'Evidence based decision making',
    9
  ),
  (
    'EBDM',
    'Evidence based decision making',
    'Evidence based decision making',
    9
  ),
  (
    'FAZ0',
    'Rheumatoid Arthritis',
    'Common Morbidity',
    9
  ),
  ('GC07', 'STI', 'Common Morbidity', 9),
  (
    'GC08',
    'Urinary tract infection',
    'Common Morbidity',
    9
  ),
  ('HEAD_1', '1° Headache', 'Common Morbidity', 9),
  ('IA07', 'Typhoid', 'Common Morbidity', 9),
  (
    'IA36',
    'Amoebic dysentery',
    'Common Morbidity',
    9
  ),
  ('IC307', 'Typhus', 'Common Morbidity', 9),
  ('IF40', 'Malaria (P.f)', 'Common Morbidity', 9),
  ('IF41', 'Malaria (P.v)', 'Common Morbidity', 9),
  ('IF97', 'Helminthiasis', 'Common Morbidity', 9),
  (
    'JBDR.1.',
    'Total units of blood received from NBTS & regional blood banks',
    'Malaria Prevention and Control',
    8
  ),
  (
    'JS_IPD_BOR.2',
    'Total number of beds in the reporting period',
    'Malaria Prevention and Control',
    7
  ),
  (
    'L&D_SBA.1.',
    'Number of births attended by skilled health personnel',
    'Reproductive & Maternal Health',
    2
  ),
  (
    'LG',
    'Strengthen Governance and Leadership',
    'Evidence based decision making',
    9
  ),
  (
    'LG_GBV',
    'Number of Gender based violence (GBV) survivors (Physical and sexual) who received health care services',
    'Evidence based decision making',
    9
  ),
  (
    'LG_GBV.1',
    'Physical, < 18 years, Male',
    'Evidence based decision making',
    9
  ),
  (
    'LG_GBV.10',
    'Psychological, < 18 years, Female',
    'Evidence based decision making',
    9
  ),
  (
    'LG_GBV.11',
    'Psychological, >= 18 years, Male',
    'Evidence based decision making',
    9
  ),
  (
    'LG_GBV.12',
    'Psychological, >= 18 years, Female',
    'Evidence based decision making',
    9
  ),
  (
    'LG_GBV.13',
    'Mixed, < 18 years, Male',
    'Evidence based decision making',
    9
  ),
  (
    'LG_GBV.14',
    'Mixed, < 18 years, Female',
    'Evidence based decision making',
    9
  ),
  (
    'LG_GBV.15',
    'Mixed, >= 18 years, Male',
    'Evidence based decision making',
    9
  ),
  (
    'LG_GBV.16',
    'Mixed, >= 18 years, Female',
    'Evidence based decision making',
    9
  ),
  (
    'LG_GBV.2',
    'Physical, < 18 years, Female',
    'Evidence based decision making',
    9
  ),
  (
    'LG_GBV.3',
    'Physical, >= 18 years, Male',
    'Evidence based decision making',
    9
  ),
  (
    'LG_GBV.4',
    'Physical, >= 18 years, Female',
    'Evidence based decision making',
    9
  ),
  (
    'LG_GBV.5',
    'Sexual violence, < 18 years, Male',
    'Evidence based decision making',
    9
  ),
  (
    'LG_GBV.6',
    'Sexual violence, < 18 years, Female',
    'Evidence based decision making',
    9
  ),
  (
    'LG_GBV.7',
    'Sexual violence, >= 18 years, Male',
    'Evidence based decision making',
    9
  ),
  (
    'LG_GBV.8',
    'Sexual violence, >= 18 years, Female',
    'Evidence based decision making',
    9
  ),
  (
    'LG_GBV.9',
    'Psychological, < 18 years, Male',
    'Evidence based decision making',
    9
  ),
  (
    'MAL',
    'Malaria Prevention and Control',
    'Malaria Prevention and Control',
    4
  ),
  (
    'MAL_DX.1',
    'Total number of slides or RDT performed for malaria diagnosis',
    'Malaria Prevention and Control',
    4
  ),
  (
    'MAL_DX.1.1',
    '< 5 years, Male',
    'Malaria Prevention and Control',
    4
  ),
  (
    'MAL_DX.1.2',
    '< 5 years, Female',
    'Malaria Prevention and Control',
    4
  ),
  (
    'MAL_DX.1.3',
    '5 - 14 years, Male',
    'Malaria Prevention and Control',
    4
  ),
  (
    'MAL_DX.1.4',
    '5 - 14 years, Female',
    'Malaria Prevention and Control',
    4
  ),
  (
    'MAL_DX.1.5',
    '>= 15 years, Male',
    'Malaria Prevention and Control',
    4
  ),
  (
    'MAL_DX.1.6',
    '>= 15 years, Female',
    'Malaria Prevention and Control',
    4
  ),
  (
    'MAL_FOCI.1.',
    'Number of foci investigated and classified (Elimination Districts)',
    'Malaria Prevention and Control',
    4
  ),
  (
    'MAL_FULL.1.',
    'Number of index cases investigated and classified (Elimination Districts)',
    'Malaria Prevention and Control',
    4
  ),
  (
    'MAL_FULL.2.',
    'Number of secondary cases during investigation (Elimination Districts)',
    'Malaria Prevention and Control',
    4
  ),
  (
    'MAL_Noti.',
    'Case notified to PHCU for further investigation (Elimination Districts)',
    'Malaria Prevention and Control',
    4
  ),
  (
    'MAL_POS.1',
    'Total number of slides or RDT Positive',
    'Malaria Prevention and Control',
    4
  ),
  (
    'MAL_POS.1.1',
    '< 5 years, Male',
    'Malaria Prevention and Control',
    4
  ),
  (
    'MAL_POS.1.2',
    '< 5 years, Female',
    'Malaria Prevention and Control',
    4
  ),
  (
    'MAL_POS.1.3',
    '5 - 14 years, Male',
    'Malaria Prevention and Control',
    4
  ),
  (
    'MAL_POS.1.4',
    '5 - 14 years, Female',
    'Malaria Prevention and Control',
    4
  ),
  (
    'MAL_POS.1.5',
    '>= 15 years, Male',
    'Malaria Prevention and Control',
    4
  ),
  (
    'MAL_POS.1.6',
    '>= 15 years, Female',
    'Malaria Prevention and Control',
    4
  ),
  (
    'MAL_Travel.',
    'Malaria with Travel History',
    'Malaria Prevention and Control',
    4
  ),
  (
    'MAT_ANC1',
    'Antenatal care (ANC) coverage – First Contact',
    'Reproductive & Maternal Health',
    1
  ),
  (
    'MAT_ANC1_GA',
    'Total number of pregnant women that received antenatal care – First contact by gestational Age',
    'Reproductive & Maternal Health',
    1
  ),
  (
    'MAT_ANC1_GA.1.1',
    '≤ 12 weeks',
    'Reproductive & Maternal Health',
    1
  ),
  (
    'MAT_ANC1_GA.1.2',
    '>12 and ≤16 weeks',
    'Reproductive & Maternal Health',
    1
  ),
  (
    'MAT_ANC1_GA.1.3',
    '>16 weeks',
    'Reproductive & Maternal Health',
    1
  ),
  (
    'MAT_ANC1_MA.1',
    'Number of pregnant women that received antenatal care - First contact by maternal age',
    'Reproductive & Maternal Health',
    2
  ),
  (
    'MAT_ANC4+',
    'Antenatal care (ANC) coverage - four contacts',
    'Reproductive & Maternal Health',
    2
  ),
  (
    'MAT_ANC4+_GA.1',
    'Total number of pregnant women that received four or more antenatal care contacts by gestational age',
    'Reproductive & Maternal Health',
    2
  ),
  (
    'MAT_ANC4+_GA.1.1',
    '< 30 weeks',
    'Reproductive & Maternal Health',
    2
  ),
  (
    'MAT_ANC4+_GA.1.2',
    '>= 30 weeks',
    'Reproductive & Maternal Health',
    2
  ),
  (
    'MAT_ANC4+_MA.1',
    'Total number of pregnant women that received four or more antenatal care contacts by Maternal Age',
    'Reproductive & Maternal Health',
    2
  ),
  (
    'MAT_ANC4+_MA.1.1',
    '10 - 14 years',
    'Reproductive & Maternal Health',
    2
  ),
  (
    'MAT_ANC4+_MA.1.2',
    '15 - 19 years',
    'Reproductive & Maternal Health',
    2
  ),
  (
    'MAT_ANC4+_MA.1.3',
    '>= 20 years',
    'Reproductive & Maternal Health',
    2
  ),
  (
    'MAT_ANC4+_MA.1.4',
    '>= 20 Years',
    'Reproductive & Maternal Health',
    2
  ),
  (
    'MAT_ANC8+',
    'Antenatal Care (ANC) coverage - Eight or more contact',
    'Reproductive & Maternal Health',
    2
  ),
  (
    'MAT_B&D',
    'Birth and Death Notification',
    'Reproductive & Maternal Health',
    2
  ),
  (
    'MAT_B&D_IBN.1.',
    'Number of Institutional birth notifications given',
    'Reproductive & Maternal Health',
    2
  ),
  (
    'MAT_B&D_IDN.2.',
    'Number of Institutional death notifications given',
    'Reproductive & Maternal Health',
    2
  ),
  (
    'MAT_CAC',
    'Number of women receiving comprehensive abortion care services dis aggregated by maternal age',
    'Reproductive & Maternal Health',
    2
  ),
  (
    'MAT_CAC_PAC',
    'Number of post abortion/emergency care',
    'Reproductive & Maternal Health',
    3
  ),
  (
    'MAT_CAC_PAC.1',
    '10 - 14 years',
    'Reproductive & Maternal Health',
    3
  ),
  (
    'MAT_CAC_PAC.2',
    '15 - 19 years',
    'Reproductive & Maternal Health',
    3
  ),
  (
    'MAT_CAC_PAC.3',
    '20 - 24 years',
    'Reproductive & Maternal Health',
    3
  ),
  (
    'MAT_CAC_PAC.4',
    '25 - 29 years',
    'Reproductive & Maternal Health',
    3
  ),
  (
    'MAT_CAC_PAC.5',
    '>= 30 years',
    'Reproductive & Maternal Health',
    3
  ),
  (
    'MAT_CAC_SAC',
    'Number of safe abortions performed',
    'Reproductive & Maternal Health',
    3
  ),
  (
    'MAT_CAC_SAC.1',
    '10 - 14 years',
    'Reproductive & Maternal Health',
    3
  ),
  (
    'MAT_CAC_SAC.2',
    '15 - 19 years',
    'Reproductive & Maternal Health',
    3
  ),
  (
    'MAT_CAC_SAC.3',
    '20 - 24 years',
    'Reproductive & Maternal Health',
    3
  ),
  (
    'MAT_CAC_SAC.4',
    '25 - 29 years',
    'Reproductive & Maternal Health',
    3
  ),
  (
    'MAT_CAC_SAC.5',
    '>= 30 years',
    'Reproductive & Maternal Health',
    3
  ),
  (
    'MAT_CAC.MA.1',
    'Number of women receiving post abortion care family planning methods disaggregated by Methods',
    'Reproductive & Maternal Health',
    3
  ),
  (
    'MAT_CAC.MA.1.1',
    'Oral contraceptives',
    'Reproductive & Maternal Health',
    3
  ),
  (
    'MAT_CAC.MA.1.2',
    'Injectables',
    'Reproductive & Maternal Health',
    3
  ),
  (
    'MAT_CAC.MA.1.3',
    'Implants',
    'Reproductive & Maternal Health',
    3
  ),
  (
    'MAT_CAC.MA.1.4',
    'IUCD',
    'Reproductive & Maternal Health',
    3
  ),
  (
    'MAT_CAC.MA.1.5',
    'Vasectomy',
    'Reproductive & Maternal Health',
    3
  ),
  (
    'MAT_CAC.MA.1.6',
    'Tubal ligation',
    'Reproductive & Maternal Health',
    3
  ),
  (
    'MAT_CAC.MA.1.7',
    'Others',
    'Reproductive & Maternal Health',
    3
  ),
  (
    'MAT_CAC.MA.1.8',
    'Other contraceptive methods',
    'Reproductive & Maternal Health',
    3
  ),
  (
    'MAT_CAC.Tr.1',
    'Number of women receiving comprehensive abortion care disaggregated by trimester',
    'Reproductive & Maternal Health',
    3
  ),
  (
    'MAT_CAC.Tr.1.1',
    '1st trimester (<12 weeks)',
    'Reproductive & Maternal Health',
    3
  ),
  (
    'MAT_CAC.Tr.1.2',
    '2nd trimester (>=12 - 28 weeks)',
    'Reproductive & Maternal Health',
    3
  ),
  (
    'MAT_CAR',
    'Contraceptive acceptance rate (CAR)',
    'Reproductive & Maternal Health',
    1
  ),
  (
    'MAT_CAR_1',
    'Total number of new and repeat acceptors by age',
    'Reproductive & Maternal Health',
    1
  ),
  (
    'MAT_CAR_Age.1',
    'Contraceptive new acceptors by age',
    'Reproductive & Maternal Health',
    1
  ),
  (
    'MAT_CAR_Age.1.1',
    '10–14 years',
    'Reproductive & Maternal Health',
    1
  ),
  (
    'MAT_CAR_Age.1.2',
    '15–19 years',
    'Reproductive & Maternal Health',
    1
  ),
  (
    'MAT_CAR_Age.1.3',
    '20–24 years',
    'Reproductive & Maternal Health',
    1
  ),
  (
    'MAT_CAR_Age.1.4',
    '25–29 years',
    'Reproductive & Maternal Health',
    1
  ),
  (
    'MAT_CAR_Age.1.5',
    '30–49 years',
    'Reproductive & Maternal Health',
    1
  ),
  (
    'MAT_CAR_Age.2',
    'Contraceptive repeat acceptors by age',
    'Reproductive & Maternal Health',
    1
  ),
  (
    'MAT_CAR_Age.2.1',
    '10–14 years',
    'Reproductive & Maternal Health',
    1
  ),
  (
    'MAT_CAR_Age.2.2',
    '15–19 years',
    'Reproductive & Maternal Health',
    1
  ),
  (
    'MAT_CAR_Age.2.3',
    '20–24 years',
    'Reproductive & Maternal Health',
    1
  ),
  (
    'MAT_CAR_Age.2.4',
    '25–29 years',
    'Reproductive & Maternal Health',
    1
  ),
  (
    'MAT_CAR_Age.2.5',
    '30–49 years',
    'Reproductive & Maternal Health',
    1
  ),
  (
    'MAT_CAR_Mtd',
    'Total new and repeat acceptors, disaggregated by method',
    'Reproductive & Maternal Health',
    1
  ),
  (
    'MAT_CAR_Mtd.1',
    'Contraceptive new acceptors by method',
    'Reproductive & Maternal Health',
    1
  ),
  (
    'MAT_CAR_Mtd.1.1',
    'Oral contraceptives',
    'Reproductive & Maternal Health',
    1
  ),
  (
    'MAT_CAR_Mtd.1.2',
    'Injectables',
    'Reproductive & Maternal Health',
    1
  ),
  (
    'MAT_CAR_Mtd.1.3',
    'Implants',
    'Reproductive & Maternal Health',
    1
  ),
  (
    'MAT_CAR_Mtd.1.4',
    'IUCD',
    'Reproductive & Maternal Health',
    1
  ),
  (
    'MAT_CAR_Mtd.1.5',
    'Vasectomy',
    'Reproductive & Maternal Health',
    1
  ),
  (
    'MAT_CAR_Mtd.1.6',
    'Tubal ligation',
    'Reproductive & Maternal Health',
    1
  ),
  (
    'MAT_CAR_Mtd.1.7',
    'Others',
    'Reproductive & Maternal Health',
    1
  ),
  (
    'MAT_CAR_Mtd.1.8',
    'Other contraceptive methods',
    'Reproductive & Maternal Health',
    1
  ),
  (
    'MAT_CAR_Mtd.2',
    'Contraceptive repeat acceptors by method',
    'Reproductive & Maternal Health',
    1
  ),
  (
    'MAT_CAR_Mtd.2.1',
    'Oral contraceptives',
    'Reproductive & Maternal Health',
    1
  ),
  (
    'MAT_CAR_Mtd.2.2',
    'Injectables',
    'Reproductive & Maternal Health',
    1
  ),
  (
    'MAT_CAR_Mtd.2.3',
    'Implants',
    'Reproductive & Maternal Health',
    1
  ),
  (
    'MAT_CAR_Mtd.2.4',
    'IUCD',
    'Reproductive & Maternal Health',
    1
  ),
  (
    'MAT_CAR_Mtd.2.5',
    'Vasectomy',
    'Reproductive & Maternal Health',
    1
  ),
  (
    'MAT_CAR_Mtd.2.6',
    'Tubal ligation',
    'Reproductive & Maternal Health',
    1
  ),
  (
    'MAT_CAR_Mtd.2.7',
    'Others',
    'Reproductive & Maternal Health',
    1
  ),
  (
    'MAT_CAR_Mtd.2.8',
    'Other contraceptive methods',
    'Reproductive & Maternal Health',
    1
  ),
  (
    'MAT_CS',
    'Caesarean section (C/S) rate',
    'Reproductive & Maternal Health',
    2
  ),
  (
    'MAT_CS.1.',
    'Number of women having given birth by caesarean section',
    'Reproductive & Maternal Health',
    2
  ),
  (
    'MAT_EPNC',
    'Early Postnatal Care Coverage',
    'Reproductive & Maternal Health',
    2
  ),
  (
    'MAT_EPNC.1',
    'Number of postnatal visits within 7 days of delivery',
    'Reproductive & Maternal Health',
    2
  ),
  (
    'MAT_EPNC.1.1',
    'Number of neonatal deaths in the first 24 hrs of life',
    'Reproductive & Maternal Health',
    2
  ),
  (
    'MAT_EPNC.1.2',
    '25 - 48 hrs (1 - 2 days)',
    'Reproductive & Maternal Health',
    2
  ),
  (
    'MAT_EPNC.1.3',
    '49 - 72 hrs (2 - 3 days)',
    'Reproductive & Maternal Health',
    2
  ),
  (
    'MAT_EPNC.1.4',
    '73 hrs - 7 days (4 - 7 days)',
    'Reproductive & Maternal Health',
    2
  ),
  (
    'MAT_EPNC.1.6',
    '24Hrs (1day)',
    'Reproductive & Maternal Health',
    2
  ),
  (
    'MAT_Hepa',
    'Total Number of Pregnant women attending antenatal care tested for hepatitis B',
    'Reproductive & Maternal Health',
    2
  ),
  (
    'MAT_Hepa.1',
    'Reactive',
    'Reproductive & Maternal Health',
    2
  ),
  (
    'MAT_Hepa.2',
    'Non-Reactive',
    'Reproductive & Maternal Health',
    2
  ),
  (
    'MAT_IMD.1.',
    'Number of maternal deaths in health facility',
    'Reproductive & Maternal Health',
    3
  ),
  (
    'MAT_IPPCAR',
    'Immediate Postpartum Contraceptive Acceptance rate (IPPCAR)',
    'Reproductive & Maternal Health',
    1
  ),
  (
    'MAT_IPPCAR_Age',
    'Total PPFP acceptors, disaggregated by age',
    'Reproductive & Maternal Health',
    1
  ),
  (
    'MAT_IPPCAR_Age.1',
    '10–14 years',
    'Reproductive & Maternal Health',
    1
  ),
  (
    'MAT_IPPCAR_Age.2',
    '15–19 years',
    'Reproductive & Maternal Health',
    1
  ),
  (
    'MAT_IPPCAR_Age.3',
    '20–24 years',
    'Reproductive & Maternal Health',
    1
  ),
  (
    'MAT_IPPCAR_Age.4',
    '25–29 years',
    'Reproductive & Maternal Health',
    1
  ),
  (
    'MAT_IPPCAR_Age.5',
    '30–49 years',
    'Reproductive & Maternal Health',
    1
  ),
  (
    'MAT_IPPCAR_Mtd',
    'Total PPFP acceptors, disaggregated by method',
    'Reproductive & Maternal Health',
    1
  ),
  (
    'MAT_IPPCAR_Mtd.1',
    'Pills (POP)',
    'Reproductive & Maternal Health',
    1
  ),
  (
    'MAT_IPPCAR_Mtd.2',
    'Implants',
    'Reproductive & Maternal Health',
    1
  ),
  (
    'MAT_IPPCAR_Mtd.3',
    'IUCD',
    'Reproductive & Maternal Health',
    1
  ),
  (
    'MAT_IPPCAR_Mtd.4',
    'Tubal ligation',
    'Reproductive & Maternal Health',
    1
  ),
  (
    'MAT_IPPCAR_Mtd.5',
    'Others',
    'Reproductive & Maternal Health',
    1
  ),
  (
    'MAT_LAFPR',
    'Premature Removal of Long term family planning methods (PRLAFP)',
    'Reproductive & Maternal Health',
    1
  ),
  (
    'MAT_LAFPR.1',
    'Total number of premature removal of LAFP within 6 month insertion',
    'Reproductive & Maternal Health',
    1
  ),
  (
    'MAT_LAFPR.1.1',
    'Implants',
    'Reproductive & Maternal Health',
    1
  ),
  (
    'MAT_LAFPR.1.2',
    'IUCD',
    'Reproductive & Maternal Health',
    1
  ),
  (
    'MAT_LAFPR.1.3',
    'Others',
    'Reproductive & Maternal Health',
    1
  ),
  (
    'MAT_OFC_Ide_Age',
    'Number of obstetric fistula cases identified by Age',
    'Reproductive & Maternal Health',
    3
  ),
  (
    'MAT_OFC_Ide_Age.1',
    '10 - 14 years',
    'Reproductive & Maternal Health',
    3
  ),
  (
    'MAT_OFC_Ide_Age.2',
    '15 - 19 years',
    'Reproductive & Maternal Health',
    3
  ),
  (
    'MAT_OFC_Ide_Age.3',
    '20 - 24 years',
    'Reproductive & Maternal Health',
    3
  ),
  (
    'MAT_OFC_Ide_Age.4',
    '25 - 29 years',
    'Reproductive & Maternal Health',
    3
  ),
  (
    'MAT_OFC_Ide_Age.5',
    '>= 30 years',
    'Reproductive & Maternal Health',
    3
  ),
  (
    'MAT_OFC_Treat_Age',
    'Number of obstetric fistula cases treated by Age',
    'Reproductive & Maternal Health',
    3
  ),
  (
    'MAT_OFC_Treat_Age.1',
    '10 - 14 years',
    'Reproductive & Maternal Health',
    3
  ),
  (
    'MAT_OFC_Treat_Age.2',
    '15 - 19 years',
    'Reproductive & Maternal Health',
    3
  ),
  (
    'MAT_OFC_Treat_Age.3',
    '20 - 24 years',
    'Reproductive & Maternal Health',
    3
  ),
  (
    'MAT_OFC_Treat_Age.4',
    '25 - 29 years',
    'Reproductive & Maternal Health',
    3
  ),
  (
    'MAT_OFC_Treat_Age.5',
    '>= 30 years',
    'Reproductive & Maternal Health',
    3
  ),
  (
    'MAT_PPH',
    'Percentage of women who developed Postpartum hemorrhage (PPH)',
    'Reproductive & Maternal Health',
    2
  ),
  (
    'MAT_PPH.1',
    'Total number of women who developed postpartum hemorrhage (PPH)',
    'Reproductive & Maternal Health',
    2
  ),
  (
    'MAT_PPH.1.1',
    'Home delivery',
    'Reproductive & Maternal Health',
    2
  ),
  (
    'MAT_PPH.1.2',
    'Facility delivery',
    'Reproductive & Maternal Health',
    2
  ),
  (
    'MAT_Prp.1.',
    'Total Number of pregnant women who were received prophylaxis for HBV',
    'Reproductive & Maternal Health',
    2
  ),
  (
    'MAT_SBA',
    'Skilled delivery attendance',
    'Reproductive & Maternal Health',
    2
  ),
  (
    'MAT_SBR',
    'Still birth rate',
    'Reproductive & Maternal Health',
    2
  ),
  (
    'MAT_SBR.LB.',
    'Number of Live births',
    'Reproductive & Maternal Health',
    2
  ),
  (
    'MAT_SBR.SB.',
    'Number of still births',
    'Reproductive & Maternal Health',
    2
  ),
  (
    'MAT_SYPH.1',
    'Total Number of pregnant women tested for syphilis',
    'Reproductive & Maternal Health',
    2
  ),
  (
    'MAT_SYPH.1.1',
    'Reactive',
    'Reproductive & Maternal Health',
    2
  ),
  (
    'MAT_SYPH.1.2',
    'Non-Reactive',
    'Reproductive & Maternal Health',
    2
  ),
  (
    'MAT_SYPH.RX.1',
    'Proportion pregnant women tested for syphilis',
    'Reproductive & Maternal Health',
    2
  ),
  (
    'MAT_SYPH.RX.1.',
    'Total Number of pregnant women treated for syphilis',
    'Reproductive & Maternal Health',
    2
  ),
  (
    'MAT_TLAFPR',
    'Total LAFP removal in the reporting period',
    'Reproductive & Maternal Health',
    1
  ),
  (
    'MAT_TngP_TPR',
    'Total number of teenage girls tested positive for pregnancy',
    'Reproductive & Maternal Health',
    3
  ),
  (
    'MAT_TngP_TPR.1',
    '10 - 14 years',
    'Reproductive & Maternal Health',
    3
  ),
  (
    'MAT_TngP_TPR.2',
    '15 - 19 years',
    'Reproductive & Maternal Health',
    3
  ),
  (
    'MAT_Tngtst.',
    'Total number of women tested positive pregnancy',
    'Reproductive & Maternal Health',
    3
  ),
  (
    'MAT_UTER',
    'Percentage women who received uterotonics in the first one minute after delivery L',
    'Reproductive & Maternal Health',
    2
  ),
  (
    'MAT_UTER.1',
    'Total number of women who received uterotonics in the first one minute after delivery',
    'Reproductive & Maternal Health',
    2
  ),
  (
    'MAT_UTER.1.1',
    'oxytocin',
    'Reproductive & Maternal Health',
    2
  ),
  (
    'MAT_UTER.1.2',
    'mesoprostol',
    'Reproductive & Maternal Health',
    2
  ),
  (
    'MAT_UTER.1.3',
    'ergometrin',
    'Reproductive & Maternal Health',
    2
  ),
  (
    'MAT_UTER.1.4',
    'Other uterotonics',
    'Reproductive & Maternal Health',
    2
  ),
  (
    'MS_ALS.1',
    'Total length of stay (in days) during discharge',
    'Malaria Prevention and Control',
    7
  ),
  (
    'MS_ALS.2',
    'Number of inpatient discharges',
    'Malaria Prevention and Control',
    7
  ),
  (
    'MS_AMBU',
    'Ambulance service utilization for referral service',
    'Malaria Prevention and Control',
    7
  ),
  (
    'MS_AMBU.1',
    'Number of clients that came to health facility using ambulance',
    'Malaria Prevention and Control',
    7
  ),
  (
    'MS_AMBU.1.1',
    'Pre-facility',
    'Malaria Prevention and Control',
    7
  ),
  (
    'MS_AMBU.1.2',
    'Between facility',
    'Malaria Prevention and Control',
    7
  ),
  (
    'MS_EMERG_DIS.',
    'Total number of emergency room discharges',
    'Malaria Prevention and Control',
    8
  ),
  (
    'MS_EMERG_MR',
    'Facility emergency department mortality rate',
    'Malaria Prevention and Control',
    7
  ),
  (
    'MS_EMERG_MR.1',
    'Total death in the emergency unit',
    'Malaria Prevention and Control',
    7
  ),
  (
    'MS_EMERG_MR.1.1',
    '< 15 years, < 24 hours, Male',
    'Malaria Prevention and Control',
    7
  ),
  (
    'MS_EMERG_MR.1.2',
    '< 15 years, < 24 hours, Female',
    'Malaria Prevention and Control',
    7
  ),
  (
    'MS_EMERG_MR.1.3',
    '< 15 years, >= 24 hours, Male',
    'Malaria Prevention and Control',
    7
  ),
  (
    'MS_EMERG_MR.1.4',
    '< 15 years, >= 24 hours, Female',
    'Malaria Prevention and Control',
    7
  ),
  (
    'MS_EMERG_MR.1.5',
    '>= 15 years, < 24 hours, Male',
    'Malaria Prevention and Control',
    7
  ),
  (
    'MS_EMERG_MR.1.6',
    '>= 15 years, < 24 hours, Female',
    'Malaria Prevention and Control',
    7
  ),
  (
    'MS_EMERG_MR.1.7',
    '>= 15 years, >= 24 hours, Male',
    'Malaria Prevention and Control',
    7
  ),
  (
    'MS_EMERG_MR.1.8',
    '>= 15 years, >= 24 hours, Female',
    'Malaria Prevention and Control',
    7
  ),
  (
    'MS_EMERG24',
    'Emergency attendance with more than 24 hours stay',
    'Malaria Prevention and Control',
    8
  ),
  (
    'MS_EMERG24.',
    'Emergency attendance with more than 24 hours stay',
    'Malaria Prevention and Control',
    8
  ),
  (
    'MS_IPD_AR.1.',
    'Number of inpatient admissions',
    'Malaria Prevention and Control',
    8
  ),
  (
    'MS_IPD_BOR.1',
    'Total length of stay (in days) in the reporting period',
    'Malaria Prevention and Control',
    7
  ),
  (
    'MS_IPIMR.1',
    'Total number of inpatient death in the reporting period',
    'Malaria Prevention and Control',
    8
  ),
  (
    'MS_IPIMR.1.1',
    '< 24 hours',
    'Malaria Prevention and Control',
    8
  ),
  (
    'MS_IPIMR.1.2',
    '>= 24 hours',
    'Malaria Prevention and Control',
    8
  ),
  (
    'MS_JPMR',
    'Inpatient mortality rate',
    'Malaria Prevention and Control',
    7
  ),
  (
    'MS_LaBT',
    'Essential laboratorial tests available',
    'Malaria Prevention and Control',
    7
  ),
  (
    'MS_LaBT.1',
    'Monthly score of essential laboratorial tests of the facility',
    'Malaria Prevention and Control',
    7
  ),
  (
    'MS_NumEMERGT.',
    'Total number of emergency unit attendance during the reporting period',
    'Malaria Prevention and Control',
    8
  ),
  (
    'MS_NumRI',
    'Total number of referral-ins',
    'Malaria Prevention and Control',
    7
  ),
  (
    'MS_NumRI.1',
    'Emergency referral',
    'Malaria Prevention and Control',
    7
  ),
  (
    'MS_NumRI.2',
    'Non-emergency referral',
    'Malaria Prevention and Control',
    7
  ),
  (
    'MS_OPD',
    'Outpatient (OPD) attendance per capita.',
    'Malaria Prevention and Control',
    7
  ),
  (
    'MS_OPD_NumOV.1',
    'Number of outpatient visits',
    'Malaria Prevention and Control',
    7
  ),
  (
    'MS_OPD_NumOV.1.1',
    '< 5 years, Male',
    'Malaria Prevention and Control',
    7
  ),
  (
    'MS_OPD_NumOV.1.10',
    '30 - 45 years, Female',
    'Malaria Prevention and Control',
    7
  ),
  (
    'MS_OPD_NumOV.1.11',
    '46 - 65 years, Male',
    'Malaria Prevention and Control',
    7
  ),
  (
    'MS_OPD_NumOV.1.12',
    '46 - 65 years, Female',
    'Malaria Prevention and Control',
    7
  ),
  (
    'MS_OPD_NumOV.1.13',
    '>= 66 years, Male',
    'Malaria Prevention and Control',
    7
  ),
  (
    'MS_OPD_NumOV.1.14',
    '>= 66 years, Female',
    'Malaria Prevention and Control',
    7
  ),
  (
    'MS_OPD_NumOV.1.2',
    '< 5 years, Female',
    'Malaria Prevention and Control',
    7
  ),
  (
    'MS_OPD_NumOV.1.3',
    '5 - 10 years, Male',
    'Malaria Prevention and Control',
    7
  ),
  (
    'MS_OPD_NumOV.1.4',
    '5 - 10 years, Female',
    'Malaria Prevention and Control',
    7
  ),
  (
    'MS_OPD_NumOV.1.5',
    '11 - 19 years, Male',
    'Malaria Prevention and Control',
    7
  ),
  (
    'MS_OPD_NumOV.1.6',
    '11 - 19 years, Female',
    'Malaria Prevention and Control',
    7
  ),
  (
    'MS_OPD_NumOV.1.7',
    '20 - 29 years, Male',
    'Malaria Prevention and Control',
    7
  ),
  (
    'MS_OPD_NumOV.1.8',
    '20 - 29 years, Female',
    'Malaria Prevention and Control',
    7
  ),
  (
    'MS_OPD_NumOV.1.9',
    '30 - 45 years, Male',
    'Malaria Prevention and Control',
    7
  ),
  (
    'MS_Ri',
    'Referral-ins',
    'Malaria Prevention and Control',
    7
  ),
  (
    'MS_RoR',
    'Referral-out',
    'Malaria Prevention and Control',
    7
  ),
  (
    'MS_RoR.1',
    'Number of people referred to other health facility',
    'Malaria Prevention and Control',
    7
  ),
  (
    'MS_RoR.1.1',
    'Emergency referral',
    'Malaria Prevention and Control',
    7
  ),
  (
    'MS_RoR.1.2',
    'Non-emergency referral',
    'Malaria Prevention and Control',
    7
  ),
  (
    'MS_RTI',
    'Road traffic injuries',
    'Malaria Prevention and Control',
    8
  ),
  (
    'MS_RTI.1',
    'Number of road traffic injury cases dis aggregated by accident type',
    'Malaria Prevention and Control',
    8
  ),
  (
    'MS_RTI.1.1',
    'Vehicle occupant',
    'Malaria Prevention and Control',
    8
  ),
  (
    'MS_RTI.1.2',
    'Motor cyclist',
    'Malaria Prevention and Control',
    8
  ),
  (
    'MS_RTI.1.3',
    'Pedestrian',
    'Malaria Prevention and Control',
    8
  ),
  (
    'MS_RTI.1.4',
    'Others',
    'Malaria Prevention and Control',
    8
  ),
  (
    'MS_SATIR.1.',
    'Number of serious adverse transfusion incidents and reactions occurred',
    'Malaria Prevention and Control',
    8
  ),
  (
    'MS_UBDT.1',
    'Total number of units of blood transfused',
    'Malaria Prevention and Control',
    8
  ),
  (
    'MS_UBDT.1.1',
    'direct family replacement',
    'Malaria Prevention and Control',
    8
  ),
  (
    'MS_UBDT.1.2',
    'from blood bank',
    'Malaria Prevention and Control',
    8
  ),
  (
    'MS_VAP',
    'Percentage of ventilator associated pneumonia',
    'Malaria Prevention and Control',
    8
  ),
  (
    'MS_VAP.1.',
    'Total number of clients developed ventilator associated pneumonia at ICU',
    'Malaria Prevention and Control',
    8
  ),
  (
    'MS_VAP.2.',
    'Number of clients with Mechanical Ventilation',
    'Malaria Prevention and Control',
    8
  ),
  (
    'NCD_CSR.1.',
    'Number of Cataract surgeries performed',
    'Malaria Prevention and Control',
    7
  ),
  (
    'NCD_CV_SCRN.1',
    'Women age 30-49 years who have been screened for cervical Ca by screening type',
    'Malaria Prevention and Control',
    7
  ),
  (
    'NCD_CV_SCRN.1.1',
    'Screened by VIA',
    'Malaria Prevention and Control',
    6
  ),
  (
    'NCD_CV_SCRN.1.2',
    'Screened by HPV DNA',
    'Malaria Prevention and Control',
    6
  ),
  (
    'NCD_CV_SCRN.1.2.1',
    'Women age 30-49 years who have been screened for cervical Ca VIA screening result',
    'Malaria Prevention and Control',
    7
  ),
  (
    'NCD_CV_SCRN.1.2.1.1',
    'Negative',
    'Malaria Prevention and Control',
    6
  ),
  (
    'NCD_CV_SCRN.1.2.1.2',
    'Positive: Eligible for Cryotherapy/ thermocoagulation',
    'Malaria Prevention and Control',
    6
  ),
  (
    'NCD_CV_SCRN.1.2.1.3',
    'Positive: Not eligible for Cryotherapy/ thermocoagulation',
    'Malaria Prevention and Control',
    6
  ),
  (
    'NCD_CV_SCRN.1.2.1.4',
    'Suspicious cancerous lesion',
    'Malaria Prevention and Control',
    6
  ),
  (
    'NCD_CV_SCRN.1.3',
    'Women age 30 - 49 years who have been screened for cervical Ca HPV/DNA screening result',
    'Malaria Prevention and Control',
    7
  ),
  (
    'NCD_CV_SCRN.1.3.1',
    'Positive',
    'Malaria Prevention and Control',
    7
  ),
  (
    'NCD_CV_SCRN.1.3.2',
    'Negative',
    'Malaria Prevention and Control',
    7
  ),
  (
    'NCD_CV_TX.1',
    'Eligible women who received treatment for cervical lesion',
    'Malaria Prevention and Control',
    7
  ),
  (
    'NCD_CV_TX.1.1',
    'Crayotherapy',
    'Malaria Prevention and Control',
    7
  ),
  (
    'NCD_CV_TX.1.2',
    'LEEP',
    'Malaria Prevention and Control',
    7
  ),
  (
    'NCD_CV_TX.1.3',
    'Thermal Abrasion/Thermocoagulation',
    'Malaria Prevention and Control',
    7
  ),
  (
    'NCD_CV_TX.2',
    'Women screened for cervical lesion 1 year after treatment follow up by Screening type',
    'Malaria Prevention and Control',
    7
  ),
  (
    'NCD_CV_TX.2.1',
    'Screened by VIA',
    'Malaria Prevention and Control',
    7
  ),
  (
    'NCD_CV_TX.2.2',
    'Screened by HPV DNA',
    'Malaria Prevention and Control',
    7
  ),
  (
    'NCD_CV_TX.2.2.1',
    'Negative',
    'Malaria Prevention and Control',
    7
  ),
  (
    'NCD_CV_TX.2.2.2',
    'Positive: Eligible for Cryotherapy/ thermocoagulation',
    'Malaria Prevention and Control',
    7
  ),
  (
    'NCD_CV_TX.2.2.3',
    'Positive: not eligible for Cryotherapy/ thermocoagulation',
    'Malaria Prevention and Control',
    7
  ),
  (
    'NCD_CV_TX.2.2.4',
    'Suspicious cancerous lesion',
    'Malaria Prevention and Control',
    7
  ),
  (
    'NCD_CV_TX.2.3',
    'Women screened for cervical lesion 1 year after treatment follow up HPV/DNA screening result',
    'Malaria Prevention and Control',
    7
  ),
  (
    'NCD_CV_TX.2.3.1',
    'Positive',
    'Malaria Prevention and Control',
    7
  ),
  (
    'NCD_CV_TX.2.3.2',
    'Negative',
    'Malaria Prevention and Control',
    7
  ),
  (
    'NCD_CVD.1',
    'Number of individuals in high CVD risk by type of risk category :',
    'Malaria Prevention and Control',
    7
  ),
  (
    'NCD_CVD.2',
    'Number of individuals in high CVD risk by Age Category:',
    'Malaria Prevention and Control',
    7
  ),
  (
    'NCD_CVD.3',
    'Number of patients with high CVD risk who received treatment by type of treatment:',
    'Malaria Prevention and Control',
    7
  ),
  (
    'NCD_CVD.4',
    'Patients with high CVD risk who received treatment by Age Category:',
    'Malaria Prevention and Control',
    7
  ),
  (
    'NCD_DMDX.1.1',
    'Number of Individuals screened for Diabetes Mellitus by result of screening',
    'Malaria Prevention and Control',
    7
  ),
  (
    'NCD_DMDX.1.2',
    'Individuals screened for Diabetes Mellitus by age and sex',
    'Malaria Prevention and Control',
    7
  ),
  (
    'NCD_DMDX.2',
    'Diabetic patients enrolled to care by types of Diabete',
    'Malaria Prevention and Control',
    7
  ),
  (
    'NCD_DMDX.2.2',
    'Diabetic patients enrolled to care by type of treatment',
    'Malaria Prevention and Control',
    7
  ),
  (
    'NCD_DMDX.2.2.1',
    'Healthy life style counciling (HLC) only',
    'Malaria Prevention and Control',
    6
  ),
  (
    'NCD_DMDX.2.2.2',
    'Pharmacological management and HLC',
    'Malaria Prevention and Control',
    6
  ),
  (
    'NCD_DMDX.2.3',
    'Diabetic patients enrolled to care by age and sex',
    'Malaria Prevention and Control',
    7
  ),
  (
    'NCD_DMDX.2.3.1',
    '< 15 years, Male',
    'Malaria Prevention and Control',
    6
  ),
  (
    'NCD_DMDX.2.3.2',
    '< 15 years, Female',
    'Malaria Prevention and Control',
    6
  ),
  (
    'NCD_DMDX.2.3.3',
    '15 - 29 years, Male',
    'Malaria Prevention and Control',
    6
  ),
  (
    'NCD_DMDX.2.3.4',
    '15 - 29 years, Female',
    'Malaria Prevention and Control',
    6
  ),
  (
    'NCD_DMDX.2.3.5',
    '30 - 39 years, Male',
    'Malaria Prevention and Control',
    6
  ),
  (
    'NCD_DMDX.2.3.6',
    '30 - 39 years, Female',
    'Malaria Prevention and Control',
    6
  ),
  (
    'NCD_DMDX.2.3.7',
    '>= 40 years, Male',
    'Malaria Prevention and Control',
    6
  ),
  (
    'NCD_DMDX.2.3.8',
    '>= 40 years, Female',
    'Malaria Prevention and Control',
    6
  ),
  (
    'NCD_DMDX.2.4',
    'Diabetic patients by Timing of enrollment',
    'Malaria Prevention and Control',
    7
  ),
  (
    'NCD_DMDX.2.4.1',
    'Newly enrolled to care',
    'Malaria Prevention and Control',
    6
  ),
  (
    'NCD_DMDX.2.4.2',
    'Previously in care',
    'Malaria Prevention and Control',
    6
  ),
  (
    'NCD_DMTX',
    'Six-monthly control of diabetes among individuals treated for diabetes',
    'Malaria Prevention and Control',
    7
  ),
  (
    'NCD_DMTX.0.',
    'Total number of cohort of hypertensive pateints registered for diabetes treatment six months prior to the reporting period',
    'Malaria Prevention and Control',
    7
  ),
  (
    'NCD_DMTX.1',
    'Treatment outcome for cohort of patient registered for diabetes treatment six months prior to the reporting period',
    'Malaria Prevention and Control',
    7
  ),
  (
    'NCD_DMTX.1.1',
    'Controlled',
    'Malaria Prevention and Control',
    6
  ),
  (
    'NCD_DMTX.1.2',
    'Uncontrolled',
    'Malaria Prevention and Control',
    6
  ),
  (
    'NCD_DMTX.1.3',
    'Lost to follow-up',
    'Malaria Prevention and Control',
    6
  ),
  (
    'NCD_DMTX.1.4',
    'Died',
    'Malaria Prevention and Control',
    6
  ),
  (
    'NCD_DMTX.1.5',
    'Transferred out',
    'Malaria Prevention and Control',
    6
  ),
  (
    'NCD_DMTX.1.6',
    'Not evaluated',
    'Malaria Prevention and Control',
    6
  ),
  (
    'NCD_HTN',
    'Hypertension',
    'Malaria Prevention and Control',
    5
  ),
  (
    'NCD_HTNDX.1',
    'Number of Individuals screened for hypertension',
    'Malaria Prevention and Control',
    5
  ),
  (
    'NCD_HTNDX.1.2',
    'Number of Individuals screened for hypertension by result of screening',
    'Malaria Prevention and Control',
    5
  ),
  (
    'NCD_HTNDX.2',
    'Hypertensive patients enrolled to care by Type of Treatment',
    'Malaria Prevention and Control',
    5
  ),
  (
    'NCD_HTNDX.2.2',
    'Hypertensive patients enrolled to care by age and sex',
    'Malaria Prevention and Control',
    5
  ),
  (
    'NCD_HTNDX.2.2.1',
    '18 - 29 years, Male',
    'Malaria Prevention and Control',
    5
  ),
  (
    'NCD_HTNDX.2.2.2',
    '18 - 29 years, Female',
    'Malaria Prevention and Control',
    5
  ),
  (
    'NCD_HTNDX.2.2.3',
    '30 - 39 years, Male',
    'Malaria Prevention and Control',
    5
  ),
  (
    'NCD_HTNDX.2.2.4',
    '30 - 39 years, Female',
    'Malaria Prevention and Control',
    5
  ),
  (
    'NCD_HTNDX.2.2.5',
    '40 - 69 years, Male',
    'Malaria Prevention and Control',
    5
  ),
  (
    'NCD_HTNDX.2.2.6',
    '40 - 69 years, Female',
    'Malaria Prevention and Control',
    5
  ),
  (
    'NCD_HTNDX.2.2.7',
    '>= 70 years, Male',
    'Malaria Prevention and Control',
    5
  ),
  (
    'NCD_HTNDX.2.2.8',
    '>= 70 years, Female',
    'Malaria Prevention and Control',
    5
  ),
  (
    'NCD_HTNDX.2.3',
    'Hypertensive patients by timing of enrollment',
    'Malaria Prevention and Control',
    5
  ),
  (
    'NCD_HTNDX.2.3.1',
    'Newly enrolled to care',
    'Malaria Prevention and Control',
    5
  ),
  (
    'NCD_HTNDX.2.3.2',
    'Previously in care',
    'Malaria Prevention and Control',
    5
  ),
  (
    'NCD_HTNTX',
    'Six-monthly control of blood pressure among people treated for hypertension',
    'Malaria Prevention and Control',
    5
  ),
  (
    'NCD_HTNTX.0.',
    'Total number of cohort hypertensive patients enrolled to care six month prior to the reporting month',
    'Malaria Prevention and Control',
    5
  ),
  (
    'NCD_HTNTX.1',
    'Treatment outcome for cohort of patient registered for hypertension treatment six months prior to the reporting period:',
    'Malaria Prevention and Control',
    5
  ),
  (
    'NCD_HTNTX.1.1',
    'Controlled',
    'Malaria Prevention and Control',
    5
  ),
  (
    'NCD_HTNTX.1.2',
    'Uncontrolled',
    'Malaria Prevention and Control',
    5
  ),
  (
    'NCD_HTNTX.1.3',
    'Lost to follow-up',
    'Malaria Prevention and Control',
    5
  ),
  (
    'NCD_HTNTX.1.4',
    'Died',
    'Malaria Prevention and Control',
    5
  ),
  (
    'NCD_HTNTX.1.5',
    'Transferred out',
    'Malaria Prevention and Control',
    5
  ),
  (
    'NCD_HTNTX.1.6',
    'Not evaluated',
    'Malaria Prevention and Control',
    5
  ),
  (
    'NTD_CL.1',
    'Number of cutaneous Leishmaniasis (CL) cases treated',
    'Malaria Prevention and Control',
    4
  ),
  (
    'NTD_CL.2',
    'Number of cutaneous leishmaniasis patients treated by type',
    'Malaria Prevention and Control',
    5
  ),
  (
    'NTD_CL.3',
    'Number of cutaneous leishmaniasis patients treated by treatment outcome',
    'Malaria Prevention and Control',
    5
  ),
  (
    'NTD_HYD',
    'Number of hydrocele cases operated (due to lymphatic filariasis)',
    'Malaria Prevention and Control',
    5
  ),
  (
    'NTD_POD',
    'Number of lymph edema cases managed (podoconosis and lymphatic filariasis)',
    'Malaria Prevention and Control',
    5
  ),
  (
    'NTD_TT.1',
    'Number of people with TT who received corrective TT surgery',
    'Malaria Prevention and Control',
    5
  ),
  (
    'NTD_VL.1',
    'Number of visceral leishmaniasis patients treated by age and sex',
    'Malaria Prevention and Control',
    4
  ),
  (
    'NTD_VL.1.1',
    '< 5 years, Male',
    'Malaria Prevention and Control',
    4
  ),
  (
    'NTD_VL.1.2',
    '< 5 years, Female',
    'Malaria Prevention and Control',
    4
  ),
  (
    'NTD_VL.1.3',
    '5 - 14 years, Male',
    'Malaria Prevention and Control',
    4
  ),
  (
    'NTD_VL.1.4',
    '5 - 14 years, Female',
    'Malaria Prevention and Control',
    4
  ),
  (
    'NTD_VL.1.5',
    '>= 15 years, Male',
    'Malaria Prevention and Control',
    4
  ),
  (
    'NTD_VL.1.6',
    '>= 15 years, Female',
    'Malaria Prevention and Control',
    4
  ),
  (
    'NTD_VL.2',
    'Number of visceral leishmaniasis patients treated by treatment type',
    'Malaria Prevention and Control',
    4
  ),
  (
    'NTD_VL.2.1',
    'Primary visceral leishmaniasis',
    'Malaria Prevention and Control',
    4
  ),
  (
    'NTD_VL.2.2',
    'Relapse visceral leishmaniasis',
    'Malaria Prevention and Control',
    4
  ),
  (
    'NTD_VL.2.3',
    'Post Kala-azar dermal leishmaniasis (PKDL)',
    'Malaria Prevention and Control',
    4
  ),
  (
    'NTD_VL.3',
    'Number of visceral leishmaniasis patients treated by treatment outcome',
    'Malaria Prevention and Control',
    4
  ),
  (
    'NTD_VL.3.1',
    'Cured',
    'Malaria Prevention and Control',
    4
  ),
  (
    'NTD_VL.3.2',
    'Defaulted',
    'Malaria Prevention and Control',
    4
  ),
  (
    'NTD_VL.3.3',
    'Treatment failure',
    'Malaria Prevention and Control',
    4
  ),
  (
    'NTD_VL.3.4',
    'Deaths',
    'Malaria Prevention and Control',
    4
  ),
  (
    'NTD_VL.3.5',
    'Transferred out',
    'Malaria Prevention and Control',
    4
  ),
  (
    'NTD_VL.4',
    'Number of visceral leishmaniasis patients treated by HIV test result status',
    'Malaria Prevention and Control',
    4
  ),
  (
    'NTD_VL.4.1',
    'Positive',
    'Malaria Prevention and Control',
    4
  ),
  (
    'NTD_VL.4.2',
    'Negative',
    'Malaria Prevention and Control',
    4
  ),
  (
    'OS\'',
    'Average Length of Stay.',
    'Malaria Prevention and Control',
    7
  ),
  (
    'PMS',
    'Improve access to pharmaceuticals & medical devices & their rational & proper use',
    'Improve access to pharmaceuticals & medical devices & their rational & proper use',
    8
  ),
  (
    'PMS_ABIOTIC.1.',
    'Number of encounter with one or more antibiotics',
    'Improve access to pharmaceuticals & medical devices & their rational & proper use',
    8
  ),
  (
    'PMS_ABIOTIC.2.',
    'Total number of encounters',
    'Improve access to pharmaceuticals & medical devices & their rational & proper use',
    9
  ),
  (
    'PMS_AVAIL.1.1.',
    'Medroxyprogesterone Injection',
    'Improve access to pharmaceuticals & medical devices & their rational & proper use',
    8
  ),
  (
    'PMS_AVAIL.1.10.',
    'TTC eye ointment',
    'Improve access to pharmaceuticals & medical devices & their rational & proper use',
    8
  ),
  (
    'PMS_AVAIL.1.11.',
    'RHZE/RH',
    'Improve access to pharmaceuticals & medical devices & their rational & proper use',
    8
  ),
  (
    'PMS_AVAIL.1.12.',
    'TDF/3TC/DTG',
    'Improve access to pharmaceuticals & medical devices & their rational & proper use',
    8
  ),
  (
    'PMS_AVAIL.1.13.',
    'Co-trimoxazole 240mg/5ml suspension',
    'Improve access to pharmaceuticals & medical devices & their rational & proper use',
    8
  ),
  (
    'PMS_AVAIL.1.14.',
    'Arthmeter + Lumfanthrine tablet',
    'Improve access to pharmaceuticals & medical devices & their rational & proper use',
    8
  ),
  (
    'PMS_AVAIL.1.15.',
    'Amlodipine tablet',
    'Improve access to pharmaceuticals & medical devices & their rational & proper use',
    8
  ),
  (
    'PMS_AVAIL.1.16.',
    'Frusamide tablets',
    'Improve access to pharmaceuticals & medical devices & their rational & proper use',
    8
  ),
  (
    'PMS_AVAIL.1.17.',
    'Metformin tablet',
    'Improve access to pharmaceuticals & medical devices & their rational & proper use',
    8
  ),
  (
    'PMS_AVAIL.1.18.',
    'Normal Saline 0.9%',
    'Improve access to pharmaceuticals & medical devices & their rational & proper use',
    8
  ),
  (
    'PMS_AVAIL.1.19.',
    '40% glucose',
    'Improve access to pharmaceuticals & medical devices & their rational & proper use',
    8
  ),
  (
    'PMS_AVAIL.1.2.',
    'Pentavalent vaccine',
    'Improve access to pharmaceuticals & medical devices & their rational & proper use',
    8
  ),
  (
    'PMS_AVAIL.1.20.',
    'Adrenaline injection',
    'Improve access to pharmaceuticals & medical devices & their rational & proper use',
    8
  ),
  (
    'PMS_AVAIL.1.21.',
    'Tetanus Anti Toxin (TAT) injection',
    'Improve access to pharmaceuticals & medical devices & their rational & proper use',
    8
  ),
  (
    'PMS_AVAIL.1.22.',
    'Omeprazole capsule',
    'Improve access to pharmaceuticals & medical devices & their rational & proper use',
    8
  ),
  (
    'PMS_AVAIL.1.23.',
    'Metronidazole capsule',
    'Improve access to pharmaceuticals & medical devices & their rational & proper use',
    8
  ),
  (
    'PMS_AVAIL.1.24.',
    'Ciprofloxcaxillin tablet',
    'Improve access to pharmaceuticals & medical devices & their rational & proper use',
    8
  ),
  (
    'PMS_AVAIL.1.25.',
    'Hydralizine injection',
    'Improve access to pharmaceuticals & medical devices & their rational & proper use',
    8
  ),
  (
    'PMS_AVAIL.1.3.',
    'Magnesium Sulphate injection',
    'Improve access to pharmaceuticals & medical devices & their rational & proper use',
    8
  ),
  (
    'PMS_AVAIL.1.4.',
    'Oxytocine inj',
    'Improve access to pharmaceuticals & medical devices & their rational & proper use',
    8
  ),
  (
    'PMS_AVAIL.1.5.',
    'Gentamycin injection',
    'Improve access to pharmaceuticals & medical devices & their rational & proper use',
    8
  ),
  (
    'PMS_AVAIL.1.7.',
    'Amoxcillin dispersable/suspension/capsule',
    'Improve access to pharmaceuticals & medical devices & their rational & proper use',
    8
  ),
  (
    'PMS_AVAIL.1.8.',
    'Iron + folic acid',
    'Improve access to pharmaceuticals & medical devices & their rational & proper use',
    8
  ),
  (
    'PMS_AVAIL.1.9.',
    'Albendazole/Mebendazole tablet/suspension',
    'Improve access to pharmaceuticals & medical devices & their rational & proper use',
    8
  ),
  (
    'PMS_FILL100.1.',
    'Number of clients who received 100% of prescribed drugs',
    'Improve access to pharmaceuticals & medical devices & their rational & proper use',
    9
  ),
  (
    'PMS_FILL100.2.',
    'Total number of clients who received prescriptions',
    'Improve access to pharmaceuticals & medical devices & their rational & proper use',
    9
  ),
  (
    'PMS_FSML',
    'Percentage of medicines prescribed from the facility\'s medicines list',
    'Improve access to pharmaceuticals & medical devices & their rational & proper use',
    9
  ),
  (
    'PMS_MP_Num.',
    'Total number of medicine prescribed',
    'Improve access to pharmaceuticals & medical devices & their rational & proper use',
    8
  ),
  (
    'PMS_MPFML_Num.',
    'Total number of medicines prescribed from Health facility medicine list',
    'Improve access to pharmaceuticals & medical devices & their rational & proper use',
    8
  ),
  (
    'RMH',
    'Reproductive & Maternal Health',
    'Reproductive & Maternal Health',
    1
  ),
  (
    'RMH_L&D_SBA',
    'Births attended by skilled health personnel',
    'Reproductive & Maternal Health',
    2
  ),
  (
    'RMNCH',
    'Reproductive, Maternal, Neonatal, Child, Adolescent and Youth Health-Nutrition',
    'Reproductive & Maternal Health',
    1
  ),
  (
    'STI_1',
    'Soft tissue injury',
    'Common Morbidity',
    9
  );

/*!40000 ALTER TABLE `report_indicators` ENABLE KEYS */;

UNLOCK TABLES;

/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;

/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;

/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;

/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;

/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-01-03 11:10:15