# -*- encoding: utf-8 -*-
from django.urls import path
from veiculos import views

urlpatterns = [
    # App
    path('', views.app, name='app'),

    # Veiculo
    path('veiculos', views.veiculo, name='veiculo_todos'),
    path('veiculos/<int:id>', views.veiculo_id, name='veiculo_todos'),
]
