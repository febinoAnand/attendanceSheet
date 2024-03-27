from django.contrib import admin

from .models import CheckInOut
# Register your models here.
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import User
class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'last_login')

class CustomDisplay(admin.ModelAdmin):
    list_display = ('date', 'status', 'check_in_time', 'check_out_time','get_Username')


    def get_Username(self,obj):
        return ""+obj.user.username



admin.site.register(CheckInOut,CustomDisplay)

admin.site.unregister(User)
admin.site.register(User, CustomUserAdmin)