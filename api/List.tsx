import {database} from '../Config';
import {STATE, RIGHT} from './Constants';

export const createList = (uid, name, right) => {
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

export const deleteList = async (uid, listId) => {
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