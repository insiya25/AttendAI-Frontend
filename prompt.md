A Attendance management project which is for both teachers and students

they can login (role based - student or teacher)

Now in the college, we are given a physical sheet which has a table below that have column = Roll no, Name, Date, signatures  where each student has to sign in the "Name" column, and then the teacher need to enter each data one by one to ms Excel which is alot of labour work.

What i want is, when Teacher logs in, they can simply take a photo of the sheet and simply uploads the photos of sheet(image file of the sheet - could be multiple photo as obviously all the student names wont fit in one single page so need to take photo of each page in the sheet) and our AI (OCR) should be smart enough to extract all the roll no, names, and date accordingly. with a new column "presentiee" or sommething that stores:

If signature is present than it means the student was present, so put present in the new column, if the signature is missing or it says "A" then it means the student was absent so put absent in the new column, save everything to database

thats all.

and teacher should be able to create their own profile during login where they mention their photo, name, age, what subject do they teach (dropdown of all predefined subjects), etc

and a student when login they must create their profile with their name, photo, age, class, roll number, and can select all the subjects in their syllabus (display all predefined subjects where they can select from).

all the students would be assigned automatically to whoever teaching the subject, so when a teacher login they can see list of all the students in their subject, when the teacher click on any of the students the teacher can see 

and when students login they can see all their subjects, whos teaching it, and also a seperate dashboard for student where they can see charts of analytics of each subject such as  their percentage of presentee and absentee ratio of each subject, or bar charts where we display top subject they are present in or top where they are absent in, etc

all these data are taken and calculated,aggregated from the attendace table which is filled by our OCR (where teacher uploads photo of sheet and it automatically detects and fill the table with the data from the sheet images).

for now, thats all.

So give me the plan on how i would create this project, what stacks should i use (im thinking django + react with vite and typescript and tailwindcss) and for the AI or OCR model use some best free model for detection already available in the internet for extractions of info from image.
so give me all the database schemas i would need (mysql) and help me create all the FOLDER/FILE structure for frontend and django





about:


- student can login 
- teacher can login
- student can check their dashboard of their performance, their attendance percentage, all the subject they attendanded and absent in real time dashboard
- they can create their profile, add their each semesters grades and see them in a beaitiful chart, they can add each of their project for each semester with link so teacher can see at one place, they can add all the skills they know and take an AI power test which verifies each skills
- they can send email and applications of leave, holidays, sick and others to the teacher using AI powered
- teacher can lgoin, accept or reject approvals
- teachers can view a dashboard of all the subject they teach, see all the students in the subject, see the absentee and presentee of each subject, view each student details and performance on attendance, projects, exams, and others. can contact them, can add student or remove in a particular subject
- teachers can use AI powered OCR to simply take and upload the attendnace sheet photo and our AI power OCR will intelligently detect and write everything down in the database and show it in the beautiful dashboard, etc
- teachers can configure their profile as well.