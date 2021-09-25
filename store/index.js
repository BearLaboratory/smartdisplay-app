import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		//蓝牙连接状态
		bleConnected: false,
		//手机蓝牙打开状态
		bluetoothStatus: false,
		selectedBluetooth: {},
		mainServiceId: '71db3107-6be5-4c0b-ad8e-731df7069e62',
		readCharacteristicId: '8b3aed0e-a5a0-4e7f-9965-d0f3d26a1b36',
		rebootCharacteristicId: '2bbd7b92-5bc8-441c-a69a-5764d4f3d1a9',
		configCharacteristicId: '2bbd7b92-5bc8-441c-a69a-5764d4f3d1a8',
		readedObject: {}
	},
	mutations: {
		setBleConnected(state, status) {
			state.bleConnected = status
		},
		setBuletoothStatus(state, status) {
			state.bluetoothStatus = status
		},
		setselectedBluetooth(state, bluetooth) {
			state.selectedBluetooth = bluetooth
		},
		setReadedObject(state, value) {
			state.readedObject = value
		}
	}
})

export default store
