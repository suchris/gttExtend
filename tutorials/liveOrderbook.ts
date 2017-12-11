/***************************************************************************************************************************
 * @license                                                                                                                *
 * Copyright 2017 Coinbase, Inc.                                                                                           *
 *                                                                                                                         *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance          *
 * with the License. You may obtain a copy of the License at                                                               *
 *                                                                                                                         *
 * http://www.apache.org/licenses/LICENSE-2.0                                                                              *
 *                                                                                                                         *
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on     *
 * an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the                      *
 * License for the specific language governing permissions and limitations under the License.                              *
 ***************************************************************************************************************************/

import * as GTT from 'gdax-trading-toolkit';

import { FeedFactory as GeminiFeedFactory   } from "gdax-trading-toolkit/build/src/factories/geminiFactories"
import { FeedFactory as PoloniexFeedFactory } from "gdax-trading-toolkit/build/src/factories/poloniexFactories"
import { FeedFactory as BitfinexFeedFactory } from "gdax-trading-toolkit/build/src/factories/bitfinexFactories"

import makeFeedHandler from "./feedHandler"

const depth = 5
const product = 'BTC-USD';
const logger = GTT.utils.ConsoleLoggerFactory({ level: 'debug' });

GeminiFeedFactory(logger, product)
    .then(makeFeedHandler(product, logger, depth, 'Gemini'));
    
PoloniexFeedFactory(logger, [product])
    .then(makeFeedHandler(product, logger, depth, 'Poloniex'));

BitfinexFeedFactory(logger, [product])
    .then(makeFeedHandler(product, logger, depth, 'Bitfinex'));
