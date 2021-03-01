
//*************** */ variable declarations*******************

var currentValues = $(".current");
var currentContributions = $(".monthly-contribution");
var currentAllocations = $(".allocation");
var futureValues = $(".future-value");
var futureAllocations = $(".future-allocation");
var interest = $(".interest");
var total = 0;
var futuretotal = 0;
var futurevaluesarray = [];
var bitcoinprice = 0;

var myChart = $("#myChart")[0].getContext("2d");
var massPopChart = new Chart(myChart, {
  type:'bar',// bar, horizontalBar, pie, line, doughnut, radar, polarArea
  data: {
    labels:["2022", "2023", "2024", "2025", "2026", "2027"],
    datasets: [{
      label: 'Future Value',
      data: [
        617594,
        181045,
        106519,
        105162,
        95072
      ],
      // backgroundColor: "green"
      backgroundColor: [
        "green",
        "blue",
        "red",
        "yellow",
        "orange"
      ],
      borderWidth:1,
      borderColor:"gray",
      hoverBorderWidth: 3,
      hoverBorderColor: "black"
    }]
  },
  options: {}
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




function NumberEx(input) {
  if (isNaN(input)) {
    return 0;
  }
  return input;
}


//********************* sum function *********************//
function add(array) {

  var sum = 0;


_.each(array, function(element, index) {
  var tempsum = NumberEx(parseFloat(array[index].value));

  sum += tempsum;
})

    total= sum;

    return sum.toFixed(2);

}

// ******************* allocation calculation ********************* //

function calculateAllocation(total, current) {

  //using _.each
  var percent = NumberEx(((current / total) * 100).toFixed(2));

  return percent + " %";


}

// ******************** compound interest calculation *********************** //

function compoundCalculation(principal, monthlycont, interestrate, years) {


  var result = (principal * (Math.pow((1 + (interestrate/12)), (12 * years)))) + (monthlycont * (      (Math.pow(  (1 + (interestrate/12))  , ((12 * years)   )      )        -1           )     /            (interestrate/12)     ));


// + (monthlycont * (      (Math.pow(  (1 + (interestrate/12))  , ((12 * years) -  1  )       )                        /            (interestrate/12)     )))


  // monthlycont * (      (Math.pow(  (1 + (interestrate/12))  , ((12 * years) -  1  )       )                        /            (interestrate/12)     )
  // var result = (principal * Math.pow((1 + interestrate), (years))) + (monthlycont * ((Math.pow((1 + (interestrate/12)), (years * 12)) - 1) / (interestrate/12)));

  if (isNaN(result)) {
    result = 0;
  }

  return result.toFixed(2);


};


// **************************** when an input with the class "current" changes ****************//



$(".current").change(function() {

  this.value = NumberEx(parseFloat($(this).val()).toFixed(2));

  // **************** total current value calculation ************************** //

  // new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD'}).format(add(currentValues));
  $("#total-current-value").text(new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD'}).format(add(currentValues)));


  // **************** calculate allocation field ********************************* //
  for (var i = 0; i < currentAllocations.length; i++) {

    var current = parseFloat(currentValues[i].value);

    currentAllocations[i].innerHTML = calculateAllocation(total, current);
  }

  // calculateAllocation(currentAllocations, currentValues);


})


//*********************** */ when monthly contribution field changes ************************** //



$(".monthly-contribution").change(function() {



  this.value = NumberEx(parseFloat($(this).val()).toFixed(2));


  $("#total-contribution").text(new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD'}).format(add(currentContributions)));

})

$("#bitcoin-help").click(function() {

})


$("#input-years").change(function() {

})
// *********************** Calculate Compound Interest ********************** //

$(".reset").click(function() {
  window.location.reload();
});

$(".calculate").click(function() {

  if ($("#input-years").val() < 1) {

  $("#input-years").val(1);

  }



  //********* */ future values calculation

  for (var i = 0; i < futureValues.length; i++) {

    var principal = parseFloat(currentValues[i].value);
    var monthlycont = parseFloat(currentContributions[i].value);
    var interestrate = (parseFloat(interest[i].value)) * .01;
    var years = parseFloat($("#input-years").val());

    var futurenumber = parseFloat(compoundCalculation(principal, monthlycont, interestrate, years));
    futureValues[i].innerHTML = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD'}).format(futurenumber);


    // push future values to array and update total future value //
    futurevaluesarray.push(futurenumber);
    futuretotal += futurenumber;
  }

  //*********** */ future sum calculation

  $("#results").text(function() {



    if ($("#input-years").val() === "1") {
      return "In " + $("#input-years").val() + " year, you will have " + new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD'}).format(futuretotal) + "!";
      // return "In " + $("#input-years").val() + " year, you will have $" + futuretotal.toFixed(2) + "!";
    }
    return "In " + $("#input-years").val() + " years, you will have " + new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD'}).format(futuretotal) + "!";
  });

  //***************** */ future allocations ************************** //

  // for (var i = 0; i < futureAllocations.length; i++) {
    for (var i = 0; i < futureAllocations.length; i++) {

      var current = futurevaluesarray[i];
      var total = parseFloat(futuretotal);

      futureAllocations[i].innerHTML = calculateAllocation(total, current);
    }

  // reset future total

  futuretotal = 0;
  futurevaluesarray = [];


})



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

