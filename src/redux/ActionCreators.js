import * as ActionTypes from './ActionTypes';
import { baseUrl } from '../shared/baseUrl';

export const addComment = (comment) => ({
    type: ActionTypes.ADD_COMMENT,
    payload: comment
});

export const postComment = (dishId, rating, comment) => (dispatch) => {

    let token = JSON.parse(localStorage.getItem('token'));

    if (!token) {
        return;
    }

    const newComment = {
        dishesId: dishId,
        customerId: token.userId,
        rating: rating,
        comment: comment
    }

    return fetch(baseUrl + 'api/Comments', {
        method: 'POST',
        body: JSON.stringify(newComment),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token.id
        },
        credentials: 'same-origin'
    })
    .then(response => {
        if (response.ok) {
            return response;
        }
        else {
            var error = new Error('Error ' + response.status + ': ' + response.statusText);
            error.response = response;
            throw error;
        }
    },
    error => {
        var errmess = new Error(error.message);
        throw errmess;
    })
    .then(response => response.json())
    .then(response => dispatch(fetchComments()))
    .catch(error => { console.log('Post comments ', error.message);
        alert('Your comment could not be posted\nError: '+ error.message); })
}

export const fetchDishes = () => (dispatch) => {
    dispatch(dishesLoading(true));

    return fetch(baseUrl + 'api/dishes')
        .then(response => {
            if (response.ok) {
                return response;
            }
            else {
                var error = new Error('Error ' + response.status + ': ' + response.statusText);
                error.response = response;
                throw error;
            }
        },
        error => {
            var errmess = new Error(error.message);
            throw errmess;
        })
        .then(response => response.json())
        .then(dishes => dispatch(addDishes(dishes)))
        .catch(error => dispatch(dishesFailed(error.message)));
}

export const dishesLoading = () => ({
    type: ActionTypes.DISHES_LOADING
});

export const dishesFailed = (errmess) => ({
    type: ActionTypes.DISHES_FAILED,
    payload: errmess
});

export const addDishes = (dishes) => ({
    type: ActionTypes.ADD_DISHES,
    payload: dishes
});

export const fetchComments = () => (dispatch) => {
    return fetch(baseUrl + 'api/Comments?filter={"include": ["customer"]}')
        .then(response => {
            if (response.ok) {
                return response;
            }
            else {
                var error = new Error('Error ' + response.status + ': ' + response.statusText);
                error.response = response;
                throw error;
            }
        },
        error => {
            var errmess = new Error(error.message);
            throw errmess;
        })
        .then(response => response.json())
        .then(comments => dispatch(addComments(comments)))
        .catch(error => dispatch(commentsFailed(error.message)));
}

export const commentsFailed = (errmess) => ({
    type: ActionTypes.COMMENTS_FAILED,
    payload: errmess
});

export const addComments = (comments) => ({
    type: ActionTypes.ADD_COMMENTS,
    payload: comments
});

export const fetchPromos = () => (dispatch) => {
    dispatch(promosLoading(true));

    return fetch(baseUrl + 'api/promotions')
        .then(response => {
            if (response.ok) {
                return response;
            }
            else {
                var error = new Error('Error ' + response.status + ': ' + response.statusText);
                error.response = response;
                throw error;
            }
        },
        error => {
            var errmess = new Error(error.message);
            throw errmess;
        })
        .then(response => response.json())
        .then(promos => dispatch(addPromos(promos)))
        .catch(error => dispatch(promosFailed(error.message)));
}

export const promosLoading = () => ({
    type: ActionTypes.PROMOS_LOADING
});

export const promosFailed = (errmess) => ({
    type: ActionTypes.PROMOS_FAILED,
    payload: errmess
});

export const addPromos = (promos) => ({
    type: ActionTypes.ADD_PROMOS,
    payload: promos
});

export const fetchLeaders = () => (dispatch) => {
    
    dispatch(leadersLoading());

    return fetch(baseUrl + 'api/leaders')
    .then(response => {
        if (response.ok) {
            return response;
        } else {
            var error = new Error('Error ' + response.status + ': ' + response.statusText);
            error.response = response;
            throw error;
        }
        },
        error => {
            var errmess = new Error(error.message);
            throw errmess;
        })
    .then(response => response.json())
    .then(leaders => dispatch(addLeaders(leaders)))
    .catch(error => dispatch(leadersFailed(error.message)));
}

export const leadersLoading = () => ({
    type: ActionTypes.LEADERS_LOADING
});

export const leadersFailed = (errmess) => ({
    type: ActionTypes.LEADERS_FAILED,
    payload: errmess
});

export const addLeaders = (leaders) => ({
    type: ActionTypes.ADD_LEADERS,
    payload: leaders
});

export const postFeedback = (feedback) => (dispatch) => {
        
};

export const requestLogin = (creds) => {
    return {
        type: ActionTypes.LOGIN_REQUEST,
        creds
    }
}
  
export const receiveLogin = (response) => {
    return {
        type: ActionTypes.LOGIN_SUCCESS,
        token: response.id
    }
}
  
