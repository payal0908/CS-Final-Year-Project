from os import read
from rest_framework.serializers import ModelSerializer
from .models import *

# serializing user model
class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']

# serializing flow user model for profile details
class FlowUserProfileSerializer(ModelSerializer):
    class Meta:
        model = FlowUser
        fields = '__all__'

class FlowUserSerializer(ModelSerializer):
    class Meta:
        model = FlowUser
        fields = ['user']

class ActivitiesListSerializer(ModelSerializer):
    attendees = UserSerializer(read_only=True, many=True)
    created_by = UserSerializer(read_only=False)
    class Meta:
        model = Activities
        fields = ['id', 'name', 'description', 'location', 'date', 'time',
        'image', 'created_at', 'updated', 'created_by', 'attendees']

class CompletedActivitiesListSerializer(ModelSerializer):
    participants = UserSerializer(read_only=True, many=True)
    created_by = UserSerializer(read_only=False)
    class Meta:
        model = CompletedActivities
        fields = ['id', 'name', 'location', 'date', 'time',
         'created_by', 'participants']

class ActivitiesSerializer(ModelSerializer):
    created_by = UserSerializer(read_only=False)
    attendees = UserSerializer(read_only=True, many=True)
    class Meta:
        model = Activities
        fields = ('name', 'description', 'location', 'date', 'time', 'image', 'created_by', 'attendees')

