
// CLASSES
class Player {
	constructor(name) {
		this.name = name;
		this.position = 0;
		this.money = 1500;
		this.hellCards = 0;
		this.hellTurns = 0;
		this.inHell = false;
		this.hasLost = false;
	}
	logInfo() {
		console.log(this.name);
		console.log(this.position);
		console.log(this.money);
		console.log(this.hellCards);
		console.log(this.hellTurns);
		console.log(this.inHell);
		console.log(this.hasLost);
	}
}

class Property {
	constructor(name, cost, houseCost, rent) {
		this.name = name;
		this.cost = cost;
		this.houseCost = houseCost;
		this.rent = rent;
		this.development = 0;
		this.ownedBy = -1;
		this.isMonopoly = false;
	}
	logInfo() {
		console.log(this.name);
		console.log(this.cost);
		console.log(this.houseCost);
		console.log(this.rent);
		console.log(this.development);
		console.log(this.ownedBy);
		console.log(this.isMonopoly);
	}
	checkMonopoly(pairNum, pair1Property, pair2Property) {
		if (pairNum == 2) {
			if (!this.isMonopoly && properties[pair1Property].ownedBy == activePlayer && this.ownedBy == activePlayer){
				this.isMonopoly = properties[pair1Property].isMonopoly = true;
				console.log("Monopoly!");
				document.getElementById('log').innerHTML += "<p>Monopoly!</p>";
				updateScroll();
			}
		} else if (pairNum == 3) {
			if (!this.isMonopoly && this.ownedBy == activePlayer && properties[pair1Property].ownedBy == activePlayer && properties[pair2Property].ownedBy == activePlayer){
				this.isMonopoly = properties[pair1Property].isMonopoly = properties[pair2Property].isMonopoly = true;
				console.log("Monopoly!");
				document.getElementById('log').innerHTML += "<p>Monopoly!</p>";
				updateScroll();
			}
		} else {
			console.log("Failure: pairNum not valid entry");	
		}
	}
	propertySpace() {
		if (this.ownedBy == -1 && players[activePlayer].money > this.cost) // runs if not owned by player
		{
			console.log("Would you like to buy " + this.name + " for $" + this.cost + "?");
			document.getElementById('log').innerHTML += "<p>Would you like to buy " + this.name + " for $" + this.cost + "?</p>";
			updateScroll();
			inputToggle = "Buy Property";
		}
		else if (this.ownedBy != activePlayer) // runs if owned by different player
		{
			console.log("Must pay rent for " + this.name);
			document.getElementById('log').innerHTML += "<p>Must pay rent for " + this.name + "</p>";
			updateScroll();
			if (this.isMonopoly && this.development == 0) // doubles rent if has monopoly and unimproved
			{
				players[activePlayer].money -= this.rent[0] * 2;
				players[this.ownedBy].money += this.rent[0] * 2;
				console.log(players[activePlayer].name + " has paid $" + this.rent[0] * 2);
				document.getElementById('log').innerHTML += "<p>" + players[activePlayer].name + " has paid $" + this.rent[0] * 2 + "</p>";
				updateScroll();
			}
			else
			{
				players[activePlayer].money -= this.rent[this.development];
				players[this.ownedBy].money += this.rent[this.development];
				console.log(players[activePlayer].name + " has paid $" + this.rent[this.development]);
				document.getElementById('log').innerHTML += "<p>" + players[activePlayer].name + " has paid $" + this.rent[this.development] + "</p>";
				updateScroll();
			}
			endTurn();
		}
		else
		{
			console.log("Landed on " + this.name);
			document.getElementById('log').innerHTML += "<p>Landed on " + this.name + "</p>";
			updateScroll();
			endTurn();
		}
	}
	buyProperty() {
		players[activePlayer].money -= this.cost;
		this.ownedBy = activePlayer;
		console.log(players[activePlayer].name + " has bought " + this.name);
		document.getElementById('log').innerHTML += "<p>" + players[activePlayer].name + " has bought " + this.name + "</p>";
		updateScroll();
	}
}

class Utility {
	constructor(name) {
		this.name = name;
		this.ownedBy = -1;
	}
	logInfo() {
		console.log(this.name);
		console.log(this.ownedBy);
	}
	utilitySpace(isCard)
	{
		if (this.ownedBy == -1 && players[activePlayer].money > 150) // runs if not owned by player
		{
			console.log("Would you like to buy " + this.name + " for $150?");
			document.getElementById('log').innerHTML +="<p>Would you like to buy " + this.name + " for $150?</p>";
			updateScroll();
			inputToggle = "Buy Utility";
		}
		else if (this.ownedBy != activePlayer) // runs if owned by different player
		{
			console.log("Must pay rent for " + this.name);
			document.getElementById('log').innerHTML += "<p>Must pay rent for " + this.name + "</p>";
			updateScroll();
			let numOwned = 0;
			if (isCard) // if the utility was landed on as a result of a card draw, default to x10 dice roll
			{
				numOwned = 2;
			}
			else
			{
				for (let i = 0; i < 2; i++) // finds the amount of utilities owned by the player
				{
					if (utilities[i].ownedBy == this.ownedBy)
					{
						numOwned++;
					}
				}
			}
			switch (numOwned)
			{
				case 1:
					players[activePlayer].money -= (diceOne + diceTwo) * 4;
					players[this.ownedBy].money += (diceOne + diceTwo) * 4;
					console.log(players[activePlayer].name + " has paid $" + (diceOne + diceTwo) * 4);
					document.getElementById('log').innerHTML += "<p>" + players[activePlayer].name + " has paid $" + (diceOne + diceTwo) * 4 + "</p>";
					updateScroll();
					break;
				case 2:
					players[activePlayer].money -= (diceOne + diceTwo) * 10;
					players[this.ownedBy].money += (diceOne + diceTwo) * 10;
					console.log(players[activePlayer].name + " has paid $" + (diceOne + diceTwo) * 10);
					document.getElementById('log').innerHTML += "<p>" + players[activePlayer].name + " has paid $" + (diceOne + diceTwo) * 4 + "</p>";
					updateScroll();
					break;
				default:
					throw new Error("Number of utilities owned unknown");
			}
			endTurn();
		}
		else
		{
			console.log("Landed on " + this.name);
			document.getElementById('log').innerHTML += "<p>Landed on " + this.name + "</p>";
			updateScroll();
			endTurn();
		}
	}
	buyUtility()
	{
		players[activePlayer].money -= 150;
		this.ownedBy = activePlayer;
		console.log(players[activePlayer].name + " has bought " + this.name);
		document.getElementById('log').innerHTML += "<p>" + players[activePlayer].name + " has bought " + this.name + "</p>";
		updateScroll();
	}
}

