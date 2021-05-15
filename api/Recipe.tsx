import {database} from '../Config';

//===================================================
// Recipe Category
//===================================================

export const createRecipeCategory = (uid: string, name: string): string => {
    const userRecipeCategoryRef = database.ref('/users/'+uid+'/recipe_categories');
    const newRecipeCategory = userRecipeCategoryRef.push();
    newRecipeCategory.set({name: name});
    return newRecipeCategory.key;
};
