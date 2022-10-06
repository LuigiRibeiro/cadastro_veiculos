import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MinhaContaEntity } from 'app/minha-conta/model/minha-conta-entity';
import { MinhaContaService } from 'app/minha-conta/service/minha-conta.service';
import { SnackBarService } from 'app/service/snack-bar.service';
import * as moment from 'moment';
import { Veiculo } from './model/veiculo';
import { HomeService } from './service/home.service';
import * as Chartist from 'chartist';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ConfirmDialog } from 'app/components/confirm-dialog/confirm-dialog.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  veiculos: Veiculo[] = [];
  veiculoSelecionado = new Veiculo();
  opemChartMarcas = false;
  monstrarTabela = false;
  listaMarcas = [
    'Volkswagen', 'Chevrolet', 'Fiat', 'Hyundai', 'Toyota', 'Jeep', 'Caoa', 'Chery',
    'Renault', 'Nissan', 'Honda', 'Peugeot', 'Ford', 'Citroen', 'Mitsubishi', 'Audi',
    'BWM', 'Volvo', 'Mercedes-Benz', 'JAC', 'Motors', 'Kia', 'Land', 'Rover', 'Suzuki', 
    'RAM', 'Porsche', 'Mini'];
  listaCores = ['Branco', 'Cinza','Preto', 'Prata', 'Azul', 'Vermelho', 'Marrom/Bege',
    'Verde','Amarelo'];

  veiculoForm: FormGroup;

  constructor(private router: Router, private service: HomeService, protected dialog: MatDialog,
    private minhaContaService: MinhaContaService, private alert: SnackBarService) { }

  ngOnInit() {
    this.buscarVeiculos();    

    this.veiculoForm = new FormGroup({
      'id': new FormControl(null),
      'veiculo': new FormControl('', Validators.required),
      'marca': new FormControl('', Validators.required),
      'ano': new FormControl(null, Validators.required),
      'cor': new FormControl(null, Validators.required),
      'descricao': new FormControl(''),
      'vendido': new FormControl(false, Validators.required)
    });

  }

  buscarVeiculos(){
    window.dispatchEvent(new CustomEvent('show-loading'));
    this.service.buscarVeiculos().subscribe(resp => {
      window.dispatchEvent(new CustomEvent('hide-loading'));
      if (resp.values){
        this.veiculos = resp.values;
        this.buildCharBarMarcas();
        this.buildCharBarAno();
        this.monstrarTabela = true;
        this.veiculos.forEach(v => v.vendido = v.vendido ? 'Sim' : 'Não')
      }
    }, error => {
      window.dispatchEvent(new CustomEvent('hide-loading'));
      this.alert.message('Erro ao tentar localizar os veículos')})
  }

  getVeiculosNaoVendidos(){
    let naoVendidos = this.veiculos.filter(v => v.vendido == 'Sim' ? false : true)
    return naoVendidos.length
  }

  getVeiculosRegistradosSemana(){
    var currentDate = moment();
    var registrosSemana = this.veiculos.filter(v => moment(v.created).isSame(currentDate, 'week'));
    return registrosSemana.length
  }

  getVeiculosRegistradosDia(){
    var currentDate = moment();
    var registrosDia = this.veiculos.filter(v => moment(v.created).isSame(currentDate, 'day'));
    return registrosDia.length
  }

  getWeekDates() {

    let now = new Date();
    let dayOfWeek = now.getDay(); //0-6
    let numDay = now.getDate();
  
    let start = new Date(now); //copy
    start.setDate(numDay - dayOfWeek);
    start.setHours(0, 0, 0, 0);
  
  
    let end = new Date(now); //copy
    end.setDate(numDay + (7 - dayOfWeek));
    end.setHours(0, 0, 0, 0);
  
    return [start, end];
  }

  getVeiculosMarcas(){
    let veiculosMarca = [];
    this.listaMarcas.forEach(marca => {
      veiculosMarca.push(this.veiculos.filter(v => v.marca == marca).length)
    });
    return veiculosMarca
  }

  getVeiculosAno(){
    let decadas = this.veiculos.map(v => v.ano.toString().substring(0, 3) + '0').sort();
    let disc_decadas = [];
    let count_dec = [];
    decadas.forEach(dec => {
      if (disc_decadas.includes(dec)){
        count_dec[disc_decadas.indexOf(dec)] = count_dec[disc_decadas.indexOf(dec)] + 1;
      } else {
        disc_decadas.push(dec);
        count_dec[disc_decadas.indexOf(dec)] = 1;
      }
    });
    console.log(decadas, disc_decadas, count_dec);
    return {
      labels: disc_decadas,
      series: [count_dec]
    };
  }

  arrayMax(arr) {
    return arr.reduce(function (p, v) {
      return ( p > v ? p : v );
    });
  }

  buildCharBarMarcas(){
    var datamarcasViewsChart = {
      labels: this.listaMarcas,
      series: [this.getVeiculosMarcas()]
    };
    var optionsmarcasViewsChart = {
        axisX: {
            showGrid: false
        },
        low: 0,
        high: this.arrayMax(this.getVeiculosMarcas()) + 1,
        chartPadding: { top: 0, right: 5, bottom: 0, left: 0}
    };
    var responsiveOptions: any[] = [
      ['screen and (max-width: 640px)', {
        seriesBarDistance: 5,
        axisX: {
          labelInterpolationFnc: function (value) {
            return value[0];
          }
        }
      }]
    ];
    
    //start animation for the Emails Subscription Chart
    var marcasViewsChart = new Chartist.Bar(
      '#marcasViewsChart', datamarcasViewsChart, optionsmarcasViewsChart, responsiveOptions);
    this.startAnimationForBarChart(marcasViewsChart);
  }

  buildCharBarAno(){
    var dataAnoViewsChart = this.getVeiculosAno();
    var optionsAnoViewsChart = {
        axisX: {
            showGrid: false
        },
        low: 0,
        high: this.arrayMax(this.getVeiculosMarcas()) + 1,
        chartPadding: { top: 0, right: 5, bottom: 0, left: 0}
    };
    var responsiveOptions: any[] = [
      ['screen and (max-width: 640px)', {
        seriesBarDistance: 5,
        axisX: {
          labelInterpolationFnc: function (value) {
            return value[0];
          }
        }
      }]
    ];
    
    //start animation for the Emails Subscription Chart
    var anoViewsChart = new Chartist.Bar(
      '#anoViewsChart', dataAnoViewsChart, optionsAnoViewsChart, responsiveOptions);
    this.startAnimationForBarChart(anoViewsChart);
  }

  startAnimationForBarChart(chart){
    this.opemChartMarcas = true;
    let seq2: any, delays2: any, durations2: any;

    seq2 = 0;
    delays2 = 80;
    durations2 = 500;
    chart.on('draw', function(data) {
      if(data.type === 'bar'){
          seq2++;
          data.element.animate({
            opacity: {
              begin: seq2 * delays2,
              dur: durations2,
              from: 0,
              to: 1,
              easing: 'ease'
            }
          });
      }
    });

    seq2 = 0;
  };

  @HostListener('window:editar-veiculo', ['$event'])
  vizualizarResultados(event) {
    this.veiculoSelecionado = this.veiculos.find(v => v.id == event.detail.id);

    this.veiculoForm = new FormGroup({
      'id': new FormControl(this.veiculoSelecionado.id),
      'veiculo': new FormControl(this.veiculoSelecionado.veiculo, Validators.required),
      'marca': new FormControl(this.veiculoSelecionado.marca, Validators.required),
      'ano': new FormControl(this.veiculoSelecionado.ano, Validators.required),
      'cor': new FormControl(this.veiculoSelecionado.cor, Validators.required),
      'descricao': new FormControl(this.veiculoSelecionado.descricao),
      'vendido': new FormControl(this.veiculoSelecionado.vendido == 'Sim'?true:false, Validators.required)
    });

    var modal = document.getElementById('modalVeiculos');
    modal.style.display = 'flex'; 
  }

  novoVeiculo() {
    this.veiculoSelecionado = new Veiculo();

    this.veiculoForm = new FormGroup({
      'id': new FormControl(null),
      'veiculo': new FormControl('', Validators.required),
      'marca': new FormControl(null, Validators.required),
      'ano': new FormControl(null, Validators.required),
      'cor': new FormControl(null, Validators.required),
      'descricao': new FormControl(''),
      'vendido': new FormControl(false, Validators.required)
    });

    var modal = document.getElementById('modalVeiculos');
    modal.style.display = 'flex'; 
  }

  salvarVeiculo(){
    if (this.veiculoForm.valid){
      window.dispatchEvent(new CustomEvent('show-loading'));
      if (this.veiculoForm.controls['id'].value){
        this.veiculoSelecionado = this.veiculoForm.value;
        this.service.atualizarVeiculo(this.veiculoSelecionado, this.veiculoSelecionado.id).subscribe(resp => {
          this.alert.message(resp.status);
          if (resp.status == 'Veículo atualizado salvo com sucesso'){
            this.monstrarTabela = false;
            this.buscarVeiculos();
            this.closeModal('modalVeiculos', false)
          }
        }, error => {
          window.dispatchEvent(new CustomEvent('hide-loading'));
          this.alert.message('Erro ao tentar remover')})
      } else{
        this.veiculoSelecionado = this.veiculoForm.value;
        this.service.criarVeiculo(this.veiculoSelecionado).subscribe(resp => {
          this.alert.message(resp.status);
          if (resp.status == 'Novo veículo salvo com sucesso'){
            this.monstrarTabela = false;
            this.buscarVeiculos();
            this.closeModal('modalVeiculos', false);
          }
        }, error => {
          window.dispatchEvent(new CustomEvent('hide-loading'));
          this.alert.message('Erro ao tentar remover')})
      }
    } else{
      this.alert.message('Preencha todos os campos obrigatórios');
      this.veiculoForm.markAllAsTouched();
    }
  }

  closeModal(modalId, confirm = true){
    if (confirm){
      const dialogConfig = new MatDialogConfig();
      dialogConfig.width = '30%';
      dialogConfig.data = {
        titulo: 'Fechar',
        conteudo: 'Todas as alterações não serão salvas, tem certeza que quer fechar?'
      };
      const dialogRef = this.dialog.open(ConfirmDialog, dialogConfig);
      dialogRef.afterClosed().subscribe(podeFechar => {
        if (podeFechar) {
          var modal = document.getElementById(modalId) as any;
          modal.style.display = 'none';
        }
      });
    } else{
      var modal = document.getElementById(modalId) as any;
      modal.style.display = 'none';
    }
  }

  @HostListener('window:deletar-veiculo', ['$event'])
  removerLista(event) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '30%';
    dialogConfig.data = {
      titulo: 'Deletar',
      conteudo: 'Deseja realmente deletar? Essa ação é permanente.'
    };
    const dialogRef = this.dialog.open(ConfirmDialog, dialogConfig);
    dialogRef.afterClosed().subscribe(podeIniciar => {
      if (podeIniciar) {
        window.dispatchEvent(new CustomEvent('show-loading'));
        this.service.deletarVeiculo(event.detail.id).subscribe(resp =>{
          this.alert.message(resp.status);
          if (resp.status == 'Veículo deletado com sucesso'){
            this.monstrarTabela = false;
            this.buscarVeiculos();
            this.closeModal('modalVeiculos', false);
          }
        }, error => {
          window.dispatchEvent(new CustomEvent('hide-loading'));
          this.alert.message('Erro ao tentar remover')})
      }
    });

  }
}
