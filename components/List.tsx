import React, { useState, useEffect, useContext, useRef, FC } from 'react';
import {View, Text, TextInput, ScrollView, TouchableOpacity, Animated, Keyboard} from 'react-native';
import {Divider, Icon} from 'react-native-elements';

import {database} from '../Config';

import {createList, createListIngredient, deleteList, deleteListIngredient, toggleListIngredient} from '../api/List';
import {createIngredient} from '../api/Ingredient';
import {ListIngredientItem, ListIngredientItems, UserListItems} from '../api/RDBInterface';
import {RIGHT} from '../api/Constants';

import {TABS_HEIGHT, WINDOW} from './Constants';
import {DARK_GRAY, VERY_LIGHT_GRAY, BLACK, DARK_ORGANGE, textStyle} from '../styles/Common';
import {UserContext} from '../App';
import {MenuModalItem} from './MenuModal';
import { Tabs } from './common/Tabs';

interface IngredientListInterface {
    listId: string,
    ingredientItems: ListIngredientItems,
    setIngredientItems: React.Dispatch<ListIngredientItems>,
}

const IngredientList: FC<IngredientListInterface> = ({listId, ingredientItems, setIngredientItems}) => {

    useEffect(() => {
        const listRef = database.ref('/lists/'+listId+'/list_ingredients');
        const onListIngredientsChange = listRef.on('value', (data) => {
            if (data) {
                const listIngredients = data.val();
                setIngredientItems(listIngredients || {});
            }
        });
        return () => listRef.off('value', onListIngredientsChange);
    }, [listId]);

    return (
        <View>
            {Object.entries(ingredientItems).map(([k, v], idx) => {return <IngredientListItem listId={listId} ingredient={v} ingredientId={k} key={idx}/>})}
        </View>
    );
}

interface IngredientListItemInterface {
    listId: string,
    ingredient: ListIngredientItem,
    ingredientId: string
}

const IngredientListItem:FC<IngredientListItemInterface> = ({listId, ingredient, ingredientId}) => {
    return (
        <TouchableOpacity
            style={{flex: 1, flexDirection: 'row', height: 55, alignItems: 'center',
                    justifyContent: 'flex-start', paddingHorizontal: WINDOW.width*0.05}}
            onPress={() => {toggleListIngredient(listId, ingredientId, !ingredient.checked)}}
        >
            <Icon
                name={ingredient.checked ? 'check-circle' : 'circle'}
                type='feather'
                color={ingredient.checked  ? BLACK : DARK_GRAY}
                style={{paddingRight: 10}}
                size={25}
                solid={false}
            />
            <Text style={[textStyle.h3]}>{ingredient.ingredient_name}</Text>
        </TouchableOpacity>
    );
}

interface AddIngredientInputInterface {
    listId: string
}

const AddIngredientInput: FC<AddIngredientInputInterface> = ({listId}) => {

    const {user} = useContext(UserContext);

    const addIngredientWidth = useRef(new Animated.Value(90)).current;
    const textInputRef = useRef(null);
    const [ingredientName, setIngredientName] = useState('');
    const [isExpanded, setIsExpanded] = useState(false);


    useEffect(() => {
        if (isExpanded) {
            Keyboard.addListener("keyboardDidHide", blurTextInput);
        } else {
            Keyboard.removeListener("keyboardDidHide", blurTextInput);
        }
    }, [isExpanded]);

    const expandAddIngredient = () => {
        setIsExpanded(true);
        Animated.timing(addIngredientWidth, {
            duration: 600,
            toValue: WINDOW.width * 0.9,
            useNativeDriver: false,
        }).start(() => {
            textInputRef.current.focus()
        });
    };

    const collapseAddIngredient = () => {
        Animated.timing(addIngredientWidth, {
            duration: 600,
            toValue: 90,
            useNativeDriver: false,
        }).start(() => {
            setIsExpanded(false);
            setIngredientName('');
        });
    };

    const blurTextInput = () => {
        collapseAddIngredient();
        return true;
    };

    const addNewIngredient = async () => {
        if (ingredientName) {
            const ingredientId = await createIngredient(user.uid, ingredientName.toLowerCase());
            createListIngredient(listId, ingredientId, ingredientName.toLowerCase());
        }
        collapseAddIngredient();
    };

    return (
        <Animated.View style={{height: 50, width: addIngredientWidth, marginVertical: 20}}>
            <TouchableOpacity
                style={{justifyContent: 'center', alignItems: isExpanded ? 'flex-start' : 'flex-end', width: '100%', height: '100%',
                        borderTopEndRadius: 8, borderBottomEndRadius: 8, backgroundColor: VERY_LIGHT_GRAY, paddingLeft: 10}}
                onPress={expandAddIngredient}
            >
                {
                isExpanded ?
                    <TextInput
                        ref={textInputRef}
                        style={{flex: 1, height: '100%', fontSize: 24}}
                        onSubmitEditing={addNewIngredient}
                        onBlur={blurTextInput}
                        value={ingredientName}
                        onChangeText={setIngredientName}
                    />
                :
                    <Icon
                        name='plus'
                        type='feather'
                        color={DARK_GRAY}
                        style={{paddingRight: 10}}
                        size={30}
                        solid={false}
                    />
                }
            </TouchableOpacity>
        </Animated.View>
    );
}

