import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import React, { useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';

const AnimatedBtn=Animatable.createAnimatableComponent(TouchableOpacity)
const Details = () => {
  const route = useRoute();
  const [selectedTab, setSelectedTab] = useState(0);
  const navigation = useNavigation()

  // Convert totalNutrients object to an array of key-value pairs
  const totalNutrientsArray = Object.entries(route.params.data.recipe.totalNutrients || {}).map(
    ([key, value]) => ({ name: key, quantity: value.quantity, unit: value.unit })
  );

  return (
    <View style={styles.container}>
      <Animatable.Image source={{ uri: route.params.data.recipe.image }} style={styles.banner} animation={'slideInUp'} />
      <AnimatedBtn 
      style={styles.backBtn} 
      animation={'slideInUp'}
      onPress={() => {
        navigation.goBack()
      }}>
        <Image source={require('../Images/backButton.png')} style={styles.backIcon} />
      </AnimatedBtn>
      <Animatable.Text animation={'slideInUp'} style={styles.title}>{route.params.data.recipe.label}</Animatable.Text>
      <Animatable.Text animation={'slideInUp'} style={styles.source}>{'added by ' + route.params.data.recipe.source}</Animatable.Text>
      <Animatable.Text animation={'slideInUp'} style={styles.calories}>{"Calories: "}<Animatable.Text animation={'slideInUp'} style={{ color: 'red' }}>{route.params.data.recipe.calories}</Animatable.Text></Animatable.Text>
      <Animatable.Text animation={'slideInUp'} style={styles.calories}>{"Total Weight: "}<Animatable.Text animation={'slideInUp'} style={{ color: 'green' }}>{route.params.data.recipe.totalWeight}</Animatable.Text></Animatable.Text>
      <View>
        <FlatList
          showsHorizontalScrollIndicator={false}
          data={[
            'Health',
            'Cautions',
            'Ingredients',
            'Diet',
            'Meal Type',
            'Cuisines',
            'Dish Type',
            'Total Nutrients',
          ]}
          horizontal
          renderItem={({ item, index }) => {
            return (
              <TouchableOpacity
                style={[
                  styles.typeItem,
                  {
                    borderWidth: selectedTab == index ? 0 : 0.5,
                    marginLeft: index == 0 ? 25 : 10,
                    borderColor: '#9e9e9e',
                    backgroundColor: selectedTab == index ? '#31d6ff' : 'white',
                  },
                ]}
                onPress={() => {
                  setSelectedTab(index);
                }}
              >
                <Text style={{ color: selectedTab == index ? 'white' : 'black' }}>{item}</Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>
      <FlatList
        data={
          selectedTab == 0
            ? route.params.data.recipe.healthLabels
            : selectedTab == 1
              ? route.params.data.recipe.cautions
              : selectedTab == 2
                ? route.params.data.recipe.ingredientLines
                : selectedTab == 3
                  ? route.params.data.recipe.dietLabels
                  : selectedTab == 4
                    ? route.params.data.recipe.mealType
                    : selectedTab == 5
                      ? route.params.data.recipe.cuisineType
                      : selectedTab == 6
                        ? route.params.data.recipe.dishType
                        : totalNutrientsArray
        }
        renderItem={({ item }) => {
          return (
            <Animatable.View animation={'slideInUp'}style={styles.labels}>
              <Text>
                {item.name ? `${item.name}: ${item.quantity} ${item.unit}` : item}
              </Text>
            </Animatable.View>
          );
        }}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

export default Details;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  banner: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  backBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'white',
    position: 'absolute',
    top: 10,
    left: 20,
    justifyContent:'center',
    alignItems:'center'
  },
  backIcon: {
    width: 40,
    height: 40,
    right: 3,
  },
  title: {
    fontSize: 30,
    fontWeight: '500',
    width: '90%',
    alignSelf: 'center',
    color: 'black',
    marginTop: 10,
  },
  source: {
    marginLeft: 20,
    marginTop: 5,
    marginBottom: 5,
  },
  typeItem: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 9,
    paddingBottom: 8,
    marginLeft: 10,
    marginRight: 5,
    borderRadius: 8,
  },
  labels: {
    width: '90%',
    alignSelf: 'center',
    height: 50,
    borderWidth: 1,
    justifyContent: 'center',
    marginTop: 10,
    borderColor: 'black',
    paddingLeft: 10,
    color: 'black',
    marginBottom: 10
  },
  calories: {
    fontSize: 20,
    color: 'black',
    fontWeight: '500',
    marginTop: 2,
    marginBottom: 10,
    marginLeft: 20
  }
});
