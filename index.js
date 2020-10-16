var SERVER_NAME = 'product-api'
var PORT = 3009;
var HOST = '127.0.0.1';
var GET=0;
var POST=0;


var restify = require('restify')

  // Get a persistence engine for products
  , productsSave = require('save')('products')
  // Create the restify server
  , server = restify.createServer({ name: SERVER_NAME})

  server.listen(PORT, HOST, function () {
  console.log('Server %s listening at %s', server.name, server.url)
  console.log('Endpoints: %s/products     Methods: GET, POST', server.url)
})

server
  // Allow the use of POST
  .use(restify.fullResponse())
  // Maps req.body to req.params so there is no switching between them
  .use(restify.bodyParser())

// Get all users in the system
server.get('/products', function (req, res, next) {
  console.log("---------->products GET: received request<----------")
  productsSave.find({}, function (error, products) 
  {
    res.send(products)
    GET++
    console.log("---------->products GET: sending response<----------")
    console.log("--->GET counter :"+GET)
    console.log("--->POST counter :"+POST)
  })
})

// Create a new user
server.post('/products', function (req, res, next) {

  // Make sure name is defined
  if (req.params.name === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new restify.InvalidArgumentError('name must be entered'))
  }
  if (req.params.quantity === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new restify.InvalidArgumentError('quantity must be specified'))
  }
  var newProduct = {
		name: req.params.name, 
    quantity: req.params.quantity,
    category: req.params.category
	}

  // Create the Product using the persistence engine
  console.log("---------->products POST: creating entry in memory <----------")
  productsSave.create( newProduct, function (error, product) 
  {

    if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))
    res.send(201, product)
    
    POST++
    console.log("---------->products POST: entry created <----------")
    console.log("--->GET counter :"+GET)
    console.log("--->POST counter :"+POST)
  })
})

// Delete all products
server.del('/products', function (req, res, next) {
  
  // Delete the product with the persistence engine
  console.log("---------->DELETING ALL ENTRIES<----------")
  productsSave.delete({}, function (error, product) 
  {
    //DELETING ALL ENTRIES
    if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))
    res.send()
    console.log("---------->ENTRIES DELETED<----------")
  })
})