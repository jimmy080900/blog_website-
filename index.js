import express from 'express';
import bodyParser from 'body-parser';

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'))

let content = ""
let contentTitle = ""
let isOpen = false
let contentArr = [];
let title = []
app.get('/', (req, res) => {
    isOpen = false
    res.render("index.ejs",
        {
            content: "",
            isOpen: isOpen,
            arr: contentArr,
            titleContent: contentTitle,
            titleArr: title || []
        }
    )
})
app.get('/previous', (req, res) => {
    res.render("previous.ejs", {
        titleArr : title,
        contentArr : contentArr
    })
})

app.get('/contact', (req, res) => {
    res.render("contact.ejs")
})
app.get('/:title', (req, res) => {
    const titleRequest = decodeURIComponent(req.params.title).trim().toLowerCase();  
    const index = title.findIndex(t => t.trim().toLowerCase() === titleRequest);
    
    if (index !== -1) {
        res.render("post.ejs", { title: title[index], content: contentArr[index] });
    } else {
        res.status(404).send("Post not found");
    }
})

app.post("/edit", (req, res) => {
    const originalTitle = decodeURIComponent(req.body.originalTitle).trim().toLowerCase();
    const newTitle = req.body.contentTitle ? req.body.contentTitle.trim() : "";
    const newContent = req.body.content ? req.body.content.trim() : "";

    const index = title.findIndex(t => t.trim().toLowerCase() === originalTitle);

    if (index !== -1) {
        title[index] = newTitle;
        contentArr[index] = newContent;
        console.log("Updated post:", newTitle); 
    } else {
        console.log("Post not found for edit:", originalTitle); 
    }

    res.redirect("/");
});


app.post('/delete', (req, res) => {
    const titleToDelete = req.body.deleteTitle.trim().toLowerCase();
    const index = title.findIndex(t => t.trim().toLowerCase() === titleToDelete);

    if (index !== -1) {
        title.splice(index, 1);
        contentArr.splice(index, 1);
    }

    res.redirect("/");
})



app.post('/submit', (req, res) => {
    content =  req.body.content ? req.body.content.trim() : ""
    contentTitle = req.body.contentTitle ? req.body.contentTitle.trim() : ""
    if (content && contentTitle) {
        contentArr.push(content)
        title.push(contentTitle)
    }
    isOpen = true
    res.render('index.ejs',
        {
            content: content,
            isOpen: isOpen,
            arr: contentArr,
            titleContent: contentTitle,
            titleArr: title
        }
    ) 
  
}) 

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
