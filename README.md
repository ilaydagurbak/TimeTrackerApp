
## How To Run
The project has 2 separated parts. Front-end, developed using React and the back-end, developed using Symfony. I have stored a database SQL file for mySql. You can find it on the database folder in the project. Follow below steps to run the project on your local machine:
   1.Update the back-end/.env file to be able to connect your data base and run the back-end project using Symfony instructions. the back-end part had no interfaces.
   You can follow the following commands :
   - cd into back-end 
   - composer install
   - cd into public 
   - php -S 127.0.0.1:800
   2.You have to update the front-end Apis destination domain now. Open the front-end/src/index.js and update the domain property of the App component.
   Run the front-end project by following React instruction.
   - cd into frontend
   - yarn build 
   - yarn start

   In total I spent approcimately 5-6 hours. I had to get familiar with Symfony, which I never worked with before. There can be more improvement in front-end and refactoring in all project. 
   
