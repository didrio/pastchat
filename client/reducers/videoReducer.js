import * as types from '../constants/actionTypes';

const initialState = {
    isFetching: false,
    url: 'n5rS9vNbCDg',
    title: 'first title',
    description: 'first description',
}

const videoReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.GET_VIDINFO:
            return Object.assign({}, state, {
                isFetching: false,
            });
        case types.RECEIVE_VIDINFO:
            return Object.assign({}, state, {
                isFetching: false,
                title: action.title,
                description: action.description,
            });
        default:
            return state;
    }
}

export default videoReducer;