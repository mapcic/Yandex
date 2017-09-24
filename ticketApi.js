/**
 * Создает экземпляр класса TicketsSortApi
 *
 * @param {Tickets} tickets - коллекция билетов
 * @this {TicketsSortApi}
 * @constructor
 */
function TicketsSortApi(tickets) {
	this.tickets = (tickets instanceof Tickets)? tickets : TicketApi.TicketsFromHtml(TicketApi.TsID-1);
	this.api = 'TSA';
	this.bD = 'TSABD'
	this.bS = 'TSABS'
	this.sorted = 'TSAS';
}

/**
 * Печатает html представление, состоящие из обертки для отсортированных билетов и кнопок.
 *
 * @this {TicketsSortApi}
 * @return {TicketsSortApi}
 */
TicketsSortApi.prototype.render = function() {
	var title = '<div class="TSATitle">Sort tickets</div>',
		bS = '<button id="'+this.bS+'">Get sort tickets</button>',
		bD = '<button id="'+this.bD+'">Get description</button>',
		sorted = '<div id="TSAS"></div>';
	DCC('#'+this.api).remove();
	DCC('body').append('<div id="'+this.api+'">'+ title + bS + bD + sorted +'</div>');

	return this;
}

/**
 * Записывает DOM элементы в соответствующие свойства.
 * Инициализирует события сортировки и словесного описания.
 *
 * @this {TicketsSortApi}
 * @return {TicketsSortApi}
 */
TicketsSortApi.prototype.init = function() {
	this.api = document.getElementById(this.api);
	this.bS = document.getElementById(this.bS);
	this.bD = document.getElementById(this.bD);
	this.sorted = document.getElementById(this.sorted);

	var $this = this;
	DCC(this.bS).on('click', function(event) {
		$this.sortDOM(event)
	});

	DCC(this.bD).on('click', function(event) {
		$this.getDesc(event);
	});

	return this;
}

/**
 * Обработчик события. Сортировка билетов. Условие "с любым количеством карточек" 
 * указывает на ограничение размеров переменных. Идея сортировки в хранении
 * объектов в DOM представлении. Прохождении по ним в бесконечном цикле. Таким
 * образом мы избавляемся от ограничения по памяти.
 *
 * @this {TicketsSortApi}
 * @return {TicketsSortApi}
 */
TicketsSortApi.prototype.sortDOM = function() {
	var tickets = DCC(this.tickets.tickets),
		child = tickets.firstChild(),
		next = child.next(),
		list = DCC(this.sorted);

	if (child[0] == undefined) {
		return this;
	}

	tickets.getChilds().removeClass('TSASorted');
	list.getChilds().remove();
	list.append(child.copy(true)[0]);
	child.addClass('TSASorted');

	var flag = true,
		wasAdd = false;
	while (flag) {
		var next = child.next();

		if (!child.hasClass('TSASorted')) {
			var fs = list.firstChild(),
				ls = list.lastChild(),
				fromSort = fs.find('.from').attr('val'),
				toSort = ls.find('.to').attr('val'),
				from = child.find('.from').attr('val'),
				to = child.find('.to').attr('val');

			if (toSort == from && !child.hasClass('TSASorted')) {
				ls.insertAfter(child.copy(true)[0]);
				child.addClass('TSASorted');
				wasAdd = true;
			}

			if (fromSort == to && !child.hasClass('TSASorted')) {
				fs.insertBefore(child.copy(true)[0]);
				child.addClass('TSASorted');
				wasAdd = true;
			}
		}
		if (next[0] == undefined) {
			if (wasAdd) {
				child = tickets.firstChild();
				wasAdd = false;
			} else {
				flag = false;
			}
		} else {
			child = next;
		}
	}
	return this;
}

/**
 * Обработчик события. Формирует словесное описание билета исходя из
 * записанных в него параметров. Так же, как и sortHtml нет ограничения
 * по памяти, так как шагаем по DOM элементам.
 *
 * @param {Event} event -- событие
 * @this {TicketsSortApi}
 * @return {TicketsSortApi}
 */
