import { createEffect, concatLatestFrom } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { HttpClient } from '@angular/common/http';
import { switchMap, map, withLatestFrom } from 'rxjs/operators';

import * as RecipesActions from './recipe.actions';
import { Recipe } from '../recipe.model';
import * as fromApp from '../../store/app.reducer';

@Injectable()
export class RecipeEffects {

  fetchRecipes = createEffect(()=> this.actions$.pipe(
    ofType(RecipesActions.FETCH_RECIPES),
    switchMap(() => {
      console.log("fetchin recipes");
      return this.http.get<Recipe[]>('https://angular-recipes-ba85a-default-rtdb.firebaseio.com/recipes.json'
      );
    }),
    map(recipes => {
      return recipes.map(recipe => {
        return {
          ...recipe,
          ingredients: recipe.ingredients ? recipe.ingredients : []
        };
      });
    }),
    map(recipes => {
      return new RecipesActions.SetRecipes(recipes);
    })
  ));


  storeRecipes = createEffect(()=> this.actions$.pipe(
    ofType(RecipesActions.STORE_RECIPES),
    concatLatestFrom(()=>this.store.select('recipes')),
    switchMap(([actionData, recipesState]) => { 
      console.log(recipesState);
      return this.http.put(
        'https://angular-recipes-ba85a-default-rtdb.firebaseio.com/recipes.json',
        recipesState.recipes
      );
    })
  ),{dispatch:false});

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private store: Store<fromApp.AppState>
  ) {}
}
