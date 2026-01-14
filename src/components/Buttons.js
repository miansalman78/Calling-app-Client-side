import React from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';

import { AppColors, Font , SpaceConstants} from '../utils/Constants';

// interface Props {
// 	onPress: any;
// 	white: Boolean;
// 	title: String;
// 	style: Object;
// 	btnStyle: Object;
// }

export default function Button(props) {
	const { onPress,
	 title, style, btnStyle ,disabled} = props;
		const disableButton  = disabled ? true : false

	return (
		<TouchableOpacity
			style={
                [styles.btn, style, disableButton ? styles.btnDisable : styles.btnEnable ]
			}
			onPress={onPress}
			disabled={disableButton }
		>
			<Text
				style={
                    [styles.btnText, btnStyle, disableButton ? styles.txtDisable : null]
				}
			>
				{title}
			</Text>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	btn: {
		backgroundColor: AppColors.buttonColor,
		height: 40,
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 12,
		width: '100%',
		// marginTop:SpaceConstants.spacing
	},

	btnWhite: {
		backgroundColor: '#ffffff'
	},
	txtDisable:{
		color:AppColors.uitextinactive,
	},
	btnDisable:{
		//opacity:0.6,
		backgroundColor: AppColors.uibackgroundinactive
	},
	btnEnable:{
		opacity:1
	},
	btnText: {
		fontFamily: Font.family_medium,
		fontSize: Font.buttonSize,
        fontWeight:'600',
		color: AppColors.buttonFontColor,
	},

	btnTextForWhite: {
		color: AppColors.textGrey
	}
});
