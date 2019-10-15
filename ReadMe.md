# Sequelize Examples
Example code for [Seqeulize v5](https://sequelize.org), an ORM (object-relational mapping) for few different databases. This example uses PostgreSQL. The command line program has methods that will perform simple Sequelize tasks such as inserting into and retreving from the database that I have written in `command.js` (option 1). Alternatively, a user can import the Sequelize models, and run their own Sequelize code in the command line (option 2).

 Main purpose of this repo is to create documentation for future me and anyone else who stumbles upon this. 

## Set-up
1. Make sure you have node and Postgres installed.
  - Node: https://nodejs.org/en/download/
  - Postgres: https://postgresapp.com/
2. Install all dependencies:
```
  $ npm i
```
3. Create database and run migrations
```
  $ sequelize-cli db:create
  $ sequelize-cli db:migrate
```

### Option 1: Run pre-written functions
1. Make sure to do steps 1-3 above.
```
  $ node index.js
```

### Option 2: Run your own Sequelize commands
1. Make sure to do steps 1-3 above.
2. Enter Node REPL
```
  $ node
```
3. Import dependencies (i.e., models, Sequelize, sequelize)
```
  $ const db = require('./sequelize/models/index.js')
```
  - `Sequelize` is the npm Sequelize library
  - `sequelize` is the instance of Sequelize and deals with the connection to the db
  - For more information, please look at the `/sequelize/models/index` or the Sequelize [documentation](https://sequelize.org/).

4. Write Seqeulize commands. Here is an example where we find an existing user by primary key:
```
  $ db.User.findByPk(1).then(user => console.log(user.toJSON))
```

## Making changes
Feel free to fork the project and make any changes.

Table Relationships:
- User has one UserAuth
- UserAuth has one User
- User has many Courses through UserCourse
- Course has many Users through UserCourse
- Course has many Assignments
- Assignment has one Course

### Migrations
To create a new migration and a model:
```
  $ npx sequelize-cli model:generate --name User --attributes firstName:string,lastName:string,email:string
```

More info on migrations [here](https://sequelize.org/master/manual/migrations.html).


