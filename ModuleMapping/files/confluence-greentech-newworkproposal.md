# NewWorkProposal (GreenTech) - Config Profiles

---

## Workflow (WF)

### Slim

```
Profile
WF NAME: NewWorkProposal
WF Type: {placeholder}
Client ID: {clientID Number here}
    BC: GreenTechRenewables
    BackgroundImage: {1-6}

Modules
    NameID: Contact Information
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

    NameID: Submission
    Display: T

    NameID: Landing
    Display: T
```

### With Functions

```
Profile
WF NAME: NewWorkProposal
WF Type: {placeholder}
Client ID: {clientID Number here}
    BC: GreenTechRenewables
    BackgroundImage: {1-6}

Modules
    NameID: Contact Information
    Display: T
    Sort Order: 0
    Functions
        Form Validation (required fields)
        Input Masking (phone number format)
        Contact Type Selection (Home owner / Property manager)
        Primary Contact Toggle (checkbox, one required, only one allowed)
        Multi-Contact Support (Add Contact → Existing Contacts panel with edit/delete)
        Navigation (Cancel, Continue)

    NameID: Verify Home
    Display: T
    Sort Order: 1
    Functions
        Manual Address Entry (Address Line 1, Address Line 2, City, State dropdown, Zip Code)
        Address Verification (Zillow API lookup)
        Property Data Population (yearBuilt, beds, baths, numSystems, sqft)
        Map Pin Display
        Occupied Toggle
        Clear Action
        Navigation (Back, Continue)

    NameID: Additional Details
    Display: T
    Sort Order: 2
    Functions
        New HVAC System Selection (Heat Pump - Standard Ducted, Heat Pump - Cold Climate Ducted, Dual Fuel Ducted Heat Pump and Furnace, Ductless)
        Conditional Fields (Dual Fuel → Efficiency Range: 80% AFUE or less / 96% AFUE or more)
        Conditional Fields (Ductless → Number of Rooms input, per-head cost estimate)
        Ductwork Availability (Yes / No)
        Navigation (Back, Continue)

    NameID: Summary
    Display: T
    Sort Order: 3
    Functions
        Appointment Contacts Display (editable)
        Recommended System Display (AHRI#, product carousel)
        Additional Details Display (editable)
        Price Display (system price + Add Markup Pricing modal)
        Markup Pricing (Margin or Mark Up toggle, Percentage input, calculated Mark Up Amount, Total Customer System Price)
        Price Visibility Toggle (eye icon — show/hide from customer)
        Customer Notes Input (free text)
        Property Details Display (editable, address + map + property data)
        Navigation (Finish)

    NameID: Submission
    Display: T
    Functions
        Confirmation Modal ("New Work Proposal Submitted — An email has been sent to both Motili and you.")
        Exit Action

    NameID: Landing
    Display: T
    Functions
        View Submitted Card
        Create New Work Proposal Card
        System Cheat Sheet Card
```

### Full (Functions + Fields)

```
Profile
WF NAME: NewWorkProposal
WF Type: {placeholder}
Client ID: {clientID Number here}
    BC: GreenTechRenewables
    BackgroundImage: {1-6}

Modules
    NameID: Contact Information
    Display: T
    Sort Order: 0
    Functions
        Form Validation (required fields)
        Input Masking (phone number format)
        Contact Type Selection (Home owner / Property manager)
        Primary Contact Toggle (checkbox, one required, only one allowed)
        Multi-Contact Support (Add Contact → Existing Contacts panel with edit/delete)
        Navigation (Cancel, Continue)
    Fields
        Contact Type
        First Name
        Last Name
        Email
        Phone Number
        Primary Contact (checkbox)

    NameID: Verify Home
    Display: T
    Sort Order: 1
    Functions
        Manual Address Entry (Address Line 1, Address Line 2, City, State dropdown, Zip Code)
        Address Verification (Zillow API lookup)
        Property Data Population (yearBuilt, beds, baths, numSystems, sqft)
        Map Pin Display
        Occupied Toggle
        Clear Action
        Navigation (Back, Continue)
    Fields
        Address Line 1
        Address Line 2
        City
        State (dropdown)
        Zip Code
        Property Occupied (checkbox)
    Ext Fields (Zillow)
        Year Built
        Bedrooms
        Bathrooms
        Number of Systems
        Square Footage
        Map

    NameID: Additional Details
    Display: T
    Sort Order: 2
    Functions
        New HVAC System Selection (Heat Pump - Standard Ducted, Heat Pump - Cold Climate Ducted, Dual Fuel Ducted Heat Pump and Furnace, Ductless)
        Conditional Fields (Dual Fuel → Efficiency Range: 80% AFUE or less / 96% AFUE or more)
        Conditional Fields (Ductless → Number of Rooms input, per-head cost estimate)
        Ductwork Availability (Yes / No)
        Navigation (Back, Continue)
    Fields
        New HVAC System
        Dual Fuel Efficiency (conditional)
        Number of Rooms (conditional)
        Ductwork Availability

    NameID: Summary
    Display: T
    Sort Order: 3
    Functions
        Appointment Contacts Display (editable)
        Recommended System Display (AHRI#, product carousel)
        Additional Details Display (editable)
        Price Display (system price + Add Markup Pricing modal)
        Markup Pricing (Margin or Mark Up toggle, Percentage input, calculated Mark Up Amount, Total Customer System Price)
        Price Visibility Toggle (eye icon — show/hide from customer)
        Customer Notes Input (free text)
        Property Details Display (editable, address + map + property data)
        Navigation (Finish)
    Fields
        Appointment Contacts
        Recommended System (AHRI#, product name, product images)
        Additional Details (system type, ductwork)
        System Price
        Markup Amount
        Total Customer System Price
        Customer Notes (free text)
        Property Details (address, map, yearBuilt, beds, baths, numSystems, sqft)

    NameID: Submission
    Display: T
    Functions
        Confirmation Modal ("New Work Proposal Submitted — An email has been sent to both Motili and you.")
        Exit Action

    NameID: Landing
    Display: T
    Functions
        View Submitted Card
        Create New Work Proposal Card
        System Cheat Sheet Card
```