class BusStop {
	constructor(name) {
		this.name = name;
		this.ownedBy = -1;
	}
	logInfo() {
		console.log(this.name);
		console.log(this.ownedBy);
	}
	busStopSpace(isCard)
	{
		if (this.ownedBy == -1 && players[activePlayer].money > 200) // runs if not owned by player
		{
			console.log("Would you like to buy " + this.name + " for $200?");
			document.getElementById('log').innerHTML += "<p>Would you like to buy " + this.name + " for $200?</p>";
			updateScroll();
			inputToggle = "Buy Bus Stop";
		}
		else if (this.ownedBy != activePlayer) // runs if owned by different player
		{
			console.log("Must pay rent for " + this.name);
			document.getElementById('log').innerHTML += "<p>Must pay rent for " + this.name + "</p>";
			updateScroll();
			let numOwned = 0;
			for (let i = 0; i < 4; i++) // finds the amount of bus stops owned by the player
			{
				if (busStops[i].ownedBy == this.ownedBy)
				{
					numOwned++;
				}
			}
			if (isCard) // if the bus stop was landed on as a result of a card draw
			{
				players[activePlayer].money -= 25 * Math.pow(2, numOwned - 1) * 2; // 50, 100, 200, 400
				players[this.ownedBy].money += 25 * Math.pow(2, numOwned - 1) * 2;
				console.log(players[activePlayer].name + " has paid $" + 25 * Math.pow(2, numOwned - 1) * 2);
				document.getElementById('log').innerHTML += "<p>" + players[activePlayer].name + " has paid $" + 25 * Math.pow(2, numOwned - 1) * 2 + "</p>";
			}
			else
			{
				players[activePlayer].money -= 25 * Math.pow(2, numOwned - 1); // 25, 50, 100, 200
				players[this.ownedBy].money += 25 * Math.pow(2, numOwned - 1);
				console.log(players[activePlayer].name + " has paid $" + 25 * Math.pow(2, numOwned - 1));
				document.getElementById('log').innerHTML += "<p>" + players[activePlayer].name + " has paid $" + 25 * Math.pow(2, numOwned - 1) + "</p>";
			}
			updateScroll();
			endTurn();
		}
		else
		{
			console.log("Landed on " + this.name);
			document.getElementById('log').innerHTML += "<p>Landed on " + this.name + "</p>";
			updateScroll();
			endTurn();
		}
		
	}
	buyBusStop()
	{
		players[activePlayer].money -= 200;
		this.ownedBy = activePlayer;
		console.log(players[activePlayer].name + " has bought " + this.name);
		document.getElementById('log').innerHTML += "<p>" + players[activePlayer].name + " has bought " + this.name + "</p>";
		updateScroll();
	}
}

class Card {
	constructor(type, description) {
		this.type = type;
		this.description = description;
	}
	logInfo() {
		console.log(this.type);
		console.log(this.description);
	}
}


// VARIABLES

const players = [];	// creates empty player array for setup to push to
const properties = [	// creates pre-set property objects (name, cost, houseCost, rent)
    new Property('Sage Hall', 60, 50, [2,10,30,90,160,250]),
    new Property('Sycamore Hall', 60, 50, [4,20,60,180,320,450]),
    new Property('Wooten Hall', 100, 50, [6,30,90,270,400,550]),
    new Property('Business Building', 100, 50, [6,30,90,270,400,550]),
    new Property('Joe Green Hall', 120, 50, [8,40,100,300,450,600]),
    new Property('Kerr Hall', 140, 100, [10,50,150,450,625,750]),
    new Property('Maple Hall', 140, 100, [10,50,150,450,625,750]),
    new Property('Rawlins Hall', 160, 100, [12,60,180,500,700,900]),
    new Property('The Pit', 180, 100, [14,70,200,550,750,950]),
    new Property('Pohl Recreation Center', 180, 100, [14,70,200,550,750,950]),
    new Property('Chestnut Hall', 200, 100, [16,80,220,600,800,1000]),
    new Property('West Hall', 220, 150, [18,90,250,700,875,1050]),
    new Property('Legends Hall', 220, 150, [18,90,250,700,875,1050]),
    new Property('Environmental Science Building', 240, 150, [20,100,300,750,925,1100]),
    new Property('Chemistry Building', 260, 150, [22,110,330,800,975,1150]),
    new Property('Music Building', 260, 150, [22,110,330,800,975,1150]),
    new Property('Chilton Hall', 280, 150, [24,120,360,850,1025,1200]),
    new Property('General Academic Building', 300, 200, [26,130,390,900,1100,1275]),
    new Property('Art Building', 300, 200, [26,130,390,900,1100,1275]),
    new Property('Language Building', 320, 200, [28,150,450,1000,1200,1400]),
    new Property('Eagle Student Services Center', 350, 200, [35,175,500,1100,1300,1500]),
    new Property('Willis Library', 400, 200, [50,200,600,1400,1700,2000])
];
const utilities = [ // creates pre-set utility objects
    new Utility('Eagle Landing'),
    new Utility('Bruce Cafeteria')
];
const busStops = [ // creates pre-set bus stop objects
    new BusStop('Discovery Park Bus Stop'),
    new BusStop('Fouts Field Bus Stop'),
    new BusStop('Mean Green Bus Stop'),
    new BusStop('Union Transfer Bus Stop')
];
const chestCards = [ // creates pre-set community chest card objects
    new Card('advanceUnion', 'Advance to the Union (Collect $200)'),
    new Card('doctorFee', 'Doctor’s fee. Pay $50'),
    new Card('schoolFee', 'Pay school fees of $50'),
    new Card('hospitalFee', 'Pay hospital fees of $100'),
    new Card('streetRepairs', 'You are assessed for street repairs. $40 per house. $115 per hotel'),
    new Card('birthday', 'It is your birthday. Collect $10 from every player'),
    new Card('beautyContest', 'You have won second prize in a beauty contest. Collect $10'),
    new Card('taxRefund', 'Income tax refund. Collect $20'),
    new Card('consultancyFee', 'Collect $25 consultancy fee'),
    new Card('stockSale', 'From sale of stock you get $50'),
    new Card('inherit', 'You inherit $100'),
    new Card('fundMatures', 'Holiday fund matures. Collect $100'),
    new Card('insuranceMatures', 'Life insurance matures. Collect $100'),
    new Card('bankError', 'Bank error in your favor. Collect $200'),
    new Card('goHell', 'Go to Parking Hell. Go directly to Parking Hell, do not pass the Union, do not collect $200'),
    new Card('hellFree', 'Get out of Parking Hell free. This card can be kept until needed')
];
const chanceCards = [	// creates pre-set chance card objects
    new Card('advanceUnion', 'Advance to the Union (Collect $200)'),
    new Card('advanceDiscovery', 'Take a trip to the Discovery Park Bus Stop.'),
    new Card('advanceKerr', 'Advance to Kerr Hall.'),
    new Card('advanceEnviSci', 'Advance to the Environmental Science Building.'),
    new Card('advanceWillis', 'Advance to Willis Library'),
    new Card('advanceUtility', 'Advance token to nearest Utility. If unowned, you may buy it from the Bank. If owned, pay owner a total ten times amount thrown'),
    new Card('advanceBusStop', 'Advance to the nearest Bus Stop. If unowned, you may buy it from the Bank. If owned, pay wonder twice the rental to which they are otherwise entitled'),
    new Card('advanceBusStop', 'Advance to the nearest Bus Stop. If unowned, you may buy it from the Bank. If owned, pay wonder twice the rental to which they are otherwise entitled'),
    new Card('backThree', 'Go back 3 spaces'),
    new Card('speedingFine', 'Pay speeding fine of $15'),
    new Card('chairman', 'You have been elected Chairman of the Board. Pay each player $50'),
    new Card('generalRepairs', 'Make general repairs on all your property. For each house pay $25. For each hotel pay $100'),
    new Card('dividend', 'Bank pays you dividend of $50'),
    new Card('loanMatures', 'Your building loan matures. Collect $150'),
    new Card('goHell', 'Go to Parking Hell. Go directly to Parking Hell, do not pass the Union, do not collect $200'),
    new Card('hellFree', 'Get out of Parking Hell free. This card can be kept until needed')
];

