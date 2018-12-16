import File_Crawler from './src/File_Crawler';

 var kek = new File_Crawler({
  url:'https://www.newgrounds.com/',
  directory:'art',
  query:'https://art.ngfiles.com/thumbnails',
  query_type:'img_src',
  count:1,
});
