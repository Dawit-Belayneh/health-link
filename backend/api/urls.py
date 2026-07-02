from django.urls import path
from . import views
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('signup/', views.RegisterView.as_view(), name="signup"),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('hospital/', views.HospitalListCreateView.as_view(), name='hospital-list-create'),
    path('hospitals/<int:pk>/', views.HospitalDetailView.as_view(), name='hospital-detail'),
    path('patient/', views.PatientListCreateView.as_view(), name='patient-list-create'),
    path('patients/<int:pk>/', views.PatientDetailView.as_view(), name='patient-detail'),
    path('doctor/', views.DoctorListCreateView.as_view(), name='doctor-list-create'),
    path('doctors/<int:pk>/', views.DoctorDetailView.as_view(), name='doctor-detail'),
    path('medical_record/', views.MedicalRecordListCreateView.as_view(), name='medical-record-list-create'),
    path('medical_records/<int:pk>/', views.MedicalRecordDetailView.as_view(), name='medical-records-detail'),
]
