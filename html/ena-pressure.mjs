
const lazy = (fn, delay) => {
	let timer = null;
	return function(...args){
		clearTimeout(timer);
		timer = setTimeout(() => {
			fn(...args);
		}, delay);
	}
}
const calcDistance = (x1, y1, x2, y2) => {
	return Math.sqrt(
		Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2)
	);
}

export class EnaAdapter {
	
}
export class EnaPressure {
	constructor(options) {
		const {
			el,
			onDown,
			onUp,
			onMove,

			// 最小移动距离
			minDistance = 0.2,


			// 压感等级
			level = 1,
			weight = 1,
			interval = 3,

			// 画布原始尺寸
			nativeWidth = 640,
			nativeHeight = 480,

			// 屏蔽非压感设备
			disableLow = false,


			// 虚拟压感部分
			polyfill = {
				type: 'speed',
				max: 20,
				power: 18,
			},

			// 压感反转
			reverse = false,
		} = options;

		this.el = el;
		this.onDown = onDown;
		this.onUp = onUp;
		this.onMove = onMove;

		this.minDistance = minDistance;

		this.level = level;
		this.weight = weight;

		this.interval = interval;

		this.nativeWidth = nativeWidth;
		this.nativeHeight = nativeHeight;

		this.drawing = false;

		// 是否屏蔽低压感设备
		this.disableLow = disableLow;

		// polyfill 降级支持压感方案 为空使用原生 0.5;
		this.polyfill = polyfill;

		// 是否支持压感 状态
		this.less = false;

		// 压感反转
		this.reverse = reverse;

		// 画布缩放比例
		this.scale = 1;

		this.lastX = 0;
		this.lastY = 0;
		this.lastMoveTime = 0;

		console.log(this);

		this.globalEl = document;

		this._onPointerStart = this.onPointerStart.bind(this);
		this._onPointerMove = this.onPointerMove.bind(this);
		this._onPointerEnd = this.onPointerEnd.bind(this);

		this._onTouchStart = this.onTouchStart.bind(this);
		this._onTouchMove = this.onTouchMove.bind(this);
		this._onTouchEnd = this.onTouchEnd.bind(this);

		this._onVisibilityChange = this.onVisibilityChange.bind(this);

		this._onResize = lazy(this.onResize.bind(this), 100);

		this.onResize();
	}

	set(key, value){
		this[key] = value;
	}

	down(x,y,pressure){
		if( [ undefined, 0, 0.5, 1].includes(pressure) ){
			// 无压感设备
			if(this.disableLow){
				return console.log('low pressure device');
			}

			this.less = true;

			console.log('polyfill on');
		}else{
			this.less = false;
			console.log('polyfill off');
		}
		this.drawing = true;

		this.onDown({
			x,
			y,
			pressure, 
			less: this.less
		});
		// this.move(x,y,pressure);
	}

	up(x,y,pressure){
		this.drawing = false;
		// this.move(x,y,pressure);
		this.onUp(x,y,pressure);
	}

	move(x,y,pressure){

		const { 
			lastX,
			lastY,
			lastMoveTime,
		} = this;

		// 最小移动距离

		// console.log('move c', x, y, lastX, lastY);

		const distance = calcDistance(x, y, lastX, lastY);


		// if(distance < this.minDistance){
		// 	// console.log('skip Point', distance);
		// 	return;
		// }


		const now = +new Date();

		const ms = now - lastMoveTime;
		// if(ms < this.interval){
		// 	// console.log('skip Time', ms);
		// 	return;
		// }


		// if(this.lastX === x && this.lastY === y){
		// 	return;
		// }



		if(!this.drawing){
			this.lastX = x;
			this.lastY = y;
			this.lastMoveTime = now;
			return;
		}

		if(this.less){ // 低压感设备
			const {
				polyfill
			} = this;

			if(polyfill){ // 开启降级虚拟压感
				if(polyfill.type === 'speed'){
		
					// 根据时间速度计算虚拟压感
					// const distance = calcDistance(x, y, lastX, lastY);

					const speed = distance / ms;

		
					let virtualPressure = speed / polyfill.max;
		
					console.log('speed', {time: ms, speed, virtualPressure});

					virtualPressure = Math.max(0, virtualPressure);
					virtualPressure = Math.min(1, virtualPressure);
		
					// 虚拟压感曲线
					virtualPressure = 1 - Math.pow((1 - virtualPressure ), polyfill.power );
		
					pressure = virtualPressure;
				}
			}else{
				pressure = 0.5;
			}
		}

		this.lastX = x;
		this.lastY = y;
		this.lastMoveTime = now;

		if(this.reverse){ // 压感反转
			pressure = 1 - pressure;
		}

		this.onMove(x,y,pressure);
	}

