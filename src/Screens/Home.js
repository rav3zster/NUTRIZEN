import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, StatusBar, Animated, Easing, TouchableOpacity, FlatList, Image, ActivityIndicator } from 'react-native';
import { MEAL_FILTERS } from '../Data';
import { useNavigation } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';
import { FAB } from '@rneui/themed';
import Snackbar from 'react-native-snackbar';
import { AppwriteContext } from '../appwrite/AppwriteContext';

const AnimatedBtn = Animatable.createAnimatableComponent(TouchableOpacity);
const Home = () => {
  const navigation = useNavigation();
  const [recipes, setRecipes] = useState([]);
  const { appwrite, setIsLoggedIn } = useContext(AppwriteContext);
  const [loading, setLoading] = useState(true);
  const [animation] = useState(new Animated.Value(1));

  const handleLogout = () => {
    appwrite.logout()
      .then(() => {
        setIsLoggedIn(false);
        Snackbar.show({
          text: 'Logout Successful',
          duration: Snackbar.LENGTH_SHORT
        });
        navigation.navigate('Login');
      })
      .catch((error) => {
        console.error('Logout Error: ', error);
      });
  };

  useEffect(() => {
    getTrendyRecipes();
  }, []);

  const getTrendyRecipes = () => {
    var myHeaders = new Headers();
    myHeaders.append("accept", "application/json");
    myHeaders.append("Accept-Language", "en");

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow"
    };

    fetch(`https://api.edamam.com/api/recipes/v2?type=public&q=food&app_id=442d5a42&app_key=%20d14106a16eea0ef6caa6aefb3d82b305`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result.hits);
        setRecipes(result.hits);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  };

  const handlePressIn = () => {
    Animated.timing(animation, {
      toValue: 0.8,
      duration: 200,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.timing(animation, {
      toValue: 1,
      duration: 200,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  };

  const animatedStyle = {
    transform: [{ scale: animation }],
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.topView}>
        <Animatable.Image
          animation={'slideInUp'}
          source={require('../Images/banner.jpg')} style={styles.banner} />
        <View style={styles.transparentView}>
          <AnimatedBtn animation={'slideInUp'}
            style={styles.searchBox}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={() => {
              navigation.navigate("Search")
            }}
          >
            <Animated.Image
              source={require('../Images/sicon.png')}
              style={[styles.search, animatedStyle]}
            />
            <FAB
              style={styles.logoutBtn}
              placement='right'
              color='#31d6ff'
              size='large'
              title="logout"
              icon={{ name: 'logout', color: 'white' }}
              onPress={handleLogout}
            />

            <Text style={styles.placeholder}>Please search here...</Text>
          </AnimatedBtn>
        </View>
      </View>
      <Text style={styles.heading}>Categories</Text>
      <View>
        <FlatList
          horizontal
          data={MEAL_FILTERS}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <AnimatedBtn onPress={() => {
              navigation.navigate("RecipeByCategory", { data: item.title });
            }} animation={'slideInUp'} activeOpacity={.8} style={styles.categoryItem}>
              <View style={styles.card}>
                <Image source={item.icon} style={styles.categoryIcon} />
              </View>
              <Text style={styles.category}>{item.title}</Text>
            </AnimatedBtn>
          )}
        />
      </View>
      <Text style={styles.heading}>Trendy Recipes</Text>
      <View>
        {loading ? (
          <ActivityIndicator size="large" color="#31d6ff" />
        ) : (
          <FlatList showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ marginTop: 20 }}
            horizontal
            data={recipes}
            renderItem={({ item, index }) => {
              return (
                <TouchableOpacity style={styles.recipeItem}
                  onPress={() => {
                    navigation.navigate("Details", {
                      data: item,
                    })
                  }}>
                  <Image source={{ uri: item.recipe.image }} style={styles.recipeImage} />
                  <View style={[styles.transparentView, { borderRadius: 15 }]}>
                    <Text style={styles.recipeLabel}>{item.recipe.label}</Text>
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        )}
      </View>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topView: {
    width: '100%',
    height: '30%',
  },
  banner: {
    width: '100%',
    height: '100%',
  },
  logoutBtn: {
    position: 'absolute',
    right: -10,
    top: -150, // Adjust the top position to move the logout button higher
  },
  transparentView: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBox: {
    width: 380,
    height: 60,
    backgroundColor: 'white',
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 'center',
  },
  search: {
    width: 50,
    height: 50,
    marginLeft: 10,
  },
  placeholder: {
    marginLeft: 15,
    fontSize: 16,
    color: 'grey',
    flexDirection: 'row',
  },
  logo: {
    fontSize: 40,
    color: 'white',
    position: 'absolute',
    top: 60,
    left: 20,
  },
  heading: {
    fontSize: 20,
    fontWeight: '600',
    marginLeft: 20,
    marginTop: 20,
    color: 'black'
  },
  categoryItem: {
    width: 120,
    height: 130,
    backgroundColor: 'transparent',
    margin: 10,
  },
  card: {
    width: '80%',
    height: '60%',
    shadowOpacity: 6,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignContent: 'center',
    marginBottom: 5
  },
  categoryIcon: {
    width: 120,
    height: 100,
    justifyContent: 'center',
    marginTop: 45,
    marginBottom: 5,
    marginLeft: 1,
    borderRadius: 10,
  },
  category: {
    fontSize: 18,
    fontWeight: '600',
    alignSelf: 'center',
    color: 'black',
    marginTop: 25,
  },
  recipeItem: {
    width: 150,
    height: 210,
    marginLeft: 20,
    borderRadius: 10
  },
  recipeImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10
  },
  recipeLabel: {
    color: 'white',
    fontSize: 18,
    width: '90%',
    fontWeight: '600',
  }
});
