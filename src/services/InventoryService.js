import axios from "axios";

class InventoryDataService {
    getAll(page = 0) {
        return axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/v1/magic/inventory?page=${page}`);
    }
}

/* eslint import/no-anonymous-default-export: [2, {"allowNew": true}] */
export default new InventoryDataService();