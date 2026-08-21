import { Component, inject} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from '../../services/auth';
import {Router} from '@angular/router';
import {CommonModule} from '@angular/common';
import {MessageService} from 'primeng/api';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  providers: [],
  templateUrl: './login.html',
  styleUrl: './login.css',
})

export class Login {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private messageService = inject(MessageService);

  loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  onSubmit() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.getRawValue()).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Inicio de Sesion Exitoso', detail: 'Status: verified' });
          //redirigimos automáticamente a la vista de transacciones
          this.router.navigate(['/transactions']);
        },
        error: () => {
          this.messageService.add({ severity: 'error', summary: 'Fallo en la operacion', detail: 'Desc: Autorizacion denegada'});
        }
      });
    }
  }
}
