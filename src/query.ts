
export const GQL_QUERY = `
  type Query {
    hello: String
    contents(apikey: String, content_name: String): [Content]
    contents_uid(site_id: String, content_name: String, user_id: String
    ): [Content]
    content(id: Int): Content
    content_count(apikey: String, content_name: String): Int
    users: [User]
    user(mail: String, password: String): User
  }
`;