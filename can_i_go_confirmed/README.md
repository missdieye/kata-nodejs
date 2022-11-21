# CAN I GO? 🤔

## Context :

Your team is mandated by the governement to create a new app used as a COVID context utility called "Can I go?".

You're in charge of creating a webservice of this app.

This webservice is a CRUD API mainly used to know if your authorized to be in some public spaces based on your current health situation, age, and level of pass (3 levels of pass : not vaccinated, recent case of covid, vaccinated).

This webservice must use MongoDB as database.

At start, data in JSON (that you create by yourself) must be added to BDD and CURL request to the API should be possible.

## Instructions :

> Your project (API + MONGODB) must be dockerize and runned by a
> docker-compose.
> 
> Provided .nvmrc and package.json should be present in your project. You may add some libraries but the main logic should be implemented by yourself.

- 🛠 CRUD operations for all entities (users, places, and passes)


- 🚦 One endpoint to check if a given user can access a given public space

- 🚦 One endpoint to check which public spaces can access a given user


- 🔒 Security and token : <br>
A public endpoint should be created to ask for a token to consume the API. <br>
All others endpoints should request a token in order to be consumed.<br>
Except for a place, a ressource should only be accessed by it's owner.


- ❌ Implements status codes <br>
at least 200, 201, 400, 401, 403, 404, 500


- 🌈 BONUS : Add units tests with Jest <br>
A script npm run test should be added to your package.json


- 🌈 BONUS : Add documentation with Swagger

## Entities :

Here's the list of the 3 entities that must be implemented in the project. The fields's list is not exhaustive, and you can add more (but not less) :

### User :

- [ ] id (must be generated automatically)
- [ ] First name
- [ ] Last name
- [ ] Age
- [ ] Phone number
- [ ] Address
- [ ] Pass's id

### Pass :

- [ ] id (must be generated automatically)
- [ ] Pass's level
- [ ] Created_at
- [ ] Updated_at

### Place :

- [ ] id (must be generated automatically)
- [ ] Address
- [ ] Phone number
- [ ] Minimum required pass's level to get in
- [ ] Minimum required age to get in
