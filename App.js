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
    // const response = await fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=IBM&interval=5min&apikey=demo`);
    const result = await response.json();
    // console.log(result);

    return result;
}

searchBtn.addEventListener("click", () => {
    init();
    const searchInput = document.querySelector("#search-input").value;
    // console.log("input: " + searchInput);

    const timeFrame = document.querySelector('input[type="radio"]:checked').value;
    // console.log("time: " + timeFrame);

    const stock = getStockData(searchInput, timeFrame); //add some parameters
    stock.then((stock) => {
        console.log(stock);
        if(!watchListArray.includes(stock)){
            watchListArray.push(stock);
            // watchListArray.push({ stock: stock, symbol: stock["Meta Data"]["2. Symbol"].toUpperCase(), timeFrame: timeFrame });
            console.log(watchListArray);
    
            const price = Object.values(Object.values(stock)[1])[0]["1. open"];
            // console.log(price + " price");

            addToWatchList(stock["Meta Data"]["2. Symbol"].toUpperCase(), price, timeFrame)
        }

    }).catch(reject => alert("Record Not Found !"));

})

function addToWatchList(sym = "Sample", price = 100.00, time = "SAMPLE") {
    const stockElement = document.querySelector("#stocks");

    const stockDiv = document.createElement("div");
    const stockInfo = document.createElement("div");

    stockDiv.classList.add("stock", "curve-edge");
    stockInfo.classList.add("stock-info");
    stockDiv.id = `${sym}-${time}`;
    stockInfo.addEventListener("click", handleStockClick);

    const stockSymbol = document.createElement("div");
    stockSymbol.classList.add("symbol","info-item");
    stockSymbol.innerText = sym.toUpperCase();

    const stockPrice = document.createElement("div");
    stockPrice.classList.add("price","info-item");
    stockPrice.innerText = price;
    setColor(stockPrice,price);

    const stockTime = document.createElement("div");
    stockTime.classList.add("time","info-item")
    stockTime.innerText = time;

    const dltBtn = document.createElement("button");
    dltBtn.classList.add("delete-btn");
    dltBtn.addEventListener("click", handleDltStock);

    const dltIcon = document.createElement("i");
    dltIcon.classList.add("fa-solid", "fa-xmark");

    stockInfo.appendChild(stockSymbol);
    stockInfo.appendChild(stockPrice);
    stockInfo.appendChild(stockTime);
    stockDiv.appendChild(stockInfo);
    stockDiv.appendChild(dltBtn);
    dltBtn.appendChild(dltIcon);

    stockElement.appendChild(stockDiv);
}

function handleDltStock(e) {
    // watchListArray.map((stock)=>{
    //     if(stock["Meta Data"]["2. Symbol"]===e.parentNode.id.split("-")[0]){
    //         watchListArray.remove(stock);
    //     }
    // })
    // e.stopPropogation();
    if(e.currentTarget.parentNode.classList.contains("selected")){
        console.log(e.currentTarget);
        showSiblings(e.currentTarget.parentNode);
    }
    //do not change the sequence
    e.currentTarget.parentNode.parentNode.removeChild(e.currentTarget.parentNode)
    console.log("Stock deleted");
    const modal = document.querySelector("#stock-info");
    modal.classList.add("hide");
    const details = document.querySelector("#details");
    details.innerText="";    
}

function showSiblings(node){
    const siblings=Array.from(node.parentNode.children).filter(ele=>{return ele !== node});
    console.dir(siblings);
    siblings.map(ele=>ele.classList.remove("hide"));
}
function handleStockClick(e) {
    console.log(e.currentTarget.parentNode.id);
    e.currentTarget.parentNode.classList.toggle("selected");
    // e.currentTarget.parentNode.siblings.classList.add("hide");
    hideAllSiblings(e.currentTarget.parentNode);
    showDetails(e.currentTarget.parentNode.id);
}
function hideAllSiblings(node){
    const allSiblings=Array.from(node.parentNode.children).filter(ele=>{return ele !== node});
    allSiblings.map(ele=>ele.classList.toggle("hide"));
    // let sibling=node.parentNode.firstChild;
    // while(sibling){
    //     if(sibling.nodeType===1 && sibling !== node){
    //         sibling.classList.toggle("hide");
    //     }
    //     sibling=sibling.nextSibling;
    // }
}

// showDetails("IBM-INTRADAY");

async function showDetails(id) {
    const modal = document.querySelector("#stock-info");
    modal.classList.toggle("hide");
    const stockTitle=document.querySelector("#stock-title")
    stockTitle.innerText=id;


    const [symbol, timeFrame] = id.split("-");
    // console.log(symbol + "---" + timeFrame);
    const response = await fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_${timeFrame}&symbol=${symbol}&interval=5min&apikey=3CX8CDELLLNSKW4F`);
    // const response = await fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=IBM&interval=5min&apikey=demo`);

    const result = await response.json();
    // console.log(Object.values(result)[1]);
    const dateArray =Object.entries(Object.values(result)[1]);
    // console.log(dateArray);
    for (let [date, obj] of dateArray) {
        // console.log(obj);
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


function setColor(node,num){
    if(num<60){
        node.style.backgroundColor="red";
    }else if(num>=60 && num<=100){
        node.style.backgroundColor="aliceblue";
    }else{
        node.style.backgroundColor="greenyellow";
    }
}
function init(){
    const modal = document.querySelector("#stock-info");
    modal.classList.add("hide");
    const allSocks=Array.from(document.querySelectorAll(".stock"));
    allSocks.map((node)=>{
        node.classList.remove("hide","selected");
        // node.classList.remove("");
    })
}
init();