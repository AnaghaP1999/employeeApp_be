// Task1: initiate app and run server at 3000
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const app = new express();
const path=require('path');
app.use(express.static(path.join(__dirname+'/dist/FrontEnd')));
require('dotenv').config();
app.use(morgan('dev'));
const PORT = process.env.PORT;

// Task2: create mongoDB connection 
const mongoose = require('mongoose');
mongoose.connect(process.env.mongodb_url)
.then(()=>{
    console.log('Connected to my local db');
})
.catch(()=>{
    console.log('Error !!! Connection not');
})
app.use(bodyParser.json());

//Task 2 : write api with error handling and appropriate api mentioned in the TODO below

const employeeSchema = new mongoose.Schema({  
    name: String,
    position: String,
    location: String,
    salary: Number
  });
  const Employee = mongoose.model('employee', employeeSchema, 'employees');


//TODO: get data from db  using api '/api/employeelist'

app.get('/api/employeelist', (req, res) => {
    Employee.find()
      .then((employees) => {
        res.json(employees);
      })
      .catch((error) => {
        console.error('Error retrieving employees:', error);
        res.status(500).send('Error retrieving employees');
      });
  });


//TODO: get single data from db  using api '/api/employeelist/:id'

app.get('/api/employeelist/:id', (req, res) => {
    const employeeId = req.params.id;
    Employee.findById(employeeId)
      .then((employee) => {
        if (!employee) {
          return res.status(404).json({ error: 'Employee not found' });
        }
        res.json(employee);
      })
      .catch((error) => {
        console.error('Error retrieving employee:', error);
        res.status(500).send('Error retrieving employee');
      });
  });


//TODO: send data from db using api '/api/employeelist'
//Request body format:{name:'',location:'',position:'',salary:''}

app.post('/api/employeelist', (req, res) => {
    const { name, location, position, salary } = req.body;
  
    const employee = new Employee({
      name,
      location,
      position,
      salary
    });

    employee.save()
      .then((savedEmployee) => {
        res.json(savedEmployee);
      })
      .catch((error) => {
        console.error('Error saving employee:', error);
        res.status(500).send('Error saving employee');
      });
  });
  


//TODO: delete a employee data from db by using api '/api/employeelist/:id'

app.delete('/api/employeelist/:id', (req, res) => {
    const employeeId = req.params.id;

    Employee.findByIdAndRemove(employeeId)
      .then((deletedEmployee) => {
        if (!deletedEmployee) {
          return res.status(404).json({ error: 'Employee not found' });
        }
        res.json({ message: 'Employee deleted successfully' });
      })
      .catch((error) => {
        console.error('Error deleting employee:', error);
        res.status(500).send('Error deleting employee');
      });
  });



//TODO: Update  a employee data from db by using api '/api/employeelist'
//Request body format:{name:'',location:'',position:'',salary:''}
app.put('/api/employeelist/:id', (req, res) => {
    const employeeId = req.params.id;
    const { name, location, position, salary } = req.body;
  
    Employee.findByIdAndUpdate(employeeId, {
      name,
      location,
      position,
      salary
    }, { new: true })
      .then((updatedEmployee) => {
        if (!updatedEmployee) {
          return res.status(404).json({ error: 'Employee not found' });
        }
        res.json(updatedEmployee);
      })
      .catch((error) => {
        console.error('Error updating employee:', error);
        res.status(500).send('Error updating employee');
      });
  });

//! dont delete this code. it connects the front end file.
app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname + '/dist/Frontend/index.html'));
});



app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`);

});