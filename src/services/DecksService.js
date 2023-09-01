import axios from "axios";

class DecksDataService {
    createNewDeck(data) {
        return axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/v1/magic/deck`, data);
    }
    updateDeck(data) {
        return axios.put(`${process.env.REACT_APP_API_BASE_URL}/api/v1/magic/deck`, data);
    }

    getDecks(page = 0, userId) {
        return axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/v1/magic/deck?page=${page}&userId=${userId}`);
    }

    deleteDeck(data) {
        return axios.delete(`${process.env.REACT_APP_API_BASE_URL}/api/v1/magic/deck`, { data: data});
    }

    getDeck(id) {
        return axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/v1/magic/deck/id/${id}`);
    }
}

/* eslint import/no-anonymous-default-export: [2, {"allowNew": true}] */
export default new DecksDataService();