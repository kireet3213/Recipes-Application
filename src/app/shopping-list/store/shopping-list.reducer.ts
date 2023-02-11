// import { ShoppingListState } from './shopping-list.reducer';
import { Ingredient } from './../../shared/ingredient.model';
import { Action } from "@ngrx/store";
// import { ADD_INGREDIENT } from './shopping-list.actions';
import * as ShoppingListActions from './shopping-list.actions'

export interface AppState {
shoppingList:ShoppingListState
}

export interface ShoppingListState {
    ingredients: Ingredient[],
    editedIngredient: Ingredient ,
      editedIngredientIndex: number;
}

const initialState= {
    ingredients:[
        new Ingredient('Apples', 5),
        new Ingredient('Tomatoes', 10),
      ],
      editedIngredient: null,
      editedIngredientIndex: -1 
}

export function shoppingListReducer(state = initialState,action: ShoppingListActions.ShoppingListActions):ShoppingListState{

    switch (action.type) {

        case ShoppingListActions.ADD_INGREDIENT: 
        return {
            ...state,ingredients:[...state.ingredients, action.payload]
        }
    
        case ShoppingListActions.ADD_INGREDIENTS: 
        return {
            ...state,ingredients:[...state.ingredients, ...action.payload]
        }
        case ShoppingListActions.UPDATE_INGREDIENTS: 
        const ingredient= state.ingredients[state.editedIngredientIndex]; //old state is not to be changed
   
        const updatedIngredient= {
            ...ingredient,
            ...action.payload
        }
        const updatedIngredients= [...state.ingredients]
        updatedIngredients[state.editedIngredientIndex]= updatedIngredient;

        return {
            ...state,ingredients:updatedIngredients, editedIngredientIndex:-1,editedIngredient:null
        }

        case ShoppingListActions.DELETE_INGREDIENTS:
            return {
                ...state,
                ingredients: state.ingredients.filter((ig,igIndex)=>{
                    return igIndex !== state.editedIngredientIndex;
                })
            }
            case ShoppingListActions.START_EDIT:
                return {
...state, editedIngredientIndex: action.payload, editedIngredient: {...state.ingredients[action.payload]}

                }
            case ShoppingListActions.STOP_EDIT:
      return {
        ...state,
        editedIngredient: null,
        editedIngredientIndex: -1 
      }
        default:
            return {
                ...state
            }
    }
}