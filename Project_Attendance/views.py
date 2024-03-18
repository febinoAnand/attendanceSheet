from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login ,logout
from django.contrib.auth.models import User
from .models import UserDetails
from django.contrib import messages
from django.urls import reverse
from django.views.decorators.csrf import csrf_protect
from django.contrib.auth.decorators import login_required
from django.contrib.auth import update_session_auth_hash
from django.contrib.auth.forms import PasswordChangeForm
from .models import CheckInOut
from datetime import date, time
from pytz import timezone 
from datetime import datetime
from django.http import HttpResponse,JsonResponse

@csrf_protect
def regular_login(request):
    if request.method == "POST":
        email = request.POST.get("email")
        password = request.POST.get("password")
        currentUser = User.objects.filter(email=email).first()
        if currentUser is not None:
            user = authenticate(username=currentUser.username, password=password)
            
            if user is not None:
                request.session['user_id'] = user.id
                request.session['user_type'] = 'admin' if user.is_superuser else 'regular'  
                if user.is_superuser:
                    return redirect('admin_dashboard')
                else:
                    return redirect('user_dashboard')
            else:
                messages.error(request, "Invalid email or password.")
                return redirect(reverse('regular_login'))
        else:
            messages.error(request, "User does not exist.")
            return redirect(reverse('regular_login'))
    return render(request, 'Login.html')


def user_dashboard(request):
    user_id = request.session.get('user_id')
    print(user_id)
    if request.session.get('user_type') == 'regular':
        context = {'user_id': user_id}
        return render(request, 'Userdashboard.html',context)
    else:
        return redirect(reverse('regular_login'))  


def admin_dashboard(request):
    if request.session.get('user_type') == 'admin':
        return render(request, 'AdminDashboard.html')
    else:
        return redirect(reverse('regular_login')) 


def user_logout(request):
    if 'user_type' in request.session:
        del request.session['user_type']  
    return redirect(reverse('regular_login'))


def change_password(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        new_password = request.POST.get('new_password')
        password_confirmation = request.POST.get('password_confirmation')

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            messages.error(request, 'No user found with this email address.')
            return redirect('change_password')

        if new_password == password_confirmation:
            user.set_password(new_password)
            user.save()
            messages.success(request, 'Your password was successfully updated!')
            return redirect('change_password')
        else:
            messages.error(request, 'Password confirmation does not match.')
            return redirect('change_password')

    return render(request, 'userChangePassword.html')



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
                user_details = UserDetails.objects.create(user=user, employee_id=employee_id)
                messages.success(request, "Your account was successfully created.")
                return redirect('/login/')
            except Exception as e:
                messages.error(request, f"An error occurred: {str(e)}")
    users = User.objects.all()
    return render(request, 'UserManagement.html',{'users': users})


def User_History(request):
    user_id = request.session.get('user_id')
    history=CheckInOut.objects.filter(user_id=user_id).order_by('-id')
    print(history)
    return render(request,'userHistory.html',{'history': history})

def Admin_History(request):
    return render(request,'AdminHistory.html')


def btn_Display(request):
    user_id = request.session.get('user_id')
    last_check_ins = CheckInOut.objects.filter(user_id=user_id).order_by('-id')
    if last_check_ins.exists():
        last_check_in = last_check_ins.first()
        status = last_check_in.status
        print(status)
        data = {
            "status": last_check_in.status,
            "user_id": user_id
        }
        return JsonResponse(data)
    else:
        data={
            "error":"No check-ins found for this user.",
            "user_id": user_id
        }
        return JsonResponse(data)



def check_in_out(request):
    if request.method == "POST":
        user_id = request.POST.get("user_id")
        status = request.POST.get("status")


        current_date = date.today()
        current_time = datetime.now(timezone("Asia/Kolkata")).strftime('%H:%M:%S.%f')

        if status == 'check-in':
        
            check_in_out = CheckInOut(user_id=user_id, date=current_date, status=status, check_in_time=current_time)
            check_in_out.save()
        elif status == 'check-out':
            last_check_in = CheckInOut.objects.filter(user_id=user_id, status='check-in').order_by('-id').first()
            if last_check_in:
                last_check_in.status='check-out'
                last_check_in.check_out_time = current_time
                last_check_in.save()
                return HttpResponse('updated')
            else:
                return HttpResponse('No corresponding check-in record found for user ID {}'.format(user_id))
        
        return HttpResponse('Saved')

    return HttpResponse('Error: Request method should be POST')

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
