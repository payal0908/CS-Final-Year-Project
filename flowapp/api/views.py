import datetime
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.shortcuts import render
from django.contrib.auth import login, authenticate, logout
from rest_framework.response import Response
from django.db.models import Q
from rest_framework.decorators import api_view
from .models import *
from .serializers import *
from .forms import *
import geocoder
import json
from rest_framework import status
from django.views import generic
from django.urls import reverse_lazy
from rest_framework.views import APIView

# Create your views here.


from django.contrib.auth.views import PasswordChangeView
from django.contrib.auth.forms import PasswordChangeForm

# view to change password
class PasswordUpdateView(PasswordChangeView):
    form_class = PasswordChangeForm
    success_url = reverse_lazy('passwordSuccess')

# password success view
def passwordSuccess(request):
    user = FlowUser.objects.get(pk=request.user.id)
    context = {
        'user': user
    }
    return render(request, 'registration/password-success.html', context)


@api_view(['GET'])
def getRoutes(request):
    return Response('Our API')
        
# register user view
class SignUpView(generic.CreateView):
    form_class = UserCreationForm
    success_url = reverse_lazy("login")
    template_name = "registration/signup.html"

# retrieving requesting user
@api_view(['GET'])
def getUser(request):
    if request.method == 'GET':
        return Response({
            'username': request.user.username,
            'id': request.user.id
        }
        )

@api_view(['GET'])
def getSearchResults(request, query):
    if request.method == 'GET':
        search_word = query

        # filtering activities based on the search text
        activities_list = Activities.objects.filter(Q(name__icontains=search_word))
        empty = False
        if len(activities_list) == 0:
            empty = True
        else:
            serializer = ActivitiesListSerializer(activities_list, many=True)
            return Response(serializer.data)
    return Response(status=status.HTTP_400_BAD_REQUEST)
        

# retrieving user from url pk
@api_view(['GET'])
def getUrlUser(request, pk):
    user = FlowUser.objects.get(pk=pk)
    serializer = FlowUserProfileSerializer(user)
    return Response(serializer.data)

# retrieving flow user object from requesting user
@api_view(['GET'])
def flowuser(request):
    user = FlowUser.objects.get(pk=request.user.id)
    serializer = FlowUserProfileSerializer(user)
    return Response(serializer.data)

# getting activities related to a user
@api_view(['GET'])
def getUserActivities(request, pk):
    user = FlowUser.objects.get(pk=pk)
    ua = Activities.objects.filter(Q(created_by=user.user) | Q(attendees__id=user.pk)).distinct().order_by('date')[:2]
    serializer = ActivitiesListSerializer(ua, many=True)
    return Response(serializer.data)

