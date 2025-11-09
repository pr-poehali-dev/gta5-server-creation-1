const vehicles = [];
const playerData = new Map();

mp.events.add('playerJoin', (player) => {
    console.log(`${player.name} подключился к серверу!`);
    
    playerData.set(player.id, {
        name: player.name,
        money: 5000,
        bank: 10000,
        job: null,
        faction: null,
        level: 1,
        lastPosition: { x: -425.517, y: 1123.620, z: 325.8544 }
    });
    
    player.spawn(new mp.Vector3(-425.517, 1123.620, 325.8544));
    player.model = mp.joaat("mp_m_freemode_01");
    player.health = 100;
    player.armour = 0;
    
    player.outputChatBox("!{#00FF00}Добро пожаловать на сервер!");
    player.outputChatBox(`!{#FFD700}Ваш баланс: ${playerData.get(player.id).money}₽`);
    player.outputChatBox("!{#87CEEB}Используйте /help для списка команд");
    
    player.call('client:playerConnected', [playerData.get(player.id)]);
});

mp.events.add('playerQuit', (player, exitType, reason) => {
    console.log(`${player.name} отключился от сервера. Причина: ${reason}`);
    
    if (playerData.has(player.id)) {
        playerData.delete(player.id);
    }
});

mp.events.add('playerDeath', (player, reason, killer) => {
    console.log(`${player.name} погиб`);
    
    player.spawn(new mp.Vector3(-425.517, 1123.620, 325.8544));
    player.health = 100;
    
    const data = playerData.get(player.id);
    if (data) {
        data.money = Math.max(0, data.money - 500);
        player.outputChatBox(`!{#FF0000}Вы потеряли 500₽ после смерти. Баланс: ${data.money}₽`);
    }
});

mp.events.add('playerChat', (player, text) => {
    if (text.startsWith('/')) {
        return;
    }
    
    mp.players.broadcast(`${player.name}: ${text}`);
});

mp.events.addCommand('help', (player) => {
    player.outputChatBox("!{#FFD700}=== Список команд ===");
    player.outputChatBox("!{#FFFFFF}/help - Показать список команд");
    player.outputChatBox("!{#FFFFFF}/stats - Показать вашу статистику");
    player.outputChatBox("!{#FFFFFF}/car [название] - Создать автомобиль");
    player.outputChatBox("!{#FFFFFF}/dcar - Удалить ближайший автомобиль");
    player.outputChatBox("!{#FFFFFF}/tp [x] [y] [z] - Телепортироваться");
    player.outputChatBox("!{#FFFFFF}/heal - Восстановить здоровье (100₽)");
    player.outputChatBox("!{#FFFFFF}/armour - Получить броню (500₽)");
    player.outputChatBox("!{#FFFFFF}/givemoney [id] [сумма] - Передать деньги");
    player.outputChatBox("!{#FFFFFF}/job - Список доступных работ");
    player.outputChatBox("!{#FFFFFF}/startwork - Начать работу");
    player.outputChatBox("!{#FFFFFF}/stopwork - Закончить работу");
});

mp.events.addCommand('stats', (player) => {
    const data = playerData.get(player.id);
    if (!data) return;
    
    player.outputChatBox("!{#FFD700}=== Ваша статистика ===");
    player.outputChatBox(`!{#FFFFFF}Имя: ${data.name}`);
    player.outputChatBox(`!{#FFFFFF}Уровень: ${data.level}`);
    player.outputChatBox(`!{#00FF00}Наличные: ${data.money}₽`);
    player.outputChatBox(`!{#1E90FF}Банк: ${data.bank}₽`);
    player.outputChatBox(`!{#FFFFFF}Работа: ${data.job || 'Безработный'}`);
    player.outputChatBox(`!{#FFFFFF}Фракция: ${data.faction || 'Отсутствует'}`);
});

mp.events.addCommand('car', (player, fullText, model = 'granger') => {
    const position = player.position;
    const heading = player.heading;
    
    const veh = mp.vehicles.new(mp.joaat(model), 
        new mp.Vector3(position.x + 3, position.y, position.z),
        {
            heading: heading,
            color: [[255, 255, 255], [255, 255, 255]],
            engine: true,
            locked: false
        }
    );
    
    vehicles.push(veh);
    player.outputChatBox(`!{#00FF00}Автомобиль ${model} создан!`);
});

mp.events.addCommand('dcar', (player) => {
    const nearbyVehicles = mp.vehicles.toArray().filter(v => 
        v.position.subtract(player.position).length() < 5.0
    );
    
    if (nearbyVehicles.length > 0) {
        nearbyVehicles[0].destroy();
        player.outputChatBox("!{#00FF00}Автомобиль удален!");
    } else {
        player.outputChatBox("!{#FF0000}Рядом нет автомобилей!");
    }
});

