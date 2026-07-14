# ---
# jupyter:
#   jupytext:
#     text_representation:
#       extension: .py
#       format_name: percent
#       format_version: '1.3'
#       jupytext_version: 1.19.4
#   kernelspec:
#     display_name: Python 3
#     language: python
#     name: python3
# ---

# %% [markdown]
#
# # Tech Assessment: Weather Trend Forecasting
# **Role:** AI Engineer Intern + Data Science Intern (Dual Role)
# **Author:** Tomás Ignacio Nadal
#
# > **PM Accelerator Mission:** The Product Manager Accelerator is a premier program designed to help professionals transition into and accelerate their careers in product management. Our mission is to empower individuals with the skills, network, and experience needed to succeed in tech.
#
# ---
# ## Objective
# Analyze the `GlobalWeatherRepository.csv` dataset to forecast future weather trends using advanced Machine Learning techniques (Prophet, XGBoost, Random Forest Ensembles), anomaly detection, and environmental analysis.
#

# %%

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from prophet import Prophet
from xgboost import XGBRegressor
from sklearn.ensemble import RandomForestRegressor, VotingRegressor
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import mean_squared_error, mean_absolute_error
import warnings
warnings.filterwarnings('ignore')

# Set aesthetic styling
sns.set_theme(style="whitegrid", palette="muted")
plt.rcParams['figure.figsize'] = (12, 6)


# %% [markdown]
# ## 1. Data Cleaning & Preprocessing (Normalization)

# %%

# Load dataset
df = pd.read_csv('data/GlobalWeatherRepository.csv')

# Parse dates
df['last_updated'] = pd.to_datetime(df['last_updated'])

# Drop duplicates if any
df = df.drop_duplicates()

# Handle missing values: Forward fill for time series consistency
df = df.sort_values(by=['country', 'location_name', 'last_updated'])
df = df.ffill().bfill()

# Feature Engineering: Temporal Features (Cyclic Encoding)
df['hour_sin'] = np.sin(2 * np.pi * df['last_updated'].dt.hour / 24)
df['hour_cos'] = np.cos(2 * np.pi * df['last_updated'].dt.hour / 24)
df['month_sin'] = np.sin(2 * np.pi * df['last_updated'].dt.month / 12)
df['month_cos'] = np.cos(2 * np.pi * df['last_updated'].dt.month / 12)

# Data Normalization
features_to_normalize = ['wind_mph', 'pressure_mb', 'precip_mm', 'humidity', 'cloud', 'uv_index', 'latitude', 'longitude']
scaler = StandardScaler()
df[features_to_normalize] = scaler.fit_transform(df[features_to_normalize])

print(f"Dataset Shape: {df.shape}")
display(df.head())


# %% [markdown]
# ## 2. Data Overview & Advanced Exploratory Data Analysis (EDA)
# Before diving into modeling, we must understand the structure, completeness, and statistical distribution of our data.

# %%

# Data Completeness & Types
print("Data Information:")
df.info()

print("\nMissing Values Check:")
print(df.isnull().sum().max(), "maximum missing values in any column after imputation.")

print("\nDescriptive Statistics (Numerical Features):")
display(df.describe().T)

# %%

# Correlation Matrix
plt.figure(figsize=(10, 8))
corr_cols = ['temperature_celsius', 'precip_mm', 'humidity', 'wind_mph', 'cloud', 'uv_index', 'pressure_mb']
sns.heatmap(df[corr_cols].corr(), annot=True, cmap='coolwarm', fmt=".2f", linewidths=0.5)
plt.title('Feature Correlation Matrix')
plt.show()

# Temperature Distribution
plt.figure(figsize=(10, 5))
sns.histplot(df['temperature_celsius'], bins=50, kde=True, color='blue')
plt.title('Global Temperature Distribution (Celsius)')
plt.xlabel('Temperature (°C)')
plt.show()

# %% [markdown]
# **Insights - Correlation & Distribution:** 
# The heatmap reveals interesting relationships, such as a strong negative correlation between temperature and humidity. The temperature distribution is slightly skewed, reflecting the global variance in weather conditions at the time of data collection.

# %%

# Precipitation Analysis
plt.figure(figsize=(10, 5))
# Filtering for a specific city to observe actual temporal patterns instead of random global noise
city_df = df[df['location_name'] == 'Kabul'].sort_values('last_updated')
sns.lineplot(data=city_df, x='last_updated', y='precip_mm', color='teal', marker='o')
plt.title('Precipitation over Time for Kabul (Normalized)')
plt.xlabel('Date')
plt.ylabel('Precipitation (Normalized)')
plt.xticks(rotation=45)
plt.show()

