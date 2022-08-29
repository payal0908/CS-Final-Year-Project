from django.urls import path
from .views import *
from django.contrib.auth.views import LoginView, LogoutView, PasswordChangeView
from django.contrib.auth.decorators import login_required
url = '/api/login/'


urlpatterns = [
    path('', login_required(login_url=url)(getRoutes), name='routes'),
    # path('register/', registerUser, name='registerUser'),
    path('signup/', SignUpView.as_view(), name='signup'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('update-password/', login_required(login_url=url)(PasswordUpdateView.as_view(template_name='registration/update-password.html')), name='update-password'),
    path('password-success/', passwordSuccess, name='passwordSuccess'),
    path('flowuser/', login_required(login_url=url)(flowuser), name='flowuser'),
    path('curruser/', login_required(login_url=url)(getUser), name='curruser'),
    path('user/<str:pk>', login_required(login_url=url)(getUrlUser), name='urlUser'),
    path('user/<str:pk>/activities/', login_required(login_url=url)(getUserActivities), name='userActivities'),
    path('user/<str:pk>/completed-activities/', login_required(login_url=url)(getUserCompletedActivities), name='userCompletedActivities'),
    path('activities/neighborhood/', login_required(login_url=url)(getNeighborhoodActivities), name='neighborhoodActivities'),
    path('attendees/activities/', login_required(login_url=url)(getActivitiesUsersAttend), name='actiivitiesUsersAttend'),
    path('activities/', login_required(login_url=url)(getActivities), name='activities'),
    path('activities/<str:pk>', login_required(login_url=url)(getActivtiy), name='activity'),
    path('activities/geodata/', login_required(login_url=url)(getGeodata), name='geodata'),
    path('activities/neighborhood/geodata/', login_required(login_url=url)(getNeighborhoodGeodata), name='neighborhoodGeodata'),
    path('user/<str:pk>/update/', login_required(login_url=url)(UpdateView), name='updateUser'),
    path('activities/<str:pk>/update/', login_required(login_url=url)(updateActivity), name='updateActivity'),
    path('activities/<str:pk>/delete/', login_required(login_url=url)(deleteActivity), name='deleteActivity'),
    path('activities/<str:pk>/attend/', login_required(login_url=url)(attendActivity), name='attendActivity'),
    path('search/<str:query>/', login_required(login_url=url)(getSearchResults), name='searchResults'),
    
]