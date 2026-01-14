import { Dimensions, Platform, PixelRatio } from 'react-native';

// also in androidmanifest.xml
// appdelegate.m
//export const GOOGLE_API_KEY = "AIzaSyAotK0uVx1CgLM24ZqM4cU_CFgYBIpf-Sc" //odl traakme key
export const GOOGLE_API_KEY = "AIzaSyCr4gCy-Ec9U0Gk_twywPDBiHEHaMGDHC8"
export const TOM_TOM_API_Key = "z2FW8yZb08nsGCzBTfGp48RmIimflD8t"
export const RECAPTCHA_SITE_KEY = "6LfHkQUsAAAAAIhmGm4UdrDDbmvFoxXsOPNtGpXF";

export const KeyCenter = { 
	appID: 940046216, 
	appSign: '6a969aba82a46e29ee8f8676252d31c37b121f64e66aafc301f9a1bac7d5d589', 
}; 

export const AppColors = {
	textBlack: '#171719',
	textGrey: '#979797',
	iconGrey: '#DCDCDC',
	background: '#fff',
	primaryColor:'#FF0202',
	subHeadingColor: '#FE9DAE',
	buttonColor:"#F40BDC",
	buttonFontColor:"#fff",
	containerBackground:'#DCDCDC',
	textInputBg: '#fff',
	hyperlinks: '#FE9DAE',
	borderColor:'#DCDCDC',
	addcontatBtn:'#F4EFEF',
	newPink:'#ED4FAA',
	uiblack: '#051225',
	uigreybackground: '#D9D9D94D',
	uitextborder: '#0512250d',
	uitext: '#051225A6',
	uibackgroundinactive: '#F1F5F9',
	uitextinactive: '#CBD5E1',
	uiBottomNavInactive:'#051225B2'
};


export const SpaceConstants = {
	spacing : 20
}

const {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
} = Dimensions.get('window');

// based on iphone 5s's scale
const scale = SCREEN_WIDTH / 320;

export function normalize(size) {
    const newSize = size * scale
    if (Platform.OS === 'ios') {
        return Math.round(PixelRatio.roundToNearestPixel(newSize)) + 2
    } else {
        return Math.round(PixelRatio.roundToNearestPixel(newSize))
    }
}

export const Font = {
	family_bold: 'Roboto-Bold',
	family_medium: 'Roboto-Medium',
	family_italic: 'Roboto-Italic',
	family_regular: 'Roboto-Regular',
	family: 'Roboto-Regular',
	headingSize: normalize(18),
	subheadingSize : normalize(12),
	textSize : normalize(11),
	buttonSize:normalize(12),
	headingBold: "600",
	subheadingBold: "500"
}

export const scrollViewProperties = {
    showsVerticalScrollIndicator:false,
    bounces:false
}

export const latitudeConstant = 38.900497
export const longitudeConstant = -77.007507