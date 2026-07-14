# HVACUpgradeTool (Cinch) - Config Profiles

---

## Workflow (WF)

### Slim

```
Profile
WF NAME: HVACUpgradeTool
WF Type: {placeholder}
Client ID: {clientID Number here}
    BC: HomeWarranty
    BackgroundImage: {1-6}

Modules
    NameID: Contact
    Display: T
    Sort Order: 0

    NameID: Verify Home
    Display: T
    Sort Order: 1

    NameID: HVAC Goals
    Display: T
    Sort Order: 2

    NameID: Current System
    Display: T
    Sort Order: 3

    NameID: Your Match
    Display: T
    Sort Order: 4

    NameID: Scheduling
    Display: T
    Sort Order: 5

    NameID: Support
    Display: T

    NameID: PDF
    Display: F

    NameID: Email
    Display: F

    NameID: Job Creation
    Display: T
```

### With Functions

```
Profile
WF NAME: HVACUpgradeTool
WF Type: {placeholder}
Client ID: {clientID Number here}
    BC: HomeWarranty
    BackgroundImage: {1-6}

Modules
    NameID: Contact
    Display: T
    Sort Order: 0
    Functions
        Form Validation (required fields)
        Input Masking (phone number format)
        Email Verification (Cinch Identity — code sent to email, Resend option)
        Navigation (Verify Information)

    NameID: Verify Home
    Display: T
    Sort Order: 1
    Functions
        Address Autocomplete
        Address Verification (Zillow API lookup)
        Property Data Population (yearBuilt, sqft, numSystems, beds, baths)
        Map Pin Display
        Occupied Toggle
        Navigation (Back, Verify Address → This is Accurate)

    NameID: HVAC Goals
    Display: T
    Sort Order: 2
    Functions
        Goal Selection (pick 2 of 4: Lower utility cost, Modernize my system, Better performance, Improve air quality)
        Navigation (Go Back, Continue)

    NameID: Current System
    Display: T
    Sort Order: 3
    Functions
        Heating & Cooling SqFt Input (remaining sqft calc)
        Current HVAC System Selection (Heat Pump / Furnace + Air Conditioner)
        New System Rating Selection (Good / Better / Best)
        System Rating Details (modal)
        Ductwork Availability (Yes / No)
        Navigation (Go Back, View my Upgrade / View Upgrade)

    NameID: Your Match
    Display: T
    Sort Order: 4
    Functions
        System Matching Engine (loading: "Finding your perfect replacement")
        Recommended System Display (name, tier badge, price range, bundle description)
        Price Breakdown (Cost to you)
        Contact Info Display
        Alternative Options (carousel with Select Option)
        Navigation (Go Back, Schedule Free Inspection)

    NameID: Scheduling
    Display: T
    Sort Order: 5
    Functions
        Direct Scheduler (Preferred Date and Time, Backup Date and Time x2)
        Calendar Display (date picker + time slot selection, 4-hour windows)
        Job Type: Inspection
        Estimated Job Time: 1 hour
        Timezone: MDT
        Job Creation (loading: "Creating your upgrade job")
        Navigation (Go Back, Schedule)

    NameID: Support
    Display: T
    Functions
        FAQ Accordion (5 questions)
        Contact Link (customer.support@motili.com)

    NameID: PDF
    Display: F

    NameID: Email
    Display: F

    NameID: Job Creation
    Display: T
    Functions
        Job Number Generation
        Work Order Creation
        Post-Job Tracker (Scheduling → Scheduled → In Process → Inspection Completed)
```

### Full (Functions + Fields)

