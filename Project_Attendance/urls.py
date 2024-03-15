from django.contrib import admin
from django.urls import path, include
from . import views

urlpatterns = [
    path('login/', views.regular_login, name='login'),
    path('userdashboard/', views.regular_dashboard, name='user_dashboard'),
    path('admindashboard/', views.admin_dashboard, name='admin_dashboard'),
]
