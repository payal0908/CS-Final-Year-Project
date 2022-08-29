from django.test import SimpleTestCase
from django.urls import reverse, resolve
from ..views import *
from django.contrib.auth.views import LoginView, LogoutView

def resolve_view(url):
    return resolve(url).func.view_class

class TestUrls(SimpleTestCase):

    def test_signup_url_resolves(self):
        url = reverse('signup')
        self.assertEquals(resolve_view(url), SignUpView)
    
    def test_login_url_resolves(self):
        url = reverse('login')
        self.assertEquals(resolve_view(url), LoginView)

    def test_logout_url_resolves(self):
        url = reverse('logout')
        self.assertEquals(resolve_view(url), LogoutView)

    def test_updatepassword_url_resolves(self):
        url = reverse('update-password')
        self.assertEquals(resolve_view(url), PasswordUpdateView)

    def test_passwordsuccess_url_resolves(self):
        url = reverse('passwordSuccess')
        self.assertEquals(resolve(url).func, passwordSuccess)

    def test_flowuser_url_resolves(self):
        url = reverse('flowuser')
        self.assertEquals(resolve(url).func.__name__, 'flowuser')

    def test_curruser_url_resolves(self):
        
        url = reverse('curruser')
        self.assertEquals(resolve(url).func.__name__, 'getUser')

    def test_urluser_url_resolves(self):
        url = reverse('urlUser', args=[1])
        self.assertEquals(resolve(url).func.__name__, 'getUrlUser')

    def test_useractivities_url_resolves(self):
        url = reverse('userActivities', args=[1])
        self.assertEquals(resolve(url).func.__name__, 'getUserActivities')
    
    def test_usercompleted_url_resolves(self):
        url = reverse('userCompletedActivities', args=[1])
        self.assertEquals(resolve(url).func.__name__, 'getUserCompletedActivities')

    def test_activitiesneighborhood_url_resolves(self):
        url = reverse('neighborhoodActivities')
        self.assertEquals(resolve(url).func.__name__, 'getNeighborhoodActivities')

    def test_attendeesactivities_url_resolves(self):
        url = reverse('actiivitiesUsersAttend')
        self.assertEquals(resolve(url).func.__name__, 'getActivitiesUsersAttend')

    def test_activities_url_resolves(self):
        url = reverse('activities')
        self.assertEquals(resolve(url).func.__name__, 'getActivities')

    def test_activity_url_resolves(self):
        url = reverse('activity', args=[1])
        self.assertEquals(resolve(url).func.__name__, 'getActivtiy')

    def test_geodata_url_resolves(self):
        url = reverse('geodata')
        self.assertEquals(resolve(url).func.__name__, 'getGeodata')

    def test_neighborhppdgeodata_url_resolves(self):
        url = reverse('neighborhoodGeodata')
        self.assertEquals(resolve(url).func.__name__, 'getNeighborhoodGeodata')

    def test_updateuser_url_resolves(self):
        url = reverse('updateUser', args=[1])
        self.assertEquals(resolve(url).func.__name__, 'UpdateView')

    def test_updateactivity_url_resolves(self):
        url = reverse('updateActivity', args=[1])
        self.assertEquals(resolve(url).func.__name__, 'updateActivity')