TicketsSortApi.prototype.getDesc = function(event) {
	var sorted = DCC(this.sorted);

	sorted.find('.TW').each(function(){
		var $this = DCC(this),
			options = $this.find('.option'),
			params = {};
		options.each(function() {
			var $this = DCC(this);
			params[$this.attr('name')] = $this.attr('val');
		});

		var vehicle = new window[params.vehicle](params),
			desc = vehicle.desc;
		console.log(params);
		$this.append('<div class="desc">'+desc+'</div>');
		$this.find('.options').addClass('TOff');
	});

	return this;
} 

/**
 * Создает экземпляр класса TicketApi. Отвечает за инициализацию всей программы.
 *
 * @this {TicketApi}
 * @constructor
 */
function TicketApi() {}

/**
 * Статические свойства.
 *
 * @static {number} TFID - счетчик объектов формы для создания объектов
 * @static {number} TsID - счетчик объектов оберток билетов
 * @static {String} TFIDName - id DOM представления формы
 * @static {String} TsIDName - id DOM представления обертки
 */
TicketApi.TFID = 0;
TicketApi.TFIDName="TF"
TicketApi.TsID = 0;
TicketApi.TsIDName="Ts"

TicketApi.init = function() {
	var tickets = new Tickets(this.TsID++),
		form = this.getForm(tickets);

	form.render().init();
	tickets.render().init();

	return form;
}

/**
 * Возвращает экземпляр формы.
 *
 * @param {Tickets} tickets -- объект обертки билетов
 * @this {TicketApi}
 * @return {TicketForm}
 *
 * @static
 */
TicketApi.getForm = function(tickets) {
	return new TicketForm(this.TFID++, tickets);
}

/**
 * Возвращает экземпляр обертки билетов.
 *
 * @param {number} id -- id уже существующей обертки
 * @this {TicketApi}
 * @return {Tickets}
 *
 * @static
 */
TicketApi.TicketsFromHtml = function(id) {
	var tickets = new Tickets(id);

	tickets.init();

	return tickets;
}

/**
 * Создает экземпляр класса TicketForm. Отвечает за формирование билетов и входных данных.
 *
 * @param (number) id -- ID DOM представления формы
 * @param (Tickets) tickets -- обеъект обертки билетов, для взаимодействия с формой.
 * @this {TicketForm}
 * @constructor
 */
function TicketForm(id, tickets) {
	this.id = id;
	this.tickets = tickets;
	this.isInit = 0;

	this.form = 'TF'+this.id;
	this.from = 'TFFrom'+this.id;
	this.to = 'TFTo'+this.id;
	this.types = 'TFTypes'+this.id;
	this.options = 'TFOptions'+this.id;
	this.button = 'TFButton'+this.id;

	this.vType = [];
}

/**
 * Вывод HTML представления формы.
 *
 * @this {TicketForm}
 * @return {TicketForm}
 */
TicketForm.prototype.render = function() {
	var	vehicle = new Vehicle(),
		select = this.getSelectHTML(
			vehicle.kinds,
			{class : 'TFType', deep: vehicle.deep}),
		from = 'From:<input type="text" id="'+this.from+'" class="TFFrom">',
		to = 'To:<input type="text" id="'+this.to+'" class="TFTo">',
		way = '<div class="TFWay">'+from+to+'</div>',
		types = '<div id="'+this.types+'" class="TFTypes"><span>By</span>'+select+'</div>',
		options = '<div id="'+this.options+'" class="TFOptions"></div>',
		button = '<button id="'+this.button+'" class="TFButton TOff">Add</button>',
		form = '<div id="'+this.form+'" class="TF">'+
			way + types + options + button + '</div>';

	DCC('body').append(form);

	this.form = document.getElementById(this.form);
	this.from = document.getElementById(this.from);
	this.to = document.getElementById(this.to);
	this.types = document.getElementById(this.types);
	this.options = document.getElementById(this.options);
	this.button = document.getElementById(this.button);

	return this;
}

