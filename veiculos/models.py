from django.db import models
from django.utils import timezone


class Veiculo(models.Model):
    veiculo = models.CharField(max_length=256)
    marca = models.CharField(max_length=256)
    cor = models.CharField(max_length=256)
    ano = models.PositiveIntegerField()
    descricao = models.TextField(null=True, blank=True)
    vendido = models.BooleanField(default=False)
    created = models.DateTimeField(default=timezone.now, null=True, blank=True)
    updated = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return self.veiculo
