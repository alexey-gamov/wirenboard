/*
	Реализации листания выходов моностабильным выключателем.
	По одной кнопке управляются две лампочки (@amkishko).

	1 нажатие - включается первая
	2 нажатие - выключается первая и включается вторая
	3 нажатие - включаются обе вместе
	4 нажатие - обе лампы выключаеюся
*/

defineRule('bulbs-wd14', {
	whenChanged: 'wb-gpio/EXT1_DR14',
	then: function() {
		defineAlias('one', 'wb-mr6c_85/K1');
		defineAlias('two', 'wb-mr6c_85/K2');

		if (!one && !two)
		{
			one = true;
		}
		else if (one && !two)
		{
			one = false;
			two = true;
		}
		else if (!one && two)
		{
			one = true;
		}
		else
		{
			one = false;
			two = false;
		}
	}
});

/*
	Реализация для ситуации, когда лампы подключены на одном модуле,
	а управляем только 2-й лампой на основе состояния 1-й :)
*/

defineRule('bulbs-mr6c', {
	whenChanged: 'wb-mr6c_85/K1',
	then: function(exec, device) {
		if (!exec) {
			defineAlias('lamp', device + '/K2');
			lamp = !lamp;
		}
	}
});