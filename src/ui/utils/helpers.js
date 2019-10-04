import moment from "moment";

export function formatDate(timestamp) {
  const d = new Date(timestamp);
  const time = d.toLocaleTimeString("en-US");
  return d.toLocaleDateString() + " @ " + time.substr(0, 5) + time.slice(-2);
}
export const formatDateOnly = date => date && moment(date).format("MM-DD-YYYY");
export const getMonthFromDate = date => date && moment(date).format('MMM')
export const getDayFromDate = date => date && moment(date).format('DD')


export function formatDecimalNumber(num, decimalPlaces = 2) {
  return parseFloat(Math.round(num * 100) / 100).toFixed(decimalPlaces);
}

export function displayNumberAsCurrency(num) {
  return `$ ${num}`
}

export function htmlDecode(input) {
  var e = document.createElement('div');
  e.innerHTML = input;
  return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
}