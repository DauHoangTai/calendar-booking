import Alert from 'react-s-alert';

const initialState = {
}

const AlertReducer = (state = initialState, action) => {
    switch (action.type) {

        case "ALERT_SUCCESS":
            Alert.success(action.msg, {
                position: 'top-right',
                effect: 'slide',
                timeout: 2500
            });
            return { ...state }
        case "ALERT_ERROR":
            Alert.error(action.msg, {
                position: 'top-right',
                effect: 'slide',
                timeout: 2500
            });
            return { ...state }
        default:
            return state
    }
}

export default AlertReducer;