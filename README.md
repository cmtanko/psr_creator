# PSR Generator
(AngularJS1.6 , Webpack , ES6)

Mostly every organization keeps track of the project as daily report or weekly or monthly. Most uses Jira for project management and github for version control. So this psrgenerator generates

**Daily Report** based on that day's commits from git. It will also show the task state completed/InProgress and total time required to do that task and total hours spent on that day
  ** Prerequisite: **
(User should smart commit)
git commit -m "ISSUE-NO -m ISSUE-MESSAGE -t ISSUE_HOURS -s ISSUE_STATE"
eg. git commit -m "PSRG-003 -m Added cronjob npm package -t 1 hr -s In Progress"
    git commit -m "PSRG-003 -m Completed cronjob task -t 2hrs 30m -s Completed"

**Weekly/Montly Report** based on JIRA state. If the state is on 'selected for development' it is marked as 'To Do', 'in progress' = 'in progress' and 'ready for testing' = 'Completed'

## APIs
https://psrgenerator.herokuapp.com/api

## To work or contribute in the project

#### 1. Clone this repo in your server.

```sh
git clone https://github.com/cmtanko/psr_creator
```

#### 2. Install the dependencies

```sh
npm install
```

#### 3. Start the server

```sh
npm run dev
```

### Contribution

Feel free to fork this project. Do send a pull request our way if you implement
something the world should see.

