$(document).ready(function ()
{
	//
	appReady();

	//
	$('.tooltipped').tooltip({delay: 50});

	//
	$('.dropdown-button').dropdown({
		inDuration: 300,
		outDuration: 225,
		constrainWidth: false, // Does not change width of dropdown to that of the activator
		hover: true, // Activate on hover
		gutter: 0, // Spacing from edge
		belowOrigin: true, // Displays dropdown below the button
		alignment: 'left', // Displays dropdown with edge aligned to the left of button
		stopPropagation: false // Stops event propagation
	});

	$('.dropdown-button2').dropdown({
		inDuration: 300,
		outDuration: 225,
		constrain_width: false, // Does not change width of dropdown to that of the activator
		hover: true, // Activate on hover
		gutter: ($('.dropdown-content').width()*3)/2.5, // Spacing from edge
		belowOrigin: false, // Displays dropdown below the button
		alignment: 'left' // Displays dropdown with edge aligned to the left of button
	});

	$('.dropdown-button3').dropdown({
		inDuration: 300,
		outDuration: 225,
		constrain_width: false, // Does not change width of dropdown to that of the activator
		hover: true, // Activate on hover
		gutter: ($('.dropdown-content').width()*1), // Spacing from edge
		belowOrigin: false, // Displays dropdown below the button
		alignment: 'left' // Displays dropdown with edge aligned to the left of button
	});

	// Inspector color pickers listeners:
	let backgroundColorPicker = new CP(document.getElementById('backgroundColorPicker'));
	backgroundColorPicker.on("change", changeBackgroundColor);
});

// Actions
$("#fileActions>li").click(fileActions);
$('#meshActions>li').click(meshActions);
$('#editionActions>li').click(editionActions);
$('#impActions>li').click(impActions);
$('#expActions>li').click(expActions);
$('#objActions>li').click(objActions);
$('#priActions>li').click(priActions);
$('#formActions>li').click(formActions);
$('#landmarkObjectAction>li').click(landmarkObjectAction);
$('#cameraTypeAction>li').click(cameraTypeAction);
$('#mediaPlayer>li').click(mediaPlayer);
