# Generated by Django 3.2.16 on 2022-10-05 16:56

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('veiculos', '0003_veiculo_cor'),
    ]

    operations = [
        migrations.AlterField(
            model_name='veiculo',
            name='created',
            field=models.DateTimeField(default=django.utils.timezone.now),
        ),
    ]