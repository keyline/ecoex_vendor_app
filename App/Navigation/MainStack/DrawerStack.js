import { View, Text } from 'react-native'
import React from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer';
import MainStack from './MainStack';
import CustomDrawer from './CustomDrawer';
import { Colors } from '../../Utils/Colors';

const DrawerStack = () => {

    const Drawer = createDrawerNavigator();

    return (
        <Drawer.Navigator
            screenOptions={{
                headerShown: false,
                drawerStyle: {
                    borderTopRightRadius: 20,
                    borderBottomRightRadius: 20,
                    borderWidth: 2,
                    borderColor: Colors.theme_color,
                    backgroundColor: Colors.white
                }
            }}
            drawerContent={(props) => <CustomDrawer {...props} />}
        >
            <Drawer.Screen name='MainStack' component={MainStack} />
        </Drawer.Navigator>
    )
}

export default DrawerStack