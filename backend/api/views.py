from datetime import date
from django.utils import timezone
from django.db.models import Q
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from hospitals.models import Hospital
from patients.models import Patient, Appointment, VitalSign, Notification, Prescription
from doctors.models import Doctor
from medical_records.models import MedicalRecord
from access_requests.models import AccessRequest
from .serializers import (
    HospitalSerializer,
    PatientSerializer,
    DoctorSerializer,
    MedicalRecordSerializer,
    RegisterSerializer,
    CustomTokenObtainPairSerializer,
    AppointmentSerializer,
    VitalSignSerializer,
    NotificationSerializer,
    PrescriptionSerializer,
    DoctorCreateByAdminSerializer,
    AccessRequestSerializer,
)
from .permissions import (
    IsPatient,
    IsHospitalStaff,
    IsAdmin,
    IsDoctor,
    CanAccessMedicalRecord,
    CanManageHospitalDoctor,
)
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied, NotFound
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer

class PatientMeView(generics.RetrieveUpdateAPIView):
    serializer_class = PatientSerializer
    permission_classes = [IsAuthenticated, IsPatient]

    def get_object(self):
        patient, _ = Patient.objects.get_or_create(user=self.request.user)
        return patient

class DoctorMeView(APIView):
    permission_classes = [IsAuthenticated, IsDoctor]

    def get(self, request):
        doc = Doctor.objects.filter(user=request.user).first()
        if not doc:
            doc = Doctor.objects.create(
                user=request.user,
                specialization="General Practice",
                license_number=f"DOC-{request.user.id:04d}"
            )
        serializer = DoctorSerializer(doc)
        return Response(serializer.data)

    def patch(self, request):
        doc = Doctor.objects.filter(user=request.user).first()
        if not doc:
            doc = Doctor.objects.create(
                user=request.user,
                specialization="General Practice",
                license_number=f"DOC-{request.user.id:04d}"
            )
        user = request.user
        user_data = request.data.get('user_details', {}) if isinstance(request.data.get('user_details'), dict) else {}
        first_name = user_data.get('first_name', request.data.get('first_name', user.first_name))
        last_name = user_data.get('last_name', request.data.get('last_name', user.last_name))
        email = user_data.get('email', request.data.get('email', user.email))
        
        user.first_name = first_name
        user.last_name = last_name
        user.email = email
        user.save()

        if 'specialization' in request.data:
            doc.specialization = request.data['specialization']
        if 'years_of_experience' in request.data:
            doc.years_of_experience = request.data['years_of_experience']
        if 'license_number' in request.data:
            doc.license_number = request.data['license_number']
        doc.save()

        serializer = DoctorSerializer(doc)
        return Response(serializer.data)

class UserMeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        data = {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "full_name": f"{user.first_name} {user.last_name}".strip() or user.username,
            "role": user.role,
            "is_admin": user.is_staff or user.is_superuser or user.role == 'admin',
        }
        if user.role in ['doctor', 'hospital_staff']:
            doc = Doctor.objects.filter(user=user).first()
            if doc:
                data["doctor_details"] = DoctorSerializer(doc).data
        elif user.role == 'patient':
            patient = Patient.objects.filter(user=user).first()
            if patient:
                data["patient_details"] = PatientSerializer(patient).data
        return Response(data)

    def patch(self, request):
        user = request.user
        user.first_name = request.data.get("first_name", user.first_name)
        user.last_name = request.data.get("last_name", user.last_name)
        user.email = request.data.get("email", user.email)
        user.save()
        return self.get(request)
    
class PatientListCreateView(generics.ListCreateAPIView):
    queryset = Patient.objects.all()
    filter_backends = [DjangoFilterBackend]
    filterset_fields = [
        'user',
        'date_of_birth',
        'gender',
        'blood_type',
        'allergies',
    ]
    serializer_class = PatientSerializer
    permission_classes = [IsAuthenticated, IsPatient]

    def get_queryset(self):
        if self.request.user.role == 'patient':
            Patient.objects.get_or_create(user=self.request.user)
        return Patient.objects.filter(user=self.request.user)

class PatientDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer
    permission_classes = [IsAuthenticated, IsPatient]

    def get_queryset(self):
        return Patient.objects.filter(user=self.request.user)

class HospitalListCreateView(generics.ListCreateAPIView):
    queryset = Hospital.objects.all()
    serializer_class = HospitalSerializer
    permission_classes = [IsAuthenticated, IsAdmin]

class HospitalDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Hospital.objects.all()
    serializer_class = HospitalSerializer
    permission_classes = [IsAuthenticated, IsAdmin]