export const loginError = (message) => {
    return {
        type: ActionTypes.LOGIN_FAILURE,
        message
    }
}

export const loginUser = (creds) => (dispatch) => {
    // We dispatch requestLogin to kickoff the call to the API
    dispatch(requestLogin(creds))

    return fetch(baseUrl + 'api/Customers/login', {
        method: 'POST',
        headers: { 
            'Content-Type':'application/json' 
        },
        body: JSON.stringify(creds)
    })
    .then(response => {
        if (response.status === 200) {
            return response;
        } else {
            var error = new Error('Error ' + response.status + ': ' + response.statusText);
            error.response = response;
            throw error;
        }
        },
        error => {
            throw error;
        })
    .then(response => response.json())
    .then(response => {
        if (response.id) {
            // If login was successful, set the token in local storage
            localStorage.setItem('token', JSON.stringify(response));
            localStorage.setItem('creds', JSON.stringify(creds));
            // Dispatch the success action
            dispatch(fetchFavourites());
            dispatch(receiveLogin(response));
        }
        else {
            var error = new Error('Error ' + response.status);
            error.response = response;
            throw error;
        }
    })
    .catch(error => dispatch(loginError(error.message)))
};

export const requestLogout = () => {
    return {
      type: ActionTypes.LOGOUT_REQUEST
    }
}
  
export const receiveLogout = () => {
    return {
      type: ActionTypes.LOGOUT_SUCCESS
    }
}

// Logs the user out
export const logoutUser = () => (dispatch) => {
    dispatch(requestLogout())

    let token = JSON.parse(localStorage.getItem('token'));
    return fetch(baseUrl + 'api/Customers/logout?access_token=' + token.id, {
        method: 'POST'
    })
    .then(response => {
        if (response.status === 204) {
            // If login was successful, set the token in local storage
            localStorage.removeItem('token');
            localStorage.removeItem('creds');
            // Dispatch the success action
            dispatch(favouritesFailed("Error 401: Unauthorized"));
            dispatch(receiveLogout());
        } else {
            var error = new Error('Error ' + response.status + ': ' + response.statusText);
            error.response = response;
            throw error;
        }
        },
        error => {
            throw error;
        })
    .catch(error => console.log('Logout Error ' + error.message));

}

export const postFavourite = (dishId) => (dispatch) => {

    let token = JSON.parse(localStorage.getItem('token'));
    console.log(token);
    if (!token) {
        return;
    }

    return fetch(baseUrl + 'api/favourites/', {
        method: "POST",
        body: JSON.stringify({dishesId: dishId, customerId: token.userId}),
        headers: {
          "Content-Type": "application/json",
          'Authorization': token.id
        },
        credentials: "same-origin"
    })
    .then(response => {
        if (response.ok) {
          return response;
        } else {
          var error = new Error('Error ' + response.status + ': ' + response.statusText);
          error.response = response;
          throw error;
        }
      },
      error => {
            throw error;
      })
    .then(response => response.json())
    .then(favourite => { console.log('Favourite Added', favourite); dispatch(fetchFavourites()); })
    .catch(error => dispatch(favouritesFailed(error.message)));
}

export const deleteFavourite = (id) => (dispatch) => {

    let token = JSON.parse(localStorage.getItem('token'));

    if (!token) {
        return;
    }

    return fetch(baseUrl + 'api/favourites/' + id, {
        method: "DELETE",
        headers: {
            'Authorization': token.id
        },
        credentials: "same-origin"
    })
    .then(response => {
        if (response.ok) {
          return response;
        } else {
          var error = new Error('Error ' + response.status + ': ' + response.statusText);
          error.response = response;
          throw error;
        }
      },
      error => {
            throw error;
      })
    .then(response => response.json())
    .then(favourite => { console.log('Favourite Deleted', favourite); dispatch(fetchFavourites()); })
    .catch(error => dispatch(favouritesFailed(error.message)));
};

export const fetchFavourites = () => (dispatch) => {
    dispatch(favouritesLoading(true));

    const token = JSON.parse(localStorage.getItem('token'));

    if (!token) {
        return dispatch(favouritesFailed('No User Logged in!'));
    }

    return fetch(baseUrl + 'api/Customers/' + token.userId + '/favourites?filter={"include": ["dishes"]}', {
        headers: {
            'Authorization': token.id
        },
    })
    .then(response => {
        console.log(response);
        if (response.ok) {
            return response;
        }
        else {
            var error = new Error('Error ' + response.status + ': ' + response.statusText);
            error.response = response;
            throw error;
        }
    },
    error => {
        var errmess = new Error(error.message);
        throw errmess;
    })
    .then(response => response.json())
    .then(favourites => dispatch(addFavourites(favourites)))
    .catch(error => dispatch(favouritesFailed(error.message)));
}

export const favouritesLoading = () => ({
    type: ActionTypes.FAVOURITES_LOADING
});

export const favouritesFailed = (errmess) => ({
    type: ActionTypes.FAVOURITES_FAILED,
    payload: errmess
});

export const addFavourites = (favourites) => ({
    type: ActionTypes.ADD_FAVOURITES,
    payload: favourites
});