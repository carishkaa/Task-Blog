# Task-Blog

### Run the application
```bash
# create .env file
cp .env.example .env

# database 
docker-compose up -d 

# run
npm install
npm run seed-data
npm run dev
```

### Swagger 
Endpoint: `/documents`

### Test
```bash
npm run test
```