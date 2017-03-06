$.fn.extend({
	slider: function(obj) {
		var that = $(this);
		var $frame = $(".frame", that);
		var $ul = $(".slides", that);
		var $li = $(".slides>li", that);
		var liWidth = $li.width();
		var liLength = $li.length;
		var $next = $(".slide-next", that);
		var $prev = $(".slide-prev", that);
		var $active;
		var activeIndex;
		var $sliderNav = $(".slider-nav", that);
		var aniSpeed = 300;
		$(window).resize(function() {
			$frame = $(".frame", that);
			$ul = $(".slides", that);
			$li = $(".slides>li", that);
			liWidth = $li.width();
			liLength = $li.length - 3;
			slider.reposition();
			slider.buildNav();

			console.log(liLength)
		})


		function Slider(obj) {
			this.type = obj.type;

		}
		var slider = new Slider(obj);

		Slider.prototype.duplicate = function() {

			var firstLi = $li.eq(0);
			var secondLi = $li.eq(1);
			var lastLi = $li.filter(":last-child");

			function createHtml(selector) {
				var target = selector;
				var liCode = "<li ";
				var targetHtml = target.html();
				var attrObj = target[0].attributes; //[0] means change jQuery element to html element
				$.each(attrObj, function(i) {
					var attr = attrObj[i];
					var attrValue = target.attr(attr.name);
					if (attr.name != "id") {
						liCode += attr.name + "=\"" + attrValue + "\" ";
					}
				})
				liCode += "data-copy=\"true\">" + targetHtml + "</li>"
				d = true;
				return liCode;
			}
			$ul.append(createHtml(firstLi));
			$ul.append(createHtml(secondLi));
			$ul.prepend(createHtml(lastLi))

			$li = $(".slides li", that);
		};
		Slider.prototype.reposition = function() {
			$active = $li.filter(".active");
			var index = $active.index() + 1;
			var pos = -liWidth * 2;
			$li.each(function() {
				pos += liWidth;
				$(this).css("left", pos);
			})
			$ul.css("left", -(parseInt($active.css("left"))));
		};
		Slider.prototype.buildNav = function() {
			$active = $li.filter(".active");
			activeIndex = $active.data("index");
			var list = "";
			for (var i = 0; i < liLength; i++) {
				list += "<a></a>"
			}
			var $nav = $("<div>");
			$nav.append(
				$("<a>").addClass("slide-prev").attr("href", "#").html("&lt;")
			).append(
				$("<a>").addClass("slide-next").attr("href", "#").html("&gt;")
			).append(
				$("<div>").addClass("pager").append(list)
			)
			$sliderNav.html($nav.html());
			$sliderNav.find(".pager>a").eq(activeIndex).addClass("active");

		}
		Slider.prototype.change = function(e, $this, direction) {
			function sliding(direction, movingPos) {

				var animating = $ul.is(":animated");
				if (!animating) {
					$active = $li.filter(".active");
					activeIndex = $active.data("index");
					var targetIndex;
					var index = $active.index();
					var $prevSlide = $li.eq(index - 1);
					var $targetSlide;
					var movingPos;

					$(".active", that).removeClass("active");

					if (direction == "next") {
						targetIndex = activeIndex + 1;
						$targetSlide = $li.eq(targetIndex + 1);
						if (targetIndex == liLength) {
							targetIndex = 0;
						}
						if (activeIndex == 0 && $active.data("copy")) {
							$ul.css("left", 0)
						}
						console.log("ss")
					} else if (direction == "prev") {
						targetIndex = activeIndex - 1;
						$targetSlide = $li.eq(targetIndex + 1);
						if (targetIndex < 0) {
							targetIndex = liLength - 1;
							$targetSlide = $li.eq(targetIndex + 1);
							console.log("b")
						}
						if (activeIndex == 0) {
							// index = liLength + 1;
							$ul.css("left", -(liWidth * liLength))
								// $prevSlide = $li.eq(index - 1);
						}
					} else if (direction == "pager") {
						targetIndex = $this.index();
						$targetSlide = $li.eq(targetIndex + 1);
					}
					movingPos = -(parseInt($targetSlide.css("left")));
					$targetSlide.addClass("active");
					$sliderNav.find(".pager>a").eq(targetIndex).addClass("active");
					$ul.animate({ "left": movingPos }, aniSpeed, function() {});
				}
				if (direction == "next") {

				}
			}
			sliding(direction);
		}
		Slider.prototype.drag = function() {
			var startPos, //cursor offset of the slide
				orgPos, //$ul left pos
				currentPos, //$ul left pos(moving)
				holding,
				direction,
				cursorX,
				cursorStartX,
				holdingTime,
				longHold,
				targeteq //indicate which index of slide will be shown after touch/mouse button released

			$ul.on("touchstart touchmove touchend mousedown mousemove mouseup", function(e) {
				var posX = $(this).offset().left; //position of target left win window;
				//console.log(posX+"posX")
				if (e.type == "touchstart" || e.type == "mousedown") {
					holding = true;
					if (e.type == "touchstart") {
						cursorX = e.targetTouches[0].pageX;
						cursorStartX = e.targetTouches[0].pageX;
					}
					if (e.type == "mousedown") {
						cursorX = e.pageX;
						cursorStartX = e.pageX;
					}
					startPos = cursorX - posX;
					orgPos = parseInt($ul.css("left"));

				}
				if (e.type == "touchmove" || "mousemove") {
					if (holding) {
						clearTimeout(holdingTime);
						holdingTime = setTimeout(function() {
							longHold = true;
						}, 250)
						if (e.type == "touchmove") {
							cursorX = e.targetTouches[0].pageX;
						}
						if (e.type == "mousemove") {
							cursorX = e.pageX;
						}
						var dragged = cursorStartX - cursorX;
						currentPos = parseInt($(this).css("left"));
						touchingPos = cursorX - posX; //touching left position of the ul;
						currentPos += touchingPos - startPos;
						$(this).css({ "left": currentPos }); //start moving the slide
						if (currentPos > 0) { //first element 
							$(this).css({ "left": -(liWidth * liLength) })
							startPos = cursorX - posX;
						}
						if (currentPos < -(liWidth * liLength)) { //last element
							console.log(liLength + "fffgfdgfadsf")
							$(this).css({ "left": 0 });
							startPos = cursorX - posX;
						}
						targeteq = -(parseInt((currentPos - liWidth / 2) / liWidth));


					}
				}
				if (e.type == "touchend" || e.type == "mouseup") {
					holding = false;
					// console.log("lastMove: " + lastMove + " movedPos: " +movedPos);
					clearTimeout(holdingTime);
					// console.log(longHold + "AD")
					if (longHold != true && dragged > liWidth / 10) {
						slider.change(e,"", "next");
					} else if (longHold != true && dragged < -(liWidth / 10)) {
						slider.change(e,"", "prev")
					} else {
						var target = $ul.find("li").eq(targeteq + 1);
						$active.removeClass("active");
						target.addClass("active")
						var newPos = parseInt(target.css("left"));

						$ul.animate({ "left": -newPos }, aniSpeed)
					}
					longHold = false;




				}
			})
		}
		Slider.prototype.init = function() {
			var count = 0;
			$li.each(function() {
				$(this).attr("data-index", count);
				count++;
			})
			$li.eq(0).addClass("active");
			switch (this.type) {
				case "fade":

					break;
				case "basic":




					break;
				case "adv":

					break;
				default:
					slider.duplicate();
					slider.buildNav();
					slider.reposition();
					slider.drag();
			}
		}
		slider.init();

		$sliderNav.on("click", "a", function(e) {
			e.preventDefault();
			var $this = $(this)
			if ($(this).hasClass("slide-next") > 0) {
				slider.change(e, $this, "next");
			} else if ($(this).hasClass("slide-prev") > 0) {
				slider.change(e, $this, "prev");
			} else {
				slider.change(e, $this, "pager");
			}

		})

		/*$(".pager>a",$sliderNav).click(function(e){
			e.preventDefault();
			var index = $(this).index();
		})*/
	}
})

