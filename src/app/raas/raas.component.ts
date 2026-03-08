import { Component, OnInit } from '@angular/core';
import { AppHeaderComponent } from '../app-header/app-header.component'
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PacienteDto } from '../services/paciente/paciente.service';

@Component({
  selector: 'app-raas',
  imports: [
    AppHeaderComponent,
    ReactiveFormsModule
  ],
  templateUrl: './raas.component.html',
  styleUrl: './raas.component.css'
})
export class RaasComponent implements OnInit {

  raasForm!: FormGroup;
  paciente: any;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    
  }

}
