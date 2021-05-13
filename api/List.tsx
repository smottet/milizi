import {database} from '../Config';
import {STATE, RIGHT} from './Constants';

export const createList = (uid: string, name: string, right: RIGHT): string => {
    const userListsRef = database.ref('/users/'+uid+'/lists');
    const newList = userListsRef.push();
    newList.set({
                    right: right,
                    name: name,
                    state: STATE.ACCEPTED,
                });
    const listRef = database.ref('/lists/'+newList.key);
    listRef.set({name: name});
    const listCreatorRef = database.ref('/lists/'+newList.key+'/users/'+uid);
    listCreatorRef.set({'state': STATE.ACCEPTED, 'right': RIGHT.CREATOR});
    return newList.key;
};

export const createListIngredient = (listId: string, ingredientId: string, ingredientName: string,
                                    recipeId: string = undefined, recipeName: string = undefined): string => {
    const listRef = database.ref('/lists/'+listId+'/list_ingredients');
    // TODO Look for duplicate (ingredientId, recipeId) pairs
    const newListIngredient = listRef.push();
    newListIngredient.set({
        ingredient_id: ingredientId,
        ingredient_name: ingredientName,
        recipe_id: recipeId,
        recipe_name: recipeName,
        qtty: 0,
        unit: false,
        checked: false,
    });
    return newListIngredient.key;
}

export const toggleListIngredient = (listId: string, listIngredientId: string, checked: boolean): void => {
    const listIngredientRef = database.ref('/lists/'+listId+'/list_ingredients/'+listIngredientId+'/checked');
    listIngredientRef.set(checked);
}

export const deleteList = async (uid: string, listId: string): Promise<void> => {
    const listRef = database.ref('/lists/'+listId);
    await listRef.keepSynced(true)
    const snapshot = await listRef.once('value')
    const list = snapshot.val();
    if (list.users[uid]) {
        if (Object.keys(list.users).length <= 1) {
            listRef.remove();
        } else {
            database.ref('/lists/'+listId+'/users/'+uid).remove();
        }
    }
    database.ref('/users/'+uid+'/lists/'+listId).remove();
    await listRef.keepSynced(false);
}