interface ListInterface {
    setMenuItems: React.Dispatch<MenuModalItem[]>
}

const List: FC<ListInterface> = ({setMenuItems}) => {

    const {user} = useContext(UserContext);
    const [selectedListId, setSelectedListId]: [string, React.Dispatch<string>] = useState(undefined);
    const [userLists, setUserLists]: [UserListItems, React.Dispatch<UserListItems>] = useState({});
    const [ingredientItems, setIngredientItems]: [ListIngredientItems, React.Dispatch<ListIngredientItems>] = useState({});

    useEffect(() => {
        const userListsRef = database.ref('/users/'+user.uid+'/lists');
        const onUserListsChange = userListsRef.on('value', (data) => {
            if (data) {
                const lists = data.val()
                setUserLists(lists || {});
            }
        });
        return () => userListsRef.off('value', onUserListsChange);
    }, [user.uid]);

    useEffect(() => {
        if (selectedListId === undefined && Object.keys(userLists)) {
            setSelectedListId(Object.keys(userLists)[0]);
        }
    }, [userLists]);

    useEffect(() => {
        const menuItems: MenuModalItem[] = [];
        if (selectedListId !== undefined) {
            const checkedItems = Object.entries(ingredientItems).filter(([k, v]) => {
                return v.checked;
            }).map(([k, _]) => k);

            if (checkedItems.length) {
                menuItems.push({
                    text: 'Remove Checked Items',
                    iconName: 'trash-2',
                    action: () => {
                        checkedItems.forEach((key) => {
                            deleteListIngredient(selectedListId, key);
                        })
                    }
                });
            }

            menuItems.push({
                text: 'Remove List', 
                iconName: 'trash',
                action: () => {
                    const listsIds = Object.keys(userLists).filter((id) => {return id !== selectedListId})
                    if (listsIds.length) {
                        setSelectedListId(listsIds[0]);
                    } else {
                        setSelectedListId(undefined);
                    }
                    deleteList(user.uid, selectedListId);
                }
            });
        }
        setMenuItems(menuItems);
        return () => {setMenuItems([]);}
    }, [selectedListId, ingredientItems])


    return (
        <View style={{height: '100%'}}>
            <View style={{height: TABS_HEIGHT}}>
                <Tabs items={userLists} createItem={(name) => {return createList(user.uid, name, RIGHT.CREATOR)}} selectedItemId={selectedListId} selectItem={setSelectedListId}/>
            </View>
            <View style={{ flex: 1}}>
                {
                selectedListId ?
                    <ScrollView>
                        <IngredientList listId={selectedListId} ingredientItems={ingredientItems} setIngredientItems={setIngredientItems}/>
                        <AddIngredientInput listId={selectedListId}/>
                    </ScrollView>
                :
                    undefined
                }
            </View>
        </View>
    );

};

export default List;
