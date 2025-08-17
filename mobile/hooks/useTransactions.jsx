// react custom hook file

import { useCallback, useState } from "react";
import { Alert } from "react-native";
import { API_URL } from "../constants/api";


// const API_URL = "http://localhost:5001/api";

export const useTransactions = (userId) => {
    const [transactions, setTransactions] = useState([]);
    const [summary, setSummary] = useState({
        balance: 0,
        income: 0,
        expenses: 0,
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchTransactions = useCallback(async () => {
        try {
            const response = await fetch(`${API_URL}/transactions/${userId}`);
            if (!response.ok) {
                const text = await response.text();
                throw new Error(`Server responded with ${response.status}: ${text}`);
            }
            const data = await response.json();
            setTransactions(data);
            setError(null);
        } catch (error) {
            console.error("Error fetching transactions:", error);
            setError(error.message);
        }
    }, [userId]);

    const fetchSummary = useCallback(async () => {
        try {
            const response = await fetch(`${API_URL}/transactions/summary/${userId}`);
            if (!response.ok) {
                const text = await response.text();
                throw new Error(`Server responded with ${response.status}: ${text}`);
            }
            const data = await response.json();
            setSummary(data);
            setError(null);
        } catch (error) {
            console.error("Error fetching summary:", error);
            setError(error.message);
        }
    }, [userId]);

    const loadData = useCallback(async () => {
        if (!userId) return;

        setIsLoading(true);
        try {
            await Promise.all([fetchTransactions(), fetchSummary()]);
        } catch (error) {
            console.error("Error loading data:", error);
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    }, [fetchTransactions, fetchSummary, userId]);

    const deleteTransaction = async (id) => {
        try {
            const response = await fetch(`${API_URL}/transactions/${id}`, {
                method: "DELETE"
            });

            if (!response.ok) {
                const text = await response.text();
                throw new Error(text || "Failed to delete transaction");
            }

            await loadData();
            Alert.alert("Success", "Transaction deleted successfully");
        } catch (error) {
            console.error("Error deleting transaction:", error);
            Alert.alert("Error", error.message);
        }
    };

    return {
        transactions,
        summary,
        isLoading,
        error,
        loadData,
        deleteTransaction
    };
};