from django.test import TestCase
from django.contrib.auth.models import User
from ..models import *
import datetime


class TestModels(TestCase):
    def setUp(self):
        self.User1 = User.objects.create_user('John', 'test@e.com', 'test@123')
        self.User2 = User.objects.create_user('Mary', 'test2@email.com', 'test2@123')
        
        self.flowuser1 = FlowUser.objects.get(user = self.User1)
        self.flowuser2 = FlowUser.objects.get(user = self.User2)

        self.post1 = Activities.objects.create(name='test activity', 
                                                description='example desc', 
                                                location='Test location', 
                                                date=datetime.date(2022, 8, 9), 
                                                time=datetime.time(5, 30, 0), 
                                                image='', 
                                                created_by = self.User1)

    def tearDown(self):
        User.objects.all().delete()
        FlowUser.objects.all().delete()
        Activities.objects.all().delete()

    def test_flowuser_on_user_creation(self):
        flowuser = FlowUser.objects.get(user=self.User1)
        self.assertEquals(flowuser.user, self.User1)

    def test_flowuser_count(self):
        count = FlowUser.objects.all().count()
        self.assertEquals(count, 2)

    def test_activity_creation(self):
        activity = Activities.objects.get(name='test activity')
        self.assertEquals(activity, self.post1)

    def test_activity_attendees(self):
        activity = Activities.objects.get(name='test activity')
        activity.attendees.add(self.User1)

        self.assertEquals(activity.attendees.count(), 1)

    def test_activity_user(self):
        activity = Activities.objects.get(created_by__flowuser = self.flowuser1)
        self.assertEquals(activity, self.post1)