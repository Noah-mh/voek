import config from "../../config/config";
import axios from 'axios';

const base = "https://api-m.sandbox.paypal.com";

export const createOrder = async (amount: number) => {
    const accessToken = await generateAccessToken();
    const url = `${base}/v2/checkout/orders`;
    const response = await axios.post(url, {
        intent: "CAPTURE",
        purchase_units: [
            {
                amount: {
                    currency_code: "SGD",
                    value: amount,
                },
            },
        ],
    }, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
    })
    return handleResponse(response);
}

export const capturePayment = async (orderId: any) => {
    const accessToken = await generateAccessToken();
    const url = `${base}/v2/checkout/orders/${orderId}/capture`;
    const response = await axios.post(url, {}, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
        },
    });

    return handleResponse(response);
}

export const generateAccessToken = async () => {
    const auth = Buffer.from(config.paypalClientId + ":" + config.paypalClientSecret).toString("base64");
    const response = await axios.post(`${base}/v1/oauth2/token`, "grant_type=client_credentials", {
        headers: {
            Authorization: `Basic ${auth}`,
        },
    });
    const jsonData = await handleResponse(response);
    return jsonData.access_token;
}

const handleResponse = async (response: any) => {
    if (response.status === 200 || response.status === 201) {
        try {
            const temp = response.data;
            return temp;
        } catch (error) {
            console.log(error)
        }

    }

    const errorMessage = await response.text();
    throw new Error(errorMessage);
}