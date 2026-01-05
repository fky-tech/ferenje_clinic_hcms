/* =========================================================
   FAMILY PLANNING CARD (MASTER RECORD) TABLE
   ========================================================= */
CREATE TABLE IF NOT EXISTS family_planning_cards (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,

  card_id INT NOT NULL,
  appointment_id INT,

  /* =========================
     DEMOGRAPHICS
  ========================== */
  education VARCHAR(100),
  occupation VARCHAR(100),
  religion VARCHAR(100),
  marital_status ENUM('single','married','divorced','widowed'),

  /* =========================
     GYNECOLOGICAL HISTORY
  ========================== */
  gravida INT,
  para INT,
  living_children INT,

  abortions BOOLEAN,
  stillbirths BOOLEAN,
  date_of_last_delivery DATE,
  breastfeeding BOOLEAN,

  menstrual_cycle ENUM('regular','irregular'),
  lmp DATE,
  loss ENUM('light','moderate','heavy'),
  duration_of_period INT,

  inter_menstrual_bleeding BOOLEAN,
  postcoital_bleeding BOOLEAN,
  dyspareunia BOOLEAN,
  discharge ENUM('normal','abnormal'),

  /* =========================
     PAST MEDICAL / SURGICAL
  ========================== */
  varicose_veins BOOLEAN,
  jaundice BOOLEAN,
  hypertension BOOLEAN,
  diabetes BOOLEAN,
  severe_chest_pain BOOLEAN,
  severe_headache BOOLEAN,

  other_illness_or_operation TEXT,
  allergies BOOLEAN,
  allergy_details TEXT,

  /* =========================
     PHYSICAL EXAMINATION
  ========================== */
  bp VARCHAR(20),
  pulse_rate INT,
  respiratory_rate INT,
  temperature DECIMAL(4,1),
  weight DECIMAL(5,2),

  heent ENUM('normal','abnormal'),
  breast ENUM('normal','abnormal'),
  abdomen ENUM('normal','abnormal'),
  lower_limb ENUM('normal','abnormal'),

  /* =========================
     SPECULUM / PELVIC EXAM
  ========================== */
  vulva ENUM('normal','abnormal'),
  vagina ENUM('normal','abnormal'),
  pelvic_discharge ENUM('normal','abnormal'),
  cervix ENUM('closed','open'),

  uterine_size VARCHAR(50),
  uterine_position ENUM('anteverted','retroverted'),
  uterine_mobility ENUM('mobile','not_mobile'),
  adnexa ENUM('normal','abnormal'),

  abnormal_findings TEXT,
  remarks TEXT,

  /* =========================
     FAMILY PLANNING
  ========================== */
  ever_used_contraception BOOLEAN,
  last_method_used VARCHAR(100),

  fp_method ENUM(
    'Implanon Classic',
    'Implanon NXT',
    'Jadelle',
    'Sino-Implant'
  ),

  implant_insertion_site ENUM(
    'Right arm',
    'Left arm',
    'IUCD Copper T 380A',
    'LNG-IUS',
    'Injectable DMPA',
    'Sayana press'
  ),
  injection_site TEXT,

  oral_pills ENUM('COC','POP'),
  condom_type ENUM('Male','Female'),

  product_name VARCHAR(100),
  batch_no VARCHAR(50),
  expiry_date DATE,

  lafp_removal BOOLEAN,
  lafp_removal_reason TEXT,
  lafp_duration_used VARCHAR(50),

  lidocaine_used BOOLEAN,
  other_pain_medication TEXT,

  /* =========================
     SA / PAC
  ========================== */
  sa_service_type ENUM('MA','MVA'),

  sa_reason ENUM(
    'Rape',
    'Incest',
    'Maternal condition',
    'Fetal deformity',
    'Other'
  ),
  sa_reason_other TEXT,

  pac_reason ENUM(
    'Incomplete abortion',
    'Inevitable',
    'Missed',
    'Other'
  ),
  pac_reason_other TEXT,

  /* =========================
     MA
  ========================== */
  ma_dose1_name_dose VARCHAR(150),
  ma_dose1_route VARCHAR(50),
  ma_dose1_datetime DATETIME,

  ma_dose2_name_dose VARCHAR(150),
  ma_dose2_route VARCHAR(50),
  ma_dose2_datetime DATETIME,

  ma_product_name VARCHAR(100),
  ma_batch_no VARCHAR(50),
  ma_expiry_date DATE,
  ma_pain_medication TEXT,

  /* =========================
     MVA
  ========================== */
  mva_paracervical_block BOOLEAN,
  mva_pain_score INT,
  mva_cannula_size VARCHAR(20),

  tissue_inspection_done BOOLEAN,
  finding_sac ENUM('present','absent'),
  finding_villi ENUM('present','absent'),
  other_findings TEXT,

  procedure_note TEXT,

  /* =========================
     POST-PROCEDURE VITALS
  ========================== */
  vs1_bp VARCHAR(20),
  vs1_pr INT,
  vs1_rr INT,
  vs1_temp DECIMAL(4,1),

  vs2_bp VARCHAR(20),
  vs2_pr INT,
  vs2_rr INT,
  vs2_temp DECIMAL(4,1),

  vs3_bp VARCHAR(20),
  vs3_pr INT,
  vs3_rr INT,
  vs3_temp DECIMAL(4,1),

  vs4_bp VARCHAR(20),
  vs4_pr INT,
  vs4_rr INT,
  vs4_temp DECIMAL(4,1),

  /* =========================
     POST PROCEDURE
  ========================== */
  post_procedure_counseling BOOLEAN,
  complications BOOLEAN,
  complication_details TEXT,

  discharge_note TEXT,
  referral_note TEXT,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_fp_card_card
    FOREIGN KEY (card_id)
    REFERENCES card(card_id)
    ON DELETE CASCADE,

  CONSTRAINT fk_fp_card_appointment
    FOREIGN KEY (appointment_id)
    REFERENCES appointment(appointment_id)
    ON DELETE RESTRICT
);

