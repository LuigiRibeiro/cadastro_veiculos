import { AfterViewInit, Component, Input, ViewChild, HostListener } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

const portugueseRangeLabel = (page: number, pageSize: number, length: number) => {
  if (length === 0 || pageSize === 0) { return `0 de ${length}`; }

  length = Math.max(length, 0);

  const startIndex = page * pageSize;

  const endIndex = startIndex < length ?
      Math.min(startIndex + pageSize, length) :
      startIndex + pageSize;

  return `${startIndex + 1} - ${endIndex} de ${length}`;
};

@Component({
  selector: 'app-tabela',
  templateUrl: './tabela.component.html',
  styleUrls: ['./tabela.component.scss']
})
export class TabelaComponent implements AfterViewInit {

  @Input()
  eventoVizualizar = '';

  @Input()
  eventoDeletar = '';

  @Input()
  displayedColumns = [];

  @Input()
  listaDocumentos = [];

  @Input()
  nomeTabela = '';

  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor() {

  }

  ngOnInit() {
    this.dataSource = new MatTableDataSource(this.listaDocumentos);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    
    this.paginator._intl.itemsPerPageLabel = 'Itens por página';
    this.paginator._intl.previousPageLabel = 'Página anterior';
    this.paginator._intl.nextPageLabel = 'Próxima página';
    this.paginator._intl.getRangeLabel = portugueseRangeLabel;
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  @HostListener('window:atualizar-tabela' , ['$event'])
  atualizarTabela(event){
    if (event.detail.nomeTabela == this.nomeTabela){
      this.dataSource = new MatTableDataSource(event.detail.values);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  visualizar(row){
    window.dispatchEvent(new CustomEvent(this.eventoVizualizar, {detail: row}));
    console.log(row)
  }

  deletar(row){
    window.dispatchEvent(new CustomEvent(this.eventoDeletar, {detail: row}));
    console.log(row)
  }
}