let houseCount = 32;    	// how many houses the bank has to sell
let hotelCount = 12;    	// how many hotels the bank has to sell
let activePlayer = 0;   	// determines which player's turn it is
let diceOne = 0;        	// first dice roll
let diceTwo = 0;        	// second dice roll
let doubleCount = 0;    	// how many consecutive doubles have been rolled
let doubleRolled = false; 	// determines if double rolled

let propertyList = []; 		// array of objects that can be sold to avoid bankruptcy or are able to be developed
let sellAmount = 0; 		// cost of propertyList object

let response = "";			// user response
let diceRollable = true; 	// determines if dice can be rolled (at beginning of turn and such)
let inputToggle = "None"; 	// determines what input is needed for


// FUNCTIONS

function updateScroll()
{
    var element = document.getElementById("log");
    element.scrollTop = element.scrollHeight;
}

function updateBalance()
{
	document.getElementById("pl1balance").innerHTML = '$' + players[0].money;
	document.getElementById("pl2balance").innerHTML = '$' + players[1].money;
	
	if(players[2].name != null){
		document.getElementById("pl3balance").innerHTML = '$' + players[2].money;
	}
	
	if(players[3].name != null){
		document.getElementById("pl4balance").innerHTML = '$' + players[3].money;
	}
}

function playerSetup(numP)
{
	for (let i=0; i<numP; i++)
	{
		//players[i].name = String(document.getElementById("p"+(i+1)+"Name").value);
		players.push(new Player(String(document.getElementById("p"+(i+1)+"Name").value)));
		console.log(players[i].name + " is player " + (i+1));
		
		var m = document.getElementById("pl3name");
		var n = document.getElementById("pl4name");
		var o = document.getElementById("pl3balance");
		var p = document.getElementById("pl4balance");
		
		switch(i){
			case 0: document.getElementById("pl1name").innerHTML = players[i].name;
				break;
			case 1: document.getElementById("pl2name").innerHTML = players[i].name;
				break;
			case 2: document.getElementById("pl3name").innerHTML = players[i].name;
				m.style.display = "inline";
				o.style.display = "inline";
				break;
			case 3: document.getElementById("pl4name").innerHTML = players[i].name;
				n.style.display = "inline";
				p.style.display = "inline";
				break;
		}
	}
	
	updateBalance();

	var x = document.getElementById("start");
	var y = document.getElementById("game")
  	if (x.style.display === "inline") {
    		x.style.display = "none";
		y.style.display = "grid";
  	} 
	else {
    		x.style.display = "none";
		y.style.display = "grid";
  	}
	
	console.log("\n" + players[activePlayer].name + "'s turn, you have $" + players[activePlayer].money + " roll the dice");
	document.getElementById('log').innerHTML += "<p>" + players[activePlayer].name + "'s turn, you have $" + players[activePlayer].money + ", roll the dice</p>";
	updateScroll();
}

function diceRoll()
{
	if (diceRollable)
	{
		doubleRolled = false;
		diceRollable = false;

		diceOne = Math.floor(Math.random() * 5 + 1); // random 1-6
		diceTwo = Math.floor(Math.random() * 5 + 1); // random 1-6
		console.log('You rolled ' + diceOne + ' and ' + diceTwo);
		document.getElementById('log').innerHTML += "<p>You rolled " + diceOne + " and " + diceTwo + "</p>";
		updateScroll();

		if (diceOne == diceTwo) // checks if player rolled double
		{
			if (players[activePlayer].inHell) // leave hell if double rolled while helled
			{
				console.log("Leaving hell");
				document.getElementById('log').innerHTML += "<p>Leaving hell</p>";
				updateScroll();
				players[activePlayer].inHell = false;
				players[activePlayer].hellTurns = 0;
				startTurn();
			}
			else
			{
				doubleCount++;
				if (doubleCount == 3) // send player to hell if three doubles rolled in a row
				{
					console.log("3 doubles rolled, go to hell");
					document.getElementById('log').innerHTML += "<p>3 doubles rolled, go to hell</p>";
					updateScroll();
					players[activePlayer].inHell = true;
					endTurn();
				}
				else
				{
					console.log("Double!");
					document.getElementById('log').innerHTML += "<p>Double!</p>";
					updateScroll();
					doubleRolled = true;
					startTurn();
				}
			}
		}
		else
		{
			if (players[activePlayer].inHell)
			{
				hellTurn();
			}
			else
			{
				startTurn();
			}
		}
	}
}

