<p align="center">
<img alt="QUAC" src="https://raw.githubusercontent.com/yamorijp/quac/master/capture.png" width="600"/>
</p>



QUAC (Liquid / Quoine API Console) is provided by the virtual currency exchange [Liquid (Quoine)] (https://www.liquid.com/en/)
An unofficial CLI tool package using the Quoine Exchange API (https://developers.quoine.com/v2).

Javascript interactive console program integrating Liquid / Quoine Exchange API client,
Includes real time update board display program, contract history display program and ticker display program.

This program is "experimental".
Not enough testing has been done. In order to issue order, please try first with a small amount.

There is also [BLAC] (https://github.com/yamorijp/blac) which used the bitFlyer Lightning API as a sister item.

## Getting Started

This program is a js script which runs in Node.js.
You need [Node.js] (https://nodejs.org) to run. Please install version 6.10.0 or higher.

It also depends on third party npm modules.
Please install using [npm] (https://www.npmjs.com/) or [yarn] (https://yarnpkg.com/).

    $ npm install
    

## Running the program

Run the script with the node command.

    $ node console.js

There are several command line options. Check with `- h` option for help.

    $ node console.js -h
    

## Interactive console (console.js)

A REPL console program that integrates the Quoine Exchange API client.
You can make orders and cancellations using javascript with interactive shell, and call Liquid / Quoine Exchange API.

API Token ID and API secret are required for calling functions belonging to the Authenticated API such as confirming the balance and issuing an order.

After logging into [LIQUID / QUOINEX] (https://app.liquid.com), create an API token from the configuration [API token] (https://app.liquid.com/settings/api-tokens). 


The API Token ID and API secret are set with `.qc_set_key` command. The set authentication information is valid until the program is terminated.

    > .qc_set_key YOUR_API_TOKEN_ID YOUR_API_SECRET
    
If you export with `.qc_store_key` command, it will be loaded automatically at startup. (It will be saved in clear text * Attention to security)

For details of the API, refer to [Quoine Exchange API Reference] (https://developers.quoine.com/v2).


     
      option:
    
        -n, --no-banner  Do not display startup banner
    
      Example: 
    
        $ node console.js -n


## Board display program (book.js)

This is a board display program for real time update.
It corresponds to the grouping display which collects orders in the price range. (`-g` option)


	    option:       
      
        -p, --product <code> Currency pair code (default: BTCJPY)  
        -r, --row <n> Number of lines to display for buy and sell orders (default: 20)  
        -g, --group <n> Display orders in a specified range (default: disabled)          
        
      Example:  
      
        $ node book.js - p BTC_JPY - r 32 - g 100
      
## Contract history display program (executions.js)

It is a promissory history display program of real time update.

      option:  
          
        -p, --product <code> Currency pair code (default: BTCJPY)  
        -r, --row <n> Number of display lines of history (default: 40)
    
      Example:
    
         $ node executions.js - p ETH_BTC - r 20


# Ticker display program (ticker.js)

Real time update ticker display program.

      option:
          
        -p, --product <code> Comma-separated currency pair code (default: "BTCJPY, ETHJPY, BCHJPY, ETHBTC, BTCUSD")  
           
      Example:
          
        $ node ticker.js -p "BTCUSD, ETHBTC"  


## license

MIT


BTC: `1BpLZm4JEFiDqAnaexuYMhGJZKdRQJKixP`  
ETH: `0x51349760d4a5287dbfa3961ca2e0006936bc9d88`
