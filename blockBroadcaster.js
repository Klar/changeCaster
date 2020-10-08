const bsv = require('bsv');
const fetch = require("node-fetch");
const fs = require('fs');

const network = "main" // test || stn || main
const filename = "broadcast.txt"
const MattercloudApi = ""
const maxRandomBlock = 64

// bitcoin node config
const user = ""
const password = ""
const nodeIp = ""
const nodePort = "8332"

if (network == "main"){
  bsv.Networks.defaultNetwork = bsv.Networks.livenet
} else if (network == "stn"){
  bsv.Networks.defaultNetwork = bsv.Networks.stn
} else {
  bsv.Networks.defaultNetwork = bsv.Networks.testnet
}

async function broadcastWoc(txHex){
  let apiRequest = "https://api.whatsonchain.com/v1/bsv/"+network+"/tx/raw"

  let headers = {
  }

  let response = await fetch(apiRequest, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(
      {'txhex': txHex }
    )
  })

  let json = await response.json();

    json:

  return json
}

// testnet is currently deactivated in Mtr
async function broadcastMtr(txHex){
  let apiRequest = "https://api.mattercloud.net/api/v3/"+network+"/merchants/tx/broadcast"

  let headers = {
    api_key: MattercloudApi
  }

  let response = await fetch(apiRequest, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(
      {'rawtx': txHex }
    )
  })

  let json = await response.json();

  return json
}

async function broadcastNode(txHex){
  let headers = {
    "content-type": "text/plain;"
  }

  let response = await fetch(`http://${user}:${password}@${nodeIp}:${nodePort}/`, {
    method: 'POST',
    headers: headers,
    body: `{"jsonrpc": "1.0", "id":"curltest", "method": "sendrawtransaction", "params": ["${txHex}"] }`
  });

  response = await response;

  return response
}

function randRange(maxRandomBlock) {
       let newTime = Math.floor(Math.random()*600000*Math.floor(Math.random() * maxRandomBlock)) // 600 000 = block*1000*60*10
       console.log("random block set: " + (newTime / 1000) + "sec");
       return newTime;
}

function broadcast(){
  fs.readFile(filename, 'utf8', async function(err, txHex) {
    if (txHex.length){
      let firstHexTx = txHex.split('\n')[0];

      // let txid = await broadcastNode(firstHexTx)
      // console.log("broadcasted: " + firstHexTx)

      let txid = await broadcastWoc(firstHexTx)
      console.log("broadcasted: " + firstHexTx)

      let hexTxsExceptFirst = txHex.split('\n').slice(1).join('\n');

      fs.writeFile(filename, hexTxsExceptFirst, function (err) {
        if (err) throw err;
      });
    } else {
      console.log("All done.");
      process.exit()
    }
  });
}

function main() {
       broadcast()
       clearInterval(timer)
       timer = setInterval(main, randRange(maxRandomBlock));
}

var timer = setInterval(main, 1000);