/*function lightMode(){
	//start
	document.getElementById("title").style.color = "black";
	document.getElementById("numPlayers").style.color = "black";
	document.getElementById("p1info").style.color = "black";
	document.getElementById("p2info").style.color = "black";
	document.getElementById("p3info").style.color = "black";
	document.getElementById("p4info").style.color = "black";
	document.getElementById("p1name").style.color = "black";
	document.getElementById("p2name").style.color = "black";
	document.getElementById("p3name").style.color = "black";
	document.getElementById("p4name").style.color = "black";

	//document.getElementById("button2").style.color = "black";
	//document.getElementById("button2").style.background-color = "#02de69";

	//document.getElementById("boardpng").src = "board2.PNG";

	//player info
	document.getElementById("pl1name").style.color = "black";
	document.getElementById("pl1balance").style.color = "black";
	document.getElementById("pl2name").style.color = "black";
	document.getElementById("pl2balance").style.color = "black";
	document.getElementById("pl3name").style.color = "black";
	document.getElementById("pl3balance").style.color = "black";
	document.getElementById("pl4name").style.color = "black";
	document.getElementById("pl4balance").style.color = "black";

	document.getElementById("pl1name").style.background-color = "white";
	document.getElementById("pl1balance").style.background-color = "white";
	document.getElementById("pl2name").style.background-color = "white";
	document.getElementById("pl2balance").style.background-color = "white";
	document.getElementById("pl3name").style.background-color = "white";
	document.getElementById("pl3balance").style.background-color = "white";
	document.getElementById("pl4name").style.background-color = "white";
	document.getElementById("pl4balance").style.background-color = "white";

	document.getElementById("answer").style.color = "black";
	document.getElementById("answer").style.background-color = "white";

	//log
	document.getElementById("log").style.color = "black";
	document.getElementById("log").style.background-color = "white";

	//other
	document.getElementById("d20").style.color = "black";
	document.getElementById("d20").style.background-color = "white";
}

function darkMode(){
	//start
	document.getElementById("title").style.color = "white";
	document.getElementById("numPlayers").style.color = "white";
	document.getElementById("p1info").style.color = "white";
	document.getElementById("p2info").style.color = "white";
	document.getElementById("p3info").style.color = "white";
	document.getElementById("p4info").style.color = "white";
	document.getElementById("p1name").style.color = "white";
	document.getElementById("p2name").style.color = "white";
	document.getElementById("p3name").style.color = "white";
	document.getElementById("p4name").style.color = "white";

	//document.getElementById("button2").style.color = "white";
	//document.getElementById("button2").style.background-color = "#00853E";

	//document.getElementById("boardpng").src = "board2.PNG";

	//player info
	document.getElementById("pl1name").style.color = "white";
	document.getElementById("pl1balance").style.color = "white";
	document.getElementById("pl2name").style.color = "white";
	document.getElementById("pl2balance").style.color = "white";
	document.getElementById("pl3name").style.color = "white";
	document.getElementById("pl3balance").style.color = "white";
	document.getElementById("pl4name").style.color = "white";
	document.getElementById("pl4balance").style.color = "white";

	document.getElementById("pl1name").style.background-color = "rgba(0, 0, 0, .8)";
	document.getElementById("pl1balance").style.background-color = "rgba(0, 0, 0, .8)";
	document.getElementById("pl2name").style.background-color = "rgba(0, 0, 0, .8)";
	document.getElementById("pl2balance").style.background-color = "rgba(0, 0, 0, .8)";
	document.getElementById("pl3name").style.background-color = "rgba(0, 0, 0, .8)";
	document.getElementById("pl3balance").style.background-color = "rgba(0, 0, 0, .8)";
	document.getElementById("pl4name").style.background-color = "rgba(0, 0, 0, .8)";
	document.getElementById("pl4balance").style.background-color = "rgba(0, 0, 0, .8)";

	document.getElementById("answer").style.color = "white";
	document.getElementById("answer").style.background-color = "rgba(0, 0, 0, .8)";

	//log
	document.getElementById("log").style.color = "white";
	document.getElementById("log").style.background-color = "rgba(0, 0, 0, .8)";

	//other
	document.getElementById("d20").style.color = "white";
	document.getElementById("d20").style.background-color = "rgba(0, 0, 0, .8)";
}*/


function buyHouse()
{
	if (diceRollable)
	{
		propertyList = [];
		console.log("What property would you like to develop? (Input list item number)");
		document.getElementById('log').innerHTML += "<p>What property would you like to develop? (Input list item number)</p>";
		updateScroll();
		let listNum = 0;
		for (let i = 0; i < properties.length; i++)
		{
			if (((properties[i].development < 4 && houseCount > 0) || (properties[i].development == 4 && hotelCount > 0)) && properties[i].isMonopoly && players[activePlayer].money > properties[i].houseCost)
			{
				propertyList.push([i, properties[i].name, properties[i].development, properties[i].houseCost]);
				console.log((listNum + 1) + ") " + properties[i].name + ", " + properties[i].development + " houses");
				document.getElementById('log').innerHTML += "<p>" + (listNum + 1) + ") " + properties[i].name + ", " + properties[i].development + " houses</p>";
				updateScroll();
				listNum++;
			}
		}

		if (propertyList.length == 0)
		{
			console.log("No properties can be developed");
			document.getElementById('log').innerHTML += "<p>No properties can be developed</p>";
			updateScroll();
		}
		else
		{
			inputToggle = "Buy House";
		}
	}
}

