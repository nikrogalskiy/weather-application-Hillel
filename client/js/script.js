class View {
	constructor() {
		this.citiesСurrent = document.querySelector(".cities__current");
		this.weatherInfo = document.querySelector(".weather__info");
		this.citiesList = document.querySelector(".cities__list");
		this.button = document.querySelector(".btn");
		this.input = document.querySelector(".input");
		this.widget;
		this.widgetCity;
		this.widgetDetailed;
		this.buttons;
	}




	createWidget(obj) {
		let currentWidget = `
		<a href="#" class="link">
			<h2>Ваш город</h2>
			<span class="wraper">
			<span class="icon"><img src="https://openweathermap.org/img/wn/${obj[0].weather[0].icon}.png" alt=""></span>
			<span class="temp">${obj[0].main.temp}<span class="deg"> C&deg</span></span>
			</span>
			<span class="description">${obj[0].weather[0].description}</span>
			<span class="current-city">${obj[0].name}</span>
		</a>
		`;
		this.widget = currentWidget;
	}

	createWidgetCity(city, temp, description, icon) {
		let currentWidgetCity = `
		<li>
		<a href="#" class="link">
			<h2>погода в</h2>
			<span class="wraper">
			<span class="icon"><img src="https://openweathermap.org/img/wn/${icon}.png" alt=""></span>
			<span class="temp">${temp}<span class="deg"> C&deg</span></span>
			</span>
			<span class="description">${description}</span>
			<span class="current-city">${city}</span>
		</a>
		</li>
		`;
		this.widgetCity = currentWidgetCity;
	}

	createDetailedWeatherInformation(obj) {
		let detailedWeatherInformation = `
			<div class="info-weather__header">
					<div class="info-weather__city">${obj[0].name},</div>
					<div class="info-weather country">${obj[0].sys.country}</div>
			</div>
			<div class="info-weather_body">
					<div class="info-weather__icon"><img src="https://openweathermap.org/img/wn/${obj[0].weather[0].icon}.png" alt=""></div>
					<div class="info-weather__temp">${obj[0].main.temp}<span> C&deg</span></div>
					<div class="info-weather__other">
						<div class="info-weather__description">небо: ${obj[0].weather[0].description}</div>
						<div class="info-weather__wind">ветер: ${obj[0].wind.speed} м/с</div>
						<div class="info-weather__humiditu"><span>влажность: ${obj[0].main.humidity} %</span></div>
					</div>
					<!--<div class="info-weather__btn">
						<button>Удалить</button>
					</div>-->
			</div>
`;
		this.widgetDetailed = detailedWeatherInformation;
	}

	createButtons() {
		let btn = `
			<div class="info-weather__btn">
				<button>Удалить</button>
			</div>`;
		this.buttons = btn;
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
		this.currentSity = [];
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

	getObjCurrentCity(obj) {
		this.currentSity[0] = obj;
	}


	showWidget(obj) {
		this.view.createWidget(obj)
		this.view.citiesСurrent.innerHTML = this.view.widget;
	}
	showWidgetDetailed(obj) {
		this.view.createDetailedWeatherInformation(obj)
		this.view.weatherInfo.innerHTML = this.view.widgetDetailed;
		this.view.createButtons();

	}

	showButtons() {
		let infoWeatherBody = document.querySelector(".info-weather_body");
		infoWeatherBody.innerHTML += this.view.buttons;

	}



	getShowWeaterCurrentCity() {
		let success = async (pos) => {
			let latitude = pos.coords.latitude;
			let longitude = pos.coords.longitude;
			let weatherInfo = await this.request(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&lang=ru&appid=35859dc542ddefeb9aba8b07fdb7e774`);
			let getObjCurrentCity = await this.getObjCurrentCity(weatherInfo);
			let showWidget = await this.showWidget(this.currentSity);
			let showWidgetDetailed = await this.showWidgetDetailed(this.currentSity);
		};
		let error = (err) => {
			console.warn(`ERROR(${err.code}): ${err.message}`);
		};
		navigator.geolocation.getCurrentPosition(success, error, this.options);

	}

	async getWeather(cityName) {
		// let weatherInformation = await this.request(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&lang=ru&appid=35859dc542ddefeb9aba8b07fdb7e774`);
		// this.listSities.push(weatherInformation);
		// let city = weatherInformation.name;
		// let temp = weatherInformation.main.temp;
		// let description = weatherInformation.weather[0].description;
		// let icon = weatherInformation.weather[0].icon;
		// let country = weatherInformation.sys.country;
		// let wind = weatherInformation.wind.speed;
		// let humidity = weatherInformation.main.humidity;
		// this.view.createWidgetCity(city, temp, description, icon);
		// this.view.citiesList.innerHTML += this.view.widgetCity;

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