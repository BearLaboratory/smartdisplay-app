<template>
	<view class="htz-signature-body">
		<canvas :canvas-id="cid" :id="cid" @touchstart="touchstart" @touchmove="touchmove"
			style="border: solid 4rpx #000000;" @touchend="touchend"></canvas>
		<!-- 隐藏canvas为数据转换 -->
		<!-- <view>
			<canvas canvas-id="hiddenCanvas" id="hiddenCanvas" style="position:fixed;left:100%;"></canvas>
		</view> -->

		<view class="htz-signature-fixed-bottom">
			<view class="htz-signature-fixed-bottom-item htz-signature-tools">
				<view class="htz-signature-tools-item" @click="background">
					<image src="../../static/htz-signature/background.png"></image>
					<view>背景</view>
				</view>
				<view class="htz-signature-tools-item" @click="lineWidth">
					<image src="../../static/htz-signature/bicuxi.png"></image>
					<view>线条</view>
				</view>
				<view class="htz-signature-tools-item" @click="color">
					<image src="../../static/htz-signature/color-plate-fill.png"></image>
					<view>颜色</view>
				</view>
				<view class="htz-signature-tools-item" @click="revoke">
					<image src="../../static/htz-signature/chehuinormal.png"></image>
					<view>撤回</view>
				</view>
				<view class="htz-signature-tools-item" @click="clear">
					<image src="../../static/htz-signature/qingkong_1.png"></image>
					<view>清空</view>
				</view>
			</view>
			<view class="htz-signature-fixed-bottom-item sumbit" @click="sumbit">提交</view>
		</view>

		<!-- #ifdef APP-PLUS -->
		<view class="htz-signature-color-main" v-if="colorShow">
			<view @click="selColor(index)"
				:class="index==colorIndex?'htz-signature-color-item on ':'htz-signature-color-item '"
				:style="'background-color:'+item.value" v-for="(item,index) in colorData" :key="index">
				<image class="htz-signature-color-item-icon" src="../../static/htz-signature/on.png"></image>
			</view>
		</view>
		<view class="htz-signature-color-main" v-if="backgroundShow">
			<view @click="setBackground(index)"
				:class="index==backgroundIndex?'htz-signature-color-item on ':'htz-signature-color-item '"
				:style="'background-color:'+item.value" v-for="(item,index) in colorData" :key="index">
				<image class="htz-signature-color-item-icon" src="../../static/htz-signature/on.png">
				</image>
			</view>
		</view>
		<view class="htz-signature-color-main" v-if="lineWidthShow">
			<view @click="selLineWidth(index)"
				:class="index==lineWidthIndex?'htz-signature-lineWidth-item on':'htz-signature-lineWidth-item'"
				v-for="(item,index) in lineWidthData" :key="index">
				<view
					:style="'width:60%;height:'+item+'px;background-color:#000000;position: absolute;top: 50%;left: 20%;margin-top:-'+item/2+'px'">
				</view>
			</view>
		</view>
		<!-- #endif -->
		<!-- #ifndef APP-PLUS -->
		<cover-view class="htz-signature-color-main" v-if="colorShow">
			<cover-view @click="selColor(index)"
				:class="index==colorIndex?'htz-signature-color-item on ':'htz-signature-color-item '"
				:style="'background-color:'+item.value" v-for="(item,index) in colorData" :key="index">
				<cover-image class="htz-signature-color-item-icon" src="../../static/htz-signature/on.png">
				</cover-image>
			</cover-view>
		</cover-view>
		<cover-view class="htz-signature-color-main" v-if="backgroundShow">
			<cover-view @click="setBackground(index)"
				:class="index==backgroundIndex?'htz-signature-color-item on ':'htz-signature-color-item '"
				:style="'background-color:'+item.value" v-for="(item,index) in colorData" :key="index">
				<cover-image class="htz-signature-color-item-icon" src="../../static/htz-signature/on.png">
				</cover-image>
			</cover-view>
		</cover-view>
		<cover-view class="htz-signature-color-main" v-if="lineWidthShow">
			<cover-view @click="selLineWidth(index)"
				:class="index==lineWidthIndex?'htz-signature-lineWidth-item on':'htz-signature-lineWidth-item'"
				v-for="(item,index) in lineWidthData" :key="index">
				<cover-view
					:style="'width:60%;height:'+item+'px;background-color:#000000;position: absolute;top: 50%;left: 20%;margin-top:-'+item/2+'px'">
				</cover-view>
			</cover-view>
		</cover-view>
		<!-- #endif -->
	</view>

