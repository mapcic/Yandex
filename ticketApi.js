// How document

// -------------------------------------------------------- 
// Control ticket
function TicketApi() {}

TicketApi.TFID = 0;
TicketApi.getForm = function() {
	return new TicketForm(this.TFID++);
}

TicketApi.TID = 0;
TicketApi.newTID = function() {
	return this.TDI++;
}

TicketApi.initApi = function() {
	var form = this.getForm();

	form.render().init();

	return form;
}

// -------------------------------------------------------- 
// Class to figure Ticket
function TicketForm(id) {
	this.id = id;
	this.isInit = 0;

	this.vType = [];
}

TicketForm.prototype.render = function() {
	var html = '',
		vehicle = new Vehicle(),
		select = this.getSelectHTML(
			vehicle.kinds,
			{class : 'TFType', deep: vehicle.deep});

	html = '<div id="TF'+this.id+'" class="TF">'+
		'<div class="TFWay">From<input type="text" class="TFFrom">'+
		'To<input type="text" class="TFTo"></div>'+
		'<div class="TFTypes"><span>By</span>'+select+'</div>'+
		'<div class="TFOptions"></div>'+
		'<div class="TFButton TOff">Добавить билет</div>'+
		'</div>';

	DCC('body').append(html);
	return this;
}

TicketForm.prototype.init = function() {
	var context = this,
		select = DCC('#TF'+this.id+' select');

	DCC(select.find('option')[0]).attr('selected', '');
	select.on('change', function(event) {
		context.onChange(event);
	});

	this.isInit = 1;
	return this;
}

TicketForm.prototype.switch = function(state) {
	if ( state == 'on') {
		DCC('#TF'+this.id+' .TFButton').removeClass('TOff');
	} else {
		DCC('#TF'+this.id+' .TFButton').addClass('TOff');
	}

	return this;
}

TicketForm.prototype.onChange = function(event) {
	var $this = DCC(event.currentTarget),
		deep = $this.attr('deep'),
		val = $this.val();

	this.switch('off');
	this.hideOptions();
	this.vType[+deep] = val[0];
	this.vType = this.vType.slice(0, deep + 1);

	this.updateTypes();
}

TicketForm.prototype.updateTypes = function() {
	var formHTML = DCC('#TF'+this.id),
		typesWrap = formHTML.find('.TFTypes'),
		types = formHTML.find('.TFType');

	var vehicle = 'Vehicle',
		context = this;
	types.each(function() {
		var $this = DCC(this),
			ind = +$this.attr('deep');
		if ($this.attr('deep') > context.vType.length-1) {
			$this.remove();
		} else {
			$this.val(context.vType[ind]);
			vehicle += context.vType[ind];
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
		this.switch('on');
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
	var formHTML = DCC('#TF'+this.id),
		optionsWrap = formHTML.find('.TFOptions'),
		className = 'Vehicle'+this.vType.join(''),
		vehicle = new window[className],
		options = vehicle.options;
	
	for (var i = 0; i < options.length; i++) {
		console.log(i);
		console.log(options[i]);
		var html = '<div>'+options[i].charAt(0).toUpperCase() + options[i].slice(1)+':<input type="text" class="TFOption" name="'+options[i]+'">';
		optionsWrap.append(html)+'</div>';
	}
}

TicketForm.prototype.hideOptions = function() {
	DCC('#TF'+this.id+' .TFOptions').getChilds().remove();
	return this;
}

// -------------------------------------------------------- 
// Ticket Class
function Ticket(id) {
	this.id = id;

	this.from = '';
	this.to = '';
}

// -------------------------------------------------------- 
// Vehicles class
function Vehicle() {
	this.type = 'Vehicle';
	this.kinds = ['Bus', 'Airplane', 'Train'];

	this.deep = 0;

	this.from = '';
	this.to = '';

	this.options = []
}

Vehicle.prototype.hasKinds = function() {
	return this.kinds.length > 0;
}

// Bus tree
function VehicleBus() {
	Vehicle.apply(this, arguments);

	this.kinds = ['Airexpess', 'Regular'];
	this.type = 'Bus';
	this.deep++;

	this.options = this.options.concat([
		'seat', 'baggage'
	]);
}
VehicleBus.prototype = Object.create(Vehicle.prototype);

function VehicleBusAirexpess() {
	VehicleBus.apply(this, arguments);

	this.kinds = [];
	this.type = 'Airexpess';
	this.deep++;
}
VehicleBusAirexpess.prototype = Object.create(VehicleBus.prototype);

function VehicleBusRegular() {
	VehicleBus.apply(this, arguments);

	this.kinds = [];
	this.type = 'Regular';
	this.deep++;
}
VehicleBusRegular.prototype =  Object.create(VehicleBus.prototype);

// Airplane tree
function VehicleAirplane() {
	Vehicle.apply(this, arguments);

	this.kinds = ['Regular'];
	this.type = 'Airplane'
	this.deep++;

	this.options = this.options.concat([
		'seat', 'baggage', 'gate'
	]);
}
VehicleAirplane.prototype =  Object.create(Vehicle.prototype);

function VehicleAirplaneRegular() {
	VehicleAirplane.apply(this, arguments);

	this.kinds = [];
	this.type = 'Regular';
	this.deep++;
}
VehicleAirplaneRegular.prototype =  Object.create(VehicleAirplane.prototype);

// Train tree
function VehicleTrain() {
	Vehicle.apply(this, arguments);

	this.kinds = ['Airexpess', 'Regular', 'Longdistance'];
	this.type = 'Train'
	this.deep++;

	this.options = this.options.concat([
		'seat'
	]);
}
VehicleTrain.prototype =  Object.create(Vehicle.prototype);

function VehicleTrainRegular() {
	VehicleTrain.apply(this, arguments);

	this.kinds = ['Comfort', 'Usually'];
	this.type = 'Regular';
	this.deep++;
}
VehicleTrainRegular.prototype =  Object.create(VehicleTrain.prototype);

function VehicleTrainRegularComfort() {
	VehicleTrainRegular.apply(this, arguments);

	this.kinds = [];
	this.type = 'Comfort';
	this.deep++;
}
VehicleTrainRegularComfort.prototype =  Object.create(VehicleTrainRegular.prototype);

function VehicleTrainRegularUsually() {
	VehicleTrainRegular.apply(this, arguments);

	this.kinds = [];
	this.type = 'Usually';
	this.deep++;
}
VehicleTrainRegularUsually.prototype =  Object.create(VehicleTrainRegular.prototype);

function VehicleTrainAirexpess() {
	VehicleTrain.apply(this, arguments);

	this.kinds = [];
	this.type = 'Airexpess';
	this.deep++;
}
VehicleTrainAirexpess.prototype =  Object.create(VehicleTrain.prototype);

function VehicleTrainLongdistance() {
	VehicleTrain.apply(this, arguments);

	this.kinds = [];
	this.type = 'Longdistance';
	this.deep++;

	this.options = this.options.concat([
		'wagon', 'class'
	]);
}
VehicleTrainLongdistance.prototype =  Object.create(VehicleTrain.prototype);