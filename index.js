/////////////////////////////////////////////////////////////////////
// Copyright (c) Autodesk, Inc. All rights reserved
// Written by Forge Partner Development
//
// Permission to use, copy, modify, and distribute this software in
// object code form for any purpose and without fee is hereby granted,
// provided that the above copyright notice appears in all copies and
// that both that copyright notice and the limited warranty and
// restricted rights notice below appear in all supporting
// documentation.
//
// AUTODESK PROVIDES THIS PROGRAM "AS IS" AND WITH ALL FAULTS.
// AUTODESK SPECIFICALLY DISCLAIMS ANY IMPLIED WARRANTY OF
// MERCHANTABILITY OR FITNESS FOR A PARTICULAR USE.  AUTODESK, INC.
// DOES NOT WARRANT THAT THE OPERATION OF THE PROGRAM WILL BE
// UNINTERRUPTED OR ERROR FREE.
/////////////////////////////////////////////////////////////////////

const jsonServer = require( 'json-server' );
const path = require( 'path' );
const routes = require( './routes.json' );
const config = require( './config' );

const dbFile = path.join( __dirname, 'db.json' );

const server = jsonServer.create();
const foreignKeySuffix = '_id';
const router = jsonServer.router( dbFile , { foreignKeySuffix } );

const defaultsOpts = {
  static: path.join( process.cwd(), './public' ),
  bodyParser: true
};
const middleware = jsonServer.defaults( defaultsOpts );
const rewriter = jsonServer.rewriter( routes );

server.use( middleware );
server.use( '/api/forge/oauth', require( './routes/oauth' ) );
server.use(( err, req, res, next ) => {
  if( !err ) {
    next();
  } else {
    console.error( err );
    res.status( 401 ).json( err );
  }
});

server.use( rewriter );
server.use( router );

server.listen( config.port, () => {
  console.log( 'JSON server running on port %d', config.port );
});