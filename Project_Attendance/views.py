from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login

def regular_login(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(username=username, password=password)
        if user is not None and user.is_regularuser:
            login(request, user)
            return redirect('user_dashboard')
    return render(request, 'Login.html')

def admin_login(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(username=username, password=password)
        if user is not None and user.is_adminuser:
            login(request, user)
            return redirect('admin_dashboard')
    return render(request, 'Login.html')

def regular_dashboard(request):
    return render(request, 'Userdashboard.html')

def admin_dashboard(request):
    return render(request, 'AdminDashboard.html')

