const { PrismaClient } = require('@prisma/client')

interface INoteTag {
  noteId: number,
  name: string,
}
interface ICategory {
  noteId: number,
  name: string,
}
interface IArgs {
  id: number,
  title: string,
  content: string,
}
//
const LibNote = {
  getItems :async function(){
    try {
      const prisma = new PrismaClient()
      const items = await prisma.note.findMany({
        include: { noteTag: true , category: true},
      });
      await prisma.$disconnect() 
//console.log(items);
      return items;
    } catch (err) {
      throw new Error('Error , getItems');
    }          
  },   
  getItem :async function(id: number){
    try {
      const prisma = new PrismaClient()
      const item = await prisma.note.findUnique({
        where: { id: Number(id) },
        include: { noteTag: true, category: true },
      });   
      await prisma.$disconnect();
//console.log(item)       
      return item;
    } catch (err) {
      throw new Error('Error , getItem');
    }          
  },
  addItem :async function(args: IArgs){
    try {
      const prisma = new PrismaClient()
      const result = await prisma.note.create({
        data: {
          title: args.title,
          content: args.content,
          userId: 0
        }
      }) 
      await prisma.$disconnect()
// console.log( item)            
      return result
    } catch (err) {
      throw new Error('Error , addItem');
    }          
  },
  noteTagAdd :async function(args: INoteTag){
    try {
      const prisma = new PrismaClient()
      const result = await prisma.noteTag.create({
        data: {
          noteId: args.noteId,
          name: args.name,
        }
      }) 
      await prisma.$disconnect()
// console.log( item)            
      return result
    } catch (err) {
      throw new Error('Error , noteTagAdd');
    }          
  },
  categoryAdd :async function(args: ICategory){
    try {
      await this.categoryDelete(args.noteId);
      const prisma = new PrismaClient()
      const result = await prisma.category.create({
        data: {
          noteId: args.noteId,
          name: args.name,
        }
      }) 
      await prisma.$disconnect()
// console.log( item)            
      return result
    } catch (err) {
      throw new Error('Error , categoryAdd');
    }          
  },
  categoryDelete :async function(noteId: number){
    try {
      const prisma = new PrismaClient()   
      const result = await prisma.category.deleteMany({
        where: { noteId: Number(noteId) },
      })  
      await prisma.$disconnect()
//console.log(result);            
      return result
    } catch (err) {
      throw new Error('Error , categoryDelete');
    }          
  },  
  noteUpdate :async function(args: IArgs){
    try {
// console.log( item)    
      const prisma = new PrismaClient()   
      const result = await prisma.note.update({
        where: { id: args.id},
        data: {
          title: args.title, 
          content: args.content, 
        },
      })           
      await prisma.$disconnect()
      await this.noteDeleteMany(args.id)
      return result
    } catch (err) {
      throw new Error('Error , noteUpdate');
    }          
  },
  noteDeleteMany :async function(id: number){
    try {
      const prisma = new PrismaClient()  
      const tags = await prisma.noteTag.findMany({
        where: { noteId: Number(id) },
      });   
      for (const item of tags) {
        const result = await prisma.noteTag.delete({
          where: { id: item.id },
        })  
      }  
      await prisma.$disconnect()
//console.log(items);            
      return ""
    } catch (err) {
      throw new Error('Error , noteDeleteMany');
    }          
  },  
  noteDelete :async function(args: IArgs){
    try {
      const prisma = new PrismaClient()   
      const result = await prisma.note.delete({
        where: { id: Number(args.id) },
      })  
      await prisma.$disconnect()
//console.log(result);            
      return result
    } catch (err) {
      throw new Error('Error , noteDelete');
    }          
  },  
}
export default LibNote;

