var timestamp = null;
var loading = false;
var interactionEnabled = true;

var activeSortIndex = -1;
var oldBlock = null;
var currentBlock = null;
var currentDisplayData = null;

function waitForMsg() {
	if (!loading) {
		$.getJSON("getData.php?timestamp=" + timestamp, function(data) {
			if (data != null && data.msg != null && data.msg != "") {
				loading = true;
				timestamp = data.timestamp;
				
				var displayData = $.parseJSON(data.msg);
				if (displayData.type == "question") {
					setPageControl(parseInt(displayData.sort_index, 10), parseInt(displayData.total_count, 10));
					
					if (displayData.format == "multiple-choice") {						
						currentDisplayData = displayData;
						reload();
					}
				}
			}
		});
	}
	
	setTimeout('waitForMsg()', 1000);
}

function reload() {
	var state = currentDisplayData.state;
	var value = currentDisplayData.value;
	var choices = currentDisplayData.choices;
	var animate = ($(".qBlock").length > 0 && activeSortIndex != currentDisplayData.sort_index);
	var animteDirection = 0;
	if (currentDisplayData.sort_index > activeSortIndex) {
		animateDirection = -1;
	} else if (currentDisplayData.sort_index < activeSortIndex) {
		animateDirection = 1;
	}
	var answer = currentDisplayData.answer;
	
	activeSortIndex = currentDisplayData.sort_index;
	
	if (state == "finished") {
		interactionEnabled = false;
	} else {
		interactionEnabled = true;
	}
	
	// create block
	var markup = "\
		<div class='qBlock'>\
			<h1>" + value + "</h1>\
			<ol id='selectable'>";
	
	for (var i = 0; i < choices.length; i++) {
		markup += "\
				<li>" + choices[i].value + "</li>";
	}
	
	markup += "\
			</ol>\
		</div>";
	$("#main").append(markup);
	
	// selectable
	$("#selectable li").click(function() {
		if (interactionEnabled) {
			if (!$(this).hasClass("selected")) {
				$(this).addClass("selected").removeClass("notselected").siblings().removeClass("selected").addClass("notselected");
			} else {
				$(this).parent().children().removeClass("selected").removeClass("notselected");
			}
		}
	});
	
	setTimeout(function(){refresh(animate, animateDirection)}, 100);
}

function refresh(animate, animateDirection) {
	var state = currentDisplayData.state;

	if ($(".qBlock").length > 1) {
		oldBlock = $(".qBlock:first");
	}
	currentBlock = $(".qBlock:last");
	
	var showNewBlock = function() {
		currentBlock.css("margin-top", "-" + (currentBlock.outerHeight()/2 + 29) + "px");
		currentBlock.css("left", -animateDirection * 150 + "%");
		currentBlock.css("visibility", "visible");
		
		if (animate) {
			currentBlock.scale(0.75);
			currentBlock.animate({
				left: '50%'
			}, 500, function() {
				$(this).animate({
					scale: '1.0'
				}, 250);
			});
		} else {
			currentBlock.css("left", "50%");
		}
		
		if (state == "finished") {
			setQuestionResults(currentDisplayData.answer, currentDisplayData.choices);
		} else {
			clearQuestionResults();
		}
		
		loading = false;
	}
	
	if (oldBlock != null) {
		if (animate) {
			oldBlock.animate({
				scale: '0.75'
			}, 250, function() {
				$(this).animate({
					left: animateDirection * 150 + '%'
				}, 500, function() {
					$(this).remove();
					showNewBlock();
				});
			});
		} else {
			oldBlock.remove();
			showNewBlock();
		}
	} else {
		showNewBlock();
	}
};

function setQuestionResults(answer, choices) {
	for (var i = 0; i < choices.length; i++) {
		var choice = $("#selectable li").eq(i);
		
		if (i == answer) {
			choice.addClass("correct");
		}
				
		if (choice.find(".percent").length <= 0) {
			choice.append("<div class='percent'></div>");
		}
		
		choice.find(".percent").html(choices[i].percent);
	}
}

function clearQuestionResults() {
	$("#selectable li").each(function() {
		$(this).find(".percent").remove();
		$(this).removeClass("correct");
	});
}

function setPageControl(sortIndex, totalCount) {
	var markup = "";
	for (var i = 1; i <= totalCount; i++) {
		if (i == sortIndex) {
			markup += "<div class='pagecounter active'></div>";
		} else {
			markup += "<div class='pagecounter'></div>";
		}
	}
	$("#pagecontrol").html(markup);
}

$(document).ready(function() {
	waitForMsg();
});