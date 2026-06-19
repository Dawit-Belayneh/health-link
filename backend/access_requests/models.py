from django.db import models
from doctors.models import Doctor
from patients.models import Patient

class AccessRequest(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE)
    approved = models.BooleanField(default=False)
    requested_at = models.DataTimeField(auto_now_add=True)