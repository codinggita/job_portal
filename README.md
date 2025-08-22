# Jobmentum 🚀

**Jobmentum** is an innovative job portal designed to connect students with recruiters quickly and efficiently. It allows students to register, manage profiles, apply for jobs, while employers can post jobs and manage applications. Whether you're a job seeker looking for your next opportunity or an employer seeking to hire top talent, **Jobmentum** is the platform that helps you find the right match. 🌟

## **🔗 Key Links**

* **Prototype**: [Figma Prototype](https://www.figma.com/design/rCJvmrMjiTtu9J3uqajM6z/Untitled?node-id=0-1&t=MmPrtzaCHJlxW7zw-1)
* **Node Server**: [Backend](https://jobmentum.onrender.com)
* **Frontend**: [Frontend](https://jomentum.netlify.app)
* **Documentation:** [API Documentation](https://documenter.getpostman.com/view/39189648/2sAYX9kzJW)
* **Backend Repo**: [GitHub - Backend](https://github.com/codinggita/job_portal/tree/main/backend)
* **Frontend Repo**: [GitHub - Frontend](https://github.com/codinggita/job_portal/tree/main/frontend)  

_For more detailed setup and usage instructions, visit the respective **[Frontend README](https://github.com/Priyasha-Yadav/Job-Portal/tree/main/frontend/README.md)** and **[Backend README](https://github.com/Priyasha-Yadav/Job-Portal/tree/main/backend/README.md)** files._

## Tech Stack 🖥️

* **Backend**: Node.js, Express.js
* **Database**: MongoDB with Mongoose for data modeling
* **Authentication**: JWT (JSON Web Token) for secure user authentication
* **Cloud Storage**: Cloudinary for resume and file uploads.
* **Deploy**: Netlify for frontend and Render for backend.
* **Prototyping**: Figma for UI/UX design
* **Other**: dotenv (for environment variables), bcryptjs (for password hashing), multer (for file uploads)

## **📂 Folder Structure**

The project is split into two main folders: `frontend` and `backend` .

```bash

├── backend/                     # Backend  
│   ├── controllers/
│   ├── models/
│   ├── middlewares/
│   ├── routes/
│   ├── utils/         
│   ├── server.js
│   ├── app.js
│   ├── package.json
│   ├── package-lock.json
├── frontend/                    # Frontend    
│── public/             
│── src/
│   │── components/     
│   │── hooks/          
│   │── redux/          
│   │── utils/          
│   │── App.jsx         
│   │── main.jsx        
│── eslint.config.js    
│── index.html          
│── package.json        
│── README.md           
│── vite.config.js      
└── README.md                    # README.md 
```

## Features ✨


### Platform-wide Features:

* **User Authentication** 🔑: Register and log in with JWT-based authentication.
* **Job Management** 📋: Post new jobs, view job listings, and update job details as needed.
* **Application Management** 📝: Job seekers can apply for jobs, and employers can manage applicants.
* **Role-based Access Control** 🛡️: Employers and job seekers have access to distinct features.
* **Company Registration** 🏢: Companies can register and update their company details.

### For Job Seekers:

* **Browse Jobs** 🧳: Search for job opportunities by category, location, and more.
* **Apply for Jobs** 📝: Submit job applications with your resume.
* **Profile Management** 👤: Manage your personal details, upload resumes, and keep your profile up to date.
* **Job Alerts** 🔔: Get notified about new jobs that match your profile.

### Employers:

* **Post Jobs** 🗣️: Create and manage job postings for your company.
* **View Applications** 📑: Review job applications and shortlist candidates.
* **Company Profile Management** 🏢: Update and manage your company details and jobs.

## **🎯 Contributing**

Contributions are encouraged from developers, designers, sustainability enthusiasts, and anyone who wants to make a difference! Whether you’re adding new features, reporting bugs, or improving the UI, your input is highly valued.

### How to Contribute:

1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Make your changes.
4. Open a pull request for review.

