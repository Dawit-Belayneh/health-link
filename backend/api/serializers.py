from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from hospitals.models import Hospital
from doctors.models import Doctor
from medical_records.models import MedicalRecord
from patients.models import Patient, Appointment, VitalSign, Notification, Prescription
from access_requests.models import AccessRequest
from users.models import User

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        user_data = {
            "id": self.user.id,
            "username": self.user.username,
            "email": self.user.email,
            "first_name": self.user.first_name,
            "last_name": self.user.last_name,
            "role": self.user.role,
        }
        if self.user.role == "patient":
            patient, _ = Patient.objects.get_or_create(user=self.user)
            user_data["patient_id"] = patient.id
        elif self.user.role in ["doctor", "hospital_staff"]:
            doc = Doctor.objects.filter(user=self.user).first()
            if not doc:
                hospital = Hospital.objects.first()
                if not hospital:
                    hospital = Hospital.objects.create(
                        name="HealthLink Central Hospital",
                        address="Bole Sub City, Ring Road, Addis Ababa",
                        phone="+251115517000"
                    )
                doc = Doctor.objects.create(
                    user=self.user,
                    hospital=hospital,
                    specialization="General Medicine",
                    license_number=f"MED-ETH-{self.user.id:04d}",
                    years_of_experience=2
                )
            user_data["doctor_id"] = doc.id
            user_data["specialization"] = doc.specialization
            user_data["license_number"] = doc.license_number
            user_data["hospital_id"] = doc.hospital.id if doc.hospital else None
            user_data["hospital_name"] = doc.hospital.name if doc.hospital else "HealthLink Hospital"
        elif self.user.role == "admin" or self.user.is_superuser:
            hospital = Hospital.objects.first()
            user_data["hospital_id"] = hospital.id if hospital else None
            user_data["hospital_name"] = hospital.name if hospital else "HealthLink Hospital"

        data["user"] = user_data
        return data

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    blood_type = serializers.CharField(max_length=5, required=False, allow_blank=True, default="O+")
    gender = serializers.CharField(max_length=20, required=False, allow_blank=True, default="")
    date_of_birth = serializers.DateField(required=False, allow_null=True)
    phone_number = serializers.CharField(max_length=30, required=False, allow_blank=True, default="")
    address = serializers.CharField(required=False, allow_blank=True, default="")
    allergies = serializers.CharField(required=False, allow_blank=True, default="")
    emergency_contact_name = serializers.CharField(max_length=100, required=False, allow_blank=True, default="")
    emergency_contact_phone = serializers.CharField(max_length=30, required=False, allow_blank=True, default="")
    emergency_contact_relationship = serializers.CharField(max_length=50, required=False, allow_blank=True, default="")
    height = serializers.DecimalField(max_digits=5, decimal_places=2, required=False, allow_null=True)
    weight = serializers.DecimalField(max_digits=5, decimal_places=2, required=False, allow_null=True)
    chronic_conditions = serializers.CharField(required=False, allow_blank=True, default="")
    current_medications = serializers.CharField(required=False, allow_blank=True, default="")
    past_surgeries = serializers.CharField(required=False, allow_blank=True, default="")
    health_notes = serializers.CharField(required=False, allow_blank=True, default="")

    class Meta:
        model = User
        fields = (
            "first_name",
            "last_name",
            "username",
            "email",
            "password",
            "role",
            "blood_type",
            "gender",
            "date_of_birth",
            "phone_number",
            "address",
            "allergies",
            "emergency_contact_name",
            "emergency_contact_phone",
            "emergency_contact_relationship",
            "height",
            "weight",
            "chronic_conditions",
            "current_medications",
            "past_surgeries",
            "health_notes",
        )

    def validate_role(self, value):
        if value and value.lower() != "patient":
            raise serializers.ValidationError(
                "Doctor and hospital staff accounts cannot be registered publicly. "
                "Only patient accounts can be registered. Staff accounts must be created by a hospital administrator."
            )
        return "patient"

    def create(self, validated_data):
        # Extract patient specific fields
        patient_fields = {
            "blood_type": validated_data.pop("blood_type", "O+") or "O+",
            "gender": validated_data.pop("gender", ""),
            "date_of_birth": validated_data.pop("date_of_birth", None),
            "phone_number": validated_data.pop("phone_number", ""),
            "address": validated_data.pop("address", ""),
            "allergies": validated_data.pop("allergies", ""),
            "emergency_contact_name": validated_data.pop("emergency_contact_name", ""),
            "emergency_contact_phone": validated_data.pop("emergency_contact_phone", ""),
            "emergency_contact_relationship": validated_data.pop("emergency_contact_relationship", ""),
            "height": validated_data.pop("height", None),
            "weight": validated_data.pop("weight", None),
            "chronic_conditions": validated_data.pop("chronic_conditions", ""),
            "current_medications": validated_data.pop("current_medications", ""),
            "past_surgeries": validated_data.pop("past_surgeries", ""),
            "health_notes": validated_data.pop("health_notes", ""),
        }

        validated_data["role"] = "patient"
        user = User.objects.create_user(
            first_name=validated_data.get("first_name", ""),
            last_name=validated_data.get("last_name", ""),
            username=validated_data["username"],
            email=validated_data.get("email", ""),
            password=validated_data["password"],
            role="patient",
        )
    
        patient, _ = Patient.objects.get_or_create(user=user)
        for key, val in patient_fields.items():
            if val is not None:
                setattr(patient, key, val)
        patient.save()

        # Send a welcome notification
        try:
            Notification.objects.create(
                user=user,
                title="Welcome to HealthLink!",
                message="Your patient account and clinical health profile have been registered successfully.",
                notification_type="system",
                link="/patient/dashboard"
            )
        except Exception as e:
            pass

        return user

