from django.db import models
from hospitals.models import Hospital
from django.conf import settings

class Doctor(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    hospital = models.ForeignKey(Hospital, on_delete=models.CASCADE, related_name="doctors")
    specialization = models.CharField(max_length=100)
    license_number = models.CharField(
        max_length=50,
        unique=True
    )
    years_of_experience = models.PositiveIntegerField(
        default=0
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.user.username