	calcXYW(x,y,pressure){
		const { 
			rect, 
			nativeWidth, 
			nativeHeight,
			scale
		} = this;

		const { 
			top,
			left,
			width, 
			height
		} = rect;

		const _x = (x - left) / scale;
		const _y = (y - top) / scale;

		return [
			_x,
			_y,
			pressure,
		]
		
	}

	getXYWFromPointerEvent(e){
		// console.log('force',e,e.force)
		const x = e.clientX;
		const y = e.clientY;
		const pressure = e.pressure;
		return this.calcXYW(x,y,pressure);
	}
	getXYWFromTouchEvent(e){

		const x = e.touches[0].clientX;
		const y = e.touches[0].clientY;
		const pressure = e.touches[0].force;
		return this.calcXYW(x,y,pressure);

	}

	onPointerStart(e){
		console.log('pointer start', e);
		this.unlistenPointer();
		this.down(...this.getXYWFromPointerEvent(e));
		this.globalEl.addEventListener('pointerup', this._onPointerEnd);
		this.globalEl.addEventListener('pointerleave', this._onPointerEnd);
		this.globalEl.addEventListener('visibilitychange', this._onVisibilityChange);
	}
	onTouchStart(e){
		console.log('touch start', e);
		this.unlistenTouch();
		this.down(...this.getXYWFromTouchEvent(e));
		this.globalEl.addEventListener('touchend', this._onTouchEnd);

		this.globalEl.addEventListener('visibilitychange', this._onVisibilityChange);

	}

	onPointerMove(e){
		this.move(...this.getXYWFromPointerEvent(e));
	}
	onTouchMove(e){
		this.move(...this.getXYWFromTouchEvent(e));
	}

	unlistenPointer(){
		this.globalEl.removeEventListener('pointerup', this._onPointerEnd);
		this.globalEl.removeEventListener('pointerleave', this._onPointerEnd);
		this.globalEl.removeEventListener('visibilitychange', this._onVisibilityChange);

	}
	unlistenTouch(){
		this.globalEl.removeEventListener('touchend', this._onTouchEnd);

		this.globalEl.removeEventListener('visibilitychange', this._onVisibilityChange);
	}

	onPointerEnd(e){
		this.up(...this.getXYWFromPointerEvent(e));
		this.unlistenPointer();
	}
	onTouchEnd(e){
		this.up(...this.getXYWFromTouchEvent(e));
		this.unlistenTouch();
	}


	onResize(){
		const { el } = this;
		const rect = el.getBoundingClientRect();
		this.rect = rect;
		this.scale = rect.width / this.nativeWidth;
	}
	onVisibilityChange(e){
		this.up();
	}

	listen(){
		this.unlisten();
		// 绑定 PointerEvent 事件
		this.el.addEventListener('pointerdown', this._onPointerStart);
		this.globalEl.addEventListener('pointermove', this._onPointerMove);

		// 绑定 TouchEvent 事件
		this.el.addEventListener('touchstart', this._onTouchStart);
		this.globalEl.addEventListener('touchmove', this._onTouchMove);

		// 监听 resize 事件
		window.addEventListener('resize', this._onResize);
		// 监听 scroll 事件
		window.addEventListener('scroll', this._onResize);
	}
	unlisten(){
		// 解绑 PointerEvent 事件
		this.el.removeEventListener('pointerdown', this._onPointerStart);
		this.globalEl.removeEventListener('pointermove', this._onPointerMove);

		// 解绑 TouchEvent 事件
		this.el.removeEventListener('touchstart', this._onTouchStart);
		this.globalEl.removeEventListener('touchmove', this._onTouchMove);

		// 解绑 resize 事件
		window.removeEventListener('resize', this._onResize);
		// 解绑 scroll 事件
		window.removeEventListener('scroll', this._onResize);

		this.unlistenPointer();
		this.unlistenTouch();
	}
}