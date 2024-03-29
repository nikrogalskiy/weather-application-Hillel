class View {
	constructor() {
		this.citiesСurrent = document.querySelector(".cities__current");
		this.weatherInfo = document.querySelector(".weather__info");
		this.citiesList = document.querySelector(".cities__list");
		this.button = document.querySelector(".btn");
		this.input = document.querySelector(".input");
		this.titleYourTown = "Ваш город";
		this.titleWeatherIn = "Погода в";
		this.citiesItemR = " cities__item_r";
		this.widgetDetailed;
		this.buttons;
	}

	creaShowteWidget(obj, title, place, clas = " cities__item_c") {
		obj.forEach(i => {
			let widget = `
			<li id="${i.id}" class="cities__item${clas}">
				<a href="#" class="link">
					<h2>${title}</h2>
					<span class="wraper">
					<span class="icon"><img src="https://openweathermap.org/img/wn/${i.weather[0].icon}.png" alt=""></span>
					<span class="temp">${i.main.temp}<span class="deg"> C&deg</span></span>
					</span>
					<span class="description">${i.weather[0].description}</span>
					<span class="current-city">${i.name}</span>
				</a>
			</li>
		`;
			place.innerHTML += widget;
		});
	}

	createDetailedWeatherInformation(obj) {
		let detailedWeatherInformation = `
			<div class="info-weather__wrapper">
				<div class="info-weather__header">
					<div class="info-weather__city">${obj[0].name},</div>
					<div class="info-weather country">${obj[0].sys.country}</div>
				</div>
				<div class="weather__input_edit">
					<input type="text" name="newCity" class="input-edit" placeholder="Введите название города...">
					<button class="btn-edit">Сохранить</button>
					<button class="btn-cancel">Отмена</button>
				</div>
				<div class="info-weather_body">
						<div class="info-weather__icon"><img src="https://openweathermap.org/img/wn/${obj[0].weather[0].icon}.png" alt=""></div>
						<div class="info-weather__temp">${obj[0].main.temp}<span> C&deg</span></div>
						<div class="info-weather__other">
							<div class="info-weather__description">небо: ${obj[0].weather[0].description}</div>
							<div class="info-weather__wind">ветер: ${obj[0].wind.speed} м/с</div>
							<div class="info-weather__humiditu"><span>влажность: ${obj[0].main.humidity} %</span></div>
						</div>
				</div>
			</div>
			`;
		this.widgetDetailed = detailedWeatherInformation;
	}

	createButtons(id) {
		let btn = `
			<div class="info-weather__btn">
				<button data-id="${id}" class="edit">Изменить</button>
				<button data-id="${id}" class="delete">Удалить</button>
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
		this.idCity = 0;
	}

	eventHandlerDelete() {
		let deleteBtn = document.querySelector(".delete");
		let editBtn = document.querySelector(".edit");
		let weatherInputEdit = document.querySelector(".weather__input_edit");
		let btnCancel = document.querySelector(".btn-cancel");
		let inputEdit = document.querySelector(".input-edit");
		let btnEdit = document.querySelector(".btn-edit");

		deleteBtn.addEventListener("click", (e) => {
			let id = e.target.getAttribute("data-id");
			this.deleteCity(id);
		});

		editBtn.addEventListener("click", (e) => {
			this.idCity = e.target.getAttribute("data-id");
			weatherInputEdit.classList.add("_active");
		});
		btnCancel.addEventListener("click", (e) => {
			weatherInputEdit.classList.remove("_active");
		});
		btnEdit.addEventListener("click", (e) => {
			let cityName = inputEdit.value;
			inputEdit.value = "";
			weatherInputEdit.classList.remove("_active");
			this.editCity(cityName, this.idCity);
		});
	}

	getCityName() {
		let cityName = this.view.input.value;
		this.view.input.value = '';
		return cityName;
	}

	showWidgetDetailed(obj, id) {
		this.view.createDetailedWeatherInformation(obj);
		this.view.weatherInfo.innerHTML = this.view.widgetDetailed;
		this.view.createButtons(id);
	}

	showButtons() {
		let infoWeatherBody = document.querySelector(".info-weather_body");
		infoWeatherBody.innerHTML += this.view.buttons;
	}

	async getListCities() {
		this.listSities = await this.request("/api/cities");
	}

	removeItem(items) {
		if (items.length > 0) {
			items.forEach(i => i.remove());
		}
	}

	async showinfoSelectedItem() {
		let citiesItemR = document.querySelectorAll(".cities__item_r");
		let citiesItemC = document.querySelectorAll(".cities__item_c");

		let id;
		await citiesItemC.forEach(i => {
			i.addEventListener("click", (e) => {
				e.preventDefault();
				this.removeItem(citiesItemC);
				this.removeItem(citiesItemR);
				this.getShowWeaterCurrentCity();
			});
		});
		await citiesItemR.forEach(i => {
			i.addEventListener("click", (e) => {
				e.preventDefault();
				id = i.id;
				let item = document.querySelector(".info-weather__wrapper");
				if (item) {
					item.remove();
				}
				let newListSities = this.listSities.filter(i => i.id === id);
				this.showWidgetDetailed(newListSities, i.id);
				this.showButtons();
				this.eventHandlerDelete();
			});
		});
	}

	objCurrentSity(obj, cityName) {
		let newObj = obj.filter(item => item.name.toLowerCase() === cityName.toLowerCase());
		return newObj;
	}

	async deleteCity(id) {
		await this.request(`/api/cities/${id}`, "DELETE");
		let data = await document.querySelectorAll(".info-weather__wrapper");
		let itemCurent = await document.querySelectorAll(".cities__item_c");
		let itemRest = await document.querySelectorAll(".cities__item_r");
		let removeData = await this.removeItem(data);
		let removeItemCurent = await this.removeItem(itemCurent);
		let removeItemRest = await this.removeItem(itemRest);
		await this.getShowWeaterCurrentCity();
	}

	async editCity(cityName, id) {
		let weatherInformation = await this.request(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&lang=ru&appid=35859dc542ddefeb9aba8b07fdb7e774`);
		await this.request(`/api/cities/${id}`, "PUT", weatherInformation);
		let data = await document.querySelectorAll(".info-weather__wrapper");
		let itemCurent = await document.querySelectorAll(".cities__item_c");
		let itemRest = await document.querySelectorAll(".cities__item_r");
		let removeData = await this.removeItem(data);
		let removeItemCurent = await this.removeItem(itemCurent);
		let removeItemRest = await this.removeItem(itemRest);
		await this.getShowWeaterCurrentCity();
	}

	getShowWeaterCurrentCity() {
		let success = async (pos) => {
			let latitude = pos.coords.latitude;
			let longitude = pos.coords.longitude;
			let weatherInfo = await this.request(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&lang=ru&appid=35859dc542ddefeb9aba8b07fdb7e774`);
			let currentSity = await [{ ...weatherInfo }];
			this.currentSity = await currentSity;
			let creaShowteWidget = await this.view.creaShowteWidget(currentSity, this.view.titleYourTown, this.view.citiesList);
			let showWidgetDetailed = await this.showWidgetDetailed(currentSity);
			let objListSities = await this.getListCities();
			let showteWidget = await this.view.creaShowteWidget(this.listSities, this.view.titleWeatherIn, this.view.citiesList, this.view.citiesItemR);
			let showinfoSelectedItem = await this.showinfoSelectedItem();
		};
		let error = async (err) => {
			console.warn(`ERROR(${err.code}): ${err.message}`);
			await this.ifDataBan();
			await this.showinfoSelectedItem();
		};
		navigator.geolocation.getCurrentPosition(success, error, this.options);
	}

	async getWeather() {
		let cityName = await this.getCityName();
		let weatherInformation = await this.request(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&lang=ru&appid=35859dc542ddefeb9aba8b07fdb7e774`);
		let sendingToServer = await this.request("/api/cities", "POST", weatherInformation);
		let objListSities = await this.getListCities();
		let items = await document.querySelectorAll(".cities__item_r");
		let removeItem = await this.removeItem(items);
		let creaShowteWidget = await this.view.creaShowteWidget(this.listSities, this.view.titleWeatherIn, this.view.citiesList, this.view.citiesItemR);
		let objCurrentSity = await this.objCurrentSity(this.listSities, cityName);
		let idObjCurrentSity = await objCurrentSity[0].id;
		let showWidgetDetailed = await this.showWidgetDetailed(objCurrentSity, idObjCurrentSity);
		let showinfoSelectedItem = await this.showinfoSelectedItem();
		let showButtons = await this.showButtons();
		let eventHandlerDelete = await this.eventHandlerDelete();
	}

	async ifDataBan() {
		let objListSities = await this.getListCities();
		let items = await document.querySelectorAll(".cities__item_r");
		let removeItem = await this.removeItem(items);
		let IdObjListSities = this.listSities[0].id;
		let showWidgetDetailed = await this.showWidgetDetailed(this.listSities, IdObjListSities);
		let showButtons = await this.showButtons();
		let creaShowteWidget = await this.view.creaShowteWidget(this.listSities, this.view.titleWeatherIn, this.view.citiesList, this.view.citiesItemR);
		let eventHandlerDelete = await this.eventHandlerDelete();
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
			this.model.getWeather();
		});
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