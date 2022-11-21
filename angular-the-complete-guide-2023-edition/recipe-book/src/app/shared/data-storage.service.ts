import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Recipe } from "../recipes/recipe.model";
import { RecipeService } from "../recipes/recipe.service";

@Injectable({providedIn: 'root'})

export class DataStorageService {
    constructor(private http: HttpClient, private recipeService: RecipeService){}

    storeRecipes(){
        const recipes = this.recipeService.getRecipes();
        return this.http.put('https://ng-course-recipe-book-92fb1-default-rtdb.europe-west1.firebasedatabase.app/recipes.json',recipes)
        .subscribe(response =>{
            console.log(response);
        });
    }

    fetchRecipes(){
      return this.http.get<Recipe[]>('https://ng-course-recipe-book-92fb1-default-rtdb.europe-west1.firebasedatabase.app/recipes.json')
      .subscribe(recipes =>{
        // console.log(recipes);
        this.recipeService.setRecipes(recipes);
      });
    }
}