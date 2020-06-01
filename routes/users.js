const express = require('express')
const router = express.Router()
const passport = require('passport')
const Student = require('../models/student')
const Teacher = require('../models/teachers')
const User = require('../models/user')

//Display All Students
router.get('/',(req,res)=> {
    res.redirect('/login');
});
router.get('/students',async (req,res) => {
    let student;
    try{
        student = await Student.find({"role":"Student"})
        res.status(201).send(student);
    } catch(err){
        res.status(400).json({message: err.message})
    }
    
});

router.get('/dashboard',authenticate, (req,res) => {
    let student
    console.log(req.user)
    if(req.user[0].role==='Student')
    {
     Student.find({"id":req.user[0].id},(err,student) =>{
        if(err)
            console.log(err.message);
        res.render('dashboard',{data:student[0]});    
      });
    }
    else if(req.user[0].role==='Teacher'){
        Teacher.find({"id":req.user[0].id},(err,teacher) =>{
            if(err)
                console.log(err.message);
            res.render('teacherdash',{data:teacher[0]});    
          });
    }
});


//Displaying All Teachers

router.get('/teachers',async (req,res) => {
    let teacher;
    try{
        teacher = await Teacher.find({"role":"Teacher"})
        res.status(201).json(teacher)
    } catch(err){
        res.status(400).json({message: err.message})
    }
});

//Adding A Student 
router.post('/add/students',async (req,res) => {
    const student = new Student({
        role: "Student",
        name: req.body.name,
        dob: req.body.dob,
        password: req.body.password,
        id: req.body.id,
        branch: req.body.branch,
        semester: req.body.semester,
        subjects:req.body.subjects
    })
    const user = new User({
        role:"Student",
        id:req.body.id,
        password:req.body.password
    })
    try{
        const newStudent = await student.save()
        const newUser = await user.save()
        res.status(201).json(newUser)
    } catch(err){
        res.status(400).json({message: err.message})
    }
});

router.post('/add/teachers',async (req,res) => {
    const teacher = new Teacher({
        role: "Teacher",
        name: req.body.name,
        password: req.body.password,
        department: req.body.department,
        id: req.body.id,
        subjects:req.body.subjects
    })
    const user = new User({
        role:"Teacher",
        id:req.body.id,
        password:req.body.password
    })
    try{
        const newTeacher = await teacher.save()
        const newUser = await user.save()
        res.status(201).json(newUser)
    } catch(err){
        res.status(400).json({message: err.message})
    }
});


//Displaying Students enrolled in a subject
router.get('/students/:id',async (req,res) =>{
    let student;

    try{
        student = await Student.find({"subjects.id":req.params.id});
        res.status(201).json(student);
    }catch(err)
    {
        res.status(500).json({message: err.message});
    }
});

// Login

router.get('/login',(req,res) => {
    res.render('login');
});

router.post('/login', (req, res, next) => {
    //console.log(req.body.password);
    passport.authenticate('local', {
      successRedirect: '/dashboard',
      failureRedirect: '/login',
      failureFlash: true
    })(req, res, next);
  });

  router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/login');
  });


  //Display Marks of a Student
router.get('/marks',authenticate, async (req,res) =>{
    let student = await Student.find({"id":req.user[0].id},{"name":1,"subjects":1})
    

    res.render('view_marks_stud',{student:student[0]});
});

router.get('/attendance',authenticate, async (req,res) =>{
    let student = await Student.find({"id":req.user[0].id},{"name":1,"subjects":1})
    

    res.render('view_attendance_stud',{student:student[0]});
});



// Uploading Marks of a Student for a particular subject
router.get('/subjects/marks/:id',teach,async(req,res) => {
    let student;
    try{
        student = await Student.find({"subjects.id":req.params.id},{"id":1,"subjects":1}).sort({id:1});
        res.render('uploadmarks',{student:student,id:req.params.id});
    }catch(err)
    {
        res.status(401).json({message:err.message})
    }
})

router.get('/subjects',teach, async (req,res) =>{
    let teacher = await Teacher.find({"id":req.user[0].id},{subjects:1})
    res.render('subject_marks',{teacher:teacher});
});

router.get('/subject',teach, async (req,res) =>{
    let teacher = await Teacher.find({"id":req.user[0].id},{subjects:1})
    res.render('subject_attendance',{teacher:teacher});
});

