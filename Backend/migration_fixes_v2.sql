-- Drop existing BP columns to clean up
ALTER TABLE visitvitalsigns DROP COLUMN BloodPressure;
ALTER TABLE visitvitalsigns DROP COLUMN SystolicBP;
ALTER TABLE visitvitalsigns DROP COLUMN DiastolicBP;

-- Add single BloodPressure column
ALTER TABLE visitvitalsigns ADD COLUMN BloodPressure VARCHAR(20);

-- Remove OptionalNote from lab_request
ALTER TABLE lab_request DROP COLUMN OptionalNote;

-- Add OptionalNote to labtestresult
ALTER TABLE labtestresult ADD COLUMN OptionalNote TEXT;