/**
 * Добавляются события изменения полей формы, отвечающих за транспортное средство и
 * добавления нового билета
 *
 * @this {TicketForm}
 * @return {TicketForm}
 */
TicketForm.prototype.init = function() {
	var $this = this,
		select = DCC($this.form).find('select');

	DCC(select.find('option')[0]).attr('selected', '');
	select.on('change', function(event) {
		$this.onChange(event);
	});

	DCC(this.button).on('click', function(event){
		$this.newTicket(event);
	})

	this.isInit = 1;
	return this;
}

/**
 * Делают кнопку добавления билета активной
 *
 * @this {TicketForm}
 * @return {TicketForm}
 */
TicketForm.prototype.on = function() {
	DCC(this.button).removeClass('TOff');

	return this;
}

/**
 * Делают кнопку добавления билета неактивной
 *
 * @this {TicketForm}
 * @return {TicketForm}
 */
TicketForm.prototype.off = function() {
	DCC(this.button).addClass('TOff');

	return this;
}

/**
 * Обработчик события изменения типа транспортного средства.
 *
 * @param {Event} event -- событие изменения формы
 * @this {TicketForm}
 * @return {void}
 */
TicketForm.prototype.onChange = function(event) {
	var $this = DCC(event.currentTarget),
		deep = $this.attr('deep'),
		val = $this.val();

	this.off();
	this.hideOptions();
	this.vType[+deep] = val;
	this.vType = this.vType.slice(0, +deep + 1);

	this.updateTypes();
}

/**
 * Обновление полей типа транспортного средства.
 *
 * @this {TicketForm}
 * @return {void}
 */
TicketForm.prototype.updateTypes = function() {
	var formHTML = DCC(this.form),
		typesWrap = DCC(this.types),
		types = typesWrap.find('.TFType');

	var vehicle = 'Vehicle',
		context = this;
	types.each(function() {
		var $this = DCC(this),
			ind = +$this.attr('deep');

		if ($this.attr('deep') < context.vType.length) {
			$this.val(context.vType[ind]);
			vehicle += context.vType[ind];
		} else {
			$this.remove();
		}
	});

	if (DCC(types[context.vType.length-1]).val() == ''){
		return;
	}

	vehicle = new window[vehicle];
	if (vehicle.hasKinds()) {
		typesWrap.append(this.getSelectHTML(
			vehicle.kinds,
			{class : 'TFType', deep: vehicle.deep}
		));
		var types = formHTML.find('.TFType');
		DCC(types[types.length-1]).on('change', function(event){
			context.onChange(event);
		});
	} else {
		this.showOptions();
		this.on();
	}
}

/**
 * Обновление полей типа транспортного средства.
 *
 * @param {Array} options -- список параметров транспортного средства
 * @param {Object} params -- пара ключ из options и значения для заполнения формы
 * @this {TicketForm}
 * @return {string}
 */
TicketForm.prototype.getSelectHTML = function(options, params) {
	var html = '';

	html = '<select'
	for (var key in params) {
		html += ' '+key+'="'+params[key]+'"';
	}
	html += '><option value="">Type...</option>';

	options.forEach(function(val, ind, options){
		html += '<option value="'+val+'">'+val+'</option>'; 
	});
	html += '</select>';

	return html;
}

/**
 * Вывод Html представления параметров транспортного средства.
 * Запись значений по умолчанию.
 *
 * @this {TicketForm}
 * @return {TicketForm}
 */
TicketForm.prototype.showOptions = function() {
	var formHTML = DCC(this.form),
		optionsWrap = DCC(this.options),
		className = 'Vehicle'+this.vType.join(''),
		vehicle = new window[className],
		options = vehicle.options;
	
	for (var i = 0; i < options.length; i++) {
		if (options[i] != 'from' && options[i] != 'to') {
			var html = '<div>'+options[i].charAt(0).toUpperCase() + options[i].slice(1)+':<input type="text" class="TFOption" name="'+options[i]+'"></div>';
			optionsWrap.append(html);
			optionsWrap.lastChild().find('input').val(vehicle.default[options[i]]);
		}
	}

	return this;
}

