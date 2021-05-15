import React, {useContext, useEffect, useState} from 'react';
import {View} from 'react-native';
import {UserRecipeCategoryItems} from '../api/RDBInterface';
import {createRecipeCategory} from '../api/Recipe';
import {UserContext} from '../App';
import {database} from '../Config';
import {Tabs} from './common/Tabs';
import {TABS_HEIGHT} from './Constants'

const Recipe = () => {

    const {user} = useContext(UserContext);
    const [selectedRecipeCategoryId, setSelectedRecipeCategoryId]: [string, React.Dispatch<string>] = useState(undefined);
    const [userRecipeCategories, setUserRecipeCategories]: [UserRecipeCategoryItems, React.Dispatch<UserRecipeCategoryItems>] = useState({});

    useEffect(() => {
        if (selectedRecipeCategoryId === undefined && Object.keys(userRecipeCategories)) {
            setSelectedRecipeCategoryId(Object.keys(userRecipeCategories)[0]);
        }
    }, [userRecipeCategories]);

    useEffect(() => {
        const userRecipeCategoriesRef = database.ref('/users/'+user.uid+'/recipe_categories');
        const onUserRecipeCategoriesChange = userRecipeCategoriesRef.on('value', (data) => {
            if (data) {
                const recipeCategories: UserRecipeCategoryItems = data.val()
                setUserRecipeCategories(recipeCategories || {});
            }
        });
        return () => userRecipeCategoriesRef.off('value', onUserRecipeCategoriesChange);
    }, [user.uid]);

    return (
        <View style={{height: '100%'}}>
            <View style={{height: TABS_HEIGHT}}>
                <Tabs items={userRecipeCategories} createItem={(name) => {return createRecipeCategory(user.uid, name)}} selectedItemId={selectedRecipeCategoryId} selectItem={setSelectedRecipeCategoryId}/>
            </View>
            <View style={{flex: 1}}>

            </View>
        </View>
    );

};

export default Recipe;
