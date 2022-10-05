
This Sports club's website is a fullstack resful web app. The major technologies used in this project will be NodeJS, Express, SQL, and PostgreSQL for creating an API, along with HTML5 and CSS for the frontend in combination with a frontend JavaScript framework called React. For the deployment of this project, website hosting site named Heroku will be used. <br>

Since it is a fullstack web application, the first and foremost focus will be on creating a database to store the admin and players' information. Then to access and manipulate the data stored in the database, an API will be designed and implemented with differnet endpoints. Once the backednd is accomplished with required endpoints, the frontend will be designed and implemented accordingly to display the information that a user is looking for. The front-end will provide a way for a user to make donations to the club or purchase an annual membership, there will be a need of an external api for payment processing. This api will be used in backend as well. As you can seee that the project requires a good amount of research and work in both ends, the programming emphasis will be distributed roughly equally between the front-end UI and the back-end API. 
The current focus of the project is to create a desktop website, and the strech goal is to extend it be accessed on mobile/smart phones as well. <br>

The goal of this project is quite simple. It is designed to provide an information about a cricket club named Aurora Everest Cricket club of Aurora, Colorado. The main purpose of this site is to provide information about the club as well as each player of the club. As an extended goal, the landing page of the site should provide an option for an admin to upload a small video clip of the club's progress such as a minute long video footage highlight of the match the club played, or any other functions that a club organized. <br>

The majority of the users visiting the app will be the players of the club, their family members, and the admin team of the club. It extends to the supporters and well wishers of the club as well. This also provides an opportunity for the people looking to join a cricket club in the city of Aurora. Other than the aforemetioned groups of people, the users could include the local sports enthusiasts, and others. Therefore, the website will be surfed by diverse array of people. <br>

Since the project involvs creating an own API as well as using an exteranl api, the type of data to be used in the project revolves around these two main requirements of the app. The data that will be stored in database includes a player's first name, last name, username, email, passsword, phone number, date of birth, the date of entry to the club, the dat of termination from the club, emergency contact person, and a role in the club(eg batsman or wicket keeper). These data will be collected via a user's input when creating an account. For the payment processing, I need to do more research about the api that I am intended to use(that is stripe api). The strech goal includes defining the different categories of the admin such the President, Advisor, Coach, Captain, as well as Treasurer and providing them only needed access previlleges. 

The database shema consists of players, matches, payments, donors, and admins tables. It is shown in the sports-er-2.png file.
![](er-diagrams/sports-er-2.png)

<br>

<br>


7. In brief, outline your approach to creating your project (knowing that you may not
know everything in advance and that these details might change later). Answer
questions like the ones below, but feel free to add more information:
a. What does your database schema look like?
b. What kinds of issues might you run into with your API? This is especially
important if you are creating your own API, web scraping produces
notoriously messy data.
c. Is there any sensitive information you need to secure?
d. What functionality will your app include?
e. What will the user flow look like?
f. What features make your site more than a CRUD app? What are your
stretch goals?


Step Two is all about fleshing out your project idea. For this step, please write a proposal based
on the project idea you agreed on with your mentor. This proposal should be a 1-2 page
document that answers the following questions:
1. What tech stack will you use for your final project? We recommend that you use
React and Node for this project, however if you are extremely interested in
becoming a Python developer you are welcome to use Python/Flask for this
project.
2. Is the front-end UI or the back-end going to be the focus of your project? Or are
you going to make an evenly focused full-stack application?
3. Will this be a website? A mobile app? Something else?
4. What goal will your project be designed to achieve?
5. What kind of users will visit your app? In other words, what is the demographic of
your users?
6. What data do you plan on using? How are you planning on collecting your data?
You may have not picked your actual API yet, which is fine, just outline what kind
of data you would like it to contain. You are welcome to create your own API and
