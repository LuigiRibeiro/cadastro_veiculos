import json

from django.forms import model_to_dict
from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
from .forms import VeiculoForm
from veiculos.models import Veiculo


def app(request):
    return render(request, "app.html")


@csrf_exempt
def veiculo(request):
    try:
        if request.method == 'GET':
            queryset = Veiculo.objects.all()

            marca = request.GET.get('marca', None)
            if marca is not None:
                queryset = queryset.filter(marca=marca)

            ano = request.GET.get('ano', None)
            if ano is not None:
                queryset = queryset.filter(ano=ano)

            cor = request.GET.get('cor', None)
            if cor is not None:
                queryset = queryset.filter(cor=cor)

            resp = {
                'status': 'Veículos localizados',
                'values': list(queryset.values())
            }

            return JsonResponse(resp, safe=False, json_dumps_params={'ensure_ascii': False})

        elif request.method == 'POST':
            body = json.loads(request.body)
            novo_veiculo = VeiculoForm(body or None)

            if novo_veiculo.is_valid():
                novo_veiculo.save()
                veiculo_obj = Veiculo.objects.all().last()
                resp = {
                    'status': 'Novo veículo salvo com sucesso',
                    'values': [model_to_dict(veiculo_obj)]
                }
                return JsonResponse(resp, safe=False, json_dumps_params={'ensure_ascii': False})
            else:
                resp = {
                    'status': 'Erro ao tentar criar novo veículo',
                    'errors': novo_veiculo.errors,
                    'values': []
                }
                return JsonResponse(resp, safe=False, json_dumps_params={'ensure_ascii': False}, status=400)

        else:
            resp = {
                'status': 'Method Not Allowed',
                'values': []
            }
            return JsonResponse(resp, safe=False, json_dumps_params={'ensure_ascii': False}, status=405)

    except Exception as erro:
        print(erro)
        resp = {
            'status': 'Internal error',
            'values': []
        }
        return JsonResponse(resp, safe=False, json_dumps_params={'ensure_ascii': False}, status=500)


@csrf_exempt
def veiculo_id(request, id):
    try:
        if request.method == 'GET':
            queryset = Veiculo.objects.filter(id=id)

            if queryset.exists():
                resp = {
                    'status': 'Veículo localizado',
                    'values': list(queryset.values())
                }
                return JsonResponse(resp, safe=False, json_dumps_params={'ensure_ascii': False})
            else:
                resp = {
                    'status': 'Veículo inexistente',
                    'values': []
                }
                return JsonResponse(resp, safe=False, json_dumps_params={'ensure_ascii': False}, status=400)

        elif request.method == 'POST':
            try:
                veiculo_selecionado = Veiculo.objects.get(id=id)

            except Veiculo.DoesNotExist:
                resp = {
                    'status': 'Veículo inexistente',
                    'values': []
                }
                return JsonResponse(resp, safe=False, json_dumps_params={'ensure_ascii': False}, status=400)

            try:
                body = json.loads(request.body)
                if body.get('veiculo') is not None:
                    veiculo_selecionado.veiculo = body.get('veiculo')
                if body.get('marca') is not None:
                    veiculo_selecionado.marca = body.get('marca')
                if body.get('cor') is not None:
                    veiculo_selecionado.cor = body.get('cor')
                if body.get('ano') is not None:
                    veiculo_selecionado.ano = body.get('ano')
                if body.get('vendido') is not None:
                    veiculo_selecionado.vendido = body.get('vendido')
                if body.get('descricao') is not None:
                    veiculo_selecionado.descricao = body.get('descricao')

                veiculo_selecionado.updated = timezone.now()
                veiculo_selecionado.save()
                resp = {
                    'status': 'Veículo atualizado salvo com sucesso',
                    'values': [model_to_dict(veiculo_selecionado)]
                }

                return JsonResponse(resp, safe=False, json_dumps_params={'ensure_ascii': False})
            except Exception as erro:
                resp = {
                    'status': 'Erro ao tentar atualizar veículo',
                    'errors': str(erro),
                    'values': []
                }
                return JsonResponse(resp, safe=False, json_dumps_params={'ensure_ascii': False}, status=400)

        elif request.method == 'DELETE':
            queryset = Veiculo.objects.filter(id=id)
            if queryset.exists():
                queryset.delete()
                resp = {
                    'status': 'Veículo deletado com sucesso',
                    'values': []
                }
                return JsonResponse(resp, safe=False, json_dumps_params={'ensure_ascii': False})
            else:
                resp = {
                    'status': 'Veículo inexistente',
                    'values': []
                }
                return JsonResponse(resp, safe=False, json_dumps_params={'ensure_ascii': False}, status=400)
        else:
            resp = {
                'status': 'Method Not Allowed',
                'values': []
            }
            return JsonResponse(resp, safe=False, json_dumps_params={'ensure_ascii': False}, status=405)

    except Exception as erro:
        print(erro)
        resp = {
            'status': 'Internal Server Error',
            'values': []
        }
        return JsonResponse(resp, safe=False, json_dumps_params={'ensure_ascii': False}, status=500)
