
# AAC Rejection Minimization – Model Output Explanation

## 📊 Model Performance

- **R² Score**: `-0.602`  
  This score indicates how well the model explains the variance in the data.  
  - A negative R² means the model performs **worse than a simple average** baseline.
  - This often happens when the dataset is small or the relationship is non-linear/noisy.

- **RMSE (Root Mean Squared Error)**: `161.026 rejections`  
  On average, the model's prediction error is about 161 rejections — which is high relative to expected rejection counts.

---

## 🔥 Feature Importance

This tells us which input factors most affect the rejection rate:

| Feature             | Importance Score |
|---------------------|------------------|
| **Water Kg**         | 0.3500           |
| **Cement Kg**        | 0.2519           |
| **Lime Kg**          | 0.1883           |
| Fresh Slurry Kg     | 0.0933           |
| Mixing Time         | 0.0778           |
| Discharge Temp.     | 0.0388           |
| Others (Powders, Oil)| 0.0000           |

### 🧠 Key Insights:
- **Water, Cement, and Lime** are the top 3 contributors to rejection variation.
- **Aluminum Powder, D.C. Powder, Solu. Oil, Gypsum, Waste Slurry** have little to no effect — possibly due to consistent usage or lack of variation in the dataset.

---

## 📋 Sample Predictions

| Actual Rejections | Predicted Rejections |
|-------------------|-----------------------|
| 26                | 13.39                 |
| 0                 | 13.05                 |
| 21                | 11.43                 |
| 21                | 6.06                  |

### 🧪 Interpretation:
- The model is **under-predicting** in most cases.
- This could be due to:
  - Not enough training examples with high rejections
  - Lack of strong correlation in the data

---

## 🧰 Recommendations

1. **Increase dataset size** with more batches to improve learning.
2. **Add time-based or external factors** (e.g., ambient humidity, temperature).
3. **Balance dataset**: include both low and high rejection batches.
4. **Normalize or engineer features** like water-to-cement ratio, slurry-to-lime ratio, etc.

---

Let me know if you'd like this in a PowerPoint, PDF, or to include visualizations automatically.
