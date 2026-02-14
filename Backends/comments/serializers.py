from rest_framework import serializers
from .models import Commentaire

class CommentaireSerializer(serializers.ModelSerializer):
    class Meta:
        model = Commentaire
        fields = ['id', 'nom', 'message', 'article', 'created_at']
        read_only_fields = ['id', 'created_at']
