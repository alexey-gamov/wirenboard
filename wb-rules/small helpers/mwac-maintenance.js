/*
	Правило для автоматического проворота кранов с электроприводом для предотвращения закисания.
	Не работает если перекрытие уже установлено вручную, либо имеется протечка (авария).

	Срабатывает каждое последнее воскресение месяца пока все спят (05:00).
	Настройки: номер mwac модуля (module), задержка в секундах (holdup).
*/

defineRule('mwac-maintenance', {
	when: cron('0 5 * * 0'),
	then: function() {
		var module = 'wb-mwac_44';
		var holdup = 22;

		var today = new Date();
		var target = new Date(today.getFullYear(), today.getMonth() + 1, 0);

		today.setHours(0, 0, 0, 0);
		target.setDate(target.getDate() - target.getDay());

		if (!dev[module]['Alarm'] && today == target)
		{
			var tick = 0;

			var faucet1 = dev[module]['K1'];
			var faucet2 = dev[module]['K2'];

			var job = setInterval(function () {
				tick = tick + 1;

				if (tick <= holdup) {
					dev[module]['K1'] = true;
					dev[module]['K2'] = true;
				}

				if (tick > holdup) {
					dev[module]['K1'] = faucet1;
					dev[module]['K2'] = faucet2;
				}

				if (tick == holdup * 2) {
					clearInterval(job);
				}
			}, 1000);
		}
	}
});