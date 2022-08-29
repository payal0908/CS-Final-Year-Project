from datetime import date
from rest_framework.test import APITestCase

from ..model_factories import *
from ..serializers import *


class SerializerTest(APITestCase):

    # initializing
    flowuserserializer = None
    flowuserprofileserializer = None
    userserializer = None
    activityserializer = None
    activitylistserializer = None
    completedactivitylistserializer = None

    def setUp(self):

        self.user1 = UserFactory()
        self.user2 = UserFactory(username="alex")
        self.flowuser1 = FlowUserFactory()
        self.flowuser2 = FlowUserFactory(name='Alex J', user=self.user2)

        self.post1 = ActivityFactory.create(attendees=([self.user1]))

        self.post2 = ActivityFactory.create(name='tennis', description='test2', 
                                            location='test2 lcoation', 
                                            date=datetime.date(2022, 9, 9),
                                            time=datetime.time(5,30,0),
                                            created_by=self.user2, 
                                            attendees=([self.user2, self.user1]))

        self.post3 = CompletedActivtiyFactory()

        self.userserializer = UserSerializer(instance=self.user1)
        self.activityserializer = ActivitiesSerializer(instance=self.post1)
        self.flowuserserializer = FlowUserSerializer(instance=self.flowuser1)
        self.flowuserprofileserializer = FlowUserProfileSerializer(instance=self.flowuser2)
        self.activitylistserializer = ActivitiesListSerializer(instance=[self.post1, self.post2], many=True)
        self.completedactivitylistserializer = CompletedActivitiesListSerializer(instance=[self.post3], many=True)

    def tearDown(self):
        User.objects.all().delete()
        FlowUser.objects.all().delete()
        Activities.objects.all().delete()
        CompletedActivities.objects.all().delete()
        UserFactory.reset_sequence(0)
        ActivityFactory.reset_sequence(0)
        CompletedActivtiyFactory.reset_sequence(0)

    def test_user_serializer(self):
        data = self.userserializer.data
        self.assertEquals(data['username'], 'john')

    def test_flowuser_serializer(self):
        data = self.flowuserserializer.data
        self.assertEquals(data['user'], 1)

    def test_flowuser_serializer(self):
        data = self.flowuserprofileserializer.data
        self.assertEquals(data['name'], 'Alex J')

    def test_activity_serializer(self):
        data = self.activityserializer.data
        self.assertEquals(data['name'], 'test post 1')
    
    def test_activity_attendees_ok(self):
        data = self.activityserializer.data
        self.assertEquals(data['attendees'][0]['username'], 'john')

    def test_activity_list_serializer(self):
        data=self.activitylistserializer.data
        self.assertEquals(data[0]['name'], 'test post 1')
        self.assertEqual(data[1]['name'], 'tennis')

    def test_completed_activity_serializer(self):
        data = self.completedactivitylistserializer.data
        self.assertEquals(data[0].keys(), set(['id', 'name', 'location', 'date', 'time', 'created_by', 'participants']))
        self.assertEquals(data[0]['location'], 'location 2')
