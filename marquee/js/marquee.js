'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Marquee = function () {
  function Marquee(props) {
    _classCallCheck(this, Marquee);

    this.$el = props.el;
    this.$ul = this.$el.find('ul');
    this.$li = this.$el.find('li');

    // this.slideWidth = this.$el.width();
    // this.fakeZero = 0;
  }

  _createClass(Marquee, [{
    key: 'duplicate',
    value: function duplicate() {
      var $ul = '';
      var ary = [];
      this.$el.find('li').each(function (i) {
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
      data.slideFullWidth = data.spacing + data.slideWidth;
      data.startX = -(data.slideFullWidth * data.count + data.spacing / 2);
      data.endX = -(data.slideFullWidth * data.count * 2 + data.spacing / 2);
      data.left = parseInt(getComputedStyle(this.$ul[0]).getPropertyValue('left'));

      // console.log((data.spacing + data.slideWidth) * data.count)
      return data;
    }
  }, {
    key: 'init',
    value: function init() {
      var _this = this;

      var that = this;
      this.executed = false;
      this.duplicate();
      this.$ul.css({ left: this.calculated.startX });
      this.slideSpeed = 1;
      this.speed = 0.2;
      this.move(this.calculated.startX, this.calculated.endX);
      this.$el.hover(function () {
        _this.pause();
      }, function () {

        _this.resume();
      });
      this.$el.find('button.next').click(function () {
        _this.nextSlide();
      });
      this.$el.find('button.prev').click(function () {
        _this.prevSlide();
      });
      var startPos = void 0,
          //cursor offset of the slide
      startScrollPos = void 0,
          orgPos = void 0,
          //$ul left pos
      currentPos = void 0,
          //$ul left pos(moving)
      holding = void 0,
          direction = void 0,
          cursorX = void 0,
          cursorStartX = void 0,
          holdingTime = void 0,
          longHold = void 0,
          //indicate which index of slide will be shown after touch/mouse button released
      scrolling = void 0,
          newStartX = void 0,
          dragging = void 0;
      this.$el.on('touchstart touchmove touchend mousedown mousemove mouseup mouseout', function (e) {
        var isMouse = e.type == 'mousedown' || e.type == 'mousemove' || e.type == 'mouseup' || e.type == 'mouseout';
        var isTouch = e.type == 'touchstart' || e.type == 'touchmove' || e.type == 'touchend';
        var eStart = e.type == 'touchstart' || e.type == 'mousedown';
        var eMove = e.type == 'touchmove' || e.type == 'mousemove';
        var eEnd = e.type == 'mouseup' || e.type == 'mouseout' || e.type == 'touchend';

        // if(eStart){
        cursorStartX = eStart ? isMouse ? e.pageX : e.targetTouches[0].pageX : cursorStartX;
        newStartX = cursorStartX;
        currentPos = eStart ? parseInt(that.$ul.css('left')) : currentPos;
        // orgPos = this.$ul.css('left');
        // cursorX = isMouse ? e.pageX : e.targetTouches[0].pageX
        if (eStart) holding = true;
        if (eEnd) holding = false;
        if (eMove) {}
        // }

        var props = {
          cursorStartX: cursorStartX,
          cursorX: isMouse ? e.pageX : e.targetTouches[0].pageX,
          holding: holding,
          currentPos: currentPos,
          newStartX: newStartX
        };
        that.drag(e, props);
      });
    }
  }, {
    key: 'drag',
    value: function drag(e, props) {

      if (props.holding) {
        var dragged = props.cursorStartX - props.cursorX;
        var targetPos = props.currentPos - dragged;
        props.currentPos -= dragged;
        console.log('currentPos' + props.currentPos);
        console.log('eX' + this.calculated.endX);
        if (props.currentPos < this.calculated.endX) {
          props.currentPos = this.calculated.startX;
          props.newStartX = props.cursorX;
          /*dragged -= dragged;
          targetPos = props.currentPos - dragged*/
          console.log('over');
        }
        if (props.currentPos < this.calculated.endX) {
          alert('asd');
        }
        console.log('ne' + props.newStartX);

        console.log('lll' + props.currentPos);
        this.$ul.css({
          'transition-duration': '0s',
          'left': props.currentPos });
      }
    }
  }, {
    key: 'nextSlide',
    value: function nextSlide() {
      this.speed = 1;
      this.move(this.calculated.left, this.calculated.left - 500);
      // this.pause();
    }
  }, {
    key: 'prevSlide',
    value: function prevSlide() {
      this.speed = 1;
      this.move(this.calculated.left, this.calculated.left + 500);
    }
  }, {
    key: 'move',
    value: function move(fromX, toX) {
      var _this2 = this;

      if (toX < this.calculated.endX) {
        toX = this.calculated.endX + 1;
      }
      var speed = this.speed;
      var distance = Math.abs(toX - fromX);
      var duration = distance / speed;

      /*console.log('fromX' + fromX)
      console.log('toX' + toX)
      console.log('distance' + distance)
      console.log('speed' + speed)
      console.log('duration' + duration)*/
      // console.log(distance);

      this.$ul.css({ 'transition-duration': duration / 1000 + 's' });
      this.$ul.css({ 'left': toX });
      if (!this.executed) {
        // this.executed = true;
        this.$ul.one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function () {
          if (_this2.calculated.endX == _this2.calculated.left) {
            _this2.$ul.css({ 'left': _this2.calculated.startX, 'transition-duration': '0s' });
            _this2.executed = false;
            _this2.speed = 0.2;
            _this2.move(_this2.calculated.startX, _this2.calculated.endX);
          }
          // this.$ul.data("transitioning", false);
        });
      }
    }
  }, {
    key: 'pause',
    value: function pause() {
      console.log('paused');
      var curPos = getComputedStyle(this.$ul[0]).getPropertyValue('left');
      this.$ul.css({ 'left': curPos, 'transition-duration': '0s' });
      // this.$ul.clearQueue().stop();
    }
  }, {
    key: 'resume',
    value: function resume() {
      this.speed = 0.2;
      this.move(this.calculated.left, this.calculated.endX);
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
  $('.marquee').each(function (i) {
    console.log(i);
    var name = 'marquee' + i;
    var props = {
      el: $(this)
    };
    createMarquee(name, $(this));

    window[name] = new Marquee(props);
  });
  $(window).resize(function () {
    window['marquee0'].resize();
  });

  function createMarquee(name, $this) {
    var props = {
      el: $this
    };
    window[name] = new Marquee(props);
    var mq = window[name];
    mq.init();
    mq.calcMarquee();
    console.log(mq);
  }
});