import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from datetime import date
from django.utils import timezone
from users.models import User
from hospitals.models import Hospital
from doctors.models import Doctor
from patients.models import Patient
from medical_records.models import MedicalRecord

def seed():
    # 1. Hospital
    hospital = Hospital.objects.first()
    if not hospital:
        hospital = Hospital.objects.create(
            name="HealthLink Central Hospital",
            address="Bole Sub City, Addis Ababa, Ethiopia",
            phone="0116123456"
        )

    # 2. Doctor user & profile
    doc_user, _ = User.objects.get_or_create(
        username="dr_sarah",
        defaults={
            "first_name": "Sarah",
            "last_name": "Johnson",
            "email": "sarah.johnson@healthlink.com",
            "role": "hospital_staff",
        }
    )
    if not doc_user.has_usable_password():
        doc_user.set_password("doctor123")
        doc_user.save()

    doctor1, _ = Doctor.objects.get_or_create(
        user=doc_user,
        defaults={
            "hospital": hospital,
            "specialization": "Cardiology",
            "license_number": "MED-ET-8821",
            "years_of_experience": 8,
        }
    )

    doc_user2, _ = User.objects.get_or_create(
        username="dr_michael",
        defaults={
            "first_name": "Michael",
            "last_name": "Lee",
            "email": "michael.lee@healthlink.com",
            "role": "hospital_staff",
        }
    )
    if not doc_user2.has_usable_password():
        doc_user2.set_password("doctor123")
        doc_user2.save()

    doctor2, _ = Doctor.objects.get_or_create(
        user=doc_user2,
        defaults={
            "hospital": hospital,
            "specialization": "General Medicine",
            "license_number": "MED-ET-7734",
            "years_of_experience": 5,
        }
    )

    # 3. Patient user & profile (Dawit)
    dawit_user = User.objects.filter(username="dawit").first()
    if not dawit_user:
        dawit_user = User.objects.create_user(
            username="dawit",
            first_name="Dawit",
            last_name="Belayneh",
            email="dawit@gmail.com",
            password="password123",
            role="patient"
        )
    else:
        if not dawit_user.first_name:
            dawit_user.first_name = "Dawit"
        if not dawit_user.last_name:
            dawit_user.last_name = "Belayneh"
        if not dawit_user.email:
            dawit_user.email = "dawit@gmail.com"
        dawit_user.save()

    patient, _ = Patient.objects.get_or_create(
        user=dawit_user,
        defaults={
            "blood_type": "O+",
            "gender": "Male",
            "date_of_birth": date(2001, 5, 14),
            "phone_number": "+251 900 000 000",
            "address": "Addis Ababa, Ethiopia",
            "allergies": "Penicillin",
            "emergency_contact_name": "John Doe",
            "emergency_contact_phone": "+251 911 123 456",
            "emergency_contact_relationship": "Brother",
            "height": 178.00,
            "weight": 72.00,
        }
    )
    patient.blood_type = "O+"
    patient.gender = "Male"
    patient.date_of_birth = date(2001, 5, 14)
    patient.phone_number = "+251 900 000 000"
    patient.allergies = "Penicillin"
    patient.emergency_contact_name = "John Doe"
    patient.emergency_contact_phone = "+251 911 123 456"
    patient.emergency_contact_relationship = "Brother"
    patient.height = 178.00
    patient.weight = 72.00
    patient.save()

    # 4. Medical Records (Patient's healthcare story)
    if MedicalRecord.objects.filter(patient=patient).count() == 0:
        records_data = [
            {
                "patient": patient,
                "doctor": doctor1,
                "diagnosis": "Stage 1 Hypertension & Mild Fatigue",
                "treatment": "Lifestyle dietary adjustments, reduced sodium intake, and regular aerobic exercise.",
                "prescription": "Amlodipine 5mg - 1 Tablet daily every morning",
                "notes": "Blood pressure was 138/88 mmHg. Follow up in 3 months with home blood pressure logs.",
            },
            {
                "patient": patient,
                "doctor": doctor2,
                "diagnosis": "Acute Bronchial Allergy & Cough",
                "treatment": "Steam inhalation twice daily, avoided cold drinks and dust environments.",
                "prescription": "Cetirizine 10mg - 1 Tablet once at bedtime for 10 days",
                "notes": "Lungs clear on auscultation. Symptoms significantly improved.",
            },
            {
                "patient": patient,
                "doctor": doctor1,
                "diagnosis": "Routine Annual Health Examination",
                "treatment": "Complete blood count, lipid profile, and renal function tests ordered.",
                "prescription": "Vitamin D3 2000 IU - 1 Capsule daily with breakfast",
                "notes": "All vital signs within normal parameters. Patient in excellent condition.",
            },
            {
                "patient": patient,
                "doctor": doctor2,
                "diagnosis": "Mild Musculoskeletal Strain (Left Knee)",
                "treatment": "Rest, ice compression, and physical therapy exercises.",
                "prescription": "Ibuprofen 400mg - 1 Tablet as needed for pain with meals",
                "notes": "No joint effusion or ligament laxity detected. Advised light walking.",
            },
        ]

        for r_data in records_data:
            MedicalRecord.objects.create(**r_data)
        print(f"Created {len(records_data)} medical records for {dawit_user.username}.")
    else:
        print(f"Medical records already exist for {dawit_user.username}.")

    print("Seed completed successfully!")

if __name__ == "__main__":
    seed()
