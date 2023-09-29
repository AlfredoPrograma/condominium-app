# Condominium
Web application for ease management of condominiums and residential complexes.

## Set up
1. Install needed dependencies
   - [Node v18+](https://nodejs.org/es)
   - [Docker](https://docs.docker.com/)
   - [Docker compose utility](https://docs.docker.com/compose/install/)
2. Clone this repository in your local machine
3. Run `npm install` to install the app packages
4. Copy the `.env.example` content into a new `.env` file and set up the environment variables
5. Run `docker compose up -d` for set up a containerized database for the application
6. Run `npx prisma db push` to push the database schema into the database
7. Run `npm run create-superuser <email> <password>` to seed the database with the admin user *(more details below)*
8. Run `npm run dev` to start the application in development mode

## About commands
### Running in development environment
By default, `npm run dev` runs the application in `PORT=3000`. If you want to run the application in the specified `APP_PORT` set in the `.env` file. You should run `source .env && npm run dev -- -p $APP_PORT`

### Creating a superuser
For creating a superuser with ADMIN role in the application, use `npm run create-superuser <email> <password>`. It will call the `seed.ts` file which has the logic for superuser creation. There are some keypoints
- Database should be running (obiously, we will seed it so it should be turned on)
- `<email>` arg should be a valid email
- `<password`> arg should have a min length of 4 characters

> Specifically, `<email>` and `<password>` args should pass the `signInSchema` which is used for validate login credentials in `sign-in.ts` page.


