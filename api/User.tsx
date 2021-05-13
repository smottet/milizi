import {database} from '../Config';
import { UserItem } from './RDBInterface';

export const createUser = (uid: string, email: string, lang='en') => {
    const user: UserItem = {
        email: email,
        lang: lang,
    };
    database.ref('/users/'+uid).set(user);
};
