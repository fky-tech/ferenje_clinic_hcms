-- 1. Merge Systolic and Diastolic BP into one column 'BloodPressure'
-- First, add the new column
ALTER TABLE visitvitalsigns ADD COLUMN BloodPressure VARCHAR(20) AFTER VisitRecordID;

-- Populate the new column with existing data
UPDATE visitvitalsigns 
SET BloodPressure = CONCAT(SystolicBP, '/', DiastolicBP) 
WHERE SystolicBP IS NOT NULL AND DiastolicBP IS NOT NULL;

-- 2. Add OptionalNote column to lab_request table if it doesn't exist
ALTER TABLE lab_request ADD COLUMN OptionalNote TEXT;

-- 3. (Optional) If you want to replace the stored procedure or logic for Dashboard counts, 
-- ensure your backend code uses the correct date filters.
