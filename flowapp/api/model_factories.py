from factory.django import DjangoModelFactory
from django.db.models.signals import post_save
from .models import *
import factory
import datetime

@factory.django.mute_signals(post_save)
class UserFactory(DjangoModelFactory):

    class Meta:
        model = User
        django_get_or_create = ('username', )

    username = "john"
    password = 'pass@123!!'
    is_superuser = True

@factory.django.mute_signals(post_save)
class FlowUserFactory(DjangoModelFactory):
    class Meta:
        model = FlowUser
        django_get_or_create = ('user', )
         
    user = factory.SubFactory(UserFactory)
    neighborhood = 'Marine Parade'
    name = "John A"
    email = "john@email.com"

class ActivityFactory(DjangoModelFactory):
    name = "test post 1"
    description = "test post 1 description"
    location = "Marine Parade, Singapore"
    date=datetime.date(2022, 9, 9)
    time=datetime.time(5, 30, 0)
    created_by = factory.SubFactory(UserFactory)

    class Meta:
        model = Activities

    @factory.post_generation
    def attendees(self, create, extracted, **kwargs):
        if not create:
            # Simple build, do nothing.
            return

        if extracted:
            # A list of groups were passed in, use them
            for user in extracted:
                self.attendees.add(user)

class CompletedActivtiyFactory(DjangoModelFactory):
    name = "test post 2"
    location = "location 2"
    date="2022-08-27"
    time="18:00:00"
    created_by = factory.SubFactory(UserFactory)

    class Meta:
        model = CompletedActivities

    @factory.post_generation
    def participants(self, create, extracted, **kwargs):
        if not create:
            # Simple build, do nothing.
            return

        if extracted:
            # A list of groups were passed in, use them
            for user in extracted:
                self.participants.add(user)
