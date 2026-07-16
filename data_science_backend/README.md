# Data Science Assessment: Weather Trend Forecasting

This repository contains the Data Science / AI Engineer Assessment for the PM Accelerator Internship.

## Objective
Analyze the **Global Weather Repository** dataset (152,997 records, 211 countries) to uncover trends, detect anomalies, and build predictive models for temperature forecasting using both univariate and multivariate Machine Learning techniques.

## Key Features & Methodologies

1. **Exploratory Data Analysis (EDA) & Data Cleaning:**
   - Handled missing values through forward and backward fill (sorted by city and timestamp for time-series consistency).
   - Applied **Cyclic Encoding** for temporal features (`hour` and `month`) and **StandardScaler normalization** for numerical features.
   - Generated histograms, feature correlation matrices, and time-series precipitation graphs localized to specific cities (e.g., Kabul).

2. **Anomaly Detection:**
   - Implemented Z-Score statistical analysis to identify extreme temperature outliers (|Z-Score| > 3).
   - Detected **994 anomalies** (~0.65% of records), with actual outlier temperatures ranging from **-29.8°C to +79.3°C**.

3. **Forecasting Model 1 (Univariate - Prophet):**
   - Used Meta's Prophet model to forecast temperatures for Kabul, evaluated on a chronological held-out test set (last 20% of data).
   - Captures annual seasonal patterns effectively: **RMSE = 5.65°C | MAE = 4.93°C** (~14% of Kabul's 40°C annual temperature range).

4. **Forecasting Model 2 (Multivariate Ensemble & Baseline):**
   - Baseline: **Linear Regression** (RMSE = 1.60°C | MAE = 1.13°C).
   - Ensemble: **Voting Regressor** combining tuned XGBoost + Random Forest using lag features (temp_lag_1, temp_rolling_3), cyclic time encodings, and normalized meteorological variables.
   - Ensemble result: **RMSE = 1.53°C | MAE = 1.09°C** (4.4% improvement over baseline).
   - Cross-validation uses TimeSeriesSplit to prevent data leakage.

5. **Unique Analyses (Advanced Requirements):**
   - **Anomaly Detection:** Z-Score visualization of 994 temperature outliers.
   - **Feature Importance & SHAP:** XGBoost feature importance + SHAP summary plot for model explainability.
   - **Geographical Patterns:** Spatial temperature scatter using real GPS coordinates (latitude/longitude in degrees).
   - **Climate Zone Clustering:** K-Means unsupervised clustering into 4 climate zones by temperature, humidity, and precipitation.
   - **Environmental Impact:** PM2.5 Air Quality vs. temperature and humidity analysis.

## How to Run

1. Clone this repository.
2. Ensure you have Python 3.11+ installed.
3. Install the dependencies:
   `
   pip install -r requirements.txt
   `
4. Place the `GlobalWeatherRepository.csv` dataset inside the `data/` folder.
   Download from: https://www.kaggle.com/datasets/nelgiriyewithana/global-weather-repository
5. Launch Jupyter Notebook:
   `
   jupyter notebook Weather_Forecasting_Analysis.ipynb
   `

---
*Built by Tomas Ignacio Nadal* | *Project for PM Accelerator*
