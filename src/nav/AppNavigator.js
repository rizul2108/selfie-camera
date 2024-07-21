import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import CameraScreen from "../components/CameraScreen";
import FeedScreen from "../components/FeedScreen";

const Stack = createStackNavigator();

const AppNavigator = () => {
	return (
		<NavigationContainer>
			<Stack.Navigator initialRouteName="Camera">
				<Stack.Screen name="Camera" component={CameraScreen} />
				<Stack.Screen name="Feed" component={FeedScreen} />
			</Stack.Navigator>
		</NavigationContainer>
	);
};

export default AppNavigator;
