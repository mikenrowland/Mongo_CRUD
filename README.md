# Todo CRUD API with MongoDB

## Description

A Todo CRUD API that allows a user to create, get, update and delete a todo list.

With authentication and authorization implemented, users can register, verify email, login, recover password and set user roles.

Some user and todo routes such as `setRoles`, `createTodo`, `updateTodo`, and `deleteTodo` are admin protected, while `getAllTodo` and 
`getTodoByID` are auth protected.


## Technologies

* NodeJS
* Express
* MongoDB (Service used: Atlas cloud cluster)
* Mongoose
* Nodemailer

## Screenshots

### Verify User using OTP

![Snapshot of mail received](./images/verifyUser.png)

### Password Recovery Mail

![Snapshot of mail received](./images/recoverPass.png)

### Admin Protected Route

![Snapshot of testClient](./images/adminRoute.png)
