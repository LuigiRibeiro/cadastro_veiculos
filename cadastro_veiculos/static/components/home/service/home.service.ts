import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppUtils } from 'app/service/app-utils';
import { Observable } from 'rxjs';
import { Veiculo } from '../model/veiculo';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  protected readonly path: string;

  constructor(protected http: HttpClient, private util: AppUtils) {
    this.path = util.getBaseUrlWebService();
  }

  public buscarConsumo(userName: string): Observable<any> {
    const url = this.path + '/api_buscar_consumo';
    return this.http.get<any>(`${url}/${userName}/`);
  }

  public logout(): Observable<any> {
    const url = this.path + '/logout';
    return this.http.get<any>(`${url}/`);
  }

  public trocarSenha(username: string, senhaAtual: string, novaSenha: string): Observable<any> {
    const url = this.path + '/api_trocar_senha';
    return this.http.get<any>(`${url}/${username}/${senhaAtual}/${novaSenha}/`);
  }

  public buscarVeiculos(): Observable<any> {
    const url = this.path + '/veiculos';
    return this.http.get<any>(`${url}`);
  }

  public criarVeiculo(veiculo: Veiculo): Observable<any> {
    const url = this.path + '/veiculos';
    return this.http.post<any>(`${url}`, veiculo);
  }

  public atualizarVeiculo(veiculo: Veiculo, id: number): Observable<any> {
    const url = this.path + '/veiculos';
    return this.http.post<any>(`${url}/${id}`, veiculo);
  }

  public deletarVeiculo(id: number): Observable<any> {
    const url = this.path + '/veiculos';
    return this.http.delete<any>(`${url}/${id}`);
  }
}
