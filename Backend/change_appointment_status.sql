-- ========================================
-- APPOINTMENT STATUS CHANGE
-- Change 'completed' to 'no_show'
-- ========================================

-- STEP 1: Backup first!
-- mysqldump -u root -p ferenje_clinic_hcms > backup_before_appointment_status_change.sql

-- STEP 2: Update the enum to change 'completed' to 'no_show'
ALTER TABLE `appointment` 
MODIFY COLUMN `status` ENUM('scheduled', 'no_show', 'cancelled') 
CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci 
DEFAULT 'scheduled';

-- STEP 3: Verify the change
DESCRIBE appointment;

-- STEP 4: Check existing appointments
SELECT appointment_id, status, COUNT(*) as count 
FROM appointment 
GROUP BY status;
