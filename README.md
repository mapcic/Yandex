# Yandex

1. *TicketApi* создает *TicketForm* и *Tickets*;
2. *TicketForm* создает *Ticket* и добавляет их в *Tickets*; Данные для заполнения формы берутся из *Vehicle\**
3. *TicketsSortApi* извлекает из DOM представления *Tickets* *Ticket*, использую свойства *firtChild* и *lastChild*, что дает возможность работать с неограниченным количество билетов.
4. *TicketsSortApi* получает описание билетов с помощью классов *Vehicle\**.

## ticketApi.js
### Основные классы:
* *TicketApi* -- инициализация.
* *TicketsSortApi* -- сортировка.
* *TicketForm* -- форма для добавления билетов (входных данных).
* *Tickets* -- обертка билетов (входных данных).
* *Ticket* -- билет (входные данные).
* *Vehicle* -- класс всех транспортных средств;
	+ *VehicleBus* -- класс всех автобусов;
		* *VehicleBusAirexpess* -- класс автобусов из аэропорта;
		* *VehicleBusRegular* -- класс рейсовых автобусов;
	+ *VehicleAirplane* -- класс всех самолетов;
		* *VehicleAirplaneRegular* -- класс рейсовых самолетов;
	+ *VehicleTrain* -- класс всех поездов;
		* *VehicleTrainRegular* -- класс всех рейсовых поездов;
			+ *VehicleTrainRegularComfort* -- класс рейсовых поездов повышенной комфортности;
			+ *VehicleTrainRegularUsual* -- класс рейсовых поездов;
		* *VehicleTrainAirexpess* -- класс аэроэкспрессов;
		* *VehicleTrainLongdistance* -- класс поездов дальнего следования;

## DCC.js
Библиотека для работа с DOM элементами.
### Досупные методы:
* *each(callback)* -- перебор объекта;
* *removeClass(className)* -- удаление класса;
* *addClass(className)* -- добавление класса;
* *hasClass(className)* -- проверка наличия класса;
* *on(event, callback)* -- добавление обработчика *callback* на событие *event* ;
* *off(event, callback)* -- удаление обработчика *callback* на событие *event* ;
* *trigger(event)* -- создать событие;
* *append(html)* -- добавить *html*;
* *remove()* -- удалить объект;
* *next()* -- получить следующий объект;
* *previous()* -- получить предыдущий объект;
* *getChilds()* -- получить детей объекта;
* *firstChild()* -- получить первый дочерний элемент;
* *lastChild()* -- получить последний дочерний элемент;
* *parent()* -- получить родительский элемент;
* *insertBefore(elem)* -- вставить после элемента *elem*;
* *insertAfter(elem)* -- вставить до элемента *elem*;
* *val(val)* -- получить значение или установить его равным val;
* *attr(attr, val)* -- получение параметра attr или установка *attr = val*;
* *find(selector)* -- поиск дочерних элементов по селектору selector;
* *copy(r)* -- получить копию элементов;

## index.html
Собранный проект.

