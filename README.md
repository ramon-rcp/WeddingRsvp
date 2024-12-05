# Wedding RSVP App

This project is a client-server web application designed to help manage wedding RSVPs. The app allows users to maintain a guest list, specify additional details for each guest, and store data persistently via a server. This project was developed as part of CSE 331 coursework.

## Features

### Core Features
1. **View Guest List**:
   - Displays all guests added so far.
   - Indicates whether guests are invited by James or Molly.
   - Shows if each guest is bringing an additional guest.
   - Summarizes the number of guests invited by James and Molly, and the number of family members invited.

2. **Add Guests**:
   - Allows James and Molly to add a guest with the following details:
     - Guest name.
     - Whether they are invited by James or Molly.
     - Whether they are family.
   - Validates input, showing error messages for missing fields.

3. **Edit Guest Details**:
   - Provides options to set:
     - Dietary restrictions for the guest and their additional guest (if applicable).
     - Whether the guest is bringing an additional guest.
     - Additional guest name (if applicable).
