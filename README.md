# URL Shortener API (NestJS)

A secure and modular URL shortener backend built with NestJS, MongoDB, and JWT authentication. Authenticated users can shorten URLs, get stats, and handle redirections.

---

Features:

- JWT authentication
- Shorten any long URL
- Redirect using short code
- View stats for each short code
- Modular architecture (NestJS best practices)
- Redis caching (basic setup)
- Rate limiting setup (disabled as per decision)

---

Setup Instructions:

1. Clone the repository:

   git clone https://github.com/your-username/url-shortener.git
   cd url-shortener

2. Install dependencies:

   npm install

3. Create a `.env` file and add:

   PORT=3000
   DATABASE=mongodb://localhost:27017/url_shortener
   JWT_SECRET=your_jwt_secret
   REDIS_HOST=localhost
   REDIS_PORT=6379

4. Start the server:

   npm run start:dev

App runs at: http://localhost:3000

---

API Endpoints (require JWT in Authorization header):

Authorization: Bearer <ACCESS_TOKEN>

POST /shorten  
- Create a short URL

GET /:shortCode  
- Redirect to the original URL  
- Optionally add `?raw=true` to get JSON response

GET /stats/:shortCode  
- Get stats (visits count) for a short URL

---

Completed Features:

- Authenticated short URL creation
- URL redirection
- Stats tracking per short code
- MongoDB with Mongoose
- Redis caching using cache-manager-ioredis
- Swagger (optional setup)
- JWT authentication

---

What I Would Improve With More Time:

- Allow custom short codes
- Advanced analytics (IP, browser, location)
- Expiry support for short URLs
- Unit and e2e testing
- Host the app publicly (e.g. Render, Railway)
- Create a frontend for easy access

---

Author: Fakhriddin Abdughaniyev

License: MIT
