import axios from "axios";

const YELP_BASE = "https://api.yelp.com/v3";

export const yelpClient = axios.create({
    baseURL: YELP_BASE,
    headers: {
        Authorization: `Bearer ${process.env.YELP_API_KEY}`,
        "Content-Type": "application/json",
    },
});
