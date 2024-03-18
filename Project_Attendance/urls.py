from django.contrib import admin
from django.urls import path, include
from . import views
from django.conf.urls.static import static
from django.conf import settings
from .views import check_in_out

urlpatterns = [
    path('', views.regular_login, name='regular_login'),
    path('login/', views.regular_login, name='regular_login'),
    path('userdashboard/', views.user_dashboard, name='user_dashboard'),
    path('admindashboard/', views.admin_dashboard, name='admin_dashboard'),
    path('userManagement/', views.user_management, name='user_management'),
    path('logout/',views.user_logout,name='user_logout'),
    path('changePassword/',views.change_password,name='change_password'),
    path('userHistory/',views.User_History,name='User_History'),
    path('adminHistory/',views.Admin_History,name='Admin_History'),
    path('check/',views.check_in_out,name='check_in_out'),
    path('btnDisplay/',views.btn_Display,name='btn_Display'),

] 
