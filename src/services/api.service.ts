import axios from "axios";
import type { TransactionRequest } from "../models/requests/transaction.request.model";
import type { TransactionResponse } from "../models/responses/transaction.response.model";

const apiClient = axios.create({
    baseURL: "https://laboratorio3-f36a.restdb.io/rest/",
    headers: { "x-apikey": "60eb09146661365596af552f" }
});

export default {
    async createTransaction(transaction: TransactionRequest): Promise<TransactionResponse | undefined> {
        try {
            const response = await apiClient.post<TransactionResponse>("transactions", transaction);
            return response.data;
        } catch (error) {
            console.error(error);
        }
    },

    async getUserTransactions(user: string): Promise<TransactionResponse[] | undefined> {
        try {
            const response = await apiClient.get<TransactionResponse[]>("transactions", {
                params: {
                    q: JSON.stringify({ user_id: user })
                }
            });
            console.log("Request: ", response.request);
            return response.data;
        } catch (error) {
            console.error(error);
        }
    },

    async getTransactionById(id: string): Promise<TransactionResponse | undefined> {
        try {
            const response = await apiClient.get<TransactionResponse>(`transactions/${id}`);
            return response.data;
        } catch (error) {
            console.error(error);
        }
    },

    async deleteTransaction(id: string): Promise<string | undefined> {
        try {
            await apiClient.delete(`transactions/${id}`);
            return "Transacción eliminada con éxito.";
        } catch (error) {
            console.error(error);
        }
    },

    async editTransaction(id: string, body: Partial<TransactionRequest>): Promise<TransactionResponse | undefined> {
        try {
            const response = await apiClient.patch(`transactions/${id}`, body);
            return response.data;
        } catch (error) {
            console.error(error);
        }
    }
}