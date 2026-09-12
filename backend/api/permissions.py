from rest_framework.permissions import BasePermission, SAFE_METHODS
from access_requests.models import AccessRequest


class IsPatient(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role == "patient"
        )


class IsDoctor(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role in ["doctor", "hospital_staff"]
        )


class IsHospitalStaff(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role in ["hospital_staff", "doctor", "admin"]
        )


class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and (request.user.role == "admin" or request.user.is_staff or request.user.is_superuser)
        )


class CanAccessMedicalRecord(BasePermission):
    """
    Permission rules for Clinical Medical Records:
    1. Patient can view own records, but CANNOT delete or modify doctor records.
    2. Doctor can view if author or patient granted permission. Doctor can create for permitted patients and edit own records.
    3. Hospital Admin can view records ONLY for their own hospital, but CANNOT delete or modify patient medical records.
    """
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False

        user = request.user
        # Patient & Admin CANNOT delete medical records
        if request.method == 'DELETE':
            if user.role in ['patient', 'admin'] and not user.is_superuser:
                return False

        # Patient & Admin CANNOT create or modify medical records
        if request.method in ['POST', 'PUT', 'PATCH']:
            if user.role in ['patient', 'admin'] and not user.is_superuser:
                return False

        return True

    def has_object_permission(self, request, view, obj):
        user = request.user
        if user.is_superuser:
            return True

        if request.method in SAFE_METHODS:
            if user.role == 'patient':
                return obj.patient.user == user

            if user.role in ['doctor', 'hospital_staff']:
                if obj.doctor and obj.doctor.user == user:
                    return True
                # Check approved access request
                doc = getattr(user, 'doctor', None)
                if not doc:
                    from doctors.models import Doctor
                    doc = Doctor.objects.filter(user=user).first()
                if doc:
                    return AccessRequest.objects.filter(
                        doctor=doc, patient=obj.patient, status='approved'
                    ).exists()
                return False

            if user.role == 'admin' or user.is_staff:
                admin_hospital = getattr(user, 'hospital', None)
                if not admin_hospital:
                    from hospitals.models import Hospital
                    admin_hospital = Hospital.objects.first()
                return obj.doctor and obj.doctor.hospital == admin_hospital

        # Patients and Hospital Admins CANNOT modify or delete medical records
        if request.method in ['PUT', 'PATCH']:
            return obj.doctor and obj.doctor.user == user

        if request.method == 'DELETE':
            return False

        return False


class CanManageHospitalDoctor(BasePermission):
    """
    Hospital Admins can only view, update, or delete doctors belonging to their own hospital.
    """
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and (request.user.role == "admin" or request.user.is_staff or request.user.is_superuser)
        )

    def has_object_permission(self, request, view, obj):
        user = request.user
        if user.is_superuser:
            return True

        admin_hospital = getattr(user, 'hospital', None)
        if not admin_hospital:
            from hospitals.models import Hospital
            admin_hospital = Hospital.objects.first()

        return obj.hospital == admin_hospital