function drawCard(deck)
{
	if (deck.length > 0) // checks if deck is empty
	{
		let card = Math.floor(Math.random() * (deck.length - 1)); // selects random card from deck
		console.log(deck[card].description);
		document.getElementById('log').innerHTML += "<p>" + deck[card].description + "</p>";
		updateScroll();

		let cardType = deck[card].type;
		deck.splice(card, 1); // Remove card from deck

		switch (cardType)
		{
			case 'advanceUnion':		// Advance to the Union (Collect $200)
				players[activePlayer].position = 0;
				players[activePlayer].money += 200;
				endTurn();
				break;
			case 'advanceDiscovery':	// Take a trip to the Discovery Park Bus Stop. If you pass the Union, collect $200
				if (players[activePlayer].position > 5)
				{
					console.log("Passed the Union, collect $200");
					document.getElementById('log').innerHTML += "<p>Passed the Union, collect $200</p>";
					updateScroll();
					players[activePlayer].money += 200;
				}
				players[activePlayer].position = 5;
				busStops[0].busStopSpace(false);
				break;
			case 'advanceKerr':		// Advance to Kerr Hall. If you pass the Union, collect $200
				if (players[activePlayer].position > 11)
				{
					console.log("Passed the Union, collect $200");
					document.getElementById('log').innerHTML += "<p>Passed the Union, collect $200</p>";
					updateScroll();
					players[activePlayer].money += 200;
				}
				players[activePlayer].position = 11;
				properties[5].propertySpace();
				break;
			case 'advanceEnviSci':	// Advance to the Environmental Science Building. If you pass the Union, collect $200
				if (players[activePlayer].position > 24)
				{
					console.log("Passed the Union, collect $200");
					document.getElementById('log').innerHTML += "<p>Passed the Union, collect $200</p>";
					updateScroll();
					players[activePlayer].money += 200;
				}
				players[activePlayer].position = 24;
				properties[13].propertySpace();
				break;
			case 'advanceWillis':		// Advance to Willis Library
				players[activePlayer].position = 39;
				properties[21].propertySpace();
				break;
			case 'advanceUtility':	// Advance token to nearest Utility. If unowned, you may buy it from the Bank. If owned, pay owner a total ten times amount thrown
				if (players[activePlayer].position == 7)
				{
					players[activePlayer].position = 12;
					utilities[0].utilitySpace(true);
				}
				else if (players[activePlayer].position == 22)
				{
					players[activePlayer].position = 27;
					utilities[1].utilitySpace(true);
				}
				else if (players[activePlayer].position == 36)
				{
					players[activePlayer].position = 12;
					console.log("Passed the Union, collect $200");
					document.getElementById('log').innerHTML += "<p>Passed the Union, collect $200</p>";
					updateScroll();
					players[activePlayer].money += 200;
					utilities[0].utilitySpace(true);
				}
				break;
			case 'advanceBusStop':	// Advance to the nearest Bus Stop. If unowned, you may buy it from the Bank. If owned, pay wonder twice the rental to which they are otherwise entitled
				if (players[activePlayer].position == 7)
				{
					players[activePlayer].position = 15;
					busStops[1].busStopSpace(true);
				}
				else if (players[activePlayer].position == 22)
				{
					players[activePlayer].position = 25;
					busStops[2].busStopSpace(true);
				}
				else if (players[activePlayer].position == 36)
				{
					players[activePlayer].position = 5;
					console.log("Passed the Union, collect $200");
					document.getElementById('log').innerHTML += "<p>Passed the Union, collect $200</p>";
					updateScroll();
					players[activePlayer].money += 200;
					busStops[0].busStopSpace(true);
				}
				break;
			case 'backThree':		// Go back 3 spaces
				players[activePlayer].position -= 3;
				endTurn();
				break;
			case 'speedingFine':	// Pay speeding fine of $15
				players[activePlayer].money -= 15;
				endTurn();
				break;
			case 'doctorFee':		// Doctor’s fee. Pay $50
				players[activePlayer].money -= 50;
				endTurn();
				break;
			case 'schoolFee':		// Pay school fees of $50
				players[activePlayer].money -= 50;
				endTurn();
				break;
			case 'hospitalFee':		// Pay hospital fees of $100
				players[activePlayer].money -= 100;
				endTurn();
				break;
			case 'chairman':		// You have been elected Chairman of the Board. Pay each player $50
				for (let i = 0; i < players.length; i++)
				{
					players[activePlayer].money -= 50;
					players[i].money += 50;
				}
				endTurn();
				break;
			case 'generalRepairs':	// Make general repairs on all your property. For each house pay $25. For each hotel pay $100
				for (let i = 0; i < properties.length; i++)
				{
					if (properties[i].development < 5)
					{
						players[activePlayer].money -= properties[i].development * 25;
					}
					else
					{
						players[activePlayer].money -= 200;
					}
				}
				endTurn();
				break;
			case 'streetRepairs':	// You are assessed for street repairs. $40 per house. $115 per hotel
				for (let i = 0; i < properties.length; i++)
				{
					if (properties[i].development < 5)
					{
						players[activePlayer].money -= properties[i].development * 40;
					}
					else
					{
						players[activePlayer].money -= 275;
					}
				}
				endTurn();
				break;
			case 'birthday':		// It is your birthday. Collect $10 from every player
				for (let i = 0; i < players.length; i++)
				{
					players[i].money -= 10;
					players[activePlayer].money += 10;
				}
				endTurn();
				break;
			case 'beautyContest':	// You have won second prize in a beauty contest. Collect $10
				players[activePlayer].money += 10;
				endTurn();
				break;
			case 'taxRefund':		// Income tax refund. Collect $20
				players[activePlayer].money += 20;
				endTurn();
				break;
			case 'consultancyFee':	// Collect $25 consultancy fee
				players[activePlayer].money += 25;
				endTurn();
				break;
			case 'stockSale':		// From sale of stock you get $50
				players[activePlayer].money += 50;
				endTurn();
				break;
			case 'dividend':		// Bank pays you dividend of $50
				players[activePlayer].money += 50;
				endTurn();
				break;
			case 'inherit':			// You inherit $100
				players[activePlayer].money += 100;
				endTurn();
				break;
			case 'fundMatures':		// Holiday fund matures. Collect $100
				players[activePlayer].money += 100;
				endTurn();
				break;
			case 'insuranceMatures':	// Life insurance matures. Collect $100
				players[activePlayer].money += 100;
				endTurn();
				break;
			case 'loanMatures':		// Your building loan matures. Collect $150
				players[activePlayer].money += 150;
				endTurn();
				break;
			case 'bankError':			// Bank error in your favor. Collect $200
				players[activePlayer].money += 200;
				endTurn();
				break;
			case 'goHell':			// Go to Parking Hell. Go directly to Parking Hell, do not pass the Union, do not collect $200
				doubleRolled = false;
				players[activePlayer].inHell = true;
				players[activePlayer].position = 10;
				endTurn();
				break;
			case 'hellFree':			// Get out of Parking Hell free. This card can be kept until needed
				players[activePlayer].hellCards++;
				endTurn();
				break;
		}
	}
	else
	{
		console.log("No cards to draw");
		document.getElementById('log').innerHTML += "<p>No cards to draw</p>";
		updateScroll();
	}
}

function startTurn()
{
	players[activePlayer].position += diceOne + diceTwo;
	if (players[activePlayer].position > 39) // handles looping around board
	{
		players[activePlayer].position %= 40;
		players[activePlayer].money += 200; // pass the Union
		console.log("Passed the Union, collect $200");
		document.getElementById('log').innerHTML += "<p>Passed the Union, collect $200</p>";
		updateScroll();
	}

	midTurn();
}