router.get('/feeds',teach,async (req,res) =>{
    let teacher = await Teacher.find({"id":req.user[0].id},{subjects:1})
    res.render('subject_feedback',{teacher:teacher});
})
//Uploading Marks of a Particular Subject

router.post('/subjects/marks/:id',teach,async (req,res) => {
    let students = await Student.find({"subjects.id":req.params.id}).sort({id:1});
    for(let key in students)
    {
        for(let fg in students[key].subjects)
        {
            await Student.updateOne({"id":students[key].id,"subjects.id":req.params.id},{"subjects.$.assignment":req.body.marks[0].assign[key],
            "subjects.$.midsem":req.body.marks[0].mid[key],
            "subjects.$.endsem":req.body.marks[0].end[key]});
        }
    }
    res.redirect('/dashboard')
});

//Uploading Attendance Can be 
//easily modified to upload Marks



router.get('/attendance/:id',async (req,res) => {
    let student = await Student.find({"subjects.id":req.params.id},{id:1,subjects:1}).sort({id:1});
    res.render('attendance',{student:student,id:req.params.id});

});

router.get('/upload/attendance/:id',teach,async (req,res) => {
    let student = await Student.find({"subjects.id":req.params.id},{id:1,subjects:1}).sort({id:1});
    res.render('uploadattend',{student:student,id:req.params.id})
})

router.post('/upload/attendance/:id2',teach,async (req,res) =>{
    let da = req.body.date;
    await Student.updateMany({"subjects.id":req.params.id2},{$push: {"subjects.$.attendance.total": da}})
    for(let item in req.body)
    {
        console.log(da);
    Student.updateOne({"id":item, "subjects.id":req.params.id2},
    {$push: {"subjects.$.attendance.present":da}}, (err) =>{
        if(err)
        console.log(err.message)
        else
        console.log("updated")
    } )

    }
    res.redirect('/dashboard')
});

//Deleting a Student

router.delete('/students/:id',async (req,res) =>{
    let student
    try{
        student = await Student.deleteOne({"id":req.params.id})
        await User.deleteOne({"id":req.params.id});
        return res.status(201).json({message: "deleted..."})
    } catch(err){
     return res.status(500).json({message: err.message}) 
    }
})

//Deleting a Teacher

router.delete('/teachers/:id',async (req,res) =>{
    let student
    try{
        student = await Teacher.deleteOne({"id":req.params.id})
        await User.deleteOne({"id":req.params.id});
        return res.status(201).json({message: "deleted..."})
    } catch(err){
     return res.status(500).json({message: err.message}) 
    }
})
//Posting Feedback on a subject

router.post('/feedback',authenticate,async (req,res)=>{
    let feed = req.body.feedback;
    let sub = req.body.subject;
    console.log(sub);
    try{
       await Teacher.updateOne({"subjects.id":sub},
       {$push: {"subjects.$.feedbacks":feed}});
       res.status(201).json({message:"feedback posted..."})
    }catch(err)
    {
        res.status(500).json({message:"err.message"});
    }
});

router.get('/feedback',authenticate,async (req,res)=>{
    let stud = req.user[0].id;
    try{
      let student = await Student.find({"id":stud},{subjects:1})
      res.render('feedback_student.ejs',{student:student})
    }catch(err)
    {
        res.status(500).json({message:"err.message"});
    }
});

router.get('/view/feedback/:id',teach,async (req,res) => {
        let sub = req.params.id;
        let id = req.user[0].id;
        try{
            let feeds = await Teacher.find({"id":id},{subjects:1})
            res.render('feedback_teacher',{feeds:feeds,id:req.params.id})
        }
        catch(err){
            res.status(401).json({message:"Error occured"})
        }
})

async function getStudent(req,res,next) {
    let student
    try{
        student = await Student.findById(req.params.id)
        if(student === null)
        {
            return res.status(404).json({message: "Student Not Found"})
        }
    } catch(err) {
        return res.status(500).json({message: err.message})
    }
    res.student = student
    next()
}

function authenticate(req,res,next){
    if(!req.user)
    {
        return res.render('accessdenied');
    }
    next();
}

function teach(req,res,next){
    if(!req.user)
    {
        return res.status(401).json({message:"Access Denied..."});
    }
    if(req.user[0].role!=='Teacher')
    {
        return res.status(401).json({message:"Access ..."});
    }
    next();
}


module.exports = router