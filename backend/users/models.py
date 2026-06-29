from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    ROLE_CHOICES = (
        ("patient", "Patient"),
        ("hospital_staff", "Hospital Staff"),
        ("admin", "Admin"),
    )
    role = models.CharField(max_length=30, choices=ROLE_CHOICES, default="patient")