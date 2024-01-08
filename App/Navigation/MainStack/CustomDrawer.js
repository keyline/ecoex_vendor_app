import { View, Text, Image, Alert } from 'react-native'
import React, { useCallback, useContext } from 'react'
import { useNavigation } from '@react-navigation/native';
import { ImagePath } from '../../Utils/ImagePath';
import { ToastError, ToastMessage } from '../../Service/CommonFunction';
import Apis from '../../Service/Apis';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { Colors } from '../../Utils/Colors';
import { styles } from './styles';
import AuthContext from '../../Service/Context';

const CustomDrawer = (props) => {

    const context = useContext(AuthContext);
    const { siteData, userProfile } = context.allData
    const navigation = useNavigation();

    const menuList = [
        { id: 1, name: 'Home', screen: 'DashBoard', icon: ImagePath.home, logiReq: false },
        { id: 2, name: 'Pending Request', screen: 'PendingRequest', icon: ImagePath.pending, logiReq: false },
        { id: 3, name: 'Accepted Request', screen: 'AcceptRequest', icon: ImagePath.complete, logiReq: false },
        { id: 4, name: 'Rejected Request', screen: 'RejectRequest', icon: ImagePath.reject, logiReq: false },
        { id: 5, name: 'Completed Request', screen: 'CompleteRequest', icon: ImagePath.complete, logiReq: false },
        { id: 6, name: 'Edit Profile', screen: 'EditProfile', icon: ImagePath.edit_profile, logiReq: false },
        { id: 7, name: 'Change Password', screen: 'ChangePassword', icon: ImagePath.lock, logiReq: false },
        { id: 8, name: 'Privacy Policy', screen: 'StaticPage', slung: 'privacy-policy', icon: ImagePath.privacy_policy, logiReq: false },
        { id: 9, name: 'Terms and Conditions', screen: 'StaticPage', slung: 'terms-conditions', icon: ImagePath.terms_condition, logiReq: false },
        { id: 10, name: 'Sign Out', screen: 'LogOut', icon: ImagePath.logout, logiReq: false },
        { id: 11, name: 'Delete Account', screen: 'Delete_account', icon: ImagePath.delete_acnt, logiReq: false },

    ]

    const Icon = ({ props, source }) => (
        <Image source={source} style={{ width: props?.size, height: props?.size, tintColor: props?.color, resizeMode: 'contain' }} />
    )

    const onMenuPress = useCallback(async (item) => {
        if (item) {
            if (item.screen && item.screen == 'LogOut') {
                SignOutAlert();
            } else if (item?.screen == 'Delete_account') {
                DeleteAcntAlert();
            } else if (item.screen && item.screen == 'StaticPage') {
                navigation.navigate(item.screen, { page: item?.slung })
            } else if (item?.screen) {
                navigation.navigate(item.screen)
            }
        } else {

        }
    })

    const SignOutAlert = useCallback(async () => {
        Alert.alert(
            'Sign Out',
            'Do you really want to Sign Out?',
            [
                {
                    text: 'Yes',
                    onPress: () => onSignOut()
                },
                {
                    text: 'No',
                    onPress: () => null
                }
            ],
            { cancelable: true }
        )
    })

    const onSignOut = useCallback(async () => {
        try {
            let res = await Apis.sign_out();
            if (__DEV__) {
                console.log('SignOut', JSON.stringify(res))
            }
            if (res.success) {
                await context.onClearStoreData();
            }
            ToastMessage(res?.message);
        } catch (error) {
            if (__DEV__) {
                console.log(error)
            }
            ToastError();
        }
    })

    const DeleteAcntAlert = useCallback(async () => {
        Alert.alert(
            'Delete Account',
            'Do you really want to Delete your account?',
            [
                {
                    text: 'Yes',
                    onPress: () => onDeleteAccount()
                },
                {
                    text: 'No',
                    onPress: () => null
                }
            ],
            { cancelable: true }
        )
    })

    const onDeleteAccount = useCallback(async () => {
        try {
            let res = await Apis.delete_acnt();
            if (__DEV__) {
                console.log('DeleteAccount', JSON.stringify(res))
            }
            if (res.success) {
                await context.onClearStoreData();
            }
            ToastMessage(res?.message);
        } catch (error) {
            if (__DEV__) {
                console.log(error)
            }
            ToastError();
        }
    })

    return (
        <View style={{ flex: 1 }}>
            <DrawerContentScrollView {...props} showsVerticalScrollIndicator={false}>
                {/* <DrawerItemList {...props} /> */}
                {((userProfile?.is_contract_expire == 0) ? menuList.filter(obj => obj.logiReq == false) : menuList).map((item, key) => (
                    <DrawerItem
                        key={key}
                        label={item.name}
                        onPress={() => onMenuPress(item)}
                        labelStyle={styles.menuText}
                        icon={(props) => (<Icon source={item.icon} props={props} />)}
                        activeTintColor={Colors.theme_light}
                        inactiveTintColor={Colors.grey}
                        focused={props.state.routeNames[props.state.index] === item.screen}
                        pressColor={Colors.theme_light}
                        style={{ marginVertical: 0 }}
                    />
                ))}
            </DrawerContentScrollView>
        </View>
    )
}

export default CustomDrawer