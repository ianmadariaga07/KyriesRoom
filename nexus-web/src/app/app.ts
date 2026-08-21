import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {MessageService, PrimeTemplate} from 'primeng/api';
import {ToastModule} from 'primeng/toast';
import {PrimeNG} from 'primeng/config';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, PrimeTemplate, CommonModule, ToastModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit{
  protected readonly title = signal('nexus-web');
  private messageService = inject(MessageService);
  private primeng = inject(PrimeNG);

  ngOnInit() {
    this.primeng.ripple.set(true);
  }
}
