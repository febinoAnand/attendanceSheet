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
from .models import UserDetails
from django.core import serializers
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError

@csrf_protect
def regular_login(request):
    if request.method == "POST":
        email_or_username = request.POST.get("email_or_username")
        password = request.POST.get("password")
        if not email_or_username:
            messages.error(request, "Please enter your email or username.")
        elif not password:
            messages.error(request, "Please enter your password.")
        else:
            user = None
            currentUser = User.objects.filter(email=email_or_username).first()
            if currentUser is not None:
                user = authenticate(username=currentUser.username, password=password)
            if user is None:
                user = authenticate(username=email_or_username, password=password)
            if user is not None:
                request.session['user_id'] = user.id
                request.session['username'] = user.username
                request.session['user_type'] = 'admin' if user.is_superuser else 'regular'  
                if user.is_superuser:
                    return redirect('admin_dashboard')
                else:
                    return redirect('user_dashboard')
            else:
                messages.error(request, "Invalid User or Password!!!.")
                return render(request, 'Login.html', {'email_or_username': email_or_username, 'password': password})
             
      
        return render(request, 'Login.html', {'email_or_username': email_or_username, 'password': password})
    
    return render(request, 'Login.html')


def user_dashboard(request):
    
    
    if request.session.get('user_type') == 'regular':
         user_id = request.session.get('user_id')
         username=request.session.get('username')
         name=username.capitalize()
         context = {'user_id': user_id,'username':name}
         return render(request, 'Userdashboard.html',context)
    else:
        return redirect(reverse('regular_login'))  


def admin_dashboard(request):
    if request.session.get('user_type') == 'admin':
        username=request.session.get('username')
        name=username.capitalize()
        checkIn_count = CheckInOut.objects.filter(status='check-in').count()
        checkIn_users = CheckInOut.objects.filter(status='check-in')
        active_user_count = User.objects.filter(is_active=True, is_superuser=False).count()
        active_user_count-=checkIn_count
        employee_data = []
        for user in checkIn_users:
            user_data = {
                'username': user.user.username,
                'employee_id': user.user.userdetails.employee_id,
                'check_in_time': user.check_in_time
            }
            employee_data.append(user_data)
        context = {
            'absent':active_user_count,
            'checkIn_count': checkIn_count,
            'employee_data': employee_data,
            'username':name,
        }
        return render(request, 'AdminDashboard.html', context)
    else:
        return redirect(reverse('regular_login'))

 


def user_logout(request):
    if 'user_type' in request.session:
        del request.session['user_type']  
    return redirect(reverse('regular_login'))


from django.contrib.auth import authenticate

def change_password(request):
    if request.session.get('user_type') == 'regular':
        username = request.session.get('username')
        name = username.capitalize() 
        if request.method == 'POST':
            old_password = request.POST.get('Old_Password')
            new_password = request.POST.get('new_password')
            password_confirmation = request.POST.get('password_confirmation')
            if not (username and old_password and new_password and password_confirmation):
                messages.error(request, "All fields are required.")
                return render(request,'userChangePassword.html',{'oldPassword':old_password,'newPassword':new_password,'re-enterPassword':password_confirmation})
            else:
                try:
                    user = User.objects.get(username=username)
                except User.DoesNotExist:
                    messages.error(request, 'Something went wrong! Please try again later.')
                    return render(request,'userChangePassword.html',{'oldPassword':old_password,'newPassword':new_password,'reenterPassword':password_confirmation})
                else:
                    if not user.check_password(old_password):
                        messages.error(request, 'Old password is incorrect.')
                        return render(request,'userChangePassword.html',{'oldPassword':old_password,'newPassword':new_password,'reenterPassword':password_confirmation})
                    elif user.check_password(new_password):
                        messages.error(request,'Old password and New Password should not be same')
                        return render(request,'userChangePassword.html',{'oldPassword':old_password,'newPassword':new_password,'reenterPassword':password_confirmation})
                    elif new_password != password_confirmation:
                        messages.error(request, 'Password confirmation does not match.')
                        return render(request,'userChangePassword.html',{'oldPassword':old_password,'newPassword':new_password,'reenterPassword':password_confirmation})
                    else:
                        try:
                            validate_password(new_password, user=user)
                        except ValidationError as e:
                            messages.error(request, '\n'.join(e))
                            return render(request,'userChangePassword.html',{'oldPassword':old_password,'newPassword':new_password,'reenterPassword':password_confirmation})
                        else:
                            user.set_password(new_password)
                            user.save()
                            messages.success(request, 'Your password was successfully updated!')
                           
    else:
        return redirect(reverse('regular_login'))
    
    return render(request, 'userChangePassword.html', {'username': name})
   



