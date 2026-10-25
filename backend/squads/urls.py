from django.urls import path

from .views import SquadJoinView, SquadListCreateView, SquadMessageListCreateView, SquadRecommendationView

urlpatterns = [
    path('', SquadListCreateView.as_view(), name='squad-list-create'),
    path('recommended/', SquadRecommendationView.as_view(), name='squad-recommended'),
    path('<int:squad_id>/join/', SquadJoinView.as_view(), name='squad-join'),
    path('<int:squad_id>/messages/', SquadMessageListCreateView.as_view(), name='squad-messages'),
]
