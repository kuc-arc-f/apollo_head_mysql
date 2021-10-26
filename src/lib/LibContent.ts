const { PrismaClient } = require('@prisma/client');

//import LibCommon from "../lib/LibCommon"
import LibApiFind from "./LibApiFind"
import LibApiCreate from "./LibApiCreate"

export default {
  /* get apikey data */
  getApikey :async function(apikey: string){
    try{
      const prisma = new PrismaClient();
      const keys = await prisma.apikey.findMany({
        where: { key: apikey},
      });
      if(typeof keys[0] =='undefined'){
        await prisma.$disconnect();
        throw new Error('DB error, apikey nothing');
      }
      const key = keys[0];
      await prisma.$disconnect();
      return key; 
//console.log(key);      
    } catch (e) {
      console.error(e);
      throw new Error('Error , getApikey');
    }
  },
  /* get data items */
  get_items :async function(args: any){
    try {
//console.log(args )
      if(typeof args.apikey =='undefined'){
        throw new Error('Invalid , APIKEY');
      }
      const key = await this.getApikey(args.apikey);
//console.log(key);
      const prisma = new PrismaClient();
      const content_name = args.content_name;       
      let items: any[] = await prisma.content.findMany({
        where: { siteId: key.siteId, name: content_name},
        orderBy: [
          { id: 'desc', },
        ],
      });        
      items = LibApiFind.convert_values(items) 
//console.log( items )
      await prisma.$disconnect();
      return items
    } catch (err) {
      console.error(err);
      throw new Error('Error , get_items');
    }          
  }, 
  /* get item, user_id select*/ 
  getItemsUid :async function(args: any){
    try {
//console.log(args )
      if(typeof args.apikey =='undefined'){
        throw new Error('nothing , APIKEY');
      }
      if(typeof args.user_id === 'undefined'){
        throw new Error('nothing , user_id');
      }
      const key = await this.getApikey(args.apikey);
//console.log(key);
      const prisma = new PrismaClient();
      const content_name = args.content_name;       
      let items: any[] = await prisma.content.findMany({
        where: {
          siteId: key.siteId, name: content_name, userId: args.user_id,
        },
        orderBy: [
          { id: 'desc', },
        ],        
      });
      items = LibApiFind.convert_values(items) 
//console.log( items )
      await prisma.$disconnect();
      return items
    } catch (err) {
      console.error(err);
      throw new Error('Error , getItemsUid');
    }          
  },
  /* get items, page select */
  getItemsPage :async function(args: any){
    try {
//console.log(args )
      if(typeof args.apikey =='undefined'){
        throw new Error('Invalid , APIKEY');
      }
      if(typeof args.skip =='undefined'){
        throw new Error('Nothing, skip');
      }
      if(typeof args.take =='undefined'){
        throw new Error('Nothing, take');
      }            
      const key = await this.getApikey(args.apikey);
//console.log(key);
      const prisma = new PrismaClient();
      const content_name = args.content_name;       
      let items: any[] = await prisma.content.findMany({
        where: { siteId: key.siteId, name: content_name},
        orderBy: [
          { id: 'desc', },
        ],
        skip: args.skip,
        take: args.take,
      });        
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
      console.error(err);
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
      const key = await this.getApikey(args.apikey);
      const prisma = new PrismaClient();
      const count = await prisma.content.count({
        where: { siteId: key.siteId, name: content_name},
      });
      await prisma.$disconnect();     
      return count
    } catch (err) {
      console.error(err);
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
      const key = await this.getApikey(args.apikey);
      const prisma = new PrismaClient();
      const columns = await prisma.column.findMany({
        where: { siteId: key.siteId, name: content_name },
      }); 
      const column = columns[0];
      const coluValues = JSON.parse(column.values || '[]');
      let values = args.values.replace(/'/g , '"')
//console.log(values);
      values = JSON.parse(values || '[]');
      const newData = LibApiCreate.valid_post(values, coluValues);
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
      console.error(err);
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
      const key = await this.getApikey(args.apikey);
      const prisma = new PrismaClient();
      const columns = await prisma.column.findMany({
        where: { siteId: key.siteId, name: content_name },
      }); 
      const column = columns[0];
      const coluValues = JSON.parse(column.values || '[]');
      let values = args.values.replace(/'/g , '"');
      values = JSON.parse(values || '[]')
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
      console.error(err);
      throw new Error('Error , update_item');
    }          
  },
  /* delete data */
  delete_item :async function(args: any){
    try {
      const id = args.id
      if(typeof id === 'undefined'){
        throw new Error('Invalid , id');
      }       
      const key = await this.getApikey(args.apikey);
      const prisma = new PrismaClient();
      const result = await prisma.content.delete({
        where: { id: id },
      });
      await prisma.$disconnect();
      return args;
    } catch (err) {
      console.error(err);
      throw new Error('Error , delete_item');
    }          
  },  

}
