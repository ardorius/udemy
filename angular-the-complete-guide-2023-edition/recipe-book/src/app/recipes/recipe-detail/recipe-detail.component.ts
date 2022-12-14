import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Store } from '@ngrx/store';
// import { Ingredient } from 'src/app/shared/ingridient-model';
// import { ShoppingListService } from 'src/app/shopping-list/shopping-list.service';
import { map, switchMap } from 'rxjs';

// import { RecipeService } from '../recipe.service';
import { Recipe } from '../recipe.model';
import * as fromApp from '../../store/app.reducer';
import * as RecipesActions from '../store/recipe.action';
import * as ShoppingListActions from '../../shopping-list/store/shopping-list.actions';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
  recipe: Recipe;
  id: number;

  constructor(
    //private shoppingListService:ShoppingListService,
    // private recipeService:RecipeService,
    private route:ActivatedRoute,
    private router: Router,
    private store: Store<fromApp.AppState>
    ) { }

  ngOnInit(): void {
   
    this.route.params.pipe(map(
      params => {
        return +params['id'];
      }), switchMap(id => {
        this.id = id;
        return this.store.select('recipes');
      }),
      map(
        recipesState => {
          return recipesState.recipes.find((recipe, index) => {
            return index === this.id
          });
      })
    ).subscribe( recipe => {
      this.recipe = recipe;
    });
  }

  onExistRecipe(){
    this.router.navigate(['edit'], {relativeTo: this.route});
    // this.router.navigate(['../', this.id, 'edit'], {relativeTo: this.route})
  }

  // addIngredients(){
  //   this.recipe.ingredients.forEach(ingredient => {
  //     this.shoppingListService.addIngredient({name: ingredient.name, amount: ingredient.amount});
  //   });
    
  // }

  addIngredients(){
  //  this.recipeService.addIngredientsToShoppingList(this.recipe.ingredients);  
  this.store.dispatch(new ShoppingListActions.AddIngredients(this.recipe.ingredients));  
  }

  onDeleteRecipe(){
    // this.recipeService.deleteRecipe(this.id);
    this.store.dispatch(new RecipesActions.DeleteRecipe(this.id));
    this.router.navigate(['/recipes']);
  }
}
