/*
	Инициализация правил для мастер-выключателей (есть автопоиск доступных каналов в модуле)
	Параметры: уникальное имя, триггер(ы), массив модулей и каналов, действие (опционально)

	Что касается последнего параметра (действие):

	- оставить пустым для работы с звонковыми выключателями (WD14)
	- если true, то будет дублировать состояние триггера (1/0)
	- если false, то будет выключать при любом состоянии
*/

function createMasterSwitch(name, switches, modules, action) {
	defineRule('master-switch-' + name, {
		whenChanged: switches,
		then: function(exec) {
			if (exec || typeof action !== 'undefined') {
				modules.forEach(function (id) {
					var device = id.indexOf('/') == -1;
					var object = device ? getDevice(id).controlsList() : [getControl(id)];

					object.forEach(function(control) {
						if (control.getType() == 'switch' && !control.getReadonly()) {
							var name = device ? id + '/' + control.getId() : id;
							dev[name] = action ? exec : false;
						}
					});
				});
			}
		}
	});
}

// Правило для тестирования всех каналов реле. Кнопка нажата - все включено, когда отпускается - все отключено
createMasterSwitch('relays-test', 'wb-gpio/EXT1_DR9', ['wb-mr6c_18', 'wb-mr6c_34', 'wb-mr6c_35', 'wb-mr6c_37', 'wb-mr6c_204'], true);

// Правило для отлючения света в компнате. 2 физ. кнопки (триггеры), 3 канала реле для отключения в любом состоянии
createMasterSwitch('main-room', ['wb-gpio/EXT1_DR13', 'wb-gpio/EXT1_DR14'], ['wb-mr6c_18/K1', 'wb-mr6c_18/K3', 'wb-mr6c_18/K6']);