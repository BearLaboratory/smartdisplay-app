<template>
	<view class="content">


		<!-- 展示牌模式 -->
		<view class="canvas-box" v-show="selectedItem.value==0">
			<htz-signature @sumbit="sumbit" cid="ceshi1"></htz-signature>
		</view>
		<!-- 天气模式 -->
		<view class="" v-show="selectedItem.value==1">

			<view class="logo-box">
				<image src="../../static/tianqipic.png" mode="widthFix"></image>
			</view>

			<view class="form-box">
				<view class="setting-message">
					<text>设置基本信息</text>
					<u-line color="#c8c9cc" margin="10rpx 0" />
				</view>
				<u-form :model="temptureObject" ref="uForm1">
					<u-form-item label="slogan" label-width="180">
						<u-input v-model="temptureObject.slogan" :adjust-position="true" />
					</u-form-item>
					<u-form-item label="WiFi名称" label-width="180" prop="ssid">
						<u-input v-model="temptureObject.ssid" :adjust-position="true" />
					</u-form-item>
					<u-form-item label="WiFi密码" label-width="180" prop="password">
						<u-input v-model="temptureObject.password" type="password" :adjust-position="true" />
					</u-form-item>
					<u-form-item label="天气appId" label-width="180" prop="appId">
						<u-input v-model="temptureObject.appId" :adjust-position="true" />
					</u-form-item>
					<u-form-item label="天气secret" label-width="180" prop="secret">
						<u-input v-model="temptureObject.secret" :adjust-position="true" />
					</u-form-item>

					<u-button type="primary" @click="saveTemptureMode">保存</u-button>
				</u-form>
			</view>
		</view>
		<!-- 粉丝计数器模式 -->
		<view class="" v-show="selectedItem.value==2">
			<view class="logo-box">
				<image src="../../static/fensipic.png" mode="widthFix"></image>
			</view>

			<view class="form-box">
				<view class="setting-message">
					<text>设置基本信息</text>
					<u-line color="#c8c9cc" margin="10rpx 0" />
				</view>
				<u-form :model="fansObject" ref="uForm">
					<u-form-item label="频道名" label-width="180" prop="brand">
						<u-input v-model="fansObject.brand" :adjust-position="true" />
					</u-form-item>
					<u-form-item label="WiFi名称" label-width="180" prop="ssid">
						<u-input v-model="fansObject.ssid" :adjust-position="true" />
					</u-form-item>
					<u-form-item label="WiFi密码" label-width="180" prop="password">
						<u-input v-model="fansObject.password" type="password" :adjust-position="true" />
					</u-form-item>
					<u-form-item label="B站vmId" label-width="180" prop="vmId">
						<u-input v-model="fansObject.vmId" :adjust-position="true" />
					</u-form-item>
					<u-form-item label="百家号appId" label-width="180" prop="appId">
						<u-input v-model="fansObject.appId" :adjust-position="true" />
					</u-form-item>
					<u-form-item label="百家号token" label-width="180" prop="token">
						<u-input v-model="fansObject.token" :adjust-position="true" />
					</u-form-item>

					<u-button type="primary" @click="saveFansMode">保存</u-button>
				</u-form>
			</view>
		</view>

		<view class="action-box" @click="popupShow=true">
			<u-icon name="list" color="#ffffff" size="40"></u-icon>
		</view>
		<u-popup v-model="popupShow" width="480">
			<!-- 基础信息框 -->
			<view class="basic-info-box">
				<view class="inner-info-box">
					<u-icon name="wifi" size="30"></u-icon>
					<text>{{readedObject.signal}}</text>
				</view>
				<view class="inner-info-box">
					<u-icon name="hourglass-half-fill" size="30"></u-icon>
					<text>{{readedObject.power}}%</text>
				</view>
				<view class="inner-info-box">
					<u-icon name="info-circle-fill" size="30"></u-icon>
					<text>{{readedObject.version}}</text>
				</view>
			</view>
			<u-line color="#c8c9cc" />
			<!-- 选项框 -->
			<view class="more-action-box">
				<u-section :show-line="false" title="工作模式" sub-color="#c8c9cc" :sub-title="selectedItem.label"
					@click="selectShow=true">
				</u-section>
				<u-section :show-line="false" title="硬件升级" sub-color="#c8c9cc" sub-title="固件升级"
					@click="selectShow=true">
				</u-section>
				<u-section :show-line="false" title="重启系统" sub-color="#c8c9cc" sub-title="重启系统"
					@click="rebootConfirmShow=true">
				</u-section>
				<u-section :show-line="false" title="格式化" sub-color="#c8c9cc" sub-title="格式化系统"
					@click="clearConfirmShow=true">
				</u-section>
			</view>
			<view class="close-button-box">
				<u-button v-show="!bleConnected" type="success" size="medium" shape="circle" @click="connectBle">重连
				</u-button>
				<u-button v-show="bleConnected" type="error" size="medium" shape="circle" @click="disConnectBle">断开
				</u-button>

				<u-button type="primary" size="medium" shape="circle" @click="popupShow=false">关闭</u-button>
			</view>
		</u-popup>
		<!-- select -->
		<u-select v-model="selectShow" :list="selectList" @confirm="modeSelect" :default-value="[selectedItem.value]">
		</u-select>
		<u-modal v-model="rebootConfirmShow" @confirm="rebootConfirm" ref="uModal" content="确定要重启系统吗?"
			:show-cancel-button='true'></u-modal>
		<u-modal v-model="clearConfirmShow" @confirm="clearConfirm" ref="uModal" content="确定要格式化系统吗?"
			:show-cancel-button='true'></u-modal>
	</view>
