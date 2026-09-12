from django.db import models
from django.conf import settings

class Patient(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='patient_profile')
    blood_type = models.CharField(max_length=3, choices=[('A+', 'A+'), ('A-', 'A-'), ('B+', 'B+'), ('B-', 'B-'), ('AB+', 'AB+'), ('AB-', 'AB-'), ('O+', 'O+'), ('O-', 'O-')])
    GENDER_CHOICES = [
        ("Male", "Male"),
        ("Female", "Female"),
    ]

    allergies = models.TextField(blank=True)
    emergency_contact_name = models.CharField(max_length=100, blank=True)
    emergency_contact_phone = models.CharField(max_length=20, blank=True)
    emergency_contact_relationship = models.CharField(max_length=50, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    gender =  models.CharField(max_length=10, choices=GENDER_CHOICES, blank=True)
    phone_number = models.CharField(max_length=20, blank=True)
    address = models.TextField(blank=True)
    height = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    weight = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        null=True,
        blank=True
    )
    chronic_conditions = models.TextField(blank=True)
    current_medications = models.TextField(blank=True)
    past_surgeries = models.TextField(blank=True)
    health_notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    def __str__(self):
        return self.user.get_full_name() or self.user.username



class Appointment(models.Model):
    STATUS_CHOICES = [
        ("Confirmed", "Confirmed"),
        ("Completed", "Completed"),
        ("Cancelled", "Cancelled"),
    ]
    TYPE_CHOICES = [
        ("In-Person", "In-Person"),
        ("Telehealth", "Telehealth"),
    ]

    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='appointments')
    doctor = models.ForeignKey('doctors.Doctor', on_delete=models.SET_NULL, null=True, blank=True, related_name='appointments')
    doctor_name = models.CharField(max_length=150, blank=True)
    specialization = models.CharField(max_length=150, blank=True)
    hospital_name = models.CharField(max_length=200, blank=True)
    date = models.DateField()
    time = models.CharField(max_length=50)  # e.g. "10:30 AM"
    appointment_type = models.CharField(max_length=50, choices=TYPE_CHOICES, default="In-Person")
    room = models.CharField(max_length=100, blank=True)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default="Confirmed")
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['date', 'time']

    def __str__(self):
        return f"{self.patient} - {self.doctor_name} ({self.date} {self.time})"


class VitalSign(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='vitals')
    systolic = models.IntegerField(default=120)
    diastolic = models.IntegerField(default=80)
    heart_rate = models.IntegerField(default=72)
    oxygen_level = models.IntegerField(default=98)
    temperature = models.DecimalField(max_digits=4, decimal_places=1, default=36.6)
    blood_glucose = models.IntegerField(default=94)
    recorded_at = models.DateTimeField(auto_now_add=True)
    notes = models.TextField(blank=True)

    class Meta:
        ordering = ['-recorded_at']

    def __str__(self):
        return f"Vitals for {self.patient} at {self.recorded_at.strftime('%Y-%m-%d %H:%M')}"


class Notification(models.Model):
    TYPE_CHOICES = [
        ("appointment", "Appointment"),
        ("prescription", "Prescription"),
        ("record", "Medical Record"),
        ("system", "System"),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='notifications')
    title = models.CharField(max_length=200)
    message = models.TextField()
    notification_type = models.CharField(max_length=50, choices=TYPE_CHOICES, default="system")
    is_read = models.BooleanField(default=False)
    link = models.CharField(max_length=200, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Notification for {self.user.username}: {self.title}"


class Prescription(models.Model):
    REFILL_CHOICES = [
        ("Active", "Active"),
        ("Refill Needed", "Refill Needed"),
        ("Refill Requested", "Refill Requested"),
        ("Completed", "Completed"),
    ]

    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='prescriptions')
    doctor = models.ForeignKey('doctors.Doctor', on_delete=models.SET_NULL, null=True, blank=True, related_name='prescriptions')
    doctor_name = models.CharField(max_length=150, blank=True)
    specialization = models.CharField(max_length=150, blank=True)
    hospital_name = models.CharField(max_length=200, blank=True)
    medication_name = models.CharField(max_length=150)
    dosage = models.CharField(max_length=100)
    frequency = models.CharField(max_length=100, default="Once daily")
    time_of_day = models.CharField(max_length=50, default="morning")
    duration_days = models.IntegerField(default=30)
    start_date = models.DateField(auto_now_add=True)
    instructions = models.TextField(blank=True)
    side_effects = models.TextField(blank=True)
    refill_status = models.CharField(max_length=50, choices=REFILL_CHOICES, default="Active")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.medication_name} ({self.dosage}) for {self.patient}"