const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcrypt');

interface IArgs {
  name: string,
  email: string,
  password: string,
}
//
const LibUser = {
  addUser :async function(args: IArgs){
    try {
      let hashed_password = bcrypt.hashSync(args.password, 10);
//console.log( hashed_password)            
      const prisma = new PrismaClient()
      const result = await prisma.user.create({
        data: {
          name: args.name,
          email: args.email,
          password: hashed_password,
        }
      }) 
      await prisma.$disconnect()
// console.log( item)            
      return result
    } catch (err) {
      throw new Error('Error , addUser');
    }          
  },
  getUser :async function(id: number){
    try {
      const prisma = new PrismaClient()
      const item = await prisma.user.findUnique({
        where: { id: Number(id) },
      });     
//console.log( item)       
      await prisma.$disconnect();
      return item;
    } catch (err) {
      throw new Error('Error , getUser');
    }          
  }, 
  validUser :async function(args: IArgs){
    try {
      let user = null;
//console.log(args);
      const prisma = new PrismaClient()
      const item = await prisma.user.findUnique({
        where: { email: args.email },
      }); 
      await prisma.$disconnect();
      if(item !== null){
        if (args.email === item.email
          && bcrypt.compareSync(args.password,  item.password )){
            user = item;
        }
      } 
//console.log( item)       
      return user;
    } catch (err) {
      throw new Error('Error , getUser');
    }          
  }, 

}
export default LibUser;