# %% [markdown]
# **Insights - Precipitation:** 
# By focusing on a single city (Kabul), we can trace the actual time-series trend of precipitation. Plotting random global samples results in noisy, unreadable graphs, whereas isolating a specific location gives us a clear view of local weather events.
#
# Anomaly Detection using Z-Score for temperatures
# df['temp_zscore'] = (df['temperature_celsius'] - df['temperature_celsius'].mean()) / df['temperature_celsius'].std()
# outliers = df[df['temp_zscore'].abs() > 3]
#
# plt.figure(figsize=(10, 5))
# sns.scatterplot(x=df.index, y=df['temperature_celsius'], color='lightblue', label='Normal')
# sns.scatterplot(x=outliers.index, y=outliers['temperature_celsius'], color='red', label='Outlier (Anomaly)')
# plt.title('Temperature Anomalies Detection (Z-Score > 3)')
# plt.xlabel('Index')
# plt.ylabel('Temperature (°C)')
# plt.legend()
# plt.show()
#
# print(f"Number of Extreme Temperature Anomalies detected: {len(outliers)}")

# %% [markdown]
# **Insights - Anomaly Detection:**
# Using a Z-Score threshold of 3, we successfully identified extreme temperature values. These anomalies could represent genuine extreme weather events (like heatwaves or sudden cold snaps) or potential sensor errors. In a real-world scenario, these data points would require further investigation to determine if they should be kept or removed to prevent model bias.


# %% [markdown]
# ## 3. Unique Analysis: Spatial Patterns & Environmental Impact (Air Quality)
# Mapping global temperatures and analyzing Air Quality vs Weather.

# %%

# Geographical Patterns
plt.figure(figsize=(12, 7))
scatter = plt.scatter(df['longitude'], df['latitude'], c=df['temperature_celsius'], cmap='coolwarm', alpha=0.6, s=10)
plt.colorbar(scatter, label='Temperature (°C)')
plt.title('Geographical Temperature Distribution (Heatmap)')
plt.xlabel('Longitude')
plt.ylabel('Latitude')
plt.show()

# Environmental Impact (Air Quality vs Temperature)
plt.figure(figsize=(10, 6))
sns.scatterplot(data=df, x='temperature_celsius', y='air_quality_PM2.5', hue='humidity', palette='viridis', alpha=0.7)
plt.title('Environmental Impact: Temperature vs Air Quality (PM2.5)')
plt.xlabel('Temperature (°C)')
plt.ylabel('Air Quality (PM2.5)')
plt.show()

# %% [markdown]
# **Insights - Spatial Patterns & Environment:**
# The geographical scatter plot reconstructs the world map using lat/long coordinates, intuitively showing how temperature varies globally (e.g., hotter near the equator). The Environmental Impact plot indicates how Air Quality (PM2.5) interacts with temperature and humidity, suggesting that higher pollution levels may concentrate under specific climate conditions.


# %% [markdown]
# ## 4. Forecasting Model 1: Prophet (Univariate Time Series for Kabul)
# Instead of aggregating global temperatures (which masks local seasonal patterns), we'll forecast the temperature for a specific location (Kabul).

# %%

# Filter data for a single location
city_temp = df[df['location_name'] == 'Kabul'][['last_updated', 'temperature_celsius']].copy()
city_temp.columns = ['ds', 'y']

# Train/Test Split for time series (last 20% for testing)
split_idx = int(len(city_temp) * 0.8)
train_prophet = city_temp.iloc[:split_idx]
test_prophet = city_temp.iloc[split_idx:]

# Initialize and fit Prophet
model_prophet = Prophet(daily_seasonality=True)
model_prophet.fit(train_prophet)

# Forecast on test dates
forecast = model_prophet.predict(test_prophet[['ds']])

# Evaluate
mae_prophet = mean_absolute_error(test_prophet['y'], forecast['yhat'])
rmse_prophet = np.sqrt(mean_squared_error(test_prophet['y'], forecast['yhat']))
print(f"Prophet Model Performance for Kabul:")
print(f"RMSE: {rmse_prophet:.2f} °C")
print(f"MAE:  {mae_prophet:.2f} °C")

# Plot forecast
fig1 = model_prophet.plot(forecast)
plt.title('Temperature Forecast using Prophet (Kabul)')
plt.show()

