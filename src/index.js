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
  if (e.target.value.trim() !== '')
    fetchCountries(e.target.value.trim()).then(data => {
      if (data.length > 10) {
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      }
      if (data.length >= 2 && data.length <= 10) {
        countryList.innerHTML = data
          .map(({ name: { common }, flags: { svg } }) => {
            return `<li style="list-style:none">
               <div style="display:flex; align-items: center; gap:5px">
               <img src="${svg}" alt="${common}" width="30" height="15"> 
               <h1 style="font-size:15px; margin:0">${common} </h1>
               </div>
            </li>`;
          })
          .join('');
      } else {
        countryList.innerHTML = '';
      }
      if (data.length === 1) {
        countryInfo.innerHTML = data
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
               <h1 style="font-size:25px; margin:0">${common}</h1>
              </div>
              <p><b>Capital</b>: ${capital}</p>
              <p><b>Population</b>: ${population}</p>
              <p><b>Languages</b>: ${Object.values(languages)}</p>
        </li>`;
            }
          )
          .join('');
      } else {
        countryInfo.innerHTML = '';
      }
      if (data.length === 0) {
        Notify.failure('Oops, there is no country with that name');
      }
      return data;
    });
}
