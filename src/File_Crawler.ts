import * as Request from 'request';
import * as Jsdom from 'jsdom';
import * as Promise from 'promise';

interface Config {
  url:string;
  directory:string;
  query:string;
  query_type:string;
  count:number;
}

export default class File_Crawler
{
    private image_source_list = [];
    private DOM_body:any;

    constructor( private config:Config )
    {
      let _ = this;

      this.request_source_code( _.config.url + _.config.directory ).then(
        () => _.parse()
      );

    }

    /**
      * request the url content
      * @param url
      */
    private request_source_code( url:string )
    {
      let _ = this;

      return new Promise((resolve, reject) => {

        new Request( url, function( error, response, body ) {
          if( error === null && ( response && response.statusCode == 200 ) ) {
            _.DOM_body = body;
            resolve();

          } else {
             throw new Error( '[!] Could not retrive url: ' + error );
             reject();
          }
        });

      });
    }

    // search for all images wich fits the query pattern
    private parse()
    {
      let HTML_document = new Jsdom.JSDOM(this.DOM_body);

      switch( this.config.query_type )
      {
        case 'img_src':
          let HTML_images_elements = HTML_document.window.document.querySelectorAll("img");

          for( let i = 0; i < HTML_images_elements.length; i++ ) {
              // validate
              if( this.config.query != '' || this.validate(HTML_images_elements[i].src ) ){
                  // add to list
                  this.image_source_list.push( HTML_images_elements[i].src );
              }
          }

          break;

        case 'regex':
          break;
      }

       this.output()
    }

    // validate the strings
    private validate( url:any )
    {
      if ( url.includes( this.config.query ) ) {
        return url;
      } else {
        return false;
      }
    }

    // return the requestet image/s by count
    public output()
    {
      console.log( this.image_source_list );

      if( this.image_source_list ){
        if(this.image_source_list.length < this.config.count ){
            return this.image_source_list;
        } else {
            return this.image_source_list.slice(0, this.config.count);
        }
      }
    }
}