function midTurn()
{
	console.log('Position is now ' + players[activePlayer].position);
	document.getElementById('log').innerHTML += "<p>Position is now " + players[activePlayer].position + "</p>";
	updateScroll();

	switch (players[activePlayer].position)
	{
		case 0:		// Union
			console.log('Landed on the Union');
			document.getElementById('log').innerHTML += "<p>Landed on the Union</p>";
			updateScroll();
			endTurn();
			break;
		case 1:		// Sage Hall
			properties[0].propertySpace();
			break;
		case 2:		// Community Chest
			console.log('Landed on Community Chest, draw a card');
			document.getElementById('log').innerHTML += "<p>Landed on Community Chest, draw a card</p>";
			updateScroll();
			drawCard(chestCards);
			break;
		case 3:		// Sycamore Hall
			properties[1].propertySpace();
			break;
		case 4:		// Tuition Payment
			console.log('Tuition payment, pay $200');
			document.getElementById('log').innerHTML += "<p>Tuition payment, pay $200</p>";
			updateScroll();
			players[activePlayer].money -= 200;
			endTurn();
			break;
		case 5:		// Discovery Park Bus Stop
			busStops[0].busStopSpace(false);
			break;
		case 6:		// Wooten Hall
			properties[2].propertySpace();
			break;
		case 7:		// Chance
			console.log('Landed on Chance, draw a card');
			document.getElementById('log').innerHTML += "<p>Landed on Chance, draw a card</p>";
			updateScroll();
			drawCard(chanceCards);
			break;
		case 8:		// Business Building
			properties[3].propertySpace();
			break;
		case 9:		// Joe Green Hall
			properties[4].propertySpace();
			break;
		case 10:	// Garage
			console.log('Landed on Garage');
			document.getElementById('log').innerHTML += "<p>Landed on Garage</p>";
			updateScroll();
			endTurn();
			break;
		case 11:	// Kerr Hall
			properties[5].propertySpace();
			break;
		case 12:	// Eagle Landing
			utilities[0].utilitySpace(false);
			break;
		case 13:	// Maple Hall
			properties[6].propertySpace();
			break;
		case 14:	// Rawlins Hall
			properties[7].propertySpace();
			break;
		case 15:	// General Acedemic Building Bus Stop
			busStops[1].busStopSpace(false);
			break;
		case 16:	// The Pit
			properties[8].propertySpace();
			break;
		case 17:	// Community Chest
			console.log('Landed on Community Chest, draw a card');
			document.getElementById('log').innerHTML += "<p>Landed on Community Chest, draw a card</p>";
			updateScroll();
			drawCard(chestCards);
			break;
		case 18:	// Pohl Recreation Center
			properties[9].propertySpace();
			break;
		case 19:	// Chesnut Hall
			properties[10].propertySpace();
			break;
		case 20:	// Voertman's
			console.log("Landed on Voertman's");
			document.getElementById('log').innerHTML += "<p>Landed on Voertman's</p>";
			updateScroll();
			endTurn();
			break;
		case 21:	// West Hall
			properties[11].propertySpace();
			break;
		case 22:	// Chance
			console.log('Landed on Chance, draw a card');
			document.getElementById('log').innerHTML += "<p>Landed on Chance, draw a card</p>";
			updateScroll();
			drawCard(chanceCards);
			break;
		case 23:	// Legends Hall
			properties[12].propertySpace();
			break;
		case 24:	// Environmental Science Building
			properties[13].propertySpace();
			break;
		case 25:	// Maple Hall Bus Stop
			busStops[2].busStopSpace(false);
			break;
		case 26:	// Chemistry Building
			properties[14].propertySpace();
			break;
		case 27:	// Bruce Cafeteria
			utilities[1].utilitySpace(false);
			break;
		case 28:	// Music Building
			properties[15].propertySpace();
			break;
		case 29:	// Chilton Hall
			properties[16].propertySpace();
			break;
		case 30:	// Go to Parking Hell
			console.log('Go to Parking Hell');
			document.getElementById('log').innerHTML += "<p>Go to Parking Hell</p>";
			updateScroll();
			doubleRolled = false;
			players[activePlayer].inHell = true;
			players[activePlayer].position = 10;
			endTurn();
			break;
		case 31:	// General Academic Building
			properties[17].propertySpace();
			break;
		case 32:	// Art Building
			properties[18].propertySpace();
			break;
		case 33:	// Community Chest
			console.log('Landed on Community Chest, draw a card');
			document.getElementById('log').innerHTML += "<p>Landed on Community Chest, draw a card</p>";
			updateScroll();
			drawCard(chestCards);
			break;
		case 34:	// Language Building
			properties[19].propertySpace();
			break;
		case 35:	// Union Bus Stop
			busStops[3].busStopSpace(false);
			break;
		case 36:	// Chance
			console.log('Landed on Chance, draw a card');
			document.getElementById('log').innerHTML += "<p>Landed on Chance, draw a card</p>";
			updateScroll();
			drawCard(chanceCards);
			break;
		case 37:	// Eagle Student Services Center
			properties[20].propertySpace();
			break;
		case 38:	// Loan Payment
			console.log('Loan payment, pay $100');
			document.getElementById('log').innerHTML += "<p>Loan payment, pay $100</p>";
			updateScroll();
			players[activePlayer].money -= 100;
			endTurn();
			break;
		case 39:	// Willis Library
			properties[21].propertySpace();
			break;
		default:
			throw new Error("Position unknown");
	}
}

function endTurn()
{
	console.log('Money is now $' + players[activePlayer].money);
	document.getElementById('log').innerHTML += "<p>Money is now $" + players[activePlayer].money + "</p>";
	updateScroll();

	if (players[activePlayer].money <= 0) // check for bankruptcy
	{
		console.log('You are now bankrupt');
		document.getElementById('log').innerHTML += "<p>You are now bankrupt</p>";
		updateScroll();
		bankrupt();
	}
	else
	{
		endTurn2();
	}
	updateBalance();
}

function endTurn2()
{
	if (!doubleRolled) // ends turn if player didn't roll double
	{
		do {
			activePlayer++;
			activePlayer %= players.length;	// returns to first player’s turn after all others
		} while (players[activePlayer].hasLost) // skips players that have lost
		doubleCount = 0;
		console.log("\n" + players[activePlayer].name + "<p>----------------------------------------</p>");
		document.getElementById('log').innerHTML += "<p>----------------------------------------</p>";
		console.log("\n" + players[activePlayer].name + "'s turn, you have $" + players[activePlayer].money + ", roll the dice");
		document.getElementById('log').innerHTML += "<p>" + players[activePlayer].name + "'s turn, you have $" + players[activePlayer].money + ", roll the dice</p>";
		updateScroll();
	}
	else
	{
		console.log("Roll again");
		document.getElementById('log').innerHTML += "<p>Roll again</p>";
		updateScroll();
	}

	diceRollable = true;
	updateBalance();
}

function hellTurn()
{
	console.log("In parking hell");
	document.getElementById('log').innerHTML += "<p>In parking hell</p>";
	updateScroll();

	players[activePlayer].hellTurns++;
	if (players[activePlayer].hellTurns == 3)
	{
		console.log("Three consecutive turns in parking hell, you will be forced to pay the fee");
		document.getElementById('log').innerHTML += "<p>Three consecutive turns in parking hell, you will be forced to pay the fee</p>";
		updateScroll();
	}

	if (players[activePlayer].hellCards > 0)
	{
		console.log("Would you like to use a Get Out of Parking Hell Free Card?");
		document.getElementById('log').innerHTML += "<p>Would you like to use a Get Out of Parking Hell Free Card?</p>";
		updateScroll();
		inputToggle = "Use Hell Card";
	}
	else
	{
		hellTurn2();
	}	
}

