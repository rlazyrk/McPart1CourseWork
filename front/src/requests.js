import axios from "axios";
import {GET_LAST_10, GET_LAST_100, GET_LAST_10_UP} from "./constants";
import async from "async";

export const fetchLast10records = async (id = null) => {
    let response;
    try {
        if (isNaN(id) || id === null) {
            response = await axios.get(GET_LAST_10);
        } else {
            response = await axios.get(`${GET_LAST_10}?id=${id}`);
        }
        console.log(response.data)
        return response.data;
    } catch (error) {
        console.error("Error response", error);
        throw error;
    }
}

export const fetch10recordsUP = async (id = null) => {
    let response;
    try {
        response = await axios.get(`${GET_LAST_10_UP}?id=${id}`);

        return response.data;

    } catch (error) {
        console.error("Error response", error);
        throw error;
    }
}

export const fetch100records = async () => {
    let response;
    try{
        response = await axios.get(GET_LAST_100);
        return response.data;
    }
    catch (error){
        console.error("Error response", error);
        throw error;
    }
}