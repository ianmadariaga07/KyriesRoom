import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

export interface LoginResponse {
  message: string;
  user: {
    id: number;
    email: string;
  };
}

@Injectable({
  //esto hace que el servicio sea Singleton
  //Singleton era hacer una instancia para toda la app
  providedIn: 'root'
})

//el service nunca toca el token, revisa el estado. El unico que sabe del token es el backend
export class AuthService {
  //HttpClient para hacer peticiones
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/auth';

  //ESTADO GLOBAL:Usamos Signals para que cualquier componente puede leer esto al instante
  currentUser = signal<any | null>(null);
  isLoggedIn = signal<boolean>(false);

  //aqui enviamos las credenciales al backend
  login(credentials: { email: string; password: string }) {
    //el interceptorHTTP se encarga de mandar la cookie, pero en el login es donde el backend
    //nos la entrega por primera vez
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(
        //tap nos permite ejecutar codigo secundario sin alterar la respuesta principal
        tap((response) => {
          this.isLoggedIn.set(true);
          this.currentUser.set(response.user);
        })
      );
  }

  logout() {
    //esto para que el backend borre la cookie
    this.http.post(`${this.apiUrl}/logout`, {}).subscribe();
    this.isLoggedIn.set(false);
    this.currentUser.set(null);
  }
}