function hellTurn2()
{
	if (players[activePlayer].hellTurns == 3)
	{
		players[activePlayer].money -= 50;
		console.log("Paid parking fee of $50");
		document.getElementById('log').innerHTML += "<p>Paid parking fee of $50</p>";
		updateScroll();
		console.log("Leaving hell");
		document.getElementById('log').innerHTML += "<p>Leaving hell</p>";
		updateScroll();
		players[activePlayer].inHell = false;
		players[activePlayer].hellTurns = 0;
		startTurn();
	}
	else
	{
		console.log("Would you like to pay the parking fee of $50?");
		document.getElementById('log').innerHTML += "<p>Would you like to pay the parking fee of $50?</p>";
		updateScroll();
		inputToggle = "Pay Hell Fee";
	}
}

function bankrupt()
{
	propertyList = [];
	console.log("What would you like to sell? (Input list item number)");
	document.getElementById('log').innerHTML += "<p>What would you like to sell? (Input list item number)</p>";
	updateScroll();
	let listNum = 0;
	for (let i = 0; i < properties.length; i++)
	{
		if (properties[i].ownedBy == activePlayer)
		{
			// gather indexes and sell costs of all owned properties
			sellAmount = (properties[i].cost / 2) + (properties[i].development * properties[i].houseCost / 2);
			propertyList.push(['property', i, properties[i].name, sellAmount]);
			console.log((listNum + 1) + ") " + properties[i].name + " $" + sellAmount);
			document.getElementById('log').innerHTML += "<p>" + (listNum + 1) + ") " + properties[i].name + " $" + sellAmount + "</p>";
			updateScroll();
			listNum++;
		}
	}
	for (let i = 0; i < utilities.length; i++)
	{
		if (utilities[i].ownedBy == activePlayer)
		{
			// gather indexes of all owned utilities
			sellAmount = 75;
			propertyList.push(['utility', i, utilities[i].name, sellAmount]);
			console.log((listNum + 1) + ") " + utilities[i].name + " $" + sellAmount);
			document.getElementById('log').innerHTML += "<p>" + (listNum + 1) + ") " + utilities[i].name + " $" + sellAmount + "</p>";
			updateScroll();
			listNum++;
		}
	}
	for (let i = 0; i < busStops.length; i++)
	{
		if (busStops[i].ownedBy == activePlayer)
		{
			// gather indexes of all owned bus stops
			sellAmount = 100;
			propertyList.push(['bus stop', i, busStops[i].name, sellAmount]);
			console.log((listNum + 1) + ") " + busStops[i].name + " $" + sellAmount);
			document.getElementById('log').innerHTML += "<p>" + (listNum + 1) + ") " + busStops[i].name + " $" + sellAmount + "</p>";
			updateScroll();
			listNum++;
		}
	}

	if (propertyList.length == 0) // if player has nothing to sell
	{
		console.log("Nothing to sell");
		document.getElementById('log').innerHTML += "<p>Nothing to sell</p>";
		console.log(players[activePlayer].name + " has lost");
		document.getElementById('log').innerHTML += "<p>" + players[activePlayer].name + " has lost</p>";
		updateScroll();
		players[activePlayer].hasLost = true;
		doubleRolled = false;

		// check if game is over
		let playerCount = 0;
		let winningPlayer = -1;
		for (let i = 0; i < players.length; i++)
		{
			if (!players[i].hasLost)
			{
				playerCount++;
				winningPlayer = i;
			}
		}
		if (playerCount < 2)
		{
			console.log(players[winningPlayer].name + " has won!");
			document.getElementById('log').innerHTML += "<p>----------------------------------------</p>";
			document.getElementById('log').innerHTML += "<p>" + players[winningPlayer].name + " has won!</p>";
			updateScroll();
			// GAME ENDS
		}
		else
		{
			endTurn2();
		}
	}
	else
	{
		inputToggle = "Sell Property";
	}
}

// runs if user presses enter while clicked onto the input box
window.onload = function() {
    document.getElementById('answer').addEventListener('keyup', function(event)
    {
        if (event.code === 'Enter')
        {
            response = document.getElementById('answer').value;
            document.getElementById('answer').value = '';
            if (inputToggle != "None")
            {
                input();
            }
        }
    });
}

