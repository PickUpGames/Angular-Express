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
