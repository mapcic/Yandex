// How document

// -------------------------------------------------------- 
// Control ticket
function TicketApi() {}

TicketApi.TFID = 0;
TicketApi.getForm = function(tickets) {
	return new TicketForm(this.TFID++, tickets);
}

TicketApi.TID = 0;
TicketApi.newTID = function() {
	return this.TDI++;
}

TicketApi.TsID = 0;
TicketApi.initApi = function() {
	var tickets = new Tickets(this.TsID++),
		form = this.getForm(tickets);

	form.render().init();
	tickets.render();

	return form;
}

// -------------------------------------------------------- 
// Class to figure Ticket
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
		button = '<div id="'+this.button+'" class="TFButton TOff">Добавить билет</div>',
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

TicketForm.prototype.init = function() {
	var $this = this,
		select = DCC($this.form).find('select');

	DCC(select.find('option')[0]).attr('selected', '');
	select.on('change', function(event) {
		$this.onChange(event);
	});

	this.isInit = 1;
	return this;
}

TicketForm.prototype.on = function() {
	DCC(this.button).removeClass('TOff');

	return this;
}

TicketForm.prototype.off = function() {
	DCC(this.button).addClass('TOff');

	return this;
}


TicketForm.prototype.onChange = function(event) {
	var $this = DCC(event.currentTarget),
		deep = $this.attr('deep'),
		val = $this.val();

	this.off();
	this.hideOptions();
	this.vType[+deep] = val[0];
	this.vType = this.vType.slice(0, +deep + 1);

	this.updateTypes();
}

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

	if (DCC(types[context.vType.length-1]).val()[0] == ''){
		return;
	}

	vehicle = new window[vehicle];
	if (vehicle.hasKinds()) {
		typesWrap.append(this.getSelectHTML(
			vehicle.kinds,
			{class : 'TFType', deep: vehicle.deep}
		));
		var types = formHTML.find('.TFType');
		// DCC(types[types.length-1]).on('change', context.onChange);
		DCC(types[types.length-1]).on('change', function(event){
			context.onChange(event);
		});
	} else {
		this.showOptions();
		this.on();
	}
}

TicketForm.prototype.getSelectHTML = function(options, params) {
	var html = '';

	html = '<select'
	for (var key in params) {
		html += ' '+key+'="'+params[key]+'"';
	}
	// html += '>';
	html += '><option value="">Type...</option>';

	options.forEach(function(val, ind, options){
		html += '<option value="'+val+'">'+val+'</option>'; 
	});
	html += '</select>';

	return html;
}

// TicketForm.prototype.check = function() {}
TicketForm.prototype.showOptions = function() {
	var formHTML = DCC(this.form),
		optionsWrap = DCC(this.options),
		className = 'Vehicle'+this.vType.join(''),
		vehicle = new window[className],
		options = vehicle.options;
	
	for (var i = 0; i < options.length; i++) {
		var html = '<div>'+options[i].charAt(0).toUpperCase() + options[i].slice(1)+':<input type="text" class="TFOption" name="'+options[i]+'"></div>';
		optionsWrap.append(html);
	}
}

TicketForm.prototype.hideOptions = function() {
	DCC(this.options).getChilds().remove();
	return this;
}

TicketForm.prototype.createTicket = function() {
	var vehicle = 'Vehicle'+this.vType.join(''),
		params = {
			from : DCC(this.from).val(),
			to : DCC(this.to).val()
		},
		options = (new window[vehicle]).options;

	DCC(this.options).find('input').each(function() {
		var $this = DCC(this);
		params[$this.attr('name')] = $this.val();
	});
}

// -------------------------------------------------------- 
// Tickets Class
function Tickets(id) {
	this.id = id;
}

Tickets.prototype.render = function() {
	var title = '<div class="TsTitle">Unsort tickets:</div>',
		tickets = '<div id="Ts'+this.id+'"></div>';
	DCC('body').append(
		'<div class="TsWrap">'+title+tickets+'</div>'
	);

	return this;
}

Tickets.prototype.append = function(ticket) {
	var tickets = DCC('#Ts'+this.id);

	if (ticket instanceof Ticket){
		tickets.append(ticket.getHtml());
	}

	return this;
}

function Ticket(vehicle, options, next, previous) {
	// this.way = way;
	this.vehicle = vehicle;
	this.options = options;

	this.next = (next instanceof Ticket)? next : undefined;
	this.previous = (previous instanceof Ticket)? previous : undefined;
}

