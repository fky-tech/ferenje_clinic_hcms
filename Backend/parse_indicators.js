import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rawText = `page1
	S.No        			   Activity                                                                                       				 Number 
     ----------------   		----------------------------------------------------------------------------------------------------------------------------------------------
    RMH               			 Reproductive and Maternal Health                                                                          
    RMNCH             	 Reproductive, Maternal, Neonatal, Child, Adolescent and Youth Health-Nutrition                            
     RMH               		 Reproductive & Maternal Health                                                                            
        MAT_CAR          	  Contraceptive acceptance rate (CAR)                                                                       
        MAT_CAR_1         	 Total number of new and repeat acceptors by age                                                         
        MAT_CAR_Age.1      Contraceptive new acceptors by age                                                                        
        MAT_CAR_Age.1.1    10–14 years                                                                                               
        MAT_CAR_Age.1.2    15–19 years                                                                                                 
        MAT_CAR_Age.1.3    20–24 years                                                                                                
       MAT_CAR_Age.1.4    25–29 years                                                                                               
       MAT_CAR_Age.1.5    30–49 years                                                                                             
       MAT_CAR_Age.2      Contraceptive repeat acceptors by age                                                                     
       MAT_CAR_Age.2.1    10–14 years                                                                                               
       MAT_CAR_Age.2.2    15–19 years                                                                                           
       MAT_CAR_Age.2.3    20–24 years                                                                                                 
       MAT_CAR_Age.2.4    25–29 years                                                                                               
       MAT_CAR_Age.2.5    30–49 years                                                                                                
       MAT_CAR_Mtd        Total new and repeat acceptors, disaggregated by method                                                 
       MAT_CAR_Mtd.1      Contraceptive new acceptors by method                                                                     
       MAT_CAR_Mtd.1.1    Oral contraceptives                                                                                         
       MAT_CAR_Mtd.1.2    Injectables                                                                                                 
      MAT_CAR_Mtd.1.3    Implants                                                                                                    
       MAT_CAR_Mtd.1.4    IUCD                                                                                                        
       MAT_CAR_Mtd.1.5    Vasectomy                                                                                                   
       MAT_CAR_Mtd.1.6    Tubal ligation                                                                                              
       MAT_CAR_Mtd.1.7    Others                                                                                                     
       MAT_CAR_Mtd.1.8    Other contraceptive methods                                                                               
       MAT_CAR_Mtd.2      Contraceptive repeat acceptors by method                                                                
       MAT_CAR_Mtd.2.1    Oral contraceptives                                                                                        
       MAT_CAR_Mtd.2.2    Injectables                                                                                               
       MAT_CAR_Mtd.2.3    Implants                                                                                                     
       MAT_CAR_Mtd.2.4    IUCD                                                                                                         
      MAT_CAR_Mtd.2.5    Vasectomy                                                                                                   
       MAT_CAR_Mtd.2.6    Tubal ligation                                                                                               
       MAT_CAR_Mtd.2.7    Others                                                                                                       
       MAT_CAR_Mtd.2.8    Other contraceptive methods                                                                               
       MAT_IPPCAR         		Immediate Postpartum Contraceptive Acceptance rate (IPPCAR)                                               
       MAT_IPPCAR_Age     Total PPFP acceptors, disaggregated by age                                                                
       MAT_IPPCAR_Age.1   10–14 years                                                                                                  
       MAT_IPPCAR_Age.2   15–19 years                                                                                                  
       MAT_IPPCAR_Age.3   20–24 years                                                                                                  
       MAT_IPPCAR_Age.4   25–29 years                                                                                                  
       MAT_IPPCAR_Age.5   30–49 years                                                                                                  
       MAT_IPPCAR_Mtd     Total PPFP acceptors, disaggregated by method                                                             
       MAT_IPPCAR_Mtd.1   Pills (POP)                                                                                                  
       MAT_IPPCAR_Mtd.2   Implants                                                                                                     
       MAT_IPPCAR_Mtd.3   IUCD                                                                                                         
       MAT_IPPCAR_Mtd.4   Tubal ligation                                                                                               
       MAT_IPPCAR_Mtd.5   Others                                                                                                     
       MAT_LAFPR          		Premature Removal of Long term family planning methods (PRLAFP)                                           
       MAT_LAFPR.1       	 Total number of premature removal of LAFP within 6 month insertion                                          
       MAT_LAFPR.1.1      	Implants                                                                                                     
       MAT_LAFPR.1.2      IUCD                                                                                                         
       MAT_LAFPR.1.3      Others                                                                                                      
       MAT_TLAFPR         Total LAFP removal in the reporting period                                                                  
       MAT_ANC1           Antenatal care (ANC) coverage – First Contact                                                             
       MAT_ANC1_GA        Total number of pregnant women that received antenatal care – First contact by gestational Age            
       MAT_ANC1_GA.1.1    ≤ 12 weeks                                                                                                 
       MAT_ANC1_GA.1.2    >12 and ≤16 weeks                                                                                         
       MAT_ANC1_GA.1.3    >16 weeks 
                                 page2


  S.No,									Description,Value
MAT_ANC1_MA.1,           		Number of pregnant women that received antenatal care - First contact by maternal age,
MAT_ANC1_MA.1. 1,						10 - 14 years,0
MAT_ANC1_MA.1. 2,						15 - 19 years,0
MAT_ANC1_MA.1. 3,						>= 20 years,0
MAT_ANC1_MA.1. 4,						>= 20 Years,0
MAT_ANC4+,				Antenatal care (ANC) coverage - four contacts,
MAT_ANC4+_MA.1,			Total number of pregnant women that received four or more antenatal care contacts by Maternal Age,
MAT_ANC4+_MA.1. 1,						10 - 14 years,0
MAT_ANC4+_MA.1. 2,						15 - 19 years,0
MAT_ANC4+_MA.1. 3,						>= 20 years,0
MAT_ANC4+_MA.1. 4,						>= 20 Years,0
MAT_ANC4+_GA.1,			Total number of pregnant women that received four or more antenatal care contacts by gestational age,
MAT_ANC4+_GA.1. 1,						< 30 weeks,0
MAT_ANC4+_GA.1. 2,						>= 30 weeks,0
MAT_ANC8+,				Antenatal Care (ANC) coverage - Eight or more contact,0
MAT_ANC8+,				Number of pregnant women that received antenatal care -8 Contacts and more,0
MAT_SYPH.RX.1,				Proportion pregnant women tested for syphilis,0
MAT_SYPH.1,				Total Number of pregnant women tested for syphilis,0
MAT_SYPH.1. 1,				Reactive,0
MAT_SYPH.1. 2,Non-Reactive,0
MAT_SYPH.RX.1.,Total Number of pregnant women treated for syphilis,0
MAT_Hepa,Total Number of Pregnant women attending antenatal care tested for hepatitis B,0
MAT_Hepa. 1,Reactive,0
MAT_Hepa. 2,Non-Reactive,0
MAT_Prp.1.,Total Number of pregnant women who were received prophylaxis for HBV,0
RMH_L&D_SBA,Births attended by skilled health personnel,0
MAT_SBA,Skilled delivery attendance,0
L&D_SBA.1.,Number of births attended by skilled health personnel,0
MAT_PPH,Percentage of women who developed Postpartum hemorrhage (PPH),0
MAT_PPH.1,Total number of women who developed postpartum hemorrhage (PPH),0
MAT_PPH.1. 1,Home delivery,0
MAT_PPH.1. 2,Facility delivery,0
MAT_UTER,Percentage women who received uterotonics in the first one minute after delivery,0
MAT_UTER,Percentage women who received uterotonics in the first one minute after delivery L,0
MAT_UTER.1,Total number of women who received uterotonics in the first one minute after delivery,0
MAT_UTER.1. 1,oxytocin,0
MAT_UTER.1. 2,mesoprostol,0
MAT_UTER.1. 3,ergometrin,0
MAT_UTER.1. 4,Other uterotonics,0
MAT_SBR,Still birth rate,0
MAT_SBR.SB.,Number of still births,0
MAT_SBR.LB.,Number of Live births,0
B&D_Ntfc,Birth and death notifications,0
MAT_B&D,Birth and Death Notification,8
MAT_B&D_IBN.1.,Number of Institutional birth notifications given,0
MAT_B&D_IDN.2.,Number of Institutional death notifications given,0
MAT_EPNC,Early Postnatal Care Coverage,0
MAT_EPNC.1,Number of postnatal visits within 7 days of delivery,0
MAT_EPNC.1,Number of postnatal visits within 7 days of delivery,0
MAT_EPNC.1. 1,Number of neonatal deaths in the first 24 hrs of life,0
MAT_EPNC.1. 2,25 - 48 hrs (1 - 2 days),0
MAT_EPNC.1. 3,49 - 72 hrs (2 - 3 days),0
MAT_EPNC.1. 4,73 hrs - 7 days (4 - 7 days),0
MAT_EPNC.1. 6,24Hrs (1day),0
MAT_CS,Caesarean section (C/S) rate,0
MAT_CS.1.,Number of women having given birth by caesarean section,0
MAT_CAC,Number of women receiving comprehensive abortion care services dis aggregated by maternal age,
MAT_CAC_SAC,Number of safe abortions performed,
MAT_CAC_SAC. 1,10 - 14 years,0
MAT_CAC_SAC. 2,15 - 19 years,0          

		page3
  S.No,Description,Value
MAT_CAC_SAC. 3,20 - 24 years,0
MAT_CAC_SAC. 4,25 - 29 years,0
MAT_CAC_SAC. 5,>= 30 years,0
MAT_CAC_PAC,Number of post abortion/emergency care,0
MAT_CAC_PAC. 1,10 - 14 years,0
MAT_CAC_PAC. 2,15 - 19 years,0
MAT_CAC_PAC. 3,20 - 24 years,0
MAT_CAC_PAC. 4,25 - 29 years,0
MAT_CAC_PAC. 5,>= 30 years,0
MAT_CAC.Tr.1,Number of women receiving comprehensive abortion care disaggregated by trimester,0
MAT_CAC.Tr.1. 1,1st trimester (<12 weeks),0
MAT_CAC.Tr.1. 2,2nd trimester (>=12 - 28 weeks),0
,,
MAT_CAC.MA.1,Number of women receiving post abortion care family planning methods disaggregated by Methods,
MAT_CAC.MA.1. 1,Oral contraceptives,0
MAT_CAC.MA.1. 2,Injectables,0
MAT_CAC.MA.1. 3,Implants,0
MAT_CAC.MA.1. 4,IUCD,0
MAT_CAC.MA.1. 5,Vasectomy,0
MAT_CAC.MA.1. 6,Tubal ligation,0
MAT_CAC.MA.1. 7,Others,0
MAT_CAC.MA.1. 8,Other contraceptive methods,0
MAT_OFC_Ide_Age,Number of obstetric fistula cases identified by Age,0
MAT_OFC_Ide_Age. 1,10 - 14 years,0
MAT_OFC_Ide_Age. 2,15 - 19 years,0
MAT_OFC_Ide_Age. 3,20 - 24 years,0
MAT_OFC_Ide_Age. 4,25 - 29 years,0
MAT_OFC_Ide_Age. 5,>= 30 years,0
MAT_OFC_Treat_Age,Number of obstetric fistula cases treated by Age,0
MAT_OFC_Treat_Age. 1,10 - 14 years,0
MAT_OFC_Treat_Age. 2,15 - 19 years,0
MAT_OFC_Treat_Age. 3,20 - 24 years,0
MAT_OFC_Treat_Age. 4,25 - 29 years,0
MAT_OFC_Treat_Age. 5,>= 30 years,0
MAT_IMD.1.,Number of maternal deaths in health facility,0
MAT_TngP_TPR,Total number of teenage girls tested positive for pregnancy,6
MAT_TngP_TPR. 1,10 - 14 years,0
MAT_TngP_TPR. 2,15 - 19 years,6
MAT_Tngtst.,Total number of women tested positive pregnancy,58
CH,Child Health,
CH_IND.1,Institutional neonatal death,0
CH_IND.1,Number of neonatal deaths in the first 24 hrs of life,0
CH_IND.2,Number of neonatal deaths between 1 -7 days of life,0
CH_IND.3,Number of neonatal deaths between 7 -28 days of life,0
CH_TX_PNEU,Under-five children with pneumonia received antibiotic treatment,7
CH_TX_PNEU.1.,Number of under 5 children treated for pneumonia,7
CH_TX_SYI.1,Number of sick young infants 0-2 months treated for Critical Illness,6
CH_TX_SYI.1. 1,Treated for Very Severe Diseases,0
CH_TX_SYI.1. 2,Treated for Local bacterial infection ( LBI),0
CH_TX_SYI.1. 3,Treated for Pneumonia,7
CH_TX_DIAR,Children treated with Zinc and ORS for diarrhea,7
CH_TX_DIAR.1.,Treated by ORS and zinc,7
CH_TX_DIAR.2.,Treated by ORS only,6
CH_KMC,Low birth weight or premature newborns for whom KMC was initiated after delivery,0
CH_KMC.1.,Total number of newborns weighing <2000gm and/or premature newborns for which KMC initiated,0
CH_KMC.2.,Total number of newborns weighing <2000gm and/or premature,0
CH_ASPH,Asphyxiated neonates who were resuscitated (with bag & mask) and survived,0
CH_ASPH.1.,Number of neonates resuscitated and survived,0
CH_ASPH.2.,Total number of neonates resuscitated,0
,Is the facility Hospital? Yes/No,0
CH_TX_NICU,Treatment outcome of neonates admitted to NICU,0
CH_TX_NICUA.,Total neonates admitted to NICU,0
CH_TX_NICUD.,Total neonates discharged from NICU,0

page4

  S.No,Description,Value
CH_TX_NICU.Rec.1.,Recovered,0
CH_TX_NICU.Dead.1.,Dead,0
CH_TX_NICU.TO.1.,Transferred,0
CH_TX_NICU.Oth.1.,"Others (Absconded, Left against medical advice...)",0
CH_CHX,Newborns that received at least one dose of CHX to the cord on the first day after birth,0
CH_CHX.1.,Number of Newborns that received at least one dose of CHX to the cord on the first day after birth,0
CH_CHDM,Children aged 0 to 59 months Assessed for developmental milestone,0
CH_CHDM. 1,0 to 24 months,0
CH_CHDM. 2,24 to 59 months,0
CH_CHDMS,Children aged 0 to 59 months Assessed for developmental milestone and there status,0
CH_CHDMS. 1,Suspected Developmental Delay,0
CH_CHDMS. 2,Developmental Delay,0
CH_CHDMS. 3,No Developmental Delay,0
MAL,Malaria Prevention and Control,
MAL_DX.1,Total number of slides or RDT performed for malaria diagnosis,28
MAL_DX.1. 1,"< 5 years, Male",3
MAL_DX.1. 2,"< 5 years, Female",2
MAL_DX.1. 3,"5 - 14 years, Male",5
MAL_DX.1. 4,"5 - 14 years, Female",7
MAL_DX.1. 5,">= 15 years, Male",6
MAL_DX.1. 6,">= 15 years, Female",5
MAL_POS.1,Total number of slides or RDT Positive,8
MAL_POS.1. 1,"< 5 years, Male",0
MAL_POS.1. 2,"< 5 years, Female",0
MAL_POS.1. 3,"5 - 14 years, Male",2
MAL_POS.1. 4,"5 - 14 years, Female",0
MAL_POS.1. 5,">= 15 years, Male",4
MAL_POS.1. 6,">= 15 years, Female",2
MAL_Travel.,Malaria with Travel History,0
,Is the woreda elimination district?,
MAL_Noti.,Case notified to PHCU for further investigation (Elimination Districts),
MAL_FULL.1.,Number of index cases investigated and classified (Elimination Districts),
MAL_FULL.2.,Number of secondary cases during investigation (Elimination Districts),
MAL_FOCI.1.,Number of foci investigated and classified (Elimination Districts),
,Does the facility provide leishmaniasis treatment?,
,Number of visceral leishmaniasis (VL) cases treated,
NTD_VL.1,Number of visceral leishmaniasis patients treated by age and sex,0
NTD_VL.1. 1,"< 5 years, Male",0
NTD_VL.1. 2,"< 5 years, Female",0
NTD_VL.1. 3,"5 - 14 years, Male",0
NTD_VL.1. 4,"5 - 14 years, Female",0
NTD_VL.1. 5,">= 15 years, Male",0
NTD_VL.1. 6,">= 15 years, Female",0
NTD_VL.2,Number of visceral leishmaniasis patients treated by treatment type,0
NTD_VL.2. 1,Primary visceral leishmaniasis,0
NTD_VL.2. 2,Relapse visceral leishmaniasis,0
NTD_VL.2. 3,Post Kala-azar dermal leishmaniasis (PKDL),0
NTD_VL.3,Number of visceral leishmaniasis patients treated by treatment outcome,0
NTD_VL.3. 1,Cured,0
NTD_VL.3. 2,Defaulted,0
NTD_VL.3. 3,Treatment failure,0
NTD_VL.3. 4,Deaths,0
NTD_VL.3. 5,Transferred out,0
NTD_VL.4,Number of visceral leishmaniasis patients treated by HIV test result status,0
NTD_VL.4. 1,Positive,0
NTD_VL.4. 2,Negative,0
NTD_CL.1,Number of cutaneous Leishmaniasis (CL) cases treated,0
NTD_CL.1. 1,"< 5 years, Male",0
NTD_CL.1. 2,"< 5 years, Female",0
NTD_CL.1. 3,"5 - 14 years, Male",0


page 5


  S.No,Description,Value
NTD_CL.1. 4,"5 - 14 years, Female",0
NTD_CL.1. 5,">= 15 years, Male",0
NTD_CL.1. 6,">= 15 years, Female",0
NTD_CL.2,Number of cutaneous leishmaniasis patients treated by type,0
NTD_CL.2. 1,Primary cutaneous leishmaniasis,0
NTD_CL.2. 2,Relapse cutaneous leishmaniasis,0
NTD_CL.3,Number of cutaneous leishmaniasis patients treated by treatment outcome,0
NTD_CL.3. 1,Cured,0
NTD_CL.3. 2,Defaulted,0
NTD_CL.3. 3,Treatment failure,0
NTD_CL.3. 4,Deaths,0
NTD_CL.3. 5,Transferred out,0
NTD_TT.1,Number of people with TT who received corrective TT surgery,0
NTD_TT.1. 1,"< 15 years, Male",0
NTD_TT.1. 2,"< 15 years, Female",0
NTD_TT.1. 3,">= 15 years, Male",0
NTD_TT.1. 4,">= 15 years, Female",0
NTD_HYD,Number of hydrocele cases operated (due to lymphatic filariasis),0
NTD_HYD. 1,"< 15 years, Male",0
NTD_HYD. 2,">= 15 years, Male",0
NTD_POD,Number of lymph edema cases managed (podoconosis and lymphatic filariasis),0
NTD_POD. 1,"< 15 years, Male",0
NTD_POD. 2,"< 15 years, Female",0
NTD_POD. 3,">= 15 years, Male",0
NTD_POD. 4,">= 15 years, Female",0
NCD_HTN,Hypertension,
NCD_HTNDX.1,Number of Individuals screened for hypertension,0
NCD_HTNDX.1. 1,"18 - 29 years, Male",0
NCD_HTNDX.1. 2,"18 - 29 years, Female",0
NCD_HTNDX.1. 3,"30 - 39 years, Male",0
NCD_HTNDX.1. 4,"30 - 39 years, Female",0
NCD_HTNDX.1. 5,"40 - 69 years, Male",0
NCD_HTNDX.1. 6,"40 - 69 years, Female",0
NCD_HTNDX.1. 7,">= 70 years, Male",0
NCD_HTNDX.1. 8,">= 70 years, Female",0
NCD_HTNDX.1.2,Number of Individuals screened for hypertension by result of screening,0
NCD_HTNDX.1.2. 1,Raised BP,0
NCD_HTNDX.1.2. 2,Normal BP,0
NCD_HTNDX.2,Hypertensive patients enrolled to care by Type of Treatment,0
NCD_HTNDX.2. 1,Healthy life style counciling (HLC) only,0
NCD_HTNDX.2. 2,Pharmacological management and HLC,0
NCD_HTNDX.2.2,Hypertensive patients enrolled to care by age and sex,0
NCD_HTNDX.2.2. 1,"18 - 29 years, Male",0
NCD_HTNDX.2.2. 2,"18 - 29 years, Female",0
NCD_HTNDX.2.2. 3,"30 - 39 years, Male",0
NCD_HTNDX.2.2. 4,"30 - 39 years, Female",0
NCD_HTNDX.2.2. 5,"40 - 69 years, Male",0
NCD_HTNDX.2.2. 6,"40 - 69 years, Female",0
NCD_HTNDX.2.2. 7,">= 70 years, Male",0
NCD_HTNDX.2.2. 8,">= 70 years, Female",0
NCD_HTNDX.2.3,Hypertensive patients by timing of enrollment,0
NCD_HTNDX.2.3. 1,Newly enrolled to care,0
NCD_HTNDX.2.3. 2,Previously in care,0
NCD_HTNTX.0.,Total number of cohort hypertensive patients enrolled to care six month prior to the reporting month,0
NCD_HTNTX,Six-monthly control of blood pressure among people treated for hypertension,0
NCD_HTNTX.1,Treatment outcome for cohort of patient registered for hypertension treatment six months prior to the reporting period:,0
NCD_HTNTX.1. 1,Controlled,0
NCD_HTNTX.1. 2,Uncontrolled,0
NCD_HTNTX.1. 3,Lost to follow-up,0
NCD_HTNTX.1. 4,Died,0
NCD_HTNTX.1. 5,Transferred out,0
NCD_HTNTX.1. 6,Not evaluated,0



page 6


  S.No,Description,Value
NCD_CVD.1,Cardio vascular disease,
NCD_CVD.1,Number of individuals in high CVD risk by type of risk category :,0
NCD_CVD.1. 1,Lab based risk category (>=20%),0
NCD_CVD.1. 2,Non-Lab based category (>=10%),0
NCD_CVD.2,Number of individuals in high CVD risk by Age Category:,0
NCD_CVD.2. 1,"40 - 59 Years, Male",0
NCD_CVD.2. 2,"40 - 59 Years, Female",0
NCD_CVD.2. 3,"60 - 74 Years, Male",0
NCD_CVD.2. 4,"60 - 74 Years, Female",0
NCD_CVD.3,Number of patients with high CVD risk who received treatment by type of treatment:,0
NCD_CVD.3. 1,With Statin,0
NCD_CVD.3. 2,Without Statin,0
NCD_CVD.4,Patients with high CVD risk who received treatment by Age Category:,0
NCD_CVD.4. 1,"40 - 59 Years, Male",0
NCD_CVD.4. 2,"40 - 59 Years, Female",0
NCD_CVD.4. 3,"60 - 74 Years, Male",0
NCD_CVD.4. 4,"60 - 74 Years, Female",0
DM,Diabetes mellitus,
NCD_DMDX.1.1,Number of Individuals screened for Diabetes Mellitus by result of screening,0
NCD_DMDX.1.1. 1,Raised blood sugar,0
NCD_DMDX.1.1. 2,Normal blood sugar,0
NCD_DMDX.1.2,Individuals screened for Diabetes Mellitus by age and sex,0
NCD_DMDX.1.2. 1,"< 40 years, Male",0
NCD_DMDX.1.2. 2,"< 40 years, Female",0
NCD_DMDX.1.2. 3,">= 40 years, Male",0
NCD_DMDX.1.2. 4,">= 40 years, Female",0
NCD_DMDX.2,Diabetic patients enrolled to care by types of Diabete,0
NCD_DMDX.2. 1,Type I,0
NCD_DMDX.2. 2,Type II,0
NCD_DMDX.2. 3,Gestational DM,0
NCD_DMDX.2.2,Diabetic patients enrolled to care by type of treatment,0
NCD_DMDX.2.2. 1,Healthy life style counciling (HLC) only,0
NCD_DMDX.2.2. 2,Pharmacological management and HLC,0
NCD_DMDX.2.3,Diabetic patients enrolled to care by age and sex,0
NCD_DMDX.2.3. 1,"< 15 years, Male",0
NCD_DMDX.2.3. 2,"< 15 years, Female",0
NCD_DMDX.2.3. 3,"15 - 29 years, Male",0
NCD_DMDX.2.3. 4,"15 - 29 years, Female",0
NCD_DMDX.2.3. 5,"30 - 39 years, Male",0
NCD_DMDX.2.3. 6,"30 - 39 years, Female",0
NCD_DMDX.2.3. 7,">= 40 years, Male",0
NCD_DMDX.2.3. 8,">= 40 years, Female",0
NCD_DMDX.2.4,Diabetic patients by Timing of enrollment,0
NCD_DMDX.2.4. 1,Newly enrolled to care,0
NCD_DMDX.2.4. 2,Previously in care,0
NCD_DMTX.0.,Total number of cohort of hypertensive pateints registered for diabetes treatment six months prior to the reporting period,0
NCD_DMTX,Six-monthly control of diabetes among individuals treated for diabetes,0
NCD_DMTX.1,Treatment outcome for cohort of patient registered for diabetes treatment six months prior to the reporting period,0
NCD_DMTX.1. 1,Controlled,0
NCD_DMTX.1. 2,Uncontrolled,0
NCD_DMTX.1. 3,Lost to follow-up,0
NCD_DMTX.1. 4,Died,0
NCD_DMTX.1. 5,Transferred out,0
NCD_DMTX.1. 6,Not evaluated,0
NCD_CV_SCRN.1,Women age 30-49 years who have been screened for cervical Ca by screening type,0
NCD_CV_SCRN.1. 1,Screened by VIA,0
NCD_CV_SCRN.1. 2,Screened by HPV DNA,0
NCD_CV_SCRN.1.2.1,Women age 30-49 years who have been screened for cervical Ca VIA screening result,0
NCD_CV_SCRN.1.2.1. 1,Negative,0
NCD_CV_SCRN.1.2.1. 2,Positive: Eligible for Cryotherapy/ thermocoagulation,0
NCD_CV_SCRN.1.2.1. 3,Positive: Not iligible for Cryotherapy/ thermocoagulation,0

page 7


  S.No,Description,Value
NCD_CVD.1,Cardio vascular disease,
NCD_CVD.1,Number of individuals in high CVD risk by type of risk category :,0
NCD_CVD.1. 1,Lab based risk category (>=20%),0
NCD_CVD.1. 2,Non-Lab based category (>=10%),0
NCD_CVD.2,Number of individuals in high CVD risk by Age Category:,0
NCD_CVD.2. 1,"40 - 59 Years, Male",0
NCD_CVD.2. 2,"40 - 59 Years, Female",0
NCD_CVD.2. 3,"60 - 74 Years, Male",0
NCD_CVD.2. 4,"60 - 74 Years, Female",0
NCD_CVD.3,Number of patients with high CVD risk who received treatment by type of treatment:,0
NCD_CVD.3. 1,With Statin,0
NCD_CVD.3. 2,Without Statin,0
NCD_CVD.4,Patients with high CVD risk who received treatment by Age Category:,0
NCD_CVD.4. 1,"40 - 59 Years, Male",0
NCD_CVD.4. 2,"40 - 59 Years, Female",0
NCD_CVD.4. 3,"60 - 74 Years, Male",0
NCD_CVD.4. 4,"60 - 74 Years, Female",0
DM,Diabetes mellitus,
NCD_DMDX.1.1,Number of Individuals screened for Diabetes Mellitus by result of screening,0
NCD_DMDX.1.1. 1,Raised blood sugar,0
NCD_DMDX.1.1. 2,Normal blood sugar,0
NCD_DMDX.1.2,Individuals screened for Diabetes Mellitus by age and sex,0
NCD_DMDX.1.2. 1,"< 40 years, Male",0
NCD_DMDX.1.2. 2,"< 40 years, Female",0
NCD_DMDX.1.2. 3,">= 40 years, Male",0
NCD_DMDX.1.2. 4,">= 40 years, Female",0
NCD_DMDX.2,Diabetic patients enrolled to care by types of Diabete,0
NCD_DMDX.2. 1,Type I,0
NCD_DMDX.2. 2,Type II,0
NCD_DMDX.2. 3,Gestational DM,0
NCD_DMDX.2.2,Diabetic patients enrolled to care by type of treatment,0
NCD_DMDX.2.2. 1,Healthy life style counciling (HLC) only,0
NCD_DMDX.2.2. 2,Pharmacological management and HLC,0
NCD_DMDX.2.3,Diabetic patients enrolled to care by age and sex,0
NCD_DMDX.2.3. 1,"< 15 years, Male",0
NCD_DMDX.2.3. 2,"< 15 years, Female",0
NCD_DMDX.2.3. 3,"15 - 29 years, Male",0
NCD_DMDX.2.3. 4,"15 - 29 years, Female",0
NCD_DMDX.2.3. 5,"30 - 39 years, Male",0
NCD_DMDX.2.3. 6,"30 - 39 years, Female",0
NCD_DMDX.2.3. 7,">= 40 years, Male",0
NCD_DMDX.2.3. 8,">= 40 years, Female",0
NCD_DMDX.2.4,Diabetic patients by Timing of enrollment,0
NCD_DMDX.2.4. 1,Newly enrolled to care,0
NCD_DMDX.2.4. 2,Previously in care,0
NCD_DMTX.0.,Total number of cohort of hypertensive pateints registered for diabetes treatment six months prior to the reporting period,0
NCD_DMTX,Six-monthly control of diabetes among individuals treated for diabetes,0
NCD_DMTX.1,Treatment outcome for cohort of patient registered for diabetes treatment six months prior to the reporting period,0
NCD_DMTX.1. 1,Controlled,0
NCD_DMTX.1. 2,Uncontrolled,0
NCD_DMTX.1. 3,Lost to follow-up,0
NCD_DMTX.1. 4,Died,0
NCD_DMTX.1. 5,Transferred out,0
NCD_DMTX.1. 6,Not evaluated,0
NCD_CV_SCRN.1,Women age 30-49 years who have been screened for cervical Ca by screening type,0
NCD_CV_SCRN.1. 1,Screened by VIA,0
NCD_CV_SCRN.1. 2,Screened by HPV DNA,0
NCD_CV_SCRN.1.2.1,Women age 30-49 years who have been screened for cervical Ca VIA screening result,0
NCD_CV_SCRN.1.2.1. 1,Negative,0
NCD_CV_SCRN.1.2.1. 2,Positive: Eligible for Cryotherapy/ thermocoagulation,0
NCD_CV_SCRN.1.2.1. 3,Positive: Not iligible for Cryotherapy/ thermocoagulation,0

page 8




  S.No,Description,Value
MS_EMERG_MR.1. 2,"< 15 years, < 24 hours, Female",0
MS_EMERG_MR.1. 3,"< 15 years, >= 24 hours, Male",0
MS_EMERG_MR.1. 4,"< 15 years, >= 24 hours, Female",0
MS_EMERG_MR.1. 5,">= 15 years, < 24 hours, Male",0
MS_EMERG_MR.1. 6,">= 15 years, < 24 hours, Female",0
MS_EMERG_MR.1. 7,">= 15 years, >= 24 hours, Male",0
MS_EMERG_MR.1. 8,">= 15 years, >= 24 hours, Female",0
MS_NumEMERGT.,Total number of emergency unit attendance during the reporting period,0
MS_EMERG24,Emergency attendance with more than 24 hours stay,0
MS_EMERG24.,Emergency attendance with more than 24 hours stay,0
MS_EMERG_DIS.,Total number of emergency room discharges,0
MS_VAP,Percentage of ventilator associated pneumonia,0
MS_VAP.1.,Total number of clients developed ventilator associated pneumonia at ICU,0
MS_VAP.2.,Number of clients with Mechanical Ventilation,0
,Admission rate,0
MS_IPD_AR.1.,Number of inpatient admissions,0
,Inpatient mortality,0
MS_IPIMR.1,Total number of inpatient death in the reporting period,0
MS_IPIMR.1. 1,< 24 hours,0
MS_IPIMR.1. 2,>= 24 hours,0
,Proportion of blood units utilized from blood bank service,0
JBDR.1.,Total units of blood received from NBTS & regional blood banks,0
MS_UBDT.1,Total number of units of blood transfused,0
MS_UBDT.1. 1,direct family replacement,0
MS_UBDT.1. 2,from blood bank,0
,Serious adverse transfusion incidents and reactions,0
MS_SATIR.1.,Number of serious adverse transfusion incidents and reactions occurred,0
MS_RTI,Road traffic injuries,
MS_RTI.1,Number of road traffic injury cases dis aggregated by accident type,0
MS_RTI.1. 1,Vehicle occupant,0
MS_RTI.1. 2,Motor cyclist,0
MS_RTI.1. 3,Pedestrian,0
MS_RTI.1. 4,Others,0
PMS,Improve access to pharmaceuticals & medical devices & their rational & proper use,
,Tracer drug availability,
PMS_AVAIL.1.1.,Medroxyprogesterone Injection,c
PMS_AVAIL.1.2.,Pentavalent vaccine,0 / c
PMS_AVAIL.1.3.,Magnesium Sulphate injection,c
PMS_AVAIL.1.4.,Oxytocine inj,c
PMS_AVAIL.1.5.,Gentamycin injection,c
AVAIL.1.6.,ORS + Zinc sulphate,c
PMS_AVAIL.1.7.,Amoxcillin dispersable/suspension/capsule,c
PMS_AVAIL.1.8.,Iron + folic acid,c
PMS_AVAIL.1.9.,Albendazole/Mebendazole tablet/suspension,c
PMS_AVAIL.1.10.,TTC eye ointment,c
PMS_AVAIL.1.11.,RHZE/RH,c
PMS_AVAIL.1.12.,TDF/3TC/DTG,c
PMS_AVAIL.1.13.,Co-trimoxazole 240mg/5ml suspension,c
PMS_AVAIL.1.14.,Arthmeter + Lumfanthrine tablet,c
PMS_AVAIL.1.15.,Amlodipine tablet,c
PMS_AVAIL.1.16.,Frusamide tablets,c
PMS_AVAIL.1.17.,Metformin tablet,c
PMS_AVAIL.1.18.,Normal Saline 0.9%,c
PMS_AVAIL.1.19.,40% glucose,c
PMS_AVAIL.1.20.,Adrenaline injection,c
PMS_AVAIL.1.21.,Tetanus Anti Toxin (TAT) injection,c
PMS_AVAIL.1.22.,Omeprazole capsule,c
PMS_AVAIL.1.23.,Metronidazole capsule,c
PMS_AVAIL.1.24.,Ciprofloxcaxillin tablet,c
PMS_AVAIL.1.25.,Hydralizine injection,c
,Percentage of encounters with an antibiotic prescribed,0
PMS_ABIOTIC.1.,Number of encounter with one or more antibiotics,0



page 9

  S.No,Description,Value
PMS_ABIOTIC.2.,Total number of encounters,321
,Clients with 100% prescribed drugs filled,.
PMS_FILL100.1.,Number of clients who received 100% of prescribed drugs,0
PMS_FILL100.2.,Total number of clients who received prescriptions,0
PMS_FSML,Percentage of medicines prescribed from the facility's medicines list,0
PMS_MPFML_Num.,Total number of medicines prescribed from Health facility medicine list,0
PMS_MP_Num.,Total number of medicine prescribed,0
EBDM,Evidence based decision making,0
,Proportion of health facilities that conduct reporting consistency check using LQAS,0
DQ_DA1.,Did the HF conduct LQAS for service report?,0
DQ_DA.1.1.,LQAS first score for service report,0
DQ_DA.1.2.,LQAS last score for service report,0
DQ_DA2.,Did the HF conduct LQAS for OPD report?,0
DQ_DA.2.1.,LQAS first score for OPD report,0
DQ_DA.2.2.,LQAS last score for OPD report,0
DQ_DA3.,Did the HF conduct LQAS for IPD report?,0
DQ_DA.3.1.,LQAS first score for IPD report,0
DQ_DA.3.1.,LQAS last score for IPD report,0
LG,Strengthen Governance and Leadership,
LG_GBV,Number of Gender based violence (GBV) survivors (Physical and sexual) who received health care services,
LG_GBV. 1,"Physical, < 18 years, Male",0
LG_GBV. 2,"Physical, < 18 years, Female",0
LG_GBV. 3,"Physical, >= 18 years, Male",0
LG_GBV. 4,"Physical, >= 18 years, Female",0
LG_GBV. 5,"Sexual violence, < 18 years, Male",0
LG_GBV. 6,"Sexual violence, < 18 years, Female",0
LG_GBV. 7,"Sexual violence, >= 18 years, Male",0
LG_GBV. 8,"Sexual violence, >= 18 years, Female",0
LG_GBV. 9,"Psychological, < 18 years, Male",0
LG_GBV. 10,"Psychological, < 18 years, Female",0
LG_GBV. 11,"Psychological, >= 18 years, Male",0
LG_GBV. 12,"Psychological, >= 18 years, Female",0
LG_GBV. 13,"Mixed, < 18 years, Male",0
LG_GBV. 14,"Mixed, < 18 years, Female",0
LG_GBV. 15,"Mixed, >= 18 years, Male",0
LG_GBV. 16,"Mixed, >= 18 years, Female",0
`;

