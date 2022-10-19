# FlatManager REST API

Flat-Manager is web application used to help manage housing needs and duties. This API provides communication between FlatManager App and its database.

# Content

[First use guide](#first-use-guide)

[Basic start up](#basic-start-up)

[How to use .env file](#how-to-use-environment-file)

[CORS policy](#cors-policy)

## First use guide

This guide should guide you through all processes needed to made this API works properly.

1.  Extract downloaded file "Flat-Manager-API-main.zip"

2.  Open extracted folder "Flat-Manager-API-main" in console or in your editor

3.  Write to the console

        > npm install

4.  In folder "Flat-Manager-API-main" create file called ".env" and write the following lines to it

        ACCESS_TOKEN_SECRET="generated_access_token_secret"

        REFRESH_TOKEN_SECRET="generated_refresh_token_secret"

        EXTERNAL_PORT=3200       # Set up external port on which API will be running.

        TEST_DB = "true"         # Switch to testing database.

        LOGGING_MODE = "common"     # "dev" stands for developer colored logging, "common" for basic usage, "off" for no logging and if not explicitly specified then default logging is on.

        DOCS = "true"             # If sets to "true" online documentation is turned on

        SEND_MAILS = "false"      # If sets to "true", everytime new product is added, notification email will be sent to all users

        VERIFY_JWT = "false"      # !! MAY CAUSE UNATHORIZED CONNECTION TO ANY ENDPOINT !! If set to "false" JWT verification is turned off.

        ALTER_MODELS = "false"   # !! MAY CAUSE LOST OF DATA !! If true, alter the table models if they are different from actual models.

        FORCE_MODELS = "false"   # !! MAY CAUSE LOST OF DATA !! If true, destroy all tables and recreate them using new models.

        EMAIL_ADDRESS="email_address@gmail.com" # E-mail address from which emails and notification will be sent to all users.

        EMAIL_PWD="passwordToEmail"     # Password to previous mentioned E-mail address.

5.  Now it's time to create a first user or Admin. Run folowing command

        npm run createAdmin

    If it was successful you should see message: **Admin created successfully!** and table with Login details (see fig. below)

    ![Login Details](./screens/LoginInfo.png "Login Details")

6.  Run command

        npm run dev

7.  Click on link in console to open documentation

    ![Login Details](./screens/docs.png "Login Details")

8.  Try out the API using online documentation

    ![Home page of documentation](./screens/swagger_home.png "Home page of documentation")

    ![Detail of one endpoint](./screens/swagger_route.png "Detail of one endpoint")

    ![Received data from API](./screens/swagger_executed.png "Received data from API")

    ## Basic start up

    If you already used the guidline above, everything should be setted up properly, so the next time you want to start up the API you don't have to go through all the stuff. In essence you have two options:

    - **Production start up**

            npm start

    - **Development start up**

            npm run dev

    The main difference between these two types of running the API is, that if you are working on API (so you are running it in DEV mode) and something went wrong in code, you don't have to restart it manually after the bug correction, you just press **CTRL + S** and it will restart the API automaticly.

    ## How to use environment file

    ### Access & Refresh token secrets

    Access token and Refresh token secrets should be random strings that are used to create new tokens and still guarantee the security of mentioned tokens. If you want to generate really strong secret you can use the following commands to generate random strings using Node.

            > node

            > require('crypto').randomBytes(64).toString('hex')

    To exit Node press twice **CTRL + C**.

    ### External port

    External port sets the port on which API will be running. If you want to use this API with FlatManager App, you have to set this port in **Flat-Manager-App > src > api > axios.js > BASE_URL**.

    ### Test DB

    This variable is used for testing API and its functionalities. If you want to perform any kind of tests on API you should set this variable to "true" to switch to "test-database", to prevent any kind of damage on already saved data on database used in practice.

    ### Logging mode

    Logging mode provides few different ways to log requests informations.

        "common" => ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length]'

        "dev" => ':method :url :status :response-time ms - :res[content-length]'

        "off" => No logging


        "" (default) => ':method :url :status :res[content-length] - :response-time ms'

    ### Docs

    Docs is used to provide documentation of the API. If its set to "true" you will see the following message in the console after running the API

        > INFO: Documentation running on: http://localhost:EXTERNAL_PORT/api-docs

    If you press **CTRL** and clicks on the provided link, it will automaticly redirects you to online documentation page, where you can find all informations about every single endpoint of this API.

    If it's set to "false" online documentation server is down.

    ### Send mails

    This feature serves for sending email notifications to the all signed users after creating new product in product section. If it's set to "false" no email will be sent to the users.

    ### Verify JWT

    When you want to test API for any use, it's not really practical to Log In and Log Out all the time. This feature is used to turn off JWT verification when set to "false". Keep in mind that this variable should be always set to "true" in production. If you set it to "false" you will also see the following message in the console

        > CAUTION: JWT verification is disabled!

    if it's set to "true" you should see

        > SAFE: JWT verification is enabled.

    ### Alter models

    After every change in database models in this API you should set this variable to "true" to apply the changes to DB models. Be carefull when setting this variable to "true" because this can leads to data loss.

    ### Force models

    This feature should be set to "true" only in case of big changes to the DB models. If it's set to "true" it will automaticaly delete all DB data. It's necessary to have any kind of backup for DB before running API with this setting.

    ### Email address

    This email address will be used as an address, from which all the mails will be sent to the users.

    ### Email password

    Password to the previous email address.

    If you want to use a **GMAIL** account, you should allow 2-Step verification in it (use this link: https://support.google.com/accounts/answer/185839?hl=en&co=GENIE.Platform%3DDesktop).

    Using google tutorial from previous link you should generate a password for third party aplications and then you can use it as a password in this app.

    ## CORS policy

    If you want to use this API you have to set up the CORS policy. As first you shoul go to main folder "Flat-Manager-API-main" and then to file: **./app/config/allowedOrigins.js**. In this file you will find preset origins, as can be seen below.

    ![CORS origins](./screens/CORS_origins.png "CORS origins")

    If you want to run your FrontEnd or another API on different host and port you should add it into the **allowedOrigins**.

    Also if you want to add some endpoints into this API you should go to the file: **./app/config/corsOptions.js** and set up all allowed methods.

    ![CORS methods](./screens/CORS_methods.png "CORS methods")
