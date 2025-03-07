FROM node:18

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json* ./
RUN npm install
RUN npm install express-session
RUN npm install bcrypt
Run npm install cookie-parser
# Copy the rest of the backend code
COPY . .

# Expose the backend port
EXPOSE 3000

# Start the server
CMD ["npm", "start"]
