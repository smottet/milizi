import {database} from '../Config';

export const createUser = (uid, email, lang='en') => {
    database.ref('/users/'+uid).set({
        email: email,
        lang: lang,
        friends: false,
        recipes: false,
        lists: false
    });
};