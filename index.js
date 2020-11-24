const { ApolloServer, gql } = require('apollo-server');
const { RESTDataSource } = require('apollo-datasource-rest');

class BranchesAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = 'http://localhost:8080/';
  }

  async getBranch(id) {
	return this.get(`/${id}`);
  }
  
  async getBranches() {
	return this.get('/');
  }
}


const typeDefs = gql`

  type Branch {
    id: ID!
    name: String!
    lon: Float!
    lat: Float!
    distance: Int
  }

  type Query {
    branch(id: ID!): Branch
    branches: [Branch]
  }
  
`;


const resolvers = {
 Query: {
    branch: async (_source, { id }, { dataSources }) => {
      return dataSources.branchesAPI.getBranch(id);
    },
    branches: async (_source, _args, { dataSources }) => {
      return dataSources.branchesAPI.getBranches();
    },
 },
};


const server = new ApolloServer({ 
	typeDefs, 
	resolvers, 
	dataSources: () => {
    return {
        branchesAPI: new BranchesAPI()
      };
    },
    tracing: false,
});

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
	console.log(`🚀  Server ready at ${url}`);
});