
export const GQL_MUTATION = `
type Mutation {
  addContent(apikey: String!, content_name: String, values: String!
    user_id: Int): Content
  updateContent(apikey: String!, id: Int!, content_name: String, values: String!
    ): Content 
  deleteContent(apikey: String! , id: Int!): Content 
}
`;