```
Profile
WF NAME: HVACUpgradeTool
WF Type: {placeholder}
Client ID: {clientID Number here}
    BC: HomeWarranty
    BackgroundImage: {1-6}

Modules
    NameID: Contact
    Display: T
    Sort Order: 0
    Functions
        Form Validation (required fields)
        Input Masking (phone number format)
        Email Verification (Cinch Identity — code sent to email, Resend option)
        Navigation (Verify Information)
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
        Property Data Population (yearBuilt, sqft, numSystems, beds, baths)
        Map Pin Display
        Occupied Toggle
        Navigation (Back, Verify Address → This is Accurate)
    Fields
        Property Address
        Property Occupied (checkbox)
    Ext Fields (Zillow)
        Year Built
        Square Footage
        Number of Systems
        Bedrooms
        Bathrooms
        Map

    NameID: HVAC Goals
    Display: T
    Sort Order: 2
    Functions
        Goal Selection (pick 2 of 4: Lower utility cost, Modernize my system, Better performance, Improve air quality)
        Navigation (Go Back, Continue)
    Fields
        Goal 1
        Goal 2

    NameID: Current System
    Display: T
    Sort Order: 3
    Functions
        Heating & Cooling SqFt Input (remaining sqft calc)
        Current HVAC System Selection (Heat Pump / Furnace + Air Conditioner)
        New System Rating Selection (Good / Better / Best)
        System Rating Details (modal)
        Ductwork Availability (Yes / No)
        Navigation (Go Back, View my Upgrade / View Upgrade)
    Fields
        Heating and Cooling SqFt
        Current HVAC System
        New System Rating
        Ductwork Availability

    NameID: Your Match
    Display: T
    Sort Order: 4
    Functions
        System Matching Engine (loading: "Finding your perfect replacement")
        Recommended System Display (name, tier badge, price range, bundle description)
        Price Breakdown (Cost to you)
        Contact Info Display
        Alternative Options (carousel with Select Option)
        Navigation (Go Back, Schedule Free Inspection)
    Fields
        Recommended System (name, tier, price range, bundle)
        Price Breakdown (Cost to you)
        Contact Info (name, phone, email)
        Alternative Options (name, price per option)

    NameID: Scheduling
    Display: T
    Sort Order: 5
    Functions
        Direct Scheduler (Preferred Date and Time, Backup Date and Time x2)
        Calendar Display (date picker + time slot selection, 4-hour windows)
        Job Type: Inspection
        Estimated Job Time: 1 hour
        Timezone: MDT
        Job Creation (loading: "Creating your upgrade job")
        Navigation (Go Back, Schedule)
    Fields
        Preferred Date and Time
        Backup Date and Time 1
        Backup Date and Time 2

    NameID: Support
    Display: T
    Functions
        FAQ Accordion (5 questions)
        Contact Link (customer.support@motili.com)
    Fields
        FAQ Question 1
        FAQ Question 2
        FAQ Question 3
        FAQ Question 4
        FAQ Question 5

    NameID: PDF
    Display: F

    NameID: Email
    Display: F

    NameID: Job Creation
    Display: T
    Functions
        Job Number Generation
        Work Order Creation
        Post-Job Tracker (Scheduling → Scheduled → In Process → Inspection Completed)
    Fields
        Job Number
        Work Order Number
```

---

## Inspection Work Order (WO)

### Slim

```
Profile
WF NAME: HVACUpgradeTool — Inspection Work Order
WF Type: {placeholder}
Client ID: {clientID Number here}
    BC: HomeWarranty
    BackgroundImage: {1-6}

Modules
    NameID: Scheduling
    Display: T
    Sort Order: 0

    NameID: Scheduled
    Display: T
    Sort Order: 1

    NameID: In Process
    Display: T
    Sort Order: 2

    NameID: Inspection Completed
    Display: T
    Sort Order: 3

    NameID: Cancelled
    Display: T
```

### With Functions

```
Profile
WF NAME: HVACUpgradeTool — Inspection Work Order
WF Type: {placeholder}
Client ID: {clientID Number here}
    BC: HomeWarranty
    BackgroundImage: {1-6}

Modules
    NameID: Scheduling
    Display: T
    Sort Order: 0
    Functions
        Appointment Display (date, time, address)
        System Match Display
        Price Breakdown Display
        Contact Info Display
        Reschedule Action

    NameID: Scheduled
    Display: T
    Sort Order: 1
    Functions
        Appointment Display (date, time, address)
        System Match Display
        Price Breakdown Display
        Contact Info Display
        Reschedule Action

    NameID: In Process
    Display: T
    Sort Order: 2
    Functions
        Appointment Display (date, time, address)
        System Match Display
        Price Breakdown Display
        Contact Info Display

    NameID: Inspection Completed
    Display: T
    Sort Order: 3
    Functions
        Status Message ("We've finished your inspection and are preparing your quote. You'll receive an email notification once it's ready to review and approve.")
        System Match Display
        Price Breakdown Display
        Contact Info Display

    NameID: Cancelled
    Display: T
    Functions
        Status Message ("We've processed your cancellation. If you still need service, you can easily reschedule or request a new appointment whenever it's convenient for you.")
        System Match Display
        Price Breakdown Display
        Contact Info Display
```

