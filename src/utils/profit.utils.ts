import type { TransactionResponse } from "../models/responses/transaction.response.model"

export interface InvestmentResult {
    crypto_code: string
    result: number
}

export function calculateInvestmentResults(
    transactions: TransactionResponse[],
    currentPrices: Record<string, number>
): InvestmentResult[] {
    const cryptoMap = transactions.reduce((acc, transaction) => {
        const code = transaction.crypto_code.toLowerCase()
        if (!acc[code]) {
            acc[code] = {
                totalPurchased: 0,
                totalSpent: 0,
                totalSold: 0,
                totalEarned: 0
            }
        }

        if (transaction.action === 'purchase') {
            acc[code].totalPurchased += parseFloat(transaction.crypto_amount)
            acc[code].totalSpent += parseFloat(transaction.money)
        } else {
            acc[code].totalSold += parseFloat(transaction.crypto_amount)
            acc[code].totalEarned += parseFloat(transaction.money)
        }

        return acc
    }, {} as Record<string, {
        totalPurchased: number
        totalSpent: number
        totalSold: number
        totalEarned: number
    }>)

    return Object.entries(cryptoMap).map(([cryptoCode, data]) => {
        const currentPrice = currentPrices[cryptoCode] || 0
        const remainingCoins = data.totalPurchased - data.totalSold
        const currentValue = remainingCoins * currentPrice

        const totalResult = (data.totalEarned + currentValue) - data.totalSpent

        return {
            crypto_code: cryptoCode.toUpperCase(),
            result: parseFloat(totalResult.toFixed(2))
        }
    })
}