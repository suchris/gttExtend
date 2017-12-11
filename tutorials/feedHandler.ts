import { ExchangeFeed } from "gdax-trading-toolkit/build/src/exchanges";
import { LiveBookConfig, LiveOrderbook, TradeMessage, SkippedMessageEvent } from "gdax-trading-toolkit/build/src/core";
import { Ticker } from "gdax-trading-toolkit/build/src/exchanges/PublicExchangeAPI";
import { Logger } from "gdax-trading-toolkit/build/src/utils";
// import { LiveOrderbook } from "gdax-trading-toolkit/build/src/core";
import { CumulativePriceLevel } from "gdax-trading-toolkit/build/src/lib";

import * as GTT from 'gdax-trading-toolkit';

const printOrderbook = GTT.utils.printOrderbook;
const printTicker = GTT.utils.printTicker;

export default function makeFeedHandler(
  product: string, logger: Logger, depth: number,
  // pobStats: (book: LiveOrderbook) => void,
  name: string ){

  let tradeVolume: number = 0
  let tradeValue: number = 0;
  let weightedPrice: number = 0;  

  return (feed: ExchangeFeed) => {
      const config: LiveBookConfig = { product, logger };
      const book = new LiveOrderbook(config);

      book.on('LiveOrderbook.snapshot', () => {
          logger.log('info', 'Snapshot received by LiveOrderbook Demo');
          setInterval(() => {
              console.log(`\n\nFeed: ${name}`)
              console.log(printOrderbook(book, depth));
              // pobStats(book);
              printOrderbookStats(book)
              // logger.log('info', `Cumulative trade volume: ${tradeVolume.toFixed(4)}`);
              logger.log('info', `Cumulative volume: ${tradeVolume.toFixed(4)} Weighted Price: ${weightedPrice.toFixed(4)}`);
            }, 5000);
      });

      book.on('LiveOrderbook.ticker', (ticker: Ticker) => { console.log(printTicker(ticker)); });
      book.on('LiveOrderbook.trade', (trade: TradeMessage) => { 
        tradeVolume += +(trade.size);
        tradeValue += +(trade.size) * +(trade.price);
        weightedPrice = tradeValue/tradeVolume;
       });
      book.on('end', () => { console.log('Orderbook closed'); });

      book.on('LiveOrderbook.skippedMessage', (details: SkippedMessageEvent) => {
          // On GDAX, this event should never be emitted, but we put it here for completeness
          console.log('SKIPPED MESSAGE', details);
          console.log('Reconnecting to feed');
          feed.reconnect(0);
      });

      book.on('error', (err) => {
          console.log('Livebook errored: ', err);
          feed.pipe(book);
      });

      feed.pipe(book);
  }
}

function printOrderbookStats(book: LiveOrderbook) {
  console.log(`Number of bids:       \t${book.numBids}\tasks: ${book.numAsks}`);
  console.log(`Total ${book.baseCurrency} liquidity: \t${book.bidsTotal.toFixed(3)}\tasks: ${book.asksTotal.toFixed(3)}`);
  let orders: CumulativePriceLevel[] = book.ordersForValue('buy', 100, false);
  console.log(`Cost of buying 100 ${book.baseCurrency}: ${orders[orders.length - 1].cumValue.toFixed(2)} ${book.quoteCurrency}`);
  orders = book.ordersForValue('sell', 1000, true);
  console.log(`Need to sell ${orders[orders.length - 1].cumSize.toFixed(3)} ${book.baseCurrency} to get 1000 ${book.quoteCurrency}`);
}
