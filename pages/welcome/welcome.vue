<template>
	<view>
		<u-top-tips ref="uTips"></u-top-tips>
		<view class="welcome-container">
			<view class="main-box">
				<view class="dispaly-box">
					<view class="slogan-box">
						<text>Blab</text>
						<view class="sub-slogan-box">
							<text>smartdisplay</text>
						</view>
					</view>
				</view>
			</view>
			<view class="progress-box" @click="doReSearch">
				<u-circle-progress active-color="#2979ff" :duration="5000" :percent="percent">
					<view class="u-progress-content">
						<view class="u-progress-dot"></view>
						<text class='u-progress-info'>{{percent==0?'重新搜索':'设备搜索中'}}</text>
					</view>
				</u-circle-progress>
			</view>

		</view>
		<view class="copyright">
			<text>BLab大熊实验室❤用爱发电</text>
		</view>
	</view>
</template>

<script>
	import {
		arrayBuffer2String
	} from '../../utils/bleutil.js'
	export default {
		data() {
			return {
				percent: 0,
				needReSearch: false,
				searchTimmer: {}
			};
		},
		methods: {
			doReSearch() {
				var that = this
				//如果蓝牙已打开就查询
				if (that.$store.state.bluetoothStatus) {
					//搜索蓝牙
					this.startBluetoothFind()
					that.searchTimmer = setInterval(() => {
						that.percent += 10
						if (that.percent >= 100) {
							that.percent = 0
							//清除计时器
							clearInterval(that.searchTimmer)
							//关闭蓝牙发现
							uni.stopBluetoothDevicesDiscovery({
								success(res) {
									console.log('倒计时结束关闭蓝牙发现', res)
								}
							})

							that.$refs.uTips.show({
								title: '未搜索到设备,请确保设备靠近手机',
								type: 'warning',
								duration: '1500'
							})
						}
					}, 1000)
				}
			},
			startBluetoothFind() {
				var that = this
				uni.startBluetoothDevicesDiscovery({
					services: ['71db3107-6be5-4c0b-ad8e-731df7069e62'],
					success(res) {
						console.log('开启蓝牙发现服务成功', res)
					},
					fail(err) {
						console.error(err)
					}
				})
				//设备发现回调
				uni.onBluetoothDeviceFound(function(devicesResponse) {
					let devicveArray = devicesResponse.devices
					console.log('发现设备数组', devicveArray)
					if (devicveArray.length >= 1) {
						for (var i = 0; i < devicveArray.length; i++) {
							if (devicveArray[i].name == 'BLabSmartDisplay') {
								uni.showLoading({
									title: '蓝牙连接中'
								})
								//清除interval
								clearInterval(that.searchTimmer)
								//遍历数组查询信号最强的
								var selectedBluetooth = devicveArray[0]
								//多个设备选取信号最强的一个
								if (devicveArray.length > 1) {
									for (var i = 1; i < devicveArray.length; i++) {
										if (devicveArray[i].RSSI > selectedBluetooth.RSSI) {
											selectedBluetooth = devicveArray[i]
										}
									}
								}
								//保存选中的蓝牙
								that.$store.commit('setselectedBluetooth', selectedBluetooth)
								//关闭发现
								uni.stopBluetoothDevicesDiscovery({
									success(res) {
										console.log('关闭发现蓝牙成功', res)
									}
								})
								//开始连接蓝牙
								that.connectBle()
							}
						}
					}
				})
			},
			connectBle() {
				var that = this
				uni.createBLEConnection({
					deviceId: that.$store.state.selectedBluetooth.deviceId,
					success(res) {
						//ble连接成功状态保存
						that.$store.commit('setBleConnected', true)
						//保证能获取到服务，进行延时处理
						setTimeout(function() {
							uni.getBLEDeviceServices({
								deviceId: that.$store.state.selectedBluetooth.deviceId,
								success(serviceResponse) {
									console.log('设备所有service数组为：', serviceResponse)
									uni.getBLEDeviceCharacteristics({
										deviceId: that.$store.state.selectedBluetooth
											.deviceId,
										serviceId: that.$store.state.mainServiceId,
										success(ress) {
											console.log('设备特诊数组为：', ress
												.characteristics)
										}
									})
									//读取基本信息
									uni.onBLECharacteristicValueChange(function(res) {
										let ab = res.value
										console.log('读取到的数据对象：', JSON.parse(
											arrayBuffer2String(res
												.value)))
										that.$store.commit('setReadedObject', JSON.parse(
											arrayBuffer2String(res.value)))
										uni.hideLoading()
										//跳转主页
										uni.reLaunch({
											url: '../index/index'
										})
									})
									uni.readBLECharacteristicValue({
										deviceId: that.$store.state.selectedBluetooth
											.deviceId,
										serviceId: that.$store.state.mainServiceId,
										characteristicId: that.$store.state
											.readCharacteristicId,
										success(res) {

										}
									})
								}
							})

						}, 2000)
					}
				})
			}

		},
		onReady() {
			var that = this
			//如果蓝牙已打开就查询
			if (that.$store.state.bluetoothStatus) {
				that.startBluetoothFind();
				that.searchTimmer = setInterval(() => {
					that.percent += 10
					if (that.percent >= 100) {
						that.percent = 0
						//清除计时器
						clearInterval(that.searchTimmer)
						//关闭蓝牙发现
						uni.stopBluetoothDevicesDiscovery({
							success(res) {
								console.log('倒计时结束关闭蓝牙发现', res)
							}
						})

						that.$refs.uTips.show({
							title: '未搜索到设备,请确保设备靠近手机',
							type: 'warning',
							duration: '1500'
						})
					}
				}, 1000)
			}

		}


	}
</script>

<style lang="scss">
	.welcome-container {
		position: absolute;
		top: 45%;
		left: 50%;
		transform: translate(-50%, -50%);

		.main-box {
			height: 200rpx;
			width: 550rpx;
			background-color: #C0C0C0;
			display: flex;
			justify-content: center;
			align-items: center;

			.dispaly-box {
				background-color: #FFFFFF;
				height: 180rpx;
				width: 500rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				text-align: center;

				.slogan-box {
					font-size: 85rpx;
					font-weight: bold;

					.sub-slogan-box {
						font-size: 30rpx;
					}

				}
			}
		}

		.progress-box {
			margin-top: 300rpx;
			display: flex;
			justify-content: center;
		}


	}

	.copyright {
		width: 100%;
		font-size: 25rpx;
		position: absolute;
		bottom: 100rpx;
		text-align: center;
		color: #C8C9CC;
	}
</style>
