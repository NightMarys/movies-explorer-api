import { useState, useEffect, useCallback } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import "./App.css";
import Header from "../Header/Header";
import Main from "../Main/Main";
import Footer from "../Footer/Footer";
import Login from "../Login/Login";
import Register from "../Register/Register";
import Movies from "../Movies/Movies";
import SavedMovies from "../SavedMovies/SavedMovies";
import Profile from "../Profile/Profile";
import Error from "../Error/Error";
import BurgerMenu from "../BurgerMenu/BurgerMenu";
import Preloader from "../Preloader/Preloader";
import ProtectedRoute from "../ProtectedRoute/ProtectedRoute";
import api from "../../utils/MainApi";
import moviesApi from "../../utils/MoviesApi";
import * as auth from "../../utils/Auth";
import CurrentUserContext from "../../contexts/CurrentUserContext";
import ROUTS from "../../utils/constants";

const {
  mainPath,
  loginPath,
  registerPath,
  moviesPath,
  savedMoviesPath,
  profilePath,
  otherPath,
} = ROUTS;

function App(props) {
  const [currentUser, setCurrentUser] = useState({});
  const [movies, setMovies] = useState([]);
  const [savedMovies, setSavedMovies] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [requestError, setRequestError] = useState("");
  const [successfulUpdate, setSuccessfulUpdate] = useState(false);
  const [searchError, setSearchError] = useState(false);
  const [isPreloaderActive, setPreloaderClass] = useState(true);

  const navigate = useNavigate();

  const handleTokenCheck = useCallback(async () => {
    const token = localStorage.getItem('Authorized');
    try {
      if (token) {
        const userData = await api.getContent(token);
        if (userData) {
          setLoggedIn(true);
          setCurrentUser(userData);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setPreloaderClass(false);
    }
  }, []);

  useEffect(() => {
    handleTokenCheck();
  }, [loggedIn, handleTokenCheck]);



/*
  useEffect(() => {
    if (loggedIn) {
      api.getUserInfo()
        .then((res) => {
          setCurrentUser(res)
        })
        .catch((err) => {console.log(err)});
      }
  }, [loggedIn]);

  const getMovies = () => {
    moviesApi
      .getMovies()
      .then((movies) => {
        setMovies(movies);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (currentUser.isLoggedIn) {
      getMovies();
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  }, [currentUser.isLoggedIn]);

  const getSavedMovies = () => {
    api
      .getMovies()
      .then((movies) => {
        setSavedMovies(movies);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (currentUser.isLoggedIn) {
      getSavedMovies();
    }
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, [currentUser.isLoggedIn]);
*/

/*
const checkUser = () => {
  api
    .getUserInfo()
    .then((user) => {
      setCurrentUser({
        name: user.name,
        email: user.email,
        isLoggedIn: true,
      });
    })
    .catch((err) => {
      setCurrentUser({ isLoggedIn: false });
      console.log(err);
    });
};


      const getMovies = () => {
        moviesApi
          .getMovies()
          .then((movies) => {
            setMovies(movies);
          })
          .catch((err) => {
            console.log(err);
          });
      };

      const getSavedMovies = () => {
        api
          .getMovies()
          .then((movies) => {
            setSavedMovies(movies);
          })
          .catch((err) => {
            console.log(err);
          });
      };

      useEffect(() => {
        if (currentUser.isLoggedIn) {
          checkUser();
          getSavedMovies();
        }
        setTimeout(() => {
          setLoading(false);
        }, 500);
      }, [currentUser.isLoggedIn]);

      useEffect(() => {
        if (currentUser.isLoggedIn) {
          getMovies();
          setTimeout(() => {
            setLoading(false);
          }, 500);
        }
      }, [currentUser.isLoggedIn]);



  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token) {
      auth
        .getToken(token)
        .then((data) => {
          if (data) {
            setLoggedIn(true);
            setCurrentUser(data);
            navigate("/");
          }
        })
        .catch((err) => {
          if (err === 400) {
            console.log("Токен не передан или передан не в том формате");
          }
          if (err === 401) {
            console.log("Переданный токен некорректен");
          }
        })
        .finally(() => {
          setPreloaderClass(false);
        });
    }
  }, [navigate, loggedIn]);
*/

const getMovies = () => {
  moviesApi
    .getMovies()
    .then((movies) => {
      setMovies(movies);
    })
    .catch((err) => {
      console.log(err);
    });
};

const getSavedMovies = () => {
  api
    .getMovies()
    .then((movies) => {
      setSavedMovies(movies);
    })
    .catch((err) => {
      console.log(err);
    });
};

useEffect(() => {
  if (currentUser.isLoggedIn) {
    getSavedMovies();
  }
  setTimeout(() => {
    setLoading(false);
  }, 500);
}, [currentUser.isLoggedIn]);

useEffect(() => {
  if (currentUser.isLoggedIn) {
    getMovies();
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }
}, [currentUser.isLoggedIn]);

  function handleLogIn(email, password) {
    setLoading(true);
    auth
      .login(email, password)
      .then((data) => {
        setLoggedIn(true);
        navigate("/movies", {replace: true});
        setRequestError("");
      })
      .catch((err) => {
        setRequestError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function handleRegistration(name, email, password) {
    setLoading(true);
    auth
      .register(name, email, password)
      .then(() => {
        handleLogIn(email, password);
        navigate("/movies", {replace: true});
        setRequestError("");
      })
      .catch((err) => {
        setRequestError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function handleSignOut() {
    auth
      .logout()
      .then((res) => {
        setLoggedIn(false);
        setCurrentUser({});
        localStorage.clear();
        navigate("/");
      })
      .catch((err) => {
        console.log(err);
      });
  }



  /*
  function handleUpdateUser(name, email) {
    setLoading(true);
    api
      .patchUserInfo(name, email)
      .then((res) => {
        setCurrentUser(res);
        setSuccessfulUpdate(true);
        setRequestError("");
      })
      .catch((err) => {
        setRequestError(err);
        setSuccessfulUpdate(false);
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function handleSearchMovies() {
    setLoading(true);
    setSearchError(false);
    try {
      const result = moviesApi.getMovies();
      if (result) {
        return result;
      }
    } catch (err) {
      setSearchError(true);
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  function addMovie(movie) {
    api
      .addMovie({
        country: movie.country,
        director: movie.director,
        duration: movie.duration,
        year: movie.year,
        description: movie.description,
        image: `${"https://api.nomoreparties.co" + movie.image.url}`,
        trailerLink: movie.trailerLink,
        nameRU: movie.nameRU,
        nameEN: movie.nameEN,
        thumbnail: `${
          "https://api.nomoreparties.co" + movie.image.formats.thumbnail.url
        }`,
        movieId: movie.id,
      })
      .then((newMovie) => {
        const movies = JSON.parse(localStorage.getItem("SavedMovies") || "[]");
        const newMovies = [...movies, newMovie];
        localStorage.setItem("SavedMovies", JSON.stringify(newMovies));
        setSavedMovies(JSON.parse(localStorage.getItem("SavedMovies")));
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleDeleteMovie(movie) {
    const movies = JSON.parse(localStorage.getItem("SavedMovies"));
    const savedMovie = movies.find(
      (card) => card.movieId === movie.id || card.movieId === movie.movieId
    );
    api
      .deleteMovie(savedMovie._id)
      .then(() => {
        const remainingMovies = movies.filter(
          (card) => card._id !== savedMovie._id
        );
        localStorage.setItem("SavedMovies", JSON.stringify(remainingMovies));
        setSavedMovies(JSON.parse(localStorage.getItem("SavedMovies")));
      })
      .catch((err) => {
        console.log(err);
      });
  }
*/
  const openBurgerMenu = () => {
    setIsMenuOpen(true);
  };

  const closeBurgerMenu = () => {
    setIsMenuOpen(false);
  };

  return (

    <div className="page">
      <div className="page__container">
      <CurrentUserContext.Provider value={currentUser}>
          <Routes>
            <Route
              path={mainPath}
              element={
                <>
                  <Header openMenu={openBurgerMenu} />
                  <Main />
                  <Footer />
                </>
              }
            />
            <Route
              path={moviesPath}
              element={
                <ProtectedRoute
                  loggedIn={loggedIn}
                  element={
                    <>
                      <Header openMenu={openBurgerMenu} />
                      <Movies
                        savedMovies={movies}
                        searchError={searchError}
                        onSearch={handleSearchMovies}
                        isLoading={isLoading}
                        onMovieAdd={addMovie}
                        onMovieDelete={handleDeleteMovie}
                      />
                      <Footer />
                    </>
                  }
                />
              }
            />
            <Route
              path={savedMoviesPath}
              element={
                <ProtectedRoute
                  loggedIn={loggedIn}
                  element={
                    <>
                      <Header openMenu={openBurgerMenu} />
                      <SavedMovies
                        savedMovies={savedMovies}
                        onMovieDelete={handleDeleteMovie}
                      />
                      <Footer />
                    </>
                  }
                />
              }
            />
            <Route
              path={profilePath}
              element={
                <ProtectedRoute
                  loggedIn={loggedIn}
                  element={
                    <>
                      <Header openMenu={openBurgerMenu} />
                      <Profile
                        onLogOut={handleSignOut}
                        onLoading={isLoading}
                        onProfile={handleUpdateUser}
                        requestError={requestError}
                        onUpdate={successfulUpdate}
                      />
                    </>
                  }
                />
              }
            />
            <Route
              path={registerPath}
              element={
                <Register
                  onRegister={handleRegistration}
                  onLoading={isLoading}
                  requestError={requestError}
                  loggedIn={loggedIn}
                />
              }
            />

            <Route
              path={loginPath}
              element={
                <Login
                  onLogin={handleLogIn}
                  onLoading={isLoading}
                  requestError={requestError}
                  loggedIn={loggedIn}
                />
              }
            />

            <Route path={otherPath} element={<Error />} />
          </Routes>
          <BurgerMenu isOpen={isMenuOpen} onClose={closeBurgerMenu} />
        </CurrentUserContext.Provider>
      </div>
    </div>
  );
}

export default App;
