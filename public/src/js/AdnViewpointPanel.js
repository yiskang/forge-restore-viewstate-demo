//
// Copyright (c) Autodesk, Inc. All rights reserved
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
//
// Forge AU Sample
// by Eason Kang - Autodesk Developer Network (ADN)
//

'use strict';

(function() {
  function getServerUrl() {
    return document.location.protocol + '//' + document.location.host;
  }

  class AdnViewpointPanel extends Autodesk.Viewing.UI.DockingPanel {
    constructor( viewer, title, options ) {
      options = options || {};

      //  Height adjustment for scroll container, offset to height of the title bar and footer by default.
      if( !options.heightAdjustment )
        options.heightAdjustment = 70;

      if( !options.marginTop )
        options.marginTop = 0;

      super( viewer.container, viewer.container.id + 'AdnViewpointPanel', title, options );

      this.container.classList.add( 'adn-docking-panel' );
      this.container.classList.add( 'adn-viewpoint-panel' );
      this.createScrollContainer( options );

      this.viewer = viewer;
      this.options = options;
      this.uiCreated = false;
      this.isDirty = false;

      this.addVisibilityListener(( show ) => {
        if( !show ) return;

        if( !this.uiCreated )
          this.createUI();

        this.refreshViewpointTable();
      });

      this.onButtonClicked = this.onButtonClicked.bind( this );
    }

    async getRemoteLevels() {
      const aecData =  await Autodesk.Viewing.Document.getAecModelData( this.viewer.model.getDocumentNode() );
      if( !aecData.levels ) return null;
      
      const levels = aecData.levels;
      levels.sort( ( a, b ) => b.elevation - a.elevation );
      return levels;
    }

    createUI() {
      this.uiCreated = true;
      this.isDirty = true;

      const tableDiv = document.createElement( 'div' );
      tableDiv.className = 'adn-viewpoint-panel-table-div';
      this.scrollContainer.appendChild( tableDiv );

      const table = document.createElement( 'table' );
      table.id = 'adn-viewpoint-panel-table';
      table.className = 'adsk-lmv-tftable adn-viewpoint-panel-table';
      tableDiv.appendChild( table );

      const tbody = document.createElement( 'tbody' );
      table.appendChild( tbody );

      const viewpointRow = tbody.insertRow( -1 );
      const viewpointCell = viewpointRow.insertCell( 0 );
      this.contentCell = viewpointCell;

      const buttonRow = tbody.insertRow( -1 );
      const buttonCell = buttonRow.insertCell( 0 );

      const saveViewpointButton = document.createElement( 'button' );
      saveViewpointButton.type = 'button';
      saveViewpointButton.textContent = 'Save VP';
      buttonCell.appendChild( saveViewpointButton );

      saveViewpointButton.addEventListener(
        'click',
        this.onButtonClicked
      );

      this.refreshViewpointTable();
      this.resizeToContent();
    }

    refreshViewpointTable() {
      if( !this.contentCell || !this.isDirty )
        return;

      const viewpointCell = this.contentCell;
      while( viewpointCell.firstChild )
        viewpointCell.removeChild( viewpointCell.firstChild );

      const srvUrl = getServerUrl();
      const viewer = this.viewer;
      fetch( `${ srvUrl }/api/views`, {
        method: 'get',
        headers: new Headers({
          'Content-Type': 'application/json'
        })
      })
        .then( ( response ) => {
          if( response.status === 200 || response.status === 201 ) {
            return response.json();
          } else {
            return console.error( new Error( response.statusText ) );
          }
        })
        .then( ( data ) => {
          if( !data ) return console.error( new Error( 'Failed to retrieve the new viewpoint to the server' ) );

          console.log( data );

          for( let i=0; i < data.length; i++ ) {
            const vp = data[i];
            const vpItemDiv = document.createElement( 'div' );
            viewpointCell.appendChild( vpItemDiv );

            const vpItem = document.createElement( 'a' );
            vpItem.href = '#';
            vpItem.textContent = vp.name;
            vpItemDiv.appendChild( vpItem );

            vpItem.addEventListener(
              'click',
              ( e ) => {
                e.preventDefault();
                viewer.restoreState( { viewport: vp }, null, true );
              });
          }
        })
        .catch( ( error ) => console.error( new Error( error ) ) );

      this.isDirty = false;
    }

    onButtonClicked() {
      this.isDirty = true;
      const srvUrl = getServerUrl();
      const viewer = this.viewer;
      const currentState = viewer.getState({ viewport: true });
      const currentView = currentState.viewport;
      const viewpointCell = this.contentCell;
      const childrenCount = viewpointCell.children.length;
      currentView.name = `View ${ childrenCount + 1 }`;

      fetch( `${ srvUrl }/api/views`, {
        method: 'post',
        body: JSON.stringify( currentView ),
        headers: new Headers({
          'Content-Type': 'application/json'
        })
      })
        .then( ( response ) => {
          if( response.status === 200 || response.status === 201 ) {
            return response.json();
          } else {
            return console.error( new Error( response.statusText ) );
          }
        })
        .then( ( data ) => {
          if( !data ) return console.error( new Error( 'Failed to push the new viewpoint to the server' ) );

          console.log( data );

          this.refreshViewpointTable();
        })
        .catch( ( error ) => console.error( new Error( error ) ) );
    }
  }

  class AdnViewpointPanelExtension extends Autodesk.Viewing.Extension {
    constructor( viewer, options ) {
      super( viewer, options );

      this.panel = null;
      this.createUI = this.createUI.bind( this );
      this.onToolbarCreated = this.onToolbarCreated.bind( this );
    }

    onToolbarCreated() {
      this.createUI();
    }

    createUI() {
      const viewer = this.viewer;

      const vpPanel = new AdnViewpointPanel( viewer, 'Viewpoints' );

      viewer.addPanel( vpPanel );
      this.panel = vpPanel;

      const vpPanelButton = new Autodesk.Viewing.UI.Button( 'toolbar-adnViewpointTool' );
      vpPanelButton.setToolTip( 'Saved Viewpoints' );
      vpPanelButton.setIcon( 'adsk-icon-properties' );
      vpPanelButton.onClick = function() {
        vpPanel.setVisible( !vpPanel.isVisible() );
      };

      const subToolbar = new Autodesk.Viewing.UI.ControlGroup( 'toolbar-adn-tools' );
      subToolbar.addControl( vpPanelButton );
      subToolbar.adnVpPanelButton = vpPanelButton;
      this.subToolbar = subToolbar;

      viewer.toolbar.addControl( this.subToolbar );

      vpPanel.addVisibilityListener(function( visible ) {
        if( visible )
          viewer.onPanelVisible( vpPanel, viewer );

        vpPanelButton.setState( visible ? Autodesk.Viewing.UI.Button.State.ACTIVE : Autodesk.Viewing.UI.Button.State.INACTIVE );
      });
    }

    load() {
      if( this.viewer.toolbar ) {
        // Toolbar is already available, create the UI
        this.createUI();
      }

      return true;
    }

    unload() {
      if( this.panel ) {
        this.panel.uninitialize();
        delete this.panel;
        this.panel = null;
      }

      if( this.subToolbar ) {
        this.viewer.toolbar.removeControl( this.subToolbar );
        delete this.subToolbar;
        this.subToolbar = null;
      }

      return true;
    }
  }

  Autodesk.Viewing.theExtensionManager.registerExtension( 'Autodesk.ADN.ViewpointPanelButton', AdnViewpointPanelExtension );
})();