
//*************** */ variable declarations*******************

var currentValues = $(".current");
var currentContributions = $(".monthly-contribution");
var interest = $(".interest");
var total = 0;

// chart
var myChart = $("#myChart")[0].getContext("2d");
var massPopChart = new Chart(myChart, {
  type:'line',// bar, horizontalBar, pie, line, doughnut, radar, polarArea
  data: {
    labels: [],
    // labels:["2022", "2023", "2024", "2025", "2026", "2027"],
    datasets: [{
      label: 'Future Value',
      data: [],
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

//  massPopChart.data.datasets[0].data.push(100);


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

  $("#result-section").addClass("hidden");

  if (parseFloat($("#input-years").val()) <= 0) {
    alert("Hey WTF?!");
  }

  else {

  $("#result-section").removeClass("hidden");

  total = 0;
  massPopChart.data.labels = [];

  massPopChart.data.datasets[0].data = [];

  var time = isNumber(parseFloat($("#input-years").val()));

  var yearzero = 0;


  for (var i = 0; i < currentValues.length; i++) {
    // total = total + isNumber(parseInt(currentValues[i].value));
    var principal = isNumber(parseFloat(currentValues[i].value));
    var monthlycont = isNumber(parseFloat(currentContributions[i].value));
    var returnrate = isNumber(parseFloat(interest[i].value) * .01);
    var timeframe = isNumber(parseFloat($("#input-years").val()));

    // massPopChart.data.datasets.data.push(100);
    total = total + parseFloat(compoundCalculation(principal, monthlycont, returnrate, timeframe));

    //

    yearzero = yearzero + principal;

  }

  massPopChart.data.datasets[0].data.push(yearzero);
  // for each year
  for (var j = 1; j <= time; j++) {

  // set counter variable to zero
    var value = 0;

  // iterate through each asset class
    for (var x = 0; x < currentValues.length; x++) {

      var principal = isNumber(parseFloat(currentValues[x].value));
      var monthlycont = isNumber(parseFloat(currentContributions[x].value));
      var returnrate = isNumber(parseFloat(interest[x].value) * .01);

      // send each asset class through compoundcalculator using the year number
      // add the value of each asset class after jye ars to value
      value = value + parseFloat(compoundCalculation(principal, monthlycont, returnrate, j));

    }


    // push value to y axis
    massPopChart.data.datasets[0].data.push(value.toFixed(2));

    // reset value back to zero for next iteration
    value = 0;
  }


  // $("#total-future-value").html(new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD'}).format(total));
  var futuretotal = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD'}).format(total);

  $(".result").html("In " + timeframe + " years, you will have " + futuretotal);

  for (var i = 0; i <= timeframe; i++) {
    massPopChart.data.labels.push(2021 + i);

    // massPopChart.data.datasets[0].data.push(100);
  }





}
})


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

// ************************************************************************ //

// $("#help-box").slideUp();

$("#bitcoin-help").click(function () {

  //  $("#help-box").css("display", "block");
   $("#interest-current-price").val(bitcoinprice.toFixed(2));

   });


  //  $("#interest-copy").click(function() {
  //   $("#help-box").css("display", "none");
  //  });

   $("#close").click(function() {
    $("#help-box").css("display", "none");
   });


  $(".current").attr("value", "0");
  $(".monthly-contribution").attr("value", "0");
  $(".interest").attr("value", "0");



  function calcInterestRate(currentprice, futureprice, years) {

    var result = (12 * (Math.pow((futureprice/currentprice), (1/(12 * years))) -1)) * 100;


    return result.toFixed(3);

  };

  // // interest rate help page//


var bitcoinrate = 0;
var inputyears = 0;

$("#interest-calculate").click(function() {

  var current = parseFloat($("#interest-current-price").val());
  var future =  parseFloat($("#interest-future-price").val());
  var years = (parseFloat($("#interest-year").val())) - 2021;

  var result = calcInterestRate(current, future, years);
  bitcoinrate = result;
  inputyears = years


  $("#final-result").html("The average annual return is " + result + "% over " + years + " year(s)");



});

$("#interest-copy").click(function() {
  $("#bitcoin-expected-interest").val(bitcoinrate);

})

$("#years-copy").click(function() {
  $("#input-years").val(inputyears);
})

bitcoinrate = 0;