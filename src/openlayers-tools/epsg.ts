/* tslint:disable:max-line-length */
export const epsg: { srid: string; defs: string }[] = [
  {
    srid: 'CRS:84',
    defs: '+proj=longlat +ellps=WGS84 +datum=WGS84 units=degrees+axis=enu +no_defs +title=WGS 84 (long/lat, x/y)',
  },
  {
    srid: 'EPSG:3857',
    defs: '+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0+x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext +no_defs+title=WGS 84 / Pseudo-Mercator (Spherical Web Mercator)',
  },
  {
    srid: 'EPSG:4326',
    defs: '+proj=longlat +ellps=WGS84 +datum=WGS84 units=degrees+axis=neu +no_defs +title=WGS 84 (lat/long, y/x)',
  },
  {
    srid: 'EPSG:25832',
    defs: '+proj=utm +zone=32 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0+units=m +no_defs +title=ETRS89 / UTM zone 32N',
  },
  {
    srid: 'EPSG:900913',
    defs: '+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0+x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext +no_defs+title=Pseudo-Mercator (Google Spherical Web Mercator. Use EPSG:3857)',
  },
];
