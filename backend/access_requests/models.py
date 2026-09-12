from django.db import models
from doctors.models import Doctor
from patients.models import Patient

class AccessRequest(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('revoked', 'Revoked'),
    ]

    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='access_requests')
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name='access_requests')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    approved = models.BooleanField(default=False)
    notes = models.TextField(blank=True, default='')
    is_emergency = models.BooleanField(default=False)
    emergency_reason = models.TextField(blank=True, default='')
    emergency_contact_verified = models.BooleanField(default=False)
    emergency_contact_name = models.CharField(max_length=150, blank=True, default='')
    emergency_contact_phone = models.CharField(max_length=50, blank=True, default='')
    approved_by_type = models.CharField(max_length=50, default='patient') # 'patient' or 'emergency_contact'
    requested_at = models.DateTimeField(auto_now_add=True)
    responded_at = models.DateTimeField(null=True, blank=True)


    class Meta:
        ordering = ['-requested_at']

    def save(self, *args, **kwargs):
        self.approved = (self.status == 'approved')
        super().save(*args, **kwargs)

    def __str__(self):
        return f"AccessRequest: Dr. {self.doctor.user.username} -> Patient {self.patient.user.username} ({self.status})"