/* =========================================================
   FAMILY PLANNING VISITS TABLE
   ========================================================= */
CREATE TABLE IF NOT EXISTS family_planning_visits (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,

  card_id INT NOT NULL,
  appointment_id INT,

  date_of_visit DATE,
  lmp DATE,

  bp VARCHAR(20),
  weight DECIMAL(5,2),

  complaints_examination_treatment TEXT,

  contraceptive_method_type VARCHAR(100),
  contraceptive_quantity VARCHAR(50),

  batch_no VARCHAR(50),
  expiry_date DATE,

  client_type_revisit VARCHAR(50),
  client_type_method_switcher VARCHAR(50),

  reason_for_method_switch TEXT,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_fp_visit_card
    FOREIGN KEY (card_id)
    REFERENCES card(card_id)
    ON DELETE CASCADE,

  CONSTRAINT fk_fp_visit_appointment
    FOREIGN KEY (appointment_id)
    REFERENCES appointment(appointment_id)
    ON DELETE RESTRICT
);

/* =========================================================
   FP_CARD_FIELD_CATEGORIES TABLE
   ========================================================= */
CREATE TABLE IF NOT EXISTS fp_card_field_categories (
  field_name VARCHAR(100) PRIMARY KEY,
  category_name VARCHAR(100) NOT NULL
);

/* =========================
   SEED CATEGORIES
========================== */
INSERT IGNORE INTO fp_card_field_categories (field_name, category_name) VALUES
('education', 'Demographics'),
('occupation', 'Demographics'),
('religion', 'Demographics'),
('marital_status', 'Demographics'),

('gravida', 'Gynecological History'),
('para', 'Gynecological History'),
('living_children', 'Gynecological History'),
('abortions', 'Gynecological History'),
('stillbirths', 'Gynecological History'),
('date_of_last_delivery', 'Gynecological History'),
('breastfeeding', 'Gynecological History'),
('menstrual_cycle', 'Gynecological History'),
('lmp', 'Gynecological History'),
('loss', 'Gynecological History'),
('duration_of_period', 'Gynecological History'),
('inter_menstrual_bleeding', 'Gynecological History'),
('postcoital_bleeding', 'Gynecological History'),
('dyspareunia', 'Gynecological History'),
('discharge', 'Gynecological History'),