function parseTextToJSON(text) {
    const lines = text.split('\n');
    let page = 1;
    const indicators = [];
    let currentCategory = '';

    const linesToSkip = ['S.No', 'Description', 'Value', '----------------', 'Activity', 'Number'];

    for (let line of lines) {
        line = line.trim();
        if (!line) continue;

        if (line.toLowerCase().startsWith('page')) {
            const pObj = line.match(/page\s*(\d+)/i);
            if (pObj) page = parseInt(pObj[1]);
            continue;
        }

        // Logic to skip table headers
        let skip = false;
        for (const s of linesToSkip) {
            if (line.includes(s) && line.length < 50) { // Rough heuristic
                skip = true;
                break;
            }
        }
        if (skip) continue;

        // Try to parse CSV-like lines: Code, Description, Value
        // Note: the input is messy. Some are whitespace separated, some comma.
        // We look for the "Code" which is usually uppercased, starts with chars, has dots/underscores.

        // Regex for code: starts with chars, may contain _, ., numbers.
        // Example: MAT_ANC1_MA.1. 1
        // But some lines are just descriptions.

        let parts = line.split(/,\s*/);
        if (parts.length < 2) {
            // Try splitting by multiple spaces
            parts = line.split(/\s{2,}/);
        }

        // Refined extraction logic
        let code = parts[0] ? parts[0].trim() : '';
        let description = parts[1] ? parts[1].trim() : '';

        // Sometimes description is first if code is missing? No, user format is specific.
        // If the first part looks like a code
        const isCode = /^[A-Z0-9&_.]+$/.test(code) && code.length > 2;

        if (isCode) {
            // Check if it's a category header (usually no dots, just short chars like RMH)
            if (!code.includes('_') && !code.includes('.') && code.length < 10) {
                currentCategory = description || code;
            }

            // Clean description (remove quotes)
            if (description.startsWith('"') && description.endsWith('"')) {
                description = description.slice(1, -1);
            }

            indicators.push({
                code: code,
                description: description || 'No Description',
                category: currentCategory,
                page: page
            });
        }
    }
    return indicators;
}

const parsed = parseTextToJSON(rawText);
console.log(`Parsed ${parsed.length} indicators.`);
fs.writeFileSync(path.join(__dirname, 'seeds/indicators.json'), JSON.stringify(parsed, null, 2));
