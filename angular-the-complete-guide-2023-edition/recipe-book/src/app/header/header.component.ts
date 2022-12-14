import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { map, Subscription } from 'rxjs';
import { Store } from "@ngrx/store";

// import { AuthService } from '../auth/auth.service';
// import { DataStorageService } from '../shared/data-storage.service';

import * as fromApp from '../store/app.reducer';
import * as AuthActions from '../auth/store/auth.actions';
import * as RecipeActions from '../recipes/store/recipe.action';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuthenticated: boolean = false;
  
  // @Output() featureSelected = new EventEmitter<string>();
  private userSub: Subscription;//subscription for check status of user

  
  constructor(
    // private dataStorageService: DataStorageService, 
    private store: Store<fromApp.AppState>
    ) { }

  ngOnInit() {
    console.log('ngOnInit header');
    console.log('isAuthenticated: ' + this.isAuthenticated);

    //this.userSub = this.authService.user.subscribe(user => {
      this.userSub = this.store.select('auth').pipe(
        map(authState => {
          return authState.user
        })
      ).subscribe(user => {
      // this.isAuthenticated = !user ? false : true;
      this.isAuthenticated = !!user; //same written as before, but shortcut
      console.log('!user: ' + !user);
      console.log('!!user: ' + !!user);
    });
    console.log('isAuthenticated: ' + this.isAuthenticated);
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
    console.log('onDestroy header');
  }

  onSaveData(){
    // this.dataStorageService.storeRecipes();
    this.store.dispatch(new RecipeActions.StoreRecipes());
  }
  onFetchData(){
    // this.dataStorageService.fetchRecipes().subscribe();//need to be added subscribe because we remove it from service
    this.store.dispatch(new RecipeActions.FetchRecipes());
  }

  onLogout(){
    // this.authService.logout();
    this.store.dispatch(new AuthActions.Logout())
  }
  // onSelect(feature:string){
  //   this.featureSelected.emit(feature);
  // }
}
