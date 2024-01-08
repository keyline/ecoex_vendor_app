import { View, Text, SafeAreaView, ScrollView, Image, TouchableOpacity } from 'react-native'
import React, { useCallback, useContext, useState, useEffect } from 'react'
import { CommonStyle } from '../../../Utils/CommonStyle'
import { ImagePath } from '../../../Utils/ImagePath'
import Header from '../../../Container/Header'
import { useFocusEffect } from '@react-navigation/native'
import { DocumentPickers, GetValuefromList, ToastError, ToastMessage } from '../../../Service/CommonFunction'
import Apis from '../../../Service/Apis'
import Loader from '../../../Container/Loader'
import { styles } from './styles'
import InputField from '../../../Container/InputField'
import AuthContext from '../../../Service/Context'
import CustomDropDown from '../../../Container/CustomDropDown'
import Button from '../../../Container/Button'
import { isValidEmail, isValidMobile } from '../../../Service/Valid'

const EditProfile = ({ navigation }) => {

    const context = useContext(AuthContext)
    const { siteData, userProfile } = context.allData

    const [state, setState] = useState({
        loading: false,
        loadingNew: false,
        btnLoading: false,
        data: null,
        gstNo: '',
        gstNoErr: '',
        gstCertificate: null,
        gstCertificateErr: '',
        companyDetails: null,
        companyName: '',
        companyNameErr: '',
        plantAddress: '',
        plantAddressErr: '',
        holding_no: '',
        holding_noErr: '',
        street: '',
        streetErr: '',
        district: '',
        districtErr: '',
        state: '',
        stateErr: '',
        pincode: '',
        pincodeErr: '',
        location: '',
        locationErr: '',
        email: '',
        emailErr: '',
        phnNo: '',
        phnNoErr: '',
        memberType: '',
        memberTypeErr: '',
        modalVisible: false,
        mobileOTP: '',
        emailOTP: '',
        personName: '',
        personNameErr: '',
        personDesignation: '',
        personDesignationErr: '',
        personDocument: '',
        personDocumentErr: '',
        pdfViewer: false,
        pdfViewFile: ''
    })
    const [memberPicker, setmemberPicker] = useState(false);
    const [memberList, setmemberList] = useState([]);
    const [timer, setTimer] = useState(60)


    useFocusEffect(
        useCallback(() => {
            const unsubscribe = onGetProfile();
            return () => unsubscribe
        }, [navigation])
    )

    useEffect(() => {
        const interval = setInterval(() => {
            if (timer > 0) {
                setTimer(lastTimerCount => {
                    lastTimerCount <= 1 && clearInterval(interval)
                    return lastTimerCount - 1
                })
            }
        }, 1000) //each count lasts for a second
        return () => clearInterval(interval)
    }, [timer]);

    const showLoading = useCallback(async () => {
        setState(prev => ({
            ...prev,
            loading: true
        }))
    }, [state.loading])

    const hideLoading = useCallback(async () => {
        setState(prev => ({
            ...prev,
            loading: false
        }))
    }, [state.loading])

    const onHeaderPress = useCallback(async () => {
        navigation.navigate('DashBoard')
    })

    const onGetProfile = useCallback(async () => {
        try {
            showLoading();
            if (userProfile) {
                let data = userProfile;
                let memberlist = await onGetCategory();
                let membertype = await GetValuefromList(memberlist, data?.member_type)
                setState(prev => ({
                    ...prev,
                    gstNo: data?.gst_no,
                    companyName: data?.company_name,
                    plantAddress: data?.full_address,
                    holding_no: data?.holding_no,
                    street: data?.street,
                    district: data?.district,
                    state: data?.state,
                    pincode: data?.pincode,
                    location: data?.location,
                    email: data?.email,
                    phnNo: data?.phone,
                    memberType: membertype,
                    personName: data?.contact_person_name,
                    personDesignation: data?.contact_person_designation,
                    data: data,
                    loading: false
                }))
            } else {
                onGetProfileApi();
            }
        } catch (error) {
            if (__DEV__) {
                console.log(error)
            }
            hideLoading();
            ToastError();
        }
    })

    const onGetProfileApi = useCallback(async () => {
        try {
            let res = await Apis.get_profile();
            if (__DEV__) {
                console.log('GetProfile', JSON.stringify(res));
            }
            if (res.success) {
                let data = res?.data
                let memberlist = await onGetCategory();
                let membertype = await GetValuefromList(memberlist, data?.member_type)
                setState(prev => ({
                    ...prev,
                    gstNo: data?.gst_no,
                    companyName: data?.company_name,
                    plantAddress: data?.full_address,
                    holding_no: data?.holding_no,
                    street: data?.street,
                    district: data?.district,
                    state: data?.state,
                    pincode: data?.pincode,
                    location: data?.location,
                    email: data?.email,
                    phnNo: data?.phone,
                    memberType: membertype,
                    personName: data?.contact_person_name,
                    personDesignation: data?.contact_person_designation,
                    bankName: data?.bank_name,
                    branchName: data?.branch_name,
                    ifscCode: data?.ifsc_code,
                    acntType: data?.account_type,
                    acntNo: data?.account_number,
                    data: data,
                    loading: false
                }))
            } else {
                hideLoading();
                ToastMessage(res?.message);
            }
        } catch (error) {
            if (__DEV__) {
                console.log(error)
            }
            hideLoading();
            ToastError();
        }
    })

    const onGetCategory = useCallback(async () => {
        try {
            showLoading();
            let res = await Apis.member_type();
            if (__DEV__) {
                console.log('MemberType', JSON.stringify(res))
            }
            if (res.success) {
                let cate = res?.data;
                if (cate.length > 0) {
                    let catedatas = cate.map(item => {
                        return { label: item?.name, value: item?.id }
                    })
                    setmemberList(catedatas);
                    return catedatas;
                }
            } else {
                ToastMessage(res?.message);
            }
            // hideLoading();
        } catch (error) {
            if (__DEV__) {
                console.log(error)
            }
            hideLoading();
            ToastError();
        }
    })

    const onGetCompanyDetails = useCallback(async (gstno) => {
        try {
            setState(prev => ({
                ...prev,
                loadingNew: true
            }))
            let datas = {
                gst_no: gstno
            }
            let res = await Apis.company_details(datas);
            if (__DEV__) {
                console.log('CompanyDetails', JSON.stringify(res))
            }
            if (res.success) {
                let data = res?.data
                setState(prev => ({
                    ...prev,
                    companyName: data?.trade_name,
                    plantAddress: data?.address,
                    plantAddressErr: '',
                    holding_no: data?.holding_no,
                    holding_noErr: '',
                    street: data?.street,
                    streetErr: '',
                    district: data?.district,
                    districtErr: '',
                    state: data?.state,
                    stateErr: '',
                    pincode: data?.pincode,
                    pincodeErr: '',
                    location: data?.location,
                    locationErr: '',
                    companyDetails: res?.data,
                    loadingNew: false
                }))
            } else {
                setState(prev => ({
                    ...prev,
                    loadingNew: false
                }))
                ToastMessage(res?.message);
            }
        } catch (error) {
            if (__DEV__) {
                console.log(error)
            }
            setState(prev => ({
                ...prev,
                loadingNew: false
            }))
            ToastError();
        }
    })

    const onChangeGstNo = useCallback(async (value) => {
        setState(prev => ({
            ...prev,
            gstNo: value,
            gstNoErr: ''
        }))
        if (value.length > 14) {
            onGetCompanyDetails(value);
        }
    }, [state.gstNo])

    const onChangeCname = useCallback(async (value) => {
        setState(prev => ({
            ...prev,
            companyName: value,
            companyNameErr: ''
        }))
    }, [state.companyName])

    const onChangeAddress = useCallback(async (value) => {
        setState(prev => ({
            ...prev,
            plantAddress: value,
            plantAddressErr: ''
        }))
    }, [state.plantAddress])

    const onChangeStreet = useCallback(async (value) => {
        setState(prev => ({
            ...prev,
            street: value,
            streetErr: ''
        }))
    }, [state.street])

    const onChangeDistrict = useCallback(async (value) => {
        setState(prev => ({
            ...prev,
            district: value,
            districtErr: ''
        }))
    }, [state.district])

    const onChangeState = useCallback(async (value) => {
        setState(prev => ({
            ...prev,
            state: value,
            stateErr: ''
        }))
    }, [state.state])

    const onChangePincode = useCallback(async (value) => {
        setState(prev => ({
            ...prev,
            pincode: value,
            pincodeErr: ''
        }))
    }, [state.pincode])

    const onChangeEmail = useCallback(async (value) => {
        setState(prev => ({
            ...prev,
            email: value,
            emailErr: ''
        }))
    }, [state.email])

    const onChangePhnNo = useCallback(async (value) => {
        setState(prev => ({
            ...prev,
            phnNo: value,
            phnNoErr: ''
        }))
    }, [state.phnNo])

    const onChangeMember = useCallback(async (value) => {
        setState(prev => ({
            ...prev,
            memberType: value?.value,
            memberTypeErr: ''
        }))
    }, [state.memberType])

    const onChangePrsnName = useCallback(async (value) => {
        setState(prev => ({
            ...prev,
            personName: value,
            personNameErr: ''
        }))
    }, [state.personName])

    const onChangePrsnDesig = useCallback(async (value) => {
        setState(prev => ({
            ...prev,
            personDesignation: value,
            personDesignationErr: ''
        }))
    }, [state.personDesignation])

    const showModal = useCallback(async () => {
        setState(prev => ({
            ...prev,
            modalVisible: true
        }))
    }, [state.modalVisible])

    const hideModal = useCallback(async () => {
        setState(prev => ({
            ...prev,
            modalVisible: false
        }))
    }, [state.modalVisible])

    const onSubmit = useCallback(async () => {
        try {
            if (state.gstNo.trim() == '') {
                setState(prev => ({
                    ...prev,
                    gstNoErr: 'Enter GST No.'
                }))
                return
            } else if (state.gstNo.length < 15) {
                setState(prev => ({
                    ...prev,
                    gstNoErr: 'Enter Valid GST No.'
                }))
                return
            } else if (state.companyName.trim() == '') {
                setState(prev => ({
                    ...prev,
                    companyNameErr: 'Enter Vendor Name'
                }))
                return;
            } else if (state.plantAddress.trim() == '') {
                setState(prev => ({
                    ...prev,
                    plantAddressErr: 'Enter Vendor Address'
                }));
                return;
            }
            // else if (state.holding_no.trim() == '') {
            //     setState(prev => ({
            //         ...prev,
            //         holding_noErr: 'Enter Holding No'
            //     }))
            //     return;
            // } 
            else if (state.street.trim() == '') {
                setState(prev => ({
                    ...prev,
                    streetErr: 'Enter Street'
                }));
                return;
            }
            // else if (state.location.trim() == '') {
            //     setState(prev => ({
            //         ...prev,
            //         locationErr: 'Enter Location'
            //     }));
            //     return;
            // } 
            else if (state.district.trim() == '') {
                setState(prev => ({
                    ...prev,
                    districtErr: 'Enter District'
                }));
                return;
            } else if (state.state.trim() == '') {
                setState(prev => ({
                    ...prev,
                    stateErr: 'Enter State'
                }));
                return;
            } else if (state.pincode.trim() == '') {
                setState(prev => ({
                    ...prev,
                    pincodeErr: 'Enter Pincode'
                }));
                return;
            } else if (state.pincode.length < 6) {
                setState(prev => ({
                    ...prev,
                    pincodeErr: 'Enter Valid Pincode'
                }));
                return;
            }
            // else if (state.email.trim() == '') {
            //     setState(prev => ({
            //         ...prev,
            //         emailErr: 'Enter Email'
            //     }));
            //     return;
            // } else if (!isValidEmail(state.email)) {
            //     setState(prev => ({
            //         ...prev,
            //         emailErr: 'Enter Valid Email'
            //     }));
            //     return;
            // } 
            else if (state.phnNo.trim() == '') {
                setState(prev => ({
                    ...prev,
                    phnNoErr: 'Enter Phone No'
                }));
                return;
            } else if (!isValidMobile(state.phnNo)) {
                setState(prev => ({
                    ...prev,
                    phnNoErr: 'Enter Valid Mobile Number'
                }));
                return;
            } else if (state.memberType == '') {
                setState(prev => ({
                    ...prev,
                    memberTypeErr: 'Select Member Type'
                }));
                return;
            } else if (state.personName.trim() == '') {
                setState(prev => ({
                    ...prev,
                    personNameErr: 'Enter Designated Person Name'
                }));
                return;
            } else if (state.personDesignation.trim() == '') {
                setState(prev => ({
                    ...prev,
                    personDesignationErr: 'Enter Designated Person Designation'
                }));
                return;
            }
            else {
                onUpdate();
                // if (state.data?.phone != state.phnNo) {
                //     onSendOtp();
                // } else if (state.data?.email != state.email) {
                //     onSendOtp();
                // } else {
                //     onUpdate();
                // }
            }
        } catch (error) {
            if (__DEV__) {
                console.log(error)
            }
        }
    })

    const onChangeEmailOtp = useCallback(async (value) => {
        setState(prev => ({
            ...prev,
            emailOTP: value
        }))
    }, [state.emailOTP])

    const onChangeMobileOtp = useCallback(async (value) => {
        setState(prev => ({
            ...prev,
            mobileOTP: value
        }))
    }, [state.mobileOTP])

    const onSendOtp = useCallback(async () => {
        setTimer(60)
        showModal();
    })

    const onResendOtp = useCallback(async () => {
        setTimer(60)
        console.log('ResendOtp');
    })

    const onSubmitOTP = useCallback(async () => {
        console.log('SubmitOtp');
    })

    const onUpdate = useCallback(async () => {
        try {
            setState(prev => ({
                ...prev,
                btnLoading: true
            }))
            let datas = {
                type: state.data?.type,
                gst_no: state.gstNo,
                gst_certificate: state.gstCertificate ? [state.gstCertificate] : [],
                company_name: state.companyName,
                full_address: state.plantAddress,
                holding_no: state.holding_no,
                street: state.street,
                district: state.district,
                state: state.state,
                pincode: state.pincode,
                location: state.location,
                email: state.email,
                phone: state.phnNo,
                member_type_id: state.memberType,
                contact_person_name: state.personName,
                contact_person_designation: state.personDesignation,
                contact_person_document: state.personDocument ? [state.personDocument] : [],
                bank_name: '',
                branch_name: '',
                ifsc_code: '',
                account_type: '',
                account_number: '',
                cancelled_cheque: ''
            }
            // console.log('postbody', JSON.stringify(datas))
            // return
            let response = await Apis.update_profile(datas);
            if (__DEV__) {
                console.log('UpdateProfile', JSON.stringify(response))
            }
            if (response.success) {
                await onGetProfileApi();
                setState(prev => ({
                    ...prev,
                    gstCertificate: null,
                    personDocument: null,
                    btnLoading: false
                }))
                await context.onGetUserProfile();
            } else {
                setState(prev => ({
                    ...prev,
                    btnLoading: false
                }))
            }
            ToastMessage(response?.message);
        } catch (error) {
            if (__DEV__) {
                console.log(error)
            }
            setState(prev => ({
                ...prev,
                btnLoading: false
            }))
            ToastError();
        }
    })

    const onPickDocument = useCallback(async (val) => {
        try {
            let response = await DocumentPickers()
            if (__DEV__) {
                console.log('pickerresponse', JSON.stringify(response))
            }
            if (response.length > 0) {
                if (val == 'gst') {
                    setState(prev => ({
                        ...prev,
                        gstCertificate: response[0],
                        gstCertificateErr: ''
                    }))
                } else if (val == 'person_docs') {
                    setState(prev => ({
                        ...prev,
                        personDocument: response[0],
                        personDocumentErr: ''
                    }))
                }
            }
        } catch (error) {
            if (__DEV__) {
                console.log('CertificstePickerError', error)
            }
        }
    })

    const ViewBotton = ({ onPress }) => (
        <TouchableOpacity onPress={() => onPress()} activeOpacity={0.5} style={styles.viewdocContainer}>
            <Text style={styles.viewdocText}>View Document</Text>
        </TouchableOpacity>
    )

    const viewPdf = useCallback(async (link) => {
        navigation.navigate('PdfViewer', { source: link })
    })

    return (
        <SafeAreaView style={CommonStyle.container}>
            <Header
                name={'Edit Profile'}
                leftIcon={ImagePath.home}
                leftOnPress={onHeaderPress}
                navigation={navigation}
            />
            {(state.loading) ? <Loader loading={state.loading} />
                :
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.bodyContent}>
                        <View style={{ alignItems: 'center', marginBottom: '4%' }}>
                            <Image source={siteData.site_logo ? { uri: siteData?.site_logo } : ImagePath.logo} style={styles.logo} />
                            <Text style={CommonStyle.headingText}>Update Profile</Text>
                        </View>
                        <InputField
                            name={'GST No.'}
                            value={state.gstNo}
                            onChangeText={onChangeGstNo}
                            error={state.gstNoErr}
                            editable={false}
                            maxLength={15}
                        />
                        <InputField
                            name={'GST Certificate'}
                            value={state.gstCertificate?.name}
                            placeholder={'Upload GST Certificate (PDF)'}
                            editable={false}
                            error={state.gstCertificateErr}
                            rightIcon={ImagePath.pdf_upload}
                            rightonPress={() => onPickDocument('gst')}
                        />
                        {(state.data?.gst_certificate) && (
                            <ViewBotton
                                onPress={() => viewPdf(state.data?.gst_certificate)}
                            />
                        )}
                        <InputField
                            name={'Vendor Name'}
                            value={state.companyName}
                            onChangeText={onChangeCname}
                            error={state.companyNameErr}
                        />
                        <InputField
                            name={'Address'}
                            value={state.plantAddress}
                            onChangeText={onChangeAddress}
                            error={state.plantAddressErr}
                            multiline={true}
                        />
                        <InputField
                            name={'Street'}
                            value={state.street}
                            onChangeText={onChangeStreet}
                            error={state.streetErr}
                            multiline={true}
                        />
                        <InputField
                            name={'District'}
                            value={state.district}
                            onChangeText={onChangeDistrict}
                            error={state.districtErr}
                        />
                        <InputField
                            name={'State'}
                            value={state.state}
                            onChangeText={onChangeState}
                            error={state.stateErr}
                        />
                        <InputField
                            name={'Pin Code'}
                            value={state.pincode}
                            onChangeText={onChangePincode}
                            error={state.pincodeErr}
                            maxLength={6}
                            keyboardType={'number-pad'}
                        />
                        <InputField
                            name={'Email'}
                            value={state.email}
                            // onChangeText={onChangeEmail}
                            editable={false}
                            error={state.emailErr}
                            keyboardType={'email-address'}
                        />
                        <InputField
                            name={'Mobile'}
                            value={state.phnNo}
                            onChangeText={onChangePhnNo}
                            maxLength={10}
                            error={state.phnNoErr}
                            keyboardType={'phone-pad'}
                        />
                        {/* <InputField
                            name={'Member Type'}
                            value={state.memberType}
                            editable={false}
                        /> */}
                        <CustomDropDown
                            name={'Member Type'}
                            items={memberList}
                            setItems={setmemberList}
                            open={memberPicker}
                            setOpen={setmemberPicker}
                            value={state.memberType}
                            onChangeValue={onChangeMember}
                            error={state.memberTypeErr}
                        />
                        <InputField
                            name={'Proprietor Name'}
                            value={state.personName}
                            onChangeText={onChangePrsnName}
                            error={state.personNameErr}
                        />
                        <InputField
                            name={'Proprietor Designation'}
                            value={state.personDesignation}
                            onChangeText={onChangePrsnDesig}
                            error={state.personDesignationErr}
                        />
                        <InputField
                            name={'Proprietor PAN Card'}
                            value={state.personDocument?.name}
                            placeholder={'Upload Proprietor PAN Card (PDF)'}
                            editable={false}
                            error={state.personDocumentErr}
                            rightIcon={ImagePath.pdf_upload}
                            rightonPress={() => onPickDocument('person_docs')}
                        />
                        {(state.data?.contact_person_document) && (
                            <ViewBotton
                                onPress={() => viewPdf(state.data?.contact_person_document)}
                            />
                        )}
                        <View style={{ marginTop: '2%' }}>
                            <Button
                                name={'UPDATE'}
                                onPress={onSubmit}
                                loading={state.btnLoading}
                                width={'80%'}
                            />
                        </View>
                    </View>
                </ScrollView>
            }
        </SafeAreaView>
    )
}

export default EditProfile