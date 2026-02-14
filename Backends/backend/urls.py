from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from articles.views import ArticleViewSet
from comments.views import CommentaireViewSet
from rest_framework.authtoken.views import obtain_auth_token

router = DefaultRouter()
router.register(r'articles', ArticleViewSet, basename='article')
router.register(r'commentaires', CommentaireViewSet, basename='commentaire')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path("api-token-auth/", obtain_auth_token),
]
