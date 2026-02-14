from rest_framework.viewsets import ModelViewSet
from .models import Commentaire
from .serializers import CommentaireSerializer
from rest_framework.permissions import AllowAny

class CommentaireViewSet(ModelViewSet):
    queryset = Commentaire.objects.all().order_by('-created_at')
    serializer_class = CommentaireSerializer
    permission_classes = [AllowAny]  
