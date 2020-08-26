const { ApolloServer, gql } = require('apollo-server');
const mongoose = require('mongoose');

const Todo = require('./models/todos.js');



let mongodburi = process.env.MONGODB_URI || 'mongodb://localhost:27017/graphql-todo'
mongoose.connect(mongodburi, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
    .then(res => console.log("Database connected..."))
    .catch(error => console.log(err));


// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = gql`
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "Book" type defines the queryable fields for every book in our data source.
  
  type todo {
      id:ID
      todo: String!
      date: String
  }
  
  input toDo{
      todo: String!
      date: String
  }
  
  
 

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
   
    todos:[todo]
  }
  type Mutation{
     
      addTodo(input:toDo):[todo]
      delTodo(id:ID!):String
      updateTodo(id:ID!,input:toDo):todo
  }
`;


const resolvers = {
    Query: {

        async todos() {
            let result = await Todo.find().lean().exec();
            result = result.map(el => {

                el.date = new Date(el.date).toString();
                el.id = el._id;

                return el
            })
            return result;
        }
    },
    todo(parent, args) {
        date: () => args.date.toString()
    },
    Mutation: {


        addTodo: async (parent, args) => {
            const newtodo = new Todo(args.input)
            await newtodo.save();
            return Todo.find();
        },
        delTodo: async (parent, args) => {
            const result = await Todo.deleteOne({ _id: args.id });

            return "deleted successfully"
        },
        updateTodo: async (parent, args) => {
            const result = await Todo.findByIdAndUpdate(args.id, args.input, { new: true }).lean();

            return result;
        }
    }
};

const server = new ApolloServer({ typeDefs, resolvers });

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
});