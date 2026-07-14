# SolutionsBuilder - Config Profiles

---

## Workflow (WF)

### Slim

```
Profile
WF NAME: SolutionsBuilder
WF Type: {placeholder}
Client ID: {clientID Number here}
    BC: HomeComfort
    BackgroundImage: {1-6}

Modules
    NameID: Contact
    Display: T
    Sort Order: 0

    NameID: Verify Home
    Display: T
    Sort Order: 1

    NameID: Additional Details
    Display: T
    Sort Order: 2

    NameID: Summary
    Display: T
    Sort Order: 3

    NameID: Scheduling
    Display: F
    Sort Order: 4

    NameID: PDF
    Display: T

    NameID: Email
    Display: T
```

### With Functions

```
Profile
WF NAME: SolutionsBuilder
WF Type: {placeholder}
Client ID: {clientID Number here}
    BC: HomeComfort
    BackgroundImage: {1-6}

Modules
    NameID: Contact
    Display: T
    Sort Order: 0
    Functions
        Form Validation (required fields)
        Input Masking (phone number format)
        Navigation (Next → Verify Home)

    NameID: Verify Home
    Display: T
    Sort Order: 1
    Functions
        Address Autocomplete
        Address Verification (Zillow API lookup)
        Property Data Population (yearBuilt, sqft, beds, baths)
        Map Pin Display
        Occupied Toggle
        Navigation (Back, Verify Address → confirm → Next)

    NameID: Additional Details
    Display: T
    Sort Order: 2
    Functions
        System Type Selection (Heat Pump, Ductless Room, Multi-Room Ductless, Air Conditioner + Furnace)
        Efficiency Tier Selection (Good / Best)
        Heating & Cooling SqFt Input
        Whole House Toggle
        System Rating Details (modal)
        Navigation (Back, Submit)

    NameID: Summary
    Display: T
    Sort Order: 3
    Functions
        PDF Generation (3-page branded packet)
        Email Delivery
        SFDC Web-to-Case Submission
        Combine & Save (add-on products: Premium Air Cleaner, Room Air Purifier)

    NameID: Scheduling
    Display: F
    Sort Order: 4
    Functions
        Dispatch Time Slots
        Direct Scheduler

    NameID: PDF
    Display: T

    NameID: Email
    Display: T
```

### Full (Functions + Fields)

```
Profile
WF NAME: SolutionsBuilder
WF Type: {placeholder}
Client ID: {clientID Number here}
    BC: HomeComfort
    BackgroundImage: {1-6}

Modules
    NameID: Contact
    Display: T
    Sort Order: 0
    Functions
        Form Validation (required fields)
        Input Masking (phone number format)
        Navigation (Next → Verify Home)
    Fields
        First Name
        Last Name
        Email
        Phone Number

    NameID: Verify Home
    Display: T
    Sort Order: 1
    Functions
        Address Autocomplete
        Address Verification (Zillow API lookup)
        Property Data Population (yearBuilt, sqft, beds, baths)
        Map Pin Display
        Occupied Toggle
        Navigation (Back, Verify Address → confirm → Next)
    Fields
        Property Address
        Property Occupied (checkbox)
    Ext Fields (Zillow)
        Year Built
        Square Footage
        Bedrooms
        Bathrooms
        Map

    NameID: Additional Details
    Display: T
    Sort Order: 2
    Functions
        System Type Selection (Heat Pump, Ductless Room, Multi-Room Ductless, Air Conditioner + Furnace)
        Efficiency Tier Selection (Good / Best)
        Heating & Cooling SqFt Input
        Whole House Toggle
        System Rating Details (modal)
        Navigation (Back, Submit)
    Fields
        Heating and Cooling Square Footage
        Whole House (checkbox)
        System Type
        Efficiency Tier

    NameID: Summary
    Display: T
    Sort Order: 3
    Functions
        PDF Generation (3-page branded packet)
        Email Delivery
        SFDC Web-to-Case Submission
        Combine & Save (add-on products: Premium Air Cleaner, Room Air Purifier)
    Fields
        Contacts
        Additional Details
        Customer Notes
        Recommend System
        Price
        Property Details

    NameID: Scheduling
    Display: F
    Sort Order: 4
    Functions
        Dispatch Time Slots
        Direct Scheduler
    Fields
        Dispatch Time Slots
        Direct Scheduler

    NameID: PDF
    Display: T

    NameID: Email
    Display: T
```
