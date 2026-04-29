FROM node:18-alpine

# app ke adr jitne bhi chij hai wo rhegiii
WORKDIR /app

COPY package.json package-lock.json 
# yha npm install ko upr la diya hun kyukuby chnace agr hm main.js main changes kre to npm istall bhi krna hoiga iskliye main.js ko niche kr liye taki optimize layered ho
RUN npm install   

COPY main.js ./

# COPY . .  iska mtlb jitne bhi files hai   // agr node_modules or unnnecsary file ko agr chahte hai ki wo na copy ho to ek .dockerignore file bnau jisko nai chahte copy krnana usko wha likh doo

ENTRYPOINT ["node", "main.js"]