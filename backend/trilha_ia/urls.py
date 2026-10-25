from django.urls import path
from .views import GenerateTrilhaView, RequisitosTrilhaView, TrilhaListView, ToggleTopicoView

urlpatterns = [
    path('requisitos/', RequisitosTrilhaView.as_view(), name='trilha-requisitos'),
    path('generate/', GenerateTrilhaView.as_view(), name='generate-trilha'),
    path('', TrilhaListView.as_view(), name='list-trilhas'),
    path('<int:trilha_id>/toggle/', ToggleTopicoView.as_view(), name='toggle-topico'),
]