---

## Submitted Job (SJ)

### Slim

```
Profile
WF NAME: NewWorkProposal — Submitted Job
WF Type: {placeholder}
Client ID: {clientID Number here}
    BC: GreenTechRenewables
    BackgroundImage: {1-6}

Modules
    NameID: Landing
    Display: T
    Sort Order: 0

    NameID: Submitted Work Proposals
    Display: T
    Sort Order: 1

    NameID: View Proposal
    Display: T
    Sort Order: 2
```

### With Functions

```
Profile
WF NAME: NewWorkProposal — Submitted Job
WF Type: {placeholder}
Client ID: {clientID Number here}
    BC: GreenTechRenewables
    BackgroundImage: {1-6}

Modules
    NameID: Landing
    Display: T
    Sort Order: 0
    Functions
        View Submitted Card
        Create New Work Proposal Card

    NameID: Submitted Work Proposals
    Display: T
    Sort Order: 1
    Functions
        Email Search ("Search by my email address...")
        Results Table (Contact, Property Address, Submitted By, Created On, Total Price, View)
        Pagination
        View Action (per row)

    NameID: View Proposal
    Display: T
    Sort Order: 2
    Functions
        Appointment Contacts Display (read-only)
        Selected System Display (bundled product name, price, product carousel)
        Additional Details Display (read-only)
        Price Display (System Price, Markup Amount, Total Customer System Price, visibility toggle)
        Customer Notes Display (read-only)
        Property Details Display (address, map, yearBuilt, beds, baths, numSystems, sqft)
```

### Full (Functions + Fields)

```
Profile
WF NAME: NewWorkProposal — Submitted Job
WF Type: {placeholder}
Client ID: {clientID Number here}
    BC: GreenTechRenewables
    BackgroundImage: {1-6}

Modules
    NameID: Landing
    Display: T
    Sort Order: 0
    Functions
        View Submitted Card
        Create New Work Proposal Card

    NameID: Submitted Work Proposals
    Display: T
    Sort Order: 1
    Functions
        Email Search ("Search by my email address...")
        Results Table (Contact, Property Address, Submitted By, Created On, Total Price, View)
        Pagination
        View Action (per row)
    Fields
        Contact
        Property Address
        Submitted By
        Created On
        Total Price

    NameID: View Proposal
    Display: T
    Sort Order: 2
    Functions
        Appointment Contacts Display (read-only)
        Selected System Display (bundled product name, price, product carousel)
        Additional Details Display (read-only)
        Price Display (System Price, Markup Amount, Total Customer System Price, visibility toggle)
        Customer Notes Display (read-only)
        Property Details Display (address, map, yearBuilt, beds, baths, numSystems, sqft)
    Fields
        Appointment Contacts (name, type, primary badge, email, phone)
        Selected System (bundled product name, price, product images)
        Additional Details (system type, ductwork)
        System Price
        Markup Amount
        Total Customer System Price
        Customer Notes
        Property Details (address, map, yearBuilt, beds, baths, numSystems, sqft)
```
