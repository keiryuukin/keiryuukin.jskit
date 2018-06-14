class Marquee {
	constructor(props){
		this.el = props.el;
		this.$ul = this.el.find('ul');
		this.$li = this.el.find('li');
		// this.slideWidth = this.el.width();
		// this.fakeZero = 0;
	}
	duplicate(){
		let $ul = '';
		let ary = [];
		this.el.find('li').each(function(i){
			$ul = $(this).parent();
			$(this).addClass('slide' + i);
			let temp = $(this).clone();
			temp.addClass('copy')
			ary.push(temp.prop('outerHTML'));
		})

		let dCode = ary.join('');
		$ul.prepend(dCode).append(dCode)
	}
	get calculated(){
		return this.calcMarquee();
	}
	get left(){
		return this.calcLeft();
	}
	calcLeft(){
		return parseInt(this.$ul.css('left'));
	}
	calcMarquee(){
		
		let data = {
			count: this.$li.not('.copy').length,
			slideWidth: this.$li.width(),
			spacing: parseInt(this.$li.css('margin-left')) * 2,
		};
		data.startX = -((data.spacing + data.slideWidth) * data.count + data.spacing / 2);
		data.endX = -((data.spacing + data.slideWidth) * data.count * 2 + data.spacing / 2);
		
		// console.log((data.spacing + data.slideWidth) * data.count)
		return data;
	}
	init(){
		let that = this;
		this.duplicate();
		this.$ul.css({left:this.calculated.startX});
		this.speed = 0.2;
		this.move();
		
	}
	nextSlide(){
		console.log('fff')
	}
	move(fromX){
		this.$ul.clearQueue()
		let startX = fromX ? fromX : this.calculated.startX;
		console.log('s'+startX)
		let speed = this.speed;
		let distance = Math.abs(this.calculated.endX - startX);
		// let speed = distance / ms;
		let duration = distance / speed;
		console.log('distance'+distance)
		console.log('speed'+speed)
		console.log('duration'+duration)
		// console.log(distance);

		this.$ul.css({'left':startX,'transition-duration':'0s'});
		this.$ul.animate({'left':this.calculated.endX},duration,'linear',()=>{
			this.move();
		})
	}
	pause(){
		let curPos = this.$ul.css('left');
		this.$ul.clearQueue().stop();
	}
}
$(function(){
	let temp = '';
	$('.marquee').each(function(i){
		console.log(i)
		let name = 'marquee' + i;
		let props = {
			el:$(this)
		}
		window[name] = new Marquee(props);
		let mq = window[name];
		mq.init();
		mq.calcMarquee();
		console.log(mq)
	}).hover(()=>{
		window['marquee0'].pause()
		temp = (window['marquee0'].left)
	},()=>{

		// temp = 
		console.log(temp)
		window['marquee0'].move(temp)
	});
	function createMarquee(){
		
	}

})