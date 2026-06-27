from rest_framework import generics
from hospitals.models import Hospital
from patients.models import Patient
from doctors.models import Doctor
from medical_records.models import MedicalRecord
from .serializers import HospitalSerializer, PatientSerializer, DoctorSerializer, MedicalRecordSerializer

class PatientListCreateView(generics.ListCreateAPIView):
    queryset = Patient.object.all()
    serializer_class = PatientSerializer

class PatientDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer

class HospitalListCreateView(generics.ListCreateAPIView):
    queryset = Hospital.objects.all()
    serializer_class = HospitalSerializer

class HospitalDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Hospital.objects.all()
    serializer_class = HospitalSerializer

class DoctorListCreateView(generics.ListCreateAPIView):
    queryset = Doctor.objects.all()
    serializer_class = DoctorSerializer

class DoctorDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Doctor.objects.all()
    serializer_class = DoctorSerializer

class MedicalRecordListCreateView(generics.ListCreateAPIView):
    queryset = MedicalRecord.objects.all()
    serializer_class = MedicalRecordSerializer

class MedicalRecordDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = MedicalRecord.objects.all()
    serializer_class = MedicalRecordSerializer