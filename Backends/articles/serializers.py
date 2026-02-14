from rest_framework import serializers
from .models import Article

class ArticleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Article
        fields = ['id', 'titre', 'contenu', 'image_url', 'categorie', 'created_at', 'updated_at', 'admin']
        read_only_fields = ['id', 'created_at', 'updated_at', 'admin']
