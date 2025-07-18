
const apiKey = "b890170ca7be54b254e073c9f4e33edb";

// Function to fetch weather data
async function getWeather() {
  const city = document.getElementById("cityInput").value.trim();
  if (!city) {
    alert("❗ Please enter a city name.");
    return;
  }

  const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

  try {
    const response = await fetch(currentWeatherUrl);
    const currentData  = await response.json();

    if (currentData.cod !== 200) {
      alert(`⚠️ ${currentData.message}`);
      return;
    }

    // Use the same display elements as getWeatherByLocation()
    document.getElementById("cityDate").textContent = `${currentData.name}, ${currentData.sys.country}`;
    document.getElementById("temperature").textContent = `Temperature: ${currentData.main.temp}°C`;
    document.getElementById("humidity").textContent = `Humidity: ${currentData.main.humidity}%`;
    document.getElementById("wind").textContent = `Wind Speed: ${currentData.wind.speed} m/s`;
    document.getElementById("description").textContent = currentData.weather[0].description;
    document.getElementById("weatherIcon").src = `https://openweathermap.org/img/wn/${currentData.weather[0].icon}@2x.png`;

    // Fetch 5-day forecast
    const forecastResponse = await fetch(forecastUrl);
    const forecastData = await forecastResponse.json();

    const dailyForecast = forecastData.list.filter(item => item.dt_txt.includes("12:00:00"));

    const forecastContainer = document.getElementById("forecastContainer");
    forecastContainer.innerHTML = ""; // Clear previous forecast

    dailyForecast.forEach(item => {
      const date = new Date(item.dt_txt).toISOString().split("T")[0];
      const iconUrl = `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`;

      const forecastCard = `
        <div class="bg-gray-600 text-white p-4 rounded-md w-40 text-center">
          <p class="font-semibold">(${date})</p>
          <img src="${iconUrl}" alt="${item.weather[0].description}" class="mx-auto h-10 bg-white rounded" />
          <p>Temp: ${item.main.temp.toFixed(1)}°C</p>
          <p>Wind: ${item.wind.speed.toFixed(1)} m/s</p>
          <p>Humidity: ${item.main.humidity}%</p>
        </div>
      `;
      forecastContainer.innerHTML += forecastCard;
    });

  } catch (error) {
    console.error("Fetch error:", error);
    alert("❌ Error fetching weather data.");
  }
}


async function getWeatherByLocation(lat, lon) {
  const currentUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

  try {
    const currentResponse = await fetch(currentUrl);
    const currentData = await currentResponse.json();

    if (currentData.cod !== 200) {
      alert(`⚠️ ${currentData.message}`);
      return;
    }

    // Update current weather UI
    document.getElementById("cityDate").textContent = `${currentData.name}, ${currentData.sys.country}`;
    document.getElementById("temperature").textContent = `Temperature: ${currentData.main.temp}°C`;
    document.getElementById("humidity").textContent = `Humidity: ${currentData.main.humidity}%`;
    document.getElementById("wind").textContent = `Wind Speed: ${currentData.wind.speed} m/s`;
    document.getElementById("description").textContent = currentData.weather[0].description;
    document.getElementById("weatherIcon").src = `https://openweathermap.org/img/wn/${currentData.weather[0].icon}@2x.png`;

    // Forecast
    const forecastResponse = await fetch(forecastUrl);
    const forecastData = await forecastResponse.json();

    const dailyForecast = forecastData.list.filter(item => item.dt_txt.includes("12:00:00"));
    const forecastContainer = document.getElementById("forecastContainer");
    forecastContainer.innerHTML = "";

    dailyForecast.forEach(item => {
      const date = new Date(item.dt_txt).toISOString().split("T")[0];
      const iconUrl = `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`;

      const forecastCard = `
        <div class="bg-gray-600 text-white p-4 rounded-md w-36 text-center">
          <p class="font-semibold">(${date})</p>
          <img src="${iconUrl}" alt="${item.weather[0].description}" class="mx-auto h-10 bg-white rounded" />
          <p>Temp: ${item.main.temp.toFixed(1)}°C</p>
          <p>Wind: ${item.wind.speed.toFixed(1)} m/s</p>
          <p>Humidity: ${item.main.humidity}%</p>
        </div>
      `;
      forecastContainer.innerHTML += forecastCard;
    });

  } catch (error) {
    console.error("Error getting weather by location:", error);
    alert("❌ Unable to fetch weather for your location.");
  }
}

// This function is triggered by the button
function getCurrentLocationWeather() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      position => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        getWeatherByLocation(lat, lon);
      },
      error => {
        alert("⚠️ Unable to access your location. Please allow location access.");
        console.error(error);
      }
    );
  } else {
    alert("❌ Geolocation is not supported by your browser.");
  }
}

// Attach click listener to the button
document.getElementById("currentBtn").addEventListener("click", getCurrentLocationWeather);