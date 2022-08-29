from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from django.core.validators import FileExtensionValidator
from django.db.models.signals import post_save
from django.dispatch import receiver
from api.choices import *
# Create your models here.
class Activities(models.Model):
    name = models.TextField()
    description = models.TextField(blank=False)
    location = models.TextField(blank=False)
    date = models.DateField(blank=False)
    time = models.TimeField(blank=False)
    image = models.ImageField(upload_to='posts/', 
                                validators=[FileExtensionValidator(['png', 'jpg', 'jpeg'])],
                                blank=True, null=True)
    created_at = models.DateTimeField(default=timezone.now)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    updated = models.DateTimeField(auto_now=True)
    attendees = models.ManyToManyField(User, blank=True, related_name='attendees')

    class Meta:
        verbose_name_plural = "Activities"

class CompletedActivities(models.Model):
    name = models.TextField()
    location = models.TextField()
    date = models.DateField(blank=False)
    time = models.TimeField(blank=False)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    participants = models.ManyToManyField(User, blank=True, related_name='participants')


class FlowUser(models.Model):
    user = models.OneToOneField(User, primary_key=True, verbose_name='user', related_name='flowuser', on_delete=models.CASCADE)
    name = models.CharField(max_length=100, blank=True, null=True)
    email = models.EmailField(max_length=250, blank=True, null=True)
    neighborhood = models.CharField(max_length=255, choices=neighborhoods)
    display_img = models.ImageField(upload_to='profile/', default='default_profile_img.png', blank=True)

@receiver(post_save, sender=User)
def create_flowuser(sender, instance, created, **kwargs):
    if created:
        flowuser = FlowUser.objects.create(user=instance)
        flowuser.save()
