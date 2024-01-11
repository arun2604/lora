import Cookies from "js-cookie";

export const getHeaderToken = async () => {
    const token = Cookies.get("accessToken");
    let accessToken = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    return accessToken;
};
