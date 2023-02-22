Run 'yarn dev' from inside the ReptileDaddy folder this will start the server

go to post man and create a workspace

From here we have a list of post and get requests to make. All urls will start as http://localhost:3000

To sign up a new user, setup post request and concatenate url with '/' This is our default command. The arguments take firstName, lastName, email, and password. Our program takes a unique email. If email is correctly input, you will receive a message 'New User Created.'

To create a reptile, setup post request and concatenate url with '/reptile' which takes the arguments species, name, sex, and will add the reptile to the current user.

To list all reptiles of a user, setup get request and concatenate url with '/reptile' this will display all reptiles of the user.

To delete a reptile from a user, setup post request and concatenate url with '/delrep' which will delete the reptile by it's id.

To update a reptile from a user, setup post request and concatenate url with '/uprep' which will take the arguments species, name, sex.

To create a feeding for a reptile, setup post request and concatenate url with '/feed' which takes a foodItem as an argument

To list all feedings for a reptile, setup get request and concatenate url with '/feed' this will deisplay all feedings of the reptile.

To create a husbandry record for a reptile, setup post request and concatenate url with '/husbandry' which takes the arugments weight, length, temperature, humidity.

To list all husbandry records of a reptile, setup get request and concatenate url with '/husbandry' this will display all husbandry records for a specific reptile.

To create a schedule for a reptile, setup post request and concatenate url with '/schedulerep' which takes the arguments type, description, and a boolean for sunday-monday

To list all schedules for a reptile, setup get request and concatenate url with '/schedulerep' which will display all the schedules of a reptile

To list all schedules for a user, setup get request and concatenate url with '/scheduleuser' which will display all the schedules that a user has for their reptiles.