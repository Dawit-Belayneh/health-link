from django.urls import path
from . import views
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('signup/', views.RegisterView.as_view(), name="signup"),
    path('login/', views.CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('hospital/', views.HospitalListCreateView.as_view(), name='hospital-list-create'),
    path('hospitals/<int:pk>/', views.HospitalDetailView.as_view(), name='hospital-detail'),
    path('patient/me/', views.PatientMeView.as_view(), name='patient-me'),
    path('doctor/me/', views.DoctorMeView.as_view(), name='doctor-me'),
    path('user/me/', views.UserMeView.as_view(), name='user-me'),
    path('patient/', views.PatientListCreateView.as_view(), name='patient-list-create'),
    path('patients/<int:pk>/', views.PatientDetailView.as_view(), name='patient-detail'),
    path('doctor/', views.DoctorListCreateView.as_view(), name='doctor-list-create'),
    path('doctors/<int:pk>/', views.DoctorDetailView.as_view(), name='doctor-detail'),
    path('medical_record/', views.MedicalRecordListCreateView.as_view(), name='medical-record-list-create'),
    path('medical_records/<int:pk>/', views.MedicalRecordDetailView.as_view(), name='medical-records-detail'),
    path('patient/dashboard-summary/', views.PatientDashboardSummaryView.as_view(), name='patient-dashboard-summary'),
    path('appointments/', views.AppointmentListCreateView.as_view(), name='appointment-list-create'),
    path('appointments/<int:pk>/', views.AppointmentDetailView.as_view(), name='appointment-detail'),
    path('vitals/', views.VitalSignListCreateView.as_view(), name='vital-sign-list-create'),
    path('notifications/', views.NotificationListCreateView.as_view(), name='notification-list-create'),
    path('notifications/<int:pk>/', views.NotificationDetailView.as_view(), name='notification-detail'),
    path('notifications/mark-all-read/', views.NotificationMarkAllReadView.as_view(), name='notification-mark-all-read'),
    path('hospital/doctors/', views.HospitalDoctorListCreateView.as_view(), name='hospital-doctor-list-create'),
    path('hospital/doctors/<int:pk>/', views.HospitalDoctorDetailView.as_view(), name='hospital-doctor-detail'),
    path('access-requests/', views.AccessRequestListCreateView.as_view(), name='access-request-list-create'),
    path('access-requests/emergency-grant/', views.AccessRequestEmergencyGrantView.as_view(), name='access-request-emergency-grant'),
    path('access-requests/<int:pk>/respond/', views.AccessRequestRespondView.as_view(), name='access-request-respond'),

    path('doctor/dashboard-summary/', views.DoctorDashboardSummaryView.as_view(), name='doctor-dashboard-summary'),
    path('doctor/patients/', views.DoctorPatientListView.as_view(), name='doctor-patient-list'),
    path('doctor/patients/<int:pk>/', views.DoctorPatientDetailView.as_view(), name='doctor-patient-detail'),
    path('prescriptions/', views.PrescriptionListCreateView.as_view(), name='prescription-list-create'),
    path('prescriptions/<int:pk>/refill/', views.PrescriptionRefillView.as_view(), name='prescription-refill'),
]

