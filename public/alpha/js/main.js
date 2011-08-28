var timestamp = null;
var loading = false;
var currentQuestionId = 0;
var currentBlock = null;
var interactionEnabled = true;

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
						var animate = ($(".qBlock").length > 0 && currentQuestionId != displayData.id);
						
						setQuestion(displayData.id, displayData.state, displayData.value, displayData.choices, animate);
						
						if (displayData.state == "finished") {
							setQuestionResults(displayData.answer, displayData.choices);
						} else {
							clearQuestionResults();
						}
					}
				}
			}
		});
	}
	
	setTimeout('waitForMsg()', 1000);
}

function addNewBlock(id, animate) {
	if ($(".qBlock").length > 1) {
		$(".qBlock:last").remove();
	}
		
	console.log(currentBlock.outerHeight());
	currentBlock.css("margin-top", "-" + (currentBlock.outerHeight()/2 + 29) + "px");
	
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
};

function setQuestion(id, state, value, choices, animate) {
	currentQuestionId = id;
	
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
		
	var oldBlock = $(".qBlock:first");
	currentBlock = $(".qBlock:last");
	
	if (animate) {
		oldBlock.animate({
			scale: '0.75'
		}, 250, function() {
			$(this).animate({
				left: '-150%'
			}, 500, function() {
				$(this).remove();
				addNewBlock(id, animate);
			});
		});
	} else {
		setTimeout(function(){addNewBlock(id, animate)}, 100);
	}
	
	loading = false;
}

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