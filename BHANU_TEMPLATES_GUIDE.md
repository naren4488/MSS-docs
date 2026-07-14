# Bhanu Solar Quotation Templates - Complete Guide

## Overview

4 quotation templates created for client **Bhanu** with a **10 KW 3-Phase Solar System**.

### Templates Summary

| # | Template | Price | Subsidy | Net Cost | Equipment | Status |
|---|----------|-------|---------|----------|-----------|---------|
| 1 | DCR INA 450k | ₹4,50,000 | ₹78,000 | ₹3,72,000 | INA Solar | Eligible ✓ |
| 2 | Non-DCR INA 340k | ₹3,40,000 | ₹0 | ₹3,40,000 | INA Solar | N/A |
| 3 | DCR Adani 490k | ₹4,90,000 | ₹78,000 | ₹4,12,000 | Adani Solar | Eligible ✓ |
| 4 | Non-DCR Adani 380k | ₹3,80,000 | ₹0 | ₹3,80,000 | Adani Solar | N/A |

---

## Key Details

### System Specifications
- **Capacity**: 10 KW 3-Phase
- **Solar Modules**: 18 panels × 555 Wp
- **Expected Generation**: 14,400 Units/Year
- **Expected Savings**: ₹1,15,200/Year
- **Warranty**: 12 years product, 25 years performance
- **Maintenance**: 2 years FREE

---

## How to Use

### Via Quotation Maker UI (Easiest)
1. Open the application
2. Navigate to Quotation Maker
3. Load "Bhanu" template
4. Click to load any variant
5. Edit as needed
6. Save as quotation

### Via Code (Developers)
```typescript
import { loadBhanuTemplates, loadSingleBhanuTemplate, getBhanuTemplateNames } from '@/features/quotation';

// Load all 4
loadBhanuTemplates();

// Load specific (0=DCR INA, 1=Non-DCR INA, 2=DCR Adani, 3=Non-DCR Adani)
loadSingleBhanuTemplate(0);

// Get names
getBhanuTemplateNames();
```

### Via JSON
File: `src/features/quotation/data/bhanu-templates.json`

---

## Subsidy Information

### DCR (Domestic Content Requirement)
- ✓ Eligible for ₹78,000 government subsidy
- Uses Indian-approved modules/inverters
- Requires documentation (Aadhar, electricity bill, etc.)
- Processing time: 4-8 weeks

### Non-DCR
- ✗ No government subsidy
- Simpler approval process
- Lower documentation requirements
- Faster implementation

---

## File Locations

```
src/features/quotation/
├── data/
│   ├── bhanu-templates.ts          Template definitions
│   └── bhanu-templates.json        JSON export
├── lib/
│   └── bhanu-template-loader.ts    Loading utilities
└── index.ts                         Exports (updated)
```

---

## Common Customizations

### Change Pricing
Edit in `bhanu-templates.ts` and update commercial offer

### Change Equipment Make
Modify material items in template

### Adjust Generation
Update generation figures based on actual site survey

### Add Client-Specific Terms
Customize before saving

---

## Each Template Contains

✅ **Customer Information**
✅ **Complete Material List** (11 items)
✅ **Commercial Details** (pricing & subsidy)
✅ **Financial Projections**
✅ **Warranty & Service**
✅ **Installation Process**
✅ **Terms & Conditions**

---

## Decision Matrix

| Client Need | Recommendation |
|---|---|
| Government subsidy | DCR (Option 1 or 3) |
| Fastest payback | Non-DCR INA (Option 2) |
| Premium quality | Adani (Option 3 or 4) |
| Minimal paperwork | Non-DCR (Option 2 or 4) |
| Best value | Non-DCR INA (Option 2) |

---

**Last Updated**: 2026-07-11  
**Version**: 1.0 Complete
