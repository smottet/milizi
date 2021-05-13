import React, { useState, useEffect, useContext, useRef, FC } from 'react';
import {View, Text, TextInput, ScrollView, TouchableOpacity, Animated, Keyboard} from 'react-native';
import {Divider, Icon} from 'react-native-elements';

import {database} from '../Config';

import {createList, createListIngredient, deleteList, toggleListIngredient} from '../api/List';
import {createIngredient} from '../api/Ingredient';
import {ListIngredientItem, ListIngredientItems, UserListItems} from '../api/RDBInterface';
import {RIGHT} from '../api/Constants';

import {WINDOW} from './Constants';
import {DARK_GRAY, VERY_LIGHT_GRAY, BLACK, DARK_ORGANGE, textStyle} from '../styles/Common';
import {UserContext} from '../App';
import {MenuModalItem} from './MenuModal';


const LIST_TABS_HEIGHT = 75;


interface ListTabsInterface {
    lists: UserListItems,
    selectedListId: string,
    selectList: React.Dispatch<string>
}

const ListTabs: FC<ListTabsInterface> = ({lists, selectedListId, selectList}) => {

    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{alignItems: 'center'}}
            style={{height: LIST_TABS_HEIGHT, width: '100%'}}
        >   
            <AddListInput selectList={selectList}/>
            {Object.keys(lists).map((listId) => <ListTab 
                                                    key={listId}
                                                    text={lists[listId].name}
                                                    listId={listId}
                                                    selectedListId={selectedListId}
                                                    selectList={selectList}
                                                />)}
        </ScrollView>
    )
}

interface ListTabInterface {
    text: string,
    listId: string,
    selectedListId: string,
    selectList: React.Dispatch<string>
};

const ListTab: FC<ListTabInterface> = ({text, listId, selectedListId, selectList}) => {
    return (
        <TouchableOpacity style={{justifyContent: 'center', paddingRight: WINDOW.width * 0.05}} onPress={() => {selectList(listId)}}>
            {
                selectedListId === listId ? <Divider style={{height: 4, backgroundColor: DARK_ORGANGE, width: '66%'}}/> : undefined
            }
            <Text style={[selectedListId === listId ? {...textStyle.h2, color: BLACK} : {...textStyle.h3, color: DARK_GRAY}, {textTransform: 'capitalize', marginTop: 2}]}>{text}</Text>
        </TouchableOpacity>
    )
}

interface AddListInputInterface {
    selectList: React.Dispatch<string>,
}

const AddListInput:FC<AddListInputInterface> = ({selectList}) => {

    const {user} = useContext(UserContext);
    const addListDimension = useRef(new Animated.ValueXY({x: 40, y: 40})).current;
    const textInputRef = useRef(null);
    const [newListName, setNewListName] = useState('');
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        if (isExpanded) {
            Keyboard.addListener("keyboardDidHide", blurTextInput);
        } else {
            Keyboard.removeListener("keyboardDidHide", blurTextInput);
        }
    }, [isExpanded]);

    const expandAddList = () => {
        setIsExpanded(true);
        Animated.timing(addListDimension, {
            duration: 400,
            toValue: {x: 200, y: 55},
            useNativeDriver: false,
        }).start(() => {
            textInputRef.current.focus();
        });
    };

    const collapseAddList = () => {
        Animated.timing(addListDimension, {
            duration: 400,
            toValue: {x: 40, y: 40},
            useNativeDriver: false,
        }).start(() => {
            setIsExpanded(false);
            setNewListName('');
        });
    };
    
    const createNewList = () => {
        if (newListName) {
            const newListId = createList(user.uid, newListName, RIGHT.OWNER);
            selectList(newListId);
        }
        collapseAddList();
    };

    const blurTextInput = () => {
        collapseAddList(); 
        return true;
    };

    return (            
        <Animated.View style={{width: addListDimension.x, height: addListDimension.y, justifyContent: 'center',
                               alignItems: 'center', marginHorizontal:  WINDOW.width * 0.05}}>
            <TouchableOpacity 
                style={{justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%',
                borderRadius: 8, backgroundColor: VERY_LIGHT_GRAY }} 
                onPress={expandAddList}
            >
                {
                isExpanded ? 
                    <TextInput 
                        ref={textInputRef}
                        style={{width: '100%', height: '100%', fontSize: 24}}
                        onSubmitEditing={createNewList}
                        onBlur={blurTextInput}
                        value={newListName}
                        onChangeText={setNewListName}
                    />
                : 
                    <Icon
                    name='plus'
                    type='feather'
                    color={DARK_GRAY}
                    size={30}
                    solid={false}
                    />
                }
            </TouchableOpacity>
        </Animated.View>
    );
}

interface IngredientListInterface {
    listId: string
}

const IngredientList: FC<IngredientListInterface> = ({listId}) => {

    const [ingredientItems, setIngredientItems]: [ListIngredientItems, React.Dispatch<ListIngredientItems>] = useState({});

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
    }, [selectedListId])

    return (
        <View style={{height: '100%'}}>
            <View style={{height: LIST_TABS_HEIGHT}}>
                <ListTabs lists={userLists ? userLists : {}} selectedListId={selectedListId} selectList={setSelectedListId}/>
            </View>
            <View style={{ flex: 1}}>
                {
                selectedListId ?
                    <ScrollView>
                        <IngredientList listId={selectedListId}/>
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
