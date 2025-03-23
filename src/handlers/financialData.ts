import { NextFunction, Request, Response } from "express-serve-static-core";
import 'dotenv/config';
import { query } from "express";
const apiLink = "https://financialdata.net/api/v1";
const currencyApi = "https://api.nbp.pl/api/exchangerates/rates/a/usd"
const apiKey = process.env.API_KEY;

export function home(request: Request, response: Response) {
    response.render('home', {form: "default"});
    
}



export function form(request: Request, response: Response, next: NextFunction) {
    try {
    const formType = request.params.type;
    if (!(formType === "list" || formType === "compare" ||formType === "company")) {
        response.status(404);
        throw new Error("This form doesn't exists.");
    }
    response.render('formPage', {
        formType: formType
    });
    } catch(err) {
        next(err);
    } 
}

export async function list(request: Request, response: Response, next: NextFunction) {
    try {
        const offset: number = Number(request.query.offset);
        const res = await fetch(apiLink.concat(`/stock-symbols`,`?offset=${offset}`, `&key=${apiKey}`));
        if (!res.ok) {
          response.status(res.status);
          const errorMsg = await res.json();
          throw new Error("Problem fetching api. \n" + errorMsg.message);
        }
        const data = await res.json();
    response.render('formPage', {
        resultName: 'list',
        resultData: data.slice(0, 20)
    }); 
    } catch(err) {
        next(err);
    }
}
interface CompareQueryParams {
  trading_symbol_1: string,
  trading_symbol_2: string,
    year: number,
}

interface ShowData {
  offering_value: number
  shares_offered: number,
  share_price: number,
  pricing_date: string,
  registrant_name: string,
  currency_data: number
}

function addYear(dateString: string) {
  const date = new Date(dateString);
  const yesterday = new Date();
  date.setFullYear(date.getFullYear() + 1);
  yesterday.setDate(yesterday.getDate() - 1);
  return date < yesterday ? date.toISOString().slice(0, 10) : yesterday.toISOString().slice(0, 10)

}

export async function compare(request: Request<{},{},{},CompareQueryParams>, response: Response, next: NextFunction) {
    const tradingSymbolOne = request.query.trading_symbol_1;
    const tradingSymbolTwo = request.query.trading_symbol_2;
    if(tradingSymbolOne.length === 0 || tradingSymbolOne.length === 0) {
      response.status(400);
      throw new Error("Your inputs are empty");  
    }
    const resOne = await fetch(apiLink.concat(`/initial-public-offerings`,`?identifier=${tradingSymbolOne}`, `&key=${apiKey}`));
    const resTwo = await fetch(apiLink.concat(`/initial-public-offerings`,`?identifier=${tradingSymbolTwo}`, `&key=${apiKey}`));
    if (!resOne.ok) {
      response.status(resOne.status);
      const errorMsg = await resOne.json();
      throw new Error("Problem fetching api. \n" + errorMsg.message);
    }
    if (!resTwo.ok) {
      response.status(resTwo.status);
      const errorMsg = await resTwo.json();
      throw new Error("Problem fetching api. \n" + errorMsg.message);
    }
    const dataOne = await resOne.json();
    const dataTwo = await resTwo.json();
    if (dataOne.length === 0 || dataTwo.length === 0) {
      response.status(404);
      throw new Error("Your firms couldn't be found in API resources");
    }
    const toShowOne = {} as ShowData;
    const toShowTwo = {} as ShowData;
    dataOne.forEach((portion: ShowData) => {
            toShowOne.registrant_name = portion.registrant_name;
            toShowOne.offering_value = portion.offering_value;
            toShowOne.pricing_date = portion.pricing_date;
            toShowOne.share_price = portion.share_price;
            toShowOne.shares_offered = portion.shares_offered;
    });
    dataTwo.forEach((portion: ShowData) => {
      toShowTwo.registrant_name = portion.registrant_name;
      toShowTwo.offering_value = portion.offering_value;
      toShowTwo.pricing_date = portion.pricing_date;
      toShowTwo.share_price = portion.share_price;
      toShowTwo.shares_offered = portion.shares_offered;
    });

    const secondDateOne = addYear(toShowOne.pricing_date);
    const secondDateTwo = addYear(toShowTwo.pricing_date);

    const currencyResponse1 = await fetch(currencyApi.concat(`/${toShowOne.pricing_date}`,`/${secondDateOne}`,'?format=json'))
    const currencyResponse2 = await fetch(currencyApi.concat(`/${toShowTwo.pricing_date}`,`/${secondDateTwo}`,'?format=json'))
    if (!currencyResponse1.ok) {
      response.status(currencyResponse1.status);
      const errorMsg = await currencyResponse1.json();
      throw new Error("Problem fetching currency api. \n" + errorMsg.message);
    }
    if (!currencyResponse2.ok) {
      response.status(currencyResponse2.status);
      const errorMsg = await currencyResponse2.json();
      throw new Error("Problem fetching currency api. \n" + errorMsg.message);
    }

    const currencyDataOne = await currencyResponse1.json();
    const currencyDataTwo = await currencyResponse2.json();

    toShowOne.currency_data = currencyDataOne.rates;
    toShowTwo.currency_data = currencyDataTwo.rates;

    response.render('formPage', {
        resultName: 'compare',
        resultData: {toShowOne: toShowOne,
            toShowTwo: toShowTwo,}
    }); 
}
