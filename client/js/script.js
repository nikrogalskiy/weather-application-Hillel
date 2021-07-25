class View {
	constructor() {
		this.citiesСurrent = document.querySelector(".cities__current");
		this.weatherInfo = document.querySelector(".weather__info");
		this.citiesItems = document.querySelector(".cities__items");
		this.button = document.querySelector(".btn");
		this.input = document.querySelector(".input");
		this.widget;
		this.widgetCity;
		this.widgetDetailed;
	}




	createWidget(city, temp, description, icon) {
		let currentWidget = `
		<a href="#" class="link">
			<h2>Ваш город</h2>
			<span class="wraper">
			<span class="icon"><img src="https://openweathermap.org/img/wn/${icon}.png" alt=""></span>
			<span class="temp">${temp}<span class="deg"> C&deg</span></span>
			</span>
			<span class="description">${description}</span>
			<span class="current-city">${city}</span>
		</a>
		`;
		this.widget = currentWidget;
	}

	createWidgetCity(city, temp, description, icon) {
		let currentWidgetCity = `
		<a href="#" class="link">
			<h2>погода в</h2>
			<span class="wraper">
			<span class="icon"><img src="https://openweathermap.org/img/wn/${icon}.png" alt=""></span>
			<span class="temp">${temp}<span class="deg"> C&deg</span></span>
			</span>
			<span class="description">${description}</span>
			<span class="current-city">${city}</span>
		</a>
		`;
		this.widgetCity = currentWidgetCity;
	}

	createDetailedWeatherInformation(city, temp, description, icon, country, wind, humidity) {
		let detailedWeatherInformation = `
			<div class="info-weather__header">
					<div class="info-weather__city">${city},</div>
					<div class="info-weather country">${country}</div>
			</div>
			<div class="info-weather_body">
					<div class="info-weather__icon"><img src="https://openweathermap.org/img/wn/${icon}.png" alt=""></div>
					<div class="info-weather__temp">${temp}<span> C&deg</span></div>
					<div class="info-weather__other">
						<div class="info-weather__description">небо: ${description}</div>
						<div class="info-weather__wind">ветер: ${wind} м/с</div>
						<div class="info-weather__humiditu"><span>влажность: ${humidity} %</span></div>
					</div>
					<!--
					<div class="info-weather__btn">
						<button>Удалить</button>
					</div>
					-->
			</div>
`;
		this.widgetDetailed = detailedWeatherInformation;
	}

}

class Model {
	constructor(view) {
		this.view = view;
		this.options = {
			enableHighAccuracy: true,
			timeout: 5000,
			maximumAge: 0
		};
		this.listSities = [];
		this.inputValue;
	}



	getWeaterCity() {
		let city = this.inputValue;
		this.getWeather(city);
	}

	getInputValue() {
		this.inputValue = this.view.input.value;
		this.view.input.value = '';
	}

	getShowWeaterCurrentCity() {
		let success = async (pos) => {
			let latitude = pos.coords.latitude;
			let longitude = pos.coords.longitude;
			let weatherInfo = await this.request(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&lang=ru&appid=35859dc542ddefeb9aba8b07fdb7e774`);
			let city = weatherInfo.name;
			let temp = weatherInfo.main.temp;
			let description = weatherInfo.weather[0].description;
			let icon = weatherInfo.weather[0].icon;
			let country = weatherInfo.sys.country;
			let wind = weatherInfo.wind.speed;
			let humidity = weatherInfo.main.humidity;
			this.view.createWidget(city, temp, description, icon);
			this.view.citiesСurrent.innerHTML = this.view.widget;
			this.view.createDetailedWeatherInformation(city, temp, description, icon, country, wind, humidity);
			this.view.weatherInfo.innerHTML = this.view.widgetDetailed;
		};
		let error = (err) => {
			console.warn(`ERROR(${err.code}): ${err.message}`);
		};
		navigator.geolocation.getCurrentPosition(success, error, this.options);

	}

	async getWeather(cityName) {
		let weatherInformation = await this.request(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&lang=ru&appid=35859dc542ddefeb9aba8b07fdb7e774`);
		this.listSities.push(weatherInformation);
		let city = weatherInformation.name;
		let temp = weatherInformation.main.temp;
		let description = weatherInformation.weather[0].description;
		let icon = weatherInformation.weather[0].icon;
		let country = weatherInformation.sys.country;
		let wind = weatherInformation.wind.speed;
		let humidity = weatherInformation.main.humidity;
		this.view.createWidgetCity(city, temp, description, icon);
		this.view.citiesItems.innerHTML += this.view.widgetCity;

	}

	async request(url, method = 'GET', data = null) {
		try {
			const headers = {};
			let body;

			if (data) {
				headers['Content-Type'] = 'application/json';
				body = JSON.stringify(data);
			}

			const response = await fetch(url, {
				method,
				headers,
				body
			});
			return await response.json();

		} catch (e) {
			console.warn('Error:', e.message);
		}
	}
}





class Controller {
	constructor(view, model) {
		this.view = view;
		this.model = model;
	}
	eventHandler() {
		this.view.button.addEventListener("click", (e) => {
			this.model.getInputValue();
			this.model.getWeaterCity();
		});
		// this.view.showTodolist.addEventListener("click", (e) => {
		// 	this.viewPage2.initRender();
		// 	this.model.addListItem();
		// 	this.model.removeEndEditTask();
		// });
		// this.viewPage2.backAddTaskTodolist.addEventListener("click", (e) => {
		// 	this.viewPage2.clear();
		// 	this.view.updated();
		// });
	}
}

function start() {
	const view = new View();
	const model = new Model(view);
	const controller = new Controller(view, model);
	controller.eventHandler();
	model.getShowWeaterCurrentCity();
}
start();