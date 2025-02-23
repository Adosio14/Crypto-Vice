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

export const useCryptoStore = defineStore('crypto', {
    state: (): CryptoStoreState => ({
        prices: {
            [CryptoType.BTC]: {} as CryptoPrice,
            [CryptoType.ETH]: {} as CryptoPrice,
            [CryptoType.DAI]: {} as CryptoPrice
        },
        userCryptoBalance: {
            [CryptoType.BTC]: 0,
            [CryptoType.ETH]: 0,
            [CryptoType.DAI]: 0
        }
    }),
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
            if (crypto == 'btc') {
                this.userCryptoBalance.btc = amount;
            } else if (crypto == 'eth') {
                this.userCryptoBalance.eth = amount;
            } else {
                this.userCryptoBalance.dai = amount;
            }
            console.log("CryptoAmount balance: ", this.userCryptoBalance)
        },
        getUsetCryptoBalance(crypto: string): number | undefined {
            if (crypto == 'btc') {
                return this.userCryptoBalance.btc;
            } else if (crypto == 'eth') {
                return this.userCryptoBalance.eth;
            } else {
                return this.userCryptoBalance.dai;
            }
        }
    }
})