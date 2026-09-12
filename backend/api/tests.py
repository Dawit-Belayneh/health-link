from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from users.models import User
from hospitals.models import Hospital
from doctors.models import Doctor
from patients.models import Patient, VitalSign
from medical_records.models import MedicalRecord
from access_requests.models import AccessRequest

class DoctorWorkflowTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.hospital = Hospital.objects.create(
            name="Test Central Hospital",
            address="Addis Ababa",
            phone="+251111111111"
        )
        self.admin_user = User.objects.create_user(
            username="hosp_admin",
            password="adminpassword123",
            role="admin",
            is_staff=True
        )

    def test_public_signup_rejects_doctor_role(self):
        # 1. Attempt to signup with role='doctor'
        res = self.client.post('/api/signup/', {
            "username": "fake_doc",
            "password": "password123",
            "first_name": "Fake",
            "last_name": "Doctor",
            "email": "doc@test.com",
            "role": "doctor"
        })
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("role", res.data)

    def test_public_signup_allows_patient(self):
        res = self.client.post('/api/signup/', {
            "username": "john_patient",
            "password": "password123",
            "first_name": "John",
            "last_name": "Doe",
            "email": "john@test.com",
            "role": "patient"
        })
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertTrue(Patient.objects.filter(user__username="john_patient").exists())

    def test_hospital_admin_creates_doctor_and_login(self):
        # Authenticate as admin
        login_res = self.client.post('/api/login/', {
            "username": "hosp_admin",
            "password": "adminpassword123"
        })
        token = login_res.data["access"]
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")

        # Create doctor
        create_res = self.client.post('/api/hospital/doctors/', {
            "username": "dr_abebe",
            "password": "docpassword123",
            "first_name": "Abebe",
            "last_name": "Bikila",
            "email": "dr_abebe@test.com",
            "hospital": self.hospital.id,
            "specialization": "Cardiology",
            "license_number": "MED-ETH-9999",
            "years_of_experience": 10,
            "role": "doctor"
        })
        self.assertEqual(create_res.status_code, status.HTTP_201_CREATED)
        self.assertTrue(Doctor.objects.filter(user__username="dr_abebe").exists())

        # Doctor logs in with credentials
        self.client.credentials()  # Clear auth
        doc_login = self.client.post('/api/login/', {
            "username": "dr_abebe",
            "password": "docpassword123"
        })
        self.assertEqual(doc_login.status_code, status.HTTP_200_OK)
        self.assertIn("user", doc_login.data)
        self.assertEqual(doc_login.data["user"]["role"], "doctor")
        self.assertIsNotNone(doc_login.data["user"]["doctor_id"])

    def test_doctor_access_permission_flow(self):
        # Setup doctor
        doc_user = User.objects.create_user(
            username="dr_selam",
            password="password123",
            role="doctor"
        )
        doctor = Doctor.objects.create(
            user=doc_user,
            hospital=self.hospital,
            specialization="Pediatrics",
            license_number="LIC-1234",
            years_of_experience=5
        )

        # Setup patient
        patient_user = User.objects.create_user(
            username="patient_kidist",
            password="password123",
            role="patient"
        )
        patient = Patient.objects.create(
            user=patient_user,
            blood_type="O+"
        )
        VitalSign.objects.create(patient=patient, heart_rate=75, systolic=118, diastolic=78)

        # Doctor logs in
        login_res = self.client.post('/api/login/', {
            "username": "dr_selam",
            "password": "password123"
        })
        doc_token = login_res.data["access"]
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {doc_token}")

        # 1. Doctor tries to view patient details WITHOUT permission -> 403 Forbidden
        view_res = self.client.get(f'/api/doctor/patients/{patient.id}/')
        self.assertEqual(view_res.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(view_res.data.get("error"), "permission_denied")

        # 2. Doctor sends access request
        req_res = self.client.post('/api/access-requests/', {
            "patient_id": patient.id,
            "notes": "Need to monitor pediatric history."
        })
        self.assertEqual(req_res.status_code, status.HTTP_201_CREATED)
        req_id = req_res.data["id"]

        # 3. Patient logs in and approves request
        p_login = self.client.post('/api/login/', {
            "username": "patient_kidist",
            "password": "password123"
        })
        p_token = p_login.data["access"]
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {p_token}")

        approve_res = self.client.post(f'/api/access-requests/{req_id}/respond/', {
            "action": "approve"
        })
        self.assertEqual(approve_res.status_code, status.HTTP_200_OK)
        self.assertEqual(approve_res.data["status"], "approved")

        # 4. Doctor checks patient details again -> 200 OK with full data!
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {doc_token}")
        view_res_after = self.client.get(f'/api/doctor/patients/{patient.id}/')
        self.assertEqual(view_res_after.status_code, status.HTTP_200_OK)
        self.assertTrue(view_res_after.data.get("has_permission"))
        self.assertIn("vitals", view_res_after.data)
        self.assertEqual(len(view_res_after.data["vitals"]), 1)

        # 5. Doctor can create medical record while permitted
        rec_res = self.client.post('/api/medical_record/', {
            "patient": patient.id,
            "diagnosis": "Seasonal allergic rhinitis",
            "treatment": "Antihistamines 10mg daily",
            "notes": "Patient advised to avoid known allergens."
        })
        self.assertEqual(rec_res.status_code, status.HTTP_201_CREATED)

        # 6. Patient revokes permission
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {p_token}")
        revoke_res = self.client.post(f'/api/access-requests/{req_id}/respond/', {
            "action": "revoke"
        })
        self.assertEqual(revoke_res.status_code, status.HTTP_200_OK)
        self.assertEqual(revoke_res.data["status"], "revoked")

        # 7. Doctor tries to view or record medical data again -> 403 Forbidden!
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {doc_token}")
        view_res_revoked = self.client.get(f'/api/doctor/patients/{patient.id}/')
        self.assertEqual(view_res_revoked.status_code, status.HTTP_403_FORBIDDEN)

        rec_res_forbidden = self.client.post('/api/medical_record/', {
            "patient": patient.id,
            "diagnosis": "Checkup attempt",
            "treatment": "None"
        })
        self.assertEqual(rec_res_forbidden.status_code, status.HTTP_403_FORBIDDEN)

    def test_doctor_and_admin_profile_endpoints(self):
        # 1. Doctor user
        doc_user = User.objects.create_user(
            username="dr_tadesse",
            password="password123",
            first_name="Tadesse",
            last_name="Haile",
            role="doctor"
        )
        Doctor.objects.create(
            user=doc_user,
            hospital=self.hospital,
            specialization="Neurology",
            license_number="LIC-NEURO-888",
            years_of_experience=8
        )
        login_res = self.client.post('/api/login/', {
            "username": "dr_tadesse",
            "password": "password123"
        })
        doc_token = login_res.data["access"]
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {doc_token}")

        # Doctor gets doctor profile
        doc_profile = self.client.get('/api/doctor/me/')
        self.assertEqual(doc_profile.status_code, status.HTTP_200_OK)
        self.assertEqual(doc_profile.data["specialization"], "Neurology")
        self.assertEqual(doc_profile.data["license_number"], "LIC-NEURO-888")

        # Doctor updates profile
        update_res = self.client.patch('/api/doctor/me/', {
            "specialization": "Pediatric Neurology",
            "years_of_experience": 9
        })
        self.assertEqual(update_res.status_code, status.HTTP_200_OK)
        self.assertEqual(update_res.data["specialization"], "Pediatric Neurology")

        # 2. Patient cannot access doctor profile
        patient_user = User.objects.create_user(username="pat_user", password="password123", role="patient")
        p_login = self.client.post('/api/login/', {"username": "pat_user", "password": "password123"})
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {p_login.data['access']}")
        forbidden_profile = self.client.get('/api/doctor/me/')
        self.assertEqual(forbidden_profile.status_code, status.HTTP_403_FORBIDDEN)

        # 3. Admin user gets user/me/ profile
        admin_login = self.client.post('/api/login/', {"username": "hosp_admin", "password": "adminpassword123"})
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {admin_login.data['access']}")
        admin_profile = self.client.get('/api/user/me/')
        self.assertEqual(admin_profile.status_code, status.HTTP_200_OK)
        self.assertEqual(admin_profile.data["role"], "admin")
        self.assertTrue(admin_profile.data["is_admin"])


class RoleBasedPermissionSecurityTests(TestCase):
    def setUp(self):
        self.client = APIClient()

        # Create two separate hospitals
        self.hosp_a = Hospital.objects.create(name="Hospital Alpha", address="Addis Ababa", phone="+251111111111")
        self.hosp_b = Hospital.objects.create(name="Hospital Beta", address="Hawassa", phone="+251222222222")

        # Create hospital admins
        self.admin_a_user = User.objects.create_user(username="admin_a", password="password123", role="admin", hospital=self.hosp_a, is_staff=True)
        self.admin_b_user = User.objects.create_user(username="admin_b", password="password123", role="admin", hospital=self.hosp_b, is_staff=True)

        # Create doctors
        self.doc_a_user = User.objects.create_user(username="doc_alpha", password="password123", role="doctor", hospital=self.hosp_a)
        self.doc_a = Doctor.objects.create(user=self.doc_a_user, hospital=self.hosp_a, specialization="Cardiology", license_number="LIC-A-01")

        self.doc_b_user = User.objects.create_user(username="doc_beta", password="password123", role="doctor", hospital=self.hosp_b)
        self.doc_b = Doctor.objects.create(user=self.doc_b_user, hospital=self.hosp_b, specialization="Neurology", license_number="LIC-B-01")

        # Create patient with emergency contact
        self.patient_user = User.objects.create_user(username="patient_yared", password="password123", role="patient")
        self.patient = Patient.objects.create(
            user=self.patient_user,
            blood_type="AB+",
            emergency_contact_name="Amina Yared",
            emergency_contact_phone="+251 911 777 888",
            emergency_contact_relationship="Spouse"
        )

        # Create clinical record
        self.record_a = MedicalRecord.objects.create(
            patient=self.patient,
            doctor=self.doc_a,
            diagnosis="Essential Hypertension",
            treatment="Amlodipine 5mg"
        )

    def test_patient_cannot_delete_or_edit_medical_record(self):
        login_res = self.client.post('/api/login/', {"username": "patient_yared", "password": "password123"})
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {login_res.data['access']}")

        # 1. Patient tries DELETE -> 403 Forbidden
        del_res = self.client.delete(f'/api/medical_records/{self.record_a.id}/')
        self.assertEqual(del_res.status_code, status.HTTP_403_FORBIDDEN)
        self.assertTrue(MedicalRecord.objects.filter(id=self.record_a.id).exists())

        # 2. Patient tries PUT -> 403 Forbidden
        put_res = self.client.put(f'/api/medical_records/{self.record_a.id}/', {
            "diagnosis": "Modified diagnosis",
            "treatment": "Modified treatment"
        })
        self.assertEqual(put_res.status_code, status.HTTP_403_FORBIDDEN)

        # 3. Patient tries PATCH -> 403 Forbidden
        patch_res = self.client.patch(f'/api/medical_records/{self.record_a.id}/', {
            "diagnosis": "Modified diagnosis"
        })
        self.assertEqual(patch_res.status_code, status.HTTP_403_FORBIDDEN)

    def test_hospital_admin_cannot_delete_or_edit_medical_records(self):
        login_res = self.client.post('/api/login/', {"username": "admin_a", "password": "password123"})
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {login_res.data['access']}")

        # 1. Admin tries DELETE on medical record -> 403 Forbidden
        del_res = self.client.delete(f'/api/medical_records/{self.record_a.id}/')
        self.assertEqual(del_res.status_code, status.HTTP_403_FORBIDDEN)
        self.assertTrue(MedicalRecord.objects.filter(id=self.record_a.id).exists())

        # 2. Admin tries PUT -> 403 Forbidden
        put_res = self.client.put(f'/api/medical_records/{self.record_a.id}/', {
            "diagnosis": "Admin altered diagnosis"
        })
        self.assertEqual(put_res.status_code, status.HTTP_403_FORBIDDEN)

    def test_hospital_admin_scoped_strictly_to_own_hospital(self):
        # Admin A logs in
        login_res = self.client.post('/api/login/', {"username": "admin_a", "password": "password123"})
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {login_res.data['access']}")

        # 1. Admin A lists doctors: sees doc_a, does NOT see doc_b
        doc_list_res = self.client.get('/api/hospital/doctors/')
        self.assertEqual(doc_list_res.status_code, status.HTTP_200_OK)
        doc_ids = [d["id"] for d in doc_list_res.data]
        self.assertIn(self.doc_a.id, doc_ids)
        self.assertNotIn(self.doc_b.id, doc_ids)

        # 2. Admin A tries to delete doc_b (from hospital B) -> 403 or 404
        del_foreign_doc = self.client.delete(f'/api/hospital/doctors/{self.doc_b.id}/')
        self.assertIn(del_foreign_doc.status_code, [status.HTTP_403_FORBIDDEN, status.HTTP_404_NOT_FOUND])
        self.assertTrue(Doctor.objects.filter(id=self.doc_b.id).exists())

        # 3. Admin A can update own doctor
        update_doc_res = self.client.patch(f'/api/hospital/doctors/{self.doc_a.id}/', {
            "specialization": "Interventional Cardiology",
            "years_of_experience": 12
        })
        self.assertEqual(update_doc_res.status_code, status.HTTP_200_OK)
        self.doc_a.refresh_from_db()
        self.assertEqual(self.doc_a.specialization, "Interventional Cardiology")

        # 4. Admin A can delete own doctor
        del_own_doc = self.client.delete(f'/api/hospital/doctors/{self.doc_a.id}/')
        self.assertEqual(del_own_doc.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Doctor.objects.filter(id=self.doc_a.id).exists())

    def test_doctor_emergency_access_verified_by_emergency_contact(self):
        # Doctor B logs in (has no appointments or prior records with patient_yared)
        login_res = self.client.post('/api/login/', {"username": "doc_beta", "password": "password123"})
        doc_token = login_res.data["access"]
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {doc_token}")

        # 1. Doctor B tries to view clinical data without permission -> 403 Forbidden
        view_res = self.client.get(f'/api/doctor/patients/{self.patient.id}/')
        self.assertEqual(view_res.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(view_res.data["error"], "permission_denied")

        # 2. Emergency override fails if wrong contact info provided
        fail_res = self.client.post('/api/access-requests/emergency-grant/', {
            "patient_id": self.patient.id,
            "emergency_reason": "Severe acute respiratory distress in emergency ward",
            "emergency_contact_name": "Completely Wrong Person",
            "emergency_contact_phone": "+251999999999"
        })
        self.assertEqual(fail_res.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("verification failed", fail_res.data["detail"].lower())

        # 3. Emergency override succeeds with registered emergency contact phone or name
        grant_res = self.client.post('/api/access-requests/emergency-grant/', {
            "patient_id": self.patient.id,
            "emergency_reason": "Severe acute respiratory distress in emergency ward",
            "emergency_contact_name": "Amina Yared",
            "emergency_contact_phone": "+251 911 777 888"
        })
        self.assertEqual(grant_res.status_code, status.HTTP_200_OK)
        self.assertTrue(grant_res.data["request"]["is_emergency"])
        self.assertEqual(grant_res.data["request"]["approved_by_type"], "emergency_contact")

        # 4. Clinical file is now instantly accessible to the emergency physician!
        view_res_granted = self.client.get(f'/api/doctor/patients/{self.patient.id}/')
        self.assertEqual(view_res_granted.status_code, status.HTTP_200_OK)
        self.assertTrue(view_res_granted.data["has_permission"])
        self.assertTrue(view_res_granted.data["is_emergency_access"])
        self.assertEqual(len(view_res_granted.data["medical_records"]), 1)


