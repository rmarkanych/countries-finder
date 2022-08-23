import { fetchCountries } from './js/fetchCountries';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';
import './css/styles.css';

const DEBOUNCE_DELAY = 300;
const input = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

input.addEventListener('input', debounce(onHandlerInput, DEBOUNCE_DELAY));

function onHandlerInput(e) {
  const inputData = e.target.value.trim();
  if (inputData !== '')
    fetchCountries(inputData).then(data => {
      if (data.length > 10)
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      if (data.length >= 2 && data.length <= 10)
        countryList.innerHTML = createListOfCountries(data);
      else countryList.innerHTML = '';
      if (data.length === 1) countryInfo.innerHTML = createOneCountry(data);
      else countryInfo.innerHTML = '';
      if (data.length === 0)
        Notify.failure('Oops, there is no country with that name');
      return data;
    });
}

function createListOfCountries(data) {
  return data
    .map(({ name: { common }, flags: { svg } }) => {
      return `<li style="list-style:none">
               <div style="display:flex; align-items: center; gap:5px">
               <img src="${svg}" alt="${common}" width="30" height="15"> 
               <h1 style="font-size:15px">${common} </h1>
               </div>
            </li>`;
    })
    .join('');
}

function createOneCountry(data) {
  return data
    .map(
      ({
        name: { common },
        capital,
        population,
        flags: { svg },
        languages,
      }) => {
        return `<li style="list-style:none">
              <div style="display:flex; align-items: center; gap:5px">
               <img src="${svg}" alt="${common}" width="30" height="15"> 
               <h1 style="font-size:25px">${common}</h1>
              </div>
              <p><b>Capital</b>: ${capital}</p>
              <p><b>Population</b>: ${population}</p>
              <p><b>Languages</b>: ${Object.values(languages)}</p>
        </li>`;
      }
    )
    .join('');
}