/**
 * Скрывает поле параметров транспортного средства.
 *
 * @this {TicketForm}
 * @return {TicketForm}
 */
TicketForm.prototype.hideOptions = function() {
	DCC(this.options).getChilds().remove();
	return this;
}

/**
 * Обработка события нажатия на кнопку. Добавление билета в обертку Tickets.
 * Создание входных данных для алгоритма сортировки.
 *
 * @param {Event} event -- событие нажатия
 * @this {TicketForm}
 * @return {TicketForm}
 */
TicketForm.prototype.newTicket = function(event) {
	var vehicle = 'Vehicle'+this.vType.join(''),
		params = {
			from : DCC(this.from).val(),
			to : DCC(this.to).val()
		};

	DCC(this.options).find('input').each(function() {
		var $this = DCC(this);
		params[$this.attr('name')] = $this.val();
	});

	for (var key in params) {
		if (params[key] == '' || params == undefined) {
			return this;
		}
	}

	this.tickets.append(new Ticket(vehicle, params));

	return this;
}

/**
 * Создает экземпляр класса Tickets. Обертка билетов -- входных данных.
 *
 * @this {Tickets}
 * @constructor
 */
function Tickets(id) {
	this.id = id;

	this.tickets = 'Ts'+this.id;
}

/**
 * Запись DOM представления.
 *
 * @this {Tickets}
 * @return {Tickets}
 */
Tickets.prototype.init = function() {
	this.tickets = document.getElementById(this.tickets);

	return this;
}

/**
 * Вывод Html предствления обертки.
 *
 * @this {Tickets}
 * @return {Tickets}
 */
Tickets.prototype.render = function() {
	var title = '<div class="TsTitle">Unsorted tickets:</div>',
		tickets = '<div id="'+this.tickets+'"></div>';
	DCC('body').append(
		'<div class="TsWrap">'+title+tickets+'</div>'
	);

	return this;
}

/**
 * Добавляет HTML объект входных данных;
 *
 * @param {Ticket} ticket -- объект билета -- входных данных;
 * @this {Tickets}
 * @return {Tickets}
 */
Tickets.prototype.append = function(ticket) {
	var tickets = DCC(this.tickets);

	if (ticket instanceof Ticket){
		tickets.append(ticket.getHtml());
	}

	return this;
}

/**
 * Создает экземпляр класса Ticket. Обертка входных данных.
 *
 * @param {String} vehicle -- имя класса транспортного средсва
 * @param {Object} options -- пары ключ -- значение для формирования 
 * объекта траспротного средства
 * @param {Ticket} next -- следующий билет
 * @param {Ticket} previous -- предыдущий билет
 * @this {Ticket}
 * @constructor
 */
function Ticket(vehicle, options, next, previous) {
	this.vehicle = vehicle;
	this.options = options;

	this.next = (next instanceof Ticket)? next : undefined;
	this.previous = (previous instanceof Ticket)? previous : undefined;
}

/**
 * Добавляет HTML объект входных данных;
 *
 * @param {Ticket} ticket -- объект билета -- входных данных;
 * @this {Tickets}
 * @return {String}
 */
Ticket.prototype.getHtml = function() {
	var options = '<div class="options">';

	for (var key in this.options) {
		var val = this.options[key];
			options += '<div class="option '+key+'" name="'+key+'" val="'+val+'">'+key+':'+val+'</div>';
	}
	options += '<div class="option vehicle" name="vehicle" val="'+this.vehicle+'"></div></div>';

	return '<div class="TW">'+options+'</div>';
}

/**
 * Создает экземпляр класса Vehicle. Описывает основные виды транспортных средств
 *
 * @param (Object) params -- объект значений параметров транспортного средств.
 * @this {Vehicle}
 * @constructor
 */