('varicose_veins', 'Past Medical / Surgical'),
('jaundice', 'Past Medical / Surgical'),
('hypertension', 'Past Medical / Surgical'),
('diabetes', 'Past Medical / Surgical'),
('severe_chest_pain', 'Past Medical / Surgical'),
('severe_headache', 'Past Medical / Surgical'),
('other_illness_or_operation', 'Past Medical / Surgical'),
('allergies', 'Past Medical / Surgical'),
('allergy_details', 'Past Medical / Surgical'),

('bp', 'Physical Examination'),
('pulse_rate', 'Physical Examination'),
('respiratory_rate', 'Physical Examination'),
('temperature', 'Physical Examination'),
('weight', 'Physical Examination'),
('heent', 'Physical Examination'),
('breast', 'Physical Examination'),
('abdomen', 'Physical Examination'),
('lower_limb', 'Physical Examination'),

('vulva', 'Speculum / Pelvic Exam'),
('vagina', 'Speculum / Pelvic Exam'),
('pelvic_discharge', 'Speculum / Pelvic Exam'),
('cervix', 'Speculum / Pelvic Exam'),
('uterine_size', 'Speculum / Pelvic Exam'),
('uterine_position', 'Speculum / Pelvic Exam'),
('uterine_mobility', 'Speculum / Pelvic Exam'),
('adnexa', 'Speculum / Pelvic Exam'),
('abnormal_findings', 'Speculum / Pelvic Exam'),
('remarks', 'Speculum / Pelvic Exam'),

('ever_used_contraception', 'Family Planning'),
('last_method_used', 'Family Planning'),
('fp_method', 'Family Planning'),
('implant_insertion_site', 'Family Planning'),
('injection_site', 'Family Planning'),
('oral_pills', 'Family Planning'),
('condom_type', 'Family Planning'),
('product_name', 'Family Planning'),
('batch_no', 'Family Planning'),
('expiry_date', 'Family Planning'),
('lafp_removal', 'Family Planning'),
('lafp_removal_reason', 'Family Planning'),
('lafp_duration_used', 'Family Planning'),
('lidocaine_used', 'Family Planning'),
('other_pain_medication', 'Family Planning'),

('sa_service_type', 'SA / PAC'),
('sa_reason', 'SA / PAC'),
('sa_reason_other', 'SA / PAC'),
('pac_reason', 'SA / PAC'),
('pac_reason_other', 'SA / PAC'),

('ma_dose1_name_dose', 'MA'),
('ma_dose1_route', 'MA'),
('ma_dose1_datetime', 'MA'),
('ma_dose2_name_dose', 'MA'),
('ma_dose2_route', 'MA'),
('ma_dose2_datetime', 'MA'),
('ma_product_name', 'MA'),
('ma_batch_no', 'MA'),
('ma_expiry_date', 'MA'),
('ma_pain_medication', 'MA'),

('mva_paracervical_block', 'MVA'),
('mva_pain_score', 'MVA'),
('mva_cannula_size', 'MVA'),
('tissue_inspection_done', 'MVA'),
('finding_sac', 'MVA'),
('finding_villi', 'MVA'),
('other_findings', 'MVA'),
('procedure_note', 'MVA'),

('vs1_bp', 'Post-Procedure Vitals'), ('vs1_pr', 'Post-Procedure Vitals'), ('vs1_rr', 'Post-Procedure Vitals'), ('vs1_temp', 'Post-Procedure Vitals'),
('vs2_bp', 'Post-Procedure Vitals'), ('vs2_pr', 'Post-Procedure Vitals'), ('vs2_rr', 'Post-Procedure Vitals'), ('vs2_temp', 'Post-Procedure Vitals'),
('vs3_bp', 'Post-Procedure Vitals'), ('vs3_pr', 'Post-Procedure Vitals'), ('vs3_rr', 'Post-Procedure Vitals'), ('vs3_temp', 'Post-Procedure Vitals'),
('vs4_bp', 'Post-Procedure Vitals'), ('vs4_pr', 'Post-Procedure Vitals'), ('vs4_rr', 'Post-Procedure Vitals'), ('vs4_temp', 'Post-Procedure Vitals'),

('post_procedure_counseling', 'Post Procedure'),
('complications', 'Post Procedure'),
('complication_details', 'Post Procedure'),
('discharge_note', 'Post Procedure'),
('referral_note', 'Post Procedure');
