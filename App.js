// const obj={
//     "Meta Data": {
//         "1. Information": "Daily Prices (open, high, low, close) and Volumes",
//         "2. Symbol": "IBM",
//         "3. Last Refreshed": "2023-08-17",
//         "4. Output Size": "Compact",
//         "5. Time Zone": "US/Eastern"
//       },
//     "Time Series (Daily)": {
//         "2023-08-17": {
//           "1. open": "141.1100",
//           "2. high": "142.6500",
//           "3. low": "140.6000",
//           "4. close": "140.6600",
//           "5. volume": "3739739"
//         },
//     }
// }


const watchListArray = [];

const searchBtn = document.querySelector("#search-btn");
async function getStockData(symbol, time) {
    const response = await fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_${time}&symbol=${symbol}&interval=5min&apikey=3CX8CDELLLNSKW4F`);
    const result = await response.json();
    // console.log(result);

    return result;
}



searchBtn.addEventListener("click", () => {
    const searchInput = document.querySelector("#search-input").value;
    console.log("input: " + searchInput);

    const timeFrame = document.querySelector('input[type="radio"]:checked').value;
    console.log("time: " + timeFrame);

    const stock = getStockData(searchInput, timeFrame); //add some parameters
    stock.then((stock) => {

        watchListArray.push({ stock: stock, symbol: stock["Meta Data"]["2. Symbol"].toUpperCase(), timeFrame: timeFrame });
        // console.log(watchListArray);

        const price = Object.values(Object.values(stock)[1])[0]["1. open"];
        console.log(price + " price");

        addToWatchList(stock["Meta Data"]["2. Symbol"].toUpperCase(), price, timeFrame)

    }).catch(reject => alert("Record Not Found !"));

})

function addToWatchList(sym = "Sample", price = 100.00, time = "SAMPLE") {
    const stockElement = document.querySelector("#stocks");

    const stockDiv = document.createElement("div");
    stockDiv.classList.add("stock", "curve-edge");
    stockDiv.id = `${sym}-${time}`;
    stockDiv.addEventListener("click", handleStockClick);

    const stockSymbol = document.createElement("div");
    stockSymbol.classList.add("symbol");
    stockSymbol.innerText = sym.toUpperCase();

    const stockPrice = document.createElement("div");
    stockPrice.classList.add("price");
    stockPrice.innerText = price;

    const stockTime = document.createElement("div");
    stockTime.classList.add("time")
    stockTime.innerText = time;

    const dltBtn = document.createElement("button");
    dltBtn.classList.add("delete-btn");
    dltBtn.addEventListener("click", handleDltStock);

    const dltIcon = document.createElement("i");
    dltIcon.classList.add("fa-solid", "fa-xmark");

    stockDiv.appendChild(stockSymbol);
    stockDiv.appendChild(stockPrice);
    stockDiv.appendChild(stockTime);
    stockDiv.appendChild(dltBtn);
    dltBtn.appendChild(dltIcon);

    stockElement.appendChild(stockDiv);
}

function handleDltStock(e) {
    watchListArray.remove(e.currentTarget.parentNode);
    e.currentTarget.parentNode.parentNode.removeChild(e.currentTarget.parentNode)
    console.log("Stock deleted");
}
function handleStockClick(e) {
    console.log(e.currentTarget.id);
    showDetails(e.currentTarget.id);
}

// showDetails("IBM-INTRADAY");

async function showDetails(id) {
    const modal = document.querySelector("#stock-info");
    modal.classList.toggle("hide");


    const [symbol, timeFrame] = id.split("-");
    console.log(symbol + "---" + timeFrame);
    const response = await fetch("obj.json");

    const result = await response.json();

    const dateArray = Object.entries(Object.values(result)[1]);
    for (let [date, obj] of dateArray) {
        // console.log(date);
        populateDetailsSection(date, obj);
    }
}

function populateDetailsSection(date, obj) {
    
    const tableRow=document.createElement("div");
    tableRow.classList.add("table-row");

    const dateDiv=document.createElement("div");
    dateDiv.classList.add("data-cell");
    dateDiv.innerText=date;
    tableRow.appendChild(dateDiv);

    for(let val of Object.values(obj)){
        const cell=document.createElement("div");
        cell.classList.add("data-cell");
        cell.innerText=Number(val).toFixed(2);
        tableRow.appendChild(cell);
    }
    document.querySelector("#details").appendChild(tableRow);    
}
