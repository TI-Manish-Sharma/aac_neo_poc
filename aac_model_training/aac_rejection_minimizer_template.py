# AAC Rejection Minimization Template - Console Output Version

import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, r2_score
import matplotlib.pyplot as plt

# Step 1: Load Dataset
df = pd.read_csv('aac_combined_data.csv')

# Step 2: Feature Selection
X = df.drop(columns=['Batch No', 'Mould No', 'Total Rejections', 'Discharge Time'])
y = df['Total Rejections']

# Step 3: Train/Test Split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Step 4: Train Model
model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Step 5: Evaluate Model
y_pred = model.predict(X_test)
rmse = mean_squared_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)

print("\n📊 Model Performance:")
print(f"  R² Score: {r2:.3f}")
print(f"  RMSE    : {rmse:.3f} rejections")

# Step 6: Feature Importance
importances = model.feature_importances_
features = X.columns
importance_df = pd.DataFrame({'Feature': features, 'Importance': importances})
importance_df.sort_values(by='Importance', ascending=False, inplace=True)

print("\n🔥 Top Contributing Features to Rejection Rate:")
for i, row in importance_df.iterrows():
    print(f"  {row['Feature']:<20} → Importance: {row['Importance']:.4f}")

# Step 7: Show Prediction Summary
output_df = X_test.copy()
output_df['Actual Rejections'] = y_test.values
output_df['Predicted Rejections'] = y_pred

print("\n📋 Sample Predictions (first 5):")
print(output_df[['Actual Rejections', 'Predicted Rejections']].head().to_string(index=False))

# Step 8: Visualize Feature Importance
plt.figure(figsize=(10, 6))
plt.barh(importance_df['Feature'], importance_df['Importance'])
plt.xlabel("Importance Score")
plt.title("Feature Importance: Contributors to Rejections")
plt.gca().invert_yaxis()
plt.tight_layout()
plt.show()
