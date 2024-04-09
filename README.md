# Project Mullet ![](./app/images/logo.png)

This project is a beauty app being developed for HairDoneWright530. HairDoneWright530 is located in Olivehurst, California and is privately owned by 
Melissa Wright. 

This project is being completed by a team from Sacramento State University called the Recycling Team as part of a Senior Project over the time span of 2 semesters.

# Table of Contents
- [Authors](#authors)
- [Project Flow (EERD)](#project-flow-eerd)
- [Installation](#installation)
- [Running the Program](#running-the-program)
- [Testing](#testing)
- [Deployment](#deployment)
- [Developer Instructions](#developer-instructions)
- [Screenshots](#screenshots)
  - [Terminal After Successfull Run](#terminal-after-successfull-run)
  - [Temporary Home Screen of App](#temporary-home-screen-of-app)
  - [3 Different Screens](#setup-appointment-modify-availability-client-appointment-screen)
  - [SetUp Appointment Screen 2](#setup-appointment-screen-2)
- [Jira Timeline](#jira-timeline)
  - [Sprint 1](#sprint-1)
  - [Sprint 2](#sprint-2)
  - [Sprint 3](#sprint-3)
  - [Sprint 4](#sprint-4)
  - [Sprint 5](#sprint-5)
  - [Sprint 6](#sprint-6)
  - [Sprint 7](#sprint-7)
  - [Sprint 8](#sprint-8)



## Authors

- [@Andrew Canada](https://github.com/CanadaAndrew)
- [@Chris Wright](https://github.com/cdub-616)
- [@Adrian Gonzalez](https://github.com/VoicelessBark44)
- [@Andrew Covert](https://github.com/acovert2)
- [@Leaith Rawashdeh](https://github.com/LeaithR)
- [@Tai Tang](https://github.com/ttang0)
- [@Cameron Ingersoll](https://github.com/CamIngersoll)
- [@Wilson Toy](https://github.com/Wilson-Toy)


## Project Flow (EERD)

![Project Mullet EERD Diagram](./app/images/Demo_Images/ProjectMulletEERD.png)

## Installation

You can install the project to run locally by installing a few different dependencies and cloning the project. You can clone the project by using the terminal.

```bash
git clone https://github.com/CanadaAndrew/Project-Mullet
```

In addition to the listed dependencies below you will need npm and to create a expo app to run the app in.

```bash
npx expo install expo-linear-gradient
npm install --save react-native-calendars
npx expo install expo-router react-native-safe-area-context react-native-screens expo-linking expo-constants expo-status-bar react-native-gesture-handler
npm install react-native-dropdown-select-list
npm install axios
npm install mssql
npm install express
npm install cors
npm install moment-timezone
npm install @react-native-community/datetimepicker --save
npm install firebase
npm install @expo/vector-icons
npm i react-native-vector-icons
npm install firebase
npm install @react-native-async-storage/async-storage
npm install react-native-root-toast
```
    
### Running the Program

To deploy this project type in the terminal:

```bash
npm run
```
Or you can type:

```bash
npx expo start
```
Both of these commands should start the prject and bring you to wall of text with a
QR code that you can scan to run the app on your phone. We recommend you use 'npx expo start'. If you don't want to run this project on your phone using the QR code you can download a simulator and run it locally.

## Testing

*To Do Will be Completed in CSC 191*

## Deployment

*To Do Will be Completed in CSC 191*

## Developer Instructions
*To Do Will be Completed in CSC 191*


## Screenshots

### Terminal After Successfull Run
![Terminal Image](./app/images/Demo_Images/Terminal.png)

### Temporary Home Screen of App
![Temporary Home Screen](./app/images/Demo_Images/Temp_Home_Nav_Screen.png)

### SetUp Appointment, Modify Availability, Client Appointment Screen
![](./app/images/Demo_Images/SetUpAppointment_Screen.png) ![](./app/images/Demo_Images/Modify_Av_Screen.png) ![](./app/images/Demo_Images/Client_Appointment_Screen.png)

### SetUp Appointment Screen 2
![](./app/images/Demo_Images/SetUpAppointment_Screen.png) ![](./app/images/Demo_Images/SetUpAppointment_Screen1.png)

## Jira Timeline
### Sprint 1 
Sprint Start Date: 2023/9/17

Sprint End Date: 2023/10/2

Goals for the Sprint: 
Find a client to work with and Create a Project Proposal to complete said project. After a Successful project proposal and approval begin working with client to design the project.

Completion Status: Succesfully completed all goals this sprint. Recycling Team will be working together with HairDoneWright530 to create a beauty app for connecting to clients and managing appointments all within one app.

### Sprint 2
Sprint Start Date: 2023/10/08

Sprint End Date: 2023/10/22

Goals for the Sprint: Create all documentation necessary for the project and begin researching database providers and all other elements of the technology stack that will be used in this project with budget proposals for the app's development and continued use after Senior Project in May of 2024. 

Completion Status: All tasks completed with documentation sent and approved by the professor, Lab Advisor and the client Melissa Wright. Research into Technology Stack was completed with a decision to use Microsoft Azure for backend Storage in SQl.

### Sprint 3
Sprint Start Date: 2023/10/14

Sprint End Date: 2023/11/12

Goals for the Sprint: Begin coding of the app using Expo in Visual Studio Code. Tasks were assigned to team members in Jira to complete and were instructed to from now on when submitting a Pull Request into main to put their Jira task number they were completing. Microsoft Azure account is to be set up for Sprint 4 development. 

Completion Status: Almost every task was completed. Calendar functionality was implemented into the different pages that were created for this Sprint. Dummy Data is currently being displayed for the pages with no connection to backend yet. All work that was to be completed with backend could not be completed due to issues with setting up MicroSoft Azure Account. Will be resolved by Sprint 4.

### Sprint 4
Sprint Start Date: 2023/11/13

Sprint End Date: *In Progress*

Goals for the Sprint: Finish work from Sprint 3 that was not completed namely setting up BackEnd with MicroSoft Azure. Development for creating Appointments with more fuctionality for the built in calendar feature.

Completion Status: *In Progress*

### Sprint 5
Sprint Start Date: 2024/01/21

Sprint End Date: 2024/02/04

Goals for the Sprint: Create a new and improved HomeScreen, Upcoming Appointment Screen, and LogIn Screen.

Completion Status: *Hasn't Started*

### Sprint 6
Sprint Start Date: 2024/02/04

Sprint End Date: 2024/02/18

Goals for the Sprint: Development the client and admin interaction with client screens. Create a client sign up screen, ClientInfo Screen (Admin Side), and Client Approval Screen (Admin). If there is time the ability to modify client info will be added as well the ability to reset password/email for an account or update email/login for an account.

Completion Status: *Hasn't Started*

### Sprint 7
Sprint Start Date: 2024/02/18

Sprint End Date: 2024/03/03

Goals for the Sprint: Complete the last tasks from Sprint 6 that may not have been started due to time or couldn't be completed. After previous Sprint tasks are done make an AboutMe page for Melissa Wright, FAQ page, and Services offered Screen.

Completion Status: *Hasn't Started*

### Sprint 8
Sprint Start Date: 2024/03/03

Sprint End Date: 2024/03/18

Goals for the Sprint: Complete any tasks leftover from Sprint 7 and after these are completed use whatever left over time to polish the program and fix any bugs we can.

Completion Status: *Hasn't Started*

