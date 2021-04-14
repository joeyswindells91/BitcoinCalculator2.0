
//*************** */ variable declarations*******************

var currentValues = $(".current");
var currentContributions = $(".monthly-contribution");
var interest = $(".interest");
// var inflation = $("#inflation-rate");
var total = 0;
var currentBitcoinPrice = 0;
var futureBitcoinPrice = 0;
var futureBitcoinValue = 0;
var futureEquitiesValue = 0;
var futureFixedIncomeValue = 0;
var futureFiatValue = 0;


// chart
// var myChart = $("#myChart")[0].getContext("2d");
// var massPopChart = new Chart(myChart, {
//   type:'line',// bar, horizontalBar, pie, line, doughnut, radar, polarArea
//   data: {
//     labels: [],
//     // labels:["2022", "2023", "2024", "2025", "2026", "2027"],
//     datasets: [{
//       label: 'Future Value',
//       data: [],
//       // backgroundColor: "green"
//       backgroundColor: [
//         "orange"
//       ],
//       borderWidth:1,
//       borderColor:"orange",
//       hoverBorderWidth: 3,
//       hoverBorderColor: "black"
//     }]
//   },
//   options:{
//     title:{
//       display:true,
//       text:"Year By Year Future Value"
//     }
//   }
// });

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

function ConvertToNumber(numberString) {

  var result = Number(numberString.replace(/[^0-9.-]+/g,""));

  return result;
}


// var currency = "-$4,400.50";
// var number = Number(currency.replace(/[^0-9.-]+/g,""));