### Full (Functions + Fields)

```
Profile
WF NAME: HVACUpgradeTool — Inspection Work Order
WF Type: {placeholder}
Client ID: {clientID Number here}
    BC: HomeWarranty
    BackgroundImage: {1-6}

Modules
    NameID: Scheduling
    Display: T
    Sort Order: 0
    Functions
        Appointment Display (date, time, address)
        System Match Display
        Price Breakdown Display
        Contact Info Display
        Reschedule Action
    Fields
        Appointment (date, time, address)
        System Match (name, tier, price range, bundle)
        Price Breakdown (Cost to you)
        Contact Info (name, phone, email)

    NameID: Scheduled
    Display: T
    Sort Order: 1
    Functions
        Appointment Display (date, time, address)
        System Match Display
        Price Breakdown Display
        Contact Info Display
        Reschedule Action
    Fields
        Appointment (date, time, address)
        System Match (name, tier, price range, bundle)
        Price Breakdown (Cost to you)
        Contact Info (name, phone, email)

    NameID: In Process
    Display: T
    Sort Order: 2
    Functions
        Appointment Display (date, time, address)
        System Match Display
        Price Breakdown Display
        Contact Info Display
    Fields
        Appointment (date, time, address)
        System Match (name, tier, price range, bundle)
        Price Breakdown (Cost to you)
        Contact Info (name, phone, email)

    NameID: Inspection Completed
    Display: T
    Sort Order: 3
    Functions
        Status Message ("We've finished your inspection and are preparing your quote. You'll receive an email notification once it's ready to review and approve.")
        System Match Display
        Price Breakdown Display
        Contact Info Display
    Fields
        System Match (name, tier, price range, bundle)
        Price Breakdown (Cost to you)
        Contact Info (name, phone, email)

    NameID: Cancelled
    Display: T
    Functions
        Status Message ("We've processed your cancellation. If you still need service, you can easily reschedule or request a new appointment whenever it's convenient for you.")
        System Match Display
        Price Breakdown Display
        Contact Info Display
    Fields
        System Match (name, tier, price range, bundle)
        Price Breakdown (Cost to you)
        Contact Info (name, phone, email)
```

---

## Quote (QO)

### Slim

```
Profile
WF NAME: HVACUpgradeTool — Quote
WF Type: {placeholder}
Client ID: {clientID Number here}
    BC: HomeWarranty
    BackgroundImage: {1-6}

Modules
    NameID: Quote in Review
    Display: T
    Sort Order: 0

    NameID: Quote Ready for Approval
    Display: T
    Sort Order: 1

    NameID: Quote Approved
    Display: T
    Sort Order: 2

    NameID: Quote Declined
    Display: T

    NameID: Quote Cancelled
    Display: T
```

### With Functions

