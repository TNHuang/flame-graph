window.myApp = {
	idx: 0,
	
	eventsBinder: function(){
		//mouse over to update message box and change main info box 
		$(".level-0").on("mouseover", ".btn", function(event){
			event.preventDefault();
			var target = $(event.currentTarget);

			//update info box with current hover information
			$("#code").html(target.data("str") + " " + target.data("global-per").toFixed(2) + "%");
		

			//display msg box about path information
			myApp.updateMsgBoxMessage({ "str": target.data("str"), "per": target.data("global-per").toFixed(2) });
			myApp.displayMessage();
		});

		//message box feature
		$(".level-0").on("mouseleave", ".btn", function(event){
			event.preventDefault();
			myApp.undisplayMessage();
		});

		//update mouse 
		$(".level-0").on("mousemove", function(event){
			event.preventDefault();
			myApp.updateMsgBoxPosition(event);
		});

		//submit which program to profile
		$("form").on("submit", function(event){
			event.preventDefault();
			var selector = $("#code-str");
			myApp.inputValidation(selector);
			
		})

	},

	inputValidation: function(selector){
		var input = selector.val();

		//input validation
		if (input === ""){
			myApp.failInputAction(selector);
		} else {
			myApp.successInputAction(selector);
		}
	},

	failInputAction: function(selector){
		//when file path is invalid, do this input
		console.log("file path is blank")
		if (selector.hasClass("red") === false){
			selector.addClass("red");
			selector.attr("placeholder", "code cannot be blank");
		}
	},

	successInputAction: function(selector){
		if (selector.hasClass("red")){
			selector.removeClass("red");
			selector.attr("placeholder", "paste your code here");
		}

		$.ajax({
			url: "trace",
			type: "GET",
			data: { code: selector.val()},
			dataType: 'json',
			success: function(response){
				//reset input box
				selector.val("");
				$(".level-0 > .container").remove();
				myApp.insertGraph(response, ".level-0", 0);
			}
		});
		
	},

	updateMsgBoxPosition: function(event){
		d3.select(".mouseover_message_box")
			.style("top", (event.pageY + 10 ) + "px")
			.style("left", (event.pageX + 20) + "px")

	},

	updateMsgBoxMessage: function(data){
		d3.select(".mouseover_message_box")
			.text( data["str"] + " " + data["per"] + "%")
	},

	undisplayMessage: function() {
		var msg_box = $(".mouseover_message_box");
		if (msg_box.hasClass("hidden") === false){
			msg_box.addClass("hidden")
		}
	},

	displayMessage: function(){
		var msg_box = $(".mouseover_message_box");
		if (msg_box.hasClass("hidden") === true){
			msg_box.removeClass("hidden")
		}
	},

	insertGraph: function(data, selector){
		//recursively insert graph into children so all path is nested
		myApp.idx += 1;
		var curr_idx = myApp.idx;
		var randomColor = myApp.randomColor();
		
		var width = data["per"];
		if (width === 0) {
			width = 1;
		}

		// creating wrapper for string value and its children
		d3.select(selector).append("div")
			.style("width", width+"%")
			.attr("class", "container clearfix container-" + curr_idx );

		var curr_selector = d3.select(".container-" + curr_idx);
		
		//put into string value of current node
		curr_selector.append("div")
			.attr("class", "full container btn")
			.attr("data-str", data["str"])
			.attr("data-global-per", data["global_per"])
			.style("background", randomColor)
			.style("border", "2px solid " + randomColor)
			.text(data["str"])

		if (data["children"] !== undefined && data["children"].length !== 0){
			var children_class = "children-" + curr_idx;
			
			//add in a children container
			curr_selector.append("div")
				.attr("class", "full container " + children_class);

			//add in individual child into children of current level
			//recursively search for leaf node
			data["children"].forEach( function(child){
				myApp.insertGraph( child, "." + children_class);
			});
		}
	},

	randomColor: function(){
		var red = 225-Math.floor(Math.random() * 225);
		var green = 225 - Math.floor(Math.random() * 225);
		var blue = 225- Math.floor(Math.random()* 225);
	
		var color = "rgba(" + red + ", " + green + ", " + blue + ", " + 0.7 + ")";
		return color;
	},

	initialize: function(){
		var dataset = {
			str: "sample output main thread",
			per: 100,
			global_per: 100,
			children: [
				{ str: "method a", per: 30 , global_per: 30,},
				{ str: "method b", per: 30, global_per: 30, children: [
					{ str: "method b1", per: 40, global_per: 12, children: []},
					{ str: "method b2", per: 40, global_per: 12, children: [
						{ str: "method b2a", per: 50, global_per: 6, children: []},
						{ str: "method b2b", per: 20, global_per: 2.4, children: []},
					]},
				]},
				{ str: "method c", per: 10, global_per: 10, children: []},
				{ str: "method d", per: 30, global_per: 30, children: [
					{ str: "method d1", per: 80, global_per: 24, children: [
						{ str: "method d1a", per: 100, global_per: 24, children: [
							{ str: "method d1a1", per: 80, global_per: 19.2, children: []},
						]},
					]},
					{ str: "method d2", per: 20, global_per: 6, children: []},
				]}
			]
		};

		myApp.insertGraph(dataset, ".level-0", 0);

		myApp.eventsBinder();
	},
}

$(function(){
	window.myApp.initialize();
})