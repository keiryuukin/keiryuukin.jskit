$.fn.extend({
	slider: function(type) {
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


		function Slider(type) {}
		var slider = new Slider(type);

		Slider.prototype.duplicate = function() {

			var firstLi = $li.eq(0);
			var secondLi = $li.eq(1);
			var lastLi = $li.filter(":last-child");
			var d = false;

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
			// liLength = $li.length;
			return d;
		};
		Slider.prototype.reposition = function() {
			$active = $li.filter(".active");
			var index = $active.index() + 1;
			var pos = -liWidth * 2;
			$li.each(function() {
				pos += liWidth;
				$(this).css("left", pos)
			})
			$ul.css("left", -(parseInt($active.css("left"))))

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
		Slider.prototype.change = function($this, direction) {
			function sliding(direction) {
				
				var animating = $ul.is(":animated");
				if (!animating) {
					var $active = $li.filter(".active");
					var index = $active.index();
					console.log(index+"GG")
					var $nextSlide = $li.eq(index + 1);
					var $prevSlide = $li.eq(index - 1);
					activeIndex = $nextSlide.data("index")
					var movingPos;
					console.log(index + "index")

					$(".active", that).removeClass("active");

					if (direction == "next") {
						if (index > liLength) {
							index = 0;
							$ul.css("left", 0)
							$nextSlide = $li.eq(index + 2);
						}
						movingPos = -(parseInt($nextSlide.css("left")));
						$nextSlide.addClass("active");
						console.log($nextSlide.data("index"))
						$sliderNav.find(".pager>a").eq(activeIndex).addClass("active");
					} else if (direction == "prev") {
						if (index == 1) {
							index = liLength + 1;
							$ul.css("left", -(parseInt($li.eq(liLength + 1).css("left"))))
							$prevSlide = $li.eq(index - 1);
						}
						movingPos = -(parseInt($prevSlide.css("left")));
						$prevSlide.addClass("active");
						$sliderNav.find(".pager>a").eq(activeIndex).addClass("active");
					} else if(direction == "pager") {
						index = $this.index();
						movingPos = 0;
					}
					$ul.animate({ "left": movingPos }, function() {});
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
						// console.log(lastMove + "lastmove");
						currentPos = parseInt($(this).css("left"));
						touchingPos = cursorX - posX; //touching left position of the ul;
						currentPos += touchingPos - startPos;
						$(this).css({ "left": currentPos }); //start moving the slide
						if (currentPos > 0) {
							$(this).css({ "left": -(liWidth * liLength) })
							startPos = cursorX - posX;
						}
						if (currentPos < -(liWidth * liLength)) {
							console.log(liLength + "fffgfdgfadsf")
							$(this).css({ "left": 0 });
							startPos = cursorX - posX;
						}
						targeteq = -(parseInt((currentPos - liWidth / 2) / liWidth));

						// console.log(targeteq + "targeteq")
						// console.log("dragged: " + dragged)

					}
					// console.log("cur"+currentPos);
				}
				if (e.type == "touchend" || e.type == "mouseup") {
					holding = false;
					// console.log("lastMove: " + lastMove + " movedPos: " +movedPos);
					clearTimeout(holdingTime);
					// console.log(longHold + "AD")
					if (longHold != true && dragged > liWidth / 10) {
						slider.change(e, "next");
					} else if (longHold != true && dragged < -(liWidth / 10)) {
						slider.change(e, "prev")
					} else {
						var target = $ul.find("li").eq(targeteq + 1);
						$active.removeClass("active");
						target.addClass("active")
						var newPos = parseInt(target.css("left"));

						$ul.animate({ "left": -newPos }, 200)
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
			switch (type) {
				case "fade":

					break;
				case "basic":

					slider.duplicate();
					slider.buildNav();
					console.log(activeIndex)
					slider.reposition();
					slider.drag();


					break;
				case "adv":

					break;
				default:
			}
		}
		slider.init();

		$sliderNav.on("click", "a", function(e) {
			e.preventDefault();
			var $this = $(this)
			if ($(this).hasClass("slide-next") > 0) {
				slider.change($this, "next");
			} else if ($(this).hasClass("slide-prev") > 0) {
				slider.change($this, "prev");
			} else {
				slider.change($this,"pager");
			}

		})

		/*$(".pager>a",$sliderNav).click(function(e){
			e.preventDefault();
			var index = $(this).index();
		})*/
	}
})
$(function() {

	$(".slider").each(function() {
		$(this).slider("basic");
	})
})
