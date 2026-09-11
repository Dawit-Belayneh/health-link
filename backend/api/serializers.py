from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from hospitals.models import Hospital
from doctors.models import Doctor
from medical_records.models import MedicalRecord
from patients.models import Patient
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
        data["user"] = user_data
        return data

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = (
            "first_name",
            "last_name",
            "username",
            "email",
            "password",
            "role",
        )

    def create(self, validated_data):
        user = User.objects.create_user(
            first_name=validated_data["first_name"],
            last_name=validated_data["last_name"],
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"],
            role=validated_data["role"],
        )
    
        if user.role == "patient":
            Patient.objects.create(user=user)

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
    class Meta:
        model = Doctor
        fields = "__all__"

class MedicalRecordSerializer(serializers.ModelSerializer):
    doctor_name = serializers.SerializerMethodField(read_only=True)
    doctor_specialization = serializers.SerializerMethodField(read_only=True)
    hospital_name = serializers.SerializerMethodField(read_only=True)
    patient_name = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = MedicalRecord
        fields = "__all__"

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