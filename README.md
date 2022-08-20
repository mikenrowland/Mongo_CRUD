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

### Register User

![Snapshot of testClient](./images/RegisterUser.png)

### Verify User using OTP

![Snapshot of mail received](./images/verifyUser.png)
![Snapshot of testClient](./images/otpVerification.png)

### Login User

![Snapshot of testClient](./images/loginUser.png)

### Logout User

![Snapshot of testClient](./images/logoutUser.png)

### Password Recovery Mail

![Snapshot of mail received](./images/recoverPass.png)

### Admin Protected Routes

![Snapshot of testClient](./images/adminRoute.png)
![Snapshot of testClient](./images/managerRoute.png)


### Auth Protected Route

![Snapshot of testClient](./images/authProtected.png)
