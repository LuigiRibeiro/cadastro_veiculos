import { TabelaEnvioEmailComponent } from './tabela-envio-email/tabela-envio-email.component';
import { TabelaEnviosComponent } from './tabela-envios/tabela-envios.component';
import { TabelaEmpresasComponent } from './tabela-empresas/tabela-empresas.component';
import { CsvComponent } from './csv/csv.component';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatRippleModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TabelaComponent } from './tabela/tabela.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { ByteToSizePipe } from './file-upload/pipe/byte-to-size.pipe';
import { FileNamePipe } from './file-upload/pipe/file-name.pipe';
import { TabelaListaEmpresasComponent } from './tabela-lista-empresas/tabela-lista-empresas.component';
import { ConfirmDialog } from './confirm-dialog/confirm-dialog.component';
import { MatMenuModule } from '@angular/material/menu';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatTableModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatRippleModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    MatSortModule,
    MatIconModule,
    MatListModule,
    MatDividerModule,
    MatMenuModule
  ],
  declarations: [
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
    TabelaComponent,
    FileUploadComponent,
    ByteToSizePipe,
    FileNamePipe,
    CsvComponent,
    TabelaListaEmpresasComponent,
    TabelaEmpresasComponent,
    ConfirmDialog,
    TabelaEnviosComponent,
    TabelaEnvioEmailComponent
  ],
  exports: [
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
    TabelaComponent,
    FileUploadComponent,
    CsvComponent,
    TabelaListaEmpresasComponent,
    TabelaEmpresasComponent,
    ConfirmDialog,
    TabelaEnviosComponent,
    TabelaEnvioEmailComponent
  ]
})
export class ComponentsModule { }
