# MyNoteApp

## Software Description
**MyNoteApp** is a note taking app which users can see, add, edit, and delete their own notes. 
In the main page, a list of all notes created is shown at the left sidebar where users can select to view the full note at the center of the page. 
It consists of 3 microservices.

**MyNote** service acts as a hub that serves frontend pages (`/` and `/login`) to users. 
There are 2 services connected to MyNote: *UserService*, which creates users and gives users access tokens, and *NoteService*, which manages notes data. 

**UserService** has 2 endpoints: 
`/user/signup` which adds username and password to the database, 
and `/user/login` which creates jwt token for users to access other services (currently there is only one other service: NoteService). 

**NoteService** has 5 endpoints: 
`/note/create` for creating a new note, 
`/note/read/:noteId` for getting data of one note, 
`/note/readList` for getting brief data of all notes, 
`/note/update/:noteId` for editing the note, 
and `/note/delete/:noteId` for deleting the note. 
In normal user flow, users would signup, login, and be able to access note data using a valid jwt token. 
The jwt token is valid for 1 day, so the user will need to login again to renew the token.

## Running the Application
### Using Kubernetes Script
Go to `/Kubernetes` directory
```
cd Kubernetes
```
Grant `run-k8s.sh` execution permissions
```
chmod +x run-k8s.sh
```
Run the script
```
./run-k8s.sh
```
### Using Docker Compose
Run the compose command
```
docker compose -f docker-compose.yml up
```
The web page will be available at http://localhost:3000/

## Architecture
Cloud Architecture Patterns used are

Wilder:
- Horizontally Scaling Compute Pattern & Auto-Scaling Pattern: can deploy any number of replicas

Taibi et al.:
- Multiple service per host: containers can be run on the same host machine
- Shared DB server: MongoDB is shared between UserService and NoteService but each service uses different collections.

## Component Roles and Responsibilities
**MyNote** is an app that serves user interfaces to users and consumes services from *UserService* and *NoteService*. 
It serves a login page at http://localhost:3000/login and note management page at http://localhost:3000/. 

**UserService** is a user manager that can create users which store username and password in `userStore` collection of `myNoteDb` database, 
and generate jwt tokens after login using `JWT_SECRET` from the `.env` file. The token is then stored in browser local storage (by *MyNote*) for authorization when using *NoteService*. 
The API of *UserService* is accessible at port 3001.

**NoteService** is a service for users to manage their notes. It allows users to create, read, update, and delete their own notes. 
Users need valid jwt tokens to be able to use *NoteService* api as it has application level middleware to verify the token using the same `JWT_SECRET` as *UserService*. 
The note data is stored at the `noteStore` collection of `myNoteDb` database. 
The API of *NoteService* is accessible at port 3002.

## Sequence diagram
Sequence diagram for normal use case where user signup, login, and enter note editor page.
<img width="1022" height="1031" alt="image" src="https://github.com/user-attachments/assets/bb213048-ae22-4a30-af10-4b3a008bb34a" />

## Database Schema
### Users
| Field      | Type     |
| ---------- | -------- |
| `_id`      | `uid`    |
| `username` | `string` |
| `password` | `string` |

### Notes
| Field          | Type     |
| -------------- | -------- |
| `_id`          | `uid`    |
| `userId`       | `uid`    |
| `title`        | `string` |
| `content`      | `string` |
| `createdAt`    | `string` |
| `lastModified` | `string` |

## Discussion
There are several benefits of architecture used in *MyNote*, ranging from scalability to security. 
First, *MyNote* has a user management service and jwt token for authorization. This allows Attribute Based Access Control, which users can only see, add, edit, and delete their own notes. 
Second, the services are scalable. Any number of replicas can be deployed for each service and multiple services can be run on the same host machine. 
Third, each service is independent. *NoteService* checks that jwt token is valid by using the same `JWT_SECRET` as *UserService* without the need to check if the user exists in the database again. 
This turns authentication into a mostly stateless exchange.

While *MyNoteApp* has benefits from its architecture, there are also challenges and disadvantages. 
Although using a shared database server for multiple microservices simplifies data management and application development, it makes the database not scalable. 
In the current version, no password encryption is implemented yet for ease of development and debugging. 
It can be applied when the password is saved to the database to improve security in case there is data breach. 
Though jwt tokens allow the services to be scalable, it has a trade off. Once the token is issued, whoever holds the token can access the data until the token expires. 
This means even though the user is deleted, they can still access the service until the token expires. 
Next, the *UserService* and *NoteService* currently allow all origins in CORS which is vulnerable to cross-site scripting exploitation. 
It can be mitigated by defining specific allow origin (ex. localhost:3000 where *MyNote* runs). 
While the 2 backend services use `.env` when run with docker compose, Kubernetes deployment script given in the repo hasn't set `JWT_SECRET` for services yet, 
so it will use hardcoded “noSecret” for the key. It can be implemented by adding `secretKeyRef` in the env of each service with some `.env` file and script setup. 
However, due to limited development time, it is left out at the moment.
Lastly, using `LoadBalancer` for the backend (user/note service) exposes it to the outside, which is bad from a security perspective, e.g., `ClusterIP` is better for internal communication.

## Video Recording Link
https://1drv.ms/v/c/1eb25f0b0bb4f837/IQDbcUYNyPOJSIhOSQwIrSXSAfydG0ZBWrggBMSiS3Oop-4?e=17Zdtq
