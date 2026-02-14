from django.db import models
from django.contrib.auth.models import User

class Article(models.Model):

    class CategorieChoices(models.TextChoices):
        BELGIQUE = "BELGIQUE", "Économie et Société – Belgique"
        CONGO = "CONGO", "Économie et Société – République du Congo"
        FINANCE = "FINANCE", "Finance et Gestion"

    titre = models.CharField(max_length=200)
    contenu = models.TextField()
    image_url = models.CharField(max_length=500, blank=True, null=True)

    categorie = models.CharField(
        max_length=50,
        choices=CategorieChoices.choices,
        default=CategorieChoices.BELGIQUE  # 👈 valeur par défaut
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    admin = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="articles"
    )
