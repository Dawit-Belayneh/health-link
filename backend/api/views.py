from rest_framework import generics
from rest_framework_simplejwt.views import TokenObtainPairView
from hospitals.models import Hospital
from patients.models import Patient
from doctors.models import Doctor
from medical_records.models import MedicalRecord
from .serializers import (
    HospitalSerializer,
    PatientSerializer,
    DoctorSerializer,
    MedicalRecordSerializer,
    RegisterSerializer,
    CustomTokenObtainPairSerializer,
)
from .permissions import IsPatient, IsHospitalStaff, IsAdmin
from rest_framework.permissions import IsAuthenticated
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
    queryset = Doctor.objects.all()
    serializer_class = DoctorSerializer
    permission_classes = [IsAuthenticated, IsHospitalStaff]

class DoctorDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Doctor.objects.all()
    serializer_class = DoctorSerializer
    permission_classes = [IsAuthenticated, IsHospitalStaff]

class MedicalRecordListCreateView(generics.ListCreateAPIView):
    serializer_class = MedicalRecordSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter]
    search_fields = [
        'diagnosis',
        'treatment',
        'prescription',
        'notes',
        'doctor__user__first_name',
        'doctor__user__last_name',
    ]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'patient':
            return MedicalRecord.objects.filter(patient__user=user).order_by('-date')
        elif user.role == 'hospital_staff':
            return MedicalRecord.objects.all().order_by('-date')
        return MedicalRecord.objects.all().order_by('-date')

class MedicalRecordDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = MedicalRecordSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'patient':
            return MedicalRecord.objects.filter(patient__user=user)
        return MedicalRecord.objects.all()