
import {STATE, RIGHT, FRIENDSHIP_STATE} from './Constants';

//======================================
// DB
//======================================

export interface DB {
    users: {
        [id: string]: UserItem,
    },
    ingredients: {
        [id: string]: IngredientItem,
    },
    lists: {
        [id: string]: ListItem,
    },
    recipes: {
        [id: string]: RecipeItem,
    }
}

export interface SharedResource {
    right: RIGHT,
    state: STATE,
}

export interface IngredientInstance {
    ingredient_id: string,
    ingredient_name: string,
    qtty?: number,
    unit?: any, // TODO Add an enum
}

//======================================
// User
//======================================

export interface UserItem {
    email: string,
    lang: string,
    friends?: FriendItems,
    lists?: UserListItems,
    recipes?: UserRecipeItems,
    ingredients?: UserIngredientItems,
    recipe_categories?: UserRecipeCategoryItems,
}

export interface FriendItems {
    [id :string]: FriendItem,
}

export interface FriendItem {
    state: FRIENDSHIP_STATE
}

export interface UserListItems {
    [id: string]: UserListItem
}

export interface UserListItem extends SharedResource {
    name: string,
}

export interface UserRecipeItems {
    [id: string]: UserRecipeItem
}

export interface UserRecipeItem extends SharedResource {
    name: string,
}

export interface UserIngredientItems {
    [id: string]: UserIngredientItem,
}

export interface UserIngredientItem {
    name: string,
}

export interface UserRecipeCategoryItems {
    [id: string]: UserRecipeCategoryItem,
}

export interface UserRecipeCategoryItem {
    name: string,
}

//======================================
// List
//======================================

export interface ListItem {
    name: string,
    list_ingredients?: any,
    users?: any,
}

export interface ListIngredientItems {
    [id: string]: ListIngredientItem,
}

export interface ListIngredientItem extends IngredientInstance {
    recipe_id?: string,
    recipe_name?: string,
    checked: boolean,
}

export interface ListUserItems {
    [id: string]: ListUserItem,
}

export interface ListUserItem extends SharedResource {}

//======================================
// Recipe
//======================================

export interface RecipeItem {
    name: string,
    recipe_ingredients?: RecipeIngredientItems,
    users?: RecipeUserItems,
}

export interface RecipeIngredientItems {
    [id: string]: RecipeIngredientItem
}

export interface RecipeIngredientItem extends IngredientInstance  {}

export interface RecipeUserItems {
    [id: string]: RecipeUserItem,
}

export interface RecipeUserItem extends SharedResource {}

//======================================
// Ingredient
//======================================

export interface IngredientItems {
    [id: string]: IngredientItem,
}

export interface IngredientItem {
    name: string,
}
