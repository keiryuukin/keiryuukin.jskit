$.fn.extend({
	slider: function(type) {
		var that = $(this);
		var $ul = $(".slide>ul", that);
		var $li = $(".slide>ul>li", that);
		var liWidth = $li.width();
		var liLength = $li.length;
		var $next = $(".slide-next", that);

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
					liCode += attr.name + "=\"" + attrValue + "\" ";
				})
				liCode += "data-copy=\"true\">" + targetHtml + "</li>"
				d = true;
				return liCode;
			}
			$ul.append(createHtml(firstLi));
			$ul.append(createHtml(secondLi));
			$ul.prepend(createHtml(lastLi))

			$li = $(".slide>ul>li", that);
			// liLength = $li.length;
			return d;
		}
		Slider.prototype.reposition = function() {

			console.log(type)
			var pos = -liWidth * 2;
			$li.each(function() {
				pos += liWidth;
				$(this).css("left", pos)
			})
		}
		Slider.prototype.change = function(e, direction) {
			$ul.animate({ "left": -100 })

		}
		Slider.prototype.drag = function() {
			var startPos;
			var orgPos;
			var currentPos;
			var holding;
			var movedPos;
			var cursorX
			$ul.on("touchstart touchmove touchend mousedown mousemove mouseup", function(e) {
				var posX = $(this).offset().left;

				if (e.type == "touchstart" || e.type == "mousedown") {
					holding = true;
					if (e.type == "touchstart") {
						cursorX = e.targetTouches[0].pageX;
					}
					if (e.type == "mousedown") {
						cursorX = e.pageX;
						console.log(cursorX)
					}
					startPos = cursorX - posX;
					orgPos = parseInt($ul.css("left"));
					// console.log(orgPos)
				}
				if (e.type == "touchmove" || "mousemove") {
					if (holding) {
						if (e.type == "touchmove") {
							cursorX = e.targetTouches[0].pageX;
						}
						if (e.type == "mousemove") {
							cursorX = e.pageX;
						}
						currentPos = parseInt($(this).css("left"));
						touchingPos = cursorX - posX; //touching left position of the ul;
						currentPos += touchingPos - startPos;
						movedPos = orgPos - currentPos
						$(this).css({ "left": currentPos })
						if (currentPos > 0) {
							$(this).css({ "left": -(liWidth * liLength) })
							startPos = cursorX - posX;
						}
						if (currentPos < -(liWidth * liLength)) {
							console.log('asd')
							$(this).css({ "left": 0 });
							startPos = cursorX - posX;
						}
					}
					console.log(movedPos + "movedmove")
						// console.log("cur"+currentPos);
				}
				if (e.type == "touchend" || e.type == "mouseup") {
					console.log(movedPos + "movedEnd")
					currentPos = parseInt($(this).css("left"));
					console.log(orgPos + "orgend")
					if (movedPos > (liWidth / 2) /*&& movedPos*/) {
						if (movedPos > liWidth * liLength - liWidth / 2) {
							console.log(liWidth * liLength - liWidth / 2)
							var $active = $li.filter(".active")
							$active.removeClass("active");
							$li.eq(liLength+1).addClass("active")
							$ul.animate({ "left": -(liWidth * liLength) })
						} else {
							var $active = $li.filter(".active")
							$active.removeClass("active");
							$active.next().addClass("active");
							var movingPos = -(parseInt($li.filter(".active").css("left")))
							$ul.animate({ "left": movingPos })
						}
						console.log("next");
					} else if (movedPos < -(liWidth / 2)) {
						var $active = $li.filter(".active")
						$active.removeClass("active");
						$active.prev().addClass("active");
						var movingPos = -(parseInt($li.filter(".active").css("left")))
						$ul.animate({ "left": movingPos })
						console.log("prev")
					} else {
						$ul.animate({ "left": orgPos })
					}
					holding = false;
				}
			})
		}
		Slider.prototype.init = function() {
			var count = 0;
			$li.each(function() {
				$(this).addClass("i" + count);
				count++;
			})
			switch (type) {
				case "fade":

					break;
				case "basic":
					slider.duplicate();
					slider.reposition();
					slider.drag();
					$li.eq(1).addClass("active");

					break;
				case "adv":

					break;
				default:
			}
		}
		slider.init();
		$(window).resize(function() {
			slider.reposition()
		})
		$next.on("click", function(e) {
			slider.change(e, "next");
		})
	}
})
$(function() {

	$(".slider").each(function() {
		$(this).slider("basic");
	})
})
