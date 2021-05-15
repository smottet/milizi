import React, { useState, useEffect, useContext, useRef, FC } from 'react';

import { ScrollView, Text, TouchableOpacity, Animated, Keyboard, TextInput } from "react-native"
import { Divider } from 'react-native-elements/dist/divider/Divider';
import { Icon } from 'react-native-elements/dist/icons/Icon';
import { RIGHT } from '../../api/Constants';
import { UserListItems, UserRecipeCategoryItems } from '../../api/RDBInterface';
import { UserContext } from '../../App';
import { BLACK, DARK_GRAY, DARK_ORGANGE, textStyle, VERY_LIGHT_GRAY } from '../../styles/Common';
import { TABS_HEIGHT, WINDOW } from '../Constants';

interface TabsInterface {
    items: UserListItems|UserRecipeCategoryItems,
    selectedItemId: string,
    selectItem: React.Dispatch<string>,
    createItem: (name: string) => string
}

export const Tabs: FC<TabsInterface> = ({items, selectedItemId, selectItem, createItem}) => {

    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{alignItems: 'center'}}
            style={{height: TABS_HEIGHT, width: '100%'}}
        >
            <AddItemInput selectItem={selectItem} createItem={createItem}/>
            {Object.keys(items).map((itemId) => <Tab
                                                    key={itemId}
                                                    text={items[itemId].name}
                                                    itemId={itemId}
                                                    selectedItemId={selectedItemId}
                                                    selectItem={selectItem}
                                                />)}
        </ScrollView>
    )
}

interface TabInterface {
    text: string,
    itemId: string,
    selectedItemId: string,
    selectItem: React.Dispatch<string>
};

const Tab: FC<TabInterface> = ({text, itemId, selectedItemId, selectItem}) => {
    return (
        <TouchableOpacity style={{justifyContent: 'center', paddingRight: WINDOW.width * 0.05}} onPress={() => {selectItem(itemId)}}>
            {
                selectedItemId === itemId ? <Divider style={{height: 4, backgroundColor: DARK_ORGANGE, width: '66%'}}/> : undefined
            }
            <Text style={[selectedItemId === itemId ? {...textStyle.h2, color: BLACK} : {...textStyle.h3, color: DARK_GRAY}, {textTransform: 'capitalize', marginTop: 2}]}>{text}</Text>
        </TouchableOpacity>
    )
}

interface AddItemInputInterface {
    selectItem: React.Dispatch<string>,
    createItem: (name: string) => string
}

const AddItemInput: FC<AddItemInputInterface> = ({selectItem, createItem}) => {

    const {user} = useContext(UserContext);
    const addItemDimension = useRef(new Animated.ValueXY({x: 40, y: 40})).current;
    const textInputRef = useRef(null);
    const [newItemName, setNewItemName] = useState('');
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        if (isExpanded) {
            Keyboard.addListener("keyboardDidHide", blurTextInput);
        } else {
            Keyboard.removeListener("keyboardDidHide", blurTextInput);
        }
    }, [isExpanded]);

    const expandAddItem = () => {
        setIsExpanded(true);
        Animated.timing(addItemDimension, {
            duration: 400,
            toValue: {x: 200, y: 55},
            useNativeDriver: false,
        }).start(() => {
            textInputRef.current.focus();
        });
    };

    const collapseAddItem = () => {
        Animated.timing(addItemDimension, {
            duration: 400,
            toValue: {x: 40, y: 40},
            useNativeDriver: false,
        }).start(() => {
            setIsExpanded(false);
            setNewItemName('');
        });
    };

    const createNewItem = () => {
        if (newItemName) {
            const newItemId = createItem(newItemName);
            selectItem(newItemId);
        }
        collapseAddItem();
    };

    const blurTextInput = () => {
        collapseAddItem();
        return true;
    };

    return (
        <Animated.View style={{width: addItemDimension.x, height: addItemDimension.y, justifyContent: 'center',
                               alignItems: 'center', marginHorizontal:  WINDOW.width * 0.05}}>
            <TouchableOpacity
                style={{justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%',
                borderRadius: 8, backgroundColor: VERY_LIGHT_GRAY }}
                onPress={expandAddItem}
            >
                {
                isExpanded ?
                    <TextInput
                        ref={textInputRef}
                        style={{width: '100%', height: '100%', fontSize: 24}}
                        onSubmitEditing={createNewItem}
                        onBlur={blurTextInput}
                        value={newItemName}
                        onChangeText={setNewItemName}
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
