import type { CryptoOption } from "./crypto-option";
import { CryptoType } from "./crypto-type";

export const cryptoOptions: CryptoOption[] = [
    { value: CryptoType.BTC, label: 'Bitcoin (BTC)' },
    { value: CryptoType.ETH, label: 'Ethereum (ETH)' },
    { value: CryptoType.DAI, label: 'DAI' }
]