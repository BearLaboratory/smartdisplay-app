<script>
	export default {
		onLaunch: function() {
			var that = this
			//检测手机蓝牙是否开启，未开启提示蓝牙未开启
			uni.openBluetoothAdapter({
				success(res) {
					that.$store.commit('setBuletoothStatus', true)
				},
				fail(e) {
					that.$store.commit('setBuletoothStatus', false)
					that.$u.toast('请开启手机蓝牙');
				}
			})
			//监听蓝牙适配器状态
			uni.onBluetoothAdapterStateChange(function(res) {
				console.log('适配器状态发生改变', res.available)
				if (!res.available) {
					that.$u.toast('使用期间请保持蓝牙开启');
				}


				// if (res.available) {
				// 	that.$store.commit('setBuletoothStatus', true)
				// } else {
				// 	if (that.$store.state.bluetoothStatus && !res.available) {
				// 		that.$store.commit('setBuletoothStatus', res.available)
				// 		that.$u.toast('使用期间请保持蓝牙开启');
				// 	}
				// }

			})

		},
		onShow: function() {
			console.log('页面显示')
		},
		onHide: function() {
			console.log('页面隐藏')
		}
	}
</script>

<style lang="scss">
	@import "uview-ui/index.scss";
</style>
