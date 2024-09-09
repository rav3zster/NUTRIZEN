import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { FlatList, TextInput } from 'react-native-gesture-handler';
import { Image } from 'react-native-animatable';
import { useNavigation, useRoute } from '@react-navigation/native';

const RecipeByCategory = () => {
  const [search, setSearch] = useState('');
  const navigation = useNavigation();
  const route = useRoute();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    searchRecipe();
  }, []);

  const searchRecipe = () => {
    console.log(search);
    const requestOptions = {
      method: "GET",
      redirect: "follow"
    };

    fetch(`https://api.edamam.com/api/recipes/v2?type=public&q=food&app_id=442d5a42&app_key=%20d14106a16eea0ef6caa6aefb3d82b305&mealType=${route.params.data}`, requestOptions)
      .then((response) => response.json())
      .then(result => {
        console.log(result);
        setRecipes(result.hits);
        setLoading(false); // Hide loading indicator
      })
      .catch((error) => {
        console.error(error);
        setLoading(false); // Hide loading indicator
      });
  }

  return (
    <View style={Styles.container}>
      <TouchableOpacity style={Styles.backBtn} onPress={() => {
        navigation.goBack();
      }}>
        <Image source={require('../Images/backButton.png')} style={Styles.backIcon} />
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator size="large" color="blue" style={Styles.loadingIndicator} />
      ) : (
        <FlatList data={recipes} renderItem={({ item, index }) => {
          return (
            <TouchableOpacity style={Styles.recipeItem} onPress={() => {
              navigation.navigate("Details", { data: item });
            }}>
              <Image source={{ uri: item.recipe.image }} style={Styles.itemImage} />
              <View>
                <Text style={Styles.title}>{item.recipe.label.length > 40 ? item.recipe.label.substring(0, 40) + "...." : item.recipe.label}</Text>
                <Text style={Styles.source}>{item.recipe.source}</Text>
              </View>
            </TouchableOpacity>
          )
        }} />
      )}
    </View>
  );
};

export default RecipeByCategory;

const Styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginTop: 60,
    backgroundColor: 'white',
    marginLeft: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  backIcon: {
    width: 50,
    height: 20,
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recipeItem: {
    width: '90%',
    height: 100,
    backgroundColor: 'white',
    alignSelf: 'center',
    marginTop: 10,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center'
  },
  itemImage: {
    width: 90,
    height: 90,
    marginLeft: 10,
    borderRadius: 9
  },
  title: {
    fontSize: 18,
    width: '70%',
    fontWeight: '500',
    marginLeft: 10,
  },
  source: {
    fontSize: 15,
    width: '60%',
    fontWeight: '500',
    marginLeft: 10,
    marginTop: 10,
    color: 'orange'
  },
});
