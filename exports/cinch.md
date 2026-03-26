# Cinch

**wfName:** Cinch
**wfType:** Direct/Indirect
**clientId:** {clientID}

> **meta title:** Replace Your HVAC System | Cinch Home Services
> **meta description:** Find your perfect HVAC replacement in minutes. See system matches, upfront pricing, and schedule a free in-home inspection — covered by your Cinch home warranty.
> **BC:** HomeWarranty
> **backgroundImage:** {1-6}

## Module:

### Basic Information
- **display:** true
- **components** (7 items):
  Form Validation, Input Masking, Email Verification (Cinch Identity), First Name, Last Name, Email, Phone Number

### Property Details
- **display:** true
- **components** (13 items):
  Address Autocomplete, Zillow Verification, Property Data Population, Map Pin, Occupied Toggle, Property Address, Property Occupied, Year Built, SqFt, Num Systems, Beds, Baths, Map

### HVAC Goals
- **display:** true
- **components** (1 item):
  Goal Selection (pick 2 of 4)

### Current System
- **display:** true
- **components** (9 items):
  SqFt Input, Current System Selection, Rating Selection (Good/Better/Best), Rating Details (modal), Ductwork (Yes/No), Heating/Cooling SqFt, Current HVAC System, New System Rating, Ductwork Availability

### Your Match
- **display:** true
- **components** (5 items):
  System Matching Engine, Recommended System Display, Price Breakdown, Alternative Options, Schedule Free Inspection

### Schedule Inspection
- **display:** true
- **components** (7 items):
  Direct Scheduler, Calendar (date + time slots), Job Creation, Support, PDF, Email, Job Creation

## Backend Systems:
- **Work Order - Inspection:** Scheduling → Scheduled → In Process → Inspection Completed → Cancelled
- **Quote:** Quote in Review → Quote Ready for Approval → Quote Approved → Quote Declined → Quote Cancelled
- **Work Order - Replacement:** Created → Scheduling → Scheduled → In Process → Completed → Cancelled
