// Home page JavaScript for Chamber of Commerce

// OpenWeatherMap API configuration
const API_KEY = 'YOUR_API_KEY_HERE'; // Replace with your OpenWeatherMap API key
const CITY = 'Timbuktu,ML'; // Timbuktu, Mali
const WEATHER_URL = `https://api.openweathermap.org/data/2.5/weather?q=${CITY}&appid=${API_KEY}&units=metric`;
const FORECAST_URL = `https://api.openweathermap.org/data/2.5/forecast?q=${CITY}&appid=${API_KEY}&units=metric`;

// Load member data and display spotlights
async function loadSpotlights() {
  try {
    const response = await fetch('data/members.json');
    if (!response.ok) throw new Error('Failed to load member data');
    const members = await response.json();
    
    // Filter for Gold and Silver members only
    const premiumMembers = members.filter(member => 
      member.membership === 2 || member.membership === 3
    );
    
    // Randomly select 2-3 members for spotlight
    const spotlightCount = Math.floor(Math.random() * 2) + 2; // 2 or 3
    const selectedMembers = [];
    
    for (let i = 0; i < spotlightCount && i < premiumMembers.length; i++) {
      const randomIndex = Math.floor(Math.random() * premiumMembers.length);
      const member = premiumMembers.splice(randomIndex, 1)[0];
      selectedMembers.push(member);
    }
    
    displaySpotlights(selectedMembers);
  } catch (error) {
    console.error('Error loading spotlights:', error);
    document.getElementById('spotlights').innerHTML = '<p>Unable to load business spotlights.</p>';
  }
}

function displaySpotlights(members) {
  const spotlightsContainer = document.getElementById('spotlights');
  spotlightsContainer.innerHTML = '';
  
  members.forEach(member => {
    const membershipLevel = member.membership === 3 ? 'Gold' : 'Silver';
    
    const spotlightCard = document.createElement('div');
    spotlightCard.classList.add('spotlight-card');
    
    spotlightCard.innerHTML = `
      <img src="images/${member.image}" alt="${member.name} logo" loading="lazy">
      <h3>${member.name}</h3>
      <p class="membership-level">${membershipLevel} Member</p>
      <p><strong>Phone:</strong> ${member.phone}</p>
      <p><strong>Address:</strong> ${member.address}</p>
      <a href="${member.website}" target="_blank" rel="noopener">Visit Website</a>
    `;
    
    spotlightsContainer.appendChild(spotlightCard);
  });
}

// Load weather data (with fallback for missing API key)
async function loadWeather() {
  // Check if API key is set
  if (API_KEY === 'YOUR_API_KEY_HERE') {
    // Fallback to dummy data if no API key
    displayDummyWeather();
    return;
  }
  
  try {
    // Load current weather
    const weatherResponse = await fetch(WEATHER_URL);
    if (!weatherResponse.ok) throw new Error('Weather data not available');
    const weatherData = await weatherResponse.json();
    
    // Load forecast
    const forecastResponse = await fetch(FORECAST_URL);
    if (!forecastResponse.ok) throw new Error('Forecast data not available');
    const forecastData = await forecastResponse.json();
    
    displayWeather(weatherData, forecastData);
  } catch (error) {
    console.error('Error loading weather:', error);
    displayDummyWeather();
  }
}

function displayWeather(current, forecast) {
  // Display current weather
  document.getElementById('current-temp').textContent = `${Math.round(current.main.temp)}°C`;
  document.getElementById('weather-description').textContent = current.weather[0].description;
  
  // Display 3-day forecast
  const forecastContainer = document.getElementById('forecast-container');
  forecastContainer.innerHTML = '';
  
  // Get daily forecasts (every 8th item = 24 hours apart)
  for (let i = 0; i < 3; i++) {
    const dayForecast = forecast.list[i * 8];
    if (!dayForecast) continue;
    
    const date = new Date(dayForecast.dt * 1000);
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
    
    const forecastDay = document.createElement('div');
    forecastDay.classList.add('forecast-day');
    forecastDay.innerHTML = `
      <p><strong>${dayName}:</strong> ${Math.round(dayForecast.main.temp)}°C</p>
      <p>${dayForecast.weather[0].description}</p>
    `;
    
    forecastContainer.appendChild(forecastDay);
  }
}

function displayDummyWeather() {
  document.getElementById('current-temp').textContent = '28°C';
  document.getElementById('weather-description').textContent = 'Sunny with clear skies';
  
  const forecastContainer = document.getElementById('forecast-container');
  forecastContainer.innerHTML = `
    <div class="forecast-day">
      <p><strong>Today:</strong> 28°C</p>
      <p>Sunny</p>
    </div>
    <div class="forecast-day">
      <p><strong>Tomorrow:</strong> 30°C</p>
      <p>Partly cloudy</p>
    </div>
    <div class="forecast-day">
      <p><strong>Day 3:</strong> 26°C</p>
      <p>Light rain</p>
    </div>
  `;
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
  loadSpotlights();
  loadWeather();
});