# getting activities that have been completed
@api_view(['GET'])
def getUserCompletedActivities(request, pk):
    user = FlowUser.objects.get(pk=pk)
    ua = CompletedActivities.objects.filter(Q(created_by=user.user) | Q(participants__id=user.pk)).distinct().order_by('date')[:2]
    serializer = CompletedActivitiesListSerializer(ua, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def getNeighborhoodActivities(request):
    curruser = FlowUser.objects.get(pk=request.user.id)
    if curruser.neighborhood == '' or curruser.neighborhood == None:
        return Response([{'Neighborhood': 'None'}])
    else:
        activities = Activities.objects.filter(created_by__flowuser__neighborhood=curruser.neighborhood)
        serializer = ActivitiesListSerializer(activities, many=True)
        return Response(serializer.data)
    # if curruser.neighborhood

@api_view(['GET'])
def getActivitiesUsersAttend(request):
    # user = FlowUser.objects.get(pk=request.user.id)
    activities = Activities.objects.filter(attendees__id=request.user.id)
    
    serializer = ActivitiesListSerializer(activities, many=True)
    return Response(serializer.data)

@api_view(['GET', 'POST'])
def getActivities(request):

    if request.method == 'GET':
        activities = Activities.objects.all().order_by('-created_at')

        # checking if activity date has passed
        act_list = []
        for activity in activities:
            d1 = datetime.datetime.strptime(str(activity.date), "%Y-%m-%d")
            if(d1 < datetime.datetime.now()):
                if CompletedActivities.objects.filter(name=activity.name).exists():
                    activity.delete()
                    continue
                else:
                    comp_act = CompletedActivities.objects.create(name=activity.name, 
                                                                    location=activity.location,
                                                                    date=activity.date,
                                                                    time=activity.time,
                                                                    created_by=activity.created_by)
                    for att in activity.attendees.all():
                        comp_act.participants.add(att)
                    activity.delete()
                    continue
                
            act_list.append(activity)
        serializer = ActivitiesListSerializer(act_list, many=True)
        return Response(serializer.data)

    if request.method == 'POST':
        activity_form = NewActivityForm(request.POST, request.FILES)
        if activity_form.is_valid():
            new_activity = activity_form.save(commit=False)
            new_activity.created_by = request.user
            new_activity.save()
            act = Activities.objects.get(id=new_activity.id)
            user = request.user
            act.attendees.add(user)
            return Response(status=status.HTTP_201_CREATED)
        return Response(status=status.HTTP_400_BAD_REQUEST)
        
# retrieving a single activity
@api_view(['GET', 'POST'])
def getActivtiy(request, pk):
    
    if request.method == 'GET':
        activity = Activities.objects.get(id=pk)
        serializer = ActivitiesSerializer(activity)
        return Response(serializer.data)

# to handle updates to activity details
@api_view(['POST'])
def updateActivity(request, pk):
    if request.method == 'POST':
        activity = Activities.objects.get(id=pk)
        print(request.POST)
        form = NewActivityForm(request.POST, request.FILES, instance=activity)
        if form.is_valid():
            form.save()
            return Response(status=status.HTTP_200_OK)
        else:
            form = NewActivityForm(instance=activity)
        return Response(status=status.HTTP_400_BAD_REQUEST)

# view to handle deletion of an activity
@api_view(['POST'])
def deleteActivity(request, pk):
    if request.method == 'POST':
        activity = Activities.objects.get(id=pk)
        activity.delete()
        return Response(status=status.HTTP_200_OK)


# calculating latitude and longitude for all activities 
@api_view(['GET'])
def getGeodata(request):
    activities = Activities.objects.all().order_by('-created_at')
    loc = []

    for activity in activities:
            l = geocoder.osm(activity.location)
            loc.append([activity.name,l.lat, l.lng, activity.location])
    
    jsonString = json.dumps(loc)
    return Response(jsonString)

# computing lat and longitude values for filtered activities
@api_view(['GET'])
def getNeighborhoodGeodata(request):
    user = FlowUser.objects.get(pk=request.user.id)
    activities = Activities.objects.filter(created_by__flowuser__neighborhood=user.neighborhood)
    loc = []
    for activity in activities:
            l = geocoder.osm(activity.location)
            loc.append([activity.name,l.lat, l.lng, activity.location])
    
    jsonString = json.dumps(loc)
    return Response(jsonString)

# to update a user's details
@api_view(['POST'])
def UpdateView(request, pk):
    if request.method == 'POST':
        user = FlowUser.objects.get(pk=pk)
        form = UpdateUserForm(request.POST, request.FILES, instance=user)
        if form.is_valid():
            form.save()
            return Response(status=status.HTTP_200_OK)
    else:
        form = UpdateUserForm(instance=user)
    return Response(status=status.HTTP_400_BAD_REQUEST)

# view to handle when a user chooses to attend an activity
@api_view(['POST'])
def attendActivity(request, pk):
    if request.method == 'POST':
        activity = Activities.objects.get(id=pk)
        # adds the user to the attendees list
        activity.attendees.add(request.user)
        return Response(status=status.HTTP_200_OK)
    return Response(status=status.HTTP_400_BAD_REQUEST)