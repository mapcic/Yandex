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

TiketApi.echo = function(html) {
	// echo var hrtm. It's may be DCC
}

// -------------------------------------------------------- 
// Class to figure tiket
function TicketForm(id) {
	this.id = id;
	this.init = 0;

	this.vType = [];
}

TicketForm.prototype.printForm = function() {
	var html = '',
		vehicle = new Vehicle(),
		select = this.getSelectHTML(
			vehicle.kinds,
			{class : 'TFTypes', deep: vehicle.deep});

	html = '<div id="TF'+this.id+'" class="TF">'+
		'<div>From<input type="text" class="TFFrom"></div>'+
		'<div>To<input type="text" class="TFTo"></div>'+
		'<div>By</div>'+
		'<div>'+select+'</div>'+
		'<div><div class="TFButton TOff"></div></div>'+
		'</div>';

	DCC('body').append(html);

	return this;
}

TicketForm.prototype.init = function() {
	this.init = 1;

	return this;
}


TicketForm.prototype.switch = function(state) {
	if ( state == 'on') {
		// turn on
	} else {
		// turn off
	}
}

TicketForm.prototype.onChange = function(event) {
	var $this = event.currentTarget,
		deep = $this.getAttribute('deep'),
		val = $this.options[$this.selectedIndex].value;
	this.vType[deep] = val;
	this.vType = this.vType.slice(0, deep + 1);

	this.updateTypes();
}

TicketForm.prototype.updateTypes = function() {
	var formHTML = DCC('.TF'+this.id),
		types = formHTML.find('.TFTypes');

	var vehicle = 'Vehicle';
	types.forEach(function(val, ind, types) {
		if (val.attr('deep') > this.vType[this.vType.length-1]) {
			val.rm();
		} else {
			val.val(this.vType[ind]).off('change', this.onChange);
			vehicle =+ this.vType[ind];
		}
	});

	vehicle = Object.create(vehicle);
	if (!vehicle.hasKinds()) {
		if (vehicle.val() != '') {
			this.active();
		} else {
			this.deactive();
		}
	} else {
		formHTML.append(this.getSelectHTML(
			vehicle.kinds,
			{class : 'TFTypes', deep: vehicle.deep}
		));
	
	}

	formHTML.find('.TFTypes').on('change', this.onChange);
}


TiketForm.prototype.getSelectHTML(options, params){
	var html = '';

	html = '<select '
	for (var key in params) {
		html =+ key+'="'+params[key]+'" ';
	}
	html += '>';

	options.forEach(function(val, ind, options){
		html += '<option value="'+val+'">'+val+'</option>'; 
	});
	html += '</select>';

	return html;
}

// TicketForm.prototype.check = function() {}
// TicketForm.prototype.printOptions = function() { }

// -------------------------------------------------------- 
// Tiket Class
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

	this.seat = '';
	this.baggage = '';

	this.options = [];
}

Vehicle.prototype.hasKinds = function() {
	return this.kinds.length > 0;
}

// Bus tree
function VehicleBus() {
	Vehicle.apply(this, arguments);

	this.kinds = ['Airexpess', 'Trip'];
	this.type = 'Bus';
	this.deep++;
}
VehicleBus.prototype =  new Vehicle();

function VehicleBusAirexpess() {
	VehicleBus.apply(this, arguments);

	this.kinds = [];
	this.type = 'Airexpess';
	this.deep++;
}
VehicleBusAirexpess.prototype =  new VehicleBus();

function VehicleBusTrip() {
	VehicleBus.apply(this, arguments);

	this.kinds = [];
	this.type = 'Trip';
	this.deep++;
}
VehicleBusTrip.prototype =  new VehicleBus();

// Airplane tree
function VehicleAirplane() {
	Vehicle.apply(this, arguments);

	this.kinds = ['Trip'];
	this.type = 'Airplane'
	this.deep++;
}
VehicleAirplane.prototype =  new Vehicle();

function VehicleAirplaneTrip() {
	VehicleAirplane.apply(this, arguments);

	this.kinds = [];
	this.type = 'Trip';
	this.deep++;
}
VehicleAirplaneTrip.prototype =  new VehicleAirplane();

// Train tree
function VehicleTrain() {
	Vehicle.apply(this, arguments);

	this.kinds = ['Airexpess', 'Trip'];
	this.type = 'Train'
	this.deep++;
}
VehicleTrain.prototype =  new Vehicle();

function VehicleTrainTrip() {
	VehicleTrain.apply(this, arguments);

	this.kinds = [];
	this.type = 'Trip';
	this.deep++;
}
VehicleTrainTrip.prototype =  new VehicleTrain();

function VehicleTrainAirexpess() {
	VehicleTrain.apply(this, arguments);

	this.kinds = [];
	this.type = 'Airexpess';
	this.deep++;
}
VehicleTrainAirexpess.prototype =  new VehicleTrain();

function VehicleTrainTrip() {
	VehicleTrain.apply(this, arguments);

	this.kinds = [];
	this.type = 'Trip';
	this.deep++;
}
VehicleTrainTrip.prototype =  new VehicleTrain();