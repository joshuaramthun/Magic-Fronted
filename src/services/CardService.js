import axios from "axios";

class CardDataService {
    getAll(page = 0) {
        return axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/v1/magic?page=${page}`);
    }
    getCardByID(id) {
        return axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/v1/magic/id/${id}`);
    }
    getCardByName(name) {
        return axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/v1/magic/name/${name}`);
    }
}

/* eslint import/no-anonymous-default-export: [2, {"allowNew": true}] */
export default new CardDataService();