function input()
{
	if (inputToggle == "Buy House")
	{
		if (response > 0 && response <= propertyList.length)
		{
			inputToggle = "None";
			if (propertyList[response-1][2] == 4)
			{
				console.log("Bought hotel for " + propertyList[response-1][1]);
				document.getElementById('log').innerHTML += "<p>Bought hotel for " + propertyList[response-1][1] + "</p>";
				console.log(propertyList[response-1][1] + " now has 1 hotel");
				document.getElementById('log').innerHTML += "<p>" + propertyList[response-1][1] + " now has 1 hotel</p>";
				updateScroll();
				hotelCount--;
			}
			else
			{
				console.log("Bought house for " + propertyList[response-1][1]);
				document.getElementById('log').innerHTML += "<p>Bought house for " + propertyList[response-1][1] + "</p>";
				console.log(propertyList[response-1][1] + " now has " + (propertyList[response-1][2] + 1) + " house(s)");
				document.getElementById('log').innerHTML += "<p>" + propertyList[response-1][1] + " now has " + (propertyList[response-1][2] + 1) + " house(s)</p>";
				updateScroll();
				houseCount--;
			}
			players[activePlayer].money -= propertyList[response-1][3];
			properties[propertyList[response-1][0]].development++;

			console.log('Money is now $' + players[activePlayer].money);
			document.getElementById('log').innerHTML += "<p>Money is now $" + players[activePlayer].money + "</p>";
			updateScroll();
		}
		else
		{
			console.log("Incorrect input");
			document.getElementById('log').innerHTML += "<p>Incorrect input</p>";
			updateScroll();
		}
	}
	else if (inputToggle == "Sell Property")
	{
		if (response > 0 && response <= propertyList.length)
		{
			inputToggle = "None";
			switch (propertyList[response-1][0])
			{
				case "property":
					properties[propertyList[response-1][1]].ownedBy = -1;
					properties[propertyList[response-1][1]].isMonopoly = false;
					if (properties[propertyList[response-1][1]].development == 5)
					{
						hotelCount++;
					}
					else
					{
						houseCount += properties[propertyList[response-1][1]].development;
					}
					properties[propertyList[response-1][1]].development = 0;
					break;
				case "utility":
					utilities[propertyList[response-1][1]].ownedBy = -1;
					break;
				case "bus stop":
					busStops[propertyList[response-1][1]].ownedBy = -1;
					break;
			}

			players[activePlayer].money += propertyList[response-1][3];
			console.log("Sold " + propertyList[response-1][2] + " for $" + propertyList[response-1][3]);
			document.getElementById('log').innerHTML += "<p>Sold " + propertyList[response-1][2] + " for $" + propertyList[response-1][3] + "</p>";
			updateScroll();
			
			if (players[activePlayer].money <= 0)
			{
				console.log('Money is now $' + players[activePlayer].money);
				document.getElementById('log').innerHTML += "<p>Money is now $" + players[activePlayer].money + "</p>";
				updateScroll();
				bankrupt();
			}
			else
			{
				endTurn();
			}
		}
		else
		{
			console.log("Incorrect input");
			document.getElementById('log').innerHTML += "<p>Incorrect input</p>";
			updateScroll();
		}
	}
	else if (response == "Y" || response == "N" || response == "y" || response == "n")
	{
		switch (inputToggle)
		{
			case "Buy Property":
				inputToggle = "None";
				if (response == "Y" || response == "y")
				{
					switch (players[activePlayer].position)
					{
						case 1:		// Sage Hall
							properties[0].buyProperty();
							properties[0].checkMonopoly(2, 1, undefined);
							break;
						case 3:		// Sycamore Hall
							properties[1].buyProperty();
							properties[1].checkMonopoly(2, 0, undefined);
							break;
						case 6:		// Wooten Hall
							properties[2].buyProperty();
							properties[2].checkMonopoly(3, 3, 4);
							break;
						case 8:		// Business Building
							properties[3].buyProperty();
							properties[3].checkMonopoly(3, 2, 4);
							break;
						case 9:		// Joe Green Hall
							properties[4].buyProperty();
							properties[4].checkMonopoly(3, 2, 3);
							break;
						case 11:	// Kerr Hall
							properties[5].buyProperty();
							properties[5].checkMonopoly(3, 6, 7);
							break;
						case 13:	// Maple Hall
							properties[6].buyProperty();
							properties[6].checkMonopoly(3, 5, 7);
							break;
						case 14:	// Rawlins Hall
							properties[7].buyProperty();
							properties[7].checkMonopoly(3, 5, 6);
							break;
						case 16:	// The Pit
							properties[8].buyProperty();
							properties[8].checkMonopoly(3, 9, 10);
							break;
						case 18:	// Pohl Recreation Center
							properties[9].buyProperty();
							properties[9].checkMonopoly(3, 8, 10);
							break;
						case 19:	// Chesnut Hall
							properties[10].buyProperty();
							properties[10].checkMonopoly(3, 8, 9);
							break;
						case 21:	// West Hall
							properties[11].buyProperty();
							properties[11].checkMonopoly(3, 12, 13);
							break;
						case 23:	// Legends Hall
							properties[12].buyProperty();
							properties[12].checkMonopoly(3, 11, 13);
							break;
						case 24:	// Environmental Science Building
							properties[13].buyProperty();
							properties[13].checkMonopoly(3, 11, 12);
							break;
						case 26:	// Chemistry Building
							properties[14].buyProperty();
							properties[14].checkMonopoly(3, 15, 16);
							break;
						case 28:	// Music Building
							properties[15].buyProperty();
							properties[15].checkMonopoly(3, 14, 16);
							break;
						case 29:	// Chilton Hall
							properties[16].buyProperty();
							properties[16].checkMonopoly(3, 14, 15);
							break;
						case 31:	// General Academic Building
							properties[17].buyProperty();
							properties[17].checkMonopoly(3, 18, 19);
							break;
						case 32:	// Art Building
							properties[18].buyProperty();
							properties[18].checkMonopoly(3, 17, 19);
							break;
						case 34:	// Language Building
							properties[19].buyProperty();
							properties[19].checkMonopoly(3, 17, 18);
							break;
						case 37:	// Eagle Student Services Center
							properties[20].buyProperty();
							properties[20].checkMonopoly(2, 21, undefined);
							break;
						case 39:	// Willis Library
							properties[21].buyProperty();
							properties[21].checkMonopoly(2, 20, undefined);
							break;
						default:
							throw new Error("Position unknown");
					}
				}
				else
				{
					// AUCTION
				}
				endTurn();
				break;
			case "Buy Utility":
				inputToggle = "None";
				if (response == "Y" || response == "y")
				{
					switch (players[activePlayer].position)
					{
						case 12:	// Eagle Landing
							utilities[0].buyUtility();
							break;
						case 27:	// Bruce Cafeteria
							utilities[1].buyUtility();
							break;
						default:
							throw new Error("Position unknown");
					}
				}
				else
				{
					// AUCTION
				}
				endTurn();
				break;
			case "Buy Bus Stop":
				inputToggle = "None";
				if (response == "Y" || response == "y")
				{
					switch (players[activePlayer].position)
					{
						case 5:		// Discovery Park Bus Stop
							busStops[0].buyBusStop();
							break;
						case 15:	// General Acedemic Building Bus Stop
							busStops[1].buyBusStop();
							break;
						case 25:	// Maple Hall Bus Stop
							busStops[2].buyBusStop();
							break;
						case 35:	// Union Bus Stop
							busStops[3].buyBusStop();
							break;
						default:
							throw new Error("Position unknown");
					}
				}
				else
				{
					// AUCTION
				}
				endTurn();
				break;
			case "Use Hell Card":
				inputToggle = "None";
				if (response == "Y" || response == "y")
				{
					players[activePlayer].hellCards--;
					console.log("Leaving hell");
					document.getElementById('log').innerHTML += "<p>Leaving hell</p>";
					updateScroll();
					players[activePlayer].inHell = false;
					players[activePlayer].hellTurns = 0;
					startTurn();
				}
				else
				{
					hellTurn2();
				}
				break;
			case "Pay Hell Fee":
				inputToggle = "None";
				if (response == "Y" || response == "y")
				{
					players[activePlayer].money -= 50;
					console.log("Paid parking fee");
					document.getElementById('log').innerHTML += "<p>Paid parking fee</p>";
					updateScroll();
					console.log("Leaving hell");
					document.getElementById('log').innerHTML += "<p>Leaving hell</p>";
					updateScroll();
					players[activePlayer].inHell = false;
					players[activePlayer].hellTurns = 0;
					startTurn();
				}
				else
				{
					endTurn();
				}
				break;
			default:
				throw new Error("Input toggle unknown");
		}
	}
	else if (inputToggle != "None")
	{
		console.log("Incorrect input, only enter 'Y', 'y', 'N', or 'n'");
		document.getElementById('log').innerHTML += "<p>Incorrect input, only enter 'Y', 'y', 'N', or 'n'</p>";
		updateScroll();
	}
}
