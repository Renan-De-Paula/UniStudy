from django.urls import path
from .views import GenerateTrilhaView, TrilhaListView, ToggleTopicoView

urlpatterns = [
    path('generate/', GenerateTrilhaView.as_view(), name='generate-trilha'),
    path('', TrilhaListView.as_view(), name='list-trilhas'),
    path('<int:trilha_id>/toggle/', ToggleTopicoView.as_view(), name='toggle-topico'),
]
