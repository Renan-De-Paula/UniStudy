from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MaterialViewSet, MaterialCommentViewSet

router = DefaultRouter()
router.register(r'materials', MaterialViewSet, basename='material')
router.register(r'material_comments', MaterialCommentViewSet, basename='materialcomment')

urlpatterns = [
    path('', include(router.urls)),
]