```
Profile
WF NAME: HVACUpgradeTool — Quote
WF Type: {placeholder}
Client ID: {clientID Number here}
    BC: HomeWarranty
    BackgroundImage: {1-6}

Modules
    NameID: Quote in Review
    Display: T
    Sort Order: 0
    Functions
        Status Message ("We're reviewing your replacement quote to make sure everything looks right. You'll receive an email as soon as it's ready for your approval.")
        System Match Display
        Price Breakdown Display (estimate)
        Contact Info Display

    NameID: Quote Ready for Approval
    Display: T
    Sort Order: 1
    Functions
        Quote Table (System cost, Labor, Shipping/Delivery, Subtotal, Estimated tax, Grand Total)
        System Match Display
        Contact Info Display
        Approve Quote Action
        Reject Quote Action

    NameID: Quote Approved
    Display: T
    Sort Order: 2
    Functions
        Status Message ("Your replacement equipment has been ordered, and we'll notify you as soon as it's ready for installation scheduling.")
        System Match Display
        Contact Info Display
        Total Cost Breakdown Display

    NameID: Quote Declined
    Display: T
    Functions
        Status Message ("Thanks for letting us know. The Motili Team will review your quote and reach out to you if additional options are available.")
        System Match Display
        Contact Info Display
        Total Cost Breakdown Display

    NameID: Quote Cancelled
    Display: T
    Functions
        Status Message ("Your replacement quote has been cancelled. If your plans change, it's easy to request a new quote or schedule another appointment at your convenience.")
        System Match Display
        Contact Info Display
        Total Cost Breakdown Display
```

### Full (Functions + Fields)

```
Profile
WF NAME: HVACUpgradeTool — Quote
WF Type: {placeholder}
Client ID: {clientID Number here}
    BC: HomeWarranty
    BackgroundImage: {1-6}

Modules
    NameID: Quote in Review
    Display: T
    Sort Order: 0
    Functions
        Status Message ("We're reviewing your replacement quote to make sure everything looks right. You'll receive an email as soon as it's ready for your approval.")
        System Match Display
        Price Breakdown Display (estimate)
        Contact Info Display
    Fields
        System Match (name, tier, price range, bundle)
        Price Breakdown (Cost to you — estimate)
        Contact Info (name, phone, email)

    NameID: Quote Ready for Approval
    Display: T
    Sort Order: 1
    Functions
        Quote Table (System cost, Labor, Shipping/Delivery, Subtotal, Estimated tax, Grand Total)
        System Match Display
        Contact Info Display
        Approve Quote Action
        Reject Quote Action
    Fields
        System cost
        Labor
        Shipping/Delivery
        Subtotal
        Estimated tax
        Grand Total
        System Match (name, tier, bundle)
        Contact Info (name, phone, email)

    NameID: Quote Approved
    Display: T
    Sort Order: 2
    Functions
        Status Message ("Your replacement equipment has been ordered, and we'll notify you as soon as it's ready for installation scheduling.")
        System Match Display
        Contact Info Display
        Total Cost Breakdown Display
    Fields
        System Match (name, tier, bundle)
        Contact Info (name, phone, email)
        Total Cost Breakdown (System cost, Labor, Shipping/Delivery, Subtotal, Estimated tax, Grand Total)

    NameID: Quote Declined
    Display: T
    Functions
        Status Message ("Thanks for letting us know. The Motili Team will review your quote and reach out to you if additional options are available.")
        System Match Display
        Contact Info Display
        Total Cost Breakdown Display
    Fields
        System Match (name, tier, bundle)
        Contact Info (name, phone, email)
        Total Cost Breakdown (System cost, Labor, Shipping/Delivery, Subtotal, Estimated tax, Grand Total)

    NameID: Quote Cancelled
    Display: T
    Functions
        Status Message ("Your replacement quote has been cancelled. If your plans change, it's easy to request a new quote or schedule another appointment at your convenience.")
        System Match Display
        Contact Info Display
        Total Cost Breakdown Display
    Fields
        System Match (name, tier, bundle)
        Contact Info (name, phone, email)
        Total Cost Breakdown (System cost, Labor, Shipping/Delivery, Subtotal, Estimated tax, Grand Total)
```

---

## Replacement Work Order (WO)

### Slim

```
Profile
WF NAME: HVACUpgradeTool — Replacement Work Order
WF Type: {placeholder}
Client ID: {clientID Number here}
    BC: HomeWarranty
    BackgroundImage: {1-6}

Modules
    NameID: Created
    Display: T
    Sort Order: 0

    NameID: Scheduling
    Display: T
    Sort Order: 1

    NameID: Scheduled
    Display: T
    Sort Order: 2

    NameID: In Process
    Display: T
    Sort Order: 3

    NameID: Completed
    Display: T
    Sort Order: 4

    NameID: Cancelled
    Display: T
```

### With Functions

