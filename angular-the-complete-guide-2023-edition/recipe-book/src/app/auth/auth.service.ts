import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, Subject, tap, throwError } from 'rxjs';
import { User } from './user.model';

export interface AuthResponseData {
  idToken: string,
  email: string,
  refreshToken: string,
  expiresIn: string,
  localId: string,
  registered?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  //user = new Subject<User>();//replace subject for behaviorsubject
  user = new BehaviorSubject<User>(null);//get previous value, for use fetch data 

  constructor(
    private http : HttpClient,
    private router: Router) { }

  singUp(email: string, password: string){
    return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAbuofw54uBPRUsc-L2FukNyHWp_G3VX4c',
      {
        email: email,
        password: password,
        returnSecureToken: true
      }
    ).pipe(
      catchError(this.handlerError), 
      tap(responseData => {
        this.handleAuthentication(
          responseData.email, 
          responseData.localId, 
          responseData.idToken, 
          +responseData.expiresIn)
      })
      );    
  }

  login(email: string, password: string){
    return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAbuofw54uBPRUsc-L2FukNyHWp_G3VX4c',
    {
      email: email,
      password: password,
      returnSecureToken: true
    }
    )
    .pipe(
      catchError(this.handlerError),
      tap(responseData => {
        this.handleAuthentication(
          responseData.email, 
          responseData.localId, 
          responseData.idToken, 
          +responseData.expiresIn)
      }))
  }

  logout(){
    this.user.next(null);
    this.router.navigate(['/auth']);
  }

  private handleAuthentication(
    email: string, 
    userId: string, 
    token: string, 
    expiresIn: number
    ){
      const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);//need to be gettime otherwise expire time is not valid
      const user = new User(email, userId, token, expirationDate);
      this.user.next(user);
  }

  private handlerError(errorResponse: HttpErrorResponse){
    let errorMessage = 'An error occured!';
    if(!errorResponse.error || !errorResponse.error.error){
      return throwError(() => new Error(errorMessage));
    }
    switch (errorResponse.error.error.message){
      case 'EMAIL_EXISTS' : {
        errorMessage = 'The email address is already in use by another account.';
        break;
      }
      case 'OPERATION_NOT_ALLOWED' : {
        errorMessage = 'Password sign-in is disabled for this project.';
        break;
      }
      case 'TOO_MANY_ATTEMPTS_TRY_LATER' : {
        errorMessage =  'We have blocked all requests from this device due to unusual activity. Try again later.'
        break;
      }
      case 'EMAIL_NOT_FOUND' : {
        errorMessage = 'There is no user record corresponding to this identifier. The user may have been deleted.'
        break;
      }
      case 'INVALID_PASSWORD' : {
        errorMessage = 'The password is invalid or the user does not have a password.';
        break;
      }
      case 'USER_DISABLED' : {
        errorMessage = 'The user account has been disabled by an administrator.';
        break;
      }
      default : {errorMessage = 'An error occured!'} break;
    } 
    return throwError(() => new Error(errorMessage));
  }
}
