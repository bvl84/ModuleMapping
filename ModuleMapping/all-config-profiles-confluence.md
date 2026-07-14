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

---

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

---

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

---

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

---

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

---

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

---

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