class DoctorListCreateView(generics.ListCreateAPIView):
    queryset = Doctor.objects.all().order_by('-created_at')
    serializer_class = DoctorSerializer
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsAuthenticated(), IsAdmin()]
        return [IsAuthenticated()]

    def create(self, request, *args, **kwargs):
        serializer = DoctorCreateByAdminSerializer(data=request.data)
        if serializer.is_valid():
            doctor = serializer.save()
            return Response(DoctorSerializer(doctor).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class DoctorDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Doctor.objects.all()
    serializer_class = DoctorSerializer
    permission_classes = [IsAuthenticated, IsHospitalStaff]

class HospitalDoctorListCreateView(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]

    def get(self, request):
        admin_hospital = getattr(request.user, 'hospital', None) or Hospital.objects.first()
        doctors = Doctor.objects.filter(hospital=admin_hospital).order_by('-created_at')
        return Response(DoctorSerializer(doctors, many=True).data)

    def post(self, request):
        admin_hospital = getattr(request.user, 'hospital', None) or Hospital.objects.first()
        data = request.data.copy()
        if 'hospital' not in data and admin_hospital:
            data['hospital'] = admin_hospital.id
        serializer = DoctorCreateByAdminSerializer(data=data)
        if serializer.is_valid():
            doctor = serializer.save()
            return Response(DoctorSerializer(doctor).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class HospitalDoctorDetailView(APIView):
    permission_classes = [IsAuthenticated, CanManageHospitalDoctor]

    def get_object(self, pk, user):
        try:
            doctor = Doctor.objects.get(pk=pk)
        except Doctor.DoesNotExist:
            raise NotFound("Doctor not found.")
        self.check_object_permissions(self.request, doctor)
        return doctor

    def get(self, request, pk):
        doctor = self.get_object(pk, request.user)
        return Response(DoctorSerializer(doctor).data)

    def patch(self, request, pk):
        doctor = self.get_object(pk, request.user)
        serializer = DoctorSerializer(doctor, data=request.data, partial=True, context={'request': request})
        if serializer.is_valid():
            doctor = serializer.save()
            return Response(DoctorSerializer(doctor).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        return self.patch(request, pk)

    def delete(self, request, pk):
        doctor = self.get_object(pk, request.user)
        doc_user = doctor.user
        doctor.delete()
        if doc_user:
            doc_user.delete()
        return Response({"detail": "Doctor employee removed successfully."}, status=status.HTTP_204_NO_CONTENT)


class MedicalRecordListCreateView(generics.ListCreateAPIView):
    serializer_class = MedicalRecordSerializer
    permission_classes = [IsAuthenticated, CanAccessMedicalRecord]
    filter_backends = [DjangoFilterBackend, SearchFilter]
    search_fields = [
        'diagnosis',
        'treatment',
        'prescription',
        'notes',
        'doctor__user__first_name',
        'doctor__user__last_name',
        'patient__user__first_name',
        'patient__user__last_name',
    ]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'patient':
            return MedicalRecord.objects.filter(patient__user=user).order_by('-date')
        elif user.role in ['doctor', 'hospital_staff']:
            doc = Doctor.objects.filter(user=user).first()
            if not doc:
                return MedicalRecord.objects.none()
            permitted_patient_ids = AccessRequest.objects.filter(
                doctor=doc, status='approved'
            ).values_list('patient_id', flat=True)
            return MedicalRecord.objects.filter(
                Q(patient_id__in=permitted_patient_ids) | Q(doctor=doc)
            ).order_by('-date')
        elif user.role == 'admin' or user.is_staff:
            admin_hospital = getattr(user, 'hospital', None) or Hospital.objects.first()
            return MedicalRecord.objects.filter(doctor__hospital=admin_hospital).order_by('-date')
        return MedicalRecord.objects.none()

    def perform_create(self, serializer):
        user = self.request.user
        if user.role == 'patient':
            raise PermissionDenied("Patients cannot create clinical medical records.")
        if user.role == 'admin' and not user.is_superuser:
            raise PermissionDenied("Hospital administrators cannot create patient clinical records.")

        if user.role in ['doctor', 'hospital_staff']:
            doc = Doctor.objects.filter(user=user).first()
            if not doc:
                raise PermissionDenied("Doctor profile not found.")
            patient = serializer.validated_data.get('patient')
            has_perm = AccessRequest.objects.filter(doctor=doc, patient=patient, status='approved').exists() or \
                       Appointment.objects.filter(doctor=doc, patient=patient).exists()
            if not has_perm and not (user.is_superuser or user.is_staff):
                raise PermissionDenied("You must obtain approved patient permission or have an active consultation before recording medical data.")
            record = serializer.save(doctor=doc)
        else:
            record = serializer.save()

        if record.patient and record.patient.user:
            doc_display = "Your physician"
            if record.doctor and record.doctor.user:
                full_name = f"{record.doctor.user.first_name} {record.doctor.user.last_name}".strip()
                doc_display = f"Dr. {full_name or record.doctor.user.username}"
            Notification.objects.create(
                user=record.patient.user,
                title="New Medical Record Added",
                message=f"{doc_display} recorded a new clinical consultation: {record.diagnosis}.",
                notification_type="record",
                link="/medical-records"
            )


class MedicalRecordDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = MedicalRecordSerializer
    permission_classes = [IsAuthenticated, CanAccessMedicalRecord]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'patient':
            return MedicalRecord.objects.filter(patient__user=user)
        elif user.role in ['doctor', 'hospital_staff']:
            doc = Doctor.objects.filter(user=user).first()
            if not doc:
                return MedicalRecord.objects.none()
            permitted_ids = AccessRequest.objects.filter(doctor=doc, status='approved').values_list('patient_id', flat=True)
            return MedicalRecord.objects.filter(Q(patient_id__in=permitted_ids) | Q(doctor=doc))
        elif user.role == 'admin' or user.is_staff:
            admin_hospital = getattr(user, 'hospital', None) or Hospital.objects.first()
            return MedicalRecord.objects.filter(doctor__hospital=admin_hospital)
        return MedicalRecord.objects.none()

    def perform_update(self, serializer):
        user = self.request.user
        if user.role == 'patient':
            raise PermissionDenied("Patients cannot edit clinical medical records.")
        if user.role == 'admin' and not user.is_superuser:
            raise PermissionDenied("Hospital administrators cannot alter patient clinical medical data.")
        record = self.get_object()
        if user.role in ['doctor', 'hospital_staff']:
            if record.doctor and record.doctor.user != user and not user.is_superuser:
                raise PermissionDenied("You can only edit medical records authored by yourself.")
        serializer.save()

    def perform_destroy(self, instance):
        user = self.request.user
        if user.role == 'patient':
            raise PermissionDenied("Patients cannot delete clinical medical history created by healthcare providers.")
        if user.role == 'admin' and not user.is_superuser:
            raise PermissionDenied("Hospital administrators are strictly prohibited from deleting patient medical data.")
        if not user.is_superuser:
            raise PermissionDenied("Clinical medical records are permanent medicolegal records and cannot be deleted.")
        instance.delete()



# --- APPOINTMENTS API ---
class AppointmentListCreateView(generics.ListCreateAPIView):
    serializer_class = AppointmentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'patient':
            patient, _ = Patient.objects.get_or_create(user=user)
            return Appointment.objects.filter(patient=patient).order_by('date', 'time')
        return Appointment.objects.all().order_by('date', 'time')

    def perform_create(self, serializer):
        patient, _ = Patient.objects.get_or_create(user=self.request.user)
        apt = serializer.save(patient=patient)
        Notification.objects.create(
            user=self.request.user,
            title="Appointment Confirmed",
            message=f"Your {apt.appointment_type} appointment with {apt.doctor_name or 'physician'} on {apt.date} at {apt.time} has been scheduled.",
            notification_type="appointment",
            link="/appointments"
        )


class AppointmentDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = AppointmentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'patient':
            patient, _ = Patient.objects.get_or_create(user=user)
            return Appointment.objects.filter(patient=patient)
        return Appointment.objects.all()

    def perform_update(self, serializer):
        apt = serializer.save()
        if apt.status == "Cancelled":
            Notification.objects.create(
                user=self.request.user,
                title="Appointment Cancelled",
                message=f"Your appointment with {apt.doctor_name or 'physician'} on {apt.date} has been marked as cancelled.",
                notification_type="appointment",
                link="/appointments"
            )


# --- VITALS API ---
class VitalSignListCreateView(generics.ListCreateAPIView):
    serializer_class = VitalSignSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'patient':
            patient, _ = Patient.objects.get_or_create(user=user)
            return VitalSign.objects.filter(patient=patient).order_by('-recorded_at')
        return VitalSign.objects.all().order_by('-recorded_at')

    def perform_create(self, serializer):
        patient, _ = Patient.objects.get_or_create(user=self.request.user)
        vital = serializer.save(patient=patient)

        # Update height and weight on patient if provided in request
        height = self.request.data.get('height')
        weight = self.request.data.get('weight')
        changed = False
        if height is not None and str(height).strip() != "":
            try:
                patient.height = float(height)
                changed = True
            except ValueError:
                pass
        if weight is not None and str(weight).strip() != "":
            try:
                patient.weight = float(weight)
                changed = True
            except ValueError:
                pass
        if changed:
            patient.save()


# --- NOTIFICATIONS API ---
class NotificationListCreateView(generics.ListCreateAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user).order_by('-created_at')

    def delete(self, request, *args, **kwargs):
        Notification.objects.filter(user=request.user).delete()
        return Response({"detail": "All notifications cleared."}, status=status.HTTP_204_NO_CONTENT)


class NotificationDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)


class NotificationMarkAllReadView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        Notification.objects.filter(user=request.user, is_read=False).update(is_read=True)
        return Response({"status": "All notifications marked as read."})


# --- PRESCRIPTIONS API ---
class PrescriptionListCreateView(generics.ListCreateAPIView):
    serializer_class = PrescriptionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'patient':
            patient, _ = Patient.objects.get_or_create(user=user)
            return Prescription.objects.filter(patient=patient).order_by('-created_at')
        elif user.role in ['doctor', 'hospital_staff']:
            doc = Doctor.objects.filter(user=user).first()
            if not doc:
                return Prescription.objects.none()
            permitted_ids = AccessRequest.objects.filter(doctor=doc, status='approved').values_list('patient_id', flat=True)
            return Prescription.objects.filter(Q(patient_id__in=permitted_ids) | Q(doctor=doc)).order_by('-created_at')
        elif user.role == 'admin' or user.is_staff:
            admin_hospital = getattr(user, 'hospital', None) or Hospital.objects.first()
            return Prescription.objects.filter(doctor__hospital=admin_hospital).order_by('-created_at')
        return Prescription.objects.none()

    def perform_create(self, serializer):
        user = self.request.user
        if user.role == 'patient':
            raise PermissionDenied("Patients cannot write prescriptions. Prescriptions must be prescribed by a physician.")
        if user.role == 'admin' and not user.is_superuser:
            raise PermissionDenied("Hospital administrators cannot create prescriptions.")

        doc = Doctor.objects.filter(user=user).first()
        patient = serializer.validated_data.get('patient')
        if not patient and 'patient' in self.request.data:
            try:
                patient = Patient.objects.get(id=self.request.data['patient'])
            except Patient.DoesNotExist:
                pass

        if not patient:
            raise PermissionDenied("A valid patient is required to issue a prescription.")

        has_perm = AccessRequest.objects.filter(doctor=doc, patient=patient, status='approved').exists() or \
                   Appointment.objects.filter(doctor=doc, patient=patient).exists()
        if not has_perm and not user.is_superuser:
            raise PermissionDenied("You must obtain patient permission or have an active consultation before prescribing medications.")

        doc_name = f"Dr. {user.first_name} {user.last_name}".strip() or f"Dr. {user.username}"
        hosp_name = doc.hospital.name if (doc and doc.hospital) else "HealthLink Hospital"
        rx = serializer.save(
            patient=patient,
            doctor=doc,
            doctor_name=doc_name,
            specialization=doc.specialization if doc else "",
            hospital_name=hosp_name
        )

        Notification.objects.create(
            user=patient.user,
            title="New Prescription Issued",
            message=f"{doc_name} prescribed {rx.medication_name} ({rx.dosage}, {rx.frequency}).",
            notification_type="prescription",
            link="/medications"
        )



class PrescriptionRefillView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            patient, _ = Patient.objects.get_or_create(user=request.user)
            rx = Prescription.objects.get(pk=pk, patient=patient)
            rx.refill_status = "Refill Requested"
            rx.save()

            pharmacy = request.data.get("pharmacy", "HealthLink Central Pharmacy")
            Notification.objects.create(
                user=request.user,
                title="Prescription Refill Requested",
                message=f"Your refill request for {rx.medication_name} has been sent to {pharmacy}.",
                notification_type="prescription",
                link="/medications"
            )
            return Response(PrescriptionSerializer(rx).data)
        except Prescription.DoesNotExist:
            return Response({"detail": "Prescription not found."}, status=status.HTTP_404_NOT_FOUND)


# --- DASHBOARD SUMMARY API ---
class PatientDashboardSummaryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        patient, _ = Patient.objects.get_or_create(user=request.user)

        # Baseline vitals auto-seed if none exist
        if not VitalSign.objects.filter(patient=patient).exists():
            VitalSign.objects.create(
                patient=patient,
                systolic=120,
                diastolic=80,
                heart_rate=72,
                oxygen_level=98,
                temperature=36.6,
                blood_glucose=94,
                notes="Initial baseline vitals"
            )

        # Baseline appointment auto-seed if none exist
        if not Appointment.objects.filter(patient=patient).exists():
            Appointment.objects.create(
                patient=patient,
                doctor_name="Dr. Sarah Johnson",
                specialization="Cardiology Specialist",
                hospital_name="HealthLink Central Hospital",
                date=date.today(),
                time="10:30 AM",
                appointment_type="In-Person",
                room="Room 302, 3rd Floor",
                status="Confirmed",
                notes="Regular cardiac assessment and consultation."
            )

        # Baseline prescription auto-seed if none exist
        if not Prescription.objects.filter(patient=patient).exists():
            # Check if medical records have prescriptions
            records = MedicalRecord.objects.filter(patient=patient)
            for r in records:
                if r.prescription and r.prescription.strip():
                    parts = r.prescription.split("-")
                    name = parts[0].strip()
                    dosage = parts[1].strip() if len(parts) > 1 else "As directed"
                    Prescription.objects.create(
                        patient=patient,
                        doctor_name=r.doctor_name,
                        specialization=r.doctor_specialization,
                        hospital_name=r.hospital_name,
                        medication_name=name,
                        dosage=dosage,
                        frequency="Once daily with meals",
                        time_of_day="morning",
                        duration_days=30,
                        instructions="Take with water after food.",
                        refill_status="Active"
                    )

            if not Prescription.objects.filter(patient=patient).exists():
                Prescription.objects.create(
                    patient=patient,
                    doctor_name="Dr. Sarah Johnson",
                    specialization="Cardiology Specialist",
                    hospital_name="HealthLink Central Hospital",
                    medication_name="Atorvastatin",
                    dosage="20mg",
                    frequency="Once daily at bedtime",
                    time_of_day="night",
                    duration_days=30,
                    instructions="Take orally with water.",
                    side_effects="Mild muscle soreness may occur.",
                    refill_status="Active"
                )

        # Baseline welcome notification
        if not Notification.objects.filter(user=request.user).exists():
            Notification.objects.create(
                user=request.user,
                title="Welcome to HealthLink",
                message="Your electronic medical health portal is fully active. Review your real clinical records, schedule visits, and track your health vitals.",
                notification_type="system",
                link="/patient/dashboard"
            )

        # Fetch live data
        vitals = VitalSign.objects.filter(patient=patient).order_by('-recorded_at')
        latest_vital = vitals.first()
        appointments = Appointment.objects.filter(patient=patient).order_by('date', 'time')
        upcoming_apt = appointments.filter(status="Confirmed").first()
        prescriptions = Prescription.objects.filter(patient=patient).order_by('-created_at')
        records = MedicalRecord.objects.filter(patient=patient).order_by('-date')
        unread_notifs = Notification.objects.filter(user=request.user, is_read=False).count()

        return Response({
            "patient": PatientSerializer(patient, context={'request': request}).data,
            "upcoming_appointment": AppointmentSerializer(upcoming_apt).data if upcoming_apt else None,
            "appointments": AppointmentSerializer(appointments, many=True).data,
            "latest_vitals": VitalSignSerializer(latest_vital).data if latest_vital else None,
            "vitals_history": VitalSignSerializer(vitals[:10], many=True).data,
            "prescriptions": PrescriptionSerializer(prescriptions, many=True).data,
            "recent_records": MedicalRecordSerializer(records[:10], many=True).data,
            "unread_notifications_count": unread_notifs
        })


# --- ACCESS REQUESTS & PERMISSION VIEWS ---
class AccessRequestListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        if user.role in ['doctor', 'hospital_staff']:
            doc = Doctor.objects.filter(user=user).first()
            if not doc:
                return Response([])
            requests = AccessRequest.objects.filter(doctor=doc).order_by('-requested_at')
        elif user.role == 'patient':
            patient, _ = Patient.objects.get_or_create(user=user)
            requests = AccessRequest.objects.filter(patient=patient).order_by('-requested_at')
        else:
            requests = AccessRequest.objects.all().order_by('-requested_at')

        return Response(AccessRequestSerializer(requests, many=True).data)

    def post(self, request):
        user = request.user
        if user.role not in ['doctor', 'hospital_staff', 'admin'] and not user.is_superuser:
            return Response(
                {"detail": "Only verified doctors can send patient access requests."},
                status=status.HTTP_403_FORBIDDEN
            )

        doc = Doctor.objects.filter(user=user).first()
        if not doc:
            return Response(
                {"detail": "Doctor profile not found for this user account."},
                status=status.HTTP_400_BAD_REQUEST
            )

        patient_id = request.data.get('patient_id')
        notes = request.data.get('notes', 'Doctor clinical consultation and monitoring request.')

        if not patient_id:
            return Response(
                {"detail": "patient_id is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            patient = Patient.objects.get(id=patient_id)
        except Patient.DoesNotExist:
            return Response(
                {"detail": "Patient with given ID does not exist."},
                status=status.HTTP_404_NOT_FOUND
            )

        # Check existing request
        access_req, created = AccessRequest.objects.get_or_create(
            doctor=doc,
            patient=patient,
            defaults={'status': 'pending', 'notes': notes}
        )

        if not created:
            if access_req.status == 'approved':
                return Response({
                    "detail": "Access has already been approved by this patient.",
                    "request": AccessRequestSerializer(access_req).data
                }, status=status.HTTP_200_OK)
            # Re-request if previously rejected or revoked
            access_req.status = 'pending'
            access_req.approved = False
            access_req.notes = notes
            access_req.requested_at = timezone.now()
            access_req.save()

        # Send notification to patient
        doc_name = f"Dr. {user.first_name} {user.last_name}".strip() or f"Dr. {user.username}"
        hospital_str = f" from {doc.hospital.name}" if doc.hospital else ""
        Notification.objects.create(
            user=patient.user,
            title="Doctor Access Permission Request",
            message=f"{doc_name} ({doc.specialization}){hospital_str} has requested permission to follow your health profile and review medical records.",
            notification_type="system",
            link="/notifications"
        )

        return Response(
            AccessRequestSerializer(access_req).data,
            status=status.HTTP_201_CREATED if created else status.HTTP_200_OK
        )


class AccessRequestRespondView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            access_req = AccessRequest.objects.get(pk=pk)
        except AccessRequest.DoesNotExist:
            return Response({"detail": "Access request not found."}, status=status.HTTP_404_NOT_FOUND)

        if request.user.role == 'patient':
            patient, _ = Patient.objects.get_or_create(user=request.user)
            if access_req.patient != patient:
                return Response({"detail": "You do not have permission to respond to this request."}, status=status.HTTP_403_FORBIDDEN)
        elif not request.user.is_superuser:
            return Response({"detail": "Only the patient can grant or decline access permissions."}, status=status.HTTP_403_FORBIDDEN)

        action = request.data.get('action', '').lower()
        if action not in ['approve', 'reject', 'revoke']:
            return Response({"detail": "Action must be 'approve', 'reject', or 'revoke'."}, status=status.HTTP_400_BAD_REQUEST)

        patient_name = access_req.patient.user.get_full_name() or access_req.patient.user.username

        if action == 'approve':
            access_req.status = 'approved'
            access_req.approved = True
            msg_title = "Access Permission Granted"
            msg_body = f"Patient {patient_name} approved your request to follow and inspect their health records."
        elif action == 'reject':
            access_req.status = 'rejected'
            access_req.approved = False
            msg_title = "Access Request Declined"
            msg_body = f"Patient {patient_name} declined your permission request."
        elif action == 'revoke':
            access_req.status = 'revoked'
            access_req.approved = False
            msg_title = "Access Permission Revoked"
            msg_body = f"Patient {patient_name} revoked access to their health records."

        access_req.responded_at = timezone.now()
        access_req.save()

        # Notify doctor
        if access_req.doctor and access_req.doctor.user:
            Notification.objects.create(
                user=access_req.doctor.user,
                title=msg_title,
                message=msg_body,
                notification_type="system",
                link="/doctor/dashboard"
            )

        return Response(AccessRequestSerializer(access_req).data)


class AccessRequestEmergencyGrantView(APIView):
    """
    Emergency Access Override:
    In critical/acute situations where a patient cannot verify themselves,
    the doctor can obtain immediate emergency access by verifying through the
    patient's registered Emergency Contact.
    """
    permission_classes = [IsAuthenticated, IsDoctor]

    def post(self, request):
        doc = Doctor.objects.filter(user=request.user).first()
        if not doc:
            return Response({"detail": "Doctor profile required."}, status=status.HTTP_400_BAD_REQUEST)

        patient_id = request.data.get('patient_id')
        emergency_reason = request.data.get('emergency_reason', '').strip()
        contact_name = request.data.get('emergency_contact_name', '').strip()
        contact_phone = request.data.get('emergency_contact_phone', '').strip()

        if not patient_id:
            return Response({"detail": "patient_id is required."}, status=status.HTTP_400_BAD_REQUEST)

        if not emergency_reason or len(emergency_reason) < 6:
            return Response(
                {"detail": "A specific medical emergency reason is required to initiate emergency access."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            patient = Patient.objects.get(id=patient_id)
        except Patient.DoesNotExist:
            return Response({"detail": "Patient not found."}, status=status.HTTP_404_NOT_FOUND)

        # Verification against registered emergency contact
        verified = False
        registered_phone = (patient.emergency_contact_phone or "").replace(" ", "").replace("-", "").replace("+", "")
        submitted_phone = contact_phone.replace(" ", "").replace("-", "").replace("+", "")

        registered_name = (patient.emergency_contact_name or "").lower().strip()
        submitted_name = contact_name.lower().strip()

        if submitted_phone and registered_phone and (submitted_phone in registered_phone or registered_phone in submitted_phone):
            verified = True
        elif submitted_name and registered_name and (submitted_name in registered_name or registered_name in submitted_name):
            verified = True
        elif not registered_name and not registered_phone:
            # If the patient has no emergency contact listed, allow emergency override with audited reason
            verified = True

        if not verified:
            return Response({
                "detail": "Emergency verification failed: The provided contact name/phone does not match the patient's registered emergency contact."
            }, status=status.HTTP_400_BAD_REQUEST)

        access_req, _ = AccessRequest.objects.get_or_create(
            doctor=doc,
            patient=patient,
            defaults={'status': 'approved'}
        )

        access_req.status = 'approved'
        access_req.approved = True
        access_req.is_emergency = True
        access_req.emergency_reason = emergency_reason
        access_req.emergency_contact_verified = True
        access_req.emergency_contact_name = contact_name or patient.emergency_contact_name
        access_req.emergency_contact_phone = contact_phone or patient.emergency_contact_phone
        access_req.approved_by_type = 'emergency_contact'
        access_req.responded_at = timezone.now()
        access_req.save()

        # Send urgent notification to the patient
        doc_display = f"Dr. {request.user.first_name} {request.user.last_name}".strip() or f"Dr. {request.user.username}"
        contact_display = contact_name or patient.emergency_contact_name or "Emergency Contact"
        Notification.objects.create(
            user=patient.user,
            title="EMERGENCY CLINICAL ACCESS GRANTED",
            message=f"Emergency clinical access was granted to {doc_display} via verification with your emergency contact ({contact_display}). Reason: {emergency_reason}",
            notification_type="system",
            link="/notifications"
        )

        return Response({
            "detail": "Emergency access granted and verified via emergency contact.",
            "request": AccessRequestSerializer(access_req).data
        }, status=status.HTTP_200_OK)


# --- DOCTOR PATIENTS DIRECTORY & CLINICAL DATA VIEWS ---
class DoctorPatientListView(APIView):
    permission_classes = [IsAuthenticated, IsDoctor]

    def get(self, request):
        doc = Doctor.objects.filter(user=request.user).first()
        search_query = request.query_params.get('search', '').strip()
        filter_type = request.query_params.get('filter', 'my_patients').strip()

        # Determine doctor's permitted patients
        permitted_ids = set(AccessRequest.objects.filter(doctor=doc, status='approved').values_list('patient_id', flat=True)) if doc else set()
        appointment_patient_ids = set(Appointment.objects.filter(doctor=doc).values_list('patient_id', flat=True)) if doc else set()
        record_patient_ids = set(MedicalRecord.objects.filter(doctor=doc).values_list('patient_id', flat=True)) if doc else set()
        my_patient_ids = permitted_ids.union(appointment_patient_ids).union(record_patient_ids)

        if filter_type == 'my_patients' and not search_query:
            patients_qs = Patient.objects.filter(id__in=my_patient_ids).select_related('user')
        else:
            patients_qs = Patient.objects.all().select_related('user')

        if search_query:
            patients_qs = patients_qs.filter(
                Q(user__first_name__icontains=search_query) |
                Q(user__last_name__icontains=search_query) |
                Q(user__username__icontains=search_query) |
                Q(phone_number__icontains=search_query) |
                Q(emergency_contact_phone__icontains=search_query)
            )

        # Map active requests for this doctor
        req_map = {}
        if doc:
            for req in AccessRequest.objects.filter(doctor=doc):
                req_map[req.patient_id] = req

        data = []
        today = date.today()
        for p in patients_qs:
            req = req_map.get(p.id)
            perm_status = req.status if req else 'none'
            has_perm = (perm_status == 'approved') or (p.id in appointment_patient_ids)

            age = None
            if p.date_of_birth:
                dob = p.date_of_birth
                age = today.year - dob.year - ((today.month, today.day) < (dob.month, dob.day))

            last_record = MedicalRecord.objects.filter(patient=p).order_by('-date').first()
            last_vital = VitalSign.objects.filter(patient=p).order_by('-recorded_at').first()
            last_visit_str = "No visits yet"
            if last_record:
                last_visit_str = last_record.date.strftime("%d %b %Y")
            elif last_vital:
                last_visit_str = last_vital.recorded_at.strftime("%d %b %Y")

            data.append({
                "id": p.id,
                "name": f"{p.user.first_name} {p.user.last_name}".strip() or p.user.username,
                "username": p.user.username,
                "email": p.user.email,
                "age": age or 25,
                "blood": p.blood_type or "O+",
                "phone": p.phone_number or p.emergency_contact_phone or "+251 900 000 000",
                "gender": p.gender or "Unspecified",
                "emergency_contact_name": p.emergency_contact_name,
                "emergency_contact_relationship": p.emergency_contact_relationship,
                "has_emergency_contact": bool(p.emergency_contact_name or p.emergency_contact_phone),
                "lastVisit": last_visit_str,
                "permission_status": perm_status,
                "permission_id": req.id if req else None,
                "is_emergency_approved": req.is_emergency if req else False,
                "has_permission": has_perm,
                "is_my_patient": p.id in my_patient_ids,
                "status": "Active" if has_perm else ("Pending" if perm_status == 'pending' else "Not Permitted")
            })

        return Response(data)


class DoctorPatientDetailView(APIView):
    permission_classes = [IsAuthenticated, IsDoctor]

    def get(self, request, pk):
        doc = Doctor.objects.filter(user=request.user).first()
        try:
            patient = Patient.objects.select_related('user').get(pk=pk)
        except Patient.DoesNotExist:
            return Response({"detail": "Patient not found."}, status=status.HTTP_404_NOT_FOUND)

        req = AccessRequest.objects.filter(doctor=doc, patient=patient).first() if doc else None
        has_perm = (req is not None and req.status == 'approved') or \
                   (Appointment.objects.filter(doctor=doc, patient=patient).exists()) or \
                   request.user.is_superuser

        if not has_perm:
            perm_status = req.status if req else 'none'
            return Response({
                "error": "permission_denied",
                "permission_status": perm_status,
                "permission_id": req.id if req else None,
                "detail": "Patient permission required. This patient's medical records are with another doctor or hospital. You must send a permission request or verify emergency access before clinical history is accessible.",
                "has_emergency_contact": bool(patient.emergency_contact_name or patient.emergency_contact_phone),
                "patient_preview": {
                    "id": patient.id,
                    "name": f"{patient.user.first_name} {patient.user.last_name}".strip() or patient.user.username,
                    "username": patient.user.username,
                    "gender": patient.gender,
                    "emergency_contact_relationship": patient.emergency_contact_relationship or "Family/Relative"
                }
            }, status=status.HTTP_403_FORBIDDEN)

        # Full clinical data view
        vitals = VitalSign.objects.filter(patient=patient).order_by('-recorded_at')
        records = MedicalRecord.objects.filter(patient=patient).order_by('-date')
        appointments = Appointment.objects.filter(patient=patient).order_by('-date')
        prescriptions = Prescription.objects.filter(patient=patient).order_by('-created_at')

        return Response({
            "patient": PatientSerializer(patient).data,
            "has_permission": True,
            "permission_status": "approved",
            "is_emergency_access": req.is_emergency if req else False,
            "approved_by": req.approved_by_type if req else "patient",
            "vitals": VitalSignSerializer(vitals[:30], many=True).data,
            "latest_vitals": VitalSignSerializer(vitals.first()).data if vitals.exists() else None,
            "medical_records": MedicalRecordSerializer(records, many=True).data,
            "appointments": AppointmentSerializer(appointments, many=True).data,
            "prescriptions": PrescriptionSerializer(prescriptions, many=True).data,
        })



class DoctorDashboardSummaryView(APIView):
    permission_classes = [IsAuthenticated, IsDoctor]

    def get(self, request):
        doc = Doctor.objects.filter(user=request.user).first()
        if not doc:
            hospital = Hospital.objects.first()
            doc = Doctor.objects.create(
                user=request.user,
                hospital=hospital,
                specialization="General Medicine",
                license_number=f"DOC-{request.user.id:04d}",
                years_of_experience=3
            )

        total_patients = Patient.objects.count()
        permitted_patients = AccessRequest.objects.filter(doctor=doc, status='approved').count()
        pending_requests = AccessRequest.objects.filter(doctor=doc, status='pending').count()
        
        # Doctor's appointments
        today_val = date.today()
        appointments = Appointment.objects.filter(
            Q(doctor=doc) | Q(doctor_name__icontains=request.user.last_name or request.user.username)
        ).order_by('date', 'time')
        today_appointments = appointments.filter(date=today_val).count()

        # Doctor's medical records
        records = MedicalRecord.objects.filter(doctor=doc).order_by('-date')
        
        # Unread notifications
        unread_notifs = Notification.objects.filter(user=request.user, is_read=False).count()

        return Response({
            "doctor": DoctorSerializer(doc).data,
            "stats": {
                "total_patients": total_patients,
                "permitted_patients": permitted_patients,
                "pending_requests": pending_requests,
                "today_appointments": today_appointments,
                "total_records": records.count(),
                "unread_notifications": unread_notifs,
            },
            "appointments": AppointmentSerializer(appointments[:10], many=True).data,
            "recent_records": MedicalRecordSerializer(records[:10], many=True).data,
        })

