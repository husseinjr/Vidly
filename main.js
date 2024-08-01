const Joi = require('joi')
const express = require('express');
const app = express()

app.use(express.json());



let genras = [
    'Action',
    'Adventure',
    'Comedy', 
    'Fantasy', 
    'Horror', 
    'Musical', 
    'noir',
    'Romance', 
    'Science fiction',
    'Thriller', 
    'Western', 
    'Animated', 
    'Drama', 
    'Historical'
]

let films = [
    {genra: genras[0],name: "abc def",time: "1:12:15"},
    {genra: genras[1],name: "jore dfcv",time: "1:12:15"},
    {genra: genras[2],name: "na vaadfv ame",time: "1:12:15"},
    {genra: genras[3],name: "ve dfvsdfdsc",time: "1:12:15"},
    {genra: genras[4],name: "jaoirfij",time: "1:12:15"},
    {genra: genras[5],name: "dljfk",time: "1:12:15"},
    {genra: genras[1],name: "cwdv dsvsvd",time: "1:12:15"},
    {genra: genras[3],name: "dcscscs ddf",time: "1:12:15"},
    {genra: genras[7],name: "dwe sdfsf",time: "1:12:15"},
    {genra: genras[8],name: "dsfcsdfw wefwweasdd",time: "1:12:15"},
    {genra: genras[0],name: "dscfxz ",time: "1:12:15"},
    {genra: genras[8],name: "cwscc",time: "1:12:15"},
    {genra: genras[7],name: "dscswdc",time: "1:12:15"},
    {genra: genras[13],name: "yunbht",time: "1:12:15"},
    {genra: genras[8],name: "tgnwf",time: "1:12:15"},
    {genra: genras[7],name: "namsfvbe",time: "1:12:15"},
    {genra: genras[8],name: "sfgbdf",time: "1:12:15"},
    {genra: genras[7],name: "dfbw sfhw",time: "1:12:15"},
    {genra: genras[9],name: "dfg sfdge",time: "1:12:15"},
    {genra: genras[8],name: "aergqa srdf",time: "1:12:15"},
    {genra: genras[7],name: "afgead fwaer",time: "1:12:15"},
    {genra: genras[4],name: "rfgwar fr",time: "1:12:15"},
    {genra: genras[7],name: "qewrf dfae",time: "1:12:15"},
    {genra: genras[10],name: "erfads fdg",time: "1:12:15"},
    {genra: genras[7],name: "sergs dsfc",time: "1:12:15"},
    {genra: genras[7],name: "fdgacd",time: "1:12:15"},
    {genra: genras[11],name: "fgvafae",time: "1:12:15"},
    {genra: genras[12],name: "srfr sdfadf",time: "1:12:15"},
    {genra: genras[6],name: "dfagdd dfg",time: "1:12:15"},
    {genra: genras[7],name: "fdgqradf",time: "1:12:15"}
]





app.get('/api/genras', (req, res) => {
    res.status(202).send(genras)
});


app.get('/api/films', (req, res) => {
    let filmsName = [];
    for(let i = 0; i < films.length; i++){
        filmsName.push(films[i].name);
    }
    res.status(200).send(filmsName)
    
});


app.post('/api/add/genra', (req, res) => {
    const genraIsHere = findGenra(req.body.name)
    if(genraIsHere) {
        return res.status(409).send("This Genra already Exist")
    } else {
        const {error} = validateGenra(req.body.name)
        if(error) {
            res.status(400).send(error.details[0].message)
            return;
        } else {
            genras.push(req.body.name)
            res.status(201).send(`The Genra has been add successfuly`)
        }
    }
});


app.post('/api/add/film/:genra',(req, res) => {
    let genra = findGenra(req.params.genra);
    if(!genra) {
        res.status(404).send("this genra is not available")
        return;
    } else {
        const { error } = validateFilm(req.body);
        if(error) {
            res.status(400).send(error.details[0].message) 
            return;
        } else {
            const {name,time} = req.body
            const newFilm = {
                genra,
                name,
                time
            }
            films.push(newFilm)
            res.status(200).send(`The film "${newFilm.name}" has been add succesfuly `)
        }
        
    }

});


app.delete('/api/delete/genra/:genra', (req, res) => {
    let genraIsHere = findGenra(req.params.genra);
    if(!genraIsHere) {
        res.status(404).send(`This genre does not exist`)
        return;
    } else {
        const index = genras.indexOf(genraIsHere);
        genras.splice(index, 1)
        for(let i = 0; i < films.length; i++) {
            if(films[i].genra == genraIsHere) {
                films.splice(i, 1)
            }
        }
        res.status(200).send(`this genra is deleted successfuly and there films also`);
    }
});


app.delete('/api/delete/film',(req, res) => {
    // schema for req.body => genra && name
    const { error } = validateFilmDeletion(req.body);
    if ( error ) {
        res.status(404).send(error.details[0].message)
        return;
    } else {
        const genraIsHere = findGenra(req.body.genra);
        if(!genraIsHere) {
            res.status(404).send("this genra is not even exist")
            return;
        } else {
            // search for the film
            const filmIsHere = findFilmByName(req.body.name)
            if(filmIsHere) {
                // if exist delete it 
                const index = films.indexOf(filmIsHere);
                films.splice(index, 1)
                res.status(200).send(`The film ${req.body.name} has been deleted successfully`)
                return
            } else {
                // if not error message
                res.status(404).send(`this film ${req.body.name} is not even exist`)
                return;
            }
        }
    }
});








function findFilmByName(name) {
    return films.find( c => c.name === name)
}


function findGenra(gen) {
    return genras.find(c => {
        return c.toLowerCase() === gen.toLowerCase()
    })
}


function validateFilm (body) {
    const schema = Joi.object({
        name: Joi.string().min(3).required(),
        time: Joi.string().min(5).required()
    });
    return schema.validate(body);
}


function validateGenra (body) {
    const schema = Joi.object({
        name: Joi.string().min(3).required()
    });
    return schema.validate(body);
}


function validateFilmDeletion(body) {
    const schema = Joi.object({
        name: Joi.string().min(3).required(),
        genra: Joi.string().min(3).required()
    });
    return schema.validate(body);
}





const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`I am listening in port ${port}`)
});