import * as Request from 'request';
import * as Jsdom from 'jsdom';
import * as Promise from 'promise';

interface Config {
  url:string;
  directory:string;
  file_pattern:string;
  query_type:string;
  count:number;
}

export default class File_Crawler
{
    private image_source_list:string[] = [];

    constructor( private config:Config ){};

    /**
      * request the url content
      * @param url
      */
    public init(): any
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

    // search for all images wich fits the query pattern
    private parse( body:string )
    {
      let HTML_document = new Jsdom.JSDOM( body );

      switch( this.config.query_type )
      {
        case 'img_src':
          let HTML_images_elements = HTML_document.window.document.querySelectorAll("img");

          for( let i = 0; i < HTML_images_elements.length; i++ ) {
              // validate
              if( ( !this.config.file_pattern ) || this.validate(HTML_images_elements[i].src ) ){
                  // add to list
                  this.image_source_list.push( HTML_images_elements[i].src );
              }
          }

          break;

        case 'regex':
          break;
      }
    }

    // validate the strings
    private validate( url:any )
    {
      if ( url.includes( this.config.file_pattern ) ) {
        return url;
      } else {
        return false;
      }
    }

    // return the requestet image/s by count
    public output()
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
