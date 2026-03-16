import { Component, OnInit } from '@angular/core';
import { AppHeaderComponent } from "../app-header/app-header.component";
import { AnamneseDTO } from '../services/anamnese/anamnese.model';
import { Router } from '@angular/router';
import { AnamneseService } from '../services/anamnese/anamnese.service';

@Component({
  selector: 'app-anamnese-infantil',
  imports: [AppHeaderComponent],
  templateUrl: './anamnese-infantil.component.html',
  styleUrl: './anamnese-infantil.component.css'
})
export class AnamneseInfantilComponent implements OnInit {

  anamnese: AnamneseDTO[] = [];
  pageNo = 0;
  pageSize = 10;
  totalElements = 0;
  sortBy = 'nome';
  direction = 'asc';
  
  
 ngOnInit(): void {
   
 }

 constructor(
  private router: Router,
  private anamneseService: AnamneseService
) {}


 addAnamnese() {
    console.log('Adicionar anamnese');
    this.router.navigate(['/anamnese-infantil/cadastrar']);
  }
}