function Vehicle(params) {
	this.type = 'Vehicle';
	this.kinds = ['Bus', 'Airplane', 'Train'];

	this.deep = 0;

	this.options = ['from', 'to'];
	this.default = {from: 'A', to: 'B'};

	this.params = (params instanceof Object)? params: {};
}

Vehicle.prototype.hasKinds = function() {
	return this.kinds.length > 0;
}

/**
 * Создает экземпляр класса VehicleBus. Описывает основные виды автобусов.
 *
 * @param (Object) params -- объект значений параметров транспортного средств.
 * @this {VehicleBus}
 * @constructor
 */
function VehicleBus(params) {
	Vehicle.apply(this, arguments);

	this.kinds = ['Airexpess', 'Regular'];
	this.type = 'Bus';
	this.deep++;

	this.options = this.options.concat([
		'seat'
	]);

	this.default = Object.assign(this.default, {
		seat: 'No seat assignment.'
	})
}
VehicleBus.prototype = Object.create(Vehicle.prototype);

/**
 * Создает экземпляр класса VehicleBusAirexpess. Описывает автобус из аэропорта.
 *
 * @param (Object) params -- объект значений параметров транспортного средств.
 * @this {VehicleBusAirexpess}
 * @constructor
 */
function VehicleBusAirexpess(params) {
	VehicleBus.apply(this, arguments);

	this.kinds = [];
	this.type = 'Airexpess';
	this.deep++;

	this.desc = 'Take the airport bus from '+this.params.from+' to '+this.params.to+'. '+this.params.seat;
}
VehicleBusAirexpess.prototype = Object.create(VehicleBus.prototype);

/**
 * Создает экземпляр класса VehicleBusRegular. Описывает рйсовый автобус.
 *
 * @param (Object) params -- объект значений параметров транспортного средств.
 * @this {VehicleBusRegular}
 * @constructor
 */
function VehicleBusRegular(params) {
	VehicleBus.apply(this, arguments);

	this.kinds = [];
	this.type = 'Regular';
	this.deep++;

	this.options = this.options.concat([
		'route'
	]);

	this.default = Object.assign(this.default, {
		route: '№'
	})

	this.desc = 'Take the bus'+this.params.route+' from '+this.params.from+' to '+this.params.to+'. '+this.params.seat;

}
VehicleBusRegular.prototype =  Object.create(VehicleBus.prototype);

/**
 * Создает экземпляр класса VehicleAirplane. Описывает основные виды самолетов.
 *
 * @param (Object) params -- объект значений параметров транспортного средств.
 * @this {VehicleAirplane}
 * @constructor
 */
function VehicleAirplane(params) {
	Vehicle.apply(this, arguments);

	this.kinds = ['Regular'];
	this.type = 'Airplane'
	this.deep++;

	this.options = this.options.concat([
		'seat', 'baggage', 'gate'
	]);

	this.default = Object.assign(this.default, {
		seat: 'Seat № .', baggage: 'The maximum load weight is 30 kg.', gate: 'Gate № .'
	})
}
VehicleAirplane.prototype =  Object.create(Vehicle.prototype);

/**
 * Создает экземпляр класса VehicleAirplaneRegular. Описывает рейсовый самолет.
 *
 * @param (Object) params -- объект значений параметров транспортного средств.
 * @this {VehicleAirplaneRegular}
 * @constructor
 */
function VehicleAirplaneRegular(params) {
	VehicleAirplane.apply(this, arguments);

	this.kinds = [];
	this.type = 'Regular';
	this.deep++;

	this.options = this.options.concat([
		'flight'
	]);

	this.default = Object.assign(this.default, {
		flight : '№'
	})

	this.desc = 'From '+this.params.from+' Airport, take flight '+this.params.flight+' to '+this.params.to+'. '+this.params.gate+' '+this.params.seat+' '+this.params.baggage;
}
VehicleAirplaneRegular.prototype =  Object.create(VehicleAirplane.prototype);

/**
 * Создает экземпляр класса VehicleTrain. Описывает основные виды поездов.
 *
 * @param (Object) params -- объект значений параметров транспортного средств.
 * @this {VehicleTrain}
 * @constructor
 */
