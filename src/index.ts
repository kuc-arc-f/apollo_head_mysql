const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
import LibTask from './lib/LibTask'
import LibUser from './lib/LibUser'
import LibNote from './lib/LibNote'
import LibContent from './lib/LibContent'
//LibContent
import scheme from './scheme'
//
const typeDefs = scheme.getTypeDefs();
/* resolvers */
const resolvers = {
  Query: {
    hello: () => 'Hello world-11',
    /* content */
    content: async (parent: any, args: any, context: any, info: any) => {
      return await LibContent.get_item(args.id);
    },    
    contents: async (parent: any, args: any, context: any, info: any) => {
      return await LibContent.get_items(args);
    },
    contents_uid: async(parent: any, args: any, context: any, info: any) => {
      return await LibContent.getItemsUid(args);
    },  
    content_count: async (parent: any, args: any, context: any, info: any) => {
      return await LibContent.get_count(args);
    },      
  },
  Mutation: {
    addContent: async (parent: any, args: any, context: any) => {
      const ret = await LibContent.add_item(args)
      return ret
    },
    updateContent: async (parent: any, args: any, context: any) => {
      const ret = await LibContent.update_item(args)
      return ret
    },
    deleteContent: async (parent: any, args: any, context: any) => {
      const ret = await LibContent.delete_item(args)
      return ret
    },            
  }
};
/* serever-Start */
const server = new ApolloServer({ typeDefs, resolvers });
const app = express();
server.applyMiddleware({ app });
// ENV
//console.log(app.get('env'));
app.listen({ port: 4000 }, () => {
    console.log(`Server ready at http://localhost:4000${server.graphqlPath}`);
});
