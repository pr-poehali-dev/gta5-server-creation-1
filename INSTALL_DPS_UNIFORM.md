# Установка формы ДПС на RAGE:MP сервер

## Где скачать готовые модели формы ДПС

### Рекомендуемые источники:
1. **GTA5-Mods.com**
   - Раздел: Clothing → Emergency
   - Поиск: "Russian Police", "DPS uniform", "ГИБДД"
   
2. **Libertycity.ru**
   - Моды → Скины → Полиция
   
3. **VK группы:**
   - "GTA 5 моды"
   - "RAGE:MP моды"

## Формат файлов

Форма для GTA 5 состоит из:
- `.ydd` - геометрия модели (Drawable)
- `.ytd` - текстуры (Texture Dictionary)
- `stream.ini` или `.xml` - конфигурация (для FiveM/RAGE:MP)

## Установка на RAGE:MP сервер

### Шаг 1: Подготовка файлов

Скачанный мод обычно содержит:
```
dps_uniform/
├── mp_m_freemode_01_mp_m_dps/     # Мужская форма
│   ├── upper_000.ydd               # Верх одежды
│   ├── upper_000.ytd               # Текстуры верха
│   ├── lower_000.ydd               # Низ одежды
│   └── lower_000.ytd               # Текстуры низа
└── mp_f_freemode_01_mp_f_dps/     # Женская форма
    └── ...
```

### Шаг 2: Размещение файлов

```
ragemp-server/
├── client_packages/
│   └── game_resources/
│       └── dlcpacks/
│           └── dps_uniform/
│               ├── mp_m_freemode_01_mp_m_dps/
│               └── mp_f_freemode_01_mp_f_dps/
```

### Шаг 3: Код для применения формы

Добавьте в `packages/basic-gamemode/index.js`:

```javascript
// Компоненты формы ДПС (мужская)
const DPS_UNIFORM_MALE = {
    // Верх (куртка/рубашка)
    tops: { drawable: 0, texture: 0, palette: 0 },
    // Низ (брюки)
    legs: { drawable: 0, texture: 0, palette: 0 },
    // Обувь
    shoes: { drawable: 24, texture: 0, palette: 0 },
    // Головной убор (фуражка)
    hat: { drawable: 58, texture: 0, palette: 0 },
    // Аксессуары (значок, рация)
    accessories: { drawable: 0, texture: 0, palette: 0 }
};

// Команда для получения формы ДПС
mp.events.addCommand('dpsuniform', (player) => {
    const data = playerData.get(player.id);
    if (!data) return;
    
    // Проверка фракции
    if (data.faction !== 'ДПС') {
        player.outputChatBox("!{#FF0000}Вы не состоите в ДПС!");
        return;
    }
    
    // Применяем форму
    player.setClothes(
        11, // Торс (куртка)
        DPS_UNIFORM_MALE.tops.drawable,
        DPS_UNIFORM_MALE.tops.texture,
        0
    );
    
    player.setClothes(
        4, // Ноги (брюки)
        DPS_UNIFORM_MALE.legs.drawable,
        DPS_UNIFORM_MALE.legs.texture,
        0
    );
    
    player.setClothes(
        6, // Обувь
        DPS_UNIFORM_MALE.shoes.drawable,
        DPS_UNIFORM_MALE.shoes.texture,
        0
    );
    
    // Головной убор (можно снять/надеть)
    player.setProp(
        0, // Голова
        DPS_UNIFORM_MALE.hat.drawable,
        DPS_UNIFORM_MALE.hat.texture
    );
    
    player.outputChatBox("!{#00FF00}Вы надели форму ДПС!");
});

// Команда для снятия формы
mp.events.addCommand('removeuniform', (player) => {
    player.setClothes(11, 15, 0, 0); // Базовый торс
    player.setClothes(4, 21, 0, 0);  // Базовые штаны
    player.setClothes(6, 1, 0, 0);   // Базовая обувь
    player.clearProp(0);              // Снять головной убор
    
    player.outputChatBox("!{#FFD700}Вы сняли форму");
});
```

