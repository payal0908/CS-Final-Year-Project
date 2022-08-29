from django import forms
from .models import *
from django.forms import FileInput
from api.choices import *

class NewActivityForm(forms.ModelForm):
    image = forms.ImageField(required=False)

    class Meta:
        model = Activities
        fields = ['name', 'description', 'location', 'date', 'time', 'image']


class UpdateUserForm(forms.ModelForm):
    email = forms.EmailField(required=True,
                             widget=forms.TextInput(attrs={'class': 'form-control'}))
    display_img = forms.ImageField(widget=forms.FileInput(attrs={'class': 'form-control-file'}))
    neighborhood = forms.ChoiceField(choices=neighborhoods)
    class Meta:
        model = FlowUser
        fields = ['name', 'email', 'neighborhood', 'display_img']