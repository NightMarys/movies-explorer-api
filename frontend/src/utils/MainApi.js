class Api {
  constructor({ baseUrl, headers }) {
    this._baseUrl = baseUrl.mainApi;
    this._headers = headers;
  }

  // Метод проверки успешности запроса
  _getResponse(res) {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`Ошибка: ${res.status}`);
  }

  register({name, email, password}) {
    return fetch(`${this._baseUrl}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        name: name,
        email: email,
        password: password,
      }),
    }).then(this._getResponse);
  };

  login({email, password}) {
    return fetch(`${this._baseUrl}/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    }).then(this._getResponse);
  };

  logout = () => {
    return fetch(`${this._baseUrl}/signout`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }).then(this._getResponse);
  };


  getUserInfo() {
    return fetch(`${this._baseUrl}/users/me`, {
      headers: this._headers,
      method: 'GET',
      credentials: "include",
    }).then(this._getResponse);
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
    }).then(this._getResponse);
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
      method: "GET",
      headers: this._headers,
      credentials: "include",
    }).then(this._getResponse);
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
    }).then(this._getResponse);
  }
}

const api = new Api({
  baseUrl: "https://api.thatsmovies.nomoredomainsrocks.ru",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
