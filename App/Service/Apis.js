import { Network } from "./Network"



export default class Apis {
    static app_setting = () => {
        return Network('post', 'get-app-setting')
    }

    static static_page = (data) => {
        return Network('post', 'get-static-pages', data)
    }

    static product_category = () => {
        return Network('post', 'get-product-category')
    }

    static member_type = () => {
        return Network('post', 'get-member-type')
    }

    static company_details = (data) => {
        return Network('post', 'get-company-details', data)
    }

    static forgot_password = (data) => {
        return Network('post', 'forgot-password', data)
    }

    static validate_otp = (data) => {
        return Network('post', 'validate-otp', data)
    }

    static resend_otp = (data) => {
        return Network('post', 'resend-otp', data)
    }

    static reset_password = (data) => {
        return Network('post', 'reset-password', data)
    }

    static sign_in = (data) => {
        return Network('post', 'signin', data)
    }

    static signin_mobile = (data) => {
        return Network('post', 'signin-with-mobile', data)
    }

    static signin_mobile_otpvalidate = (data) => {
        return Network('post', 'signin-validate-mobile', data)
    }

    static sign_out = () => {
        return Network('post', 'signout')
    }

    static delete_acnt = () => {
        return Network('post', 'delete-account')
    }

    static change_password = (data) => {
        return Network('post', 'change-password', data)
    }

    static sign_up = (data) => {
        return Network('post', 'signup', data)
    }

    static signup_otpresend = (data) => {
        return Network('post', 'signup-otp-resend', data)
    }

    static signup_otpvalidate = (data) => {
        return Network('post', 'signup-otp-verify', data)
    }

    static get_profile = () => {
        return Network('post', 'get-profile')
    }

    static update_profile = (data) => {
        return Network('post', 'update-profile', data)
    }

    static update_profile_image = (data) => {
        return Network('post', 'update-profile-image', data)
    }

    static vendor_dashboard = () => {
        return Network('post', 'vendor-dashboard')
    }

    static pending_request = (data) => {
        return Network('post', 'pending-quotation-request-list', data)
    }

    static accept_request = (data) => {
        return Network('post', 'accepted-quotation-request-list', data)
    }

    static reject_request = (data) => {
        return Network('post', 'rejected-quotation-request-list', data)
    }

    static complete_request = (data) => {
        return Network('post', 'completed-quotation-request-list', data)
    }

    static accept_reject_request = (data) => {
        return Network('post', 'pending-quotation-request-accept-reject', data)
    }

    static request_detais = (data) => {
        return Network('post', 'get-enquiry-request-for-vendor-quotation', data)
    }

    static submit_quotation = (data) => {
        return Network('post', 'submit-quotation', data)
    }

    static get_notification = (data) => {
        return Network('post', 'get-notifications', data)
    }
}