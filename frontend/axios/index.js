// ✨ implement axiosWithAuth

import axios from "axios";


export const axiosWithAuth = () => {
    const token = localStorage.getItem('token');

    return axios.create({
        headers: {
            authorization: token,
        },
            baseURL: "http://localhost:9000/api"
    });
};

//need url? 