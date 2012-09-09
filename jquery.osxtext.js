/*
 * jQuery OS X Text
 * Copyright (c) 2012 Chris Roberts
 * Version: 1.0 (2012-09-08)
 */
 
/* Possible options:
 *
 * steps - defines how many characters should be affected on each side of the focus character
 *         ie, steps: 3 means a total of 7 characters are affected: the one in the middle and three
           on either side
 *
 * stepSize - how many pixels are different in the font size from one step to the next.
 *            ie, if the original font-size is 24px and stepSize is 12px then one step up would
 *            result in font-size 36px. Using stepSize, the maximum font-size is determined
 *            by: original size + (stepSize * steps)
 *
 * stepMax - how big the biggest font should be. You should not use both stepMax and stepSize.
 *           If both are set, stepSize is used by default. If only stepMax is set, stepSize
 *           is determined by: (stepMax - original size) / steps
 *
 * Default settings:
 * 
 * steps: 3
 * stepSize: 12
 * stepMax: original font + 36
 *
 */
              
jQuery.fn.osxtext = function(options) {
	// Prepare the text by wrapping all characters in a span with the osxitem class
	var modText = this.html();
	var newText = "";
	
	for (var loopCount = 0 ; loopCount < modText.length ; loopCount++) {
		newText = newText + '<span class="osxitem">' + modText[loopCount] + '</span>';
	}
	
	this.html(newText);
	
	// Set default values and retrieve user options
	var stepBase = parseInt(jQuery('.osxitem').css('font-size'));
	var stepSize = 12;
	var steps = 3;
	var stepMax = stepBase + 36;
	
	// If the user has set some options, pull them in. If options is undefined,
	// stick with default values.
	if (typeof options != 'undefined') {
		// Grab the user-specified # of steps
		if (typeof options.steps != 'undefined') {
			steps = options.steps;
		}
		
		// If the user has set both maxSize and stepSize, use maxSize and calculate stepSize from it.
		// Manually specifying both values is not permitted simply to ensure a smooth transition of sizes.
		if (typeof options.maxSize != 'undefined') {
			stepMax = options.maxSize;
			stepSize = (stepMax - stepBase) / steps;
		} else {
			stepSize = options.stepSize;
			stepMax = stepBase + (stepSize * steps);
		}
	}
	
	// Set some css values for each span. The height must be specified in order to avoid some
	// jumpiness of text when the font changes.
	jQuery('.osxitem').css({
		'height': stepMax + 'px',
		'display': 'inline-block',
		'padding-right': '2px',
		'min-width': '15px'
	});
	
	// Set the mouseover event. When the user mouses over a character, its size goes to stepMax
	// and the (steps) items to its right or left get set to descending values.
	jQuery('.osxitem').mouseover(function() {
		jQuery(this).css('font-size', stepMax + 'px');
		
		jQuery(this).bind('mousemove.osxtext', function(e) {
			var elemOffset = jQuery(this).offset(); 
			var elemWidth = jQuery(this).width();
			
			var posX = e.pageX - elemOffset.left;
			var rPosX = (elemWidth - posX);
			
			var computedStep = stepSize / elemWidth;
			
			var sizeOffset = posX * computedStep;
			var rSizeOffset = rPosX * computedStep;
			
			var itemModifyNext = jQuery(this);
			var itemModifyPrev = jQuery(this);
			
			for (var countSteps = (steps - 1) ; countSteps >= 0 ; countSteps--) {
				itemModifyNext = itemModifyNext.next();
				itemModifyPrev = itemModifyPrev.prev();
				
				itemModifyNext.css('font-size', ((stepBase + (stepSize * countSteps)) + sizeOffset) + 'px');
				itemModifyPrev.css('font-size', ((stepBase + (stepSize * countSteps)) + rSizeOffset) + 'px');
			}
		});
	});
	
	// Reset sizes when mousing out of a character
	jQuery('.osxitem').mouseout(function() {
		jQuery(this).css('font-size', '1em');
		jQuery(this).siblings().css('font-size', '1em');
		jQuery(this).unbind('mousemove.osxtext');
	});
	
	return this;
};