### Шаг 4: Система фракции ДПС

Добавьте в `packages/basic-gamemode/index.js`:

```javascript
// Команда для вступления в ДПС (для теста)
mp.events.addCommand('joindps', (player) => {
    const data = playerData.get(player.id);
    if (!data) return;
    
    if (data.faction) {
        player.outputChatBox(`!{#FF0000}Вы уже состоите в фракции: ${data.faction}`);
        return;
    }
    
    data.faction = 'ДПС';
    data.rank = 'Рядовой';
    player.outputChatBox("!{#00FF00}Вы вступили в ГИБДД ДПС!");
    player.outputChatBox("!{#87CEEB}Используйте /dpsuniform чтобы надеть форму");
});

// Список сотрудников ДПС
mp.events.addCommand('dpslist', (player) => {
    player.outputChatBox("!{#1E90FF}=== Сотрудники ДПС онлайн ===");
    
    let count = 0;
    playerData.forEach((data, playerId) => {
        if (data.faction === 'ДПС') {
            const targetPlayer = mp.players.at(playerId);
            if (targetPlayer) {
                player.outputChatBox(`!{#FFFFFF}[${playerId}] ${data.name} - ${data.rank || 'Рядовой'}`);
                count++;
            }
        }
    });
    
    if (count === 0) {
        player.outputChatBox("!{#FF0000}Нет сотрудников ДПС онлайн");
    }
});
```

## Альтернативный вариант: Использование EUP (Emergency Uniform Pack)

EUP - популярный пак с формами экстренных служб для FiveM/RAGE:MP.

### Установка EUP:

1. Скачайте EUP с GitHub: https://github.com/FiveM-Mods/EUP-UI
2. Поместите в `client_packages/game_resources/`
3. Добавьте в `conf.json`:
```json
{
  "resources": [
    "eup-stream",
    "eup-ui"
  ]
}
```

### Использование EUP в коде:

```javascript
mp.events.addCommand('eupmenu', (player) => {
    // Открыть меню выбора формы
    player.call('client:openEUPMenu');
});
```

## ID компонентов формы (стандартные GTA 5)

### Для создания базовой формы ДПС без модов:

```javascript
// Синяя рубашка + погоны + брюки (похоже на ДПС)
const BASIC_DPS_UNIFORM = {
    // Мужчина
    male: {
        tops: { drawable: 55, texture: 0 },    // Полицейская рубашка
        legs: { drawable: 31, texture: 0 },    // Синие брюки
        shoes: { drawable: 25, texture: 0 },   // Черные ботинки
        hat: { drawable: 58, texture: 2 },     // Фуражка
        accessories: { drawable: 127, texture: 0 } // Рация
    },
    // Женщина
    female: {
        tops: { drawable: 48, texture: 0 },
        legs: { drawable: 34, texture: 0 },
        shoes: { drawable: 25, texture: 0 },
        hat: { drawable: 58, texture: 2 }
    }
};
```

## Команды для игроков

После установки доступны:
- `/joindps` - Вступить в ДПС (тестовая команда)
- `/dpsuniform` - Надеть форму ДПС
- `/removeuniform` - Снять форму
- `/dpslist` - Список сотрудников ДПС онлайн
- `/eupmenu` - Открыть меню выбора формы (если установлен EUP)

## Полезные ссылки

- **GTA 5 Mods:** https://www.gta5-mods.com/player/russian-police-uniform
- **EUP для RAGE:MP:** https://github.com/FiveM-Mods/EUP-UI
- **Список ID одежды GTA 5:** https://wiki.rage.mp/index.php?title=Clothes
- **Документация RAGE:MP:** https://wiki.rage.mp/

## Примечание

Для работы кастомных моделей одежды все игроки должны:
1. Иметь установленные файлы модов в папке `client_packages/game_resources/`
2. Сервер должен автоматически отправлять файлы при подключении

---

**Важно:** Модели одежды защищены авторскими правами. Используйте только моды с открытой лицензией или создавайте собственные.
