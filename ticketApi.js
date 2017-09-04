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
}

TicketForm.prototype.getHtml = function() {

	return html;
}

TicketForm.prototype.init = function() {
	this.init = 1;

	return this;
}

TicketForm.prototype.onChange = function(event) {
	var $this = event.currentTarget;
}

TicketForm.prototype.check = function() {
	var field = this.get;

	while (true) {
		this.get()
	}
}

TicketForm.prototype.switch = function(state) {
	if ( state == 'on') {
		// turn on
	} else {
		// turn off
	}
}
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
	this.kinds = [];

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