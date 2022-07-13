/*
	Виртуальное устройство для отображения доступности ресурсов в локальной сети и интернете.
	Параметры: отображаемое имя, ip-адрес или домен, период опроса в формате cron.
*/

defineVirtualDevice('ping', {
	title: 'Проверка доступности',
	cells: {}
});

function addChecker(name, address, period) {
	getDevice('ping').addControl(name, {type: 'switch', value: false, readonly: true});

	defineRule({when: cron(period), then: function () {ping(name, address)}});

	ping(name, address);
}

function ping(entry, address) {
	runShellCommand('ping -c 1 -W 1 ' + address + '> /dev/null; echo $?', {
		captureOutput: true,
		exitCallback: function (code, output) {
			dev['ping'][entry] = (output == 0);
		}
	});
};

// Составление списка опрашиваемых ресурсов
addChecker('Repeater', '192.168.1.20', '@every 60s');
addChecker('Global', '8.8.8.8', '@every 60s');
addChecker('Site', 'ya.ru', '@every 60s');