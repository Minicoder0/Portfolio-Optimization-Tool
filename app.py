import streamlit as st
import yfinance as yf
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

from pypfopt import EfficientFrontier
from pypfopt import risk_models
from pypfopt import expected_returns

st.title("📊 Portfolio Optimization Dashboard")

# User Input
stocks = st.text_input("Enter stocks (comma separated)", 
                       "AAPL,MSFT,GOOGL,AMZN,TSLA")

start_date = st.date_input("Start Date")
end_date = st.date_input("End Date")

if st.button("Run Optimization"):

    stock_list = [s.strip() for s in stocks.split(",")]

    data = yf.download(stock_list, start=start_date, end=end_date)["Close"]

    mu = expected_returns.mean_historical_return(data)
    S = risk_models.sample_cov(data)

    ef = EfficientFrontier(mu, S)
    weights = ef.max_sharpe()
    cleaned_weights = ef.clean_weights()

    st.subheader("Optimal Weights")
    st.write(cleaned_weights)

    ret, vol, sharpe = ef.portfolio_performance()

    st.subheader("Performance")
    st.write(f"Expected Return: {ret:.2%}")
    st.write(f"Volatility: {vol:.2%}")
    st.write(f"Sharpe Ratio: {sharpe:.2f}")
    st.subheader("Optimal Portfolio Weights")

