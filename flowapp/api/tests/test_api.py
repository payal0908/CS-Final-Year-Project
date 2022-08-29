import json
import ast

from django.urls import reverse
from rest_framework.test import APITestCase

from ..model_factories import *
from ..serializers import *

class SocialTest(APITestCase):

    def setUp(self):

        self.user1 = UserFactory()
        self.user2 = UserFactory(username="alex", password='newpass@123', is_superuser=False)
        self.user = User.objects.create(username='test', email='test@e.com')
        self.user.is_staff = True
        self.user.set_password('test@123!!')
        self.user.save()

        self.flowuser1 = FlowUserFactory(neighborhood='Marine Parade', user=self.user1)
        self.flowuser2 = FlowUserFactory(user=self.user2)
        self.flowuser3 = FlowUserFactory(name='test name', user=self.user)

        self.post1 = ActivityFactory.create(attendees=([self.user1]))

        self.post2 = ActivityFactory.create(name='tennis', description='test2', 
                                            location='Vivo City, Singapore', 
                                            date=datetime.date(2022, 9, 9),
                                            time=datetime.time(5,30,0),
                                            created_by=self.user2, 
                                            attendees=([self.user2, self.user1, self.user]))

        self.client.login(username='test', password='test@123!!')


    def tearDown(self):
        User.objects.all().delete()
        FlowUser.objects.all().delete()
        Activities.objects.all().delete()
        UserFactory.reset_sequence(0)
        ActivityFactory.reset_sequence(0)

    def test_curruser_return_success(self):
        url = reverse('curruser')
        
        response = self.client.get(url, format='json')
        self.assertEquals(response.status_code, 200)
        data = json.loads(response.content)
        self.assertEquals(data['username'], 'test')

    def test_urluser_return_success(self):
        url = reverse('urlUser', kwargs={'pk':1})
        
        response = self.client.get(url, format='json')
        self.assertEquals(response.status_code, 200)
        data = json.loads(response.content)
        self.assertEquals(data['name'], 'John A')

    def test_user_activities_return_success(self):
        url = reverse('userActivities', kwargs={'pk':1})
        
        response = self.client.get(url, format='json')
        self.assertEquals(response.status_code, 200)
        data = json.loads(response.content)
        self.assertEquals(data[0]['name'], 'test post 1')

    def test_attendees_activities_success(self):
        url = reverse('actiivitiesUsersAttend')
        response = self.client.get(url, format='json')
        self.assertEquals(response.status_code, 200)
        data = json.loads(response.content)
        self.assertEquals(data[0]['name'], 'tennis')

    def test_activities_success(self):
        url = reverse('activities')
        response = self.client.get(url, format='json')
        self.assertEquals(response.status_code, 200)
        data = json.loads(response.content)
        self.assertEquals(len(data), 2)

    def test_activity_success(self):
        url = reverse('activity', kwargs={'pk':1})

        response = self.client.get(url, format='json')
        self.assertEquals(response.status_code, 200)
        data = json.loads(response.content)
        self.assertEquals(data['name'], 'test post 1')

    def test_geodata_success(self):
        url = reverse('geodata')

        response = self.client.get(url, format='json')
        self.assertEquals(response.status_code, 200)
        data = json.loads(response.content)
        data = ast.literal_eval(data)
        self.assertIsInstance(data[0][1], float)