class PatientSerializer(serializers.ModelSerializer):
    user_details = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Patient
        fields = "__all__"

    def get_user_details(self, obj):
        if obj.user:
            return {
                "id": obj.user.id,
                "username": obj.user.username,
                "first_name": obj.user.first_name,
                "last_name": obj.user.last_name,
                "email": obj.user.email,
                "full_name": f"{obj.user.first_name} {obj.user.last_name}".strip() or obj.user.username,
            }
        return None

    def update(self, instance, validated_data):
        request = self.context.get('request')
        if request and request.data:
            user = instance.user
            user_updated = False
            user_data = request.data.get('user_details') if isinstance(request.data.get('user_details'), dict) else {}
            for field in ['first_name', 'last_name', 'email']:
                val = user_data.get(field) if field in user_data else request.data.get(field)
                if val is not None:
                    setattr(user, field, val)
                    user_updated = True
            if user_updated:
                user.save()
        return super().update(instance, validated_data)
        
class HospitalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hospital
        fields = "__all__"

class DoctorSerializer(serializers.ModelSerializer):
    user_details = serializers.SerializerMethodField(read_only=True)
    hospital_details = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Doctor
        fields = "__all__"

    def get_user_details(self, obj):
        if obj.user:
            name = f"{obj.user.first_name} {obj.user.last_name}".strip()
            return {
                "id": obj.user.id,
                "username": obj.user.username,
                "first_name": obj.user.first_name,
                "last_name": obj.user.last_name,
                "full_name": f"Dr. {name}" if name else f"Dr. {obj.user.username}",
                "email": obj.user.email,
                "role": obj.user.role,
            }
        return None

    def get_hospital_details(self, obj):
        if obj.hospital:
            return {
                "id": obj.hospital.id,
                "name": obj.hospital.name,
                "address": obj.hospital.address,
                "phone": obj.hospital.phone,
            }
        return None

    def update(self, instance, validated_data):
        request = self.context.get('request')
        if request and request.data:
            user = instance.user
            user_updated = False
            user_data = request.data.get('user_details') if isinstance(request.data.get('user_details'), dict) else {}
            for field in ['first_name', 'last_name', 'email']:
                val = user_data.get(field) if field in user_data else request.data.get(field)
                if val is not None:
                    setattr(user, field, val)
                    user_updated = True
            if user_updated:
                user.save()

            if 'specialization' in request.data:
                instance.specialization = request.data['specialization']
            if 'license_number' in request.data:
                instance.license_number = request.data['license_number']
            if 'years_of_experience' in request.data:
                instance.years_of_experience = request.data['years_of_experience']
            instance.save()

        return super().update(instance, validated_data)


class MedicalRecordSerializer(serializers.ModelSerializer):
    doctor_name = serializers.SerializerMethodField(read_only=True)
    doctor_specialization = serializers.SerializerMethodField(read_only=True)
    hospital_name = serializers.SerializerMethodField(read_only=True)
    patient_name = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = MedicalRecord
        fields = "__all__"
        extra_kwargs = {
            'doctor': {'required': False}
        }

    def get_doctor_name(self, obj):
        if obj.doctor and obj.doctor.user:
            name = f"{obj.doctor.user.first_name} {obj.doctor.user.last_name}".strip()
            return f"Dr. {name}" if name else f"Dr. {obj.doctor.user.username}"
        return "Doctor"

    def get_doctor_specialization(self, obj):
        return obj.doctor.specialization if (obj.doctor and obj.doctor.specialization) else "General Medicine"

    def get_hospital_name(self, obj):
        if obj.doctor and obj.doctor.hospital:
            return obj.doctor.hospital.name
        return "HealthLink Hospital"

    def get_patient_name(self, obj):
        if obj.patient and obj.patient.user:
            return f"{obj.patient.user.first_name} {obj.patient.user.last_name}".strip() or obj.patient.user.username
        return "Patient"

class AppointmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = "__all__"
        extra_kwargs = {
            'patient': {'required': False}
        }

class VitalSignSerializer(serializers.ModelSerializer):
    class Meta:
        model = VitalSign
        fields = "__all__"
        extra_kwargs = {
            'patient': {'required': False}
        }

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = "__all__"
        extra_kwargs = {
            'user': {'required': False}
        }

class PrescriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Prescription
        fields = "__all__"
        extra_kwargs = {
            'patient': {'required': False}
        }


class DoctorCreateByAdminSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    password = serializers.CharField(write_only=True, min_length=6)
    first_name = serializers.CharField(max_length=150, required=False, allow_blank=True, default="")
    last_name = serializers.CharField(max_length=150, required=False, allow_blank=True, default="")
    email = serializers.EmailField(required=False, allow_blank=True, default="")
    hospital = serializers.PrimaryKeyRelatedField(queryset=Hospital.objects.all(), required=False)
    specialization = serializers.CharField(max_length=100)
    license_number = serializers.CharField(max_length=50)
    years_of_experience = serializers.IntegerField(default=0, min_value=0)
    role = serializers.ChoiceField(choices=["doctor", "hospital_staff"], default="doctor")

    def validate_username(self, value):
        if User.objects.filter(username__iexact=value).exists():
            raise serializers.ValidationError("A user with this username already exists.")
        return value

    def validate_license_number(self, value):
        if Doctor.objects.filter(license_number__iexact=value).exists():
            raise serializers.ValidationError("A doctor with this medical license number already exists.")
        return value

    def create(self, validated_data):
        hospital = validated_data.get('hospital')
        if not hospital:
            hospital = Hospital.objects.first()
            if not hospital:
                hospital = Hospital.objects.create(
                    name="HealthLink Central Hospital",
                    address="Addis Ababa, Ethiopia",
                    phone="+251115517000"
                )

        user = User.objects.create_user(
            username=validated_data["username"],
            password=validated_data["password"],
            first_name=validated_data.get("first_name", ""),
            last_name=validated_data.get("last_name", ""),
            email=validated_data.get("email", ""),
            role=validated_data.get("role", "doctor"),
            hospital=hospital
        )

        doctor = Doctor.objects.create(
            user=user,
            hospital=hospital,
            specialization=validated_data["specialization"],
            license_number=validated_data["license_number"],
            years_of_experience=validated_data.get("years_of_experience", 0)
        )
        return doctor


class AccessRequestSerializer(serializers.ModelSerializer):
    doctor_details = serializers.SerializerMethodField(read_only=True)
    patient_details = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = AccessRequest
        fields = "__all__"
        extra_kwargs = {
            'doctor': {'required': False},
            'patient': {'required': False}
        }

    def get_doctor_details(self, obj):
        if obj.doctor and obj.doctor.user:
            u = obj.doctor.user
            doc_name = f"Dr. {u.first_name} {u.last_name}".strip() if (u.first_name or u.last_name) else f"Dr. {u.username}"
            return {
                "id": obj.doctor.id,
                "name": doc_name,
                "username": u.username,
                "email": u.email,
                "specialization": obj.doctor.specialization,
                "license_number": obj.doctor.license_number,
                "hospital_name": obj.doctor.hospital.name if obj.doctor.hospital else "HealthLink Hospital",
            }
        return None

    def get_patient_details(self, obj):
        if obj.patient and obj.patient.user:
            pu = obj.patient.user
            age = None
            if obj.patient.date_of_birth:
                from datetime import date
                today = date.today()
                dob = obj.patient.date_of_birth
                age = today.year - dob.year - ((today.month, today.day) < (dob.month, dob.day))
            return {
                "id": obj.patient.id,
                "name": f"{pu.first_name} {pu.last_name}".strip() or pu.username,
                "username": pu.username,
                "email": pu.email,
                "phone": obj.patient.phone_number or obj.patient.emergency_contact_phone,
                "blood_type": obj.patient.blood_type,
                "gender": obj.patient.gender,
                "age": age,
            }
        return None

