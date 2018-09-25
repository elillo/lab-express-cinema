require('dotenv').config();

const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const express      = require('express');
const favicon      = require('serve-favicon');
const hbs          = require('hbs');
const mongoose     = require('mongoose');
const logger       = require('morgan');
const path         = require('path');
const Movie = require('./models/Movie');

mongoose
// .connect(`mongodb://localhost/${dbName}`)
 .connect('mongodb://localhost/lab-express-cinema', {useNewUrlParser: true})
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });

  

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// configuraciones del motor de plantillas

app.use(require('node-sass-middleware')({
  src:  path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));
  


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));



// titulo por defecto de la app
app.locals.title = 'Cinema IronHack';


//declaro index y le paso la ruta en la que se aloja para especificarle en l midelware que cuando se pida 
// la dir / (la principal) se muestre la index variable que es dicha ruta.
const index = require('./routes/index');
app.use('/', index);

//con app get decimos,si tomas esta ruta('/movies'),
app.get('/movies', (req, res, next) => {
//busca todo ({} porque va a buscar dentro de un objeto)lo que este en ese esquema que vienen siendo los valores de las colecciones que coincidan 
//con los apartados del esquema.Es como decir que busque en el objeto.
  Movie.find({})
     .then(movies => { //luego(then)haces
       res.render('movies', {movies}); //el renderizado de la vista movies con el contenido {movies}
     })
     .catch(err => {
       console.log('Something went wrong', err); // y si no se puede me capturas el error
     }) 
 });
 
 app.get('/movies/:id', (req, res, next) => { // si pides la ruta  que hemos asociado al boton por id en la vista anteriormente, 
   Movie.findById({_id : req.params.id})// buscame por id y aclaramos que la request se va a hacer sobre el parametro id
      .then(movies => {//pues de movies,que incluye todas nuestras colecciones
        res.render('movie', {movies}); //me renderizas la vista movie que corresponda con el id asociado al enlace sobre el que se haga click
      })
      .catch(err => {
        console.log('Something went wrong', err);
      })
  });
 

module.exports = app;
