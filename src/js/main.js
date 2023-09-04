const $btn_person = document.querySelector(".btn-person");
const $btn_planet = document.querySelector(".btn-planet");
const $btn_vehicles = document.querySelector(".btn-vehicles");
const $btns_box = document.querySelector(".place-for-select");
const $box_list = document.querySelector(".back-button");
const $list = document.querySelector(".list-group");
const $btn_next = document.querySelector(".btn--nxt");
const $btn_previous = document.querySelector(".btn--prvsl");
const $modalBody = document.querySelector(".modal-body");
const $background_page = document.querySelector(".bg-page");
const $spinner = document.querySelector(".spinner");
const $spinner_parent = document.querySelector(".spinner-parent");

$btn_person.addEventListener("click", showPersons);
$btn_planet.addEventListener("click", showPlanets);
$btn_vehicles.addEventListener("click", showVehicles);

const API = "https://swapi.dev/api/";
let data = [];
let url = null;
let nextUrl = null;
let previousUrl = null;

function showPersons() {
    url = `${API}/people`;
    hideBtnsBox();
    getNextUrl(url);
    $list.setAttribute("data", "person");
}

function showPlanets() {
    url = `${API}/planets`;
    hideBtnsBox();
    getNextUrl(url);
    $list.setAttribute("data", "planet");
}

function showVehicles() {
    url = `${API}/vehicles`;
    hideBtnsBox();
    getNextUrl(url);
    $list.setAttribute("data", "vehicles");
}

$btn_next.addEventListener("click", function () {
    getNextUrl(nextUrl);
});

function getNextUrl(url) {
    if (url !== null) {
        $btn_previous.removeAttribute("disabled", "disabled");
        axios
            .get(url)
            .then((respond) => {
                if (data.length <= 0 && respond.status === 200) {
                    nextUrl = respond.data.next;
                    data = respond.data.results;
                    outputList(data);
                } else if (data.length >= 1 && respond.status === 200) {
                    $list.innerHTML = "";
                    nextUrl = respond.data.next;
                    previousUrl = respond.data.previous;
                    data = respond.data.results;
                    outputList(data); 
                }; 
            })
            .catch((errorMes) => {
                $background_page.innerHTML = "";
                $background_page.style.background = "white";
                $background_page.innerHTML = `
                    <span class="err">Error: ${errorMes.message}!</span>
                `;
            });
    } else {
        $btn_next.setAttribute("disabled", "disabled");
    }
}

$btn_previous.addEventListener("click", getPreviousUrl);

function getPreviousUrl() {
    if (previousUrl !== null) {
        $btn_next.removeAttribute("disabled", "disabled");
        axios
            .get(previousUrl)
            .then((respond) => {
                if (data.length >= 1 && respond.status === 200) {
                    $list.innerHTML = "";
                    previousUrl = respond.data.previous;
                    nextUrl = respond.data.next;
                    data = respond.data.results;
                    outputList(data); 
                };
            })
            .catch((errorMes) => {
                $background_page.innerHTML = "";
                $background_page.style.background = "white";
                $background_page.innerHTML = `
                    <span class="err">Error: ${errorMes.message}!</span>
                `;
            });
    } else {
        $btn_previous.setAttribute("disabled", "disabled");
    }
}

function hideBtnsBox() {
    $btns_box.classList.add("d-n");
}

document.querySelector(".btn-back")
.addEventListener("click", function () {
    $list.innerHTML = "";
    $box_list.classList.add("d-n");
    $btns_box.classList.remove("d-n");
});

function outputInfo(info) {
    $list.addEventListener("click", function (e) {
        getInfo(e,info);
    });
}

function getInfo(e, info) {
    const kind = e.target.parentElement.attributes[1].value;
    if (kind === "person" && e.target.innerText === info.name) {
        $modalBody.innerHTML = `
        <p>Name: ${info.name}</p>
        <p>Date of birth: ${info.birth_year}</p>
        <p>Gender: ${info.gender}</p>
        <p>Mass: ${info.mass}</p>
        <p>Height: ${info.height}</p>
        <p>Skin color: ${info.skin_color}</p>
        `;
    } else if (kind === "planet" && e.target.innerText === info.name) {
        $modalBody.innerHTML = `
        <p>Name: ${info.name}</p>
        <p>Climate: ${info.climate}</p>
        <p>Diameter: ${info.diameter}</p>
        <p>Population: ${info.population}</p>
        <p>Gravity: ${info.gravity}</p>
        <p>Orbital period: ${info.orbital_period}</p>
        `;
    } else if (kind === "vehicles" && e.target.innerText === info.name) {
        $modalBody.innerHTML = `
        <p>Nsme: ${info.name}</p>
        <p>Model: ${info.model}</p>
        <p>Length: ${info.length}</p>
        <p>Crew: ${info.crew}</p>
        <p>Cargo capacity: ${info.cargo_capacity}</p>
        <p>Cost: ${info.cost_in_credits}</p>
        `;
    }
}

function outputList(names) {
    names.forEach((item) => {
        $box_list.classList.remove("d-n");
        const $itemInList = document.createElement("button");
        $itemInList.setAttribute("type", "button");
        $itemInList.setAttribute("data-toggle", "modal");
        $itemInList.setAttribute("data-target", "#exampleModal");
        $itemInList.classList.add("list-group-item", "list-group-item-action", "list-group-item-danger");
        $itemInList.textContent = item.name;
        $list.appendChild($itemInList);
        outputInfo(item);
    });
}