import File_Crawler from './src/File_Crawler';

 var file_crawler = new File_Crawler({
  url:'https://www.newgrounds.com/',
  directory:'art',
  file_pattern:'https://art.ngfiles.com/thumbnails',
  query_type:'img_src',
  count:1,
});

file_crawler.init().then(
  () => console.log( file_crawler.output() )
);
