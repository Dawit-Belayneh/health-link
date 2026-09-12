from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    ROLE_CHOICES = (
        ("patient", "Patient"),
        ("doctor", "Doctor"),
        ("hospital_staff", "Hospital Staff"),
        ("admin", "Admin"),
    )
    role = models.CharField(max_length=30, choices=ROLE_CHOICES, default="patient")
    hospital = models.ForeignKey('hospitals.Hospital', null=True, blank=True, on_delete=models.SET_NULL, related_name='affiliated_users')