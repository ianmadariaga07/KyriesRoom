import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authReq = req.clone({
    withCredentials: true
  });
  //Retornamos next(authReq) en vez de next(req) porque las peticiones HTTP son inmutables
  //tenemos que clonar la peticion para poder agregarle las configuraciones y enviarlas
  //al ser inmutables no se pueden modificar, por eso hacemos un clon
  return next(authReq);
};