Ticket.prototype.getHtml = function() {
	var way = '<div class="way">'+
			'<div class="from" val="'+this.options.from+'">FROM:'+this.options.from+'</div>'+
			'<div class="to" val="'+this.options.to+'">TO:'+this.options.to+'</div>'+
			'</div>',
		options = '<div class="options" vehicle="'+this.vehicle+'">';

	for (var key in this.options) {
		var val = this.options[key];
		options += '<div class="options '+key+'" name="'+key+'" val="'+val+'">'+key+':'+val+'</div>';
	}
	options += '</div>';

	return '<div class="TW">'+way+options+'</div>';
}

// -------------------------------------------------------- 
// Vehicles class
function Vehicle(params) {
	this.type = 'Vehicle';
	this.kinds = ['Bus', 'Airplane', 'Train'];

	this.deep = 0;

	this.way = ['from', 'to'];
	this.options = [];

	this.params = (params instanceof Object)? params: {};
}

Vehicle.prototype.hasKinds = function() {
	return this.kinds.length > 0;
}

// Bus tree
function VehicleBus(params) {
	Vehicle.apply(this, arguments);

	this.kinds = ['Airexpess', 'Regular'];
	this.type = 'Bus';
	this.deep++;

	this.options = this.options.concat([
		'seat', 'baggage'
	]);
}
VehicleBus.prototype = Object.create(Vehicle.prototype);

function VehicleBusAirexpess(params) {
	VehicleBus.apply(this, arguments);

	this.kinds = [];
	this.type = 'Airexpess';
	this.deep++;
}
VehicleBusAirexpess.prototype = Object.create(VehicleBus.prototype);

function VehicleBusRegular(params) {
	VehicleBus.apply(this, arguments);

	this.kinds = [];
	this.type = 'Regular';
	this.deep++;
}
VehicleBusRegular.prototype =  Object.create(VehicleBus.prototype);

// Airplane tree
function VehicleAirplane(params) {
	Vehicle.apply(this, arguments);

	this.kinds = ['Regular'];
	this.type = 'Airplane'
	this.deep++;

	this.options = this.options.concat([
		'seat', 'baggage', 'gate'
	]);
}
VehicleAirplane.prototype =  Object.create(Vehicle.prototype);

function VehicleAirplaneRegular(params) {
	VehicleAirplane.apply(this, arguments);

	this.kinds = [];
	this.type = 'Regular';
	this.deep++;
}
VehicleAirplaneRegular.prototype =  Object.create(VehicleAirplane.prototype);

// Train tree
function VehicleTrain(params) {
	Vehicle.apply(this, arguments);

	this.kinds = ['Airexpess', 'Regular', 'Longdistance'];
	this.type = 'Train'
	this.deep++;

	this.options = this.options.concat([
		'seat'
	]);
}
VehicleTrain.prototype =  Object.create(Vehicle.prototype);

function VehicleTrainRegular(params) {
	VehicleTrain.apply(this, arguments);

	this.kinds = ['Comfort', 'Usually'];
	this.type = 'Regular';
	this.deep++;
}
VehicleTrainRegular.prototype =  Object.create(VehicleTrain.prototype);

function VehicleTrainRegularComfort(params) {
	VehicleTrainRegular.apply(this, arguments);

	this.kinds = [];
	this.type = 'Comfort';
	this.deep++;
}
VehicleTrainRegularComfort.prototype =  Object.create(VehicleTrainRegular.prototype);

function VehicleTrainRegularUsually(params) {
	VehicleTrainRegular.apply(this, arguments);

	this.kinds = [];
	this.type = 'Usually';
	this.deep++;
}
VehicleTrainRegularUsually.prototype =  Object.create(VehicleTrainRegular.prototype);

function VehicleTrainAirexpess(params) {
	VehicleTrain.apply(this, arguments);

	this.kinds = [];
	this.type = 'Airexpess';
	this.deep++;
}
VehicleTrainAirexpess.prototype =  Object.create(VehicleTrain.prototype);

function VehicleTrainLongdistance(params) {
	VehicleTrain.apply(this, arguments);

	this.kinds = [];
	this.type = 'Longdistance';
	this.deep++;

	this.options = this.options.concat([
		'wagon', 'class'
	]);
}
VehicleTrainLongdistance.prototype =  Object.create(VehicleTrain.prototype);