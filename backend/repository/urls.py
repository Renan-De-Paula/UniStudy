from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MaterialViewSet, MaterialCommentViewSet, MaterialOracleAIView

router = DefaultRouter()
router.register(r'materials', MaterialViewSet, basename='material')
router.register(r'material_comments', MaterialCommentViewSet, basename='materialcomment')
router.register(r'oracle_ai', MaterialOracleAIView, basename='material-oracle-ai')

urlpatterns = [
    path('', include(router.urls)),
]
