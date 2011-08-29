var timestamp = 0;
var loading = false;
var interactionEnabled = true;

var activeID = -1;
var activeSortIndex = -1;
var oldBlock = null;
var currentBlock = null;
var currentDisplayData = null;

function waitForMsg() {
	if (!loading) {
        $.getJSON(document.URL + "/json/" + timestamp, function(displayData) {
			if (displayData != null && displayData.timestamp && displayData.timestamp != "") {
				loading = true;
				timestamp = displayData.timestamp;
				
				if (displayData.type == "question") {
					setPageControl(parseInt(displayData.sort_index, 10), parseInt(displayData.total_count, 10));
					
					if (displayData.format == "multiple-choice") {
						currentDisplayData = displayData;
						
						interactionEnabled = !displayData.finished;
						
						if (activeID != displayData.question_id) {
							reload();
						} else {
							if (currentDisplayData.finished) {
								setQuestionResults(currentDisplayData.answer, currentDisplayData.choices);
							} else {
								clearQuestionResults();
							}
						}
						
						loading = false;
					}
				}
			}
		});
	}
	
	setTimeout('waitForMsg()', 1000);
}

function reload() {
	var value = currentDisplayData.value;
	var choices = currentDisplayData.choices;
	var animate = ($(".qBlock").length > 0 && activeSortIndex != currentDisplayData.sort_index);
	var animateDirection = 0;
	if (currentDisplayData.sort_index > activeSortIndex) {
		animateDirection = -1;
	} else if (currentDisplayData.sort_index < activeSortIndex) {
		animateDirection = 1;
	}
	
	activeID = currentDisplayData.question_id;
	activeSortIndex = currentDisplayData.sort_index;
	
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
				
				var answerID = currentDisplayData.choices[$(this).index()].id;
				
				var postData = {
					quiz_session_id: currentDisplayData.quiz_session_id,
					question_id: currentDisplayData.question_id,
					answer_id: answerID,
					student_identifier: "902708035"
				};
								
				$.post(document.URL + "/submit/", postData, function(data) {
					console.log(data);
				});
			} else {
				$(this).parent().children().removeClass("selected").removeClass("notselected");
			}
		}
	});
	
	// give browser a chance to render before animating blocks
	setTimeout(function(){refresh(animate, animateDirection)}, 100);
}

function refresh(animate, animateDirection) {
	// instantiate new and old block jQuery references
	if ($(".qBlock").length > 1) {
		oldBlock = $(".qBlock:first");
	} else {
		oldBlock = null;
	}
	currentBlock = $(".qBlock:last");
	
	// function to animate in new block
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
	}
	
	// animate old block out first
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

	// show answers, if finished	
	if (currentDisplayData.finished) {
		setQuestionResults(currentDisplayData.answer, currentDisplayData.choices);
	} else {
		clearQuestionResults();
	}
};

function setQuestionResults(answerID, choices) {
	for (var i = 0; i < choices.length; i++) {
		var choice = currentBlock.find("#selectable li").eq(i);
		
		if (choices[i].id == answerID) {
			choice.addClass("correct");
		}
				
		if (choice.find(".percent").length <= 0) {
			choice.append("<div class='percent'></div>");
		}
		
		choice.find(".percent").html(choices[i].percent * 100 + "%");
	}
}

function clearQuestionResults() {
	currentBlock.find("#selectable li").each(function() {
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