function VehicleTrain(params) {
	Vehicle.apply(this, arguments);

	this.kinds = ['Airexpess', 'Regular', 'Longdistance'];
	this.type = 'Train'
	this.deep++;

	this.options = this.options.concat([
		'platform'
	]);

	this.default = Object.assign(this.default, {
		platform : 'The train arrives at platform № .'
	})
}
VehicleTrain.prototype =  Object.create(Vehicle.prototype);

/**
 * Создает экземпляр класса VehicleTrainRegular. Описывает основные виды рейсовых поездов.
 *
 * @param (Object) params -- объект значений параметров транспортного средств.
 * @this {VehicleTrainRegular}
 * @constructor
 */
function VehicleTrainRegular(params) {
	VehicleTrain.apply(this, arguments);

	this.kinds = ['Comfort', 'Usually'];
	this.type = 'Regular';
	this.deep++;
}
VehicleTrainRegular.prototype =  Object.create(VehicleTrain.prototype);

/**
 * Создает экземпляр класса VehicleTrainRegularComfort. Описывает рейсовые поезда повышенной комфортности.
 *
 * @param (Object) params -- объект значений параметров транспортного средств.
 * @this {VehicleTrainRegularComfort}
 * @constructor
 */
function VehicleTrainRegularComfort(params) {
	VehicleTrainRegular.apply(this, arguments);

	this.kinds = [];
	this.type = 'Comfort';
	this.deep++;

	this.desc = 'Take train from '+this.params.from+' to '+this.params.to+'. '+this.params.platform;
}
VehicleTrainRegularComfort.prototype =  Object.create(VehicleTrainRegular.prototype);

/**
 * Создает экземпляр класса VehicleTrainRegularUsually. Описывает рейсовые поезда.
 *
 * @param (Object) params -- объект значений параметров транспортного средств.
 * @this {VehicleTrainRegularUsually}
 * @constructor
 */
function VehicleTrainRegularUsually(params) {
	VehicleTrainRegular.apply(this, arguments);

	this.kinds = [];
	this.type = 'Usually';
	this.deep++;

	this.desc = 'Take comfort train from '+this.params.from+' to '+this.params.to+'. '+this.params.platform;
}
VehicleTrainRegularUsually.prototype =  Object.create(VehicleTrainRegular.prototype);

/**
 * Создает экземпляр класса VehicleTrainAirexpess. Описывает аэроэкспресс.
 *
 * @param (Object) params -- объект значений параметров транспортного средств.
 * @this {VehicleTrainAirexpess}
 * @constructor
 */
function VehicleTrainAirexpess(params) {
	VehicleTrain.apply(this, arguments);

	this.kinds = [];
	this.type = 'Airexpess';
	this.deep++;

	this.desc = 'Take aeroexpress from '+this.params.from+' Airport to '+this.params.to+'. '+this.params.platform;
}
VehicleTrainAirexpess.prototype =  Object.create(VehicleTrain.prototype);

/**
 * Создает экземпляр класса VehicleTrainLongdistance. Описывает поезд дальнего следования.
 *
 * @param (Object) params -- объект значений параметров транспортного средств.
 * @this {VehicleTrainLongdistance}
 * @constructor
 */
function VehicleTrainLongdistance(params) {
	VehicleTrain.apply(this, arguments);

	this.kinds = [];
	this.type = 'Longdistance';
	this.deep++;

	this.options = this.options.concat([
		'seat', 'wagon', 'type'
	]);

	this.default = Object.assign(this.default, {
		seat: 'Seat № .', wagon: 'Wagon № .', type: 'Type wagon is сoupe.'
	})

	this.desc = 'Take train from '+this.params.from+' to '+this.params.to+'. '+this.params.platform+' '+this.params.seat+' '+this.params.wagon+' '+this.params.type;
}
VehicleTrainLongdistance.prototype =  Object.create(VehicleTrain.prototype);