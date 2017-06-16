# Standardizirano

To start this webapp you will have to have node, npm and MySQL. Forward engineer the database, configure the .env file(facebook integration requires it to be set to port 3000) in the root folder and while in the command line(in the repository dir) enter npm start.

This webapp enables you to create and share markers with the public(or just your facebook friends). 
To have access to all the features you will have to log in. Some of the most interesting features are:
Painless login with Facebook Oauth
An intuitive interface
A feed which shows the most recent markers(you facebook friends first, public markers after), pans the map to the site of the marker when you hover over it
A filter for showing only the categories of markers you want to see
A parachuter which can be dropped on the map, sorting markers into an array based on the distance from the drop site and 
automatically showing modals of the next farthest marker every 7 seconds(can be disabled via a pause button), ignores hidden markers
A user page which can be used to see your markers and delete them
A dynamic view modal which contains the location(obtained via a geocoder query), an image(or a carousel if the marker contains multiple images)
An input linked with a geocoder whose callback pans the map to the inputed location

Our server uses no synchronous functions(atleast we think it doesnt xD)

![alt text](http://i.imgur.com/NL783nc.jpg)
![alt text](http://i.imgur.com/5uZznqv.png)
![alt text](http://i.imgur.com/mQoQIqj.jpg)
![alt text](http://i.imgur.com/GKeexuA.png)
