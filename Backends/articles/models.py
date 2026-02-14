from django.db import models
from django.contrib.auth.models import User

class Article(models.Model):
    titre = models.CharField(max_length=200)
    contenu = models.TextField()
    image_url = models.CharField(max_length=500, blank=True, null=True) 
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    admin = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="articles"
    )
    
    def __str__(self):
        return self.titre