</template>

<script>
	export default {
		name: 'htz-signature',
		props: {
			cid: {
				type: String,
				default: '',
			},
		},
		data() {
			return {
				id: '',
				Strokes: [],
				dom: null,
				width: 0,
				height: 0,
				colorShow: false,
				colorIndex: 0,
				backgroundShow: false,
				backgroundIndex: 1,
				colorData: [{
					name: '黑色',
					value: '#000000'
				}, {
					name: '白色',
					value: '#ffffff',
				}],
				lineWidthShow: false,
				lineWidthIndex: 0,
				lineWidthData: ['3', '6', '9', '12', '15', '18'],
				hiddenCanvas: null
			}
		},
		mounted: function() {
			this.$nextTick(function() {
				// #ifdef H5
				document.body.addEventListener('touchmove', this.touchmoveEnd, {
					passive: false
				})
				// #endif

				uni.getSystemInfo({
					success: (res) => {
						// this.width = res.windowWidth;
						this.width = res.windowHeight * 0.3892;
						this.height = res.windowHeight * 0.9;
					}
				});

				this.dom = uni.createCanvasContext(this.cid, this);
				this.dom.width = this.width
				this.dom.height = this.height
				this.dom.fillStyle = this.colorData[this.backgroundIndex].value
				this.dom.fillRect(0, 0, this.width, this.height)
				this.dom.draw();

				this.hiddenCanvas = uni.createCanvasContext("hiddenCanvas", this)
				this.hiddenCanvas.width = 128
				this.hiddenCanvas.height = 296
				this.hiddenCanvas.fillStyle = this.colorData[this.backgroundIndex].value
				this.hiddenCanvas.fillRect(0, 0, this.hiddenCanvas.width, this.hiddenCanvas.height)
				this.hiddenCanvas.draw();
				
				this.clear()

			});
			
		},
		beforeDestroy: function() {
			// #ifdef H5
			document.body.removeEventListener('touchmove', this.touchmoveEnd, {
				passive: false
			})
			// #endif
		},
		methods: {
			touchmoveEnd(e) {
				e.preventDefault();
				e.stopPropagation();
			},
			sumbit() {
				var that = this
				uni.canvasToTempFilePath({
					canvasId: this.cid,
					destWidth: 128,
					destHeight: 296,
					success: (res) => {
						console.log(this)
						console.log('success', res)
						//影藏域中加载
						that.hiddenCanvas.drawImage(res.tempFilePath, 0, 0, 128, 296);
						that.hiddenCanvas.draw();

						//this.$emit('sumbit', res)

					},
					fail: (err) => {
						//console.log('fail', err)
						//this.$emit('fail', err)
					}
				}, this)
				uni.showToast({
					title: '数据处理中',
					icon: 'loading',
					duration: 2000
				})
				setTimeout(() => {
					uni.hideToast()
					uni.canvasGetImageData({
						canvasId: 'hiddenCanvas',
						x: 0,
						y: 0,
						width: 128,
						height: 296,
						success(res) {
							console.log(res)
							let buffer = new ArrayBuffer(4736);
							let dataView = new DataView(buffer)
							let byteString = ''
							var rawDataBuffer = Array.from(res.data)
							for (var i = 0; i < 37888; i++) {
								if (rawDataBuffer[i * 4] == 0 && rawDataBuffer[i * 4 + 1] == 0 &&
									rawDataBuffer[i * 4 + 2] == 0) {
									byteString += '0'
								} else {
									byteString += '1'
								}
							}
							console.log(byteString)

							//8位切分
							for (var i = 0; i < 4736; i++) {
								dataView.setUint8(i, parseInt(byteString.substring(i * 8, i * 8 + 8), 2))
							}

							console.log(dataView)
						},
						fail(err) {
							console.log(err)
						}
					}, this)
				}, 1500)

			},
			clear() { //清空
				this.Strokes = [];
				this.dom.fillStyle = this.colorData[this.backgroundIndex].value
				this.dom.fillRect(0, 0, this.width, this.height)
				this.dom.draw();
			},
			background() {
				this.backgroundShow = true
			},
			setBackground(index) {
				this.backgroundIndex = index
				this.backgroundShow = false
				this.dom.fillStyle = this.colorData[index].value
				this.dom.fillRect(0, 0, this.width, this.height)
				this.dom.draw();
			},
			lineWidth() {
				this.lineWidthShow = !this.lineWidthShow;
				this.colorShow = false;
			},
			selLineWidth(index) {
				this.lineWidthIndex = index;
				this.lineWidthShow = false;
			},
			color() {
				this.colorShow = !this.colorShow;
				this.lineWidthShow = false;
			},
			selColor(index) {
				this.colorIndex = index;
				this.colorShow = false;
			},
			revoke() { //撤销上一步
				var delItem = this.Strokes.pop();
				// if (delItem) {
				// 	delItem.points.forEach((item, index) => {
				// 		if (index < (delItem.points.length - 1)) {
				// 			this.dom.setStrokeStyle('#FFFFFF')
				// 			this.dom.moveTo(delItem.points[index].x, delItem.points[index].y);
				// 			this.dom.lineTo(delItem.points[index + 1].x, delItem.points[index + 1].y);
				// 			this.dom.stroke();
				// 			this.dom.draw(true);
				// 			// this.dom.clearRect(delItem.points[index].x, delItem.points[index].y, 10, 10);
				// 			// this.dom.draw(true)
				// 		}
				// 	})

				// }



				// this.dom.draw();
				// if(this.Strokes.length>0){
				// 	var lastItem = this.Strokes[this.Strokes.length - 1];
				// 	uni.canvasPutImageData({
				// 		canvasId: this.cid,
				// 		data: lastItem.imageData.data,
				// 		x: 0,
				// 		y: 0,
				// 		width: lastItem.imageData.width,
				// 		height: lastItem.imageData.height,
				// 		success:(res)=> {
				// 			console.log('success',res)
				// 		}
				// 	},this)
				// }

				//console.log('delItem', delItem)
				//this.dom.drawImage(delItem.x, delItem.y, 0, 0)
				this.drawCanves();
			},
			drawCanves() {
				this.dom.fillStyle = this.colorData[this.backgroundIndex].value
				this.dom.fillRect(0, 0, this.width, this.height)
				//this.dom.draw();
				this.Strokes.forEach((item, index) => {
					let StrokesItem = item;
					//console.log(index, this.Strokes.length)
					if (StrokesItem.points.length > 1) {
						this.dom.beginPath();
						this.dom.setLineCap('round');
						this.dom.setStrokeStyle(item.style.color);
						this.dom.setLineWidth(item.style.lineWidth);
						StrokesItem.points.forEach((sitem, sindex) => {
							if (sitem.type == "touchstart") {
								this.dom.moveTo(sitem.x, sitem.y)
							} else {
								this.dom.lineTo(sitem.x, sitem.y)
							}
							//console.log('dom', sitem)
						})
						this.dom.stroke();

					}
				})
				this.dom.draw();
			},
			createId() {
				var d = new Date();
				return 'can' + d.getTime();
			},
			touchstart(e) {

				this.Strokes.push({
					imageData: null,
					style: {
						color: this.colorData[this.colorIndex].value,
						lineWidth: this.lineWidthData[this.lineWidthIndex],
					},
					points: [{
						x: e.touches[0].x,
						y: e.touches[0].y,
						type: e.type,
					}]
				})
				this.drawLine(this.Strokes[this.Strokes.length - 1], e.type);
			},
			touchmove(e) {
				this.Strokes[this.Strokes.length - 1].points.push({
					x: e.touches[0].x,
					y: e.touches[0].y,
					type: e.type,
				})
				this.drawLine(this.Strokes[this.Strokes.length - 1], e.type);
			},
			touchend(e) {
				if (this.Strokes[this.Strokes.length - 1].points.length < 2) { //当此路径只有一个点的时候
					this.Strokes.pop();
				}
				//this.drawLine(this.Strokes[this.Strokes.length - 1], e.type);
				// uni.canvasGetImageData({
				// 	canvasId: this.cid,
				// 	x: 0,
				// 	y: 0,
				// 	width: this.width,
				// 	height: this.height,
				// 	success: (res) => {
				// 		 console.log(res.width) // 100
				// 		// console.log(res.height) // 100
				// 		// console.log(res.data instanceof Uint8ClampedArray) // true
				// 		// console.log(res.data.length) // 100 * 100 * 4
				// 		this.Strokes[this.Strokes.length - 1].imageData = res;
				// 	}
				// },this)
				//this.drawCanves();
			},
			drawLine(StrokesItem, type) {
				if (StrokesItem.points.length > 1) {
					this.dom.beginPath();
					this.dom.setLineCap('round')
					this.dom.setStrokeStyle(StrokesItem.style.color);
					this.dom.setLineWidth(StrokesItem.style.lineWidth);
					this.dom.moveTo(StrokesItem.points[StrokesItem.points.length - 2].x, StrokesItem.points[StrokesItem
						.points.length -
						2].y);
					this.dom.lineTo(StrokesItem.points[StrokesItem.points.length - 1].x, StrokesItem.points[StrokesItem
						.points.length -
						1].y);
					this.dom.stroke();
					this.dom.draw(true);
				}
			}
		}
	}
