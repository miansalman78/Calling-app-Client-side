import { StyleSheet } from 'react-native';

import { AppColors, Font, SpaceConstants } from './Constants';


export default StyleSheet.create({
	safeAreaContainer:{
		flex:1,
		marginTop:0,
		marginBottom:0,
		height:'auto',
		backgroundColor:AppColors.background,
	},
	scrollContainer:{
		flex:1,
		backgroundColor:AppColors.background,
	},
	scrollContainerCenter:{
		flex:1,
		flexGrow: 1,
		justifyContent: 'center'
	},
	keyboardViewContainer:{
		flex:1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	KeyboardcontainerPadLeftRight:{
		marginLeft:24,
		marginRight:24,
	},
	container_start:{
		flex: 1,
		alignItems: 'center',
		justifyContent: 'flex-start',
		width:"100%"
	},
	container_center:{
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor:AppColors.background,
		width:"100%",
		padding:10
	},
	removeactiveTextInput:{
	},
	activeTextInput:{
		borderWidth: 1,
		borderColor: '#FF96D2',
		backgroundColor: 'white',
		shadowColor: '#FF96D2',
		shadowRadius: 1,
		shadowOpacity: 0.2,
		shadowOffset: {width: 0, height:1},
	},
	activeTextInputSearch:{
		borderRightColor: AppColors.uitextborder,
		borderWidth: 1,
		borderColor: '#FF96D2',
		backgroundColor: 'white',
		shadowColor: '#FF96D2',
		shadowRadius: 1,
		shadowOpacity: 0.2,
		shadowOffset: {width: 0, height:1},
	},
	activeTextInputSearchA:{
		borderLeftColor: AppColors.uitextborder,
		borderWidth: 1,
		borderColor: '#FF96D2',
		backgroundColor: 'white',
		shadowColor: '#FF96D2',
		shadowRadius: 1,
		shadowOpacity: 0.2,
		shadowOffset: {width: 0, height:1},
	},
	nogreyContainer:{
		marginTop:20,
		width:"90%",
		overflow:"scroll"
	},
	heading:{
		fontSize:Font.headingSize,
		color: AppColors.primaryColor,
		textTransform: 'uppercase',
		marginBottom:5,
		fontFamily:Font.family_bold
	},
	subHeading:{
		fontSize:Font.subheadingSize,
		color: AppColors.subHeadingColor,
		textTransform: 'uppercase',
		fontFamily: Font.family_bold
	},
	headingNavigation:{
		fontSize:Font.subheadingSize,
		color: AppColors.textBlack,
		fontFamily: Font.family_regular
	},
	greyContainer:{
		backgroundColor:AppColors.containerBackground,
		// height:'auto',
		padding:SpaceConstants.spacing,
		margin:SpaceConstants.spacing,
		borderRadius:SpaceConstants.spacing,
		width:"90%",
		overflow:"scroll"
	},
	descriptionText:{
		fontSize:Font.textSize,
		color: AppColors.textGrey,
		fontFamily: Font.family_regular,
		textAlign:'center',
		lineHeight:18,
		// textAlign:"center"
	},
	text:{
		fontSize:(Font.textSize),
		color: AppColors.textBlack,
		lineHeight:22,
		fontFamily: Font.family_regular
	},
	hyperlinkText:{
		fontSize:(Font.textSize + 1),
		color: AppColors.textGrey,
		fontFamily: Font.family_regular,
		textAlign:'center'
		// textAlign:"center"
	},
	bottomTabText:{
		fontSize:12,
		fontFamily:Font.family_regular,
		color:'#051225B2',
		marginTop:2
	},
	bottomTabTextActive:{
		fontSize:12,
		fontFamily:Font.family_medium,
		color:AppColors.buttonColor,
		marginTop:2
	},

	paddingAll:{
		padding:20
	},
	btnPadding:{
		padding:10
	},
	gutterBottom:{
		marginBottom:SpaceConstants.spacing
	},
	gutterTop:{
		marginTop:SpaceConstants.spacing
	},
	textBox: {
		height: 50,
		width: '100%',
		borderRadius: 23,
		paddingLeft:20,
		color: AppColors.textBlack,
		fontSize: Font.textSize,
		// fontFamily: Font.family,
		backgroundColor: AppColors.uigreybackground,
		marginTop:10,
		marginBottom:10,
		borderWidth: 1,
		borderColor: AppColors.uitextborder,
		fontFamily: Font.family_regular
	},
	textBoxOTP: {
		height: 40,
		width: '12%',
		borderRadius: 8,
		paddingLeft:15,
		color: AppColors.textBlack,
		fontSize: Font.textSize,
		// fontFamily: Font.family,
		backgroundColor: AppColors.uigreybackground,
		marginTop:10,
		marginBottom:10,
		marginRight:5,
		marginLeft:5,
		borderWidth: 1,
		borderColor: AppColors.uitextborder,
		fontFamily: Font.family_regular
	},
	searchInput:{
		height: 40,
		borderRadius: 20,
		paddingLeft:20,
		color: AppColors.textBlack,
		fontSize: Font.textSize,
		// fontFamily: Font.family,
		backgroundColor: AppColors.textInputBg,
		marginBottom:SpaceConstants.spacing,
		borderWidth: 1,
		borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
		borderRightColor: 'white',
		borderColor: AppColors.uitextborder,
		width: '88%',
		fontFamily: Font.family_regular
	},
	searchIcon:{
		alignItems: 'center',
		justifyContent: 'center',
		height: 40,
		borderRadius: 20,
		color: AppColors.textBlack,
		fontSize: Font.textSize,
		// fontFamily: Font.family,
		backgroundColor: AppColors.textInputBg,
		marginBottom:SpaceConstants.spacing,
		borderWidth: 1,
		borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0,
		borderColor: AppColors.uitextborder,
		width: '12%',
	},
	inputAddOnImage: {
		height: 20,
		width: 20
	},

	inputAddOnLeft: {
		position: 'absolute',
		left: 8,
		top: 8,
		height: 46,
		width: 46,
		backgroundColor: AppColors.starYellow,
		borderRadius: 10,
		alignItems: 'center',
		justifyContent: 'center'
	},

	inputAddOnRight: {
		position: 'absolute',
		right: 8,
		top: 8,
		height: 46,
		width: 46,
		borderRadius: 10,
		alignItems: 'center',
		justifyContent: 'center'
	},

	textInputContainer: {
		height: 60,
		width: '100%',
		flexDirection: 'row',
		alignItems: 'center',
		position: 'relative',
		marginBottom: 18
	},

	tabBar: {
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
		elevation: 30,
		shadowColor: '#000000',
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		borderTopWidth: 0
	},

	tabBarPlusIcon: {
		elevation: 4,
		shadowColor: '#000000',
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.2,
		shadowRadius: 4,
		padding: 8,
		borderRadius: 10,
		backgroundColor: AppColors.starYellow
	},
	descriptionTextHelp:{
		fontSize:Font.textSize,
		color: AppColors.textGrey,
		fontFamily: Font.family_regular,
		textAlign:'justify',
		lineHeight:18,
		marginTop:5
		// textAlign:"center"
	},
	descriptionTextHelpCenter:{
		fontSize:Font.textSize,
		color: AppColors.textGrey,
		fontFamily: Font.family_regular,
		lineHeight:18,
		marginTop:5,
		textAlign:"center"
	},
	subHeadingPolicy:{
		fontSize:Font.textSize,
		color: AppColors.textGrey,
		fontFamily: Font.family_regular,
		textAlign:'center',
		lineHeight:18,
		marginTop:5,
		textAlign:"center",
		fontWeight:"bold"
	},
	subHeadingPolicyLeft:{
		fontSize:Font.textSize,
		color: AppColors.textGrey,
		fontFamily: Font.family_regular,
		textAlign:'center',
		lineHeight:18,
		marginTop:5,
		textAlign:"justify",
		fontWeight:"bold"
	},
	subHeadingHelp:{
		fontSize:Font.subheadingSize,
		color: AppColors.textBlack,
		textTransform: 'uppercase',
		fontFamily: Font.family_bold
	},
});
