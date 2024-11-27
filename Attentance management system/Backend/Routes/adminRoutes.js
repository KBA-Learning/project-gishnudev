import { json, response, Router } from "express";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { authenticate } from "../Middleware/auth.js";
import mongoose from 'mongoose';

const Route = Router()

const secretKey = process.env.secretKey;

//LeaveRequestSchema
const LeaveRequestSchema = new mongoose.Schema({
    employee_Id: { type: String, required: true },
    leaveType: { type: String, enum: ['sick', 'vacation', 'casual'], required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    reason: { type: String, required: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    requestDate: { type: Date, default: Date.now }
});

//userSchema
const userSchema = new mongoose.Schema(
    {
        Name: String,
        employeeId: { type: String, unique: true },
        department: String,
        Password: String,
        Role: String
    }
)

//attendanceSchema
const attendanceSchema = new mongoose.Schema({
    employee_Id: { type: String, required: true },
    date: { type: Date, required: true, default: Date.now },
    status: { type: String, enum: ['present', 'absent', 'leave'], default: 'present' },
    timestamp: { type: Date, default: Date.now } // Capture exact time of marking attendance
})

//create model for user
const user = mongoose.model('userDetails', userSchema)

//create model for leaveRequest
const leave = mongoose.model('leaveRequest', LeaveRequestSchema)

//create model for attentance
const attendance = mongoose.model('attendanceUpdate', attendanceSchema)

mongoose.connect('mongodb://localhost:27017/Attandance_Management')


Route.post('/signup', async (req, res) => {
    try {
        const { Name, employeeId, department, Password, Role } = req.body;

        // Validate request body
        if (!Name || !employeeId || !department || !Password || !Role) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check if user already exists
        const existingUser = await user.findOne({ employeeId: employeeId });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(Password, 10);

        // Create new user
        const newUser = new user({
            Name: Name,
            employeeId: employeeId,
            department: department,
            Password: hashedPassword,
            Role: Role
        });

        // Save the user in the database
        await newUser.save();

        res.status(200).json({ message: "User registered successfully" });
    } catch (error) {
        console.error("Signup Error:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
});


Route.post('/login', async (req, res) => {
    const data = req.body;
    const { Name, Password } = data;

    const result = await user.findOne({ Name: Name })
    console.log(result);

    if (result) {
        console.log(Password)
        const invalid = await bcrypt.compare(Password, result.Password);
        console.log(invalid);
        if (invalid) {

            const token = jwt.sign({ Name: Name, Role: result.Role }, secretKey, { expiresIn: "1h" })
            console.log(token)
            res.cookie('authToken', token, {
                httpOnly: true
            });
            res.status(200).json({ message: "Success",data:result })
        }
        else {
            res.status(403).json({ Message: "Password Is not Correct" })
        }

    }
    else {
        res.status(403).json({ message: "User is not exist" })
    }

})

Route.get('/logout', authenticate, (req, res) => {
    try {
        if (req.Role) {
            res.clearCookie('authToken');
            res.status(200).json({ message: "Logout successfull" });
        } else {
            res.status(404).json({ message: "No user found!" })
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" })
    }

});

Route.post('/leaveRequest', authenticate, async (req, res) => {
    try {
        console.log('leave request')
        console.log(req.Name)
        console.log(req.Role)
        const { employee_Id, leaveType, startDate, endDate, reason } = req.body;
        const existingUser = await user.findOne({ employeeId: employee_Id })

        if (!existingUser) {
            return res.status(400).json({ message: "Employee ID not found" });
        }

        if (req.Role == "employee") {
            if (existingUser) {
                const newLeaverequest = new leave({
                    employee_Id: employee_Id,
                    leaveType: leaveType,
                    startDate: startDate,
                    endDate: endDate,
                    reason: reason
                })
                await newLeaverequest.save();
                res.status(200).json({ message: "Leave Requested sucessfully" })
                console.log(newLeaverequest)
            }

        }
        else {
            res.status(400).json({ message: 'Employee id is not Correct' })
            console.log("Employee id is not Correct")
        }

    }
    catch (error) {
        res.status(500).json(error);
        console.log(error);

    }
})

Route.post('/markAttendance', authenticate, async (req, res) => {
    try {
        console.log('Marking attendance');
        console.log(req.Name);
        console.log(req.Role);

        const { employee_Id } = req.body
        const today = new Date();
        console.log("Current Date and Time:", today); // Outputs the full date and time
        today.setHours(0, 0, 0, 0); // Set time to midnight for date-only comparison

        const checkUser = await user.findOne({ employeeId: employee_Id })
        if (checkUser) {
            // Check if attendance has already been marked for today
            const existingAttendance = await attendance.findOne({ employee_Id: employee_Id })
            if (existingAttendance) {
                return res.status(400).json({ message: "Attendance already marked for today" });
            }

            // If not already marked, create a new attendance record
            const newAttendance = new attendance({
                employee_Id: employee_Id,
                date: today,
                status: 'present', // Default to 'present', could add more logic for other statuses if needed
                timestamp: new Date() // Mark the exact time of attendance
            });

            await newAttendance.save();
            res.status(200).json({ message: "Attendance marked successfully", attendance: newAttendance });
            console.log(newAttendance);
        }
        else {
            res.status(400).json({ message: "employee id not correct" })
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while marking attendance", error });
    }
});


Route.post('/addUser', authenticate, async (req, res) => {
    try {
        console.log('Hello')
        console.log(req.Name);
        console.log(req.Role);

        const { Name, employeeId, department, Password, Role } = req.body
        console.log(Name);

        if (req.Role == "admin") {
            const existingUser = await user.findOne({ employeeId: employeeId })


            if (existingUser) {
                res.status(400).json({ message: "User already exist" })
            }
            else {
                const newUser = new user({
                    Name: Name,
                    employeeId: employeeId,
                    department: department,
                    Password: Password,
                    Role: Role
                });
                await newUser.save()
                res.status(200).json({ message: "User added successfully" })

            }
        }
        else {
            res.status(400).json({ message: 'User Is Not Admin' })
            console.log("User Is Not Admin")

        }


    } catch (error) {
        res.status(500).json(error);

    }

})

Route.patch('/updateUser', authenticate, async (req, res) => {
    try {
        console.log('Hello');
        console.log(req.Name);
        console.log(req.Role);

        const { Name, employeeId, department, Password, Role } = req.body;

        if (req.Role === "admin") {
            // Update user document with the given employeeId
            const result = await user.findOneAndUpdate(
                { employeeId: employeeId },
                {
                    $set: {
                        Name: Name,
                        department: department,
                        Password: Password,
                        Role: Role
                    }
                },
                { new: true } // return the updated document
            );

            if (!result) {
                // If no document was found with the given employeeId
                return res.status(400).json({ message: "User not found" });
            }

            res.status(200).json({ message: "User updated successfully", updatedUser: result });
        } else {
            res.status(400).json({ message: "Unauthorized Access" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred. Please check the user details.", error });
    }
});

Route.delete('/deleteUser/:cid', authenticate, async (req, res) => {
    const employeeId = req.params.cid
    try {
        const result = await user.findOneAndDelete({ employeeId: employeeId })
        if (result) {
            res.status(200).json("employ deleted")
        }
        else {
            res.status(400).json("employ is not found")
        }
    }
    catch (error) {
        res.status(500).json({ message: "An error occurred. Please check the user details.", error });
    }
})

Route.get('/searchUser/:search', async (req, res) => {

    try {

        const search = req.params.search;

        const result = await user.findOne({ employeeId: search })
        if (result) {
            res.status(200).json({ data: result })
        } else {
            res.status(404).json({ message: "user not found" })
        }

    } catch (err) {
        console.log(err);

    }
});


Route.get('/viewUser', authenticate, (req, res) => {
    const user = req.Role
    if (user) {
        res.json(user)
    } else {
        res.status(404).json({ message: "data not found" })
    }
})

Route.get('/viewAll', authenticate, async (req, res) => {
    try {
        const allUsers = await user.find({ Role: 'employee' });
        if (allUsers.length > 0) {
            res.status(200).json(allUsers);
        } else {
            res.status(404).json({ message: 'No employees found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
});

Route.get('/viewAllLeave', authenticate, async (req, res) => {
    try {
        const allLeave = await leave.find();
        if (allLeave.length > 0) {
            res.status(200).json(allLeave);
        } else {
            res.status(404).json({ message: 'No employees found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
});

Route.get('/adminName',async(req,res)=>{
    try{
        const adminName = await user.find({Role:'admin'})
        if (adminName) {
            res.status(200).json({ data: adminName })
        } else {
            res.status(404).json({ message: "user not found" })
        }
    }
    catch{
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
})

export { Route };