mp.events.addCommand('tp', (player, fullText, x, y, z) => {
    if (!x || !y || !z) {
        player.outputChatBox("!{#FF0000}Использование: /tp [x] [y] [z]");
        return;
    }
    
    player.position = new mp.Vector3(parseFloat(x), parseFloat(y), parseFloat(z));
    player.outputChatBox(`!{#00FF00}Вы телепортировались!`);
});

mp.events.addCommand('heal', (player) => {
    const data = playerData.get(player.id);
    if (!data) return;
    
    if (data.money < 100) {
        player.outputChatBox("!{#FF0000}Недостаточно денег! Нужно: 100₽");
        return;
    }
    
    data.money -= 100;
    player.health = 100;
    player.outputChatBox("!{#00FF00}Вы восстановили здоровье за 100₽");
});

mp.events.addCommand('armour', (player) => {
    const data = playerData.get(player.id);
    if (!data) return;
    
    if (data.money < 500) {
        player.outputChatBox("!{#FF0000}Недостаточно денег! Нужно: 500₽");
        return;
    }
    
    data.money -= 500;
    player.armour = 100;
    player.outputChatBox("!{#00FF00}Вы получили броню за 500₽");
});

mp.events.addCommand('givemoney', (player, fullText, targetId, amount) => {
    if (!targetId || !amount) {
        player.outputChatBox("!{#FF0000}Использование: /givemoney [id] [сумма]");
        return;
    }
    
    const data = playerData.get(player.id);
    const target = mp.players.at(parseInt(targetId));
    const targetData = playerData.get(parseInt(targetId));
    
    if (!target || !targetData) {
        player.outputChatBox("!{#FF0000}Игрок не найден!");
        return;
    }
    
    const sum = parseInt(amount);
    if (sum <= 0 || data.money < sum) {
        player.outputChatBox("!{#FF0000}Недостаточно денег!");
        return;
    }
    
    data.money -= sum;
    targetData.money += sum;
    
    player.outputChatBox(`!{#00FF00}Вы передали ${sum}₽ игроку ${target.name}`);
    target.outputChatBox(`!{#00FF00}Вы получили ${sum}₽ от игрока ${player.name}`);
});

const jobs = [
    { name: 'Водитель автобуса', salary: 35000, level: 1 },
    { name: 'Таксист', salary: 40000, level: 1 },
    { name: 'Дальнобойщик', salary: 60000, level: 3 },
    { name: 'Инкассатор', salary: 75000, level: 5 }
];

mp.events.addCommand('job', (player) => {
    player.outputChatBox("!{#FFD700}=== Доступные работы ===");
    jobs.forEach((job, idx) => {
        player.outputChatBox(`!{#FFFFFF}${idx + 1}. ${job.name} - ${job.salary}₽/час (Уровень ${job.level})`);
    });
    player.outputChatBox("!{#87CEEB}Используйте /startwork [номер] чтобы начать работу");
});

mp.events.addCommand('startwork', (player, fullText, jobId) => {
    const data = playerData.get(player.id);
    if (!data) return;
    
    if (data.job) {
        player.outputChatBox("!{#FF0000}Вы уже работаете! Используйте /stopwork");
        return;
    }
    
    const jobIndex = parseInt(jobId) - 1;
    if (jobIndex < 0 || jobIndex >= jobs.length) {
        player.outputChatBox("!{#FF0000}Неверный номер работы!");
        return;
    }
    
    const job = jobs[jobIndex];
    if (data.level < job.level) {
        player.outputChatBox(`!{#FF0000}Требуется ${job.level} уровень!`);
        return;
    }
    
    data.job = job.name;
    player.outputChatBox(`!{#00FF00}Вы устроились на работу: ${job.name}`);
    player.outputChatBox(`!{#FFD700}Зарплата: ${job.salary}₽/час`);
});

mp.events.addCommand('stopwork', (player) => {
    const data = playerData.get(player.id);
    if (!data) return;
    
    if (!data.job) {
        player.outputChatBox("!{#FF0000}Вы не работаете!");
        return;
    }
    
    const oldJob = data.job;
    data.job = null;
    player.outputChatBox(`!{#FFD700}Вы уволились с работы: ${oldJob}`);
});

setInterval(() => {
    playerData.forEach((data, playerId) => {
        if (data.job) {
            const job = jobs.find(j => j.name === data.job);
            if (job) {
                const salary = Math.floor(job.salary / 60);
                data.money += salary;
                
                const player = mp.players.at(playerId);
                if (player) {
                    player.outputChatBox(`!{#00FF00}[Зарплата] +${salary}₽`);
                }
            }
        }
    });
}, 60000);

console.log("=================================");
console.log("GTA 5 RAGE:MP Сервер запущен!");
console.log("Версия: Node.js (Рекомендуется Node.js 16.x)");
console.log("=================================");