def user_management(request):
    
    if request.session.get('user_type') == 'admin':
            username=request.session.get('username')
            name=username.capitalize()
            if request.method == "POST":
                username = request.POST.get("username")
                employee_id = request.POST.get("employee_id")
                email = request.POST.get("email")
                password = request.POST.get("password")
                if not (username and employee_id and email and password):
                    return ("All fields are required.")
                else:
                    try:
                        user = User.objects.create_user(username=username, email=email, password=password)
                        user_details = UserDetails.objects.create(user=user, employee_id=employee_id)
                        return HttpResponse("Your account was successfully created.")
                    except Exception as e:
                        return HttpResponse(f"An error occurred: {str(e)}")
            user_details = UserDetails.objects.filter(user__in=User.objects.all())
            users =User.objects.filter(is_superuser=False)
            return render(request, 'UserManagement.html', {'users': users, 'user_details': user_details,'username':name})
    
    else:
        return redirect(reverse('regular_login'))

def update_is_active(request):
    if request.method == 'POST':
        user_id = request.POST.get('userId')
        new_is_active = request.POST.get('isActive')
        try:
            user = User.objects.get(id=user_id)
            user.is_active = new_is_active
            user.save()
            return JsonResponse({'is_active': user.is_active})
        except User.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=400)

def User_History(request):
    if request.session.get('user_type') == 'regular':
        user_id = request.session.get('user_id')
        username=request.session.get('username')
        name=username.capitalize()
        history=CheckInOut.objects.filter(user_id=user_id).order_by('-id')
        print(history)
        return render(request,'userHistory.html',{'history': history,'username':name})
    else:
        return redirect(reverse('regular_login'))
    

def Admin_History(request):
     if request.session.get('user_type') == 'admin':
        username=request.session.get('username')
        name=username.capitalize()
        checkinout_data = CheckInOut.objects.all()
        context = {
                    'checkinout_data': checkinout_data,
                    'username':name,
                }
        return render(request,'AdminHistory.html',context)
     
     else:
        return redirect(reverse('regular_login'))

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

def delete_user(request):
    if request.method == 'POST':
        try:
            user_id = request.POST.get('user_id')
            user_to_delete = User.objects.get(id=user_id)
            
            try:
                user_details = UserDetails.objects.get(user=user_to_delete)
                user_details.delete()
            except UserDetails.DoesNotExist:
                pass
            

            CheckInOut.objects.filter(user_id=user_id).delete()
            
            user_to_delete.delete()
            
            return HttpResponse("User deleted successfully.")
        except User.DoesNotExist:
            return HttpResponse("User does not exist.")
        except Exception as e:
            return HttpResponse(f"An error occurred: {str(e)}")
    else:
        return redirect('/userManagement')
    
user_id=None

def edit_user(request):
    if request.method == 'POST':
        try:
           global user_id
           user_id = request.POST.get('user_id')
           user_to_edit = User.objects.get(id=user_id)
           user_details = user_to_edit.userdetails
           employee_id = user_details.employee_id if user_details else None
           user_data = [{'id': user_to_edit.id, 'username': user_to_edit.username, 'email': user_to_edit.email ,'employee_id':employee_id}]
           return JsonResponse(user_data, safe=False)
        except User.DoesNotExist:
            return HttpResponse("User does not exist.")
        
def saveEdit(request):
    global user_id
    if request.method == 'POST':
        try:
            username=request.POST.get('username')
            employee_id=request.POST.get('employee_id')
            email=request.POST.get('email')
            password=request.POST.get('password')
            user = User.objects.get(id=user_id)
            user.username = username
            user.employee_id = employee_id
            user.email = email
            user.set_password(password)
            user.save()
            return HttpResponse("success")
        except:
            return HttpResponse("nothing")

    return HttpResponse(user_id)

def Admin_History_Table(request):
    if request.method == 'POST':
        from_date = request.POST.get('From_date')
        to_date = request.POST.get('To_date')
        print(from_date, to_date)
        checkinout_data_queryset = CheckInOut.objects.filter(date__range=(from_date, to_date)).select_related('user', 'user__userdetails')
        serialized_data = []
        for obj in checkinout_data_queryset:
            data = {
                'id': obj.id,
                'date': obj.date.strftime("%B %d, %Y"),
                'user': obj.user.username,
                'employee_id': obj.user.userdetails.employee_id,
                'check_in_time':obj.check_in_time.strftime("%I:%M %p"),
                'check_out_time':obj.check_out_time
            }
            serialized_data.append(data)
        response_data = {
            'checkinout_data': serialized_data,
        }
        return JsonResponse(response_data, safe=False)
    else:
        return HttpResponse("Only POST requests are allowed for this endpoint.")




def check_IfExists(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        email = request.POST.get('email')

        username_exists = User.objects.filter(username=username).exists()
        email_exists = User.objects.filter(email=email).exists()

        response_data = []

        if username_exists:
            response_data.append({'field': 'username', 'message': 'Username already exists.'})
        else:
            response_data.append({'field': 'username', 'message': 'Username does not exist.'})

        if email_exists:
            response_data.append({'field': 'email', 'message': 'Email already exists.'})
        else:
            response_data.append({'field': 'email', 'message': 'Email does not exist.'})

        return JsonResponse(response_data, safe=False)

