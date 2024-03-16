from django.db import models
from django.contrib.auth.models import User

class Attendance(models.Model):
    id = models.AutoField(primary_key=True)
    date = models.DateField(auto_now_add=True)
    time = models.TimeField(auto_now_add=True)
    employee_id = models.CharField(max_length=50)
    checkin = models.DateTimeField(null=True, blank=True)
    checkout = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.employee_id} - {self.date} - {self.time}"

