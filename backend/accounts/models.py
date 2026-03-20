from django.db import models

class OTP(models.Model):
    email = models.EmailField()
    otp = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)

    def is_expired(self):
        from datetime import timedelta
        from django.utils.timezone import now
        return now() > self.created_at + timedelta(minutes=5)