import * as Request from 'request';
import * as Jsdom from 'jsdom';
import * as Promise from 'promise';

interface Config {
  url:string; // url to scrape
  directory:string; // subdirectory for the url
  file_pattern:string; // matching pattern for the images which are returned from the request
  query_type:string; // select for the DOM object ( img_src, regex )
  count:number; // number of images wich are returned
}

export default class File_Crawler
{
    // container for the returned image list
    private image_source_list:string[] = [];

    constructor( private config:Config ){};

    //Initilize the async request
    public init():any
    {
      let _ = this;

      return new Promise((resolve, reject) => {

        new Request( _.config.url + _.config.directory, function( error, response, body ) {

          if( error === null && ( response && response.statusCode == 200 ) ) {
            _.parse( body );
            resolve();

          } else {
             throw new Error( '[!] Could not retrive url: ' + error );
             reject();

          }
        });
      });
    }

    // search for all images which fits the file pattern
    private parse( body:string ):void
    {
      let HTML_document = new Jsdom.JSDOM( body );

      switch( this.config.query_type )
      {
        case 'img_src':
          let HTML_images_elements = HTML_document.window.document.querySelectorAll("img");

          for( let i = 0; i < HTML_images_elements.length; i++ ) {
              // validate
              if( this.validate( HTML_images_elements[i].src ) ){
                  // add to list
                  this.image_source_list.push( HTML_images_elements[i].src );
              }
          }

          break;
        //// TODO:  add regex functionality
        case 'regex':
          break;
      }
    }

    // validate the strings
    private validate( url:any ):string|boolean
    {
      if( !this.config.file_pattern ){
        return url;
      }

      switch( this.config.query_type )
      {
        case 'img_src':
          return url.includes( this.config.file_pattern ) ? url : false;
          break;

        case 'regex':
          return false;
          break;
      }
    }

    // return the requested image/s by count
    public output():string[]
    {
      if( this.image_source_list ){
        if(this.image_source_list.length < this.config.count ){
            return this.image_source_list;
        } else {
            return this.image_source_list.slice(0, this.config.count);
        }
      } else {
        throw new Error( '[!] Could not recive anything' );
      }
    }
}
