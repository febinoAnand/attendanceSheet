from django.contrib import admin
from django.urls import path, include
from . import views
from django.conf.urls.static import static
from django.conf import settings


urlpatterns = [
    path('', views.regular_login, name='regular_login'),
    path('login/', views.regular_login, name='regular_login'),
    path('userdashboard/', views.user_dashboard, name='user_dashboard'),
    path('admindashboard/', views.admin_dashboard, name='admin_dashboard'),
    path('userManagement/', views.user_management, name='user_management'),
] 
