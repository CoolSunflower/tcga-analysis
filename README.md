# TCGA Cancer Performance Gap Analysis Dashboard

A comprehensive Next.js dashboard for analyzing cancer performance gaps with bagging vs. no-bagging analysis.

![Dashboard Preview](https://img.shields.io/badge/Status-Complete-brightgreen)
![Next.js](https://img.shields.io/badge/Next.js-15.3.4-black)
![TypeScript](https://img.shields.io/badge/TypeScript-Latest-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-Latest-06B6D4)

## 🚀 Features

### 📊 Dual Analysis Tabs
- **Bagging Analysis**: Performance metrics with bagging ensemble methods
- **No Bagging Analysis**: Performance metrics without bagging

### 📋 Interactive Data Tables
- **Task-Level Tables**: Individual task records with full sortability
- **Cancer-Grouped Tables**: Aggregated data by cancer type with 111 pattern percentages
- Responsive design with hover effects and intuitive sorting

### 📈 Data Visualizations
- **Interactive Pie Charts**: Pattern distribution (000-111) by cancer type
- **Dropdown Filtering**: Select specific cancer types or view all
- **Summary Tables**: Detailed breakdown of pattern distributions

### 🎯 Key Metrics Displayed
- Average AUC performance
- G-statistics (G, G̃₀, G̃₁, G̃₂)
- Individual and mixed metrics (G_ind, G_mix)
- Supervised/Unsupervised comparisons
- Pattern analysis (111 pattern percentages)

## 🔧 Features Overview

### Task-Level Analysis
- View individual task records with detailed metrics
- Sort by any column (cancer type, AUC, G-statistics, patterns)
- Search and filter capabilities
- Pattern badges with color coding

### Cancer-Grouped Analysis  
- Aggregated data by cancer type
- Average calculations across all tasks per cancer
- 111 pattern percentage with color-coded indicators
- Statistical summaries

### Interactive Visualizations
- Pattern distribution pie charts
- Cancer-specific filtering
- Hover tooltips with detailed information
- Responsive chart sizing

## 🛠️ Tech Stack

- **Framework**: Next.js 15.3.4 with TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Chart.js with react-chartjs-2
- **Data Processing**: PapaParse for CSV handling
- **Deployment**: Optimized for Vercel

## 📁 Project Structure

```
tcga-analysis/
├── app/
│   ├── components/
│   │   ├── TaskTable.tsx           # Task-level data table
│   │   ├── CancerGroupedTable.tsx  # Cancer-aggregated data table
│   │   └── PatternPieChart.tsx     # Interactive pie charts
│   ├── globals.css                 # Global styles
│   ├── layout.tsx                  # Root layout
│   └── page.tsx                    # Main dashboard page
├── public/
│   └── data/
│       ├── bagging_analysis.csv    # Bagging dataset
│       └── features_analysis.csv   # No-bagging dataset
├── package.json
└── README.md
```

## 🚦 Getting Started

### Prerequisites
- Node.js 18.0 or later
- npm or yarn package manager

### Installation & Development

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Ensure your data files are in place**:
   - `public/data/bagging_analysis.csv` - Bagging analysis results
   - `public/data/features_analysis.csv` - No-bagging analysis results

3. **Run the development server**:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

4. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000) to see the dashboard.

## 📊 Data Format

### Required CSV Columns
Both CSV files should contain the following columns:

| Column | Type | Description |
|--------|------|-------------|
| `cancer_name` | string | Cancer type identifier |
| `OS` | string | Overall Survival metric type |
| `time` | number | Time period |
| `average A_Auc` | number | Average AUC score |
| `G` | number | G-statistic |
| `G_tilda0`, `G_tilda1`, `G_tilda2` | number | G-tilde statistics |
| `G_ind`, `G_mix` | number | Individual and mixed metrics |
| `G_NT_ind`, `G_Sup_ind`, `G_Unsup_ind` | number | Individual metrics by type |
| `G_NT_mix`, `G_Sup_mix`, `G_Unsup_mix` | number | Mixed metrics by type |
| `Pattern` | string | Pattern identifier (000-111) |

## 🐛 Troubleshooting

### Common Issues

1. **Data not loading**:
   - Verify CSV files are in `public/data/`
   - Check browser console for errors
   - Ensure CSV format matches expected structure

2. **Charts not displaying**:
   - Ensure Chart.js dependencies are installed
   - Check browser compatibility
   - Verify data contains valid pattern values

3. **Compilation errors**:
   - Run `npm install` to ensure dependencies are installed
   - Check TypeScript errors in terminal

## 📜 License

This project is created for academic research purposes. 

---

**Built with ❤️ for cancer research analysis**
