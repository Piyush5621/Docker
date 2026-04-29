# Step 1: Use base image
FROM node:18

# Step 2: Set working directory
WORKDIR /app

# Step 3: Copy package files
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy application code
COPY . .

# Step 6: Expose port
EXPOSE 3000

# Step 7: Start application
CMD ["node", "app.js"]
