import { ofType } from '@ngrx/effects';
import { Actions } from '@ngrx/effects';
import  * as RecipeActions from './store/recipe.actions';
import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';

import { Recipe } from './recipe.model';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer'
import { map, take, switchMap, of } from 'rxjs';


@Injectable({ providedIn: 'root' })
export class RecipesResolverService implements Resolve<Recipe[]> {
  constructor(
    private store: Store<fromApp.AppState>,
    private actions$: Actions
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // const recipes = this.recipesService.getRecipes();

      return this.store.select('recipes').pipe(
        take(1),
        map(recipeState=>{
          return recipeState.recipes;
        }),
        switchMap(recipes =>{
          if(recipes.length === 0){
            this.store.dispatch(new RecipeActions.FetchRecipes())
            return this.actions$.pipe(
              ofType(RecipeActions.SET_RECIPE),
              take(1)
            )
          }
          else {
            return of(recipes);
          }
        })
      )
    } 
  }
