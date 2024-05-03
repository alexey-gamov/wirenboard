/*
	Инициализация правила для управления сервоприводами (заслонками) по заданным уровням через DAC модули (WB-MAO4 или WBIO-AO-10V-8)
	Параметры: имя, массив кнопок (неограничен), DAC канал управления, режимы в процентах, тип триггеров (звонок/фикс = true/false)
*/

function servo_level(name, switches, output, levels, clicker) {
	defineRule('servo-over-dac-' + name, {
		whenChanged: switches,
		then: function(click) {
			if (click && clicker) return;

			var percent = 0;

			for (var i = switches.length - 1; i >= 0; i--) {
				if (dev[switches[i]])
				{
					percent = percent + levels[i];
					break;
				}
			}

			dev[output] = (10000 / 100 * percent);
		}
	});
}

// Создание правила для управления вытяжкой на кухне (3 фикс кнопки/скорости: 30-60-100%), работает по старшей кнопке в списке
servo_level('kitchen', ['wb-gpio3/EXT3_IN1', 'wb-gpio3/EXT3_IN2', 'wb-gpio3/EXT3_IN3'], 'wb-mao4_7/Channel 1', [30, 60, 100]);

// Создание правила для переключения режимов вытяжки (3 звонковые кнопки), работает по последней нажатой (уровень 0 обязателен)
servo_level('bathroom', ['wb-gpio3/EXT3_IN4', 'wb-gpio3/EXT3_IN5', 'wb-gpio3/EXT3_IN6'], 'wb-mao4_7/Channel 2', [0, 50, 100], true);