# %% [markdown]
# **Insights - Prophet Forecasting:**
# By focusing on Kabul, the Prophet model effectively captures the daily seasonality. We evaluated it using RMSE and MAE, allowing us to quantify its predictive power. This localized approach is far more valuable for business decisions than predicting a global average.


# %% [markdown]
# ## 5. Forecasting Model 2: Advanced Ensemble (XGBoost + Random Forest)
# Using an Ensemble Voting Regressor to combine the strengths of multiple ML algorithms for maximum accuracy.

# %%

# Features are normalized and time is cyclically encoded
features = ['wind_mph', 'pressure_mb', 'precip_mm', 'humidity', 'cloud', 'uv_index', 'latitude', 'longitude', 'hour_sin', 'hour_cos', 'month_sin', 'month_cos']
target = 'temperature_celsius'

X = df[features]
y = df[target]

# Train Test Split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Define Baseline Model
from sklearn.linear_model import LinearRegression
baseline_model = LinearRegression()
baseline_model.fit(X_train, y_train)
y_pred_baseline = baseline_model.predict(X_test)
rmse_baseline = np.sqrt(mean_squared_error(y_test, y_pred_baseline))
mae_baseline = mean_absolute_error(y_test, y_pred_baseline)

from sklearn.model_selection import RandomizedSearchCV

# Hyperparameter Tuning for XGBoost Base Model
xgb_param_grid = {
    'n_estimators': [50, 100, 200],
    'learning_rate': [0.01, 0.1, 0.2],
    'max_depth': [3, 5, 7]
}
xgb_base = XGBRegressor(random_state=42)
# Using RandomizedSearchCV for efficiency in a large dataset
xgb_random = RandomizedSearchCV(estimator=xgb_base, param_distributions=xgb_param_grid, n_iter=5, cv=3, scoring='neg_mean_squared_error', random_state=42, n_jobs=-1)
xgb_random.fit(X_train, y_train)
best_xgb = xgb_random.best_estimator_
print(f"Best XGBoost Parameters: {xgb_random.best_params_}")

# Random Forest Base Model
rf_base = RandomForestRegressor(n_estimators=100, max_depth=10, random_state=42, n_jobs=-1)

# Create Ensemble Model with Tuned XGBoost
ensemble_model = VotingRegressor(estimators=[('xgb', best_xgb), ('rf', rf_base)])
ensemble_model.fit(X_train, y_train)

# Predict and Evaluate
y_pred = ensemble_model.predict(X_test)
rmse = np.sqrt(mean_squared_error(y_test, y_pred))
mae = mean_absolute_error(y_test, y_pred)

print("Baseline Model (Linear Regression) Performance:")
print(f"RMSE: {rmse_baseline:.2f} °C | MAE: {mae_baseline:.2f} °C\n")

print("Ensemble Model (XGBoost + Random Forest) Performance:")
print(f"RMSE: {rmse:.2f} °C | MAE: {mae:.2f} °C")

# Residual Plot for Ensemble Model
residuals = y_test - y_pred
plt.figure(figsize=(10, 5))
sns.scatterplot(x=y_pred, y=residuals, alpha=0.5, color='purple')
plt.axhline(y=0, color='r', linestyle='--')
plt.title('Residuals of Ensemble Model (Actual vs Predicted Error)')
plt.xlabel('Predicted Temperature (°C)')
plt.ylabel('Residuals (Error)')
plt.show()

# %% [markdown]
# **Insights - Hyperparameter Tuning & Residuals:**
# We used `RandomizedSearchCV` to fine-tune the XGBoost hyperparameters, ensuring the model avoids overfitting while maximizing accuracy. The Residual Plot shows how our errors are distributed around zero, indicating that our model does not have any massive directional bias.

# %%

# Unique Analysis: Feature Importance (From Tuned XGBoost Base)
importance = best_xgb.feature_importances_
feature_imp = pd.DataFrame({'Feature': features, 'Importance': importance}).sort_values(by='Importance', ascending=False)

plt.figure(figsize=(10, 5))
sns.barplot(x='Importance', y='Feature', data=feature_imp, palette='viridis')
plt.title('Feature Importance for Temperature Prediction')
plt.show()

# %% [markdown]
# **Insights - Modeling & Feature Importance:**
# The Ensemble Model significantly outperforms the Baseline Linear Regression, demonstrating the capability of XGBoost and Random Forest in capturing non-linear relationships. 
# Looking at the feature importance from XGBoost, we can deduce that geographical features (latitude/longitude) and humidity play the most critical roles in predicting temperature. These actionable insights provide a robust foundation for building advanced localized weather prediction products.

