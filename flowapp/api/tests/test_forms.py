from django.test import TestCase

from ..models import FlowUser
from ..forms import NewActivityForm, UpdateUserForm
from django.contrib.auth.models import User
import datetime

class TestForms(TestCase):

    def setUp(self):
        self.User1 = User.objects.create_user('John', 'test@e.com', 'test@123')

    def test_post_form_valid_data(self):
        form = NewActivityForm(data={
            'name': 'test activity form',
            'description': 'test description',
            'location': 'test location',
            'date': datetime.date(2022, 8, 9), 
            'time': datetime.time(5, 30, 0), 
            'image': '',
            'created_by': self.User1
        })

        self.assertTrue(form.is_valid())

    def test_post_form_no_data(self):
        form = NewActivityForm(data={})

        self.assertFalse(form.is_valid())
        self.assertEquals(len(form.errors), 5)

    def user_update_form(self):
        before_update_user = FlowUser.objects.get(name='John')
        self.assertIsNotNone(before_update_user)

        form = UpdateUserForm(data={
            'name': 'John K',
            'email': 'test@e.com',
            'neighborhood': 'Marine Parade',
            'display_img': 'test.jpg'
        })

        self.assertTrue(form.is_valid())
        
        # to check if update actually happened
        user = FlowUser.objects.get(name='John K')
        self.assertIsNotNone(user)