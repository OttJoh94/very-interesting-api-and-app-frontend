let container = document.querySelector("#movie-container");
let idInput = document.querySelector("#id-input");
let titleInput = document.querySelector("#title-input");
let descriptionInput = document.querySelector("#description-input");
let directorInput = document.querySelector("#director-input");
let lengthInput = document.querySelector("#length-input");
let ratingInput = document.querySelector("#rating-input");
let releaseDateInput = document.querySelector("#release-date-input");
let categoriesInput = document.querySelector("#categories-input");

let addMovieBtn = document.querySelector("#add-movie-btn");
let updateMovieBtn = document.querySelector("#update-movie-btn");
let deleteMovieBtn = document.querySelector("#delete-movie-btn");

let allMovies = [];

console.log(addMovieBtn);

addMovieBtn.addEventListener("click", addMovie);
updateMovieBtn.addEventListener("click", updateMovie);
deleteMovieBtn.addEventListener("click", deleteMovie);

GetMovies();

function test() {
  console.log("Click");
}

function GetMovies() {
  container.innerHTML = "";

  fetch("https://localhost:7140/Movie")
    .then((res) => res.json())
    .then((data) => {
      allMovies = data;
      displayMovies(data);
    });
}

function displayMovies(movies) {
  movies.forEach((m) => {
    let categoriesString = "";
    m.category.forEach((c) => (categoriesString += c + ", "));

    let html = `
        <div class="col-4" data-movieid="${m.id}">
          <div class="card movie-card text-bg-success mb-3">
            <div class="card-header">${categoriesString}</div>
              <div class="card-body" >
                <h5 class="card-title">${m.title}</h5>
                <p class="card-text"></p>
                <ul class="list-unstyled">
                  <li><span class="fw-bold">Id:</span> ${m.id}</li>
                  <li><span class="fw-bold">Director:</span> ${m.director}</li>
                  <li><span class="fw-bold">Length:</span> ${m.length}</li>
                  <li><span class="fw-bold">Rating:</span> ${m.rating}</li>
                  <li><span class="fw-bold">Release date:</span> ${m.releaseDate}</li>
                  <li><span class="fw-bold">Description:</span> ${m.description}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        `;

    container.innerHTML += html;
  });

  let movieCards = document.querySelectorAll(".movie-card");
  movieCards.forEach((c) => {
    c.addEventListener("click", handleMovieCardClick);
  });
}

function addMovie() {
  if (InputsAreValid()) {
    let newMovie = {
      id: Number(idInput.value),
      title: titleInput.value,
      description: descriptionInput.value,
      director: directorInput.value,
      length: Number(lengthInput.value),
      rating: Number(ratingInput.value),
      releaseDate: new Date(releaseDateInput.value).toISOString(),
      category: [categoriesInput.value],
    };

    fetch("https://localhost:7140/Movie", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newMovie),
    }).then((res) => {
      if (res.ok) {
        GetMovies();
        clearInputs();
      } else {
        console.log("Something wrong with the API");
      }
    });
  } else {
    console.log("Inputs are invalid");
  }
}

function handleMovieCardClick(event) {
  let movieId = event.currentTarget.dataset.movieid;

  console.log(movieId);
}

function updateMovie() {
  if (InputsAreValid()) {
    let updatedMovie = {
      id: Number(idInput.value),
      title: titleInput.value,
      description: descriptionInput.value,
      director: directorInput.value,
      length: Number(lengthInput.value),
      rating: Number(ratingInput.value),
      releaseDate: new Date(releaseDateInput.value).toISOString(),
      category: [categoriesInput.value],
    };

    fetch("https://localhost:7140/Movie", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedMovie),
    }).then((res) => {
      if (res.ok) {
        GetMovies();
        clearInputs();
      } else {
        console.log("Something wrong with the API");
      }
    });
  } else {
    console.log("Invalid inputs");
  }
}

function deleteMovie() {
  let movieId = idInput.value;
  console.log(movieId);

  fetch(`https://localhost:7140/Movie?id=${movieId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => {
    if (res.ok) {
      GetMovies();
      clearInputs();
    } else {
      console.log("Something wrong with the API");
    }
  });
}

function clearInputs() {
  idInput.value = "";
  titleInput.value = "";
  descriptionInput.value = "";
  directorInput.value = "";
  releaseDateInput.value = "";
  ratingInput.value = "";
  categoriesInput.value = "";
  lengthInput.value = "";
}

function InputsAreValid() {
  if (idInput.value == "") return false;
  if (titleInput.value == "") return false;
  if (directorInput.value == "") return false;
  if (lengthInput.value == "") return false;

  let regex = /^(?:[1-9]|10|\d\.\d)$/;
  if (!regex.test(Number(ratingInput.value))) return false;
  let inputDate = new Date(releaseDateInput.value);
  if (isNaN(inputDate)) return false;
  return true;
}
