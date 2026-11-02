from django.urls import path
from .views import GenerateTrilhaView, TrilhaListView, ToggleTopicoView

urlpatterns = [
    path('generate/', GenerateTrilhaView.as_view(), name='generate-trilha'),
    path('gerar/', GenerateTrilhaView.as_view(), name='gerar-trilha'),
    path('', TrilhaListView.as_view(), name='list-trilhas'),
    path('minhas_trilhas/', TrilhaListView.as_view(), name='minhas-trilhas'),
    path('<int:trilha_id>/toggle/', ToggleTopicoView.as_view(), name='toggle-topico'),
    path('topico/<int:trilha_id>/concluir/', ToggleTopicoView.as_view(), name='concluir-topico'),
]

