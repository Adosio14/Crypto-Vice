
import type { Transaction } from "../base/transaction.model";

export interface TransactionResponse extends Transaction {
    _id: string;
}
