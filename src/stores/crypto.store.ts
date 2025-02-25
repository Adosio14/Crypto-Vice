import { defineStore } from "pinia";
import type { CryptoPrice } from "../models/responses/crypto-price.response.model";
import criptoYaService from "../services/cripto-ya.service";
import { CryptoType } from "../data/crypto-type";


interface CryptoStoreState {
    prices: {
        [key in CryptoType]: CryptoPrice
    }
    userCryptoBalance: {
        [key in CryptoType]: number
    }
}

const defaultUserCryptoBalance = {
    [CryptoType.BTC]: 0,
    [CryptoType.ETH]: 0,
    [CryptoType.DAI]: 0
};

export const useCryptoStore = defineStore('crypto', {
    state: (): CryptoStoreState => {
        const savedBalance = localStorage.getItem('userCryptoBalance');
        const initialBalance = savedBalance
            ? { ...defaultUserCryptoBalance, ...JSON.parse(savedBalance) }
            : defaultUserCryptoBalance;

        return {
            prices: {
                [CryptoType.BTC]: {} as CryptoPrice,
                [CryptoType.ETH]: {} as CryptoPrice,
                [CryptoType.DAI]: {} as CryptoPrice
            },
            userCryptoBalance: initialBalance
        };
    },
    actions: {
        async fetchCryptoPrices() {
            try {
                const response = await criptoYaService.getCryptoInfo('btc')
                if (response) this.prices.btc = response;

                const ethResponse = await criptoYaService.getCryptoInfo('eth')
                if (ethResponse) this.prices.eth = ethResponse;

                const daiResponse = await criptoYaService.getCryptoInfo('dai');
                if (daiResponse) this.prices.dai = daiResponse;

                console.log("Cripto data brodi: ", this.prices);

            } catch (error) {
                console.error('Error fetching crypto prices:', error);
            }
        },
        updateUserCryptoBalance(crypto: string, amount: number) {
            const cryptoKey = crypto as CryptoType;
            this.userCryptoBalance[cryptoKey] = amount;

            localStorage.setItem('userCryptoBalance', JSON.stringify(this.userCryptoBalance));
            console.log("Balance actualizado: ", this.userCryptoBalance);
        },
        getUsetCryptoBalance(crypto: string): number | undefined {

            const cryptoKey = crypto as CryptoType;
            console.log("CriptoKey: ", cryptoKey)
            return this.userCryptoBalance[cryptoKey];

        }
    }
})