import {StackActions} from '@react-navigation/native';
import {CommonActions} from '@react-navigation/routers';
import { navigationRef } from '../../App';


function navigate(routeName, params, key) {
    navigationRef.current && navigationRef.current.navigate(routeName, params, key);
}

function goBack() {
    navigationRef.current && navigationRef.current.goBack();
}

function pop(value) {
    const popAction = StackActions.pop(value);
    navigationRef.current.dispatch(popAction);
}

function reset(routeName, params) {
    const navigateAction = CommonActions.navigate({
        name: routeName,
        params: params,
        // action: CommonActions.navigate(routeName),
    });
    navigationRef.current.dispatch(navigateAction);
}

function getNavigator() {
    return navigationRef;
}

export default {
    navigate,
    reset,
    getNavigator,
    goBack,
    pop,
};
