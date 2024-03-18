from django.db import models
from django.contrib.auth.models import User
from django.contrib.auth.models import AbstractUser

class UserDetails(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    employee_id = models.CharField(max_length=100)
    # Add other fields as needed

    def __str__(self):
        return f"Details for {self.user.username}"


class CheckInOut(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    date = models.DateField()
    status = models.CharField(max_length=20)  # Example: 'check-in' or 'check-out'
    check_in_time = models.TimeField(null=True, blank=True)
    check_out_time = models.TimeField(null=True, blank=True)
