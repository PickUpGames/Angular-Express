# TO RUN THIS
The site is powered by the MEAN (MongoDBx, Express, Angular, and Node) stack and is currently being hosted locally. In order to set up the application, you must first install:

*MongoDB*
*Node.js*

  Express and Angular have already been included in the directory. So in order to run the server, navigate to the main application folder. Now navigate to the directory where Mongodb was installed. On windows, this is typically found in ‘C:/’ or ‘C:/users/programfiles’. Navigate to ‘MongoDB/Bin/Mongod.exe’ and open Mongod.exe. Launch cmd in the main application directory by shift clicking on the folder and clicking “Launch Command Window.” or do it using cmd. Type “node server.js”. The console will return with the success message “Magic Happens on Port 8080.” Type localhost:8080 into your web browser of choice to visit the website.


#For our mean stack, there are 4 files that ties everything together.


##First, there is our angular app
*public/js/app.js*

It handles the routing whenever a link is entered. Controllers are assigned to each page.


##Next, there are our controllers
*public/js/controllers/....*

These handle client-side functions via scope and send data via http to our server file.

##Third, our server file
*server.js*

That initializes our server components using node/express, and handles page calls and api calls sending them to our routes files.

##Last, our routes files
*routes/....*

Index.js takes request parameters and renders the proper file.
Api.js takes in request parameters, queries the database for info, then sends the response back to our controllers.
