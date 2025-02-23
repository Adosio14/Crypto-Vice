import axios from "axios";
import type { CryptoPrice } from "../models/responses/crypto-price.response.model";

const cryptoClient = axios.create({
    baseURL: "https://criptoya.com/api/argenbtc/"
});

export default {
    async getCryptoInfo(crypto: string): Promise<CryptoPrice | undefined> {
        try {
            const response = await cryptoClient.get<CryptoPrice>(
                `/${crypto.toLowerCase()}/ars/0.1`
            );
            return response.data;
        } catch (error) {
            console.error("Error obteniendo las criptos: ", error);
        }
    }
}