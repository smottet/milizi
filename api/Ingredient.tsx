import {database} from '../Config';
import { IngredientItem, UserIngredientItem } from './RDBInterface';


export const createIngredient = async (uid: string, name: string): Promise<string> => {
    const userIngredientsRef = database.ref('/users/'+uid+'/ingredients');
    const ingredientsRef = database.ref('/ingredients');
    const snapshotUserIngredient = await userIngredientsRef.orderByChild('name').equalTo(name).once('value');
    const userIngredient: UserIngredientItem = snapshotUserIngredient.val();
    if (userIngredient) {
        return Object.keys(userIngredient)[0];
    } else {
        const snapshotIngredient = await ingredientsRef.orderByChild('name').equalTo(name).once('value');
        const ingredient: IngredientItem = snapshotIngredient.val();
        let key = ingredient && Object.keys(ingredient)[0];
        if (!ingredient) {
            const newIngredient = ingredientsRef.push();
            newIngredient.set({name: name});
            key = newIngredient.key;
        }
        const newUserIngredientRef = database.ref('/users/'+uid+'/ingredients/'+key);
        newUserIngredientRef.set({name: name});
        return key;
    }
};