</template>

<script>
	import htzSignature from '@/components/htz-signature/htz-signature.vue'
	import {
		String2Ab,
		ch2Unicdoe
	} from '../../utils/bleutil.js'
	export default {
		data() {
			return {
				bleConnected: false,
				popupShow: false,
				selectShow: false,
				rebootConfirmShow: false,
				clearConfirmShow: false,
				selectList: [{
					value: '0',
					label: '展示牌模式'
				}, {
					value: '1',
					label: '天气模式'
				}, {
					value: '2',
					label: '粉丝计数器'
				}],
				selectedItem: {},
				temptureObject: {
					slogan: '',
					ssid: '',
					password: '',
					appId: '',
					token: ''
				},
				fansObject: {
					ssid: '',
					password: '',
					vmId: '',
					appId: '',
					token: ''
				},
				rules: {
					brand: [{
						required: true,
						message: '请输入频道名称',
						trigger: ['change', 'blur'],
					}],
					ssid: [{
						required: true,
						message: '请输入WiFi名称',
						trigger: ['change', 'blur'],
					}],
					password: [{
						required: true,
						message: '请输入WiFi密码',
						trigger: ['change', 'blur'],
					}],
					appId: [{
						required: true,
						message: '请输入APPID',
						trigger: ['change', 'blur'],
					}],
					secret: [{
						required: true,
						message: 'SECRET',
						trigger: ['change', 'blur'],
					}],
					token: [{
						required: true,
						message: 'token必填',
						trigger: ['change', 'blur'],
					}],
					vmId: [{
						required: true,
						message: 'vmId必填',
						trigger: ['change', 'blur'],
					}]
				}
			}
		},
		components: {
			htzSignature,
		},
		created() {
			this.bleConnected = this.$store.state.bleConnected
			this.selectList.forEach(item => {
				if (item.value == this.$store.state.readedObject.type) {
					this.selectedItem = item
				}

			})

		},
		computed: {

			readedObject() {
				return this.$store.state.readedObject
			}
		},
		onReady: function(e) {
			this.$refs.uForm.setRules(this.rules);
			this.$refs.uForm1.setRules(this.rules);
		},
		watch: {
			'$store.state.bleConnected': function() {
				this.bleConnected = this.$store.state.bleConnected
			}
		},
		methods: {
			connectBle() {
				var that = this
				console.log(that.$store.state.selectedBluetooth)
				uni.createBLEConnection({
					deviceId: that.$store.state.selectedBluetooth.deviceId,
					success(res) {
						//ble连接成功状态保存
						that.$store.commit('setBleConnected', true)
						uni.getBLEDeviceServices({
							deviceId: that.$store.state.selectedBluetooth.deviceId,
							success(serviceResponse) {
								console.log('设备所有service数组为：', serviceResponse.services)
								uni.getBLEDeviceCharacteristics({
									deviceId: that.$store.state.selectedBluetooth.deviceId,
									serviceId: that.$store.state.mainServiceId,
									success(ress) {
										console.log('设备特诊数组为：', ress
											.characteristics)
									}
								})
								// //读取基本信息
								uni.onBLECharacteristicValueChange(function(res) {
									let ab = res.value
									console.log('读取到原始数据为：', res.value)
									console.log('读取到的数据对象：', JSON.parse(arrayBuffer2String(res
										.value)))
									that.$store.commit('setReadedObject', JSON.parse(
										arrayBuffer2String(res.value)))
									console.log('存储的数据：', that.$store.state.readedObject)
								})
								uni.readBLECharacteristicValue({
									deviceId: that.$store.state.selectedBluetooth.deviceId,
									serviceId: that.$store.state.mainServiceId,
									characteristicId: that.$store.state.readCharacteristicId,
									success(res) {

									}
								})
							}
						})
					}
				})
				//监听连接状态然后处理
				uni.onBLEConnectionStateChange(function(res) {
					that.$store.commit('setBleConnected', res.connected)
					console.log('蓝牙连接状态', res)
					if (!res.connected) {
						that.$u.toast('蓝牙连接已断开');
					}
				})
			},
			disConnectBle() {
				var that = this
				uni.closeBLEConnection({
					deviceId: that.$store.state.selectedBluetooth.deviceId,
					success(res) {
						console.log(res)
						that.$store.commit('setBleConnected', false)
					}
				})
			},
			modeSelect(e) {
				this.selectedItem = e[0]
				this.popupShow = false
			},
			saveTemptureMode() {
				this.$refs.uForm1.validate(valid => {
					var that = this
					if (valid) {
						uni.showLoading({
							title: '数据发送中'
						})
						let jsonString = String
							.raw`{"slogan":"${ch2Unicdoe(this.temptureObject.slogan)}","ssid":"${this.temptureObject.ssid}","password":"${this.temptureObject.password}","appId":"${this.temptureObject.appId}","secret":"${this.temptureObject.secret}","type":1}`
						console.log('原始数据', jsonString)
						let times = Math.floor(jsonString.length / 20)
						let index = 0
						let ii2 = setInterval(function() {
							if (index > times) {
								clearInterval(ii2)
							} else {
								let str = jsonString.substring(index * 20, index * 20 + 20)
								console.log('第' + index + '次', str)
								uni.writeBLECharacteristicValue({
									deviceId: that.$store.state.selectedBluetooth.deviceId,
									serviceId: that.$store.state.mainServiceId,
									characteristicId: that.$store.state.configCharacteristicId,
									value: String2Ab(str),
									success(res) {
										console.log('成功发送次数', index)
										if (index == times) {
											uni.hideLoading()
										}
									},
									fail(res) {
										console.log('下发错误', res)
									}
								})
								index++
							}

						}, 400)

					} else {
						console.log('验证失败');
					}
				})
			},
			saveFansMode() {
				var that = this
				this.$refs.uForm.validate(valid => {
					if (valid) {
						uni.showLoading({
							title: '数据发送中'
						})
						let jsonString = String
							.raw`{"ssid":"${this.fansObject.ssid}","password":"${this.fansObject.password}","vmId":"${this.fansObject.vmId}","appId":"${this.fansObject.appId}","token":"${this.fansObject.token}","brand":"${ch2Unicdoe(this.fansObject.brand)}","type":2}`

						console.log('完整原始命令', jsonString)
						let times = Math.floor(jsonString.length / 20)
						let index = 0
						let ii = setInterval(function() {
							if (index > times) {
								clearInterval(ii)
							} else {
								let str = jsonString.substring(index * 20, index * 20 + 20)
								console.log('第' + index + '次', str)
								uni.writeBLECharacteristicValue({
									deviceId: that.$store.state.selectedBluetooth.deviceId,
									serviceId: that.$store.state.mainServiceId,
									characteristicId: that.$store.state.configCharacteristicId,
									value: String2Ab(str),
									success(res) {
										console.log('成功发送次数', index)
										if (index == times) {
											uni.hideLoading()
										}
									},
									fail(res) {
										console.log('下发错误', res)
									}
								})
								index++
							}

						}, 400)

					} else {
						console.log('验证失败');
					}
				})
			},
			rebootConfirm() {
				var that = this
				const buffer = new ArrayBuffer(1)
				const dataView = new DataView(buffer)
				dataView.setUint8(0, 0x01)
				//下发命令系统重启后接收不到任何回调
				uni.writeBLECharacteristicValue({
					deviceId: that.$store.state.selectedBluetooth.deviceId,
					serviceId: that.$store.state.mainServiceId,
					characteristicId: that.$store.state.rebootCharacteristicId,
					value: buffer,
					success(res) {}
				})
				that.$store.commit('setBleConnected', false)

			},
			clearConfirm() {
				var that = this
				const buffer = new ArrayBuffer(1)
				const dataView = new DataView(buffer)
				dataView.setUint8(0, 0x02)
				//下发命令系统重启后接收不到任何回调
				uni.writeBLECharacteristicValue({
					deviceId: that.$store.state.selectedBluetooth.deviceId,
					serviceId: that.$store.state.mainServiceId,
					characteristicId: that.$store.state.rebootCharacteristicId,
					value: buffer,
					success(res) {}
				})
			},
			sumbit(res) {
				console.log('sumbit', res)
			}
		}
	}
</script>

<style lang="scss">
	.canvas-box {
		display: flex;
		justify-content: center;
	}

	.action-box {
		width: 60rpx;
		height: 60rpx;
		border-radius: 30rpx;
		justify-content: center;
		align-items: center;
		display: flex;
		position: absolute;
		top: 3vh;
		right: 3vw;
		background-color: #007AFF;
	}

	.basic-info-box {
		display: flex;
		justify-content: space-between;
		padding: 20rpx 40rpx;


		.inner-info-box {
			display: flex;
			flex-direction: column;
			font-size: 20rpx;
			align-items: center;
		}

	}

	.more-action-box {
		padding: 10rpx 20rpx;

		.u-section {
			margin-bottom: 30rpx;
		}
	}


	.close-button-box {
		width: 100%;
		position: absolute;
		bottom: 5vh;
		display: flex;
		justify-content: space-between;
		padding: 0 20rpx;
	}




	.logo-box {
		margin-top: 20rpx;
		display: flex;
		justify-content: center;

		image {
			border: solid 2rpx #000000;
		}
	}

	.form-box {
		margin-top: 40rpx;
		padding: 0 60rpx;

		.setting-message {
			font-size: 25rpx;
			color: #C8C9CC;
		}
	}
</style>
