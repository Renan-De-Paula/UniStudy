from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SquadViewSet

router = DefaultRouter()
router.register(r'squads', SquadViewSet, basename='squad')

urlpatterns = [
    path('', include(router.urls)),
]
