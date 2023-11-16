class Api {
  constructor({ baseUrl, headers }) {
    this._baseUrl = baseUrl;
    this._headers = headers;
  }

  // Метод проверки успешности запроса
  _getResponseData(res) {
    return res.ok ? res.json() : res.json().then(res => Promise.reject(`${res.message}`));
  }

  getUserInfo() {
    return fetch(`${this._baseUrl}/users/me`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.jwt}`
      },

    }).then(res => this._getResponseData(res))
  }

  // Редактирование профиля
  patchUserInfo(data) {
    return fetch(`${this._baseUrl}/users/me`, {
      headers: this._headers,
      credentials: "include",
      method: "PATCH",
      body: JSON.stringify({
        name: data.name,
        email: data.email,
      }),
    }).then(res => this._getResponseData(res))
  }

  getContent(token) {
    return fetch(`${this._baseUrl}/users/me`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    })
    .then((res) => this._getResponse(res))
    .then(data => data)
  }

  getSavedMovies() {
    return fetch(`${this._baseUrl}/movies`, {

      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.jwt}`
      },

    }).then(res => this._getResponseData(res))
  }

  addMovie(data) {
    return fetch(`${this._baseUrl}/movies`, {
      method: "POST",
      headers: this._headers,
      credentials: "include",
      body: JSON.stringify({
        country: data.country,
        director: data.director,
        duration: data.duration,
        year: data.year,
        description: data.description,
        image: `${this._apiURL}${data.image.url}`,
        trailerLink: data.trailerLink,
        thumbnail: `${this._apiURL}${data.image.url}`,
        movieId: data.id,
        nameRU: data.nameRU,
        nameEN: data.nameEN,
      }),
    }).then((res) => res.json());
  }

  deleteMovie(id) {
    return fetch(`${this._baseUrl}/movies/${id}`, {
      method: "DELETE",
      headers: this._headers,
      credentials: "include",
    }).then(res => this._getResponseData(res))
  }
}

const api = new Api({
  baseUrl: "https://api.thatsmovies.nomoredomainsrocks.ru",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
