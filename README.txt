# To be able to test and run the server you have to have POSTMAN installed on your machine.
# To use a lightweight API testing platfrorm download Thunder Client from VSCode Extension.

#To run start/run server, type in terminal
npm start
#To run terminate/stop server, type in terminal
ctrl + c then type Y and click Enter button

#Authentication & Autorization Endpoints

1. POST /api/signup
*   Purpose: Creates a new user account
*   Required Parameters:
> username: String (required)
> email: String (required)
> password: String (required)
*   Example Request Body:
{
  "username": "johndoe",
  "email": "johndoe@example.com",
  "password": "mypassword123"
}

2. POST /api/signup
*   Purpose: Signs in a user and returns a token
*   Required Parameters:
> email: String (required)
> password: String (required)
*   Example Request Body:
{
  "email": "johndoe@example.com",
  "password": "mypassword123"
}

3. POST /tokenisvalid

*   Purpose: Checks the validity of an authentication token
*   Required Headers:
> authorization or x-auth-token: String (required) - containing the JWT token
*   Request Body: None

4. PUT /:id

*   Purpose: Updates a user's information
*   Required Headers:
> authorization or x-auth-token: String (required) - containing the JWT token
*   Required Parameters:
> username: String (optional)
> password: String (optional, will be hashed if provided)
> id: String (not sent as JSON, but extracted from the URL path)
*   Example Request Body:
{
  "username": "janedoe",
  "password": "newpassword456"
}

5. GET /:id

*   Purpose: Retrieves a user's information
*   Required Headers:
> authorization or x-auth-token: String (required) - containing the JWT token
*   Required Parameters:
> id: String (not sent as JSON, but extracted from the URL path)
*   Request Body: None

6. DELETE /:id

*   Purpose: Deletes a user account
*   Required Headers:
> authorization or x-auth-token: String (required) - containing the JWT token
*   Required Parameters:
> id: String (not sent as JSON, but extracted from the URL path)
*   Request Body: None

Additional Notes:

All endpoints except /tokenisvalid require authentication using a valid JWT token in the request headers.
Error responses typically include a JSON object with an error message indicating the reason for the failure.
The token field in the response of the GET /:id endpoint might be redundant if the token is already sent in the headers.
Implement proper authorization for the GET /:id and DELETE /:id endpoints to ensure users can only access or delete their own data.


# Todo CRUD Endpoints
1. Create a Todo

Endpoint: POST /api/todo
Authentication: Required (JWT token in headers)
Request Body:
title (String): Required. Title of the new todo.
description (String): Required. Description of the todo.
Response:
Success (201 Created):
message (String): "Todo created successfully!"
todo (Object): The newly created todo object.
Error (400 Bad Request):
message (String): Error message (e.g., "Please enter all fields!")
Internal Server Error (500):
error (String): "Internal server occurred!"
{
  "title": "Buy groceries",
  "description": "Milk, bread, eggs, and vegetables"
}


2. Get All Todos

Endpoint: GET /api/todos
Authentication: Required (JWT token in headers)
Request Body: None
Response:
Success (200 OK):
message (String): "Todos fetched successfully!"
todos (Array): An array of todo objects.
Empty List (200 OK):
message (String): "Whoops!! todo list is empty."
Internal Server Error (500):
error (String): "Internal server occurred!"

3. Get a Single Todo by ID

Endpoint: GET /api/todos/:id
Authentication: Required (JWT token in headers)
Path Parameter:
id (String): Required. ID of the todo to retrieve.
Response:
Success (200 OK):
message (String): "Todo fetched successfully!"
todo (Object): The requested todo object.
Not Found (404):
message (String): "Todo not found!"
Internal Server Error (500):
error (String): "Internal server occurred!"

4. Update Todo Status

Endpoint: PUT /api/todos/:id
Authentication: Required (JWT token in headers)
Path Parameter:
id (String): Required. ID of the todo to update.
Request Body:
status (String): Required. New status for the todo. Valid values are "in-progress" or "done".
Response:
Success (200 OK):
message (String): "Todo status updated successfully!"
todo (Object): The updated todo object.
Invalid Status (400 Bad Request):
message (String): "Invalid status"
Not Found (404):
message (String): "Todo not found!"
Internal Server Error (500):
error (String): "Internal server occurred!"
{
  "status": "in-progress"  // or "done"
}

5. Delete a Todo

Endpoint: DELETE /api/todos/:id
Authentication: Required (JWT token in headers)
Path Parameter:
id (String): Required. ID of the todo to delete.
Response:
Success (200 OK):
message (String): "Todo deleted successfully!"
Not Found (404):
message (String): "Todo not found!"
Internal Server Error (500):
error (String): "Internal server occurred!"