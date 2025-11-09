import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';

const Index = () => {
  const [serverOnline, setServerOnline] = useState(true);
  const [activePlayers] = useState(247);
  const [maxPlayers] = useState(500);

  const stats = [
    { label: 'Онлайн игроков', value: `${activePlayers}/${maxPlayers}`, icon: 'Users', color: 'text-emerald-400' },
    { label: 'Баланс казны', value: '12.4M ₽', icon: 'Wallet', color: 'text-blue-400' },
    { label: 'Транспорт', value: '1,234', icon: 'Car', color: 'text-purple-400' },
    { label: 'Недвижимость', value: '456', icon: 'Home', color: 'text-orange-400' },
  ];

  const factions = [
    { name: 'ГИБДД ДПС', members: 45, icon: 'Shield', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
    { name: 'Армия РФ', members: 38, icon: 'Swords', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
    { name: 'ВАИ', members: 32, icon: 'BadgeCheck', color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' },
    { name: 'Полиция', members: 52, icon: 'ShieldCheck', color: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30' },
    { name: 'Банды', members: 80, icon: 'Skull', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
  ];

  const vehicles = [
    { name: 'LADA Granta', count: 89, type: 'Гражданский', price: '450K ₽' },
    { name: 'УАЗ Патриот ДПС', count: 23, type: 'Служебный', price: '890K ₽' },
    { name: 'ГАЗель Next', count: 45, type: 'Коммерческий', price: '1.2M ₽' },
    { name: 'КАМАЗ 5490', count: 12, type: 'Грузовой', price: '2.8M ₽' },
  ];

  const recentTransactions = [
    { player: 'Иван_Петров', amount: '+125K ₽', type: 'Зарплата ДПС', time: '2 мин назад' },
    { player: 'Сергей_Иванов', amount: '-450K ₽', type: 'Покупка дома', time: '5 мин назад' },
    { player: 'Дмитрий_Соколов', amount: '+89K ₽', type: 'Продажа авто', time: '12 мин назад' },
    { player: 'Алексей_Морозов', amount: '-15K ₽', type: 'Штраф', time: '18 мин назад' },
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">GTA 5 RAGE:MP Сервер</h1>
            <p className="text-muted-foreground">Панель управления и мониторинг</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant={serverOnline ? 'default' : 'destructive'} className="px-4 py-2 text-sm">
              <Icon name="Radio" size={16} className="mr-2" />
              {serverOnline ? 'Сервер онлайн' : 'Сервер оффлайн'}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, idx) => (
            <Card key={idx} className="border-border hover:border-primary/50 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  </div>
                  <Icon name={stat.icon as any} size={32} className={stat.color} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="economy" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="economy">Экономика</TabsTrigger>
            <TabsTrigger value="vehicles">Транспорт</TabsTrigger>
            <TabsTrigger value="factions">Фракции</TabsTrigger>
            <TabsTrigger value="jobs">Работы</TabsTrigger>
          </TabsList>

          <TabsContent value="economy" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="TrendingUp" size={24} className="text-primary" />
                  Последние транзакции
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentTransactions.map((tx, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-card/50 border border-border hover:border-primary/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <Icon name="User" size={20} className="text-muted-foreground" />
                        <div>
                          <p className="font-medium text-foreground">{tx.player}</p>
                          <p className="text-sm text-muted-foreground">{tx.type}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${tx.amount.startsWith('+') ? 'text-emerald-400' : 'text-red-400'}`}>
                          {tx.amount}
                        </p>
                        <p className="text-xs text-muted-foreground">{tx.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="vehicles" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Car" size={24} className="text-primary" />
                  Русские автомобили в парке
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {vehicles.map((vehicle, idx) => (
                    <div key={idx} className="p-4 rounded-lg bg-card/50 border border-border hover:border-primary/50 transition-all duration-300">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-bold text-lg text-foreground">{vehicle.name}</h3>
                          <Badge variant="secondary" className="mt-1">{vehicle.type}</Badge>
                        </div>
                        <Icon name="Car" size={24} className="text-primary" />
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">В наличии: <span className="text-foreground font-medium">{vehicle.count} шт</span></span>
                        <span className="text-primary font-bold">{vehicle.price}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="factions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Users" size={24} className="text-primary" />
                  Фракции сервера
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {factions.map((faction, idx) => (
                    <div key={idx} className={`p-4 rounded-lg border ${faction.color} hover:scale-105 transition-transform duration-300`}>
                      <div className="flex items-center gap-3 mb-3">
                        <Icon name={faction.icon as any} size={28} />
                        <h3 className="font-bold text-lg">{faction.name}</h3>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm opacity-80">Участников</span>
                        <Badge variant="outline" className="border-current">{faction.members}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="jobs" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Briefcase" size={24} className="text-primary" />
                  Доступные работы
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { name: 'Водитель автобуса', salary: '25K - 40K ₽/час', icon: 'Bus', level: 'Новичок' },
                    { name: 'Таксист', salary: '30K - 50K ₽/час', icon: 'Taxi', level: 'Новичок' },
                    { name: 'Дальнобойщик', salary: '45K - 80K ₽/час', icon: 'Truck', level: 'Опытный' },
                    { name: 'Инкассатор', salary: '55K - 90K ₽/час', icon: 'Banknote', level: 'Опытный' },
                  ].map((job, idx) => (
                    <div key={idx} className="p-4 rounded-lg bg-card/50 border border-border hover:border-primary/50 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-primary/20">
                          <Icon name={job.icon as any} size={24} className="text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-foreground mb-1">{job.name}</h3>
                          <p className="text-sm text-emerald-400 mb-2">{job.salary}</p>
                          <Badge variant="secondary" className="text-xs">{job.level}</Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
