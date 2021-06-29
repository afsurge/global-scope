import axios from "axios";

var instance = axios.create({
    xsrfCookieName: "dtoken",
    xsrfHeaderName: "csrf-token",
});

export default instance;
