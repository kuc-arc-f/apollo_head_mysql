const { PrismaClient } = require('@prisma/client');

//import LibCommon from "../lib/LibCommon"
import LibApiFind from "./LibApiFind"
import LibApiCreate from "./LibApiCreate"

export default {
  /* get data items */
  get_items :async function(args: any){
    try {
//console.log(args )
      if(typeof args.apikey =='undefined'){
        throw new Error('Invalid , APIKEY');
      }
      const prisma = new PrismaClient();
      const keys = await prisma.apikey.findMany({
        where: { key: args.apikey},
      });
      if(typeof keys[0] =='undefined'){
        await prisma.$disconnect();
        throw new Error('DB error, apikey nothing');
      }
      const key = keys[0]; 
//console.log(key);
      const content_name = args.content_name;       
      let items: any[] = []; 
      if(typeof args.user_id !== 'undefined'){
        const whereUid ={
          site_id: args.site_id, name: args.content_name ,
          user_id: args.user_id
        }
        //do
      }else{
        const where ={
          site_id: args.site_id, name: args.content_name
        }
        items = await prisma.content.findMany({
          where: { siteId: key.siteId, name: content_name},
        });        
      }      
      items = LibApiFind.convert_values(items) 
//console.log( items )
      await prisma.$disconnect();
      return items
    } catch (err) {
      console.error(err);
      throw new Error('Error , get_items');
    }          
  },    
  /* get one record */
  get_item :async function(id: number){
    try {
      const prisma = new PrismaClient() ;
      let item = await prisma.content.findUnique({
        where: { id: id },
      });
//console.log( item )
      item = LibApiFind.convertItemOne(item)
      await prisma.$disconnect();      
      return item;
    } catch (err) {
      throw new Error('Error , get_item');
    }          
  },
  /* count data */
  get_count :async function(args: any){
    try {
// console.log( args )            
      const content_name = args.content_name;
      if(typeof args.apikey =='undefined'){
        throw new Error('Invalid , APIKEY');
      }
      const prisma = new PrismaClient();
      const keys = await prisma.apikey.findMany({
        where: { key: args.apikey},
      });
      if(typeof keys[0] =='undefined'){
        await prisma.$disconnect();
        throw new Error('DB error, apikey nothing');
      }
      const key = keys[0]; 
//console.log(key); 
      const count = await prisma.content.count({
        where: { siteId: key.siteId, name: content_name},
      });
      await prisma.$disconnect();     
      return count
    } catch (err) {
        throw new Error('Error , get_items');
    }          
  },
  /* add data */
  add_item :async function(args: any){
    try {
//console.log(args);
      const content_name = args.content_name;
      if(typeof args.apikey =='undefined'){
        throw new Error('Invalid , APIKEY');
      }
      const prisma = new PrismaClient();
      const keys = await prisma.apikey.findMany({
        where: { key: args.apikey},
      });
      if(typeof keys[0] =='undefined'){
        await prisma.$disconnect();
        throw new Error('DB error, apikey nothing');
      }
      const key = keys[0]; 
//console.log(key);
      const columns = await prisma.column.findMany({
        where: { siteId: key.siteId, name: content_name },
      }); 
      const column = columns[0];
      const coluValues = JSON.parse(column.values || '[]');
//console.log(coluValues);
      let values = JSON.parse(args.values || '[]')
      const newData = LibApiCreate.valid_post(values, coluValues);
//      console.log(newData);
      const result:any = await prisma.content.create({
        data: {
          name: content_name,
          columnId: column.id,
          siteId: key.siteId,
          values: JSON.stringify(newData),
          userId: args.user_id,
        }
      });
      await prisma.$disconnect();
      return result
    } catch (err) {
      throw new Error('Error , add_item');
    }          
  },
  /* update data */
  update_item :async function(args: any){
    try {
//console.log(args);
      const content_name = args.content_name;
      const id = args.id
      if(typeof id =='undefined'){
        throw new Error('Invalid , id');
      }
      const prisma = new PrismaClient();
      const keys = await prisma.apikey.findMany({
        where: { key: args.apikey},
      });
      if(typeof keys[0] =='undefined'){
        await prisma.$disconnect();
        throw new Error('DB error, apikey nothing');
      }
      const key = keys[0]; 
//console.log(key);
      const columns = await prisma.column.findMany({
        where: { siteId: key.siteId, name: content_name },
      }); 
      const column = columns[0];
      const coluValues = JSON.parse(column.values || '[]');
      let values = JSON.parse(args.values || '[]')
      const newData = LibApiCreate.valid_post(values, coluValues);      
//console.log( newData );
      const itemOne = await prisma.content.update({
        where: { id: id},
        data: { 
          values: JSON.stringify(newData),
        },
      });
      await prisma.$disconnect();
      return itemOne;
    } catch (err) {
      throw new Error('Error , update_item');
    }          
  },
  /* delete data */
  delete_item :async function(args: any){
    try {
      const id = args.id
      if(typeof id =='undefined'){
        throw new Error('Invalid , id');
      }       
      const prisma = new PrismaClient();
      const keys = await prisma.apikey.findMany({
        where: { key: args.apikey},
      });
      if(typeof keys[0] =='undefined'){
        await prisma.$disconnect();
        throw new Error('DB error, apikey nothing');
      }
      const key = keys[0]; 
//console.log(key);
      const result = await prisma.content.delete({
        where: { id: id },
      });
      await prisma.$disconnect();
      return args;
    } catch (err) {
      throw new Error('Error , delete_item');
    }          
  },  

}