$("#calculate").click(function() {

  $("#result-section").addClass("hidden");

  for (var i = 0; i < currentValues.length; i++) {
    if (currentValues[i].value < 0) {
      alert("Make sure all current values are at least 0");
    }
  }

  for (var i = 0; i < currentContributions.length; i++) {
    if (currentContributions[i].value < 0) {
      alert("Make sure all monthly contribution values are at least 0");
    }
  }



  if (parseFloat($("#input-years").val()) <= 0) {
    alert("Please input a timeframe value greater than 0.");
  }


  else {

  $("#result-section").removeClass("hidden");

  total = 0;
  // massPopChart.data.labels = [];

  // massPopChart.data.datasets[0].data = [];

  var time = isNumber(parseFloat($("#input-years").val()));

  var yearzero = 0;


  for (var i = 0; i < currentValues.length; i++) {
    // total = total + isNumber(parseInt(currentValues[i].value));
    var principal = isNumber(parseFloat(ConvertToNumber(currentValues[i].value)));
    var monthlycont = isNumber(parseFloat(ConvertToNumber(currentContributions[i].value)));
    var returnrate = isNumber(parseFloat(interest[i].value) * .01);
    var timeframe = isNumber(parseFloat($("#input-years").val()));

    // massPopChart.data.datasets.data.push(100);
    total = total + parseFloat(compoundCalculation(principal, monthlycont, returnrate, timeframe));

    if (i === 0) {
      futureBitcoinPrice = parseFloat(compoundCalculation(currentBitcoinPrice, 0, returnrate, timeframe));
      futureBitcoinValue = parseFloat(compoundCalculation(principal, monthlycont, returnrate, timeframe));
    }

    if (i === 1) {

      futureEquitiesValue = parseFloat(compoundCalculation(principal, monthlycont, returnrate, timeframe));
    }

    if (i === 2) {
      futureFixedIncomeValue = parseFloat(compoundCalculation(principal, monthlycont, returnrate, timeframe));
    }

    if (i === 3) {
      futureFiatValue = parseFloat(compoundCalculation(principal, monthlycont, returnrate, timeframe));
    }

    //

    yearzero = yearzero + principal;

  }

  // massPopChart.data.datasets[0].data.push(yearzero);

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
      // add the value of each asset class after years to value
      value = value + parseFloat(compoundCalculation(principal, monthlycont, returnrate, j));

    }


    // push value to y axis

    // massPopChart.data.datasets[0].data.push(value.toFixed(2));

    // reset value back to zero for next iteration
    value = 0;
  }


  // $("#total-future-value").html(new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD'}).format(total));
  var futuretotal = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD'}).format(total);

  if (timeframe === 1) {
    $(".result").html("In " + timeframe + " year, you will have " + futuretotal + " Fiat Dollars");
  }

  else {
    $(".result").html("In " + timeframe + " years, you will have " + futuretotal + " Fiat Dollars");
  }

  $("#bitcoin-price").html("Bitcoin price : " + new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD'}).format(futureBitcoinPrice));

  // var futuredollarvalue = ConvertToNumber($(".result").html());
  var futureBitcoin = ConvertToNumber($("#bitcoin-price").html());

  // $("#future-value-in-bitcoin").html(((ConvertToNumber(futuretotal)/futureBitcoin).toFixed(8)) + " Bitcoins");



  $("#bitcoin-value").html("Bitcoin : " + new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD'}).format(futureBitcoinValue));

  $("#equities-value").html("Equities : " + new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD'}).format(futureEquitiesValue));

  $("#fixedincome-value").html("Fixed Income : " + new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD'}).format(futureFixedIncomeValue));

  $("#fiat-value").html("US Dollars : " + new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD'}).format(futureFiatValue));

  // $(".future-bitcoin-amount").html((futureBitcoinValue/futureBitcoinPrice).toFixed(8));

  if (timeframe === 1) {
    $(".future-bitcoin-amount").html("In " + timeframe + " year, you will have " + (isNumber(futureBitcoinValue/futureBitcoinPrice)).toFixed(8) + " Bitcoin");
  }

  else {
    $(".future-bitcoin-amount").html("In " + timeframe + " years, you will have " + (isNumber(futureBitcoinValue/futureBitcoinPrice)).toFixed(8) + " Bitcoin");
  }


  // for (var i = 0; i <= timeframe; i++) {
  //   massPopChart.data.labels.push(2021 + i);

  //   // massPopChart.data.datasets[0].data.push(100);
  // }


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

        currentBitcoinPrice = isNumber(parseFloat(bitcoinprice));

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


  // $(".current").attr("value", "0");
  // $(".monthly-contribution").attr("value", "0");
  $(".interest").attr("value", "0");



  function calcInterestRate(currentprice, futureprice, years) {

    var result = (12 * (Math.pow((futureprice/currentprice), (1/(12 * years))) -1)) * 100;

    if (isNaN(result)) {
      return 0;
    }

    return result.toFixed(3);

  };

  // // interest rate help page//


var bitcoinrate = 0;
var inputyears = 0;

$("#interest-calculate").click(function() {

  if ($("#interest-year").val() < 2022) {
    alert("Input a year greater than 2021");
  }

  else {

  var current = parseFloat($("#interest-current-price").val());
  var future =  parseFloat($("#interest-future-price").val());
  var years = (parseFloat($("#interest-year").val())) - 2021;

  var result = calcInterestRate(current, future, years);
  bitcoinrate = result;
  inputyears = years


  $("#final-result").html("The average annual return is " + result + "% over " + years + " year(s)");

  };

});

$("#interest-copy").click(function() {
  $("#bitcoin-expected-interest").val(bitcoinrate);

})

$("#years-copy").click(function() {
  $("#input-years").val(inputyears);
})

bitcoinrate = 0;

$(".reset").click(function() {
  $("input").val(0);
});








// Input Field Script

// $("input[data-type='currency']").on({
//   keyup: function() {
//     formatCurrency($(this));
//   },
//   blur: function() {
//     formatCurrency($(this), "blur");
//   }
// });


// function formatNumber(n) {
// // format number 1000000 to 1,234,567
// return n.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")
// }


// function formatCurrency(input, blur) {
// // appends $ to value, validates decimal side
// // and puts cursor back in right position.

// // get input value
// var input_val = input.val();

// // don't validate empty input
// if (input_val === "") { return; }

// // original length
// var original_len = input_val.length;

// // initial caret position
// var caret_pos = input.prop("selectionStart");

// // check for decimal
// if (input_val.indexOf(".") >= 0) {

//   // get position of first decimal
//   // this prevents multiple decimals from
//   // being entered
//   var decimal_pos = input_val.indexOf(".");

//   // split number by decimal point
//   var left_side = input_val.substring(0, decimal_pos);
//   var right_side = input_val.substring(decimal_pos);

//   // add commas to left side of number
//   left_side = formatNumber(left_side);

//   // validate right side
//   right_side = formatNumber(right_side);

//   // On blur make sure 2 numbers after decimal
//   if (blur === "blur") {
//     right_side += "00";
//   }

//   // Limit decimal to only 2 digits
//   right_side = right_side.substring(0, 2);

//   // join number by .
//   input_val = "$" + left_side + "." + right_side;

// } else {
//   // no decimal entered
//   // add commas to number
//   // remove all non-digits
//   input_val = formatNumber(input_val);
//   input_val = "$" + input_val;

//   // final formatting
//   if (blur === "blur") {
//     input_val += ".00";
//   }
// }

// // send updated string to input
// input.val(input_val);

// // put caret back in the right position
// var updated_len = input_val.length;
// caret_pos = updated_len - original_len + caret_pos;
// input[0].setSelectionRange(caret_pos, caret_pos);
// }

// ********************************************************


// THINGS TO ADD

// ADD IN BITCOIN JOKES WHEN USERS CLICK ON EQUITIES/BONDS/CASH/SHITCOINS
// ADD IN ABILITY TO TYPE IN AMOUNT OF BITCOIN OWNED
// *******************

$(".bitcoin-amount").change(function () {
  $(".bitcoin-current").val(function () {
    var result = $(".bitcoin-amount").val() * currentBitcoinPrice;

    return result;
  })
})

$(".current").change(function () {

  var currentValue = 0;

  for (var i = 0; i < currentValues.length; i++) {
    currentValue = currentValue + ConvertToNumber(currentValues[i].value);
  }

  // $("#value-in-bitcoin").html(((currentValue/currentBitcoinPrice).toFixed(8)) + " Bitcoins");
})


// Tip Bitcoin Wallet Address code


function copyToClipboard(element) {
  var $temp = $("<input>");
  $("body").append($temp);
  $temp.val($(element).text()).select();
  document.execCommand("copy");
  $temp.remove();
}





$(".current").change(function () {
  // Create USD currency formatter.
var formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

// Use it.

var amount = ConvertToNumber($(this).val());
// var amount = document.getElementById('input').innerHTML;
$(this).val(formatter.format(amount));
})
