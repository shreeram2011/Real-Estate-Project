<h1>Real Estate Web Application</h1>

<h2>Project Overview</h2>

<p>This is a full-stack real estate web application developed using the MERN (MongoDB, Express.js, React, Node.js) stack. The platform connects landlords and property hunters, allowing landlords to list their properties and hunters to search for and communicate with them via a built-in chat feature.</p>

<h2>Features</h2>
<ul>
  <li><strong>User Authentication:</strong> Secure login and registration for landlords and property hunters.</li>
  <li><strong>Property Listings:</strong> Landlords can add, edit, and delete their real estate properties.</li>
  <li><strong>Search & Filter:</strong> Property hunters can search for listings based on location, price, and other criteria.</li>
  <li><strong>Chat System:</strong> Real-time communication between property hunters and landlords using Socket.IO and WebRTC.</li>
  <li><strong>Responsive Design:</strong> Optimized for both desktop and mobile devices using Tailwind CSS.</li>
</ul>

<h2>Technologies Used</h2>
<ul>
  <li><strong>Frontend:</strong> React, Tailwind CSS</li>
  <li><strong>Backend:</strong> Node.js, Express.js</li>
  <li><strong>Database:</strong> MongoDB</li>
  <li><strong>Real-Time Communication:</strong> Socket.IO</li>
  <li><strong>State Management:</strong> React Context API / Redux (if used)</li>
  <li><strong>Authentication:</strong> JWT (JSON Web Token)</li>
  <li><strong>Deployment:</strong> (e.g., Vercel, Netlify, or any other platform used)</li>
</ul>

<h2>Installation & Setup</h2>

<h3>Prerequisites</h3>
<p>Ensure you have the following installed on your system:</p>
<ul>
  <li>Node.js</li>
  <li>MongoDB</li>
</ul>

<h3>Steps to Run the Project</h3>

<p><strong>Clone the repository:</strong></p>
<pre><code>git clone https://github.com/yourusername/real-estate.git
cd real-estate
</code></pre>

<p><strong>Install dependencies:</strong></p>
<pre><code>npm install
cd client
npm install
</code></pre>

<p><strong>Set up environment variables:</strong></p>
<p>Create a <code>.env</code> file in the root directory and add the following:</p>
<pre><code>MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
</code></pre>

<p><strong>Start the backend server:</strong></p>
<pre><code>npm run server
</code></pre>

<p><strong>Start the frontend:</strong></p>
<pre><code>cd client
npm start
</code></pre>

<h2>Usage</h2>
<ul>
  <li><strong>For Landlords:</strong> Sign up, list your properties, and manage communications.</li>
  <li><strong>For Hunters:</strong> Browse available properties, apply filters, and chat with landlords.</li>
</ul>

<h2>Contributing</h2>
<p>Contributions are welcome! Please create a pull request or open an issue for improvements.</p>

<h2>License</h2>
<p>This project is licensed under the MIT License.</p>

<h2>Contact</h2>
<p>For any queries, reach out to <a href="mailto:yadavshreeram147@gmail.com">yadavshreeram147@gmail.com</a>.</p>
