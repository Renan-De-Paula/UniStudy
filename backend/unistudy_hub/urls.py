from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/repository/', include('repository.urls')),
    path('api/auth/', include('accounts.urls')),
    path('api/gamification/', include('gamification.urls')),
    path('api/trilha_ia/', include('trilha_ia.urls')),
]
