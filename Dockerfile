# Gunakan image Node.js sebagai base image
FROM node:14

# Set working directory
WORKDIR /usr/src/app

# Salin package.json dan package-lock.json ke dalam container
COPY package*.json ./

# Install dependencies
RUN npm install

# Salin semua file dari direktori lokal ke dalam container
COPY . .

# Expose port yang digunakan oleh aplikasi
EXPOSE 8000

# Set environment variable untuk port
ENV PORT 8000

# Jalankan perintah untuk memulai server
CMD [ "node", "server.js" ]