```
Profile
WF NAME: HVACUpgradeTool — Replacement Work Order
WF Type: {placeholder}
Client ID: {clientID Number here}
    BC: HomeWarranty
    BackgroundImage: {1-6}

Modules
    NameID: Created
    Display: T
    Sort Order: 0
    Functions
        Status Message ("Your equipment is ready and waiting. Go ahead and schedule your installation appointment at a time that works best for you.")
        System Match Display
        Contact Info Display
        Schedule Installation Action

    NameID: Scheduling
    Display: T
    Sort Order: 1
    Functions
        Appointment Display (date, time, address)
        System Match Display
        Contact Info Display
        Reschedule Action

    NameID: Scheduled
    Display: T
    Sort Order: 2
    Functions
        Appointment Display (date, time, address)
        System Match Display
        Contact Info Display
        Reschedule Action

    NameID: In Process
    Display: T
    Sort Order: 3
    Functions
        Status Message ("Your replacement is in process right now. Check back here for updates after your inspection is complete.")
        Appointment Display (date, time, address)
        System Match Display
        Contact Info Display

    NameID: Completed
    Display: T
    Sort Order: 4
    Functions
        Status Message ("We hope you are satisfied with your new replacement. Please take a moment to let us know how we did!")
        Feedback Survey (multi-select: Installation quality, Communication and updates, Timeliness, Technician professionalism, Value for cost)
        Free Text Input ("Is there anything else you'd like to share?")
        Submit Feedback Action

    NameID: Cancelled
    Display: T
    Functions
        Status Message ("Your replacement is in process right now. Check back here for updates after your inspection is complete.")
        Appointment Display (date, time, address)
        System Match Display
        Contact Info Display
```

### Full (Functions + Fields)

```
Profile
WF NAME: HVACUpgradeTool — Replacement Work Order
WF Type: {placeholder}
Client ID: {clientID Number here}
    BC: HomeWarranty
    BackgroundImage: {1-6}

Modules
    NameID: Created
    Display: T
    Sort Order: 0
    Functions
        Status Message ("Your equipment is ready and waiting. Go ahead and schedule your installation appointment at a time that works best for you.")
        System Match Display
        Contact Info Display
        Schedule Installation Action
    Fields
        System Match (name, tier, price range, bundle)
        Contact Info (name, phone, email)

    NameID: Scheduling
    Display: T
    Sort Order: 1
    Functions
        Appointment Display (date, time, address)
        System Match Display
        Contact Info Display
        Reschedule Action
    Fields
        Appointment (date, time, address)
        System Match (name, tier, price range, bundle)
        Contact Info (name, phone, email)

    NameID: Scheduled
    Display: T
    Sort Order: 2
    Functions
        Appointment Display (date, time, address)
        System Match Display
        Contact Info Display
        Reschedule Action
    Fields
        Appointment (date, time, address)
        System Match (name, tier, price range, bundle)
        Contact Info (name, phone, email)

    NameID: In Process
    Display: T
    Sort Order: 3
    Functions
        Status Message ("Your replacement is in process right now. Check back here for updates after your inspection is complete.")
        Appointment Display (date, time, address)
        System Match Display
        Contact Info Display
    Fields
        Appointment (date, time, address)
        System Match (name, tier, price range, bundle)
        Contact Info (name, phone, email)

    NameID: Completed
    Display: T
    Sort Order: 4
    Functions
        Status Message ("We hope you are satisfied with your new replacement. Please take a moment to let us know how we did!")
        Feedback Survey (multi-select: Installation quality, Communication and updates, Timeliness, Technician professionalism, Value for cost)
        Free Text Input ("Is there anything else you'd like to share?")
        Submit Feedback Action
    Fields
        Feedback Selection (multi-select)
        Feedback Free Text

    NameID: Cancelled
    Display: T
    Functions
        Status Message ("Your replacement is in process right now. Check back here for updates after your inspection is complete.")
        Appointment Display (date, time, address)
        System Match Display
        Contact Info Display
    Fields
        Appointment (date, time, address)
        System Match (name, tier, price range, bundle)
        Contact Info (name, phone, email)
```
