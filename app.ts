import File_Crawler from './src/File_Crawler';

// example for initilizing the file crawler
var file_crawler = new File_Crawler({
  url:'https://example.com/',
  directory:'',
  file_pattern:'//thumb.example.com',
  query_type:'img_src',
  count:1,
});

// output will be returned from output() method
file_crawler.init().then(
  () => { console.log( file_crawler.output() ) }
);
