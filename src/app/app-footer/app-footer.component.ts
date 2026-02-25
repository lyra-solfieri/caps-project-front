import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { interval, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app-footer.component.html',
  styleUrls: ['./app-footer.component.css']
})
export class AppFooterComponent implements OnInit, OnDestroy{
  public dataAtual: Date = new Date();
  private timerSubscription?: Subscription;

  ngOnInit(): void {
    // Atualiza a data/hora a cada 1 segundo (1000ms)
    this.timerSubscription = interval(1000).subscribe(() => {
      this.dataAtual = new Date();
    });
  }

  ngOnDestroy(): void {
    // Importante cancelar a subscrição para evitar vazamento de memória
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }
}''
