import os
import django
from datetime import date, timedelta

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from users.models import User
from hospitals.models import Hospital
from doctors.models import Doctor
from patients.models import Patient, Appointment, VitalSign, Notification, Prescription
from medical_records.models import MedicalRecord

def seed_all_patients():
    print("Beginning comprehensive real patient data seeding...")

    # 1. Ensure primary hospital exists
    hospital, _ = Hospital.objects.get_or_create(
        name="HealthLink Central Hospital",
        defaults={
            "address": "Bole Sub City, Ring Road, Addis Ababa",
            "phone": "+251115517000"
        }
    )

    # 2. Ensure primary doctors exist
    doc_sarah_user, _ = User.objects.get_or_create(
        username="dr_sarah",
        defaults={
            "first_name": "Sarah",
            "last_name": "Johnson",
            "email": "sarah.johnson@healthlink.et",
            "role": "hospital_staff"
        }
    )
    doc_sarah_user.set_password("password123")
    doc_sarah_user.is_active = True
    doc_sarah_user.save()

    doc_sarah, _ = Doctor.objects.get_or_create(
        user=doc_sarah_user,
        defaults={
            "hospital": hospital,
            "specialization": "Cardiology Specialist",
            "license_number": "MED-ETH-2024-8891",
            "years_of_experience": 12
        }
    )

    doc_michael_user, _ = User.objects.get_or_create(
        username="dr_michael",
        defaults={
            "first_name": "Michael",
            "last_name": "Chen",
            "email": "michael.chen@healthlink.et",
            "role": "hospital_staff"
        }
    )
    doc_michael_user.set_password("password123")
    doc_michael_user.is_active = True
    doc_michael_user.save()

    doc_michael, _ = Doctor.objects.get_or_create(
        user=doc_michael_user,
        defaults={
            "hospital": hospital,
            "specialization": "General Medicine & Pulmonology",
            "license_number": "MED-ETH-2023-4102",
            "years_of_experience": 9
        }
    )

    # 3. Find all patient users
    patient_users = User.objects.filter(role="patient")
    print(f"Found {patient_users.count()} registered patient users: {[u.username for u in patient_users]}")

    for user in patient_users:
        print(f"\nProcessing patient account: {user.username} (ID: {user.id})")

        # Ensure user first and last name are set
        if not user.first_name:
            user.first_name = user.username.capitalize()
            user.last_name = "Patient"
            user.save()

        # Ensure Patient profile exists with full realistic attributes
        patient, _ = Patient.objects.get_or_create(
            user=user,
            defaults={
                "blood_type": "O+",
                "allergies": "Penicillin (moderate rash), Pollen",
                "emergency_contact_name": "Abebe Belayneh",
                "emergency_contact_phone": "+251 911 234 567",
                "emergency_contact_relationship": "Brother",
                "date_of_birth": date(1998, 5, 14),
                "gender": "Male",
                "phone_number": "+251 911 000 111",
                "address": "Bole Sub City, House 420, Addis Ababa",
                "height": 178.00,
                "weight": 72.50
            }
        )

        # Update patient height & weight if empty
        if not patient.height:
            patient.height = 178.00
        if not patient.weight:
            patient.weight = 72.50
        if not patient.emergency_contact_name:
            patient.emergency_contact_name = "Abebe Belayneh"
            patient.emergency_contact_phone = "+251 911 234 567"
            patient.emergency_contact_relationship = "Brother"
        if not patient.blood_type:
            patient.blood_type = "O+"
        patient.save()

        # Seed baseline Medical Records if none
        if not MedicalRecord.objects.filter(patient=patient).exists():
            print(f"  -> Adding clinical medical records for {user.username}...")
            MedicalRecord.objects.create(
                patient=patient,
                doctor=doc_sarah,
                diagnosis="Stage 1 Essential Hypertension & Mild Fatigue",
                treatment="Initiated low-sodium dietary modifications. Prescribed Atorvastatin and lifestyle adjustments.",
                prescription="Atorvastatin - 20mg once daily at bedtime",
                notes="Patient reports occasional morning headaches. Cardiac telemetry normal, resting BP was 138/88 mmHg."
            )
            MedicalRecord.objects.create(
                patient=patient,
                doctor=doc_michael,
                diagnosis="Acute Bronchial Allergy & Seasonal Rhinitis",
                treatment="Allergy avoidance therapy, steam inhalation, and prescribed oral antihistamine.",
                prescription="Cetirizine - 10mg once daily in the evening",
                notes="Lungs clear bilaterally on auscultation. Symptoms aggravate during pollen-heavy periods."
            )
            MedicalRecord.objects.create(
                patient=patient,
                doctor=doc_sarah,
                diagnosis="Routine Annual Cardiovascular Assessment",
                treatment="Standard preventative health checkup and comprehensive metabolic blood panel.",
                prescription="Multivitamin Complex - 1 tablet daily with food",
                notes="ECG showed normal sinus rhythm. Cholesterol slightly elevated, well managed with diet."
            )

        # Seed baseline Appointments if none
        if not Appointment.objects.filter(patient=patient).exists():
            print(f"  -> Adding appointments for {user.username}...")
            # Upcoming 1
            Appointment.objects.create(
                patient=patient,
                doctor=doc_sarah,
                doctor_name="Dr. Sarah Johnson",
                specialization="Cardiology Specialist",
                hospital_name=hospital.name,
                date=date.today() + timedelta(days=3),
                time="10:30 AM",
                appointment_type="In-Person",
                room="Room 302, 3rd Floor",
                status="Confirmed",
                notes="Quarterly cardiovascular checkup, blood pressure review, and follow-up consultation."
            )
            # Upcoming 2 (Telehealth)
            Appointment.objects.create(
                patient=patient,
                doctor=doc_michael,
                doctor_name="Dr. Michael Chen",
                specialization="General Medicine & Pulmonology",
                hospital_name=hospital.name,
                date=date.today() + timedelta(days=14),
                time="02:00 PM",
                appointment_type="Telehealth",
                room="HealthLink Virtual Suite 4",
                status="Confirmed",
                notes="Follow-up on allergy therapy and review of seasonal inhaler usage."
            )
            # Past visit
            Appointment.objects.create(
                patient=patient,
                doctor=doc_sarah,
                doctor_name="Dr. Sarah Johnson",
                specialization="Cardiology Specialist",
                hospital_name=hospital.name,
                date=date.today() - timedelta(days=30),
                time="11:00 AM",
                appointment_type="In-Person",
                room="Room 302, 3rd Floor",
                status="Completed",
                notes="Initial diagnostic consultation and ECG assessment."
            )

        # Seed baseline Vitals if none
        if not VitalSign.objects.filter(patient=patient).exists():
            print(f"  -> Adding real vital signs telemetry history for {user.username}...")
            # 5 telemetry points over past 2 months
            vital_points = [
                (timedelta(days=45), 126, 82, 75, 98, 36.6, 96, "Baseline clinical screening"),
                (timedelta(days=30), 124, 80, 72, 99, 36.5, 92, "Routine consultation follow-up"),
                (timedelta(days=18), 122, 78, 70, 98, 36.7, 95, "Morning vitals log"),
                (timedelta(days=7), 120, 78, 71, 98, 36.6, 93, "Weekly vitals log"),
                (timedelta(days=0), 118, 76, 68, 99, 36.6, 91, "Optimal resting telemetry"),
            ]
            for delta, sys, dia, hr, ox, temp, gluc, nts in vital_points:
                v = VitalSign.objects.create(
                    patient=patient,
                    systolic=sys,
                    diastolic=dia,
                    heart_rate=hr,
                    oxygen_level=ox,
                    temperature=temp,
                    blood_glucose=gluc,
                    notes=nts
                )
                if delta.days > 0:
                    v.recorded_at = django.utils.timezone.now() - delta
                    v.save()

        # Seed baseline Prescriptions if none
        if not Prescription.objects.filter(patient=patient).exists():
            print(f"  -> Adding active prescriptions for {user.username}...")
            Prescription.objects.create(
                patient=patient,
                doctor=doc_sarah,
                doctor_name="Dr. Sarah Johnson",
                specialization="Cardiology Specialist",
                hospital_name=hospital.name,
                medication_name="Atorvastatin",
                dosage="20mg",
                frequency="Once daily at bedtime",
                time_of_day="night",
                duration_days=30,
                instructions="Take with a full glass of water. Maintain low sodium diet.",
                side_effects="Mild muscle ache or headache may occur initially.",
                refill_status="Refill Needed"
            )
            Prescription.objects.create(
                patient=patient,
                doctor=doc_michael,
                doctor_name="Dr. Michael Chen",
                specialization="General Medicine",
                hospital_name=hospital.name,
                medication_name="Cetirizine HCl",
                dosage="10mg",
                frequency="Once daily in the morning",
                time_of_day="morning",
                duration_days=30,
                instructions="Take in the morning with or without food.",
                side_effects="Non-drowsy formulation; drink plenty of water.",
                refill_status="Active"
            )
            Prescription.objects.create(
                patient=patient,
                doctor=doc_sarah,
                doctor_name="Dr. Sarah Johnson",
                specialization="Cardiology Specialist",
                hospital_name=hospital.name,
                medication_name="Multivitamin Complex",
                dosage="1 Tablet",
                frequency="Once daily with lunch",
                time_of_day="afternoon",
                duration_days=60,
                instructions="Take with food to maximize mineral absorption.",
                side_effects="None reported.",
                refill_status="Active"
            )

        # Seed baseline Notifications if none
        if not Notification.objects.filter(user=user).exists():
            print(f"  -> Adding notifications for {user.username}...")
            Notification.objects.create(
                user=user,
                title="Upcoming Doctor Consultation",
                message="You have a cardiology appointment scheduled with Dr. Sarah Johnson in 3 days at 10:30 AM.",
                notification_type="appointment",
                is_read=False,
                link="/appointments"
            )
            Notification.objects.create(
                user=user,
                title="Prescription Refill Due Soon",
                message="Your Atorvastatin 20mg supply has 5 days remaining. Submit a refill request to avoid dosage interruption.",
                notification_type="prescription",
                is_read=False,
                link="/medications"
            )
            Notification.objects.create(
                user=user,
                title="Clinical Record Added",
                message="Dr. Sarah Johnson uploaded your latest cardiovascular examination findings and notes.",
                notification_type="record",
                is_read=True,
                link="/medical-records"
            )

    print("\n[SUCCESS] Successfully seeded all patient real data into PostgreSQL database!")

if __name__ == "__main__":
    seed_all_patients()
