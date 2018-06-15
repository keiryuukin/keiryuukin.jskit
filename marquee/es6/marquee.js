class Marquee {
	constructor(props) {
		this.$el = props.el;
		this.$ul = this.$el.find('ul');
		this.$li = this.$el.find('li');

    // this.slideWidth = this.$el.width();
    // this.fakeZero = 0;
  }
  duplicate() {
  	let $ul = '';
  	let ary = [];
  	this.$el.find('li').each(function(i) {
  		$ul = $(this).parent();
  		$(this).addClass('slide' + i);
  		let temp = $(this).clone();
  		temp.addClass('copy')
  		ary.push(temp.prop('outerHTML'));
  	})

  	let dCode = ary.join('');
  	$ul.prepend(dCode).append(dCode)
  }
  get calculated() {
  	return this.calcMarquee();
  }
  get left() {
  	return this.calcLeft();
  }
  calcLeft() {
  	return parseInt(this.$ul.css('left'));
  }
  calcMarquee() {

  	let data = {
  		count: this.$li.not('.copy').length,
  		slideWidth: this.$li.width(),
  		spacing: parseInt(this.$li.css('margin-left')) * 2,
  	};
  	data.slideFullWidth = data.spacing + data.slideWidth;
  	data.startX = -(data.slideFullWidth * data.count + data.spacing / 2);
  	data.endX = -(data.slideFullWidth * data.count * 2 + data.spacing / 2);
  	data.left = parseInt(getComputedStyle(this.$ul[0]).getPropertyValue('left'));

    // console.log((data.spacing + data.slideWidth) * data.count)
    return data;
  }
  init() {
  	let that = this;
  	this.executed = false;
  	this.duplicate();
  	this.$ul.css({ left: this.calculated.startX });
  	this.slideSpeed = 1;
  	this.speed = 0.2;
  	this.move(this.calculated.startX, this.calculated.endX);
  	this.$el.hover(() => {
  		this.pause()
  	}, () => {

  		this.resume()
  	});
  	this.$el.find('button.next').click(()=>{
  		this.nextSlide();
  	})
  	this.$el.find('button.prev').click(()=>{
  		this.prevSlide();
  	})
  	let startPos, //cursor offset of the slide
  		startScrollPos,
  		orgPos, //$ul left pos
  		currentPos, //$ul left pos(moving)
  		holding,
  		direction,
  		cursorX,
  		cursorStartX,
  		holdingTime,
  		longHold, //indicate which index of slide will be shown after touch/mouse button released
  		scrolling,
  		newStartX,
  		dragging;
  	this.$el.on('touchstart touchmove touchend mousedown mousemove mouseup mouseout', function(e){
  		let isMouse = e.type == 'mousedown' || e.type == 'mousemove' || e.type == 'mouseup' || e.type == 'mouseout';
  		let isTouch = e.type == 'touchstart' || e.type == 'touchmove' || e.type == 'touchend';
  		let eStart = e.type == 'touchstart' || e.type == 'mousedown';
  		let eMove = e.type == 'touchmove' || e.type == 'mousemove';
  		let eEnd = e.type == 'mouseup' || e.type == 'mouseout' || e.type == 'touchend';

  		// if(eStart){
  			cursorStartX = eStart ? (isMouse ? e.pageX : e.targetTouches[0].pageX) : cursorStartX;
  				startPos = eStart ? parseInt(that.$ul.css('left')) : startPos ;
  			// orgPos = this.$ul.css('left');
  			cursorX = isMouse ? e.pageX : e.targetTouches[0].pageX
  			if(eStart){
  				holding = true;
  			}
  			if(eMove && holding){
  				let dragged = cursorStartX - cursorX;
  				let targetPos = currentPos - dragged;
  				console.log('stt'+startPos)
  				if(currentPos < that.calculated.endX){
  					currentPos = that.calculated.startX;
  					startPos = that.calculated.startX;
  					console.log('over')
  				}
  				currentPos = startPos - dragged;
  				that.$ul.css({
  					'transition-duration':'0s',
  					'left': currentPos})
  			}
  			if(eEnd){
  				holding = false;
  			}
  			
  		// }

  		

  	})

  }
  drag(e, props){
  	
  	if(props.holding){
  		let dragged = props.cursorStartX - props.cursorX;
  		let targetPos = props.currentPos - dragged
  		props.currentPos -= dragged;
  		console.log('currentPos'+props.currentPos)
  		console.log('eX'+this.calculated.endX)
  		if(props.currentPos < this.calculated.endX){
  			props.currentPos = this.calculated.startX;
  		props.newStartX = props.cursorX;
  			/*dragged -= dragged;
  			targetPos = props.currentPos - dragged*/
  			console.log('over')
  		}
  		if(props.currentPos < this.calculated.endX){
  			alert('asd')
  		}
  	console.log('ne' + props.newStartX)

  		console.log('lll'+props.currentPos)
  		this.$ul.css({
  			'transition-duration':'0s',
  			'left': props.currentPos})

  	}
  	
  }
  nextSlide() {
  	this.speed = 1;
  	this.move(this.calculated.left, this.calculated.left - 500);
  	// this.pause();
  }
  prevSlide() {
  	this.speed = 1;
  	this.move(this.calculated.left, this.calculated.left + 500)
  }
  move(fromX, toX) {
  	if(toX < this.calculated.endX){
  		toX = this.calculated.endX + 1
  	}
  	let speed = this.speed;
  	let distance = Math.abs(toX - fromX);
  	let duration = distance / speed;


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
      this.$ul.one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', () => {
      	if(this.calculated.endX == this.calculated.left){
      		this.$ul.css({ 'left': this.calculated.startX, 'transition-duration': '0s' });
      		this.executed = false;
      		this.speed = 0.2
      		this.move(this.calculated.startX, this.calculated.endX);
      	}
        // this.$ul.data("transitioning", false);
        
      });
    }

  }
  pause() {
  	console.log('paused')
  	let curPos = getComputedStyle(this.$ul[0]).getPropertyValue('left');
  	this.$ul.css({ 'left': curPos, 'transition-duration': '0s' })
    // this.$ul.clearQueue().stop();
  }
  resume() {
  	this.speed = 0.2;
  	this.move(this.calculated.left, this.calculated.endX)
  }
  
  
}
$(function() {
	$('.marquee').each(function(i) {
		console.log(i)
		let name = 'marquee' + i;
		let props = {
			el: $(this)
		}
		createMarquee(name, $(this))

		window[name] = new Marquee(props);
		

	})
	$(window).resize(() => {
		window['marquee0'].resize()
	})

	function createMarquee(name ,$this) {
		let props = {
			el: $this
		}
		window[name] = new Marquee(props);
		let mq = window[name];
		mq.init();
		mq.calcMarquee();
		console.log(mq)
		
		
		
	}

})