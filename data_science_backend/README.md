# Data Science Assessment: Weather Trend Forecasting

This repository contains the Data Science / AI Engineer Assessment for the PM Accelerator Internship.

## Objective
Analyze the **Global Weather Repository** dataset to uncover trends, detect anomalies, and build predictive models for temperature forecasting using both univariate and multivariate Machine Learning techniques.

## Key Features & Methodologies

1. **Exploratory Data Analysis (EDA) & Data Cleaning:**
   - Handled missing values through forward and backward fill for time-series consistency.
   - Parsed dates and standardized formatting.
   - Applied **Cyclic Encoding** for temporal features (`hour` and `month`) and **Normalized** numerical features using Scikit-Learn's `StandardScaler` to ensure optimal ML performance.
   - Generated histograms, feature correlation matrices, and time-series precipitation graphs specific to localized areas (e.g., Kabul).

2. **Anomaly Detection:**
   - Implemented Z-Score statistical analysis to identify and plot extreme temperature outliers (Z-score > 3).

3. **Forecasting Model 1 (Univariate - Prophet):**
   - Used Meta's Prophet model to forecast temperatures for a specific location (Kabul) over the next 30 days, capturing daily seasonality patterns effectively without the noise of global averaging. Evaluated with RMSE and MAE.

4. **Forecasting Model 2 (Multivariate Ensemble & Baseline):**
   - Created a Baseline **Linear Regression** model for direct performance comparison.
   - Built a robust **Voting Regressor Ensemble** combining `XGBoost` and `Random Forest Regressor`.
   - Used cyclically encoded and normalized multi-features (`wind_mph`, `humidity`, `latitude`, `longitude`, etc.) to predict temperatures.
   - Evaluated the ensemble model using RMSE and MAE, demonstrating significant improvement over the Baseline.

5. **Unique Analyses (Advanced Requirements):**
   - **Feature Importance:** Extracted and visualized the most impactful features for temperature prediction using the base XGBoost model.
   - **Geographical Patterns:** Generated a spatial heatmap mapping longitude and latitude to temperature distributions globally.
   - **Environmental Impact:** Analyzed the relationship between PM2.5 Air Quality and global temperatures.

## How to Run

1. Clone this repository.
2. Ensure you have Python 3.11+ installed.
3. Install the dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Place the `GlobalWeatherRepository.csv` dataset inside the `data/` folder.
5. Launch Jupyter Notebook to view the analysis:
   ```bash
   jupyter notebook Weather_Forecasting_Analysis.ipynb
   ```

---
*Built by Tomás Ignacio Nadal* | *Project for PM Accelerator*
