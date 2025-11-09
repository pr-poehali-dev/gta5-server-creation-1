let playerData = null;

mp.events.add('client:playerConnected', (data) => {
    playerData = data;
    mp.gui.chat.push(`Добро пожаловать, ${data.name}!`);
    mp.gui.chat.push(`Баланс: ${data.money}₽ | Банк: ${data.bank}₽`);
});

mp.keys.bind(0x74, true, () => {
    if (playerData) {
        mp.gui.chat.push(`=== Статистика ===`);
        mp.gui.chat.push(`Уровень: ${playerData.level} | Работа: ${playerData.job || 'Нет'}`);
        mp.gui.chat.push(`Наличные: ${playerData.money}₽ | Банк: ${playerData.bank}₽`);
    }
});

mp.events.add('render', () => {
    if (playerData) {
        mp.game.graphics.drawText(
            `Наличные: ${playerData.money}₽`, 
            [0.98, 0.02], 
            {
                font: 4,
                color: [255, 255, 255, 255],
                scale: [0.5, 0.5],
                outline: true
            }
        );
    }
});

mp.game.streaming.requestIpl("hei_carrier");
mp.game.streaming.requestIpl("hei_carrier_DistantLights");
mp.game.streaming.requestIpl("hei_Carrier_int1");
mp.game.streaming.requestIpl("hei_Carrier_int2");
mp.game.streaming.requestIpl("hei_Carrier_int3");
mp.game.streaming.requestIpl("hei_Carrier_int4");
mp.game.streaming.requestIpl("hei_Carrier_int5");
mp.game.streaming.requestIpl("hei_Carrier_int6");

console.log("Клиентская часть загружена!");
