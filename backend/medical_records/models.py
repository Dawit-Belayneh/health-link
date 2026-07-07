from django.db import models
from patients.models import Patient
from doctors.models import Doctor

class MedicalRecord(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='medical_records')
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name='medical_records')
    diagnosis = models.TextField()
    treatment = models.TextField()
    date = models.DateTimeField(auto_now_add=True)
    prescription = models.TextField(blank=True)
    notes = models.TextField(blank=True)
    visit_date = models.DateTimeField(auto_now_add=True)