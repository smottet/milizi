/* eslint-disable prettier/prettier */
/**
 * @format
 */

import React, { useState, useEffect, useContext, useRef } from 'react';
import {View, Text, TextInput, Button, ScrollView, TouchableOpacity, Animated, BackHandler, Keyboard} from 'react-native';
import {Divider, Icon} from 'react-native-elements';

import {deleteList} from '../api/List';


import {database} from '../Config';
import {createList} from '../api/List';
import {RIGHT} from '../api/Constants';
import {WINDOW} from './Constants';
import {DARK_GRAY, VERY_LIGHT_GRAY, BLACK, DARK_ORGANGE, textStyle} from '../styles/Common';
import {UserContext} from '../App';

const LIST_TABS_HEIGHT = 75;

const ListTab = ({text, listId, selectedListId, selectList}) => {

    return (
        <TouchableOpacity style={{justifyContent: 'center', paddingRight: WINDOW.width * 0.05}} onPress={() => {selectList(listId)}}>
            {
                selectedListId === listId ? <Divider style={{height: 4, backgroundColor: DARK_ORGANGE, width: '66%'}}/> : undefined
            }
            <Text style={[selectedListId === listId ? {...textStyle.h2, color: BLACK} : {...textStyle.h3, color: DARK_GRAY}, {textTransform: 'capitalize', marginTop: 2}]}>{text}</Text>
        </TouchableOpacity>
    )
}

const AddListInput = ({selectList}) => {

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

const ListTabs = ({lists, selectedListId, selectList}) => {

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

const List = ({setMenuItems}) => {

    const {user} = useContext(UserContext);

    const [selectedListId, setSelectedListId] = useState(undefined);
    const [userLists, setUserLists] = useState({});
    const userListsRef = database.ref('/users/'+user.uid+'/lists');

    useEffect(() => {
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
        const menuItems = [];
        if (selectedListId !== undefined) {
            menuItems.push({
                            text: 'Remove List ', 
                            iconName: 'trash', 
                            action: () => {
                                            deleteList(user.uid, selectedListId);
                                            setSelectedListId(undefined);
                                        }
                            });
        }
        setMenuItems(menuItems);
        return () => {setMenuItems([]);}
    }, [selectedListId])

    return (
        <View style={{height: '100%', backgroundColor:'blue'}}>
            <View style={{height: LIST_TABS_HEIGHT}}>
                <ListTabs lists={userLists ? userLists : {}} selectedListId={selectedListId} selectList={setSelectedListId}/>
            </View>
            <View style={{ flex: 1, backgroundColor:'red'}}>

            </View>
        </View>
    );

};

export default List;
