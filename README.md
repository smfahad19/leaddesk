<<<<<<< HEAD
# LeadDesk Mini

LeadDesk Mini is a full-stack web application built as part of the Digital Heroes Internship Qualification Task.
=======
# LeadDesk

LeadDesk is a full-stack web application built as part of the Digital Heroes Internship Qualification Task.
>>>>>>> 5d2c7846460c0da6eed6af2a83a85cac0c044258

The application allows users to submit project inquiries through a public landing page. Submitted leads are stored in MongoDB and can be managed through a secure admin dashboard where an administrator can search leads and update their status.

## Technologies Used

- Next.js 16
- React
- Tailwind CSS
- MongoDB
- Mongoose
- JWT Authentication
- React Hot Toast

## Data Model

Each lead contains the following information:

- Name
- Email
- Budget
- Message
- Status
- Created At
- Updated At

Every new lead is created with the default status **New**. The status can later be updated to **Contacted** or **Closed** from the admin dashboard.

## Authentication

The admin area is protected using JWT authentication.

When the admin logs in, the server validates the email and password. If the credentials are correct, a JWT token is generated and returned to the client. The token is stored in the browser and sent with every protected request through the `Authorization` header.

Before returning protected data or updating a lead, the backend verifies the token. If the token is invalid or missing, the request is rejected.

## Author

<<<<<<< HEAD
Syed Muhammad Fahad
=======
Syed Muhammad Fahad
>>>>>>> 5d2c7846460c0da6eed6af2a83a85cac0c044258
