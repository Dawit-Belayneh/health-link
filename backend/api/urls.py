from django.urls import path
from . import views

urlpatterns = [
    path('hospital/', views.HospitalListCreateView.as_view(), name='hospital-list-create'),
    path('hospitals/<int:pk>/', views.HospitalDetailView.as_view(), name='hospital-detail'),
]
