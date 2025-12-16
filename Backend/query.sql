use ferenje_clinic_hcms;

CREATE TABLE `department` (
  `department_id` int NOT NULL AUTO_INCREMENT,
  `department_name` varchar(255) NOT NULL,
  PRIMARY KEY (`department_id`)
);

CREATE TABLE `person` (
  `person_id` INT NOT NULL AUTO_INCREMENT,
  `first_name` VARCHAR(255) NOT NULL,
  `last_name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) UNIQUE NOT NULL, -- Added UNIQUE and NOT NULL
  `password` VARCHAR(255) NOT NULL,
  `address` TEXT,
  `phone_number` VARCHAR(20) DEFAULT NULL,
  `department_id` INT DEFAULT NULL,
  `role` ENUM('doctor','receptionist','admin') NOT NULL,
  PRIMARY KEY (`person_id`),
  KEY `department_id` (`department_id`),
  FOREIGN KEY (`department_id`) REFERENCES `department` (`department_id`) ON UPDATE CASCADE
);

CREATE TABLE `doctor` (
  `doctor_id` INT NOT NULL,
  `office_no` VARCHAR(50) DEFAULT NULL,
  `specialization` VARCHAR(100) DEFAULT NULL,
  PRIMARY KEY (`doctor_id`),
  FOREIGN KEY (`doctor_id`) REFERENCES `person` (`person_id`) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE `patient` (
  `patient_id` INT NOT NULL,
  `FirstName` VARCHAR(100) NOT NULL, -- Added data type
  `Father_Name` VARCHAR(100), -- Renamed and added data type
  `GrandFather_Name` VARCHAR(100), -- Renamed and added data type
  `DateOfBirth` DATE, -- Added data type
  `Age` INT, -- Added data type
  `Sex` ENUM('Male', 'Female', 'Other'), -- Added data type
  `Region` VARCHAR(100), -- Added data type
  `Wereda` VARCHAR(100), -- Added data type
  `HouseNo` VARCHAR(50), -- Added data type
  `PhoneNo` VARCHAR(20), -- Added data type
  `date_registered` DATE, -- Added data type
  PRIMARY KEY (`patient_id`)
);

CREATE TABLE `card` (
  `card_id` INT NOT NULL AUTO_INCREMENT,
  `patient_id` INT NOT NULL,
  `CardNumber` VARCHAR(255) UNIQUE NOT NULL,
  `status` ENUM('Active','Inactive','Expired') DEFAULT 'Active',
  `issue_date` DATE NOT NULL,
  `expire_date` DATE,
  PRIMARY KEY (`card_id`),
  KEY `patient_id` (`patient_id`),
  FOREIGN KEY (`patient_id`) REFERENCES `patient` (`patient_id`) ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE `appointment` (
  `appointment_id` INT NOT NULL AUTO_INCREMENT,
  `card_id` INT DEFAULT NULL,
  `doctor_id` INT DEFAULT NULL,
  `appointment_start_time` DATETIME DEFAULT NULL,
  `appointment_end_time` DATETIME DEFAULT NULL,
  `status` ENUM('scheduled','completed','cancelled') DEFAULT 'scheduled',
  PRIMARY KEY (`appointment_id`),
  KEY `card_id` (`card_id`),
  KEY `doctor_id` (`doctor_id`),
  FOREIGN KEY (`card_id`) REFERENCES `card` (`card_id`) ON UPDATE CASCADE ON DELETE RESTRICT,
  FOREIGN KEY (`doctor_id`) REFERENCES `doctor` (`doctor_id`) ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE `payment` (
  `payment_id` INT NOT NULL AUTO_INCREMENT,
  `card_id` INT DEFAULT NULL,
  `amount` DECIMAL(10,2) NOT NULL,
  `billing_date` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `description` TEXT,
  `payment_type` VARCHAR(50), -- Added data type
  `status` ENUM('pending','paid','cancelled') DEFAULT 'pending',
  PRIMARY KEY (`payment_id`),
  KEY `card_id` (`card_id`),
  FOREIGN KEY (`card_id`) REFERENCES `card` (`card_id`) ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE `queue` (
  `queue_id` INT NOT NULL AUTO_INCREMENT,
  `card_id` INT DEFAULT NULL,
  `doctor_id` INT DEFAULT NULL,
  `status` ENUM('waiting','in_consultation','completed') DEFAULT 'waiting',
  `queue_position` INT DEFAULT NULL,
  `date` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`queue_id`),
  KEY `card_id` (`card_id`),
  KEY `doctor_id` (`doctor_id`),
  FOREIGN KEY (`card_id`) REFERENCES `card` (`card_id`) ON UPDATE CASCADE ON DELETE RESTRICT,
  FOREIGN KEY (`doctor_id`) REFERENCES `doctor` (`doctor_id`) ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE PatientVisitRecord (
  VisitRecordID INT PRIMARY KEY AUTO_INCREMENT,
  card_id INT NOT NULL,
  doctor_id INT,
  DateOfVisit DATE NOT NULL,
  ChiefComplaint TEXT NOT NULL,
  UrgentAttention BOOLEAN DEFAULT FALSE,
  HPI TEXT,
  FinalDiagnosis TEXT,
  Advice TEXT,
  Treatment TEXT,
  TimeCreated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  TimeUpdated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (card_id) REFERENCES Card(card_id) ON UPDATE CASCADE ON DELETE RESTRICT,
  FOREIGN KEY (doctor_id) REFERENCES doctor (doctor_id) ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE VisitVitalSigns (
  VitalsID INT PRIMARY KEY AUTO_INCREMENT,
  VisitRecordID INT NOT NULL,
  SystolicBP INT,
  DiastolicBP INT,
  PulseRate INT,
  RespiratoryRate INT,
  TemperatureC DECIMAL(4, 2),
  SPO2 DECIMAL(4, 2),
  WeightKg DECIMAL(5, 2),
  
  FOREIGN KEY (VisitRecordID) REFERENCES PatientVisitRecord(VisitRecordID) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE VisitPhysicalExam (
  ExamID INT PRIMARY KEY AUTO_INCREMENT,
  VisitRecordID INT NOT NULL,
  GeneralAppearance VARCHAR(255),
  HEENT_Findings TEXT,
  Chest_Findings TEXT,
  Abdomen_Findings TEXT,
  CVS_Findings TEXT,
  CNS_Findings TEXT,
  MSS_Findings TEXT,
  
  FOREIGN KEY (VisitRecordID) REFERENCES PatientVisitRecord(VisitRecordID) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE `available_lab_tests` (
  `test_id` INT NOT NULL AUTO_INCREMENT,
  `test_name` VARCHAR(255) UNIQUE NOT NULL,
  `UnitOfMeasure` VARCHAR(50),
  `NormalRange_Male` VARCHAR(100),
  `NormalRange_Female` VARCHAR(100),
  `TestCategory` VARCHAR(50),
  `price` DECIMAL(10,2) DEFAULT NULL,
  PRIMARY KEY (`test_id`)
);

CREATE TABLE `lab_request` (
  `request_id` INT NOT NULL AUTO_INCREMENT,
  `VisitRecordID` INT NOT NULL,
  `doctor_id` INT DEFAULT NULL,
  `LabStatus` ENUM('pending','completed') DEFAULT 'pending',
  `RequestDate` DATETIME NOT NULL,
  `ReportDate` DATETIME,
  PRIMARY KEY (`request_id`),
  KEY `VisitRecordID` (`VisitRecordID`),
  KEY `doctor_id` (`doctor_id`),
  FOREIGN KEY (VisitRecordID) REFERENCES PatientVisitRecord(VisitRecordID) ON UPDATE CASCADE ON DELETE RESTRICT,
  FOREIGN KEY (`doctor_id`) REFERENCES `doctor` (`doctor_id`) ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE lab_request_tests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  request_id INT NOT NULL,
  test_id INT NOT NULL,
  payment_status ENUM('unpaid', 'paid', 'pending') DEFAULT 'unpaid',

  FOREIGN KEY (request_id)
    REFERENCES lab_request(request_id)
    ON DELETE CASCADE,

  FOREIGN KEY (test_id)
    REFERENCES available_lab_tests(test_id)
    ON DELETE RESTRICT
);

CREATE TABLE LabTestResult (
  result_id INT PRIMARY KEY AUTO_INCREMENT,
  request_id INT NOT NULL,
  test_id INT NOT NULL,
  test_result_value VARCHAR(100) NOT NULL,
  interpretation VARCHAR(10),
  
  FOREIGN KEY (request_id) REFERENCES lab_request(request_id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (test_id) REFERENCES available_lab_tests(test_id) ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE `medication` (
  `Id` INT NOT NULL AUTO_INCREMENT,
  `VisitRecordID` INT DEFAULT NULL,
  `doctor_id` INT, -- Added data type
  `OrderedMedication` VARCHAR(255) NOT NULL,
  `MedStatus` VARCHAR(255) NOT NULL,
  `MedDate` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`Id`),
  FOREIGN KEY (VisitRecordID) REFERENCES PatientVisitRecord(VisitRecordID) ON UPDATE CASCADE ON DELETE RESTRICT,
  FOREIGN KEY (`doctor_id`) REFERENCES `doctor` (`doctor_id`) ON UPDATE CASCADE ON DELETE RESTRICT
);