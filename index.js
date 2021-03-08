
//*************** */ variable declarations*******************

var currentValues = $(".current");
var currentContributions = $(".monthly-contribution");
var interest = $(".interest");
var total = 0;


// determines if input is a number or not, if not- return 0
function isNumber(input) {
  if (isNaN(input)) {
    return 0;
  }
  return input;
}

// compound calculation

function compoundCalculation(principal, monthlycont, interestrate, years) {


  var result = (principal * (Math.pow((1 + (interestrate/12)), (12 * years)))) + (monthlycont * (      (Math.pow(  (1 + (interestrate/12))  , ((12 * years)   )      )        -1           )     /            (interestrate/12)     ));

  if (isNaN(result)) {
    result = 0;
  }

  return result.toFixed(2);


};


$("#calculate").click(function() {

  total = 0;

  for (var i = 0; i < currentValues.length; i++) {
    // total = total + isNumber(parseInt(currentValues[i].value));
    var principal = isNumber(parseFloat(currentValues[i].value));
    var monthlycont = isNumber(parseFloat(currentContributions[i].value));
    var returnrate = isNumber(parseFloat(interest[i].value) * .01);
    var timeframe = isNumber(parseFloat($("#years").val()));


    total = total + parseFloat(compoundCalculation(principal, monthlycont, returnrate, timeframe));
  }

  $("#total-future-value").html(new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD'}).format(total));



})


// chart
var myChart = $("#myChart")[0].getContext("2d");
var massPopChart = new Chart(myChart, {
  type:'bar',// bar, horizontalBar, pie, line, doughnut, radar, polarArea
  data: {
    labels:["2022", "2023", "2024", "2025", "2026", "2027"],
    datasets: [{
      label: 'Future Value',
      data: [
        0,
        250000,
        400000,
        800000,
        1200000,
        2000000
      ],
      // backgroundColor: "green"
      backgroundColor: [
        "blue"
      ],
      borderWidth:1,
      borderColor:"blue",
      hoverBorderWidth: 3,
      hoverBorderColor: "black"
    }]
  },
  options:{
    title:{
      display:true,
      text:"Year By Year Future Value"
    }
  }
});


// ******************** bitcoin price update ************************ //

// var btn = document.querySelector("button");
var btcPriceDisplay = document.querySelector("#btcPrice");
var currSymbol = "USD";
// var	currencyDesc = document.querySelector("#currencyDesc");


function myFunction() {
  setInterval(function(){

    var XHR = new XMLHttpRequest();

  XHR.onreadystatechange = function(){
     if(XHR.readyState == 4 && XHR.status == 200){
       var data = JSON.parse(XHR.responseText);
        price = data.bpi.USD.rate;
        bitcoinprice = data.bpi.USD.rate_float;
        symbol = data.bpi[currSymbol].code;
        desc = data.bpi.USD.description;
        btcPriceDisplay.innerText = "1 Bitcoin = $" + price;

        // currncySymbol.innerText =  currSymbol;
        // currencyDesc.innerText = desc;
       }
    }
    var url = "https://api.coindesk.com/v1/bpi/currentprice.json";
    XHR.open("GET", url);
    XHR.send();


  }, 100);
}

myFunction();

// ************************************************************************ //

