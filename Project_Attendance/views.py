from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from django.contrib import messages
from django.urls import reverse
from django.views.decorators.csrf import csrf_protect


def user_list(request):
    users = User.objects.all()
    return render(request, 'user_list.html', {'users': users})

@csrf_protect
def regular_login(request):
    if request.method == "POST":
        email = request.POST.get("email")
        password = request.POST.get("password")
        print("Email:",email)
        currentUser = User.objects.filter(email=email)
        user = authenticate(username=currentUser[0], password=password)
        print("Authenticated user:", user)
        if user is not None:
            login(request, user)
            if user.is_superuser:
                return redirect('admin_dashboard')
            else:
                return redirect('user_dashboard')
        else:
            messages.error(request, "Invalid email or password.")
            print("Authentication failed for email:", email)
            return redirect(reverse('regular_login'))
    return render(request, 'Login.html')


def user_dashboard(request):
    return render(request, 'Userdashboard.html')

def admin_dashboard(request):
    return render(request, 'AdminDashboard.html')

def user_management(request):
    if request.method == "POST":
        username = request.POST.get("username")
        employee_id = request.POST.get("employee_id")
        email = request.POST.get("email")
        password = request.POST.get("password")
        if not (username and employee_id and email and password):
            messages.error(request, "All fields are required.")
        else:
            try:
                user = User.objects.create_user(username=username, email=email, password=password)
                user.employee_id = employee_id
                user.save()
                messages.success(request, "Your account was successfully created.")
                return redirect('/login/')
            except Exception as e:
                messages.error(request, f"An error occurred: {str(e)}")
    users = User.objects.all()
    return render(request, 'UserManagement.html',{'users': users})




"""from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import check_password


plain_text_password = "dd"
User = get_user_model()
user = User.objects.get(email='dhanush@gmail.com')
hashed_password = user.password
print("Hashed password:", hashed_password)
if check_password(plain_text_password, hashed_password):
    print("Password matched!")
else:
    print("Password did not match.")"""