</script>

<style>
	.htz-signature-body {
		position: fixed;
		top: 0;
		bottom: 120rpx;
		left: 0;
		width: 100%;
		background-color: #C8C9CC;
		display: flex;
		justify-content: center;
	}

	.htz-signature-body canvas {
		width: 38.92vh;
		/* width: 100%; */
		/* height: 100%; */
		height: 90vh;
	}

	.htz-signature-fixed-bottom {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 120rpx;
		line-height: 120rpx;
		text-align: center;
		color: #000;
		z-index: 11;
		display: -webkit-box;
		display: -webkit-flex;
		display: flex;
		background-color: #fff;
	}

	.htz-signature-fixed-bottom .htz-signature-fixed-bottom-item {
		-webkit-box-flex: 3;
		-webkit-flex-grow: 3;
		flex-grow: 3;
		border-top: 1px solid #1890ff;
		color: #1890ff;
	}

	.htz-signature-fixed-bottom view.sumbit {
		-webkit-box-flex: 1;
		-webkit-flex-grow: 1;
		flex-grow: 1;
		background-color: #1890ff;
		color: #fff;
	}

	.htz-signature-tools {
		display: -webkit-box;
		display: -webkit-flex;
		display: flex;
	}

	.htz-signature-tools-item {
		text-align: center;
		-webkit-box-flex: 1;
		-webkit-flex-grow: 1;
		flex-grow: 1;
		line-height: 35rpx;

	}

	.htz-signature-fixed-bottom-item view image {
		width: 50rpx;
		height: 50rpx;
		padding-top: 10rpx;
	}

	.htz-signature-tools-item view {
		font-size: 22rpx;
	}

	.htz-signature-color-main {
		position: fixed;
		bottom: 120rpx;
		left: 0;
		width: 710rpx;
		/* height: 75rpx; */
		z-index: 11;
		padding: 25rpx 20rpx;
		display: -webkit-box;
		display: -webkit-flex;
		display: flex;
		flex-wrap: wrap;
		background-color: #fff;
		border-top: 1px dashed #d9d9d9;
		transition: display 2s;
		-moz-transition: display 2s;
		/* Firefox 4 */
		-webkit-transition: display 2s;
		/* Safari 和 Chrome */
		-o-transition: display 2s;
	}

	.htz-signature-color-item {
		width: 80rpx;
		height: 80rpx;
		background-color: #000000;
		border-radius: 100px;
		margin: 5px;
		position: relative;
		border: dashed 1rpx #C8C9CC;
	}

	.htz-signature-lineWidth-item {
		width: 80rpx;
		height: 80rpx;
		background-color: #fff;
		border-radius: 100px;
		margin: 5px;
		position: relative;
	}

	.htz-signature-lineWidth-item.on {
		border: 1px solid #d4a39e;
	}

	.htz-signature-color-item .htz-signature-color-item-icon {
		display: none;
	}

	.htz-signature-color-item.on .htz-signature-color-item-icon {
		display: block;
		position: absolute;
		top: 50%;
		left: 50%;
		width: 50rpx;
		height: 50rpx;
		margin-top: -25rpx;
		margin-left: -25rpx;
	}

	.black {
		background-color: #000000 !important;
	}
</style>
