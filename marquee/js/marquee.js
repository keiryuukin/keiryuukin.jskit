'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Marquee = function () {
	function Marquee(props) {
		_classCallCheck(this, Marquee);

		this.el = props.el;
		this.$ul = this.el.find('ul');
		this.$li = this.el.find('li');
		// this.slideWidth = this.el.width();
		// this.fakeZero = 0;
	}

	_createClass(Marquee, [{
		key: 'duplicate',
		value: function duplicate() {
			var $ul = '';
			var ary = [];
			this.el.find('li').each(function (i) {
				$ul = $(this).parent();
				$(this).addClass('slide' + i);
				var temp = $(this).clone();
				temp.addClass('copy');
				ary.push(temp.prop('outerHTML'));
			});

			var dCode = ary.join('');
			$ul.prepend(dCode).append(dCode);
		}
	}, {
		key: 'calcLeft',
		value: function calcLeft() {
			return parseInt(this.$ul.css('left'));
		}
	}, {
		key: 'calcMarquee',
		value: function calcMarquee() {

			var data = {
				count: this.$li.not('.copy').length,
				slideWidth: this.$li.width(),
				spacing: parseInt(this.$li.css('margin-left')) * 2
			};
			data.startX = -((data.spacing + data.slideWidth) * data.count + data.spacing / 2);
			data.endX = -((data.spacing + data.slideWidth) * data.count * 2 + data.spacing / 2);

			// console.log((data.spacing + data.slideWidth) * data.count)
			return data;
		}
	}, {
		key: 'init',
		value: function init() {
			var that = this;
			this.duplicate();
			this.$ul.css({ left: this.calculated.startX });
			this.speed = 0.2;
			this.move();
		}
	}, {
		key: 'nextSlide',
		value: function nextSlide() {
			console.log('fff');
		}
	}, {
		key: 'move',
		value: function move(fromX) {
			var _this = this;

			this.$ul.clearQueue();
			var startX = fromX ? fromX : this.calculated.startX;
			console.log('s' + startX);
			var speed = this.speed;
			var distance = Math.abs(this.calculated.endX - startX);
			// let speed = distance / ms;
			var duration = distance / speed;
			console.log('distance' + distance);
			console.log('speed' + speed);
			console.log('duration' + duration);
			// console.log(distance);

			this.$ul.css({ 'left': startX, 'transition-duration': '0s' });
			this.$ul.animate({ 'left': this.calculated.endX }, duration, 'linear', function () {
				_this.move();
			});
		}
	}, {
		key: 'pause',
		value: function pause() {
			var curPos = this.$ul.css('left');
			this.$ul.clearQueue().stop();
		}
	}, {
		key: 'calculated',
		get: function get() {
			return this.calcMarquee();
		}
	}, {
		key: 'left',
		get: function get() {
			return this.calcLeft();
		}
	}]);

	return Marquee;
}();

$(function () {
	var temp = '';
	$('.marquee').each(function (i) {
		console.log(i);
		var name = 'marquee' + i;
		var props = {
			el: $(this)
		};
		window[name] = new Marquee(props);
		var mq = window[name];
		mq.init();
		mq.calcMarquee();
		console.log(mq);
	}).hover(function () {
		window['marquee0'].pause();
		temp = window['marquee0'].left;
	}, function () {

		// temp = 
		console.log(temp);
		window['marquee0'].move(temp);
	});
	function createMarquee() {}
});